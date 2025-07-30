import React, { useState } from 'react';
import { Plus, Save, X, Edit3, Trash2, Settings } from 'lucide-react';

const facilities = [
  { id: 'fac_001', name: 'Manufacturing Plant A' },
  { id: 'fac_002', name: 'Distribution Center B' },
  { id: 'fac_003', name: 'Office Headquarters' },
  { id: 'fac_004', name: 'Research & Development Center' },
  { id: 'fac_005', name: 'Warehouse Facility C' }
];

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
  'Maintenance',
  'Retired',
  'Under Repair',
  'Standby'
];

const AddEquipmentSection = () => {
  const [equipmentData, setEquipmentData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    facilityName: '',
    equipmentType: '',
    manufacturer: '',
    capacityUnit: '',
    installationYear: '',
    status: '',
    equipmentName: '',
    model: '',
    serialNumber: '',
    capacityValue: '',
    efficiency: '',
    notes: ''
  });

  const handleSubmit = () => {
    const newRecord = {
      id: editingItem ? editingItem.id : `equipment_${Date.now()}`,
      ...formData,
      capacityValue: parseFloat(formData.capacityValue) || 0,
      efficiency: parseFloat(formData.efficiency) || 0
    };
    
    if (editingItem) {
      setEquipmentData(prev => prev.map(item => item.id === editingItem.id ? newRecord : item));
    } else {
      setEquipmentData(prev => [...prev, newRecord]);
    }
    
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      facilityName: '',
      equipmentType: '',
      manufacturer: '',
      capacityUnit: '',
      installationYear: '',
      status: '',
      equipmentName: '',
      model: '',
      serialNumber: '',
      capacityValue: '',
      efficiency: '',
      notes: ''
    });
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Equipment Management</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment</span>
        </button>
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
                  Facility Name *
                </label>
                <select
                  value={formData.facilityName}
                  onChange={(e) => setFormData(prev => ({ ...prev, facilityName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Facility</option>
                  {facilities.map(facility => (
                    <option key={facility.id} value={facility.name}>{facility.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Type *
                </label>
                <select
                  value={formData.equipmentType}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipmentType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Equipment Type</option>
                  {equipmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
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
              {equipmentData.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{equipment.equipmentName}</div>
                    <div className="text-sm text-gray-500">{equipment.model}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{equipment.facilityName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{equipment.equipmentType}</td>
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
                      <button
                        onClick={() => startEdit(equipment)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEquipmentData(prev => prev.filter(item => item.id !== equipment.id))}
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

export default AddEquipmentSection;