import React, { useState } from 'react';
import { Plus, X, Edit3, Trash2, Thermometer } from 'lucide-react';

const facilities = [
  {
    id: 'fac_001',
    name: 'Manufacturing Plant A',
    location: 'Texas, USA',
    type: 'manufacturing',
    gridRegion: 'ERCOT',
    locationFactor: 0.396
  },
  {
    id: 'fac_002',
    name: 'Distribution Center B',
    location: 'California, USA',
    type: 'warehouse',
    gridRegion: 'CAISO',
    locationFactor: 0.287
  },
  {
    id: 'fac_003',
    name: 'Office Headquarters',
    location: 'New York, USA',
    type: 'office',
    gridRegion: 'NYISO',
    locationFactor: 0.315
  }
];

const Scope2HeatingEntry: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [heatingData, setHeatingData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    facilityId: '',
    supplier: '',
    consumption: '',
    consumptionUnit: 'kWh',
    heatingType: '',
    billingPeriod: '',
    calculatedEmissions: 0
  });

  const handleSubmit = () => {
    const newRecord = {
      id: editingItem ? editingItem.id : `heating_${Date.now()}`,
      ...formData,
      consumption: parseFloat(formData.consumption),
      calculatedEmissions: parseFloat(formData.consumption) * 0.0007 // Example factor
    };
    if (editingItem) {
      setHeatingData(prev => prev.map(item => item.id === editingItem.id ? newRecord : item));
    } else {
      setHeatingData(prev => [...prev, newRecord]);
    }
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      facilityId: '',
      supplier: '',
      consumption: '',
      consumptionUnit: 'kWh',
      heatingType: '',
      billingPeriod: '',
      calculatedEmissions: 0
    });
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const filteredData = selectedFacility === 'all'
    ? heatingData
    : heatingData.filter(item => item.facilityId === selectedFacility);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Thermometer className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-semibold text-gray-900">Purchased Heating</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Heating Record</span>
        </button>
      </div>
      {showForm && (
        <div className="bg-white border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-orange-900">
              {editingItem ? 'Edit' : 'Add'} Heating Consumption
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
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facility *</label>
                <select
                  value={formData.facilityId}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, facilityId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Select Facility</option>
                  {facilities.map(facility => (
                    <option key={facility.id} value={facility.id}>{facility.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, supplier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consumption *</label>
                <input
                  type="number"
                  value={formData.consumption}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, consumption: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.consumptionUnit}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, consumptionUnit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="kWh">kWh</option>
                  <option value="MWh">MWh</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heating Type</label>
                <input
                  type="text"
                  value={formData.heatingType}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, heatingType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Gas, Oil, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Period</label>
                <input
                  type="text"
                  value={formData.billingPeriod}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, billingPeriod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., January 2024"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facility</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumption</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((record) => {
              const facility = facilities.find(f => f.id === record.facilityId);
              return (
                <tr key={record.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{facility?.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.supplier}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {record.consumption?.toLocaleString()} {record.consumptionUnit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 capitalize">
                      {record.heatingType?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {record.calculatedEmissions?.toLocaleString()} tCO₂e
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(record)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setHeatingData(prev => prev.filter(item => item.id !== record.id))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scope2HeatingEntry; 