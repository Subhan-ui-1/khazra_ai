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

  const handleSubmit = async () => {
    // Prepare the request body according to the API specification
    const requestBody = {
      vehicleType: formData.vehicleType,
      make: formData.make,
      model: formData.model,
      modelYear: formData.modelYear,
      purchaseYear: formData.purchaseYear,
      fuelType: formData.fuelType,
      secondaryFuelType: formData.secondaryFuelType,
      fuelConsumptionRate: {
        value: formData.fuelConsumptionRate.value,
        unit: formData.fuelConsumptionRate.unit,
      },
      electricityConsumptionRate: {
        value: formData.electricityConsumptionRate.value,
        unit: formData.electricityConsumptionRate.unit,
      },
      annualMileage: {
        value: formData.annualMileage.value,
        unit: formData.annualMileage.unit,
      },
      emissionFactors: {
        CO2: formData.emissionFactors.CO2,
        CH4: formData.emissionFactors.CH4,
        N2O: formData.emissionFactors.N2O,
        HFC: formData.emissionFactors.HFC, // Default value as per API specification
      },
      emissionStandard: formData.emissionStandard,
      averageSpeed: formData.averageSpeed,
      region: formData.region,
      dataSource: formData.dataSource,
      notes: formData.notes,
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

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

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

      {showForm && (
        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-medium text-green-900">
              {editingItem ? "Edit" : "Add"} Vehicle
            </h4>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Vehicle Type and Model Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      vehicleType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Year *
                </label>
                <select
                  value={formData.modelYear}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      modelYear: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Model Year</option>
                  {modelYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Make and Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make *
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      make: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Toyota, Ford, Tesla"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      model: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Camry, F-150, Model 3"
                  required
                />
              </div>
            </div>

            {/* Purchase Year and Fuel Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Year
                </label>
                <select
                  value={formData.purchaseYear}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      purchaseYear: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Purchase Year</option>
                  {purchaseYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type *
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      fuelType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Secondary Fuel Type and Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Fuel Type
                </label>
                <select
                  value={formData.secondaryFuelType}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      secondaryFuelType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Secondary Fuel Type</option>
                  {fuelTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      region: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fuel Combustion Rate - Disabled for EV */}
            <div
              className={`bg-gray-50 p-4 rounded-lg ${
                isEV ? "opacity-50" : ""
              }`}
            >
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                Fuel Combustion Rate{" "}
                {isEV && (
                  <span className="text-gray-500">(Not applicable for EV)</span>
                )}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    value={formData.fuelConsumptionRate.value}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        fuelConsumptionRate: {
                          ...prev.fuelConsumptionRate,
                          value: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter value"
                    step="0.01"
                    disabled={isEV}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.fuelConsumptionRate.unit}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        fuelConsumptionRate: {
                          ...prev.fuelConsumptionRate,
                          unit: e.target.value as
                            | "L/100km"
                            | "gal/mile"
                            | "L/hr",
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    disabled={isEV}
                  >
                    <option value="">Select Unit</option>
                    {fuelCombustionUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Electricity Consumption Rate - Enabled only for EV */}
            <div
              className={`bg-gray-50 p-4 rounded-lg ${
                !isEV ? "opacity-50" : ""
              }`}
            >
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                Electricity Consumption Rate{" "}
                {!isEV && (
                  <span className="text-gray-500">
                    (Only applicable for EV)
                  </span>
                )}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    value={formData.electricityConsumptionRate.value}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        electricityConsumptionRate: {
                          ...prev.electricityConsumptionRate,
                          value: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter value"
                    step="0.01"
                    disabled={!isEV}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.electricityConsumptionRate.unit}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        electricityConsumptionRate: {
                          ...prev.electricityConsumptionRate,
                          unit: e.target.value as "kWh/100km" | "kWh/mile",
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    disabled={!isEV}
                  >
                    <option value="">Select Unit</option>
                    {electricityConsumptionUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Annual Mileage */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                Annual Mileage
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    value={formData.annualMileage.value}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        annualMileage: {
                          ...prev.annualMileage,
                          value: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter value"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.annualMileage.unit}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        annualMileage: {
                          ...prev.annualMileage,
                          unit: e.target.value as "km" | "miles",
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Unit</option>
                    {annualMileageUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Emission Factors */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                Emission Factors (g/km)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    CO₂
                  </label>
                  <input
                    type="number"
                    value={formData.emissionFactors.CO2}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        emissionFactors: {
                          ...prev.emissionFactors,
                          CO2: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="CO₂ emissions"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    CH₄
                  </label>
                  <input
                    type="number"
                    value={formData.emissionFactors.CH4}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        emissionFactors: {
                          ...prev.emissionFactors,
                          CH4: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="CH₄ emissions"
                    step="0.001"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    N₂O
                  </label>
                  <input
                    type="number"
                    value={formData.emissionFactors.N2O}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        emissionFactors: {
                          ...prev.emissionFactors,
                          N2O: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="N₂O emissions"
                    step="0.001"
                  />
                </div>
              </div>
            </div>

            {/* Emission Standard, Average Speed, and Data Source */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emission Standard
                </label>
                <select
                  value={formData.emissionStandard}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      emissionStandard: e.target.value as
                        | "Euro 6"
                        | "EPA Tier 3"
                        | "China VI"
                        | "Euro 5"
                        | "EPA Tier 2",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Emission Standard</option>
                  {EMISSION_STANDARDS_OPTIONS.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Speed (km/h)
                </label>
                <input
                  type="number"
                  value={formData.averageSpeed}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      averageSpeed: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter average speed"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Source
                </label>
                <select
                  value={formData.dataSource}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      dataSource: e.target.value as
                        | "Manufacturer Specs"
                        | "Fleet Records"
                        | "VCA Database"
                        | "Estimate",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Data Source</option>
                  {dataSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev: VehicleFormData) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Enter any additional notes or comments about the vehicle"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingItem ? "Update" : "Save"} Vehicle</span>
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
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading vehicles...
                  </td>
                </tr>
              ) : vehicleData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No vehicles found. Add your first vehicle to get started.
                  </td>
                </tr>
              ) : (
                vehicleData.map((vehicle) => (
                  <tr
                    key={vehicle.id || vehicle._id}
                    className="hover:bg-gray-50"
                  >
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
                        <PermissionGuard permission="vehicle.delete">
                          <button
                            onClick={() =>
                              deleteVehicle(vehicle.id || vehicle._id)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleSection;
