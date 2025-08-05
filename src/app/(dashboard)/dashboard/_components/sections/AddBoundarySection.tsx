"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { postRequest, getRequest } from '@/utils/api';
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import { safeLocalStorage } from '@/utils/localStorage';
import DynamicForm, { FormField } from '@/components/forms/DynamicForm';

// Constants
const INDUSTRY_OPTIONS = [
  "Industry",
  "Textile",
  "Chemical Industries",
  "Tech Industries",
  "Medical Industries",
  "Automobile Industries",
];

const NUMBER_OF_EMPLOYEES_OPTIONS = [
  "1-10",
  "11-50",
  "51-100",
  "101-500",
  "501-1000",
  "1001-5000",
  "5001-10000",
  "10001-50000",
  "50001-100000",
  "100001-500000",
  "500001-1000000",
];

const CURRENCY_OPTIONS = [
  "USD", "EUR", "GBP", "INR", "CAD", "AUD", "CHF", "CNY", "JPY", "KRW",
  "MXN", "NZD", "RUB", "SAR", "ZAR", "TRY", "BRL", "CLP", "COP", "HKD",
  "IDR", "MYR", "PHP", "SGD", "THB", "TWD", "VND",
];

const ANNUAL_REVENUE_OPTIONS = [
  "1-100000",
  "100001-500000",
  "500001-1000000",
  "1000001-5000000",
  "5000001-10000000",
  "10000001-50000000",
  "50000001-100000000",
  "100000001-500000000",
  "500000001-1000000000",
  "1000000001-5000000000",
  "5000000001-10000000000",
];

const BUSINESS_NATURE_OPTIONS = ["Hybrid", "Remote", "Onsite"];
const YES_NO_OPTIONS = ["No", "Yes"];

// Generate past years for dropdown (from current year back to 2 years ago)
const generatePastYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = currentYear; year >= currentYear - 2; year--) {
    years.push(year.toString());
  }
  return years;
};

const PAST_YEARS = generatePastYears();

interface BoundaryFormData {
  organizationId: string;
  industry: string;
  businessNature: string;
  baselineYear: string;
  hasBaselineEmissions: string;
  baselineEmissions?: string;
  hasVehicles: string;
  vehicleCount: number;
  hasFacilities: string;
  facilityCount: number;
  hasEquipment: string;
  equipmentCount: number;
  businessFormationDate: string;
  reportingPeriodStartDate: string;
  reportingPeriodEndDate: string;
  reportingPeriod: {
    startDate: string;
    endDate: string;
  };
  primaryFunctionalCurrency: string;
  numberOfEmployees: string;
  secondaryFunctionalCurrency: string;
  annualRevenue: string;
  internationalBusinessTraveling: boolean;
}

interface Boundary {
  _id: string;
  industry: string;
  businessNature: string;
  baselineYear: string;
  baselineEmissions?: string;
  vehicleCount: number;
  facilityCount: number;
  equipmentCount: number;
  businessFormationDate: string;
  reportingPeriod: {
    startDate: string;
    endDate: string;
  };
  primaryFunctionalCurrency: string;
  numberOfEmployees: string;
  secondaryFunctionalCurrency: string;
  annualRevenue: string;
  internationalBusinessTraveling: boolean;
  createdAt: string;
  updatedAt: string;
}

