"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { postRequest, getRequest } from "@/utils/api";
import { usePermissions, PermissionGuard } from "@/utils/permissions";
import { safeLocalStorage } from "@/utils/localStorage";
import { useI18n } from "@/i18n/context";
import DynamicForm, { FormField } from "@/components/forms/DynamicForm";

// Constants
const INDUSTRY_OPTIONS = [
  "Technology",
  "Manufacturing",
  "Automotive",
  "Information Technology",
  "Electronics",
  "Agriculture",
  "Energy",
  "Natural Resources",
  "Luxury Goods",
  "Finance",
  "Consumer Electronics",
  "Oil & Gas",
  "Automotive Manufacturing",
  "Palm Oil",
  "Fashion",
  "Textiles",
  "Apparel",
  "Mining", // Appears twice intentionally (common in different countries)
  "Agribusiness"
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
  "USD",
  "EUR",
  "GBP",
  "INR",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "JPY",
  "KRW",
  "MXN",
  "NZD",
  "RUB",
  "SAR",
  "ZAR",
  "TRY",
  "BRL",
  "CLP",
  "COP",
  "HKD",
  "IDR",
  "MYR",
  "PHP",
  "SGD",
  "THB",
  "TWD",
  "VND",
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
    start: string;
    end: string;
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
    start: string;
    end: string;
  };
  primaryFunctionalCurrency: string;
  numberOfEmployees: string;
  secondaryFunctionalCurrency: string;
  annualRevenue: string;
  internationalBusinessTraveling: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddBoundarySectionProps {
  onComplete?: (data?: any) => void;
}

