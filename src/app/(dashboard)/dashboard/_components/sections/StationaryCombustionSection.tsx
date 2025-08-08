"use client";

import Table from "@/components/Table";
import { getRequest, postRequest } from "@/utils/api";
import { useState, useEffect } from "react";
import { Edit3, Trash2, Eye, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { safeLocalStorage } from "@/utils/localStorage";

interface Facility {
  _id: string;
  facilityName: string;
  facilityType: string;
  city: string;
  country: string;
}

interface EquipmentType {
  _id: string;
  equipmentName: string;
  capacityUnit?: string;
}

interface FuelType {
  _id: string;
  fuelType: string;
  fuelTypeUnit: string;
  emissionFactorC02: number;
}

interface StationaryFormData {
  month: string;
  year: string;
  facility: string;
  facilityDescription: string;
  equipment: string;
  fuelType: string;
  quantityOfFuelUsed: string;
  emissionFactor: number;
  useCustomEmissionFactor: boolean;
}

const getOrgId = () => {
  const id = safeLocalStorage.getItem("user");
  const userData = JSON.parse(id || "");
  return userData.organization;
};

export default function StationaryCombustionSection() {
  const [isStationaryModalOpen, setIsStationaryModalOpen] = useState(false);
  const [editingStationaryData, setEditingStationaryData] = useState<any>(null);
  const [editingStationaryIndex, setEditingStationaryIndex] = useState<
    number | null
  >(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMode, setReviewMode] = useState<
    "add-stationary" | "edit-stationary" | null
  >(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Dropdown data states
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [data, setData] = useState<any>(null);

  const [stationaryFormData, setStationaryFormData] =
    useState<StationaryFormData>({
      month: "",
      year: "",
      facility: "",
      facilityDescription: "",
      equipment: "",
      fuelType: "",
      quantityOfFuelUsed: "",
      emissionFactor: 0,
      useCustomEmissionFactor: false,
    });

  // State for Stationary Combustion table data array
  const [stationaryCombustionData, setStationaryCombustionData] = useState<any[]>([
    // {
    //   id: 1,
    //   month: "January",
    //   year: "2024",
    //   facilityId: "FAC-001",
    //   facilityDescription: "Main Production Plant",
    //   equipmentType: "Boiler",
    //   fuelType: "Natural Gas",
    //   quantityOfFuelUsed: "1,250 m³",
    //   customEmissionFactor: "2.162 kg CO₂e/m³",
    //   useCustomEmissionFactor: true,
    // },
    // {
    //   id: 2,
    //   month: "January",
    //   year: "2024",
    //   facilityId: "FAC-002",
    //   facilityDescription: "Secondary Processing Unit",
    //   equipmentType: "Furnace",
    //   fuelType: "Heating Oil",
    //   quantityOfFuelUsed: "850 L",
    //   customEmissionFactor: "3.15 kg CO₂e/L",
    //   useCustomEmissionFactor: false,
    // },
    // {
    //   id: 3,
    //   month: "January",
    //   year: "2024",
    //   facilityId: "FAC-003",
    //   facilityDescription: "Backup Power Station",
    //   equipmentType: "Generator",
    //   fuelType: "Diesel",
    //   quantityOfFuelUsed: "320 L",
    //   customEmissionFactor: "2.68 kg CO₂e/L",
    //   useCustomEmissionFactor: true,
    // },
  ]);

  // Get token from localStorage
  const getToken = () => {
    const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
    return tokenData.accessToken;
  };

  
  const getDashboard = async () => {
    try {
      const response = await getRequest(
        `dashboard/getDashboardData`,
        getToken()
      );

      if (response.success) {
        setData(response.dashboardData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (isStationaryModalOpen) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [isStationaryModalOpen]);

  // Fetch dropdown data
  const fetchFacilities = async () => {
    try {
      const response = await getRequest("facilities/getFacilities?status=Active", getToken());
      if (response.success) {
        setFacilities(response.data.facilities || []);
      } else {
        // toast.error(response.message || "Failed to fetch facilities");
        console.log(response, 'response')
      }
    } catch (error: any) {
      console.log(error, 'error')
      // toast.error(error.message || "Failed to fetch facilities");
    }
  };

  const fetchEquipments = async () => {
    try {
      const response = await getRequest(
        "equipments/getEquipments?status=Active",
        getToken()
      );
      if (response.success) {
        setEquipments(response.data.equipments || []);
      } else {
        // toast.error(response.message || "Failed to fetch equipments");
        console.log(response, 'response')
      }
    } catch (error: any) {
      console.log(error, 'error')
      // toast.error(error.message || "Failed to fetch equipments");
    }
  };

  const fetchFuelTypes = async () => {
    try {
      const response = await getRequest(
        "stationary-fuel-types/getStationaryFuelTypes?limit=1000",
        getToken()
      );
      if (response.success) {
        setFuelTypes(response.data.stationaryFuelTypes || []);
      } else {
        // toast.error(response.message || "Failed to fetch fuel types");
        console.log(response, 'response')
      }
    } catch (error: any) {
      console.log(error, 'error')
      // toast.error(error.message || "Failed to fetch fuel types");
    }
  };
  const getStationaryTotal = async () => {
    try {
      const response = await getRequest("stationary/getStationary", getToken());
      if (response.success) {
        setStationaryCombustionData(response.data.stationary);
      } else {
        // toast.error(response.message || "Failed to fetch stationary total");
        console.log(response, 'response')
      }
    } catch (error: any) {
      console.log(error, 'error')
      // toast.error(error.message || "Failed to fetch stationary total");
    }
  };

  // Load dropdown data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getDashboard(),
          fetchFacilities(),
          fetchEquipments(),
          fetchFuelTypes(),
          getStationaryTotal()
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

  const handleStationarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare the data according to the API specification
      const requestData = {
        scope: "scope1",
        scopeType: "stationary",
        month: stationaryFormData.month,
        year: parseInt(stationaryFormData.year),
        facility: stationaryFormData.facility,
        facilityDescription:stationaryFormData.facilityDescription,
        equipment: stationaryFormData.equipment,
        fuelType: stationaryFormData.fuelType,
        quantityOfFuelUsed: parseFloat(stationaryFormData.quantityOfFuelUsed),
        emissionFactor: stationaryFormData.emissionFactor,
      };

      const response = await postRequest(
        "stationary/addStationary",
        requestData,
        "Stationary combustion data added successfully",
        getToken(),
        "post",
        true, 
        'stationary'
      );

      if (response.success) {
        toast.success("Stationary combustion data added successfully");
        
        // Refresh the data from the server
        await getStationaryTotal();
        
        setIsStationaryModalOpen(false);

        // Reset form
        setStationaryFormData({
          month: "",
          year: "",
          facility: "",
          facilityDescription: "",
          equipment: "",
          fuelType: "",
          quantityOfFuelUsed: "",
          emissionFactor: 0,
          useCustomEmissionFactor: false,
        });
      } else {
        // toast.error(
        //   response.message || "Failed to add stationary combustion data"
        // );
        console.log(response, 'response')
      }
    } catch (error: any) {
      console.log(error, 'error')
      //  toast.error(error.message || "Failed to add stationary combustion data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStationarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare the data according to the API specification
      const requestData = {
        // scope: "scope1",
        // scopeType: "stationary",
        month: stationaryFormData.month,
        year: parseInt(stationaryFormData.year),
        facility: stationaryFormData.facility,
        facilityDescription: stationaryFormData.facilityDescription,
        equipment: stationaryFormData.equipment,
        fuelType: stationaryFormData.fuelType,
        quantityOfFuelUsed: parseFloat(stationaryFormData.quantityOfFuelUsed),
        emissionFactor: stationaryFormData.emissionFactor,
      };

      // Get the ID of the item being edited
      const editingId = editingStationaryData?._id || editingStationaryData?.id;
      
      if (!editingId) {
        // toast.error("No item ID found for editing");
        console.log("No item ID found for editing")
        return;
      }

      const response = await postRequest(
        `stationary/updateStationary/${editingId}`,
        requestData,
        "Stationary combustion data updated successfully",
        getToken(),
        "put",
        true, 
        'stationary'
      );

      if (response.success) {
        toast.success("Stationary combustion data updated successfully");
        
        // Refresh the data from the server
        await getStationaryTotal();
        
        setIsStationaryModalOpen(false);
        
        // Reset editing states
        setEditingStationaryData(null);
        setEditingStationaryIndex(null);
        
        // Reset form
        setStationaryFormData({
          month: "",
          year: "",
          facility: "",
          facilityDescription: "",
          equipment: "",
          fuelType: "",
          quantityOfFuelUsed: "",
          emissionFactor: 0,
          useCustomEmissionFactor: false,
        });
      } else {
        // toast.error(
        //   response.message || "Failed to update stationary combustion data"
        // );
        console.log(response, 'response')
      }
    } catch (error: any) {
      console.log(error, 'error')
      // toast.error(
      //   error.message || "Failed to update stationary combustion data"
      // );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStationary = (rowData: any, index: number) => {
    setEditingStationaryData(rowData);
    setEditingStationaryIndex(index);
    setStationaryFormData({
      month: rowData.month,
      year: rowData.year.toString(),
      facility: rowData.facility || rowData.facilityId,
      facilityDescription: rowData.facilityDescription,
      equipment: rowData.equipment || rowData.equipmentId,
      fuelType: rowData.fuelType || rowData.fuelTypeId,
      quantityOfFuelUsed: rowData.quantityOfFuelUsed,
      emissionFactor: rowData.emissionFactor || 0,
      useCustomEmissionFactor: rowData.useCustomEmissionFactor || false,
    });
    setIsStationaryModalOpen(true);
  };

  // Get facility name by ID
  const getFacilityName = (facilityId: string) => {
    if (!facilityId) return "N/A";
    const facility = facilities.find((f) => f._id === facilityId);
    return facility ? facility.facilityName : "N/A";
  };

  // Get equipment type name by ID
  const getEquipmentTypeName = (equipmentTypeId: string) => {
    if (!equipmentTypeId) return "N/A";
    console.log('equipmentTypeId', equipmentTypeId, equipments)
    const equipment = equipments.find((e) => e._id === equipmentTypeId);
    return equipment ? equipment.equipmentName : "Loading...";
  };

  // Get fuel type name by ID
  const getFuelTypeName = (fuelTypeId: string) => {
    if (!fuelTypeId) return "N/A";
    const fuelType = fuelTypes.find((f) => f._id === fuelTypeId);
    return fuelType
      ? `${fuelType.fuelType} (${fuelType.fuelTypeUnit})`
      : "Loading...";
  };

  // Generate years for dropdown (current year - 10 to current year + 5)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 10; year <= currentYear + 5; year++) {
      years.push(year);
    }
    return years;
  };

  // Review modal handlers
  const handleReviewConfirm = () => {
    if (reviewMode === "add-stationary") {
      const newRow = {
        id: Math.max(...stationaryCombustionData.map((row) => row.id)) + 1,
        ...reviewData,
      };
      setStationaryCombustionData([...stationaryCombustionData, newRow]);
      console.log("Confirmed: Added new stationary combustion row");
    } else if (
      reviewMode === "edit-stationary" &&
      editingStationaryIndex !== null
    ) {
      const updatedData = [...stationaryCombustionData];
      updatedData[editingStationaryIndex] = {
        ...updatedData[editingStationaryIndex],
        ...reviewData,
      };
      setStationaryCombustionData(updatedData);
      console.log("Confirmed: Updated stationary combustion row");
    }

    // Reset review modal
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);

    // Reset editing states
    setEditingStationaryData(null);
    setEditingStationaryIndex(null);

    // Reset forms
    setStationaryFormData({
      month: "",
      year: "",
      facility: "",
      facilityDescription: "",
      equipment: "",
      fuelType: "",
      quantityOfFuelUsed: "",
      emissionFactor: 0,
      useCustomEmissionFactor: false,
    });
  };

  const handleReviewCancel = () => {
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);

    // Reset editing states
    setEditingStationaryData(null);
    setEditingStationaryIndex(null);

    // Reset forms
    setStationaryFormData({
      month: "",
      year: "",
      facility: "",
      facilityDescription: "",
      equipment: "",
      fuelType: "",
      quantityOfFuelUsed: "",
      emissionFactor: 0,
      useCustomEmissionFactor: false,
    });
  };

  const handleReviewEdit = () => {
    setShowReviewModal(false);

    // Reopen the appropriate modal for editing
    if (reviewMode === "add-stationary" || reviewMode === "edit-stationary") {
      setStationaryFormData(reviewData);
      setIsStationaryModalOpen(true);
    }

    setReviewMode(null);
    setReviewData(null);
  };

  const resetForm = () => {
    setStationaryFormData({
      month: "",
      year: "",
      facility: "",
      facilityDescription: "",
      equipment: "",
      fuelType: "",
      quantityOfFuelUsed: "",
      emissionFactor: 0,
      useCustomEmissionFactor: false,
    });
    setEditingStationaryData(null);
    setEditingStationaryIndex(null);
    setIsStationaryModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-4">
        <h1 className="text-3xl font-bold text-black mb-1">
          Stationary Combustion Emissions
        </h1>
        <p className="text-black opacity-70 max-w-4xl leading-relaxed">
          Direct greenhouse gas emissions from stationary combustion sources owned or controlled by your organization.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Total Stationary
              </div>
              <div className="text-3xl font-bold text-black mb-2">
                {data?.stationaryCombustionEmissions}
              </div>
              <div className="text-sm text-green-800 mb-2">
                ▼ 8.5% vs last year
              </div>
              <div className="text-xs text-black opacity-60">
                tonnes CO₂e • 53.8% of Scope 1
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🔥
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-800 transition-all duration-1000"
              style={{ width: "53.8%" }}
            ></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Active Sources
              </div>
              <div className="text-3xl font-bold text-black mb-2">23</div>
              <div className="text-sm text-green-800 mb-2">
                Across 5 facilities
              </div>
              <div className="text-xs text-black opacity-60">
                Boilers, furnaces, generators
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🏭
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Primary Fuel
              </div>
              <div className="text-3xl font-bold text-black mb-2">
                Natural Gas
              </div>
              <div className="text-sm text-green-800 mb-2">
                65% of consumption
              </div>
              <div className="text-xs text-black opacity-60">
                Followed by heating oil
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ⛽
            </div>
          </div>
        </div>
      </div>
      <Table
        title="Stationary Combustion Data"
        columns={[
          { key: 'month', label: 'Month' },
          { key: 'year', label: 'Year' },
          { 
            key: 'facility', 
            label: 'Facility',
            render: (value, row) => getFacilityName(row.facility || row.facilityId)
          },
          { 
            key: 'equipment', 
            label: 'Equipment',
            render: (value, row) => getEquipmentTypeName(row.equipment || row.equipmentId)
          },
          { 
            key: 'fuelType', 
            label: 'Fuel Type',
            render: (value, row) => getFuelTypeName(row.fuelType || row.fuelTypeId)
          },
          { key: 'quantityOfFuelUsed', label: 'Quantity of Fuel Used' },
          { key: 'emissionFactor', label: 'Emissions Factor' },
          { 
            key: 'totalEmissions', 
            label: 'Total Emissions',
            type: 'number',
            align: 'right'
          }
        ]}
        data={stationaryCombustionData}
        actions={[
          {
            // label: 'Edit',
            icon: <Edit3 className="w-4 h-4 text-green-500" />,
            onClick: (row) => handleEditStationary(row, stationaryCombustionData.findIndex(item => item._id === row._id)),
            variant: 'primary'
          }
        ]}
        showAddButton={true}
        addButtonLabel="Add Stationary Combustion"
        onAddClick={() => setIsStationaryModalOpen(true)}
        showSearch={true}
        // showFilter={true}
        rowKey="_id"
        loading={loading}
        emptyMessage={dataLoaded ? "No stationary combustion data found" : "Loading data..."}
      />

      {/* Stationary Combustion Form */}
      {isStationaryModalOpen && (
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-gray-800'>
              {editingStationaryData ? 'Edit Stationary Combustion' : 'Add New Stationary Combustion'}
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

          <form onSubmit={editingStationaryData ? handleEditStationarySubmit : handleStationarySubmit} className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor='month' className='block text-sm font-medium text-gray-700 mb-2'>
                  Month *
                </label>
                <select
                  id='month'
                  value={stationaryFormData.month}
                  onChange={(e) =>
                    setStationaryFormData({
                      ...stationaryFormData,
                      month: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>

              <div>
                <label htmlFor='year' className='block text-sm font-medium text-gray-700 mb-2'>
                  Year *
                </label>
                <select
                  id='year'
                  value={stationaryFormData.year}
                  onChange={(e) =>
                    setStationaryFormData({
                      ...stationaryFormData,
                      year: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Year</option>
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor='facility' className='block text-sm font-medium text-gray-700 mb-2'>
                  Facility *
                </label>
                <select
                  id='facility'
                  value={stationaryFormData.facility}
                  onChange={(e) =>{
                    const desc = facilities.find(f => f._id === e.target.value)
                    setStationaryFormData({
                      ...stationaryFormData,
                      facility: e.target.value,
                      facilityDescription: desc?.facilityName || "",
                    })}
                  }
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
                <label htmlFor='equipment' className='block text-sm font-medium text-gray-700 mb-2'>
                  Equipment *
                </label>
                <select
                  id='equipment'
                  value={stationaryFormData.equipment}
                  onChange={(e) =>
                    setStationaryFormData({
                      ...stationaryFormData,
                      equipment: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Equipment</option>
                  {equipments.map((equipment) => (
                    <option
                      key={equipment._id}
                      value={equipment._id}
                      className="text-black"
                    >
                      {equipment.equipmentName}
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
                  value={stationaryFormData.fuelType}
                  onChange={(e) =>{
                    const desc = fuelTypes.find(f => f._id === e.target.value)
                    setStationaryFormData({
                      ...stationaryFormData,
                      fuelType: e.target.value,
                      emissionFactor: desc?.emissionFactorC02||0,
                    })
                  }
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  required
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map((fuel) => (
                    <option key={fuel._id} value={fuel._id}>
                      {fuel.fuelType} ({fuel.fuelTypeUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor='quantityOfFuelUsed' className='block text-sm font-medium text-gray-700 mb-2'>
                  Quantity of Fuel Used *
                </label>
                <input
                  id='quantityOfFuelUsed'
                  type="text"
                  value={stationaryFormData.quantityOfFuelUsed}
                  onChange={(e) =>
                    setStationaryFormData({
                      ...stationaryFormData,
                      quantityOfFuelUsed: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  placeholder="1,250 m³"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useCustomEmissionFactor"
                checked={stationaryFormData.useCustomEmissionFactor}
                onChange={(e) =>
                  setStationaryFormData({
                    ...stationaryFormData,
                    useCustomEmissionFactor: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label
                htmlFor="useCustomEmissionFactor"
                className="text-sm font-medium text-gray-700"
              >
                Use Custom Emission Factor
              </label>
            </div>

            {stationaryFormData.useCustomEmissionFactor && (
              <div>
                <label htmlFor='customEmissionFactor' className='block text-sm font-medium text-gray-700 mb-2'>
                  Custom Emission Factor *
                </label>
                <input
                  id='customEmissionFactor'
                  type="number"
                  value={stationaryFormData.emissionFactor}
                  onChange={(e) =>
                    setStationaryFormData({
                      ...stationaryFormData,
                      emissionFactor: parseFloat(e.target.value),
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  placeholder="2.162 kg CO₂e/m³"
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
                    {editingStationaryData ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingStationaryData ? 'Update Stationary Combustion' : 'Create Stationary Combustion'}
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {reviewMode?.includes("add")
                        ? "Review New Entry"
                        : "Review Changes"}
                    </h2>
                    <p className="text-green-100 text-sm">
                      {reviewMode === "add-stationary" &&
                        "New Stationary Combustion Entry"}
                      {reviewMode === "edit-stationary" &&
                        "Edit Stationary Combustion Entry"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReviewCancel}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
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
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                      Basic Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Month</span>
                        <span className="text-gray-900 font-semibold">
                          {reviewData.month}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Year</span>
                        <span className="text-gray-900 font-semibold">
                          {reviewData.year}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Facility ID
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {reviewData.facilityId}
                        </span>
                      </div>
                      {/* {reviewData.facilityDescription && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600 font-medium">
                            Facility Description
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {reviewData.facilityDescription}
                          </span>
                        </div>
                      )} */}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                      Equipment Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Equipment
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {reviewData.equipmentType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">
                          Fuel Type
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {reviewData.fuelType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                      Consumption Data
                    </h4>
                    <div className="space-y-3">
                      {reviewData.quantityOfFuelUsed && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">
                            Quantity of Fuel Used
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {reviewData.quantityOfFuelUsed}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                      Emission Factors
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Total Emissions
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {reviewData.totalEmissions.toFixed(2) || "Not specified"}
                        </span>
                      </div>
                      {/* <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">
                          Use Custom Factor
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            reviewData.useCustomEmissionFactor
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {reviewData.useCustomEmissionFactor ? "Yes" : "No"}
                        </span>
                      </div> */}
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
                  <svg
                    className="w-4 h-4 inline mr-2"
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
                  Edit
                </button>
                <button
                  onClick={handleReviewConfirm}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-4 h-4 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {reviewMode?.includes("add")
                    ? "Confirm Add"
                    : "Confirm Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
