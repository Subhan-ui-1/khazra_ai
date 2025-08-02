"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Save,
  X,
  Edit3,
  Trash2,
  Building2,
  Search,
  Filter,
} from "lucide-react";
import { postRequest, getRequest } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import { safeLocalStorage } from "@/utils/localStorage";

// Define TypeScript interfaces
interface FacilityFormData {
  facilityName: string;
  fullAddress: string;
  city: string;
  stateProvince: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  facilityType: string;
  floorArea: string;
  numberOfEmployees: string;
  status: string;
}

interface FilterState {
  search: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

const facilityTypes = [
  "Office",
  "Warehouse",
  "Factory",
  "Retail",
  "Laboratory",
  "Other",
];

const statusOptions = [
  "Active",
  "Inactive",
    'Archived',
  //   'Under Construction',
  //   'Planned'
];

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Australia",
  "Brazil",
  "Mexico",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Egypt",
  "Saudi Arabia",
  "UAE",
  "Turkey",
  "Russia",
  "South Korea",
];

const AddFacilitySection = () => {
  const [facilityData, setFacilityData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const router = useRouter();
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();

  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push("/login");
  }

  // Check if user has permission to view facilities
  if (!canView('facilities')) {
    return (
      <div className="p-8 text-center text-gray-500">
        You don't have permission to view facilities.
      </div>
    );
  }

  const [formData, setFormData] = useState<FacilityFormData>({
    facilityName: "",
    fullAddress: "",
    city: "",
    stateProvince: "",
    country: "",
    postalCode: "",
    latitude: 0,
    longitude: 0,
    facilityType: "",
    floorArea: "",
    numberOfEmployees: "",
    status: "",
  });

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "asc",
    page: 1,
    limit: 10,
  });

  // Get user location and organization ID on component mount
  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
          console.log("Location detected:", { latitude, longitude });
        },
        (error) => {
          console.log("Location detection failed:", error.message);
          // Set default coordinates (New York)
          const defaultLat = 40.28;
          const defaultLng = 74.6;
          setLocation({ latitude: defaultLat, longitude: defaultLng });
          setFormData((prev) => ({
            ...prev,
            latitude: defaultLat,
            longitude: defaultLng,
          }));
          console.log("Using default location:", {
            latitude: defaultLat,
            longitude: defaultLng,
          });
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
      // Set default coordinates
      const defaultLat = 40.28;
      const defaultLng = 74.6;
      setLocation({ latitude: defaultLat, longitude: defaultLng });
      setFormData((prev) => ({
        ...prev,
        latitude: defaultLat,
        longitude: defaultLng,
      }));
    }

    fetchFacilities();
  }, [filters]);

  const getOrganizationId = (): string => {
    try {
      const user = JSON.parse(safeLocalStorage.getItem("user") || "{}");
      return user.organization || "";
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return "";
    }
  };

  const fetchFacilities = async () => {
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
        `facilities/getFacilities?${queryParams}`,
        tokenData.accessToken
      );
      if (response.success) {
        setFacilityData(response.data.facilities || []);
      } else {
        toast.error(response.message || "Failed to fetch facilities");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch facilities");
    } finally {
      setLoading(false);
    }
  };

  const deleteFacility = async (facilityId: string) => {
    try {
      const response = await postRequest(
        `facilities/deleteFacilities/${facilityId}`,
        {},
        "Facility Deleted Successfully",
        tokenData.accessToken,
        "delete"
      );
      if (response.success) {
        toast.success("Facility Deleted Successfully");
        fetchFacilities(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete facility");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete facility");
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.facilityName ||
      !formData.fullAddress ||
      !formData.city ||
      !formData.stateProvince ||
      !formData.country ||
      !formData.postalCode ||
      !formData.facilityType ||
      !formData.floorArea ||
      !formData.status
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare facility data
    const facilityData = {
      facilityName: formData.facilityName,
      fullAddress: formData.fullAddress,
      city: formData.city,
      stateProvince: formData.stateProvince,
      country: formData.country,
      postalCode: formData.postalCode,
      latitude: location.latitude,
      longitude: location.longitude,
      facilityType: formData.facilityType,
      floorArea: parseInt(formData.floorArea),
      numberOfEmployees: parseInt(formData.numberOfEmployees) || 0,
      status: formData.status,
    };

    try {
      let response;

      if (editingItem) {
        // Update existing facility
        const facilityId = editingItem.id || editingItem._id;
        response = await postRequest(
          `facilities/updateFacilities/${facilityId}`,
          facilityData,
          "Facility Updated Successfully",
          tokenData.accessToken,
          "put"
        );
      } else {
        // Add new facility
        response = await postRequest(
          "facilities/createFacilities",
          { ...facilityData, organizationId: getOrganizationId() },
          "Facility Created Successfully",
          tokenData.accessToken,
          "post"
        );
      }

      if (response.success) {
        toast.success(
          editingItem
            ? "Facility Updated Successfully"
            : "Facility Created Successfully"
        );
        setShowForm(false);
        setEditingItem(null);
        setFormData({
          facilityName: "",
          fullAddress: "",
          city: "",
          stateProvince: "",
          country: "",
          postalCode: "",
          latitude: 0,
          longitude: 0,
          facilityType: "",
          floorArea: "",
          numberOfEmployees: "",
          status: "",
        });
        fetchFacilities(); // Refresh the list after adding/updating
      } else {
        toast.error(response.message || "Operation failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      facilityName: item.facilityName || "",
      fullAddress: item.fullAddress || "",
      city: item.city || "",
      stateProvince: item.stateProvince || "",
      country: item.country || "",
      postalCode: item.postalCode || "",
      latitude: item.latitude || 0,
      longitude: item.longitude || 0,
      facilityType: item.facilityType || "",
      floorArea: item.floorArea?.toString() || "",
      numberOfEmployees: item.numberOfEmployees?.toString() || "",
      status: item.status || "",
    });
    setShowForm(true);
  };

  const getFacilityTypeColor = (type: string) => {
    switch (type) {
      case "Office":
        return "bg-blue-100 text-blue-800";
      case "Warehouse":
        return "bg-orange-100 text-orange-800";
      case "Retail":
        return "bg-green-100 text-green-800";
      case "Factory":
        return "bg-purple-100 text-purple-800";
      case "Laboratory":
        return "bg-teal-100 text-teal-800";
      case "Other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Archived":
        return "bg-red-100 text-red-800";
      //   case 'Retired': return 'bg-gray-100 text-gray-800';
      //   case 'Under Construction': return 'bg-yellow-100 text-yellow-800';
      //   case 'Planned': return 'bg-blue-100 text-blue-800';
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          <Building2 className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Facility Management
          </h3>
        </div>
        <PermissionGuard permission="facilities.create">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Facility</span>
          </button>
        </PermissionGuard>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-1/2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search facilities..."
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
              <option value="facilityName">Facility Name</option>
              <option value="facilityType">Facility Type</option>
              <option value="status">Status</option>
              <option value="country">Country</option>
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
              {editingItem ? "Edit" : "Add"} Facility
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
            {/* Facility Name and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility Name *
                </label>
                <input
                  type="text"
                  value={formData.facilityName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      facilityName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter facility name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility Type *
                </label>
                <select
                  value={formData.facilityType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      facilityType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Facility Type</option>
                  {facilityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address *
              </label>
              <textarea
                value={formData.fullAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Enter complete address"
                required
              />
            </div>

            {/* City, State/Province, Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter city"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  value={formData.stateProvince}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stateProvince: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter state or province"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Postal Code, Floor Area, Number of Employees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter postal code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Area (sq ft) *
                </label>
                <input
                  type="number"
                  value={formData.floorArea}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      floorArea: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter floor area"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Employees
                </label>
                <input
                  type="number"
                  value={formData.numberOfEmployees}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      numberOfEmployees: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter number of employees"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Info */}
            {/* <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                📍 Location Information
              </p>
              <p className="text-xs text-gray-600">
                Latitude: {location.latitude.toFixed(6)} | Longitude: {location.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Location detected automatically from your device
              </p>
            </div> */}

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
                <span>{editingItem ? "Update" : "Save"} Facility</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Facility Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">
            Facility Directory
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Facility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Floor Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
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
                    Loading facilities...
                  </td>
                </tr>
              ) : facilityData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No facilities found. Add your first facility to get started.
                  </td>
                </tr>
              ) : (
                facilityData.map((facility) => (
                  <tr
                    key={facility.id || facility._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {facility.facilityName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {facility.fullAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getFacilityTypeColor(
                          facility.facilityType
                        )}`}
                      >
                        {facility.facilityType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {facility.city}, {facility.stateProvince}
                      </div>
                      <div className="text-sm text-gray-500">
                        {facility.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {facility.floorArea
                        ? `${facility.floorArea.toLocaleString()} sq ft`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {facility.numberOfEmployees
                        ? facility.numberOfEmployees.toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          facility.status
                        )}`}
                      >
                        {facility.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <PermissionGuard permission="facilities.update">
                          <button
                            onClick={() => startEdit(facility)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission="facilities.delete">
                          <button
                            onClick={() =>
                              deleteFacility(facility.id || facility._id)
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

export default AddFacilitySection;
