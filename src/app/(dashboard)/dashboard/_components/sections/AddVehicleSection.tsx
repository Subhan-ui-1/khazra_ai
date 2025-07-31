import React, { useState } from "react";
import { Plus, Save, X, Edit3, Trash2, Car } from "lucide-react";

// Define TypeScript interfaces
interface VehicleFormData {
  vehicleType: string;
  modelYear: string;
  purchaseYear: string;
  fuelCombustionRate: {
    value: string;
    unit: string;
  };
  electricityConsumptionRate: {
    value: string;
    unit: string;
  };
  annualMileage: {
    value: string;
    unit: string;
  };
  dataSource: string;
  make: string;
  model: string;
  fuelType: string;
  secondaryFuelType: string;
  emissionFactors: {
    CO2: string;
    CH4: string;
    N2O: string;
    HFC: string;
  };
  emissionStandard: string;
  averageSpeed: string;
  region: string;
  notes: string;
}

const vehicleTypes = [
  "Passenger Car",
  "Light-Duty Truck",
  "Heavy-Duty Truck",
  "Forklift",
  "Hybrid",
  "EV",
];

const modelYears = Array.from(
  { length: 30 },
  (_, i) => new Date().getFullYear() - i
);
const purchaseYears = Array.from(
  { length: 30 },
  (_, i) => new Date().getFullYear() - i
);

const fuelCombustionUnits = ["L/100km", "gal/mile", "L/hr", "km/L", "mpg"];

const electricityConsumptionUnits = [
  "kWh/100km",
  "kWh/mile",
  "kWh/km",
  "Wh/km",
];

const annualMileageUnits = ["km", "miles", "km/year", "miles/year"];

const dataSources = [
  "Manufacturer Specs",
  "Fleet Records",
  "VCA Database",
  "Estimate",
  "Field Measurement",
  "Historical Data",
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
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleType: "",
    modelYear: "",
    purchaseYear: "",
    fuelCombustionRate: {
      value: "",
      unit: "",
    },
    electricityConsumptionRate: {
      value: "",
      unit: "",
    },
    annualMileage: {
      value: "",
      unit: "",
    },
    dataSource: "",
    make: "",
    model: "",
    fuelType: "",
    secondaryFuelType: "",
    emissionFactors: {
      CO2: "",
      CH4: "",
      N2O: "",
      HFC: "",
    },
    emissionStandard: "",
    averageSpeed: "",
    region: "",
    notes: "",
  });

  const handleSubmit = () => {
    const newRecord = {
      id: editingItem ? editingItem.id : `vehicle_${Date.now()}`,
      ...formData,
      fuelCombustionRate: {
        ...formData.fuelCombustionRate,
        value: parseFloat(formData.fuelCombustionRate.value) || 0,
      },
      electricityConsumptionRate: {
        ...formData.electricityConsumptionRate,
        value: parseFloat(formData.electricityConsumptionRate.value) || 0,
      },
      annualMileage: {
        ...formData.annualMileage,
        value: parseFloat(formData.annualMileage.value) || 0,
      },
      emissionFactors: {
        CO2: parseFloat(formData.emissionFactors.CO2) || 0,
        CH4: parseFloat(formData.emissionFactors.CH4) || 0,
        N2O: parseFloat(formData.emissionFactors.N2O) || 0,
      },
      averageSpeed: parseFloat(formData.averageSpeed) || 0,
    };

    if (editingItem) {
      setVehicleData((prev) =>
        prev.map((item) => (item.id === editingItem.id ? newRecord : item))
      );
    } else {
      setVehicleData((prev) => [...prev, newRecord]);
    }

    setShowForm(false);
    setEditingItem(null);
    setFormData({
      vehicleType: "",
      modelYear: "",
      purchaseYear: "",
      fuelCombustionRate: { value: "", unit: "" },
      electricityConsumptionRate: { value: "", unit: "" },
      annualMileage: { value: "", unit: "" },
      dataSource: "",
      make: "",
      model: "",
      fuelType: "",
      secondaryFuelType: "",
      emissionFactors: { CO2: "", CH4: "", N2O: "", HFC: "" },
      emissionStandard: "",
      averageSpeed: "",
      region: "",
      notes: "",
    });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Car className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Vehicle Management
          </h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
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
                      modelYear: e.target.value,
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
                      purchaseYear: e.target.value,
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
                    value={formData.fuelCombustionRate.value}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        fuelCombustionRate: {
                          ...prev.fuelCombustionRate,
                          value: e.target.value,
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
                    value={formData.fuelCombustionRate.unit}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        fuelCombustionRate: {
                          ...prev.fuelCombustionRate,
                          unit: e.target.value,
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
                          value: e.target.value,
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
                          unit: e.target.value,
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
                          value: e.target.value,
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
                          unit: e.target.value,
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
                          CO2: e.target.value,
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
                          CH4: e.target.value,
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
                          N2O: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="N₂O emissions"
                    step="0.001"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    HFC
                  </label>
                  <input
                    type="number"
                    value={formData.emissionFactors.HFC}
                    onChange={(e) =>
                      setFormData((prev: VehicleFormData) => ({
                        ...prev,
                        emissionFactors: {
                          ...prev.emissionFactors,
                          HFC: e.target.value,
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
                <input
                  type="text"
                  value={formData.emissionStandard}
                  onChange={(e) =>
                    setFormData((prev: VehicleFormData) => ({
                      ...prev,
                      emissionStandard: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Euro 6, Tier 4"
                />
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
                      averageSpeed: e.target.value,
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
                      dataSource: e.target.value,
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
              {vehicleData.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
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
                    {vehicle.annualMileage.value && vehicle.annualMileage.unit
                      ? `${vehicle.annualMileage.value} ${vehicle.annualMileage.unit}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {vehicle.emissionFactors.CO2
                      ? `${vehicle.emissionFactors.CO2} g/km`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(vehicle)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setVehicleData((prev) =>
                            prev.filter((item) => item.id !== vehicle.id)
                          )
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleSection;