const AddBoundarySection = ({ onComplete }: AddBoundarySectionProps) => {
  const { t } = useI18n();
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
  const { canView, canCreate, canUpdate, canDelete, arePermissionsReady, waitForPermissions } = usePermissions();

  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push("/login");
  }

  // Check if user has permission to view boundaries
  // For the setup flow, we'll be more lenient and allow access if permissions aren't loaded yet
  const hasBoundaryPermission = canView("boundaries");
  const permissionsReady = arePermissionsReady();
  
  // Show loading while permissions are being checked
  if (!permissionsReady && !onComplete) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D5942] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }
  
  // If this is the setup flow and permissions aren't ready yet, show a friendly message
  if (!permissionsReady && onComplete) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Setting Up Your Organization</h3>
        <p className="text-gray-600 mb-4">Welcome! We're preparing your boundary setup form.</p>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0D5942] mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading setup components...</p>
      </div>
    );
  }
  
  if (!hasBoundaryPermission) {
    // Check if this is a setup flow (onComplete prop is provided)
    if (onComplete) {
      // In setup flow, allow access even without explicit permissions
      // This prevents blocking new users from setting up their organization
      console.log("Setup flow detected - allowing boundary access for organization setup");
    } else {
      // In regular flow, require permissions
      return (
        <div className="p-8 text-center text-gray-500">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Permission Required</h3>
          <p className="text-gray-600 mb-4">You don't have permission to view boundaries.</p>
          <p className="text-sm text-gray-500">Please contact your administrator to get the necessary permissions.</p>
        </div>
      );
    }
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
      start: "",
      end: "",
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
      return "";
    }
  }

  // Check if boundary exists on component mount
  useEffect(() => {
    checkExistingBoundary();
  }, []);

  // Wait for permissions to be available in setup flow
  useEffect(() => {
    if (onComplete && !arePermissionsReady()) {
      waitForPermissions(3000).then((permissionsLoaded) => {
        if (permissionsLoaded) {
          // Permissions are now available, we can proceed
          console.log("Permissions loaded successfully");
        }
      });
    }
  }, [onComplete, arePermissionsReady, waitForPermissions]);

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log('showForm state changed to:', showForm);
    console.log('editingBoundary state changed to:', editingBoundary);
  }, [showForm, editingBoundary]);

  // Ensure form data is properly initialized when form is shown
  useEffect(() => {
    if (showForm && !editingBoundary) {
      console.log('Form shown, initializing form data');
      const initialData = {
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
          start: "",
          end: "",
        },
        primaryFunctionalCurrency: "",
        numberOfEmployees: "",
        secondaryFunctionalCurrency: "",
        annualRevenue: "",
        internationalBusinessTraveling: false,
      };
      console.log('Setting initial form data:', initialData);
      setFormData(initialData);
    }
  }, [showForm, editingBoundary]);

  const checkExistingBoundary = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(safeLocalStorage.getItem("user") || "{}");

      if (userData.boundary && userData.boundary!='undefined') {
        const boundary = safeLocalStorage.getItem("boundary");
        if(boundary){
          setBoundaryData(JSON.parse(boundary));
          return;
        }
        // Fetch boundary details
        const response = await getRequest(
          `boundaries/getBoundaries`,
          tokenData.accessToken
        );

        if (response.success) {
          if(response.data.boundaries.length>0){
            safeLocalStorage.setItem("boundary", JSON.stringify({}));
            setBoundaryData(response.data.boundaries[0]);
            safeLocalStorage.setItem("boundary", JSON.stringify(response.data.boundaries[0]));
          }
        }
      }
    } catch (error: any) {
      return;
    } finally {
      setLoading(false);
    }
  };

  const validateForm = useCallback((data: BoundaryFormData): boolean => {
    console.log('Validating form data:', data);
    
    if (!data.industry || data.industry === "Industry") {
      console.log('Industry validation failed:', data.industry);
      return false;
    }

    if (!data.businessNature || data.businessNature === "") {
      console.log('Business nature validation failed:', data.businessNature);
      return false;
    }

    if (!data.baselineYear) {
      console.log('Baseline year validation failed:', data.baselineYear);
      return false;
    }

    console.log('Form validation passed');
    return true;
  }, []);

  const resetForm = () => {
    console.log('resetForm called');
    const initialFormData = {
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
        start: "",
        end: "",
      },
      primaryFunctionalCurrency: "",
      numberOfEmployees: "",
      secondaryFunctionalCurrency: "",
      annualRevenue: "",
      internationalBusinessTraveling: false,
    };
    console.log('Setting form data to:', initialFormData);
    setFormData(initialFormData);
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
    console.log('startEdit called with boundary:', boundary);
    setEditingBoundary(boundary);

    // Format dates for form inputs (YYYY-MM-DD format)
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };

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
      businessFormationDate: formatDateForInput(boundary.businessFormationDate),
      reportingPeriodStartDate: formatDateForInput(
        boundary.reportingPeriod.start
      ),
      reportingPeriodEndDate: formatDateForInput(boundary.reportingPeriod.end),
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

  // Define form fields for DynamicForm with translations
  const boundaryFormFields: FormField[] = [
    {
      name: "industry",
      label: t('boundary.industry'),
      type: "select",
      required: true,
      options: INDUSTRY_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
    },
    {
      name: "businessNature",
      label: t('boundary.businessNature'),
      type: "select",
      required: true,
      options: BUSINESS_NATURE_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
    },
    {
      name: "baselineYear",
      label: t('boundary.baselineYear'),
      type: "select",
      required: true,
      options: PAST_YEARS.map((year) => ({ value: year, label: year })),
    },
    {
      name: "hasBaselineEmissions",
      label: t('boundary.doYouHaveBaselineEmissions'),
      type: "select",
      required: true,
      options: YES_NO_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
    },
    {
      name: "baselineEmissions",
      label: t('boundary.baselineEmissions'),
      type: "number",
      required: false,
      placeholder: t('boundary.enterBaselineEmissions'),
      condition: (formData) => formData.hasBaselineEmissions === "Yes",
    },
    {
      name: "hasVehicles",
      label: t('boundary.doYouHaveVehicles'),
      type: "select",
      required: true,
      options: YES_NO_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
    },
    {
      name: "vehicleCount",
      label: t('boundary.vehicleCount'),
      type: "number",
      required: true,
      placeholder: t('boundary.enterVehicleCount'),
      condition: (formData) => formData.hasVehicles === "Yes",
    },
    {
      name: "hasFacilities",
      label: t('boundary.doYouHaveFacilities'),
      type: "select",
      required: true,
      options: YES_NO_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
    },
    {
      name: "facilityCount",
      label: t('boundary.facilityCount'),
      type: "number",
      required: true,
      placeholder: t('boundary.enterFacilityCount'),
      condition: (formData) => formData.hasFacilities === "Yes",
    },
    {
      name: "hasEquipment",
      label: t('boundary.doYouHaveEquipment'),
      type: "select",
      required: true,
      options: YES_NO_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
    },
    {
      name: "equipmentCount",
      label: t('boundary.equipmentCount'),
      type: "number",
      required: true,
      placeholder: t('boundary.enterEquipmentCount'),
      condition: (formData) => formData.hasEquipment === "Yes",
    },
    {
      name: "businessFormationDate",
      label: t('boundary.businessFormationDate'),
      type: "date",
      required: true,
    },
    {
      name: "reportingPeriodStartDate",
      label: t('boundary.reportingPeriodStartDate'),
      type: "date",
      required: true,
    },
    {
      name: "primaryFunctionalCurrency",
      label: t('boundary.primaryFunctionalCurrency'),
      type: "select",
      required: true,
      options: CURRENCY_OPTIONS.map((currency) => ({
        value: currency,
        label: currency,
      })),
    },
    {
      name: "numberOfEmployees",
      label: t('boundary.numberOfEmployees'),
      type: "select",
      required: true,
      options: NUMBER_OF_EMPLOYEES_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
    },
    {
      name: "secondaryFunctionalCurrency",
      label: t('boundary.secondaryFunctionalCurrency'),
      type: "select",
      required: false,
      options: CURRENCY_OPTIONS.map((currency) => ({
        value: currency,
        label: currency,
      })),
    },
    {
      name: "annualRevenue",
      label: t('boundary.annualRevenue'),
      type: "select",
      required: true,
      options: ANNUAL_REVENUE_OPTIONS.map((option) => ({
        value: option,
        label: option,
      })),
    },
  ];

  const handleFormSubmit = async (data: any) => {
    try {
      console.log('handleFormSubmit function called with data:', data);
      
      if (!validateForm(data)) {
        console.log('Form validation failed');
        toast.error("Please fill in all required fields");
        return;
      }
      
      console.log('Form validation passed, proceeding with submission');
      setSubmitting(true);

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
            baselineEmissions:
              data.hasBaselineEmissions === "Yes"
                ? data.baselineEmissions || 0
                : 0,
            vehicleCount:
              data.hasVehicles === "Yes" ? parseInt(data.vehicleCount) || 0 : 0,
            facilityCount:
              data.hasFacilities === "Yes"
                ? parseInt(data.facilityCount) || 0
                : 0,
            equipmentCount:
              data.hasEquipment === "Yes"
                ? parseInt(data.equipmentCount) || 0
                : 0,
          },
          "Boundary updated successfully",
          tokenData.accessToken,
          "put"
        );

        if (response?.success) {
          const boundary = safeLocalStorage.getItem("boundary");
          if(boundary){
            let boundaryData = JSON.parse(boundary) || {};
            boundaryData = response.boundary;
            safeLocalStorage.setItem("boundary", JSON.stringify(boundaryData));
          }
          toast.success("Boundary updated successfully");
          setBoundaryData(response.boundary);
          setEditingBoundary(null);
          setShowForm(false);
          checkExistingBoundary(); // Refresh the boundary data
        } else {
            return;
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
            baselineEmissions:
              data.hasBaselineEmissions === "Yes"
                ? data.baselineEmissions || 0
                : 0,
            vehicleCount:
              data.hasVehicles === "Yes" ? parseInt(data.vehicleCount) || 0 : 0,
            facilityCount:
              data.hasFacilities === "Yes"
                ? parseInt(data.facilityCount) || 0
                : 0,
            equipmentCount:
              data.hasEquipment === "Yes"
                ? parseInt(data.equipmentCount) || 0
                : 0,
            businessFormationDate: new Date(data.businessFormationDate),
            reportingPeriod: {
              start: data.reportingPeriodStartDate,
              end: new Date(),
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
         console.log(response, 'response received from add boundary')
          toast.success(response.message || "Boundary created successfully");
          const userData = safeLocalStorage.getItem("user");
          const userDataParsed = JSON.parse(userData || "{}");
          userDataParsed.boundary = response.boundary._id;
          safeLocalStorage.setItem("user", JSON.stringify(userDataParsed));
          safeLocalStorage.setItem("boundary", JSON.stringify(response.boundary))
          setShowForm(false);
                  // Call onComplete callback if provided (for steps page)
        if (onComplete) {
          await onComplete(response.boundary);
        } else {
            // Stay on the current page to allow follow-up steps instead of forcing navigation
          }
        } else {
          return;
        }
      }
    } catch (error) {
      return;
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // If boundary exists, show card instead of form
  if (boundaryData && !showForm) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {t('boundary.boundaryManagement')}
          </h1>
        </div>

        {/* Existing Boundary Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {t('boundary.existingBoundary')}
            </h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg">
                {t('boundary.active')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('boundary.industry')}
              </h3>
              <p className="text-sm text-gray-900">{boundaryData.industry}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('boundary.businessNature')}
              </h3>
              <p className="text-sm text-gray-900">
                {boundaryData.businessNature}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('boundary.baselineYear')}
              </h3>
              <p className="text-sm text-gray-900">
                {boundaryData.baselineYear}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('boundary.primaryCurrency')}
              </h3>
              <p className="text-sm text-gray-900">
                {boundaryData.primaryFunctionalCurrency}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('boundary.numberOfEmployees')}
              </h3>
              <p className="text-sm text-gray-900">
                {boundaryData.numberOfEmployees}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('boundary.annualRevenue')}
              </h3>
              <p className="text-sm text-gray-900">
                {boundaryData.annualRevenue}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('boundary.businessFormationDate')}
              </h3>
              <p className="text-sm text-gray-900">
                {formatDate(boundaryData.businessFormationDate)}
              </p>
            </div>
            {/* <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>Reporting Period</h3>
              <p className='text-sm text-gray-900'>
                {formatDate(boundaryData.reportingPeriod.startDate)} - {formatDate(boundaryData.reportingPeriod.endDate)}
              </p>
            </div> */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('boundary.internationalBusinessTravel')}
              </h3>
              <p className="text-sm text-gray-900">
                {boundaryData.internationalBusinessTraveling ? t('common.yes') : t('common.no')}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              {t('boundary.assetCounts')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">{t('boundary.vehicles')}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {boundaryData.vehicleCount}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">{t('boundary.facilities')}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {boundaryData.facilityCount}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">{t('boundary.equipment')}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {boundaryData.equipmentCount}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {t('boundary.boundaryCreatedMessage')}
              </p>
              {/* <PermissionGuard permission="boundaries.update">
                <button
                  onClick={() => startEdit(boundaryData)}
                  className="bg-[#0D5942] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Boundary
                </button>
              </PermissionGuard> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {t('boundary.boundaryManagement')}
        </h1>
        <PermissionGuard permission="boundaries.create">
          <button
            onClick={() => {
              console.log('Add Boundary button clicked, setting showForm to true');
              setShowForm(true);
            }}
            className="bg-[#0D5942] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t('boundary.addNewBoundary')}
          </button>
        </PermissionGuard>
      </div>

      {/* Form Section */}
      {showForm && (
        <div>
          <DynamicForm
            title={editingBoundary ? t('boundary.editBoundary') : t('boundary.addNewBoundary')}
            fields={boundaryFormFields}
            onSubmit={(data) => {
              console.log('DynamicForm onSubmit called with data:', data);
              console.log('Calling handleFormSubmit...');
              try {
                handleFormSubmit(data);
              } catch (error) {
                console.error('Error calling handleFormSubmit:', error);
                toast.error(t('errors.general'));
              }
            }}
            onCancel={resetForm}
            initialData={formData}
            loading={submitting}
            submitText={editingBoundary ? t('boundary.updateBoundary') : t('boundary.createBoundary')}
            cancelText={t('common.cancel')}
            onClose={resetForm}
            confirmationMessage={
              editingBoundary
                ? t('boundary.doYouWantToUpdate')
                : t('boundary.doYouWantToCreate')
            }
          />
        </div>
      )}

      {/* Empty State */}
      {!showForm && !boundaryData && !loading && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="mt-2 text-gray-600">{t('boundary.noBoundaryFound')}</p>
          {/* <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-[#0D5942] text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Add your first boundary
          </button> */}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <svg
            className="animate-spin h-8 w-8 mx-auto text-[#0D5942]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-gray-600">{t('boundary.loadingBoundaryInfo')}</p>
        </div>
      )}
    </div>
  );
};

export default AddBoundarySection;
