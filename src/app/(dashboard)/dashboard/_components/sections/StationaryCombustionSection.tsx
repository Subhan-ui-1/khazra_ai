'use client';

import { useState } from 'react';
import HorizontalStackedChart from './overview/HorizontalStackedChart'
import ScopeAlignmentChart from './overview/ScopeAlignmentChart';

export default function StationaryCombustionSection() {
  const [isStationaryModalOpen, setIsStationaryModalOpen] = useState(false);
  const [isEditStationaryModalOpen, setIsEditStationaryModalOpen] = useState(false);
  const [editingStationaryData, setEditingStationaryData] = useState<any>(null);
  const [editingStationaryIndex, setEditingStationaryIndex] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMode, setReviewMode] = useState<'add-stationary' | 'edit-stationary' | null>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [stationaryFormData, setStationaryFormData] = useState({
    month: '',
    year: '',
    facilityId: '',
    facilityDescription: '',
    equipmentType: '',
    fuelType: '',
    quantityOfFuelUsed: '',
    customEmissionFactor: '',
    useCustomEmissionFactor: false
  });

  // State for Stationary Combustion table data array
  const [stationaryCombustionData, setStationaryCombustionData] = useState([
    {
      id: 1,
      month: 'January',
      year: '2024',
      facilityId: 'FAC-001',
      facilityDescription: 'Main Production Plant',
      equipmentType: 'Boiler',
      fuelType: 'Natural Gas',
      quantityOfFuelUsed: '1,250 m³',
      customEmissionFactor: '2.162 kg CO₂e/m³',
      useCustomEmissionFactor: true
    },
    {
      id: 2,
      month: 'January',
      year: '2024',
      facilityId: 'FAC-002',
      facilityDescription: 'Secondary Processing Unit',
      equipmentType: 'Furnace',
      fuelType: 'Heating Oil',
      quantityOfFuelUsed: '850 L',
      customEmissionFactor: '3.15 kg CO₂e/L',
      useCustomEmissionFactor: false
    },
    {
      id: 3,
      month: 'January',
      year: '2024',
      facilityId: 'FAC-003',
      facilityDescription: 'Backup Power Station',
      equipmentType: 'Generator',
      fuelType: 'Diesel',
      quantityOfFuelUsed: '320 L',
      customEmissionFactor: '2.68 kg CO₂e/L',
      useCustomEmissionFactor: true
    }
  ]);

  const handleStationarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Stationary Combustion Data:', stationaryFormData);
    
    // Show review modal instead of directly adding
    setReviewData(stationaryFormData);
    setReviewMode('add-stationary');
    setShowReviewModal(true);
    setIsStationaryModalOpen(false);
  };

  const handleEditStationary = (rowData: any, index: number) => {
    setEditingStationaryData(rowData);
    setEditingStationaryIndex(index);
    setStationaryFormData({
      month: rowData.month,
      year: rowData.year,
      facilityId: rowData.facilityId,
      facilityDescription: rowData.facilityDescription,
      equipmentType: rowData.equipmentType,
      fuelType: rowData.fuelType,
      quantityOfFuelUsed: rowData.quantityOfFuelUsed,
      customEmissionFactor: rowData.customEmissionFactor,
      useCustomEmissionFactor: rowData.useCustomEmissionFactor
    });
    setIsEditStationaryModalOpen(true);
  };

  const handleEditStationarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Stationary Combustion Data:', stationaryFormData);
    console.log('Original Data:', editingStationaryData);
    
    // Show review modal instead of directly updating
    setReviewData(stationaryFormData);
    setReviewMode('edit-stationary');
    setShowReviewModal(true);
    setIsEditStationaryModalOpen(false);
  };

  // Review modal handlers
  const handleReviewConfirm = () => {
    if (reviewMode === 'add-stationary') {
      const newRow = {
        id: Math.max(...stationaryCombustionData.map(row => row.id)) + 1,
        ...reviewData
      };
      setStationaryCombustionData([...stationaryCombustionData, newRow]);
      console.log('Confirmed: Added new stationary combustion row');
    } else if (reviewMode === 'edit-stationary' && editingStationaryIndex !== null) {
      const updatedData = [...stationaryCombustionData];
      updatedData[editingStationaryIndex] = {
        ...updatedData[editingStationaryIndex],
        ...reviewData
      };
      setStationaryCombustionData(updatedData);
      console.log('Confirmed: Updated stationary combustion row');
    }
    
    // Reset review modal
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);
    
    // Reset editing states
    setEditingStationaryData(null);
    setEditingStationaryIndex(null);
    
    // Reset forms
    setStationaryFormData({
      month: '',
      year: '',
      facilityId: '',
      facilityDescription: '',
      equipmentType: '',
      fuelType: '',
      quantityOfFuelUsed: '',
      customEmissionFactor: '',
      useCustomEmissionFactor: false
    });
  };

  const handleReviewCancel = () => {
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);
    
    // Reset editing states
    setEditingStationaryData(null);
    setEditingStationaryIndex(null);
    
    // Reset forms
    setStationaryFormData({
      month: '',
      year: '',
      facilityId: '',
      facilityDescription: '',
      equipmentType: '',
      fuelType: '',
      quantityOfFuelUsed: '',
      customEmissionFactor: '',
      useCustomEmissionFactor: false
    });
  };

  const handleReviewEdit = () => {
    setShowReviewModal(false);
    
    // Reopen the appropriate modal for editing
    if (reviewMode === 'add-stationary' || reviewMode === 'edit-stationary') {
      setStationaryFormData(reviewData);
      setIsStationaryModalOpen(true);
    }
    
    setReviewMode(null);
    setReviewData(null);
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Stationary Combustion Emissions
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Direct greenhouse gas emissions from stationary combustion sources owned or controlled by your organization, 
          including boilers, furnaces, generators, and other stationary equipment.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Total Stationary
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">1,746.2</div>
              <div className="text-sm text-green-800 mb-2">▼ 8.5% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
                tonnes CO₂e • 53.8% of Scope 1
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🔥
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '53.8%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Active Sources
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">23</div>
              <div className="text-sm text-green-800 mb-2">Across 5 facilities</div>
              <div className="text-xs text-green-800 opacity-60">
                Boilers, furnaces, generators
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🏭
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Primary Fuel
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">Natural Gas</div>
              <div className="text-sm text-green-800 mb-2">65% of consumption</div>
              <div className="text-xs text-green-800 opacity-60">
                Followed by heating oil
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ⛽
            </div>
          </div>
        </div>
      </div>

      <div className='w-full'>
        <HorizontalStackedChart />
      </div>

      <div className='mt-30'>
        <ScopeAlignmentChart />
      </div>

      {/* Stationary Combustion Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm mt-10">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Stationary Combustion Data</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Filter
            </button>
            <button 
              onClick={() => setIsStationaryModalOpen(true)}
              className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Add Stationary Combustion
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Month</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Year</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Facility ID</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Facility Description</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Equipment Type</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Fuel Type</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Quantity of Fuel Used</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Custom Emission Factor</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">If Use Custom Emission Factor</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {stationaryCombustionData.map((row, index) => (
                <tr key={row.id} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-green-800">{row.month}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.year}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.facilityId}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.facilityDescription}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.equipmentType}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.fuelType}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.quantityOfFuelUsed}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.customEmissionFactor}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.useCustomEmissionFactor ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditStationary(row, index)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded border border-blue-200 hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded border border-orange-200 hover:bg-orange-200 transition-colors">
                        Revert
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stationary Combustion Modal */}
      {isStationaryModalOpen && (
        <div className="fixed inset-0 bg-gray-500/50 bg-opacity-50 h-screen flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] border-2 border-green-800 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">Add Stationary Combustion</h2>
              <button 
                onClick={() => setIsStationaryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleStationarySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Month</label>
                  <select 
                    value={stationaryFormData.month}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, month: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Year</label>
                  <input 
                    type="number"
                    value={stationaryFormData.year}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2024"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Facility ID</label>
                  <input 
                    type="text"
                    value={stationaryFormData.facilityId}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, facilityId: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="FAC-001"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Facility Description</label>
                  <input 
                    type="text"
                    value={stationaryFormData.facilityDescription}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, facilityDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Main Production Plant"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Equipment Type</label>
                  <select 
                    value={stationaryFormData.equipmentType}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, equipmentType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Equipment Type</option>
                    <option value="Boiler">Boiler</option>
                    <option value="Furnace">Furnace</option>
                    <option value="Generator">Generator</option>
                    <option value="Heater">Heater</option>
                    <option value="Oven">Oven</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Fuel Type</label>
                  <select 
                    value={stationaryFormData.fuelType}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, fuelType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Natural Gas">Natural Gas</option>
                    <option value="Heating Oil">Heating Oil</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Coal">Coal</option>
                    <option value="Propane">Propane</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Quantity of Fuel Used</label>
                  <input 
                    type="text"
                    value={stationaryFormData.quantityOfFuelUsed}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, quantityOfFuelUsed: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="1,250 m³"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Custom Emission Factor</label>
                  <input 
                    type="text"
                    value={stationaryFormData.customEmissionFactor}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, customEmissionFactor: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2.162 kg CO₂e/m³"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="useCustomEmissionFactor"
                  checked={stationaryFormData.useCustomEmissionFactor}
                  onChange={(e) => setStationaryFormData({...stationaryFormData, useCustomEmissionFactor: e.target.checked})}
                  className="rounded border-green-200 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="useCustomEmissionFactor" className="text-sm font-medium text-green-800">
                  Use Custom Emission Factor
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsStationaryModalOpen(false)}
                  className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stationary Combustion Modal */}
      {isEditStationaryModalOpen && (
        <div className="fixed inset-0 bg-gray-500/50 bg-opacity-50 h-screen flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] border-2 border-green-800 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">Edit Stationary Combustion</h2>
              <button 
                onClick={() => setIsEditStationaryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditStationarySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Month</label>
                  <select 
                    value={stationaryFormData.month}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, month: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Year</label>
                  <input 
                    type="number"
                    value={stationaryFormData.year}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2024"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Facility ID</label>
                  <input 
                    type="text"
                    value={stationaryFormData.facilityId}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, facilityId: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="FAC-001"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Facility Description</label>
                  <input 
                    type="text"
                    value={stationaryFormData.facilityDescription}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, facilityDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Main Production Plant"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Equipment Type</label>
                  <select 
                    value={stationaryFormData.equipmentType}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, equipmentType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Equipment Type</option>
                    <option value="Boiler">Boiler</option>
                    <option value="Furnace">Furnace</option>
                    <option value="Generator">Generator</option>
                    <option value="Heater">Heater</option>
                    <option value="Oven">Oven</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Fuel Type</label>
                  <select 
                    value={stationaryFormData.fuelType}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, fuelType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Natural Gas">Natural Gas</option>
                    <option value="Heating Oil">Heating Oil</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Coal">Coal</option>
                    <option value="Propane">Propane</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Quantity of Fuel Used</label>
                  <input 
                    type="text"
                    value={stationaryFormData.quantityOfFuelUsed}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, quantityOfFuelUsed: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="1,250 m³"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Custom Emission Factor</label>
                  <input 
                    type="text"
                    value={stationaryFormData.customEmissionFactor}
                    onChange={(e) => setStationaryFormData({...stationaryFormData, customEmissionFactor: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2.162 kg CO₂e/m³"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="editUseCustomEmissionFactor"
                  checked={stationaryFormData.useCustomEmissionFactor}
                  onChange={(e) => setStationaryFormData({...stationaryFormData, useCustomEmissionFactor: e.target.checked})}
                  className="rounded border-green-200 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="editUseCustomEmissionFactor" className="text-sm font-medium text-green-800">
                  Use Custom Emission Factor
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditStationaryModalOpen(false)}
                  className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Update Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && reviewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {reviewMode?.includes('add') ? 'Review New Entry' : 'Review Changes'}
                    </h2>
                    <p className="text-green-100 text-sm">
                      {reviewMode === 'add-stationary' && 'New Stationary Combustion Entry'}
                      {reviewMode === 'edit-stationary' && 'Edit Stationary Combustion Entry'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleReviewCancel}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Basic Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Month</span>
                        <span className="text-gray-900 font-semibold">{reviewData.month}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Year</span>
                        <span className="text-gray-900 font-semibold">{reviewData.year}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Facility ID</span>
                        <span className="text-gray-900 font-semibold">{reviewData.facilityId}</span>
                      </div>
                      {reviewData.facilityDescription && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600 font-medium">Facility Description</span>
                          <span className="text-gray-900 font-semibold">{reviewData.facilityDescription}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Equipment Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Equipment Type</span>
                        <span className="text-gray-900 font-semibold">{reviewData.equipmentType}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">Fuel Type</span>
                        <span className="text-gray-900 font-semibold">{reviewData.fuelType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Consumption Data</h4>
                    <div className="space-y-3">
                      {reviewData.quantityOfFuelUsed && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Quantity of Fuel Used</span>
                          <span className="text-gray-900 font-semibold">{reviewData.quantityOfFuelUsed}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Emission Factors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Custom Emission Factor</span>
                        <span className="text-gray-900 font-semibold">{reviewData.customEmissionFactor || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">Use Custom Factor</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          reviewData.useCustomEmissionFactor 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {reviewData.useCustomEmissionFactor ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleReviewCancel}
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReviewEdit}
                  className="px-6 py-3 text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button 
                  onClick={handleReviewConfirm}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {reviewMode?.includes('add') ? 'Confirm Add' : 'Confirm Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 