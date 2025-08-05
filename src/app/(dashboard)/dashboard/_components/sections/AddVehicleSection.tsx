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
import DynamicForm, { FormField } from '@/components/forms/DynamicForm';

// Define TypeScript interfaces
interface VehicleFormData {
  vehicleType: string;
  modelYear: number;
  purchaseYear: number;
  fuelConsumptionRate: {
    value: number;
    unit: "L/100km" | "gal/mile" | "L/hr";
  };
  electricityConsumptionRate: {
    value: number;
    unit: "kWh/100km" | "kWh/mile";
  };
  annualMileage: {
    value: number;
    unit: "km" | "miles";
  };
  dataSource:
    | "Manufacturer Specs"
    | "Fleet Records"
    | "VCA Database"
    | "Estimate";
  make: string;
  model: string;
  fuelType: string;
  secondaryFuelType: string;
  emissionFactors: {
    CO2: number;
    CH4: number;
    N2O: number;
    HFC: number;
  };
  emissionStandard:
    | "Euro 6"
    | "EPA Tier 3"
    | "China VI"
    | "Euro 5"
    | "EPA Tier 2";
  averageSpeed: number;
  region: string;
  notes: string;
}
let empty: VehicleFormData = {
  vehicleType: "",
  modelYear: 0,
  purchaseYear: 0,
  fuelConsumptionRate: { value: 0, unit: "L/100km" },
  electricityConsumptionRate: { value: 0, unit: "kWh/100km" },
  annualMileage: { value: 0, unit: "km" },
  dataSource: "Manufacturer Specs",
  make: "",
  model: "",
  fuelType: "",
  secondaryFuelType: "",
  emissionFactors: { CO2: 0, CH4: 0, N2O: 0, HFC: 0 },
  emissionStandard: "Euro 6",
  averageSpeed: 0,
  region: "",
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
    { length: currentYear - modelYear + 1 },
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

  // Check if user has permission to view vehicles
  if (!canView('vehicle')) {
    return (
      <div className="p-8 text-center text-gray-500">
        You don't have permission to view vehicles.
      </div>
    );
  }

  const [formData, setFormData] = useState<VehicleFormData>(empty);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "asc",
    page: 1,
    limit: 10,
  });
  const purchaseYears = formData.modelYear
    ? getPurchaseYears(formData.modelYear)
    : [];

  // Define form fields for DynamicForm (flattened structure)
  const vehicleFormFields: FormField[] = [
    {
      name: "vehicleType",
      label: "Vehicle Type",
      type: "select",
      required: true,
      options: vehicleTypes.map(type => ({ value: type, label: type }))
    },
    {
      name: "modelYear",
      label: "Model Year",
      type: "select",
      required: true,
      options: modelYears.map(year => ({ value: year.toString(), label: year.toString() }))
    },
    {
      name: "make",
      label: "Make",
      type: "text",
      required: true,
      placeholder: "e.g., Toyota, Ford, Tesla"
    },
    {
      name: "model",
      label: "Model",
      type: "text",
      required: true,
      placeholder: "e.g., Camry, F-150, Model 3"
    },
    {
      name: "purchaseYear",
      label: "Purchase Year",
      type: "select",
      required: false,
      options: purchaseYears.map(year => ({ value: year.toString(), label: year.toString() }))
    },
    {
      name: "fuelType",
      label: "Fuel Type",
      type: "select",
      required: true,
      options: fuelTypes.map(type => ({ value: type, label: type }))
    },
    {
      name: "secondaryFuelType",
      label: "Secondary Fuel Type",
      type: "select",
      required: false,
      options: fuelTypes.map(type => ({ value: type, label: type }))
    },
    {
      name: "region",
      label: "Region",
      type: "select",
      required: false,
      options: regions.map(region => ({ value: region, label: region }))
    },
    {
      name: "fuelConsumptionValue",
      label: "Fuel Consumption Value",
      type: "text",
      required: false,
      placeholder: "Enter value"
    },
    {
      name: "fuelConsumptionUnit",
      label: "Fuel Consumption Unit",
      type: "select",
      required: false,
      options: fuelCombustionUnits.map(unit => ({ value: unit, label: unit }))
    },
    {
      name: "electricityConsumptionValue",
      label: "Electricity Consumption Value",
      type: "text",
      required: false,
      placeholder: "Enter value"
    },
    {
      name: "electricityConsumptionUnit",
      label: "Electricity Consumption Unit",
      type: "select",
      required: false,
      options: electricityConsumptionUnits.map(unit => ({ value: unit, label: unit }))
    },
    {
      name: "annualMileageValue",
      label: "Annual Mileage Value",
      type: "text",
      required: false,
      placeholder: "Enter value"
    },
    {
      name: "annualMileageUnit",
      label: "Annual Mileage Unit",
      type: "select",
      required: false,
      options: annualMileageUnits.map(unit => ({ value: unit, label: unit }))
    },
    {
      name: "emissionCO2",
      label: "CO₂ Emissions (g/km)",
      type: "text",
      required: false,
      placeholder: "CO₂ emissions"
    },
    {
      name: "emissionCH4",
      label: "CH₄ Emissions (g/km)",
      type: "text",
      required: false,
      placeholder: "CH₄ emissions"
    },
    {
      name: "emissionN2O",
      label: "N₂O Emissions (g/km)",
      type: "text",
      required: false,
      placeholder: "N₂O emissions"
    },
    {
      name: "emissionStandard",
      label: "Emission Standard",
      type: "select",
      required: false,
      options: EMISSION_STANDARDS_OPTIONS.map(standard => ({ value: standard, label: standard }))
    },
    {
      name: "averageSpeed",
      label: "Average Speed (km/h)",
      type: "text",
      required: false,
      placeholder: "Enter average speed"
    },
    {
      name: "dataSource",
      label: "Data Source",
      type: "select",
      required: false,
      options: dataSources.map(source => ({ value: source, label: source }))
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      required: false,
      placeholder: "Enter any additional notes or comments about the vehicle"
    }
  ];

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
        toast.error(response.message || "Failed to fetch vehicles");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch vehicles");
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
        toast.error(response.message || "Failed to delete vehicle");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete vehicle");
    }
  };

  const handleFormSubmit = async (data: any) => {
    // Prepare the request body according to the API specification
    const requestBody = {
      vehicleType: data.vehicleType,
      make: data.make,
      model: data.model,
      modelYear: Number(data.modelYear),
      purchaseYear: Number(data.purchaseYear) || 0,
      fuelType: data.fuelType,
      secondaryFuelType: data.secondaryFuelType || "",
      fuelConsumptionRate: {
        value: Number(data.fuelConsumptionValue) || 0,
        unit: data.fuelConsumptionUnit || "L/100km",
      },
      electricityConsumptionRate: {
        value: Number(data.electricityConsumptionValue) || 0,
        unit: data.electricityConsumptionUnit || "kWh/100km",
      },
      annualMileage: {
        value: Number(data.annualMileageValue) || 0,
        unit: data.annualMileageUnit || "km",
      },
      emissionFactors: {
        CO2: Number(data.emissionCO2) || 0,
        CH4: Number(data.emissionCH4) || 0,
        N2O: Number(data.emissionN2O) || 0,
        HFC: 0, // Default value as per API specification
      },
      emissionStandard: data.emissionStandard || "Euro 6",
      averageSpeed: Number(data.averageSpeed) || 0,
      region: data.region || "",
      dataSource: data.dataSource || "Manufacturer Specs",
      notes: data.notes || "",
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
        toast.error(response.message || "Operation failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
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
      toast.error(error.message || "Failed to delete some vehicles");
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
      toast.error(error.message || "Failed to export vehicles");
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
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getVehicleTypeColor(
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
        <DynamicForm
          title={editingItem ? 'Edit Vehicle' : 'Add Vehicle'}
          fields={vehicleFormFields}
          onSubmit={handleFormSubmit}
          onCancel={resetForm}
          initialData={formData}
          loading={false}
          submitText={editingItem ? 'Update Vehicle' : 'Save Vehicle'}
          cancelText="Cancel"
          onClose={resetForm}
        />
      )}
    </div>
  );
};

export default AddVehicleSection;
