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
  postalCode: string;
  latitude: number;
  longitude: number;
  facilityType: string;
  customFacilityType: string;
  floorArea: string;
  numberOfEmployees: string;
  status: string;
  country: string;
  stateProvince: string;
  city: string;
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
  "United Arab Emirates",
  "Saudi Arabia",
];

// States/Emirates for UAE
const uaeStates = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah"
];

// States/Provinces for Saudi Arabia
const saudiStates = [
  "Riyadh",
  "Makkah",
  "Eastern Province",
  "Asir",
  "Qassim",
  "Hail",
  "Tabuk",
  "Northern Borders",
  "Jazan",
  "Najran",
  "Al Bahah",
  "Al Jouf"
];

// Cities for UAE states
const uaeCities = {
  "Abu Dhabi": ["Abu Dhabi City", "Al Ain", "Al Dhafra", "Al Ruwais", "Liwa Oasis"],
  "Dubai": ["Dubai City", "Jebel Ali", "Hatta", "Al Aweer", "Al Qusais"],
  "Sharjah": ["Sharjah City", "Khor Fakkan", "Kalba", "Dibba Al-Hisn", "Al Dhaid"],
  "Ajman": ["Ajman City", "Al Manama", "Masfout"],
  "Umm Al Quwain": ["Umm Al Quwain City", "Al Sinniyah", "Al Raas"],
  "Ras Al Khaimah": ["Ras Al Khaimah City", "Al Rams", "Al Jazirah Al Hamra"],
  "Fujairah": ["Fujairah City", "Dibba", "Khor Fakkan", "Kalba"]
};

// Cities for Saudi Arabia states
const saudiCities = {
  "Riyadh": ["Riyadh City", "Al Kharj", "Al Diriyah", "Al Majma'ah", "Al Zulfi"],
  "Makkah": ["Mecca", "Jeddah", "Taif", "Rabigh", "Al Lith"],
  "Eastern Province": ["Dammam", "Al Khobar", "Dhahran", "Al Jubail", "Al Ahsa"],
  "Asir": ["Abha", "Khamis Mushait", "Bisha", "Najran", "Ranyah"],
  "Qassim": ["Buraydah", "Unaizah", "Al Rass", "Al Badayea", "Al Mithnab"],
  "Hail": ["Hail City", "Al Ghat", "Al Shinan", "Al Sulaimi"],
  "Tabuk": ["Tabuk City", "Al Wajh", "Duba", "Haql", "Umluj"],
  "Northern Borders": ["Arar", "Rafha", "Turaif"],
  "Jazan": ["Jazan City", "Abu Arish", "Sabya", "Samtah", "Al Ahad"],
  "Najran": ["Najran City", "Sharurah", "Badr Al Janub", "Yadamah"],
  "Al Bahah": ["Al Bahah City", "Baljurashi", "Al Mikhwah", "Al Aqiq"],
  "Al Jouf": ["Sakaka", "Qurayyat", "Dumat Al Jandal", "Tabarjal"]
};

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

