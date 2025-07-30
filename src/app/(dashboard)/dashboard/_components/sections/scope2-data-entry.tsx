import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Plus, X, Save, Edit3, Trash2, Download, Upload, 
  Zap, Factory, Building, MapPin, Calendar, Calculator, BarChart3,
  CheckCircle, AlertCircle, Info, Settings, FileText, Globe,
  Thermometer, Wind, Sun, Database, TrendingUp, Activity
} from 'lucide-react';

const Scope2DataEntry = () => {
  const [activeTab, setActiveTab] = useState('electricity');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [calculationMethod, setCalculationMethod] = useState('market_based');
  
  // Facilities data
  const [facilities] = useState([
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
  ]);

  // Electricity data
  const [electricityData, setElectricityData] = useState([
    {
      id: 'elec_001',
      facilityId: 'fac_001',
      supplier: 'Texas Electric Co',
      accountNumber: 'TXE-789456',
      meterNumber: 'MTR-001',
      consumption: 2450000, // kWh
      consumptionUnit: 'kWh',
      billingPeriod: 'January 2024',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      cost: 245000,
      currency: 'USD',
      energyMix: {
        renewable: 35,
        natural_gas: 45,
        coal: 15,
        nuclear: 5
      },
      supplierFactor: 0.42, // kg CO2e/kWh
      recs: 0, // MWh of RECs
      calculatedEmissions: {
        location_based: 970.2, // tCO2e
        market_based: 1029.0
      }
    },
    {
      id: 'elec_002',
      facilityId: 'fac_002',
      supplier: 'California Green Power',
      accountNumber: 'CGP-456123',
      meterNumber: 'MTR-002',
      consumption: 890000,
      consumptionUnit: 'kWh',
      billingPeriod: 'January 2024',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      cost: 134000,
      currency: 'USD',
      energyMix: {
        renewable: 65,
        natural_gas: 25,
        coal: 5,
        nuclear: 5
      },
      supplierFactor: 0.28,
      recs: 200, // MWh of RECs
      calculatedEmissions: {
        location_based: 255.4,
        market_based: 193.2
      }
    }
  ]);

  // Steam data
  const [steamData, setSteamData] = useState([
    {
      id: 'steam_001',
      facilityId: 'fac_001',
      supplier: 'Industrial Steam Corp',
      consumption: 15000, // MMBtu
      consumptionUnit: 'MMBtu',
      billingPeriod: 'January 2024',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      cost: 75000,
      currency: 'USD',
      steamPressure: 'high', // high, medium, low
      supplierFactor: 0.084, // tCO2e/MMBtu
      calculatedEmissions: 1260.0 // tCO2e
    }
  ]);

  // Heating data
  const [heatingData, setHeatingData] = useState([
    {
      id: 'heat_001',
      facilityId: 'fac_002',
      supplier: 'District Heating LLC',
      consumption: 8500,
      consumptionUnit: 'MMBtu',
      billingPeriod: 'January 2024',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      cost: 42500,
      currency: 'USD',
      heatingType: 'district_heating',
      supplierFactor: 0.095,
      calculatedEmissions: 807.5
    }
  ]);

  // Cooling data
  const [coolingData, setCoolingData] = useState([
    {
      id: 'cool_001',
      facilityId: 'fac_003',
      supplier: 'Chilled Water Systems',
      consumption: 3200,
      consumptionUnit: 'ton-hours',
      billingPeriod: 'January 2024',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      cost: 28800,
      currency: 'USD',
      coolingType: 'district_cooling',
      supplierFactor: 0.15, // tCO2e/ton-hour
      calculatedEmissions: 480.0
    }
  ]);

  // Calculation functions
  const calculateElectricityEmissions = (record) => {
    const consumption_MWh = record.consumption / 1000; // Convert kWh to MWh
    const facility = facilities.find(f => f.id === record.facilityId);
    
    const location_based = consumption_MWh * facility.locationFactor;
    const market_based_gross = consumption_MWh * record.supplierFactor;
    const recs_adjustment = record.recs * 0; // RECs reduce market-based to zero for renewable portion
    const market_based = Math.max(0, market_based_gross - recs_adjustment);
    
    return {
      location_based: parseFloat(location_based.toFixed(2)),
      market_based: parseFloat(market_based.toFixed(2))
    };
  };

  const getTotalEmissions = () => {
    const method = calculationMethod;
    
    let electricity = 0;
    let steam = 0;
    let heating = 0;
    let cooling = 0;
    
    // Filter by facility if selected
    const facilityFilter = selectedFacility === 'all' ? () => true : (item) => item.facilityId === selectedFacility;
    
    if (method === 'market_based') {
      electricity = electricityData.filter(facilityFilter).reduce((sum, item) => sum + (item.calculatedEmissions?.market_based || 0), 0);
    } else {
      electricity = electricityData.filter(facilityFilter).reduce((sum, item) => sum + (item.calculatedEmissions?.location_based || 0), 0);
    }
    
    steam = steamData.filter(facilityFilter).reduce((sum, item) => sum + (item.calculatedEmissions || 0), 0);
    heating = heatingData.filter(facilityFilter).reduce((sum, item) => sum + (item.calculatedEmissions || 0), 0);
    cooling = coolingData.filter(facilityFilter).reduce((sum, item) => sum + (item.calculatedEmissions || 0), 0);
    
    return {
      electricity,
      steam,
      heating,
      cooling,
      total: electricity + steam + heating + cooling
    };
  };
  
  
    // Form components
    const ElectricityForm = () => {
      const [showForm, setShowForm] = useState(false);
      const [editingItem, setEditingItem] = useState(null);
      const [formData, setFormData] = useState({
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
  
      const startEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setShowForm(true);
      };
  
      const filteredData = selectedFacility === 'all' 
        ? electricityData 
        : electricityData.filter(item => item.facilityId === selectedFacility);
  
      return (
        <div className="space-y-6">
          {/* Header */}
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
  
          {/* Data Entry Form */}
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
                      onChange={(e) => setFormData(prev => ({...prev, facilityId: e.target.value}))}
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
                      onChange={(e) => setFormData(prev => ({...prev, supplier: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData(prev => ({...prev, accountNumber: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meter Number</label>
                    <input
                      type="text"
                      value={formData.meterNumber}
                      onChange={(e) => setFormData(prev => ({...prev, meterNumber: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consumption *</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={formData.consumption}
                        onChange={(e) => setFormData(prev => ({...prev, consumption: e.target.value}))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <select
                        value={formData.consumptionUnit}
                        onChange={(e) => setFormData(prev => ({...prev, consumptionUnit: e.target.value}))}
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
                      onChange={(e) => setFormData(prev => ({...prev, billingPeriod: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., January 2024"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({...prev, startDate: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({...prev, endDate: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData(prev => ({...prev, cost: e.target.value}))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        step="0.01"
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({...prev, currency: e.target.value}))}
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
                        onChange={(e) => setFormData(prev => ({...prev, supplierFactor: e.target.value}))}
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
                        onChange={(e) => setFormData(prev => ({...prev, recs: e.target.value}))}
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
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            energyMix: {...prev.energyMix, [source]: parseFloat(e.target.value) || 0}
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
  
          {/* Data Table */}
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
                          {record.consumption.toLocaleString()} {record.consumptionUnit}
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
                              ? record.calculatedEmissions.market_based.toLocaleString() 
                              : record.calculatedEmissions.location_based.toLocaleString()
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
  
    // Similar form components for Steam, Heating, Cooling would go here
    const SteamForm = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Thermometer className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900">Purchased Steam</h3>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Plus className="w-4 h-4" />
            <span>Add Steam Record</span>
          </button>
        </div>
  
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
              {steamData.filter(item => selectedFacility === 'all' || item.facilityId === selectedFacility).map((record) => {
                const facility = facilities.find(f => f.id === record.facilityId);
                return (
                  <tr key={record.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{facility?.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.supplier}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {record.consumption.toLocaleString()} {record.consumptionUnit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.billingPeriod}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {record.calculatedEmissions.toLocaleString()} tCO₂e
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
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
  
    const HeatingForm = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Thermometer className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900">Purchased Heating</h3>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <Plus className="w-4 h-4" />
            <span>Add Heating Record</span>
          </button>
        </div>
  
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
              {heatingData.filter(item => selectedFacility === 'all' || item.facilityId === selectedFacility).map((record) => {
                const facility = facilities.find(f => f.id === record.facilityId);
                return (
                  <tr key={record.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{facility?.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.supplier}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {record.consumption.toLocaleString()} {record.consumptionUnit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 capitalize">
                        {record.heatingType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {record.calculatedEmissions.toLocaleString()} tCO₂e
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
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
  
    const CoolingForm = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wind className="w-6 h-6 text-cyan-600" />
            <h3 className="text-xl font-semibold text-gray-900">Purchased Cooling</h3>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
            <Plus className="w-4 h-4" />
            <span>Add Cooling Record</span>
          </button>
        </div>
  
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
              {coolingData.filter(item => selectedFacility === 'all' || item.facilityId === selectedFacility).map((record) => {
                const facility = facilities.find(f => f.id === record.facilityId);
                return (
                  <tr key={record.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{facility?.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.supplier}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {record.consumption.toLocaleString()} {record.consumptionUnit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 capitalize">
                        {record.coolingType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {record.calculatedEmissions.toLocaleString()} tCO₂e
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
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
  
    // Summary Dashboard
    const SummaryDashboard = () => {
      const totals = getTotalEmissions();
      
      return (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Electricity</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{totals.electricity.toLocaleString()}</div>
              <div className="text-xs text-gray-500">tCO₂e</div>
            </div>
  
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Steam</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{totals.steam.toLocaleString()}</div>
              <div className="text-xs text-gray-500">tCO₂e</div>
            </div>
  
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">Heating</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{totals.heating.toLocaleString()}</div>
              <div className="text-xs text-gray-500">tCO₂e</div>
            </div>
  
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wind className="w-5 h-5 text-cyan-600" />
                <span className="text-sm font-medium text-gray-900">Cooling</span>
              </div>
              <div className="text-2xl font-bold text-cyan-600">{totals.cooling.toLocaleString()}</div>
              <div className="text-xs text-gray-500">tCO₂e</div>
            </div>
  
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Total</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{totals.total.toLocaleString()}</div>
              <div className="text-xs text-gray-500">tCO₂e</div>
            </div>
          </div>
  
          {/* Breakdown Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scope 2 Emissions Breakdown</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Interactive breakdown chart would display here</p>
                <p className="text-sm">Showing emissions by energy type and facility</p>
              </div>
            </div>
          </div>
  
          {/* Facility Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Facility</h3>
            <div className="space-y-4">
              {facilities.map(facility => {
                const facilityElectricity = electricityData
                  .filter(item => item.facilityId === facility.id)
                  .reduce((sum, item) => sum + (calculationMethod === 'market_based' ? item.calculatedEmissions.market_based : item.calculatedEmissions.location_based), 0);
                
                const facilitySteam = steamData
                  .filter(item => item.facilityId === facility.id)
                  .reduce((sum, item) => sum + item.calculatedEmissions, 0);
                
                const facilityHeating = heatingData
                  .filter(item => item.facilityId === facility.id)
                  .reduce((sum, item) => sum + item.calculatedEmissions, 0);
                
                const facilityCooling = coolingData
                  .filter(item => item.facilityId === facility.id)
                  .reduce((sum, item) => sum + item.calculatedEmissions, 0);
                
                const facilityTotal = facilityElectricity + facilitySteam + facilityHeating + facilityCooling;
                
                return (
                  <div key={facility.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">{facility.name}</div>
                          <div className="text-sm text-gray-500">{facility.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{facilityTotal.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">tCO₂e</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-blue-600">{facilityElectricity.toLocaleString()}</div>
                        <div className="text-gray-500">Electricity</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">{facilitySteam.toLocaleString()}</div>
                        <div className="text-gray-500">Steam</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-orange-600">{facilityHeating.toLocaleString()}</div>
                        <div className="text-gray-500">Heating</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-cyan-600">{facilityCooling.toLocaleString()}</div>
                        <div className="text-gray-500">Cooling</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Khazra.ai</h1>
              <h2 className="text-lg text-gray-600">Scope 2 Emissions Data Entry Platform</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Indirect Energy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Facilities</option>
              {facilities.map(facility => (
                <option key={facility.id} value={facility.id}>{facility.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calculation Method</label>
            <select
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="market_based">Market-based</option>
              <option value="location_based">Location-based</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'summary' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Summary</span>
        </button>
        <button
          onClick={() => setActiveTab('electricity')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'electricity' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Electricity</span>
        </button>
        <button
          onClick={() => setActiveTab('steam')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'steam' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>Steam</span>
        </button>
        <button
          onClick={() => setActiveTab('heating')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'heating' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>Heating</span>
        </button>
        <button
          onClick={() => setActiveTab('cooling')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'cooling' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Cooling</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[800px]">
        <div className="p-8">
          {activeTab === 'summary' && <SummaryDashboard />}
          {activeTab === 'electricity' && <ElectricityForm />}
          {activeTab === 'steam' && <SteamForm />}
          {activeTab === 'heating' && <HeatingForm />}
          {activeTab === 'cooling' && <CoolingForm />}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Scope 2 Emissions Data Entry Platform</p>
        <p className="mt-1">Powered by Khazra.ai Sustainability Intelligence</p>
      </div>
    </div>
  );
};

export { ElectricityForm, SteamForm, HeatingForm, CoolingForm };
export default Scope2DataEntry;