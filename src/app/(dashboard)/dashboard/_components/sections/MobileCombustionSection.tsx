'use client';

import { useState } from 'react';

export default function MobileCombustionSection() {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isEditMobileModalOpen, setIsEditMobileModalOpen] = useState(false);
  const [editingMobileData, setEditingMobileData] = useState<any>(null);
  const [editingMobileIndex, setEditingMobileIndex] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMode, setReviewMode] = useState<'add-mobile' | 'edit-mobile' | null>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [mobileFormData, setMobileFormData] = useState({
    month: '',
    year: '',
    facilityId: '',
    equipmentType: '',
    fuelType: '',
    fuelConsumed: false,
    amountOfFuelUsed: '',
    customEmissionFactor: '',
    useCustomEmissionFactor: false,
    total: ''
  });

  // State for Mobile Combustion table data array
  const [mobileCombustionData, setMobileCombustionData] = useState([
    {
      id: 1,
      month: 'January',
      year: '2024',
      facilityId: 'FAC-001',
      equipmentType: 'Delivery Truck',
      fuelType: 'Diesel',
      fuelConsumed: true,
      amountOfFuelUsed: '450 L',
      customEmissionFactor: '2.68 kg CO₂e/L',
      useCustomEmissionFactor: false,
      total: '1,206 kg CO₂e'
    },
    {
      id: 2,
      month: 'January',
      year: '2024',
      facilityId: 'FAC-002',
      equipmentType: 'Forklift',
      fuelType: 'Gasoline',
      fuelConsumed: true,
      amountOfFuelUsed: '180 L',
      customEmissionFactor: '2.31 kg CO₂e/L',
      useCustomEmissionFactor: true,
      total: '415.8 kg CO₂e'
    },
    {
      id: 3,
      month: 'January',
      year: '2024',
      facilityId: 'FAC-003',
      equipmentType: 'Company Car',
      fuelType: 'Hybrid',
      fuelConsumed: true,
      amountOfFuelUsed: '95 L',
      customEmissionFactor: '1.85 kg CO₂e/L',
      useCustomEmissionFactor: false,
      total: '175.75 kg CO₂e'
    }
  ]);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mobile Combustion Data:', mobileFormData);
    
    // Show review modal instead of directly adding
    setReviewData(mobileFormData);
    setReviewMode('add-mobile');
    setShowReviewModal(true);
    setIsMobileModalOpen(false);
  };

  const handleEditMobile = (rowData: any, index: number) => {
    setEditingMobileData(rowData);
    setEditingMobileIndex(index);
    setMobileFormData({
      month: rowData.month,
      year: rowData.year,
      facilityId: rowData.facilityId,
      equipmentType: rowData.equipmentType,
      fuelType: rowData.fuelType,
      fuelConsumed: rowData.fuelConsumed,
      amountOfFuelUsed: rowData.amountOfFuelUsed,
      customEmissionFactor: rowData.customEmissionFactor,
      useCustomEmissionFactor: rowData.useCustomEmissionFactor,
      total: rowData.total
    });
    setIsEditMobileModalOpen(true);
  };

  const handleEditMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Mobile Combustion Data:', mobileFormData);
    console.log('Original Data:', editingMobileData);
    
    // Show review modal instead of directly updating
    setReviewData(mobileFormData);
    setReviewMode('edit-mobile');
    setShowReviewModal(true);
    setIsEditMobileModalOpen(false);
  };

  // Review modal handlers
  const handleReviewConfirm = () => {
    if (reviewMode === 'add-mobile') {
      const newRow = {
        id: Math.max(...mobileCombustionData.map(row => row.id)) + 1,
        ...reviewData
      };
      setMobileCombustionData([...mobileCombustionData, newRow]);
      console.log('Confirmed: Added new mobile combustion row');
    } else if (reviewMode === 'edit-mobile' && editingMobileIndex !== null) {
      const updatedData = [...mobileCombustionData];
      updatedData[editingMobileIndex] = {
        ...updatedData[editingMobileIndex],
        ...reviewData
      };
      setMobileCombustionData(updatedData);
      console.log('Confirmed: Updated mobile combustion row');
    }
    
    // Reset review modal
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);
    
    // Reset editing states
    setEditingMobileData(null);
    setEditingMobileIndex(null);
    
    // Reset forms
    setMobileFormData({
      month: '',
      year: '',
      facilityId: '',
      equipmentType: '',
      fuelType: '',
      fuelConsumed: false,
      amountOfFuelUsed: '',
      customEmissionFactor: '',
      useCustomEmissionFactor: false,
      total: ''
    });
  };

  const handleReviewCancel = () => {
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);
    
    // Reset editing states
    setEditingMobileData(null);
    setEditingMobileIndex(null);
    
    // Reset forms
    setMobileFormData({
      month: '',
      year: '',
      facilityId: '',
      equipmentType: '',
      fuelType: '',
      fuelConsumed: false,
      amountOfFuelUsed: '',
      customEmissionFactor: '',
      useCustomEmissionFactor: false,
      total: ''
    });
  };

  const handleReviewEdit = () => {
    setShowReviewModal(false);
    
    // Reopen the appropriate modal for editing
    if (reviewMode === 'add-mobile' || reviewMode === 'edit-mobile') {
      setMobileFormData(reviewData);
      setIsMobileModalOpen(true);
    }
    
    setReviewMode(null);
    setReviewData(null);
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Mobile Combustion Emissions
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Direct greenhouse gas emissions from mobile combustion sources owned or controlled by your organization, 
          including fleet vehicles, delivery trucks, forklifts, and other mobile equipment.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Total Mobile
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">985.4</div>
              <div className="text-sm text-green-800 mb-2">▼ 15.2% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
                tonnes CO₂e • 30.3% of Scope 1
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🚗
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '30.3%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Fleet Size
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">45</div>
              <div className="text-sm text-green-800 mb-2">Active vehicles</div>
              <div className="text-xs text-green-800 opacity-60">
                Delivery trucks, forklifts, cars
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🚛
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Primary Fuel
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">Diesel</div>
              <div className="text-sm text-green-800 mb-2">55% of consumption</div>
              <div className="text-xs text-green-800 opacity-60">
                Followed by gasoline, hybrid
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ⛽
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Combustion Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Mobile Combustion Data</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Filter
            </button>
            <button 
              onClick={() => setIsMobileModalOpen(true)}
              className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Add Mobile Combustion
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
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Equipment Type</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Fuel Type</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Fuel Consumed</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Amount of Fuel Used</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Custom Emission Factor</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">If Use Custom Emission Factor</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Total</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {mobileCombustionData.map((row, index) => (
                <tr key={row.id} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-green-800">{row.month}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.year}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.facilityId}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.equipmentType}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.fuelType}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.fuelConsumed ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.amountOfFuelUsed}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.customEmissionFactor}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.useCustomEmissionFactor ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.total}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditMobile(row, index)}
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

      {/* Mobile Combustion Modal */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 bg-gray-500/50 h-screen bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] border-2 border-green-800 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">Add Mobile Combustion</h2>
              <button 
                onClick={() => setIsMobileModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Month</label>
                  <select 
                    value={mobileFormData.month}
                    onChange={(e) => setMobileFormData({...mobileFormData, month: e.target.value})}
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
                    value={mobileFormData.year}
                    onChange={(e) => setMobileFormData({...mobileFormData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2024"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Facility ID</label>
                  <input 
                    type="text"
                    value={mobileFormData.facilityId}
                    onChange={(e) => setMobileFormData({...mobileFormData, facilityId: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="FAC-001"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Equipment Type</label>
                  <select 
                    value={mobileFormData.equipmentType}
                    onChange={(e) => setMobileFormData({...mobileFormData, equipmentType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Equipment Type</option>
                    <option value="Delivery Truck">Delivery Truck</option>
                    <option value="Forklift">Forklift</option>
                    <option value="Company Car">Company Car</option>
                    <option value="Van">Van</option>
                    <option value="Tractor">Tractor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Fuel Type</label>
                  <select 
                    value={mobileFormData.fuelType}
                    onChange={(e) => setMobileFormData({...mobileFormData, fuelType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="Biodiesel">Biodiesel</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Amount of Fuel Used</label>
                  <input 
                    type="text"
                    value={mobileFormData.amountOfFuelUsed}
                    onChange={(e) => setMobileFormData({...mobileFormData, amountOfFuelUsed: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="450 L"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Custom Emission Factor</label>
                  <input 
                    type="text"
                    value={mobileFormData.customEmissionFactor}
                    onChange={(e) => setMobileFormData({...mobileFormData, customEmissionFactor: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2.68 kg CO₂e/L"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Total</label>
                  <input 
                    type="text"
                    value={mobileFormData.total}
                    onChange={(e) => setMobileFormData({...mobileFormData, total: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="1,206 kg CO₂e"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="fuelConsumed"
                  checked={mobileFormData.fuelConsumed}
                  onChange={(e) => setMobileFormData({...mobileFormData, fuelConsumed: e.target.checked})}
                  className="rounded border-green-200 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="fuelConsumed" className="text-sm font-medium text-green-800">
                  Fuel Consumed
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="useCustomEmissionFactorMobile"
                  checked={mobileFormData.useCustomEmissionFactor}
                  onChange={(e) => setMobileFormData({...mobileFormData, useCustomEmissionFactor: e.target.checked})}
                  className="rounded border-green-200 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="useCustomEmissionFactorMobile" className="text-sm font-medium text-green-800">
                  Use Custom Emission Factor
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsMobileModalOpen(false)}
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

      {/* Edit Mobile Combustion Modal */}
      {isEditMobileModalOpen && (
        <div className="fixed inset-0 bg-gray-500/50 h-screen bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] border-2 border-green-800 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">Edit Mobile Combustion</h2>
              <button 
                onClick={() => setIsEditMobileModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditMobileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Month</label>
                  <select 
                    value={mobileFormData.month}
                    onChange={(e) => setMobileFormData({...mobileFormData, month: e.target.value})}
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
                    value={mobileFormData.year}
                    onChange={(e) => setMobileFormData({...mobileFormData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2024"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Facility ID</label>
                  <input 
                    type="text"
                    value={mobileFormData.facilityId}
                    onChange={(e) => setMobileFormData({...mobileFormData, facilityId: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="FAC-001"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Equipment Type</label>
                  <select 
                    value={mobileFormData.equipmentType}
                    onChange={(e) => setMobileFormData({...mobileFormData, equipmentType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Equipment Type</option>
                    <option value="Delivery Truck">Delivery Truck</option>
                    <option value="Forklift">Forklift</option>
                    <option value="Company Car">Company Car</option>
                    <option value="Van">Van</option>
                    <option value="Tractor">Tractor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Fuel Type</label>
                  <select 
                    value={mobileFormData.fuelType}
                    onChange={(e) => setMobileFormData({...mobileFormData, fuelType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="Biodiesel">Biodiesel</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Amount of Fuel Used</label>
                  <input 
                    type="text"
                    value={mobileFormData.amountOfFuelUsed}
                    onChange={(e) => setMobileFormData({...mobileFormData, amountOfFuelUsed: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="450 L"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Custom Emission Factor</label>
                  <input 
                    type="text"
                    value={mobileFormData.customEmissionFactor}
                    onChange={(e) => setMobileFormData({...mobileFormData, customEmissionFactor: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2.68 kg CO₂e/L"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Total</label>
                  <input 
                    type="text"
                    value={mobileFormData.total}
                    onChange={(e) => setMobileFormData({...mobileFormData, total: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="1,206 kg CO₂e"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="editFuelConsumed"
                  checked={mobileFormData.fuelConsumed}
                  onChange={(e) => setMobileFormData({...mobileFormData, fuelConsumed: e.target.checked})}
                  className="rounded border-green-200 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="editFuelConsumed" className="text-sm font-medium text-green-800">
                  Fuel Consumed
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="editUseCustomEmissionFactorMobile"
                  checked={mobileFormData.useCustomEmissionFactor}
                  onChange={(e) => setMobileFormData({...mobileFormData, useCustomEmissionFactor: e.target.checked})}
                  className="rounded border-green-200 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="editUseCustomEmissionFactorMobile" className="text-sm font-medium text-green-800">
                  Use Custom Emission Factor
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditMobileModalOpen(false)}
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
                      {reviewMode === 'add-mobile' && 'New Mobile Combustion Entry'}
                      {reviewMode === 'edit-mobile' && 'Edit Mobile Combustion Entry'}
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
                      {reviewData.amountOfFuelUsed && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Amount of Fuel Used</span>
                          <span className="text-gray-900 font-semibold">{reviewData.amountOfFuelUsed}</span>
                        </div>
                      )}
                      {reviewData.fuelConsumed !== undefined && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600 font-medium">Fuel Consumed</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            reviewData.fuelConsumed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reviewData.fuelConsumed ? 'Yes' : 'No'}
                          </span>
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
                      {reviewData.total && (
                        <div className="flex items-center justify-between py-2 border-t border-gray-200 pt-3">
                          <span className="text-gray-600 font-medium">Total</span>
                          <span className="text-green-600 font-bold text-lg">{reviewData.total}</span>
                        </div>
                      )}
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