const AddFacilitySection = () => {
  const [facilityData, setFacilityData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [stateOptions, setStateOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [cityOptions, setCityOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
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
    postalCode: "",
    latitude: 0,
    longitude: 0,
    facilityType: "",
    customFacilityType: "",
    floorArea: "",
    numberOfEmployees: "",
    status: "",
    country: "",
    stateProvince: "",
    city: "",
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

  // Get state options based on selected country
  const getStateOptions = (country: string) => {
    switch (country) {
      case "United Arab Emirates":
        return uaeStates.map(state => ({ value: state, label: state }));
      case "Saudi Arabia":
        return saudiStates.map(state => ({ value: state, label: state }));
      default:
        return [];
    }
  };

  // Get city options based on selected country and state
  const getCityOptions = (country: string, state: string) => {
    if (!country || !state) return [];
    
    switch (country) {
      case "United Arab Emirates":
        return (uaeCities[state as keyof typeof uaeCities] || []).map(city => ({ value: city, label: city }));
      case "Saudi Arabia":
        return (saudiCities[state as keyof typeof saudiCities] || []).map(city => ({ value: city, label: city }));
      default:
        return [];
    }
  };

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

  // Handle form field changes
  const handleFormChange = (field: string, value: string) => {
    // Handle country change
    if (field === 'country') {
      const newStateOptions = getStateOptions(value);
      setStateOptions(newStateOptions);
      setCityOptions([]);
      setSelectedCountry(value);
      setSelectedState("");
      setSelectedCity("");
      // Update form data and clear dependent fields
      setFormData(prev => ({
        ...prev,
        country: value,
        stateProvince: "",
        city: ""
      }));
      return;
    }

    // Handle state change
    if (field === 'stateProvince') {
      const newCityOptions = getCityOptions(selectedCountry, value);
      setCityOptions(newCityOptions);
      setSelectedState(value);
      setSelectedCity("");
      // Update form data and clear dependent fields
      setFormData(prev => ({
        ...prev,
        stateProvince: value,
        city: ""
      }));
      return;
    }

    // Handle city change
    if (field === 'city') {
      setSelectedCity(value);
      setFormData(prev => ({
        ...prev,
        city: value
      }));
      return;
    }

    // Handle all other fields
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      facilityType: formData.facilityType === "Other" ? formData.customFacilityType : formData.facilityType,
      customFacilityType: formData.customFacilityType || "",
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
        resetForm();
        fetchFacilities(); // Refresh the list after adding/updating
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
    setFormData({
      facilityName: "",
      fullAddress: "",
      postalCode: "",
      latitude: 0,
      longitude: 0,
      facilityType: "",
      customFacilityType: "",
      floorArea: "",
      numberOfEmployees: "",
      status: "",
      country: "",
      stateProvince: "",
      city: "",
    });
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setStateOptions([]);
    setCityOptions([]);
  };

  const startEdit = (item: any) => {
    // Check if the facility type is custom (not in predefined list)
    const isCustomType = !facilityTypes.includes(item.facilityType);
    
    // Set state and city options based on the item's country and state
    const itemStateOptions = getStateOptions(item.country);
    const itemCityOptions = getCityOptions(item.country, item.stateProvince);
    
    setStateOptions(itemStateOptions);
    setCityOptions(itemCityOptions);
    setSelectedCountry(item.country);
    setSelectedState(item.stateProvince);
    setSelectedCity(item.city);
    
    setEditingItem(item);
    setFormData({
      facilityName: item.facilityName || "",
      fullAddress: item.fullAddress || "",
      postalCode: item.postalCode || "",
      latitude: item.latitude || 0,
      longitude: item.longitude || 0,
      facilityType: isCustomType ? "Other" : (item.facilityType || ""),
      customFacilityType: isCustomType ? (item.facilityType || "") : (item.customFacilityType || ""),
      floorArea: item.floorArea?.toString() || "",
      numberOfEmployees: item.numberOfEmployees?.toString() || "",
      status: item.status || "",
      country: item.country || "",
      stateProvince: item.stateProvince || "",
      city: item.city || "",
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

  useEffect(() => {
    if (showForm) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [showForm]);

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
      setSelectedFacilities(facilityData.map(facility => facility.id || facility._id));
    } else {
      setSelectedFacilities([]);
    }
  };

  const handleSelectFacility = (facilityId: string, checked: boolean) => {
    if (checked) {
      setSelectedFacilities(prev => [...prev, facilityId]);
    } else {
      setSelectedFacilities(prev => prev.filter(id => id !== facilityId));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedFacilities.length} selected facilities?`)) {
      return;
    }

    try {
      const deletePromises = selectedFacilities.map(facilityId => 
        postRequest(
          `facilities/deleteFacilities/${facilityId}`,
          {},
          "Facility Deleted Successfully",
          tokenData.accessToken,
          "delete"
        )
      );

      await Promise.all(deletePromises);
      toast.success(`${selectedFacilities.length} facilities deleted successfully`);
      setSelectedFacilities([]);
      fetchFacilities();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete some facilities");
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      const updatePromises = selectedFacilities.map(facilityId => 
        postRequest(
          `facilities/updateFacilities/${facilityId}`,
          { status: newStatus },
          "Facility Updated Successfully",
          tokenData.accessToken,
          "put"
        )
      );

      await Promise.all(updatePromises);
      toast.success(`${selectedFacilities.length} facilities status updated successfully`);
      setSelectedFacilities([]);
      fetchFacilities();
    } catch (error: any) {
      toast.error(error.message || "Failed to update some facilities");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

      {/* Bulk Actions */}
      {selectedFacilities.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-blue-900'>
                {selectedFacilities.length} facilit{selectedFacilities.length > 1 ? 'ies' : 'y'} selected
              </span>
            </div>
            <div className='flex gap-2'>
              <PermissionGuard permission="facilities.update">
                <select
                  onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 border-0'
                >
                  <option value="">Update Status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </PermissionGuard>
              <button
                onClick={() => setSelectedFacilities([])}
                className='bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
              >
                Clear Selection
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
                  <input
                    type="checkbox"
                    checked={selectedFacilities.length === facilityData.length && facilityData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
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
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created By
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
                    colSpan={9}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading facilities...
                  </td>
                </tr>
              ) : facilityData.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No facilities found. Add your first facility to get started.
                  </td>
                </tr>
              ) : (
                facilityData.map((facility,i) => (
                  <tr key={facility.id || facility._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.includes(facility.id || facility._id)}
                        onChange={(e) => handleSelectFacility(facility.id || facility._id, e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">FC-{i+1}</div>
                    </td>
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
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${getFacilityTypeColor(
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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(facility.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {facility.createdBy?.firstName || '-'}
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
              {editingItem ? 'Edit Facility' : 'Add Facility'}
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
            {/* Row 1: Facility Name & Facility Type */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Facility Name *
                </label>
                <input
                  type="text"
                  value={formData.facilityName}
                  onChange={(e) => handleFormChange('facilityName', e.target.value)}
                  placeholder="Enter facility name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Facility Type *
                </label>
                <select
                  value={formData.facilityType}
                  onChange={(e) => handleFormChange('facilityType', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select facility type</option>
                  {facilityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Facility Type - Full Width */}
            {formData.facilityType === "Other" && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Custom Facility Type *
                  </label>
                  <input
                    type="text"
                    value={formData.customFacilityType}
                    onChange={(e) => handleFormChange('customFacilityType', e.target.value)}
                    placeholder="Enter custom facility type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            )}

            {/* Row 2: Country & State */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Country *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleFormChange('country', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  State/Province *
                </label>
                <select
                  value={formData.stateProvince}
                  onChange={(e) => handleFormChange('stateProvince', e.target.value)}
                  required
                  disabled={!formData.country}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="">Select state/province</option>
                  {stateOptions.map(state => (
                    <option key={state.value} value={state.value}>{state.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: City & Full Address */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleFormChange('city', e.target.value)}
                  required
                  disabled={!formData.stateProvince}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="">Select city</option>
                  {cityOptions.map(city => (
                    <option key={city.value} value={city.value}>{city.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Address *
                </label>
                <input
                  type="text"
                  value={formData.fullAddress}
                  onChange={(e) => handleFormChange('fullAddress', e.target.value)}
                  placeholder="Enter complete address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Row 4: Postal Code & Floor Area */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleFormChange('postalCode', e.target.value)}
                  placeholder="Enter postal code"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Floor Area (sq ft) *
                </label>
                <input
                  type="text"
                  value={formData.floorArea}
                  onChange={(e) => handleFormChange('floorArea', e.target.value)}
                  placeholder="Enter floor area"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Row 5: Number of Employees & Status */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Number of Employees
                </label>
                <select
                  value={formData.numberOfEmployees}
                  onChange={(e) => handleFormChange('numberOfEmployees', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select number of employees</option>
                  {NUMBER_OF_EMPLOYEES_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
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
                {editingItem ? 'Update Facility' : 'Save Facility'}
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

export default AddFacilitySection;
