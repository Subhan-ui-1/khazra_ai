import React, { useState } from 'react';
import { Plus, X, Save, Edit3, Trash2, Zap } from 'lucide-react';

const facilities = [
  {
    id: 'fac_001',
    name: 'Manufacturing Plant A',
    location: 'Texas, USA',
    type: 'manufacturing',
    gridRegion: 'ERCOT',
    locationFactor: 0.396 // kg CO2e/kWh
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

function calculateElectricityEmissions(record: any) {
  const consumption_MWh = record.consumption / 1000; // Convert kWh to MWh
  const facility = facilities.find(f => f.id === record.facilityId);
  const location_based = consumption_MWh * (facility?.locationFactor || 0);
  const market_based_gross = consumption_MWh * record.supplierFactor;
  const recs_adjustment = record.recs * 0; // RECs reduce market-based to zero for renewable portion
  const market_based = Math.max(0, market_based_gross - recs_adjustment);
  return {
    location_based,
    market_based
  };
}

const Scope2ElectricityEntry: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [calculationMethod, setCalculationMethod] = useState('market_based');
  const [electricityData, setElectricityData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    facilityId: '',
    supplier: '',
    accountNumber: '',
    meterNumber: '',
    consumption: '',
    consumptionUnit: 'kWh',
    billingPeriod: '',
    startDate: '',
    endDate: '',
    cost: '',
    currency: 'USD',
    supplierFactor: '',
    recs: 0,
    energyMix: {
      renewable: 0,
      natural_gas: 0,
      coal: 0,
      nuclear: 0
    }
  });

  const handleSubmit = () => {
    const newRecord = {
      id: editingItem ? editingItem.id : `elec_${Date.now()}`,
      ...formData,
      consumption: parseFloat(formData.consumption),
      cost: parseFloat(formData.cost),
      supplierFactor: parseFloat(formData.supplierFactor),
      recs: parseFloat(formData.recs || 0),
      calculatedEmissions: calculateElectricityEmissions({
        ...formData,
        consumption: parseFloat(formData.consumption),
        supplierFactor: parseFloat(formData.supplierFactor),
        recs: parseFloat(formData.recs || 0)
      })
    };
    if (editingItem) {
      setElectricityData(prev => prev.map(item => item.id === editingItem.id ? newRecord : item));
    } else {
      setElectricityData(prev => [...prev, newRecord]);
    }
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      facilityId: '',
      supplier: '',
      accountNumber: '',
      meterNumber: '',
      consumption: '',
      consumptionUnit: 'kWh',
      billingPeriod: '',
      startDate: '',
      endDate: '',
      cost: '',
      currency: 'USD',
      supplierFactor: '',
      recs: 0,
      energyMix: { renewable: 0, natural_gas: 0, coal: 0, nuclear: 0 }
    });
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const filteredData = selectedFacility === 'all'
    ? electricityData
    : electricityData.filter(item => item.facilityId === selectedFacility);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Purchased Electricity</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Electricity Record</span>
        </button>
      </div>
      {showForm && (
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-blue-900">
              {editingItem ? 'Edit' : 'Add'} Electricity Consumption
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, accountNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meter Number</label>
                <input
                  type="text"
                  value={formData.meterNumber}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, meterNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consumption *</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.consumption}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, consumption: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <select
                    value={formData.consumptionUnit}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, consumptionUnit: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="kWh">kWh</option>
                    <option value="MWh">MWh</option>
                    <option value="GWh">GWh</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Period</label>
                <input
                  type="text"
                  value={formData.billingPeriod}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, billingPeriod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., January 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, cost: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, currency: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Emission Factor *</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={formData.supplierFactor}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, supplierFactor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    step="0.001"
                    required
                  />
                  <span className="text-sm text-gray-500">kg CO₂e/kWh</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RECs Purchased</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={formData.recs}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, recs: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    step="0.1"
                  />
                  <span className="text-sm text-gray-500">MWh</span>
                </div>
              </div>
            </div>
            {/* Energy Mix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Energy Mix (%)</label>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(formData.energyMix).map(([source, value]) => (
                  <div key={source}>
                    <label className="block text-xs text-gray-600 mb-1 capitalize">
                      {source.replace('_', ' ')}
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setFormData((prev: any) => ({
                        ...prev,
                        energyMix: { ...prev.energyMix, [source]: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total: {Object.values(formData.energyMix).reduce((sum, val) => sum + val, 0)}%
              </p>
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
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                <span>{editingItem ? 'Update' : 'Save'} Record</span>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
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
                    <div className="text-sm text-gray-500">{facility?.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{record.supplier}</div>
                    <div className="text-sm text-gray-500">{record.accountNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {record.consumption?.toLocaleString()} {record.consumptionUnit}
                    </div>
                    {record.recs > 0 && (
                      <div className="text-sm text-green-600">RECs: {record.recs} MWh</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.billingPeriod}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {calculationMethod === 'market_based'
                          ? record.calculatedEmissions.market_based?.toLocaleString()
                          : record.calculatedEmissions.location_based?.toLocaleString()
                        } tCO₂e
                      </div>
                      <div className="text-gray-500">
                        {calculationMethod === 'market_based' ? 'Market-based' : 'Location-based'}
                      </div>
                    </div>
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
                        onClick={() => setElectricityData(prev => prev.filter(item => item.id !== record.id))}
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

export default Scope2ElectricityEntry; 