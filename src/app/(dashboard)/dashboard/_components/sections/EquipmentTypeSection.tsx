import React, { useState } from 'react';
import { Plus, Save, X, Edit3, Trash2, Settings } from 'lucide-react';
import { usePermissions, PermissionGuard } from '@/utils/permissions';

// Define TypeScript interfaces
interface EquipmentTypeFormData {
  equipmentName: string;
  fuelTypeId: string;
  capacityUnit: string;
  isActive: boolean;
}

// Sample fuel types with MongoDB-style IDs
const fuelTypes = [
  { id: 'fuel_001', name: 'Gasoline' },
  { id: 'fuel_002', name: 'Diesel' },
  { id: 'fuel_003', name: 'Electric' },
  { id: 'fuel_004', name: 'Natural Gas' },
  { id: 'fuel_005', name: 'Propane' },
  { id: 'fuel_006', name: 'Biodiesel' },
  { id: 'fuel_007', name: 'Hydrogen' },
  { id: 'fuel_008', name: 'Coal' },
  { id: 'fuel_009', name: 'Biomass' },
  { id: 'fuel_010', name: 'Solar' }
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
  'Amps',
  'MW',
  'MWh',
  'GJ',
  'therms'
];

const EquipmentTypeSection = () => {
  const [equipmentTypeData, setEquipmentTypeData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();
  const [formData, setFormData] = useState<EquipmentTypeFormData>({
    equipmentName: '',
    fuelTypeId: '',
    capacityUnit: '',
    isActive: true
  });

  // Check if user has permission to view equipment types
  if (!canView('equipmentType')) {
    return (
      <div className="p-8 text-center text-gray-500">
        You don't have permission to view equipment types.
      </div>
    );
  }

  const handleSubmit = () => {
    const newRecord = {
      id: editingItem ? editingItem.id : `equipment_type_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (editingItem) {
      setEquipmentTypeData(prev => prev.map(item => item.id === editingItem.id ? newRecord : item));
    } else {
      setEquipmentTypeData(prev => [...prev, newRecord]);
    }
    
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      equipmentName: '',
      fuelTypeId: '',
      capacityUnit: '',
      isActive: true
    });
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const getFuelTypeName = (fuelTypeId: string) => {
    const fuelType = fuelTypes.find(f => f.id === fuelTypeId);
    return fuelType ? fuelType.name : 'Unknown';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Equipment Type Management</h3>
        </div>
        <PermissionGuard permission="equipmentType.create">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment Type</span>
          </button>
        </PermissionGuard>
      </div>

      {showForm && (
        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-medium text-green-900">
              {editingItem ? 'Edit' : 'Add'} Equipment Type
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
            {/* Equipment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Name *
              </label>
              <input
                type="text"
                value={formData.equipmentName}
                onChange={(e) => setFormData((prev: EquipmentTypeFormData) => ({ ...prev, equipmentName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Industrial Boiler, Electric Motor, Diesel Generator"
                required
              />
            </div>

            {/* Fuel Type and Capacity Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type *
                </label>
                <select
                  value={formData.fuelTypeId}
                  onChange={(e) => setFormData((prev: EquipmentTypeFormData) => ({ ...prev, fuelTypeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map(fuelType => (
                    <option key={fuelType.id} value={fuelType.id}>{fuelType.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity Unit *
                </label>
                <select
                  value={formData.capacityUnit}
                  onChange={(e) => setFormData((prev: EquipmentTypeFormData) => ({ ...prev, capacityUnit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Capacity Unit</option>
                  {capacityUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    value="true"
                    checked={formData.isActive === true}
                    onChange={(e) => setFormData((prev: EquipmentTypeFormData) => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    value="false"
                    checked={formData.isActive === false}
                    onChange={(e) => setFormData((prev: EquipmentTypeFormData) => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Inactive</span>
                </label>
              </div>
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
                <span>{editingItem ? 'Update' : 'Save'} Equipment Type</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Type Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Equipment Types</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipmentTypeData.map((equipmentType) => (
                <tr key={equipmentType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{equipmentType.equipmentName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getFuelTypeName(equipmentType.fuelTypeId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{equipmentType.capacityUnit}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(equipmentType.isActive)}`}>
                      {equipmentType.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {equipmentType.createdAt ? new Date(equipmentType.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <PermissionGuard permission="equipmentType.update">
                        <button
                          onClick={() => startEdit(equipmentType)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard permission="equipmentType.delete">
                        <button
                          onClick={() => setEquipmentTypeData(prev => prev.filter(item => item.id !== equipmentType.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
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

export default EquipmentTypeSection; 