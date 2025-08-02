import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Edit3, Trash2, Settings, Search, Filter } from 'lucide-react';
import { postRequest, getRequest } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import { safeLocalStorage } from '@/utils/localStorage';

// Define TypeScript interfaces
interface EquipmentFormData {
  facilityId: string;
  equipmentTypeId: string;
  equipmentName: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  capacityValue: string;
  capacityUnit: string;
  efficiency: string;
  installationYear: string;
  status: string;
  notes: string;
}

interface FilterState {
  search: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

const equipmentTypes = [
  'Boiler',
  'Chiller',
  'Compressor',
  'Generator',
  'Heat Exchanger',
  'Motor',
  'Pump',
  'Refrigeration Unit',
  'Transformer',
  'Turbine',
  'Ventilation System',
  'Water Heater'
];

const manufacturers = [
  'ABB',
  'Carrier',
  'Daikin',
  'GE',
  'Hitachi',
  'Johnson Controls',
  'LG',
  'Mitsubishi',
  'Samsung',
  'Siemens',
  'Trane',
  'York'
];

const capacityUnits = [
  'kW',
  'kWh',
  'BTU/hr',
  'tons',
  'HP',
  'CFM',
  'GPM',
  'PSI',
  'RPM',
  'Volts',
  'Amps'
];

const installationYears = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const statusOptions = [
  'Active',
  'Inactive',
//   'Maintenance',
  'Retired',
//   'Under Repair',
//   'Standby'
];

const AddEquipmentSection = () => {
  const [equipmentData, setEquipmentData] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [equipmentTypeData, setEquipmentTypeData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();
  
  const tokenData = JSON.parse(safeLocalStorage.getItem('tokens') || "{}");
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push('/login');
  }

  // Check if user has permission to view equipment
  if (!canView('equipment')) {
    return (
      <div className="p-8 text-center text-gray-500">
        You don't have permission to view equipment.
      </div>
    );
  }

  const [formData, setFormData] = useState<EquipmentFormData>({
    facilityId: '',
    equipmentTypeId: '',
    equipmentName: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    capacityValue: '',
    capacityUnit: '',
    efficiency: '',
    installationYear: '',
    status: '',
    notes: ''
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'asc',
    page: 1,
    limit: 10
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchEquipments();
    fetchFacilities();
    fetchEquipmentTypes();
  }, [filters]);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.search && { search: filters.search })
      });

      const response = await getRequest(`equipments/getEquipments?${queryParams}`, tokenData.accessToken);
      if (response.success) {
        setEquipmentData(response.data.equipments.map((ep:any)=>{
            return {
                ...ep,
                facilityName: ep.facilityId.facilityName,
                equipmentTypeName: ep.equipmentTypeId.equipmentName,
            }
        }) || []);
      } else {
        toast.error(response.message || "Failed to fetch equipments");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch equipments");
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await getRequest('facilities/getFacilities', tokenData.accessToken);
      if (response.success) {
        setFacilities(response.data.facilities || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch facilities:', error);
    }
  };

  const fetchEquipmentTypes = async () => {
    try {
      const response = await getRequest('equipment-types/getEquipmentTypes', tokenData.accessToken);
      if (response.success) {
        setEquipmentTypeData(response.data.equipmentTypes || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch equipment types:', error);
    }
  };

  const deleteEquipment = async (equipmentId: string) => {
    try {
      const response = await postRequest(
        `equipments/deleteEquipment/${equipmentId}`,
        {},
        "Equipment Deleted Successfully",
        tokenData.accessToken,
        'delete'
      );
      if (response.success) {
        toast.success("Equipment Deleted Successfully");
        fetchEquipments(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete equipment");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete equipment");
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.facilityId || !formData.equipmentTypeId || !formData.equipmentName || 
        !formData.manufacturer || !formData.model || !formData.serialNumber || !formData.status) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Prepare equipment data
    const equipmentData = {
      facilityId: formData.facilityId,
      equipmentTypeId: formData.equipmentTypeId,
      equipmentName: formData.equipmentName,
      manufacturer: formData.manufacturer,
      model: formData.model,
      serialNumber: formData.serialNumber,
      capacityValue: parseInt(formData.capacityValue) || 0,
      capacityUnit: formData.capacityUnit,
      efficiency: parseInt(formData.efficiency) || 0,
      installationYear: parseInt(formData.installationYear) || 0,
      status: formData.status,
      notes: formData.notes
    };

    try {
      let response;
      
      if (editingItem) {
        // Update existing equipment
        const equipmentId = editingItem.id || editingItem._id;
        response = await postRequest(
          `equipments/updateEquipment/${equipmentId}`,
          equipmentData,
          "Equipment Updated Successfully",
          tokenData.accessToken,
          'put'
        );
      } else {
        // Add new equipment
        response = await postRequest(
          'equipments/createEquipment',
          equipmentData,
          "Equipment Created Successfully",
          tokenData.accessToken,
          'post'
        );
      }

      if (response.success) {
        toast.success(editingItem ? "Equipment Updated Successfully" : "Equipment Created Successfully");
        setShowForm(false);
        setEditingItem(null);
        setFormData({
          facilityId: '',
          equipmentTypeId: '',
          equipmentName: '',
          manufacturer: '',
          model: '',
          serialNumber: '',
          capacityValue: '',
          capacityUnit: '',
          efficiency: '',
          installationYear: '',
          status: '',
          notes: ''
        });
        fetchEquipments(); // Refresh the list after adding/updating
      } else {
        toast.error(response.message || "Operation failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    console.log(item);
    setFormData({
      facilityId: item.facilityId?._id || '',
      equipmentTypeId: item.equipmentTypeId?._id || '',
      equipmentName: item.equipmentName || '',
      manufacturer: item.manufacturer || '',
      model: item.model || '',
      serialNumber: item.serialNumber || '',
      capacityValue: item.capacityValue?.toString() || '',
      capacityUnit: item.capacityUnit || '',
      efficiency: item.efficiency?.toString() || '',
      installationYear: item.installationYear?.toString() || '',
      status: item.status || '',
      notes: item.notes || ''
    });
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Retired': return 'bg-red-100 text-red-800';
      case 'Under Repair': return 'bg-orange-100 text-orange-800';
      case 'Standby': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEquipmentTypeColor = (type: string) => {
    switch (type) {
      case 'Boiler': return 'bg-red-100 text-red-800';
      case 'Chiller': return 'bg-blue-100 text-blue-800';
      case 'Compressor': return 'bg-green-100 text-green-800';
      case 'Generator': return 'bg-purple-100 text-purple-800';
      case 'Heat Exchanger': return 'bg-orange-100 text-orange-800';
      case 'Motor': return 'bg-indigo-100 text-indigo-800';
      case 'Pump': return 'bg-teal-100 text-teal-800';
      case 'Refrigeration Unit': return 'bg-cyan-100 text-cyan-800';
      case 'Transformer': return 'bg-yellow-100 text-yellow-800';
      case 'Turbine': return 'bg-pink-100 text-pink-800';
      case 'Ventilation System': return 'bg-gray-100 text-gray-800';
      case 'Water Heater': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Equipment Management</h3>
        </div>
        <PermissionGuard permission="equipment.create">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0D5942] text-white rounded-lg  transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
          </button>
        </PermissionGuard>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-1/2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search equipments..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="equipmentName">Equipment Name</option>
              <option value="equipmentType">Equipment Type</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="status">Status</option>
              <option value="installationYear">Installation Year</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
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
              {editingItem ? 'Edit' : 'Add'} Equipment
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
            {/* Facility and Equipment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility *
                </label>
                <select
                  value={formData.facilityId}
                  onChange={(e) => setFormData(prev => ({ ...prev, facilityId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Facility</option>
                  {facilities.map(facility => (
                    <option key={facility.id || facility._id} value={facility.id || facility._id}>
                      {facility.facilityName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Type *
                </label>
                <select
                  value={formData.equipmentTypeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipmentTypeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Equipment Type</option>
                  {equipmentTypeData.map(type => (
                    <option key={type._id || type.id} value={type._id || type.id}>
                      {type.equipmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Equipment Name and Manufacturer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  value={formData.equipmentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipmentName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter equipment name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer *
                </label>
                <select
                  value={formData.manufacturer}
                  onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Manufacturer</option>
                  {manufacturers.map(manufacturer => (
                    <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Model and Serial Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter model number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter serial number"
                  required
                />
              </div>
            </div>

            {/* Capacity and Efficiency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity Value
                </label>
                <input
                  type="number"
                  value={formData.capacityValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacityValue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter capacity"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity Unit
                </label>
                <select
                  value={formData.capacityUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacityUnit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Unit</option>
                  {capacityUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Efficiency (%)
                </label>
                <input
                  type="number"
                  value={formData.efficiency}
                  onChange={(e) => setFormData(prev => ({ ...prev, efficiency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter efficiency"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>

            {/* Installation Year and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Installation Year
                </label>
                <select
                  value={formData.installationYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, installationYear: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Year</option>
                  {installationYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
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
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Enter any additional notes or comments"
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
                <span>{editingItem ? 'Update' : 'Save'} Equipment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Equipment List</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facility</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading equipments...
                  </td>
                </tr>
              ) : equipmentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No equipments found. Add your first equipment to get started.
                  </td>
                </tr>
              ) : (
                equipmentData.map((equipment) => (
                  <tr key={equipment.id || equipment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{equipment.equipmentName}</div>
                      <div className="text-sm text-gray-500">{equipment.model}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {equipment.facilityId?.facilityName || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEquipmentTypeColor(equipment.equipmentType?.equipmentName || equipment.equipmentTypeId)}`}>
                        {equipment.equipmentTypeId?.equipmentName || equipment.equipmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{equipment.manufacturer}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {equipment.capacityValue && equipment.capacityUnit 
                        ? `${equipment.capacityValue} ${equipment.capacityUnit}`
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(equipment.status)}`}>
                        {equipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <PermissionGuard permission="equipment.update">
                          <button
                            onClick={() => startEdit(equipment)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission="equipment.delete">
                          <button
                            onClick={() => deleteEquipment(equipment.id || equipment._id)}
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

export default AddEquipmentSection;