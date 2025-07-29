'use client';

import { useState } from 'react';

export default function Scope1Section() {
  const [isStationaryModalOpen, setIsStationaryModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isEditStationaryModalOpen, setIsEditStationaryModalOpen] = useState(false);
  const [isEditMobileModalOpen, setIsEditMobileModalOpen] = useState(false);
  const [editingStationaryData, setEditingStationaryData] = useState<any>(null);
  const [editingMobileData, setEditingMobileData] = useState<any>(null);
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

  const handleStationarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission for stationary combustion
    console.log('Stationary Combustion Data:', stationaryFormData);
    setIsStationaryModalOpen(false);
    // Reset form
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

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission for mobile combustion
    console.log('Mobile Combustion Data:', mobileFormData);
    setIsMobileModalOpen(false);
    // Reset form
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

  const handleEditStationary = (rowData: any) => {
    setEditingStationaryData(rowData);
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

  const handleEditMobile = (rowData: any) => {
    setEditingMobileData(rowData);
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

  const handleEditStationarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle edit form submission for stationary combustion
    console.log('Updated Stationary Combustion Data:', stationaryFormData);
    console.log('Original Data:', editingStationaryData);
    setIsEditStationaryModalOpen(false);
    setEditingStationaryData(null);
    // Reset form
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

  const handleEditMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle edit form submission for mobile combustion
    console.log('Updated Mobile Combustion Data:', mobileFormData);
    console.log('Original Data:', editingMobileData);
    setIsEditMobileModalOpen(false);
    setEditingMobileData(null);
    // Reset form
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

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Scope 1 Emissions Analysis
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Direct greenhouse gas emissions from sources owned or controlled by your organization, 
          including detailed analysis of stationary combustion, mobile combustion, process emissions, and fugitive emissions.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Total Scope 1
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">3,247.8</div>
              <div className="text-sm text-green-800 mb-2">▼ 12.4% vs baseline</div>
              <div className="text-xs text-green-800 opacity-60">
                tonnes CO₂e • 36.3% of total emissions
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🏭
            </div>
          </div>
          <div className="h-10 relative">
            <svg width="100%" height="40" viewBox="0 0 200 40" className="absolute inset-0">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green-800"
                points="0,35 20,32 40,30 60,28 80,25 100,23 120,20 140,18 160,15 180,12 200,10"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Stationary Combustion
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">1,746.2</div>
              <div className="text-sm text-green-800 mb-2">▼ 8.5% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
                Largest source • 53.8% of Scope 1
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
                Mobile Combustion
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">985.4</div>
              <div className="text-sm text-green-800 mb-2">▼ 15.2% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
                Fleet optimization • 30.3% of Scope 1
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
                Process Emissions
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">516.2</div>
              <div className="text-sm text-green-800 mb-2">▼ 5.8% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
                Industrial processes • 15.9% of Scope 1
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🏭
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '15.9%' }}></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📊 Scope 1 Breakdown by Source
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md">This Year</button>
              <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-200 rounded-md hover:bg-green-50">Last Year</button>
              <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-200 rounded-md hover:bg-green-50">Comparison</button>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <svg viewBox="0 0 300 200" className="w-full h-full">
              <g transform="translate(150,100)">
                {/* Stationary Combustion - 53.8% */}
                <path
                  d="M 0,-60 A 60,60 0 1,1 32.3,49.7 L 0,0 Z"
                  fill="#0f5744"
                  opacity="1"
                />
                {/* Mobile Combustion - 30.3% */}
                <path
                  d="M 32.3,49.7 A 60,60 0 0,1 -58.5,-10.8 L 0,0 Z"
                  fill="#0f5744"
                  opacity="0.8"
                />
                {/* Process Emissions - 15.9% */}
                <path
                  d="M -58.5,-10.8 A 60,60 0 0,1 0,-60 L 0,0 Z"
                  fill="#0f5744"
                  opacity="0.6"
                />

                {/* Labels */}
                <text x="0" y="-35" textAnchor="middle" fontSize="10" fill="white">
                  53.8%
                </text>
                <text x="20" y="25" textAnchor="middle" fontSize="10" fill="white">
                  30.3%
                </text>
                <text x="-25" y="-25" textAnchor="middle" fontSize="10" fill="white">
                  15.9%
                </text>
              </g>
            </svg>
          </div>
          <div className="flex gap-5 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
              <span className="text-sm text-green-800">Stationary Combustion (1,746.2 tCO₂e)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-80"></div>
              <span className="text-sm text-green-800">Mobile Combustion (985.4 tCO₂e)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-60"></div>
              <span className="text-sm text-green-800">Process Emissions (516.2 tCO₂e)</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📈 Monthly Trends
            </h3>
          </div>
          <div className="h-80 relative">
            <svg viewBox="0 0 300 150" className="w-full h-full">
              {/* Grid */}
              <defs>
                <pattern id="monthlyGrid" width="30" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 15" fill="none" stroke="#e4f5d5" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#monthlyGrid)" />

              {/* Data line */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="3"
                points="15,120 45,115 75,110 105,108 135,105 165,100 195,98 225,95 255,90 285,85"
              />

              {/* Data points */}
              <circle cx="285" cy="85" r="4" fill="#0f5744" />

              {/* Labels */}
              <text x="15" y="140" fontSize="8" fill="#0f5744">Jan</text>
              <text x="75" y="140" fontSize="8" fill="#0f5744">Mar</text>
              <text x="135" y="140" fontSize="8" fill="#0f5744">May</text>
              <text x="195" y="140" fontSize="8" fill="#0f5744">Jul</text>
              <text x="255" y="140" fontSize="8" fill="#0f5744">Sep</text>
            </svg>
          </div>
          <div className="text-center text-xs text-green-800 opacity-70 mt-4">
            Continuous reduction trend • Target: -15% by Dec 2025
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🔥
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Stationary Combustion</h4>
              <div className="text-xs text-green-800 opacity-60">Boilers, furnaces, generators</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">1,746.2</div>
            <div className="text-sm text-green-800 opacity-60">53.8%</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '53.8%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            23 sources • Natural gas, heating oil
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🚗
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Mobile Combustion</h4>
              <div className="text-xs text-green-800 opacity-60">Fleet vehicles, equipment</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">985.4</div>
            <div className="text-sm text-green-800 opacity-60">30.3%</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '30.3%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            45 vehicles • Diesel, gasoline, hybrid
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🏭
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Process Emissions</h4>
              <div className="text-xs text-green-800 opacity-60">Industrial manufacturing</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">516.2</div>
            <div className="text-sm text-green-800 opacity-60">15.9%</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '15.9%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            Chemical processes • Manufacturing
          </div>
        </div>
      </div>

      {/* Stationary Combustion Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Stationary Combustion</div>
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
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">January</td>
                <td className="px-6 py-4 text-sm text-green-800">2024</td>
                <td className="px-6 py-4 text-sm text-green-800">FAC-001</td>
                <td className="px-6 py-4 text-sm text-green-800">Main Production Plant</td>
                <td className="px-6 py-4 text-sm text-green-800">Boiler</td>
                <td className="px-6 py-4 text-sm text-green-800">Natural Gas</td>
                <td className="px-6 py-4 text-sm text-green-800">1,250 m³</td>
                <td className="px-6 py-4 text-sm text-green-800">2.162 kg CO₂e/m³</td>
                <td className="px-6 py-4 text-sm text-green-800">Yes</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditStationary({
                        month: 'January',
                        year: '2024',
                        facilityId: 'FAC-001',
                        facilityDescription: 'Main Production Plant',
                        equipmentType: 'Boiler',
                        fuelType: 'Natural Gas',
                        quantityOfFuelUsed: '1,250 m³',
                        customEmissionFactor: '2.162 kg CO₂e/m³',
                        useCustomEmissionFactor: true
                      })}
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
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">January</td>
                <td className="px-6 py-4 text-sm text-green-800">2024</td>
                <td className="px-6 py-4 text-sm text-green-800">FAC-002</td>
                <td className="px-6 py-4 text-sm text-green-800">Secondary Processing Unit</td>
                <td className="px-6 py-4 text-sm text-green-800">Furnace</td>
                <td className="px-6 py-4 text-sm text-green-800">Heating Oil</td>
                <td className="px-6 py-4 text-sm text-green-800">850 L</td>
                <td className="px-6 py-4 text-sm text-green-800">3.15 kg CO₂e/L</td>
                <td className="px-6 py-4 text-sm text-green-800">No</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditStationary({
                        month: 'January',
                        year: '2024',
                        facilityId: 'FAC-002',
                        facilityDescription: 'Secondary Processing Unit',
                        equipmentType: 'Furnace',
                        fuelType: 'Heating Oil',
                        quantityOfFuelUsed: '850 L',
                        customEmissionFactor: '3.15 kg CO₂e/L',
                        useCustomEmissionFactor: false
                      })}
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
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">January</td>
                <td className="px-6 py-4 text-sm text-green-800">2024</td>
                <td className="px-6 py-4 text-sm text-green-800">FAC-003</td>
                <td className="px-6 py-4 text-sm text-green-800">Backup Power Station</td>
                <td className="px-6 py-4 text-sm text-green-800">Generator</td>
                <td className="px-6 py-4 text-sm text-green-800">Diesel</td>
                <td className="px-6 py-4 text-sm text-green-800">320 L</td>
                <td className="px-6 py-4 text-sm text-green-800">2.68 kg CO₂e/L</td>
                <td className="px-6 py-4 text-sm text-green-800">Yes</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditStationary({
                        month: 'January',
                        year: '2024',
                        facilityId: 'FAC-003',
                        facilityDescription: 'Backup Power Station',
                        equipmentType: 'Generator',
                        fuelType: 'Diesel',
                        quantityOfFuelUsed: '320 L',
                        customEmissionFactor: '2.68 kg CO₂e/L',
                        useCustomEmissionFactor: true
                      })}
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Combustion Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Mobile Combustion</div>
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
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">January</td>
                <td className="px-6 py-4 text-sm text-green-800">2024</td>
                <td className="px-6 py-4 text-sm text-green-800">FAC-001</td>
                <td className="px-6 py-4 text-sm text-green-800">Delivery Truck</td>
                <td className="px-6 py-4 text-sm text-green-800">Diesel</td>
                <td className="px-6 py-4 text-sm text-green-800">Yes</td>
                <td className="px-6 py-4 text-sm text-green-800">450 L</td>
                <td className="px-6 py-4 text-sm text-green-800">2.68 kg CO₂e/L</td>
                <td className="px-6 py-4 text-sm text-green-800">No</td>
                <td className="px-6 py-4 text-sm text-green-800">1,206 kg CO₂e</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditMobile({
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
                      })}
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
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">January</td>
                <td className="px-6 py-4 text-sm text-green-800">2024</td>
                <td className="px-6 py-4 text-sm text-green-800">FAC-002</td>
                <td className="px-6 py-4 text-sm text-green-800">Forklift</td>
                <td className="px-6 py-4 text-sm text-green-800">Gasoline</td>
                <td className="px-6 py-4 text-sm text-green-800">Yes</td>
                <td className="px-6 py-4 text-sm text-green-800">180 L</td>
                <td className="px-6 py-4 text-sm text-green-800">2.31 kg CO₂e/L</td>
                <td className="px-6 py-4 text-sm text-green-800">Yes</td>
                <td className="px-6 py-4 text-sm text-green-800">415.8 kg CO₂e</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditMobile({
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
                      })}
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
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">January</td>
                <td className="px-6 py-4 text-sm text-green-800">2024</td>
                <td className="px-6 py-4 text-sm text-green-800">FAC-003</td>
                <td className="px-6 py-4 text-sm text-green-800">Company Car</td>
                <td className="px-6 py-4 text-sm text-green-800">Hybrid</td>
                <td className="px-6 py-4 text-sm text-green-800">Yes</td>
                <td className="px-6 py-4 text-sm text-green-800">95 L</td>
                <td className="px-6 py-4 text-sm text-green-800">1.85 kg CO₂e/L</td>
                <td className="px-6 py-4 text-sm text-green-800">No</td>
                <td className="px-6 py-4 text-sm text-green-800">175.75 kg CO₂e</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditMobile({
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
                      })}
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Stationary Combustion Modal */}
      {isStationaryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

      {/* Mobile Combustion Modal */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

      {/* Edit Stationary Combustion Modal */}
      {isEditStationaryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

      {/* Edit Mobile Combustion Modal */}
      {isEditMobileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
    </div>
  );
} 