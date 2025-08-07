import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Edit3, Trash2, Settings, Search, Filter } from 'lucide-react';
import { postRequest, getRequest } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import { safeLocalStorage } from '@/utils/localStorage';
import DynamicForm, { FormField } from '@/components/forms/DynamicForm';

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
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
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
        // toast.error(response.message || "Failed to fetch equipments");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch equipments");
      console.log(error, 'error')
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
      // console.error('Failed to fetch facilities:', error);
      console.log(error, 'error')
    }
  };

  const fetchEquipmentTypes = async () => {
    try {
      const response = await getRequest('equipment-types/getEquipmentTypes', tokenData.accessToken);
      if (response.success) {
        setEquipmentTypeData(response.data.equipmentTypes || []);
      }
    } catch (error: any) {
      // console.error('Failed to fetch equipment types:', error);
      console.log(error, 'error')
    }
  };

  // Form fields configuration
  const equipmentFormFields: FormField[] = [
    {
      name: 'facilityId',
      label: 'Facility',
      type: 'select',
      required: true,
      placeholder: 'Select Facility',
      options: facilities.map(facility => ({ value: facility._id, label: facility.facilityName }))
    },
    {
      name: 'equipmentTypeId',
      label: 'Equipment Type',
      type: 'select',
      required: true,
      placeholder: 'Select Equipment Type',
      options: equipmentTypeData.map(type => ({ value: type._id, label: type.equipmentName }))
    },
    {
      name: 'equipmentName',
      label: 'Equipment Name',
      type: 'text',
      required: true,
      placeholder: 'Enter equipment name'
    },
    {
      name: 'manufacturer',
      label: 'Manufacturer',
      type: 'text',
      placeholder: 'Enter Manufacturer',
      required: true,
      // options: manufacturers.map(manufacturer => ({ value: manufacturer, label: manufacturer }))
    },
    {
      name: 'model',
      label: 'Model',
      type: 'text',
      placeholder: 'Enter model'
    },
    {
      name: 'serialNumber',
      label: 'Serial Number',
      type: 'text',
      placeholder: 'Enter serial number'
    },
    {
      name: 'capacityValue',
      label: 'Capacity Value',
      type: 'number',
      placeholder: 'Enter capacity value'
    },
    {
      name: 'capacityUnit',
      label: 'Capacity Unit',
      type: 'select',
      placeholder: 'Select Capacity Unit',
      options: capacityUnits.map(unit => ({ value: unit, label: unit }))
    },
    {
      name: 'efficiency',
      label: 'Efficiency (%)',
      type: 'number',
      placeholder: 'Enter efficiency percentage'
    },
    {
      name: 'installationYear',
      label: 'Installation Year',
      type: 'select',
      placeholder: 'Select Installation Year',
      options: installationYears.map(year => ({ value: year.toString(), label: year.toString() }))
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      placeholder: 'Select Status',
      options: statusOptions.map(status => ({ value: status, label: status }))
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Enter additional notes',
      rows: 3
    }
  ];

  const handleFormSubmit = async (data: any) => {
    try {
      const equipmentData = {
        ...data,
        // organizationId: await getOrganizationId()
      };

      const response = await postRequest(
        editingItem ? `equipments/updateEquipment/${editingItem._id}` : "equipments/createEquipment",
        equipmentData,
        editingItem ? "Equipment updated successfully" : "Equipment created successfully",
        tokenData.accessToken,
        editingItem ? "put" : "post"
      );
      
      if (response.success) {
        toast.success(editingItem ? "Equipment updated successfully" : "Equipment created successfully");
        resetForm();
        fetchEquipments();
      }
    } catch (error: any) {
      // toast.error(error.message || (editingItem ? "Failed to update equipment" : "Failed to create equipment"));
      console.log(error, 'error')
    }
  };

  const getOrganizationId = async () => {
    const user = safeLocalStorage.getItem('user');
    const userData = JSON.parse(user || "");
    return userData.organization;
  };

  const resetForm = () => {
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
    setEditingItem(null);
    setShowForm(false);
  };
  useEffect(() => {
    if (showForm) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [showForm]);

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
        // toast.error(response.message || "Failed to delete equipment");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to delete equipment");
      console.log(error, 'error')
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
        // toast.error(response.message || "Operation failed");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "An error occurred");
      console.log(error, 'error')
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

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEquipments(equipmentData.map(equipment => equipment.id || equipment._id));
    } else {
      setSelectedEquipments([]);
    }
  };

  const handleSelectEquipment = (equipmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedEquipments(prev => [...prev, equipmentId]);
    } else {
      setSelectedEquipments(prev => prev.filter(id => id !== equipmentId));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedEquipments.length} selected equipments?`)) {
      return;
    }

    try {
      const deletePromises = selectedEquipments.map(equipmentId => 
        postRequest(
          `equipments/deleteEquipment/${equipmentId}`,
          {},
          "Equipment Deleted Successfully",
          tokenData.accessToken,
          "delete"
        )
      );

      await Promise.all(deletePromises);
      toast.success(`${selectedEquipments.length} equipments deleted successfully`);
      setSelectedEquipments([]);
      fetchEquipments();
    } catch (error: any) {
      // toast.error(error.message || "Failed to delete some equipments");
      console.log(error, 'error')
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      const updatePromises = selectedEquipments.map(equipmentId => 
        postRequest(
          `equipments/updateEquipment/${equipmentId}`,
          { status: newStatus },
          "Equipment Updated Successfully",
          tokenData.accessToken,
          "put"
        )
      );

      await Promise.all(updatePromises);
      toast.success(`${selectedEquipments.length} equipments status updated successfully`);
      setSelectedEquipments([]);
      fetchEquipments();
    } catch (error: any) {
      // toast.error(error.message || "Failed to update some equipments");
      console.log(error, 'error')
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

   

      {/* Bulk Actions */}
      {selectedEquipments.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-blue-900'>
                {selectedEquipments.length} equipment{selectedEquipments.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className='flex gap-2'>
              <PermissionGuard permission="equipment.update">
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
              <PermissionGuard permission="equipment.delete">
                <button
                  onClick={handleBulkDelete}
                  className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
                >
                  Delete Selected
                </button>
              </PermissionGuard>
              <button
                onClick={() => setSelectedEquipments([])}
                className='bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200'
              >
                Clear Selection
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedEquipments.length === equipmentData.length && equipmentData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facility</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Loading equipments...
                  </td>
                </tr>
              ) : equipmentData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No equipments found. Add your first equipment to get started.
                  </td>
                </tr>
              ) : (
                equipmentData.map((equipment,i ) => (
                  <tr key={equipment.id || equipment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEquipments.includes(equipment.id || equipment._id)}
                        onChange={(e) => handleSelectEquipment(equipment.id || equipment._id, e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">EQ-{i+1}</div>
                    </td>
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
                    <td className="px-6 py-4 text-sm text-gray-900">{equipment.createdBy?.firstName || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(equipment.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(equipment.status)}`}>
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
                        {/* <PermissionGuard permission="equipment.delete">
                          <button
                            onClick={() => deleteEquipment(equipment.id || equipment._id)}
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
          title={editingItem ? 'Edit Equipment' : 'Add Equipment'}
          fields={equipmentFormFields}
          onSubmit={handleFormSubmit}
          onCancel={resetForm}
          initialData={formData}
          loading={false}
          submitText={editingItem ? 'Update Equipment' : 'Save Equipment'}
          cancelText="Cancel"
          onClose={resetForm}
        />
      )}
    </div>
  );
};

export default AddEquipmentSection;