import React, { useState, useEffect } from "react";
import {
  Plus,
  Save,
  X,
  Edit3,
  Trash2,
  Car,
  Search,
  Filter,
} from "lucide-react";
import { postRequest, getRequest } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import { safeLocalStorage } from "@/utils/localStorage";

const formatDate=(dateString:string)=>{
  const date=new Date(dateString)
  return date.toLocaleDateString('en-US',{
    year:'numeric',
    month:'long',
    day:'numeric'
  })
}
// Define TypeScript interfaces
interface VehicleFormData {
  vehicleType: string;
  modelYear: string;
  purchaseYear: string;
  make: string;
  model: string;
  fuelType: string;
  secondaryFuelType: string;
  region: string;
  fuelConsumptionValue: string;
  fuelConsumptionUnit: string;
  electricityConsumptionValue: string;
  electricityConsumptionUnit: string;
  annualMileageValue: string;
  annualMileageUnit: string;
  emissionCO2: string;
  emissionCH4: string;
  emissionN2O: string;
  emissionStandard: string;
  averageSpeed: string;
  dataSource: string;
  notes: string;
}
let empty: VehicleFormData = {
  vehicleType: "",
  modelYear: "",
  purchaseYear: "",
  make: "",
  model: "",
  fuelType: "",
  secondaryFuelType: "",
  region: "",
  fuelConsumptionValue: "",
  fuelConsumptionUnit: "L/100km",
  electricityConsumptionValue: "",
  electricityConsumptionUnit: "kWh/100km",
  annualMileageValue: "",
  annualMileageUnit: "km",
  emissionCO2: "",
  emissionCH4: "",
  emissionN2O: "",
  emissionStandard: "Euro 6",
  averageSpeed: "",
  dataSource: "Manufacturer Specs",
  notes: "",
};

interface FilterState {
  search: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

const vehicleTypes = [
  "Passenger Car",
  "Light-Duty Truck",
  "Heavy-Duty Truck",
  "Forklift",
  "Hybrid",
  "EV",
];

const EMISSION_STANDARDS_OPTIONS = [
  "Euro 6",
  "EPA Tier 3",
  "China VI",
  "Euro 5",
  "EPA Tier 2",
];

const currentYear = new Date().getFullYear();

// Generate model years (last 30 years)
const modelYears = Array.from({ length: 30 }, (_, i) => currentYear - i);

// Function to get purchase years based on model year
function getPurchaseYears(modelYear: number) {
  return Array.from(
    { length: currentYear - modelYear  },
    (_, i) => modelYear + i
  );
}

// // Example usage:
// const selectedModelYear = 2012;

const fuelCombustionUnits = ["L/100km", "gal/mile", "L/hr"];

const electricityConsumptionUnits = ["kWh/100km", "kWh/mile"];

const annualMileageUnits = ["km", "miles"];

const dataSources = [
  "Manufacturer Specs",
  "Fleet Records",
  "VCA Database",
  "Estimate",
];

const fuelTypes = [
  "Gasoline",
  "Diesel",
  "Electric",
  "Hybrid",
  "CNG",
  "LPG",
  "Biodiesel",
  "Hydrogen",
  "E85",
  "Battery Electric",
];

const regions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa",
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Australia",
];

