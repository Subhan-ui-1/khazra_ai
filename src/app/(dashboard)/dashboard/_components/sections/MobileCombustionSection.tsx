'use client';

import { useState, useEffect } from 'react';
import { getRequest, postRequest } from "@/utils/api";
import { Edit3, Trash2, Eye, Plus } from "lucide-react";
import Table from "@/components/Table";
import toast from "react-hot-toast";
import { safeLocalStorage } from '@/utils/localStorage';

interface Facility {
  _id: string;
  facilityName: string;
  facilityType: string;
  city: string;
  country: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  vehicleType: string;
  fuelType: string;
  modelYear: number;
}

interface MobileFuelType {
  _id: string;
  fuelType: string;
  fuelTypeUnit: string;
  emissionFactorC02: number;
}

interface MobileFormData {
  month: string;
  year: string;
  facility: string;
  equipmentType: string;
  fuelType: string;
  vehicle: string;
  fuelConsumed: string;
  amountOfFuelUsed: string;
  emissionFactor: string;
  useCustomEmissionFactor: boolean;
  total: string;
}

const getTokens = () => {
  const token = safeLocalStorage.getItem("tokens");
  const tokenData = JSON.parse(token || "");
  return tokenData.accessToken;
};
const getOrgId = () => {
  const id = safeLocalStorage.getItem("user");
  const userData = JSON.parse(id || "");
  return userData.organization;
};
export default function MobileCombustionSection() {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [editingMobileData, setEditingMobileData] = useState<any>(null);
  const [editingMobileIndex, setEditingMobileIndex] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMode, setReviewMode] = useState<'add-mobile' | 'edit-mobile' | null>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Dropdown data states
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [mobileFuelTypes, setMobileFuelTypes] = useState<MobileFuelType[]>([]);
  const [data, setData] = useState<any>(null);
  const [dataEmissions, setDataEmissions] = useState<any>(null);
  const getDashboard = async () => {
    try {
      const response = await getRequest(
        `dashboard/getDashboardData`,
        getToken()
      );

      if (response.success) {
        setData(response.dashboardData);
        setDataEmissions({
          emission: response.dashboardData.mobileCombustionEmissions,
          vehicleCOunt: response.dashboardData.totalVehicles,
          totalCount:
            response.dashboardData.totalVehicles,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const [mobileFormData, setMobileFormData] = useState<MobileFormData>({
    month: '',
    year: '',
    facility: '',
    equipmentType: '',
    fuelType: '',
    vehicle: '',
    fuelConsumed: '',
    amountOfFuelUsed: '',
    emissionFactor: '',
    useCustomEmissionFactor: false,
    total: ''
  });

  // State for Mobile Combustion table data array
  const [mobileCombustionData, setMobileCombustionData] = useState<any[]>([]);

  const getToken = () => {
    const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
    return tokenData.accessToken;
  };

  // Fetch dropdown data
  const fetchFacilities = async () => {
    try {
      const response = await getRequest("facilities/getFacilities", getToken());
      if (response.success) {
        setFacilities(response.data.facilities || []);
      } else {
        // toast.error(response.message || "Failed to fetch facilities");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch facilities");
      console.log(error, 'error')
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await getRequest(
        "vehicles/getVehicles",
        getToken()
      );
      if (response.success) {
        setVehicles(response.data.vehicles);
        // console.log(vehicles, 'vehicles from useEffect.')
        console.log(response.data.vehicles)
      } else {
        // toast.error(response.message || "Failed to fetch vehicles");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch vehicles");
      console.log(error, 'error')
    }
  };

  const fetchMobileFuelTypes = async () => {
    try {
      const response = await getRequest(
        "mobile-fuel-types/getMobileFuelTypes",
        getToken()
      );
      if (response.success) {
        setMobileFuelTypes(response.data.mobileFuelTypes || []);
      } else {
        // toast.error(response.message || "Failed to fetch mobile fuel types");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch mobile fuel types");
      console.log(error, 'error')
    }
  };

  const getMobileTotal = async () => {
    try {
      const response = await getRequest("mobile/getMobiles", getToken());
      if (response.success) {
        setMobileCombustionData(response.data.mobile || []);
      } else {
        // toast.error(response.message || "Failed to fetch mobile data");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch mobile data");
      console.log(error, 'error')
    }
  };

  useEffect(() => {
    if (isMobileModalOpen) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [isMobileModalOpen]);

  // Load dropdown data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getDashboard(),
          fetchFacilities(),
          fetchVehicles(),
          fetchMobileFuelTypes(),
          getMobileTotal()
        ]);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare the data according to the API specification
      const requestData = {
        scope: "scope1",
        scopeType: "mobile",
        month: parseInt(mobileFormData.month),
        year: parseInt(mobileFormData.year),
        facility: mobileFormData.facility,
        vehicle: mobileFormData.equipmentType,
        fuelType: mobileFormData.fuelType,
        equipmentType: mobileFormData.vehicle,
        fuelConsumed: parseFloat(mobileFormData.fuelConsumed),
        amountOfFuelUsed: parseFloat(mobileFormData.amountOfFuelUsed),
        emissionFactor: parseFloat(mobileFormData.emissionFactor),
      };

      const response = await postRequest(
        "mobile/addMobile",
        requestData,
        "Mobile combustion data added successfully",
        getToken(),
        "post",
        true, 
        'mobile'
      );

      if (response.success) {
        toast.success("Mobile combustion data added successfully");
        
        // Refresh the data from the server
        await getMobileTotal();
        
        setIsMobileModalOpen(false);

        // Reset form
        setMobileFormData({
          month: '',
          year: '',
          facility: '', 
          equipmentType: '',
          fuelType: '',
          vehicle: '',
          fuelConsumed: '',
          amountOfFuelUsed: '',
          emissionFactor: '',
          useCustomEmissionFactor: false,
          total: ''
        });
      } else {
        toast.error(
          // response.message || "Failed to add mobile combustion data"
          console.log(response, 'response')
        );
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to add mobile combustion data");
      console.log(error, 'error')
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare the data according to the API specification
      const requestData = {
        // scope: "scope1",
        // scopeType: "mobile",
        month: parseInt(mobileFormData.month),
        year: parseInt(mobileFormData.year),
        facility: mobileFormData.facility,
        vehicle: mobileFormData.equipmentType,
        fuelType: mobileFormData.fuelType,
        fuelConsumed: parseFloat(mobileFormData.fuelConsumed),
        amountOfFuelUsed: parseFloat(mobileFormData.amountOfFuelUsed),
        emissionFactor: parseFloat(mobileFormData.emissionFactor),
      };

      // Get the ID of the item being edited
      const editingId = editingMobileData?._id || editingMobileData?.id;
      
      if (!editingId) {
        //  toast.error("No item ID found for editing");
        console.log("No item ID found for editing")
        return;
      }

      const response = await postRequest(
        `mobile/updateMobile/${editingId}`,
        requestData,
        "Mobile combustion data updated successfully",
        getToken(),
        "put",
        true, 'mobile'
      );

      if (response.success) {
        toast.success("Mobile combustion data updated successfully");
        
        // Refresh the data from the server
        await getMobileTotal();
        
        setIsMobileModalOpen(false);

        // Reset editing states
        setEditingMobileData(null);
        setEditingMobileIndex(null);

        // Reset form
        setMobileFormData({
          month: '',
          year: '',
          facility: '',
          equipmentType: '',
          fuelType: '',
          vehicle: '',
          fuelConsumed: '',
          amountOfFuelUsed: '',
          emissionFactor: '',
          useCustomEmissionFactor: false,
          total: ''
        });
      } else {
          // toast.error(
          //   response.message || "Failed to update mobile combustion data"
          // );
          console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to update mobile combustion data");
      console.log(error, 'error')
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMobile = (rowData: any, index: number) => {
    setEditingMobileData(rowData);
    setEditingMobileIndex(index);
    setMobileFormData({
      month: rowData.month?.toString() || '',
      year: rowData.year?.toString() || '',
      facility: rowData.facility || '',
      vehicle: rowData.equipmentType || '',
      fuelType: rowData.fuelType || '',
      // vehicle: rowData.vehicle || '',
      equipmentType: '',
      fuelConsumed: rowData.fuelConsumed?.toString() || '',
      amountOfFuelUsed: rowData.amountOfFuelUsed?.toString() || '',
      emissionFactor: rowData.emissionFactor?.toString() || '',
      useCustomEmissionFactor: rowData.useCustomEmissionFactor || false,
      total: rowData.total || ''
    });
    setIsMobileModalOpen(true);
  };

  // Helper functions to get names from IDs
  const getFacilityName = (facilityId: string) => {
    if (!facilityId) return "N/A";
    const facility = facilities.find(f => f._id === facilityId);
    return facility ? facility.facilityName : "Loading...";
  };

  const getVehicleName = (vehicleId: string) => {
    if (!vehicleId) return "N/A";
    const vehicle = vehicles.find(v => v._id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.vehicleType})` : "Loading...";
  };

  const getFuelTypeName = (fuelTypeId: string) => {
    if (!fuelTypeId) return "N/A";
    const fuelType = mobileFuelTypes.find(f => f._id === fuelTypeId);
    return fuelType ? fuelType.fuelType : "Loading...";
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push(year);
    }
    return years;
  };

  const getMonthName = (monthNumber: number | string) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(monthNumber.toString()) - 1;
    return months[monthIndex] || monthNumber;
  };

  // Review modal handlers
  const handleReviewConfirm = async () => {
    if (reviewMode === 'add-mobile') {
      await handleMobileSubmit(new Event('submit') as any);
    } else if (reviewMode === 'edit-mobile') {
      await handleEditMobileSubmit(new Event('submit') as any);
    }
    
    // Reset review modal
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);
  };

  const handleReviewCancel = () => {
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);
    
    // Reset editing states
    setEditingMobileData(null);
    setEditingMobileIndex(null);
    
    // Reset forms
    setMobileFormData({
      month: '',
      year: '',
      facility: '',
      equipmentType: '',
      fuelType: '',
      vehicle: '',
      fuelConsumed: '',
      amountOfFuelUsed: '',
      emissionFactor: '',
      useCustomEmissionFactor: false,
      total: ''
    });
  };

  const handleReviewEdit = () => {
    setShowReviewModal(false);
    
    // Reopen the appropriate modal for editing
    if (reviewMode === 'add-mobile') {
      setMobileFormData(reviewData);
      setIsMobileModalOpen(true);
    } else if (reviewMode === 'edit-mobile') {
      setMobileFormData(reviewData);
      setIsMobileModalOpen(true);
    }
    
    setReviewMode(null);
    setReviewData(null);
  };

  const resetForm = () => {
    setMobileFormData({
      month: '',
      year: '',
      facility: '',
      equipmentType: '',
      fuelType: '',
      vehicle: '',
      fuelConsumed: '',
      amountOfFuelUsed: '',
      emissionFactor: '',
      useCustomEmissionFactor: false,
      total: ''
    });
    setEditingMobileData(null);
    setEditingMobileIndex(null);
    setIsMobileModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-4">
        <h1 className="text-3xl font-bold text-black mb-1">
          Mobile Combustion Emissions
        </h1>
        <p className="text-black opacity-70 max-w-4xl leading-relaxed">
          Direct greenhouse gas emissions from mobile combustion sources owned or controlled by your organization.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Total Mobile
              </div>
              <div className="text-3xl font-bold text-black mb-2">{data?.mobileCombustionEmissions}</div>
              <div className="text-sm text-green-800 mb-2">▼ 15.2% vs last year</div>
              <div className="text-xs text-black opacity-60">
                tonnes CO₂e • 30.3% of Scope 1
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🚗
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '30.3%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Fleet Size
              </div>
              <div className="text-3xl font-bold text-black mb-2">{dataEmissions?.totalCount?.toString()}</div>
              <div className="text-sm text-green-800 mb-2">Active {dataEmissions?.vehicleCOunt?.toString()} vehicles</div>
              <div className="text-xs text-black opacity-60">
                Delivery trucks, forklifts, cars
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🚛
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Primary Fuel
              </div>
              <div className="text-3xl font-bold text-black mb-2">Diesel</div>
              <div className="text-sm text-green-800 mb-2">55% of consumption</div>
              <div className="text-xs text-black opacity-60">
                Followed by gasoline, hybrid
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ⛽
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Combustion Table */}
      <Table
        title="Mobile Combustion Data"
        columns={[
          { 
            key: 'month', 
            label: 'Month',
            render: (value, row) => getMonthName(row.month)
          },
          { key: 'year', label: 'Year' },
          { 
            key: 'facility', 
            label: 'Facility',
            render: (value, row) => getFacilityName(row.facility)
          },
         
          { 
            key: 'fuelType', 
            label: 'Fuel Type',
            render: (value, row) => getFuelTypeName(row.fuelType)
          },
          { 
            key: 'fuelConsumed', 
            label: 'Fuel Consumed',
            render: (value, row) => row.fuelConsumed > 0 ? 'Yes' : 'No',
            type: 'status'
          },
          { key: 'amountOfFuelUsed', label: 'Amount of Fuel Used' },
          { key: 'emissionFactor', label: 'Emission Factor' }
        ]}
        data={mobileCombustionData}
        actions={[
          {
            // label: 'Edit',
            icon: <Edit3 className="w-4 h-4 text-green-500" />,
            onClick: (row) => handleEditMobile(row, mobileCombustionData.findIndex(item => item._id === row._id)),
            variant: 'primary'
          },
          
          // {
          //   // label: 'Delete',
          //   icon: <Trash2 className="w-4 h-4" />,
          //   onClick: (row) => console.log('Delete row:', row),
          //   variant: 'danger'
          // }
        ]}
        showAddButton={true}
        addButtonLabel="Add Mobile Combustion"
        onAddClick={() => setIsMobileModalOpen(true)}
        showSearch={true}
        // showFilter={true}
        rowKey="_id"
        loading={loading}
        emptyMessage={dataLoaded ? "No mobile combustion data found" : "Loading data..."}
      />

      {/* Mobile Combustion Form */}
      {isMobileModalOpen && (
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-gray-800'>
              {editingMobileData ? 'Edit Mobile Combustion' : 'Add New Mobile Combustion'}
            </h2>
            <button
              onClick={resetForm}
              className='text-gray-500 hover:text-gray-700'
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={editingMobileData ? handleEditMobileSubmit : handleMobileSubmit} className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor='month' className='block text-sm font-medium text-gray-700 mb-2'>
                  Month *
                </label>
                <select 
                  id='month'
                  value={mobileFormData.month}
                  onChange={(e) => setMobileFormData({...mobileFormData, month: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              
              <div>
                <label htmlFor='year' className='block text-sm font-medium text-gray-700 mb-2'>
                  Year *
                </label>
                <select 
                  id='year'
                  value={mobileFormData.year}
                  onChange={(e) => setMobileFormData({...mobileFormData, year: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Year</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor='facility' className='block text-sm font-medium text-gray-700 mb-2'>
                  Facility *
                </label>
                <select 
                  id='facility'
                  value={mobileFormData.facility}
                  onChange={(e) => setMobileFormData({...mobileFormData, facility: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility._id} value={facility._id}>
                      {facility.facilityName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor='vehicle' className='block text-sm font-medium text-gray-700 mb-2'>
                  Vehicle *
                </label>
                <select 
                  id='vehicle'
                  value={mobileFormData.equipmentType}
                  onChange={(e) => setMobileFormData({...mobileFormData, equipmentType: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.make} {vehicle.model} ({vehicle.vehicleType})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor='fuelType' className='block text-sm font-medium text-gray-700 mb-2'>
                  Fuel Type *
                </label>
                <select 
                  id='fuelType'
                  value={mobileFormData.fuelType}
                  onChange={(e) => {
                    const selectedFuelType = e.target.value;
                    const fuelType = mobileFuelTypes.find(f => f._id === selectedFuelType);
                    setMobileFormData({
                      ...mobileFormData, 
                      fuelType: selectedFuelType,
                      emissionFactor: fuelType?.emissionFactorC02?.toString() || ''
                    });
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Fuel Type</option>
                  {mobileFuelTypes.map((fuelType) => (
                    <option key={fuelType._id} value={fuelType._id}>
                      {fuelType.fuelType}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor='fuelConsumed' className='block text-sm font-medium text-gray-700 mb-2'>
                  Fuel Consumed *
                </label>
                <input 
                  id='fuelConsumed'
                  type="number"
                  value={mobileFormData.fuelConsumed}
                  onChange={(e) => setMobileFormData({...mobileFormData, fuelConsumed: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  placeholder="Enter amount consumed"
                  required
                />
              </div>
              
              <div>
                <label htmlFor='amountOfFuelUsed' className='block text-sm font-medium text-gray-700 mb-2'>
                  Amount of Fuel Used *
                </label>
                <input 
                  id='amountOfFuelUsed'
                  type="number"
                  value={mobileFormData.amountOfFuelUsed}
                  onChange={(e) => setMobileFormData({...mobileFormData, amountOfFuelUsed: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  placeholder="450 L"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="useCustomEmissionFactorMobile"
                checked={mobileFormData.useCustomEmissionFactor}
                onChange={(e) => {
                  const useCustom = e.target.checked;
                  setMobileFormData({
                    ...mobileFormData, 
                    useCustomEmissionFactor: useCustom,
                    emissionFactor: useCustom ? mobileFormData.emissionFactor : (mobileFuelTypes.find(f => f._id === mobileFormData.fuelType)?.emissionFactorC02?.toString() || '')
                  });
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="useCustomEmissionFactorMobile" className="text-sm font-medium text-gray-700">
                Use Custom Emission Factor
              </label>
            </div>
            
            {mobileFormData.useCustomEmissionFactor && (
              <div>
                <label htmlFor='customEmissionFactor' className='block text-sm font-medium text-gray-700 mb-2'>
                  Custom Emission Factor *
                </label>
                <input 
                  id='customEmissionFactor'
                  type="number"
                  value={mobileFormData.emissionFactor}
                  onChange={(e) => setMobileFormData({...mobileFormData, emissionFactor: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  placeholder="Enter custom emission factor"
                  required
                />
              </div>
            )}
            
            <div className='flex gap-3 pt-4'>
              <button
                type='submit'
                disabled={submitting}
                className='bg-[#0D5942]  text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2'
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingMobileData ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingMobileData ? 'Update Mobile Combustion' : 'Create Mobile Combustion'}
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

      {/* Review Modal */}
      {showReviewModal && reviewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {reviewMode?.includes('add') ? 'Review New Entry' : 'Review Changes'}
                    </h2>
                    <p className="text-green-100 text-sm">
                      {reviewMode === 'add-mobile' && 'New Mobile Combustion Entry'}
                      {reviewMode === 'edit-mobile' && 'Edit Mobile Combustion Entry'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleReviewCancel}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Basic Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Month</span>
                        <span className="text-gray-900 font-semibold">{getMonthName(reviewData.month)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Year</span>
                        <span className="text-gray-900 font-semibold">{reviewData.year}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Facility</span>
                        <span className="text-gray-900 font-semibold">{getFacilityName(reviewData.facility)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Equipment Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Vehicle</span>
                        <span className="text-gray-900 font-semibold">{getVehicleName(reviewData.equipmentType)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">Fuel Type</span>
                        <span className="text-gray-900 font-semibold">{getFuelTypeName(reviewData.fuelType)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Consumption Data</h4>
                    <div className="space-y-3">
                      {reviewData.amountOfFuelUsed && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Amount of Fuel Used</span>
                          <span className="text-gray-900 font-semibold">{reviewData.amountOfFuelUsed}</span>
                        </div>
                      )}
                      {reviewData.fuelConsumed !== undefined && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600 font-medium">Fuel Consumed</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            reviewData.fuelConsumed > 0
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reviewData.fuelConsumed > 0 ? 'Yes' : 'No'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Emission Factors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Custom Emission Factor</span>
                        <span className="text-gray-900 font-semibold">{reviewData.customEmissionFactor || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">Use Custom Factor</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          reviewData.useCustomEmissionFactor 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {reviewData.useCustomEmissionFactor ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {/* {reviewData.total && (
                        <div className="flex items-center justify-between py-2 border-t border-gray-200 pt-3">
                          <span className="text-gray-600 font-medium">Total</span>
                          <span className="text-green-600 font-bold text-lg">{reviewData.total}</span>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleReviewCancel}
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReviewEdit}
                  className="px-6 py-3 text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button 
                  onClick={handleReviewConfirm}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {reviewMode?.includes('add') ? 'Confirm Add' : 'Confirm Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 