const AddBoundarySection = () => {
  const [boundaryData, setBoundaryData] = useState<Boundary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBoundary, setEditingBoundary] = useState<Boundary | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState({
    hasVehicles: "",
    hasFacilities: "",
    hasEquipment: "",
    hasBaselineEmissions: "",
  });
  const router = useRouter();
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();
  
  const tokenData = JSON.parse(safeLocalStorage.getItem('tokens') || "{}");
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push('/login');
  }

  // Check if user has permission to view boundaries
  if (!canView('boundaries')) {
    return (
      <div className="p-8 text-center text-gray-500">
        You don't have permission to view boundaries.
      </div>
    );
  }

  const [formData, setFormData] = useState<BoundaryFormData>({
    organizationId: getOrganizationId(),
    industry: "",
    businessNature: "",
    baselineYear: "",
    hasBaselineEmissions: "",
    baselineEmissions: "",
    hasVehicles: "",
    vehicleCount: 0,
    hasFacilities: "",
    facilityCount: 0,
    hasEquipment: "",
    equipmentCount: 0,
    businessFormationDate: "",
    reportingPeriodStartDate: "",
    reportingPeriodEndDate: "",
    reportingPeriod: {
      startDate: "",
      endDate: "",
    },
    primaryFunctionalCurrency: "",
    numberOfEmployees: "",
    secondaryFunctionalCurrency: "",
    annualRevenue: "",
    internationalBusinessTraveling: false,
  });

  // Get organization ID from localStorage with error handling
  function getOrganizationId(): string {
    const user = JSON.parse(safeLocalStorage.getItem("user") || "{}");
    try {
      return user.organization || "";
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return "";
    }
  }

  // Check if boundary exists on component mount
  useEffect(() => {
    checkExistingBoundary();
  }, []);

  const checkExistingBoundary = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(safeLocalStorage.getItem('user') || "{}");
      
      if (userData.boundary) {
        // Fetch boundary details
        const response = await getRequest(
          `boundaries/getBoundaries`,
          tokenData.accessToken
        );
        
        if (response.success) {
          setBoundaryData(response.data.boundaries[0]);
        }
      }
    } catch (error: any) {
      console.error("Error checking existing boundary:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = useCallback((data: BoundaryFormData): boolean => {
    if (!data.industry || data.industry === "Industry") {
      toast.error("Please select a valid industry");
      return false;
    }

    if (!data.businessNature || data.businessNature === "") {
      toast.error("Please select a business nature");
      return false;
    }

    if (!data.baselineYear) {
      toast.error("Please select a baseline year");
      return false;
    }

    return true;
  }, []);

  const resetForm = () => {
    setFormData({
      organizationId: getOrganizationId(),
      industry: "",
      businessNature: "",
      baselineYear: "",
      hasBaselineEmissions: "",
      baselineEmissions: "",
      hasVehicles: "",
      vehicleCount: 0,
      hasFacilities: "",
      facilityCount: 0,
      hasEquipment: "",
      equipmentCount: 0,
      businessFormationDate: "",
      reportingPeriodStartDate: "",
      reportingPeriodEndDate: "",
      reportingPeriod: {
        startDate: "",
        endDate: "",
      },
      primaryFunctionalCurrency: "",
      numberOfEmployees: "",
      secondaryFunctionalCurrency: "",
      annualRevenue: "",
      internationalBusinessTraveling: false,
    });
    setQuestions({
      hasVehicles: "",
      hasFacilities: "",
      hasEquipment: "",
      hasBaselineEmissions: "",
    });
    setShowForm(false);
    setEditingBoundary(null);
  };

  const startEdit = (boundary: Boundary) => {
    setEditingBoundary(boundary);
    setFormData({
      organizationId: getOrganizationId(),
      industry: boundary.industry,
      businessNature: boundary.businessNature,
      baselineYear: boundary.baselineYear,
      hasBaselineEmissions: boundary.baselineEmissions ? "Yes" : "No",
      baselineEmissions: boundary.baselineEmissions || "",
      hasVehicles: boundary.vehicleCount > 0 ? "Yes" : "No",
      vehicleCount: boundary.vehicleCount,
      hasFacilities: boundary.facilityCount > 0 ? "Yes" : "No",
      facilityCount: boundary.facilityCount,
      hasEquipment: boundary.equipmentCount > 0 ? "Yes" : "No",
      equipmentCount: boundary.equipmentCount,
      businessFormationDate: boundary.businessFormationDate,
      reportingPeriodStartDate: boundary.reportingPeriod.startDate,
      reportingPeriodEndDate: boundary.reportingPeriod.endDate,
      reportingPeriod: boundary.reportingPeriod,
      primaryFunctionalCurrency: boundary.primaryFunctionalCurrency,
      numberOfEmployees: boundary.numberOfEmployees,
      secondaryFunctionalCurrency: boundary.secondaryFunctionalCurrency,
      annualRevenue: boundary.annualRevenue,
      internationalBusinessTraveling: boundary.internationalBusinessTraveling,
    });
    setQuestions({
      hasVehicles: boundary.vehicleCount > 0 ? "Yes" : "No",
      hasFacilities: boundary.facilityCount > 0 ? "Yes" : "No",
      hasEquipment: boundary.equipmentCount > 0 ? "Yes" : "No",
      hasBaselineEmissions: boundary.baselineEmissions ? "Yes" : "No",
    });
    setShowForm(true);
  };

  // Define form fields for DynamicForm
  const boundaryFormFields: FormField[] = [
    {
      name: "industry",
      label: "Industry",
      type: "select",
      required: true,
      options: INDUSTRY_OPTIONS.map(option => ({ value: option, label: option }))
    },
    {
      name: "businessNature",
      label: "Business Nature",
      type: "select",
      required: true,
      options: BUSINESS_NATURE_OPTIONS.map(option => ({ value: option, label: option }))
    },
    {
      name: "baselineYear",
      label: "Baseline Year",
      type: "select",
      required: true,
      options: PAST_YEARS.map(year => ({ value: year, label: year }))
    },
    {
      name: "hasBaselineEmissions",
      label: "Do you have baseline emissions data?",
      type: "select",
      required: true,
      options: YES_NO_OPTIONS.map(option => ({ value: option, label: option }))
    },
    {
      name: "baselineEmissions",
      label: "Baseline Emissions",
      type: "number",
      required: false,
      placeholder: "Enter baseline emissions",
      condition: (formData) => formData.hasBaselineEmissions === "Yes"
    },
    {
      name: "hasVehicles",
      label: "Do you have vehicles?",
      type: "select",
      required: true,
      options: YES_NO_OPTIONS.map(option => ({ value: option, label: option }))
    },
    {
      name: "vehicleCount",
      label: "Vehicle Count",
      type: "number",
      required: true,
      placeholder: "Enter vehicle count",
      condition: (formData) => formData.hasVehicles === "Yes"
    },
    {
      name: "hasFacilities",
      label: "Do you have facilities?",
      type: "select",
      required: true,
      options: YES_NO_OPTIONS.map(option => ({ value: option, label: option }))
    },
    {
      name: "facilityCount",
      label: "Facility Count",
      type: "number",
      required: true,
      placeholder: "Enter facility count",
      condition: (formData) => formData.hasFacilities === "Yes"
    },
    {
      name: "hasEquipment",
      label: "Do you have equipment?",
      type: "select",
      required: true,
      options: YES_NO_OPTIONS.map(option => ({ value: option, label: option }))
    },
    {
      name: "equipmentCount",
      label: "Equipment Count",
      type: "number",
      required: true,
      placeholder: "Enter equipment count",
      condition: (formData) => formData.hasEquipment === "Yes"
    },
    {
      name: "businessFormationDate",
      label: "Business Formation Date",
      type: "date",
      required: true
    },
    {
      name: "reportingPeriodStartDate",
      label: "Reporting Period Start Date",
      type: "date",
      required: true
    },
    {
      name: "reportingPeriodEndDate",
      label: "Reporting Period End Date",
      type: "date",
      required: true
    },
    {
      name: "primaryFunctionalCurrency",
      label: "Primary Functional Currency",
      type: "select",
      required: true,
      options: CURRENCY_OPTIONS.map(currency => ({ value: currency, label: currency }))
    },
    {
      name: "numberOfEmployees",
      label: "Number of Employees",
      type: "select",
      required: true,
      options: NUMBER_OF_EMPLOYEES_OPTIONS.map(option => ({ value: option, label: option }))
    },
    {
      name: "secondaryFunctionalCurrency",
      label: "Secondary Functional Currency",
      type: "select",
      required: false,
      options: CURRENCY_OPTIONS.map(currency => ({ value: currency, label: currency }))
    },
    {
      name: "annualRevenue",
      label: "Annual Revenue",
      type: "select",
      required: true,
      options: ANNUAL_REVENUE_OPTIONS.map(option => ({ value: option, label: option }))
    }
  ];

  const handleFormSubmit = async (data: any) => {
    if (!validateForm(data)) {
      return;
    }

    setSubmitting(true);

    try {
      const validBusinessFormationDate =
        Date.now() > new Date(data.businessFormationDate).getTime();
      if (!validBusinessFormationDate) {
        toast.error("Business formation date must be in the past");
        return;
      }

      if (editingBoundary) {
        // Update existing boundary
        const response = await postRequest(
          `boundaries/updateBoundary/${editingBoundary._id}`,
          {
            industry: data.industry,
            businessNature: data.businessNature,
            baselineYear: data.baselineYear,
            baselineEmissions: data.hasBaselineEmissions === "Yes" ? (data.baselineEmissions || 0) : 0,
            vehicleCount: data.hasVehicles === "Yes" ? (parseInt(data.vehicleCount) || 0) : 0,
            facilityCount: data.hasFacilities === "Yes" ? (parseInt(data.facilityCount) || 0) : 0,
            equipmentCount: data.hasEquipment === "Yes" ? (parseInt(data.equipmentCount) || 0) : 0,
          },
          "Boundary updated successfully",
          tokenData.accessToken,
          "put"
        );

        if (response?.success) {
          toast.success("Boundary updated successfully");
          setBoundaryData(response.data.boundary);
          setEditingBoundary(null);
          setShowForm(false);
          checkExistingBoundary(); // Refresh the boundary data
        } else {
          toast.error(response?.message || "Failed to update boundary");
        }
      } else {
        // Create new boundary
        const response = await postRequest(
          "boundaries/addBoundary",
          {
            organizationId: getOrganizationId(),
            industry: data.industry,
            businessNature: data.businessNature,
            baselineYear: data.baselineYear,
            baselineEmissions: data.hasBaselineEmissions === "Yes" ? (data.baselineEmissions || 0) : 0,
            vehicleCount: data.hasVehicles === "Yes" ? (parseInt(data.vehicleCount) || 0) : 0,
            facilityCount: data.hasFacilities === "Yes" ? (parseInt(data.facilityCount) || 0) : 0,
            equipmentCount: data.hasEquipment === "Yes" ? (parseInt(data.equipmentCount) || 0) : 0,
            businessFormationDate: new Date(data.businessFormationDate),
            reportingPeriod: {
              startDate: data.reportingPeriodStartDate,
              endDate: data.reportingPeriodEndDate,
            },
            primaryFunctionalCurrency: data.primaryFunctionalCurrency,
            numberOfEmployees: data.numberOfEmployees,
            secondaryFunctionalCurrency: data.secondaryFunctionalCurrency,
            annualRevenue: data.annualRevenue,
            internationalBusinessTraveling: false,
            baselineEmissionsAvailable: data.hasBaselineEmissions === "Yes",
          },
          "Boundary created successfully",
          tokenData.accessToken,
          "post"
        );

        if (response?.success) {
          toast.success(response.message || "Boundary created successfully");
          const userData = safeLocalStorage.getItem('user');
          const userDataParsed = JSON.parse(userData || "{}");
          userDataParsed.boundary = response.boundary._id;
          safeLocalStorage.setItem('user', JSON.stringify(userDataParsed));
          
          // Redirect to dashboard after successful creation
          router.push("/dashboard");
        } else {
          toast.error(response?.message || "Failed to create boundary");
        }
      }
    } catch (error) {
      console.error("Error handling boundary:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // If boundary exists, show card instead of form
  if (boundaryData && !showForm) {
    return (
      <div className='flex flex-col gap-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-800'>Boundary Management</h1>
        </div>

        {/* Existing Boundary Card */}
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-gray-800'>Existing Boundary</h2>
            <div className='flex items-center gap-2'>
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg'>
                Active
              </span>
            </div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>Industry</h3>
              <p className='text-sm text-gray-900'>{boundaryData.industry}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>Business Nature</h3>
              <p className='text-sm text-gray-900'>{boundaryData.businessNature}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>Baseline Year</h3>
              <p className='text-sm text-gray-900'>{boundaryData.baselineYear}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>Primary Currency</h3>
              <p className='text-sm text-gray-900'>{boundaryData.primaryFunctionalCurrency}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>Number of Employees</h3>
              <p className='text-sm text-gray-900'>{boundaryData.numberOfEmployees}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>Annual Revenue</h3>
              <p className='text-sm text-gray-900'>{boundaryData.annualRevenue}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>Business Formation Date</h3>
              <p className='text-sm text-gray-900'>{formatDate(boundaryData.businessFormationDate)}</p>
            </div>
            {/* <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>Reporting Period</h3>
              <p className='text-sm text-gray-900'>
                {formatDate(boundaryData.reportingPeriod.startDate)} - {formatDate(boundaryData.reportingPeriod.endDate)}
              </p>
            </div> */}
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>International Business Travel</h3>
              <p className='text-sm text-gray-900'>{boundaryData.internationalBusinessTraveling ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className='mt-6 pt-6 border-t border-gray-200'>
            <h3 className='text-sm font-medium text-gray-500 mb-3'>Asset Counts</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-xs text-gray-500'>Vehicles</p>
                <p className='text-lg font-semibold text-gray-900'>{boundaryData.vehicleCount}</p>
              </div>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-xs text-gray-500'>Facilities</p>
                <p className='text-lg font-semibold text-gray-900'>{boundaryData.facilityCount}</p>
              </div>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-xs text-gray-500'>Equipment</p>
                <p className='text-lg font-semibold text-gray-900'>{boundaryData.equipmentCount}</p>
              </div>
            </div>
          </div>

          <div className='mt-6 pt-6 border-t border-gray-200'>
            <div className='flex justify-between items-center'>
              <p className='text-sm text-gray-600'>
                Your boundary has been successfully created. You can now proceed to add your assets (vehicles, facilities, equipment) 
                to start tracking your emissions.
              </p>
              <PermissionGuard permission="boundaries.update">
                <button
                  onClick={() => startEdit(boundaryData)}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2'
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Boundary
                </button>
              </PermissionGuard>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Boundary Management</h1>
        <PermissionGuard permission="boundaries.create">
          <button
            onClick={() => setShowForm(true)}
            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Boundary
          </button>
        </PermissionGuard>
      </div>

      {/* Form Section */}
      {showForm && (
        <DynamicForm
          title={editingBoundary ? 'Edit Boundary' : 'Add New Boundary'}
          fields={boundaryFormFields}
          onSubmit={handleFormSubmit}
          onCancel={resetForm}
          initialData={formData}
          loading={submitting}
          submitText={editingBoundary ? 'Update Boundary' : 'Create Boundary'}
          cancelText="Cancel"
          onClose={resetForm}
          confirmationMessage={editingBoundary ? 'Do you really want to update this boundary?' : 'Do you really want to create this boundary?'}
        />
      )}

      {/* Empty State */}
      {!showForm && !boundaryData && !loading && (
        <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className='mt-2 text-gray-600'>No boundary found</p>
          <button
            onClick={() => setShowForm(true)}
            className='mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200'
          >
            Add your first boundary
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
          <svg className="animate-spin h-8 w-8 mx-auto text-green-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className='mt-2 text-gray-600'>Loading boundary information...</p>
        </div>
      )}
                </div>
  );
};

export default AddBoundarySection;