const AddVehicleSection = () => {
  const [vehicleData, setVehicleData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push("/login");
  }
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();
  console.log(canView, 'canView...........................')
  // Check if user has permission to view vehicles
  if (!canView('vehicle')) {
    return (
      <div className="p-8 text-center text-gray-500">
        You don't have permission to view vehicles.
      </div>
    );
  }
        const [formData, setFormData] = useState<VehicleFormData>(empty);
  useEffect(()=>{
    console.log(formData, 'canView...........................')
  }, [formData])

  console.log(formData, 'formData...........................')

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "asc",
    page: 1,
    limit: 10,
  });
  function getPurchaseYears(modelYear: number) {
    return Array.from(
      { length: currentYear - modelYear + 1 }, // +1 to include current year
      (_, i) => modelYear + i
    );
  }
  
  // In the component
  const [purchaseYears, setPurchaseYears] = useState<number[]>([]);
  
  // 2. Add useEffect to update purchase years
  useEffect(() => {
    if (formData.modelYear) {
      const modelYearNum = Number(formData.modelYear);
      setPurchaseYears(getPurchaseYears(modelYearNum));
    } else {
      setPurchaseYears([]);
    }
  }, [formData.modelYear]);

  // Handle form field changes
  const handleFormChange = (field: string, value: string) => {
    // Handle model year change - update purchase years
    if (field === 'modelYear') {
      const modelYearNum = Number(value);
      const newPurchaseYears = getPurchaseYears(modelYearNum);
      setPurchaseYears(newPurchaseYears);
      // Clear purchase year when model year changes
      setFormData(prev => ({
        ...prev,
        modelYear: value,
        purchaseYear: ""
      }));
      return;
    }

    // Handle all other fields
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.search && { search: filters.search }),
      });

      const response = await getRequest(
        `vehicles/getVehicles?${queryParams}`,
        tokenData.accessToken
      );
      if (response.success) {
        setVehicleData(response.data.vehicles || []);
      } else {
        //toast.error(response.message || "Failed to fetch vehicles");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch vehicles");
      console.log(error, 'error')
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    try {
      const response = await postRequest(
        `vehicles/deleteVehicle/${vehicleId}`,
        {},
        "Vehicle Deleted Successfully",
        tokenData.accessToken,
        "delete"
      );
      if (response.success) {
        toast.success("Vehicle Deleted Successfully");
        fetchVehicles(); // Refresh the list
      } else {
        // toast.error(response.message || "Failed to delete vehicle");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to delete vehicle");
      console.log(error, 'error')
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the request body according to the API specification
    const requestBody = {
      vehicleType: formData.vehicleType,
      make: formData.make,
      model: formData.model,
      modelYear: Number(formData.modelYear),
      purchaseYear: Number(formData.purchaseYear) || 0,
      fuelType: formData.fuelType,
      secondaryFuelType: formData.secondaryFuelType || "",
      fuelConsumptionRate: {
        value: Number(formData.fuelConsumptionValue) || 0,
        unit: formData.fuelConsumptionUnit || "L/100km",
      },
      electricityConsumptionRate: {
        value: Number(formData.electricityConsumptionValue) || 0,
        unit: formData.electricityConsumptionUnit || "kWh/100km",
      },
      annualMileage: {
        value: Number(formData.annualMileageValue) || 0,
        unit: formData.annualMileageUnit || "km",
      },
      emissionFactors: {
        CO2: Number(formData.emissionCO2) || 0,
        CH4: Number(formData.emissionCH4) || 0,
        N2O: Number(formData.emissionN2O) || 0,
        HFC: 0, // Default value as per API specification
      },
      emissionStandard: formData.emissionStandard || "Euro 6",
      averageSpeed: Number(formData.averageSpeed) || 0,
      region: formData.region || "",
      dataSource: formData.dataSource || "Manufacturer Specs",
      notes: formData.notes || "",
    };

    try {
      let response;

      if (editingItem) {
        // Update existing vehicle
        const vehicleId = editingItem.id || editingItem._id;
        response = await postRequest(
          `vehicles/updateVehicle/${vehicleId}`,
          requestBody,
          "Vehicle Updated Successfully",
          tokenData.accessToken,
          "put"
        );
      } else {
        // Add new vehicle
        response = await postRequest(
          "vehicles/addVehicle",
          requestBody,
          "Vehicle Added Successfully",
          tokenData.accessToken,
          "post"
        );
      }

      if (response.success) {
        toast.success(
          editingItem
            ? "Vehicle Updated Successfully"
            : "Vehicle Added Successfully"
        );
        setShowForm(false);
        setEditingItem(null);
        setFormData(empty);
        fetchVehicles(); // Refresh the list after adding/updating
      } else {
        // toast.error(response.message || "Operation failed");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "An error occurred");
      console.log(error, 'error')
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData(empty);
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    // Flatten the nested structure for DynamicForm
    const flattenedData = {
      vehicleType: item.vehicleType || "",
      modelYear: item.modelYear?.toString() || "",
      make: item.make || "",
      model: item.model || "",
      purchaseYear: item.purchaseYear?.toString() || "",
      fuelType: item.fuelType || "",
      secondaryFuelType: item.secondaryFuelType || "",
      region: item.region || "",
      fuelConsumptionValue: item.fuelConsumptionRate?.value?.toString() || "",
      fuelConsumptionUnit: item.fuelConsumptionRate?.unit || "",
      electricityConsumptionValue: item.electricityConsumptionRate?.value?.toString() || "",
      electricityConsumptionUnit: item.electricityConsumptionRate?.unit || "",
      annualMileageValue: item.annualMileage?.value?.toString() || "",
      annualMileageUnit: item.annualMileage?.unit || "",
      emissionCO2: item.emissionFactors?.CO2?.toString() || "",
      emissionCH4: item.emissionFactors?.CH4?.toString() || "",
      emissionN2O: item.emissionFactors?.N2O?.toString() || "",
      emissionStandard: item.emissionStandard || "",
      averageSpeed: item.averageSpeed?.toString() || "",
      dataSource: item.dataSource || "",
      notes: item.notes || "",
    };
    setFormData(flattenedData as any);
    setShowForm(true);
  };

  useEffect(() => {
    if (showForm) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [showForm]);

  const getVehicleTypeColor = (type: string) => {
    switch (type) {
      case "EV":
        return "bg-blue-100 text-blue-800";
      case "Hybrid":
        return "bg-green-100 text-green-800";
      case "Passenger Car":
        return "bg-purple-100 text-purple-800";
      case "Light-Duty Truck":
        return "bg-orange-100 text-orange-800";
      case "Heavy-Duty Truck":
        return "bg-red-100 text-red-800";
      case "Forklift":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if vehicle is EV to conditionally enable/disable electricity fields
  const isEV = formData.vehicleType === "EV";

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVehicles(vehicleData.map(vehicle => vehicle.id || vehicle._id));
    } else {
      setSelectedVehicles([]);
    }
  };

  const handleSelectVehicle = (vehicleId: string, checked: boolean) => {
    if (checked) {
      setSelectedVehicles(prev => [...prev, vehicleId]);
    } else {
      setSelectedVehicles(prev => prev.filter(id => id !== vehicleId));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedVehicles.length} selected vehicles?`)) {
      return;
    }

    try {
      const deletePromises = selectedVehicles.map(vehicleId => 
        postRequest(
          `vehicles/deleteVehicle/${vehicleId}`,
          {},
          "Vehicle Deleted Successfully",
          tokenData.accessToken,
          "delete"
        )
      );

      await Promise.all(deletePromises);
      toast.success(`${selectedVehicles.length} vehicles deleted successfully`);
      setSelectedVehicles([]);
      fetchVehicles();
    } catch (error: any) {
      // toast.error(error.message || "Failed to delete some vehicles");
      console.log(error, 'error')
    }
  };

  const handleBulkExport = async () => {
    try {
      // This would typically call an API endpoint to export selected vehicles
      const selectedVehicleData = vehicleData.filter(vehicle => 
        selectedVehicles.includes(vehicle.id || vehicle._id)
      );
      
      // For now, just show a success message
      toast.success(`${selectedVehicles.length} vehicles exported successfully`);
      setSelectedVehicles([]);
    } catch (error: any) {
      //  toast.error(error.message || "Failed to export vehicles");
      console.log(error, 'error')
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Car className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Vehicle Management
          </h3>
        </div>
        <PermissionGuard permission="vehicle.create">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0D5942] text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </PermissionGuard>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-1/2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search vehicles..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="make">Make</option>
              <option value="model">Model</option>
              <option value="vehicleType">Vehicle Type</option>
              <option value="fuelType">Fuel Type</option>
              <option value="modelYear">Model Year</option>
              <option value="region">Region</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange("sortOrder", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>



      {/* Bulk Actions */}
      {selectedVehicles.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-blue-900'>
                {selectedVehicles.length} vehicle{selectedVehicles.length > 1 ? 's' : ''} selected
                  </span>
                </div>
            <div className='flex gap-2'>
              <PermissionGuard permission="vehicle.update">
                <button
                  onClick={handleBulkExport}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
                >
                  Export Selected
                </button>
              </PermissionGuard>
              <PermissionGuard permission="vehicle.delete">
              <button
                  onClick={handleBulkDelete}
                  className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
                >
                  Delete Selected
              </button>
              </PermissionGuard>
              <button
                onClick={() => setSelectedVehicles([])}
                className='bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Vehicle Fleet</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedVehicles.length === vehicleData.length && vehicleData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fuel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Model Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Annual Mileage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  CO₂ Emissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created At 
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading vehicles...
                  </td>
                </tr>
              ) : vehicleData.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No vehicles found. Add your first vehicle to get started.
                  </td>
                </tr>
              ) : (
                vehicleData.map((vehicle,i) => (
                  <tr key={vehicle.id || vehicle._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVehicles.includes(vehicle.id || vehicle._id)}
                        onChange={(e) => handleSelectVehicle(vehicle.id || vehicle._id, e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">VH-{i+1}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.region}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${getVehicleTypeColor(
                          vehicle.vehicleType
                        )}`}
                      >
                        {vehicle.vehicleType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehicle.fuelType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehicle.modelYear}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehicle.annualMileage?.value &&
                      vehicle.annualMileage?.unit
                        ? `${vehicle.annualMileage.value} ${vehicle.annualMileage.unit}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehicle.emissionFactors?.CO2
                        ? `${vehicle.emissionFactors.CO2} g/km`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(vehicle.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehicle.createdBy?.firstName || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <PermissionGuard permission="vehicle.update">
                          <button
                            onClick={() => startEdit(vehicle)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        {/* <PermissionGuard permission="vehicle.delete">
                          <button
                            onClick={() =>
                              deleteVehicle(vehicle.id || vehicle._id)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </PermissionGuard> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-gray-800'>
              {editingItem ? 'Edit Vehicle' : 'Add Vehicle'}
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
          
          <form onSubmit={handleFormSubmit} className='space-y-4'>
            {/* Row 1: Vehicle Type & Model Year */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Vehicle Type *
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleFormChange('vehicleType', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Model Year *
                </label>
                <select
                  value={formData.modelYear}
                  onChange={(e) => handleFormChange('modelYear', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select model year</option>
                  {modelYears.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Make & Model */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Make *
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => handleFormChange('make', e.target.value)}
                  placeholder="e.g., Toyota, Ford, Tesla"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleFormChange('model', e.target.value)}
                  placeholder="e.g., Camry, F-150, Model 3"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Row 3: Purchase Year & Fuel Type */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Purchase Year
                </label>
                <select
                  value={formData.purchaseYear}
                  onChange={(e) => handleFormChange('purchaseYear', e.target.value)}
                  disabled={!formData.modelYear}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="">Select purchase year</option>
                  {purchaseYears.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Fuel Type *
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleFormChange('fuelType', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select fuel type</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Secondary Fuel Type & Region */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Secondary Fuel Type
                </label>
                <select
                  value={formData.secondaryFuelType}
                  onChange={(e) => handleFormChange('secondaryFuelType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select secondary fuel type</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleFormChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 5: Fuel Consumption */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Fuel Consumption Value
                </label>
                <input
                  type="number"
                  value={formData.fuelConsumptionValue}
                  onChange={(e) => handleFormChange('fuelConsumptionValue', e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Fuel Consumption Unit
                </label>
                <select
                  value={formData.fuelConsumptionUnit}
                  onChange={(e) => handleFormChange('fuelConsumptionUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select unit</option>
                  {fuelCombustionUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 6: Electricity Consumption */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Electricity Consumption Value
                </label>
                <input
                  type="number"
                  value={formData.electricityConsumptionValue}
                  onChange={(e) => handleFormChange('electricityConsumptionValue', e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Electricity Consumption Unit
                </label>
                <select
                  value={formData.electricityConsumptionUnit}
                  onChange={(e) => handleFormChange('electricityConsumptionUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select unit</option>
                  {electricityConsumptionUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 7: Annual Mileage */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Annual Mileage Value
                </label>
                <input
                  type="number"
                  value={formData.annualMileageValue}
                  onChange={(e) => handleFormChange('annualMileageValue', e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Annual Mileage Unit
                </label>
                <select
                  value={formData.annualMileageUnit}
                  onChange={(e) => handleFormChange('annualMileageUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select unit</option>
                  {annualMileageUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 8: Emissions */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  CO₂ Emissions (g/km)
                </label>
                <input
                  type="text"
                  value={formData.emissionCO2}
                  onChange={(e) => handleFormChange('emissionCO2', e.target.value)}
                  placeholder="CO₂ emissions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  CH₄ Emissions (g/km)
                </label>
                <input
                  type="text"
                  value={formData.emissionCH4}
                  onChange={(e) => handleFormChange('emissionCH4', e.target.value)}
                  placeholder="CH₄ emissions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  N₂O Emissions (g/km)
                </label>
                <input
                  type="text"
                  value={formData.emissionN2O}
                  onChange={(e) => handleFormChange('emissionN2O', e.target.value)}
                  placeholder="N₂O emissions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Row 9: Emission Standard & Average Speed */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Emission Standard
                </label>
                <select
                  value={formData.emissionStandard}
                  onChange={(e) => handleFormChange('emissionStandard', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select emission standard</option>
                  {EMISSION_STANDARDS_OPTIONS.map(standard => (
                    <option key={standard} value={standard}>{standard}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Average Speed (km/h)
                </label>
                <input
                  type="text"
                  value={formData.averageSpeed}
                  onChange={(e) => handleFormChange('averageSpeed', e.target.value)}
                  placeholder="Enter average speed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Row 10: Data Source & Notes */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Data Source
                </label>
                <select
                  value={formData.dataSource}
                  onChange={(e) => handleFormChange('dataSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select data source</option>
                  {dataSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  placeholder="Enter any additional notes or comments about the vehicle"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className='flex gap-3 pt-4'>
              <button
                type='submit'
                className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2'
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {editingItem ? 'Update Vehicle' : 'Save Vehicle'}
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
    </div>
  );
};

export default AddVehicleSection;
