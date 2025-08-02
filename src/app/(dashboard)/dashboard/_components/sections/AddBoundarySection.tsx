"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { postRequest, getRequest } from '@/utils/api';
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import { safeLocalStorage } from '@/utils/localStorage';

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

const FORM_ROUTES = {
  vehicle: "/dashboard?section=add-vehicle",
  facility: "/dashboard?section=add-facility",
  equipment: "/dashboard?section=add-equipment",
};

const AddBoundarySection = () => {
  const [boundaryData, setBoundaryData] = useState<Boundary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { canView, canCreate } = usePermissions();
  
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

  const [questions, setQuestions] = useState<{
    vehicleCount: "Yes" | "No" | "";
    facilityCount: "Yes" | "No" | "";
    equipmentCount: "Yes" | "No" | "";
    baselineEmissionsAvailable: "Yes" | "No" | "";
  }>({
    vehicleCount: "",
    facilityCount: "",
    equipmentCount: "",
    baselineEmissionsAvailable: "",
  });

  const [formData, setFormData] = useState<BoundaryFormData>({
    organizationId: getOrganizationId(),
    industry: "",
    businessNature: "",
    baselineYear: "",
    baselineEmissions: "",
    vehicleCount: 0,
    facilityCount: 0,
    equipmentCount: 0,
    businessFormationDate: "",
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

  const changeQuestion = (
    question: "vehicleCount" | "facilityCount" | "equipmentCount" | "baselineEmissionsAvailable",
    value: "Yes" | "No" | ""
  ) => {
    setQuestions((prev) => ({
        ...prev,
      [question]: value,
      }));
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateForm(formData)) {
        return;
      }

      setSubmitting(true);

      // Determine which forms to show next
      const formQueue: string[] = [];
      if (questions.vehicleCount === "Yes") formQueue.push(FORM_ROUTES.vehicle);
      if (questions.facilityCount === "Yes") formQueue.push(FORM_ROUTES.facility);
      if (questions.equipmentCount === "Yes") formQueue.push(FORM_ROUTES.equipment);

      try {
        const validBusinessFormationDate =
          Date.now() > new Date(formData.businessFormationDate).getTime();
        if (!validBusinessFormationDate) {
          toast.error("Business formation date must be in the past");
          return;
        }

        const response = await postRequest(
          "boundaries/addBoundary",
          {
            ...formData,
            baselineEmissionsAvailable: questions.baselineEmissionsAvailable === "Yes",
            businessFormationDate: new Date(formData.businessFormationDate),
          },
          "Boundary created successfully",
          tokenData.accessToken,
          "post"
        );

        if (response?.success) {
          toast.success(response.message || "Boundary created successfully");
          const userData = safeLocalStorage.getItem('user');
          const userDataParsed = JSON.parse(userData || "{}");
          userDataParsed.boundary = response.boundaries._id;
          safeLocalStorage.setItem('user', JSON.stringify(userDataParsed));
          
          // Save the queue to sessionStorage
          if (formQueue.length > 0) {
            sessionStorage.setItem("khazra_form_queue", JSON.stringify(formQueue));
            // Route to the first form in the queue
            router.push(formQueue[0]);
          } else {
            // If no forms to show, go to dashboard
            router.push("/dashboard");
          }
        } else {
          toast.error(response?.message || "Failed to create boundary");
        }
      } catch (error) {
        console.error("Error creating boundary:", error);
        toast.error("An error occurred while creating the boundary. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [formData, validateForm, router, questions]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChanges = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      reportingPeriod: {
        ...prev.reportingPeriod,
        [name]: value,
      },
    }));
  };

  const resetForm = () => {
    setFormData({
      organizationId: getOrganizationId(),
      industry: "",
      businessNature: "",
      baselineYear: "",
      baselineEmissions: "",
      vehicleCount: 0,
      facilityCount: 0,
      equipmentCount: 0,
      businessFormationDate: "",
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
      vehicleCount: "",
      facilityCount: "",
      equipmentCount: "",
      baselineEmissionsAvailable: "",
    });
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // If boundary exists, show card instead of form
  if (boundaryData) {
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
            <p className='text-sm text-gray-600'>
              Your boundary has been successfully created. You can now proceed to add your assets (vehicles, facilities, equipment) 
              to start tracking your emissions.
            </p>
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
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-gray-800'>Add New Boundary</h2>
            <button
              onClick={resetForm}
              className='text-gray-500 hover:text-gray-700'
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='industry' className='block text-sm font-medium text-gray-700 mb-2'>
                  Industry *
                </label>
                <select
                  id='industry'
                  name='industry'
                  value={formData.industry}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select your industry</option>
                  {INDUSTRY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor='businessNature' className='block text-sm font-medium text-gray-700 mb-2'>
                  Business Nature *
                </label>
                <select
                  id='businessNature'
                  name='businessNature'
              value={formData.businessNature}
              onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select business nature</option>
                  {BUSINESS_NATURE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
          </div>

              <div>
                <label htmlFor='businessFormationDate' className='block text-sm font-medium text-gray-700 mb-2'>
                  Business Formation Date *
                </label>
                <input
                  type='date'
                  id='businessFormationDate'
                  name='businessFormationDate'
              value={formData.businessFormationDate}
              onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
            />
          </div>

              <div>
                <label htmlFor='baselineYear' className='block text-sm font-medium text-gray-700 mb-2'>
                  Baseline Year *
                </label>
                <select
                  id='baselineYear'
                  name='baselineYear'
                  value={formData.baselineYear}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select baseline year</option>
                  {PAST_YEARS.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor='startDate' className='block text-sm font-medium text-gray-700 mb-2'>
                  Start Date *
                </label>
                <input
                  type='date'
                  id='startDate'
                  name='startDate'
              value={formData.reportingPeriod.startDate}
                  onChange={(e) => handleInputChanges('startDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
            />
          </div>

              <div>
                <label htmlFor='endDate' className='block text-sm font-medium text-gray-700 mb-2'>
                  End Date *
                </label>
                <input
                  type='date'
                  id='endDate'
                  name='endDate'
                  value={formData.reportingPeriod.endDate}
                  onChange={(e) => handleInputChanges('endDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
            />
          </div>

              <div>
                <label htmlFor='primaryFunctionalCurrency' className='block text-sm font-medium text-gray-700 mb-2'>
                  Primary Functional Currency *
                </label>
                <select
                  id='primaryFunctionalCurrency'
                  name='primaryFunctionalCurrency'
              value={formData.primaryFunctionalCurrency}
              onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select primary functional currency</option>
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
          </div>

              <div>
                <label htmlFor='secondaryFunctionalCurrency' className='block text-sm font-medium text-gray-700 mb-2'>
                  Secondary Functional Currency
                </label>
                <select
                  id='secondaryFunctionalCurrency'
                  name='secondaryFunctionalCurrency'
              value={formData.secondaryFunctionalCurrency}
              onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                >
                  <option value="">Select secondary functional currency</option>
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
          </div>

              <div>
                <label htmlFor='numberOfEmployees' className='block text-sm font-medium text-gray-700 mb-2'>
                  Number of Employees *
                </label>
                <select
                  id='numberOfEmployees'
                  name='numberOfEmployees'
              value={formData.numberOfEmployees}
              onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select number of employees</option>
                  {NUMBER_OF_EMPLOYEES_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
          </div>

              <div>
                <label htmlFor='annualRevenue' className='block text-sm font-medium text-gray-700 mb-2'>
                  Annual Revenue *
                </label>
                <select
                  id='annualRevenue'
                  name='annualRevenue'
              value={formData.annualRevenue}
              onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select annual revenue range</option>
                  {ANNUAL_REVENUE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
          </div>

              <div>
                <label htmlFor='internationalBusinessTraveling' className='block text-sm font-medium text-gray-700 mb-2'>
                  International Business Traveling *
                </label>
                <select
                  id='internationalBusinessTraveling'
                  name='internationalBusinessTraveling'
              value={formData.internationalBusinessTraveling ? "Yes" : "No"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  internationalBusinessTraveling: e.target.value === "Yes",
                }))
              }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Yes or No</option>
                  {YES_NO_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
          </div>

            {/* Asset Questions */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800'>Asset Information</h3>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Do you have any vehicles?
                  </label>
                  <select
              value={questions.vehicleCount}
                    onChange={(e) => changeQuestion("vehicleCount", e.target.value as "Yes" | "No" | "")}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  >
                    <option value="">Select Yes or No</option>
                    {YES_NO_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
            {questions.vehicleCount === "Yes" && (
                    <div className='mt-2'>
                      <input
                        type='number'
                        name='vehicleCount'
                  value={formData.vehicleCount}
                  onChange={handleInputChange}
                        placeholder='Enter number of vehicles'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                />
              </div>
            )}
          </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Do you have any facilities?
                  </label>
                  <select
              value={questions.facilityCount}
                    onChange={(e) => changeQuestion("facilityCount", e.target.value as "Yes" | "No" | "")}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  >
                    <option value="">Select Yes or No</option>
                    {YES_NO_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
            {questions.facilityCount === "Yes" && (
                    <div className='mt-2'>
                      <input
                        type='number'
                        name='facilityCount'
                  value={formData.facilityCount}
                  onChange={handleInputChange}
                        placeholder='Enter number of facilities'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                />
              </div>
            )}
          </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Do you have any equipments?
                  </label>
                  <select
              value={questions.equipmentCount}
                    onChange={(e) => changeQuestion("equipmentCount", e.target.value as "Yes" | "No" | "")}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  >
                    <option value="">Select Yes or No</option>
                    {YES_NO_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
            {questions.equipmentCount === "Yes" && (
                    <div className='mt-2'>
                      <input
                        type='number'
                        name='equipmentCount'
                  value={formData.equipmentCount}
                  onChange={handleInputChange}
                        placeholder='Enter number of equipments'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                />
              </div>
            )}
          </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Do you have baseline emissions available?
                  </label>
                  <select
              value={questions.baselineEmissionsAvailable}
                    onChange={(e) => changeQuestion("baselineEmissionsAvailable", e.target.value as "Yes" | "No" | "")}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  >
                    <option value="">Select Yes or No</option>
                    {YES_NO_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
            {questions.baselineEmissionsAvailable === "Yes" && (
                    <div className='mt-2'>
                      <input
                        type='number'
                        name='baselineEmissions'
                  value={formData.baselineEmissions}
                  onChange={handleInputChange}
                        placeholder='Enter baseline emissions'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                />
              </div>
            )}
                </div>
              </div>
          </div>

            <div className='flex gap-3 pt-4'>
          <button
                type='submit'
                disabled={submitting}
                className='bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2'
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Boundary...
              </>
            ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Boundary
                  </>
            )}
          </button>
              <button
                type='button'
                onClick={resetForm}
                className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors duration-200'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
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
