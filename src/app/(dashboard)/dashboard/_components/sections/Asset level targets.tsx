import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Target, TrendingDown, Calendar, DollarSign, CheckCircle, 
  AlertCircle, Plus, X, BarChart3, Settings, FileText, Calculator, 
  Globe, Factory, Zap, Truck, Building, AlertTriangle, Info, Award, 
  Shield, Users, Briefcase, Activity, LineChart, MapPin, Car, Wrench,
  Home, Layers, Edit3, Save, RotateCcw
} from 'lucide-react';

const AssetLevelTargetPlatform = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('facilities');
  const [editingItem, setEditingItem] = useState(null);
  
  // Sample asset data that would come from your existing system
  const [assetData, setAssetData] = useState({
    facilities: [
      {
        id: 'fac_001',
        name: 'Manufacturing Plant A',
        location: 'Texas, USA',
        type: 'manufacturing',
        size: 125000, // sq ft
        employees: 450,
        currentEmissions: 15600, // tCO2e/year
        baselineEmissions: 18200,
        targetEmissions: 10400,
        targetYear: 2030,
        equipment: ['HVAC-001', 'PROD-001', 'PROD-002'],
        initiatives: ['LED Upgrade', 'Solar Installation'],
        status: 'active'
      },
      {
        id: 'fac_002',
        name: 'Distribution Center B',
        location: 'California, USA',
        type: 'warehouse',
        size: 85000,
        employees: 120,
        currentEmissions: 4200,
        baselineEmissions: 5800,
        targetEmissions: 2900,
        targetYear: 2028,
        equipment: ['HVAC-002', 'FORK-001'],
        initiatives: ['Energy Management'],
        status: 'active'
      },
      {
        id: 'fac_003',
        name: 'Office Headquarters',
        location: 'New York, USA',
        type: 'office',
        size: 45000,
        employees: 280,
        currentEmissions: 1800,
        baselineEmissions: 2400,
        targetEmissions: 1200,
        targetYear: 2027,
        equipment: ['HVAC-003'],
        initiatives: ['Smart Building'],
        status: 'active'
      }
    ],
    equipment: [
      {
        id: 'HVAC-001',
        name: 'Plant A HVAC System',
        facility: 'fac_001',
        category: 'hvac',
        manufacturer: 'ThermoTech',
        model: 'TT-5000',
        installDate: '2019',
        capacity: '500 tons',
        currentEmissions: 3200,
        baselineEmissions: 4100,
        targetEmissions: 1600,
        targetYear: 2029,
        efficiency: 85,
        status: 'operational'
      },
      {
        id: 'PROD-001',
        name: 'Production Line 1',
        facility: 'fac_001',
        category: 'production',
        manufacturer: 'IndustrialCorp',
        model: 'IC-PRO-X',
        installDate: '2020',
        capacity: '1000 units/day',
        currentEmissions: 8900,
        baselineEmissions: 10200,
        targetEmissions: 6200,
        targetYear: 2030,
        efficiency: 78,
        status: 'operational'
      },
      {
        id: 'PROD-002',
        name: 'Production Line 2',
        facility: 'fac_001',
        category: 'production',
        manufacturer: 'IndustrialCorp',
        model: 'IC-PRO-Y',
        installDate: '2021',
        capacity: '800 units/day',
        currentEmissions: 3500,
        baselineEmissions: 3900,
        targetEmissions: 2400,
        targetYear: 2030,
        efficiency: 82,
        status: 'operational'
      },
      {
        id: 'HVAC-002',
        name: 'Warehouse B HVAC',
        facility: 'fac_002',
        category: 'hvac',
        manufacturer: 'CoolAir',
        model: 'CA-300',
        installDate: '2018',
        capacity: '200 tons',
        currentEmissions: 2800,
        baselineEmissions: 3600,
        targetEmissions: 1400,
        targetYear: 2028,
        efficiency: 79,
        status: 'operational'
      }
    ],
    fleet: [
      {
        id: 'fleet_001',
        name: 'Delivery Trucks',
        category: 'commercial_vehicles',
        vehicleCount: 25,
        vehicleType: 'Class 6 Trucks',
        fuelType: 'diesel',
        averageAge: 4,
        annualMileage: 180000,
        currentEmissions: 4800,
        baselineEmissions: 5200,
        targetEmissions: 2400,
        targetYear: 2029,
        electrificationPlan: 'partial',
        status: 'active'
      },
      {
        id: 'fleet_002',
        name: 'Company Cars',
        category: 'passenger_vehicles',
        vehicleCount: 45,
        vehicleType: 'Sedans/SUVs',
        fuelType: 'gasoline',
        averageAge: 3,
        annualMileage: 540000,
        currentEmissions: 3200,
        baselineEmissions: 3600,
        targetEmissions: 800,
        targetYear: 2027,
        electrificationPlan: 'full',
        status: 'active'
      },
      {
        id: 'fleet_003',
        name: 'Service Vans',
        category: 'service_vehicles',
        vehicleCount: 12,
        vehicleType: 'Cargo Vans',
        fuelType: 'diesel',
        averageAge: 5,
        annualMileage: 96000,
        currentEmissions: 1600,
        baselineEmissions: 1800,
        targetEmissions: 600,
        targetYear: 2030,
        electrificationPlan: 'partial',
        status: 'active'
      }
    ],
    activities: [
      {
        id: 'act_001',
        name: 'Business Travel',
        category: 'scope3_travel',
        description: 'Employee air and ground travel',
        annualTrips: 1200,
        averageDistance: 850, // miles
        currentEmissions: 2400,
        baselineEmissions: 3100,
        targetEmissions: 1200,
        targetYear: 2028,
        reductionStrategy: 'virtual_meetings',
        status: 'active'
      },
      {
        id: 'act_002',
        name: 'Employee Commuting',
        category: 'scope3_commuting',
        description: 'Daily employee commute',
        employees: 850,
        averageCommute: 25, // miles one way
        currentEmissions: 1800,
        baselineEmissions: 2200,
        targetEmissions: 900,
        targetYear: 2029,
        reductionStrategy: 'remote_work',
        status: 'active'
      },
      {
        id: 'act_003',
        name: 'Waste Management',
        category: 'scope3_waste',
        description: 'Operational waste treatment',
        annualWaste: 450, // tons
        recyclingRate: 65, // %
        currentEmissions: 180,
        baselineEmissions: 280,
        targetEmissions: 90,
        targetYear: 2026,
        reductionStrategy: 'circular_economy',
        status: 'active'
      }
    ],
    suppliers: [
      {
        id: 'sup_001',
        name: 'Steel Corp Inc',
        category: 'raw_materials',
        annualSpend: 2500000,
        emissionIntensity: 2.8, // tCO2e per $1000 spend
        currentEmissions: 7000,
        baselineEmissions: 8500,
        targetEmissions: 4200,
        targetYear: 2030,
        engagementLevel: 'committed',
        status: 'active'
      },
      {
        id: 'sup_002',
        name: 'Logistics Partners',
        category: 'transportation',
        annualSpend: 1200000,
        emissionIntensity: 1.5,
        currentEmissions: 1800,
        baselineEmissions: 2100,
        targetEmissions: 900,
        targetYear: 2029,
        engagementLevel: 'exploring',
        status: 'active'
      },
      {
        id: 'sup_003',
        name: 'Component Manufacturing',
        category: 'components',
        annualSpend: 3200000,
        emissionIntensity: 2.1,
        currentEmissions: 6720,
        baselineEmissions: 7800,
        targetEmissions: 3360,
        targetYear: 2031,
        engagementLevel: 'committed',
        status: 'active'
      }
    ]
  });

  // Calculate totals and rollups
  const calculateTotals = () => {
    const totals = {
      facilities: {
        current: assetData.facilities.reduce((sum, f) => sum + f.currentEmissions, 0),
        baseline: assetData.facilities.reduce((sum, f) => sum + f.baselineEmissions, 0),
        target: assetData.facilities.reduce((sum, f) => sum + f.targetEmissions, 0)
      },
      equipment: {
        current: assetData.equipment.reduce((sum, e) => sum + e.currentEmissions, 0),
        baseline: assetData.equipment.reduce((sum, e) => sum + e.baselineEmissions, 0),
        target: assetData.equipment.reduce((sum, e) => sum + e.targetEmissions, 0)
      },
      fleet: {
        current: assetData.fleet.reduce((sum, f) => sum + f.currentEmissions, 0),
        baseline: assetData.fleet.reduce((sum, f) => sum + f.baselineEmissions, 0),
        target: assetData.fleet.reduce((sum, f) => sum + f.targetEmissions, 0)
      },
      activities: {
        current: assetData.activities.reduce((sum, a) => sum + a.currentEmissions, 0),
        baseline: assetData.activities.reduce((sum, a) => sum + a.baselineEmissions, 0),
        target: assetData.activities.reduce((sum, a) => sum + a.targetEmissions, 0)
      },
      suppliers: {
        current: assetData.suppliers.reduce((sum, s) => sum + s.currentEmissions, 0),
        baseline: assetData.suppliers.reduce((sum, s) => sum + s.baselineEmissions, 0),
        target: assetData.suppliers.reduce((sum, s) => sum + s.targetEmissions, 0)
      }
    };

    totals.overall = {
      current: Object.values(totals).reduce((sum, cat) => sum + (cat.current || 0), 0),
      baseline: Object.values(totals).reduce((sum, cat) => sum + (cat.baseline || 0), 0),
      target: Object.values(totals).reduce((sum, cat) => sum + (cat.target || 0), 0)
    };

    return totals;
  };

  const updateItemTarget = (category, itemId, field, value) => {
    setAssetData(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === itemId 
          ? { ...item, [field]: parseFloat(value) || 0 }
          : item
      )
    }));
  };

  // Overview Dashboard
  const OverviewDashboard = () => {
    const totals = calculateTotals();
    const overallReduction = ((totals.overall.baseline - totals.overall.target) / totals.overall.baseline * 100);
    
    return (
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Current Emissions</p>
                <p className="text-3xl font-bold text-blue-600">{totals.overall.current.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">tCO₂e/year</p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Target Emissions</p>
                <p className="text-3xl font-bold text-green-600">{totals.overall.target.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">tCO₂e/year by 2030</p>
              </div>
              <Target className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reduction</p>
                <p className="text-3xl font-bold text-purple-600">{overallReduction.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">from baseline</p>
              </div>
              <TrendingDown className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Asset Categories</p>
                <p className="text-3xl font-bold text-orange-600">5</p>
                <p className="text-xs text-gray-500 mt-1">with targets set</p>
              </div>
              <Layers className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Category</h3>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(totals).filter(([key]) => key !== 'overall').map(([category, data]) => {
              const reduction = ((data.baseline - data.target) / data.baseline * 100);
              const icons = {
                facilities: Building,
                equipment: Wrench,
                fleet: Car,
                activities: Activity,
                suppliers: Users
              };
              const Icon = icons[category];
              
              return (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 capitalize">{category}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium">{data.current.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium">{data.target.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reduction:</span>
                      <span className="font-medium text-green-600">{reduction.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asset Summary Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Portfolio Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Assets</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Current Emissions</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Target Emissions</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Reduction</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium">Facilities</td>
                  <td className="px-4 py-3">{assetData.facilities.length} locations</td>
                  <td className="px-4 py-3">{totals.facilities.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3">{totals.facilities.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">{((totals.facilities.baseline - totals.facilities.target) / totals.facilities.baseline * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">On Track</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Equipment</td>
                  <td className="px-4 py-3">{assetData.equipment.length} units</td>
                  <td className="px-4 py-3">{totals.equipment.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3">{totals.equipment.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">{((totals.equipment.baseline - totals.equipment.target) / totals.equipment.baseline * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">On Track</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Fleet</td>
                  <td className="px-4 py-3">{assetData.fleet.reduce((sum, f) => sum + f.vehicleCount, 0)} vehicles</td>
                  <td className="px-4 py-3">{totals.fleet.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3">{totals.fleet.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">{((totals.fleet.baseline - totals.fleet.target) / totals.fleet.baseline * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">At Risk</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Activities</td>
                  <td className="px-4 py-3">{assetData.activities.length} categories</td>
                  <td className="px-4 py-3">{totals.activities.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3">{totals.activities.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">{((totals.activities.baseline - totals.activities.target) / totals.activities.baseline * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">On Track</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Suppliers</td>
                  <td className="px-4 py-3">{assetData.suppliers.length} partners</td>
                  <td className="px-4 py-3">{totals.suppliers.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3">{totals.suppliers.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">{((totals.suppliers.baseline - totals.suppliers.target) / totals.suppliers.baseline * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">In Progress</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Asset Detail View
  const AssetDetailView = () => {
    const categoryConfig = {
      facilities: {
        title: 'Facilities',
        icon: Building,
        color: 'blue',
        fields: ['name', 'location', 'type', 'size', 'employees']
      },
      equipment: {
        title: 'Equipment',
        icon: Wrench,
        color: 'green',
        fields: ['name', 'facility', 'category', 'manufacturer', 'capacity']
      },
      fleet: {
        title: 'Fleet',
        icon: Car,
        color: 'purple',
        fields: ['name', 'category', 'vehicleCount', 'vehicleType', 'fuelType']
      },
      activities: {
        title: 'Activities',
        icon: Activity,
        color: 'orange',
        fields: ['name', 'category', 'description', 'reductionStrategy']
      },
      suppliers: {
        title: 'Suppliers',
        icon: Users,
        color: 'indigo',
        fields: ['name', 'category', 'annualSpend', 'engagementLevel']
      }
    };

    const config = categoryConfig[selectedCategory];
    const data = assetData[selectedCategory];
    const Icon = config.icon;

    return (
      <div className="space-y-6">
        {/* Category Header */}
        <div className={`bg-${config.color}-50 border border-${config.color}-200 rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className={`w-8 h-8 text-${config.color}-600`} />
              <div>
                <h3 className={`text-2xl font-semibold text-${config.color}-900`}>{config.title} Target Management</h3>
                <p className={`text-${config.color}-700`}>Set individual targets for each {selectedCategory.slice(0, -1)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold text-${config.color}-700`}>{data.length}</div>
              <div className={`text-sm text-${config.color}-600`}>Total {config.title}</div>
            </div>
          </div>
        </div>

        {/* Asset Cards */}
        <div className="grid grid-cols-1 gap-6">
          {data.map((item) => {
            const reduction = ((item.baselineEmissions - item.targetEmissions) / item.baselineEmissions * 100);
            const isEditing = editingItem === item.id;
            
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 text-${config.color}-600`} />
                      <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                      {item.location && <span className="text-sm text-gray-500">• {item.location}</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!isEditing ? (
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Targets</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingItem(null)}
                            className="flex items-center space-x-2 px-3 py-1 text-green-600 hover:bg-green-50 rounded-md"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="flex items-center space-x-2 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Asset Details */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Asset Details</h5>
                      <div className="space-y-2 text-sm">
                        {selectedCategory === 'facilities' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium capitalize">{item.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Size:</span>
                              <span className="font-medium">{item.size?.toLocaleString()} sq ft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Employees:</span>
                              <span className="font-medium">{item.employees}</span>
                            </div>
                          </>
                        )}
                        {selectedCategory === 'equipment' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Facility:</span>
                              <span className="font-medium">{assetData.facilities.find(f => f.id === item.facility)?.name || item.facility}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium capitalize">{item.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Capacity:</span>
                              <span className="font-medium">{item.capacity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Efficiency:</span>
                              <span className="font-medium">{item.efficiency}%</span>
                            </div>
                          </>
                        )}
                        {selectedCategory === 'fleet' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Vehicle Count:</span>
                              <span className="font-medium">{item.vehicleCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium">{item.vehicleType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Fuel:</span>
                              <span className="font-medium capitalize">{item.fuelType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Annual Mileage:</span>
                              <span className="font-medium">{item.annualMileage?.toLocaleString()}</span>
                            </div>
                          </>
                        )}
                        {selectedCategory === 'activities' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium capitalize">{item.category.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Strategy:</span>
                              <span className="font-medium capitalize">{item.reductionStrategy?.replace('_', ' ')}</span>
                            </div>
                          </>
                        )}
                        {selectedCategory === 'suppliers' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium capitalize">{item.category.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Annual Spend:</span>
                              <span className="font-medium">${(item.annualSpend / 1000000).toFixed(1)}M</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Engagement:</span>
                              <span className="font-medium capitalize">{item.engagementLevel}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Emissions & Targets */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Emissions & Targets</h5>
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Baseline Emissions</span>
                            <span className="font-bold text-gray-900">{item.baselineEmissions.toLocaleString()} tCO₂e</span>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-blue-700">Current Emissions</span>
                            <span className="font-bold text-blue-900">{item.currentEmissions.toLocaleString()} tCO₂e</span>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-green-700">Target Emissions ({item.targetYear})</span>
                            {isEditing ? (
                              <input
                                type="number"
                                value={item.targetEmissions}
                                onChange={(e) => updateItemTarget(selectedCategory, item.id, 'targetEmissions', e.target.value)}
                                className="w-24 px-2 py-1 text-right text-sm border border-green-300 rounded"
                              />
                            ) : (
                              <span className="font-bold text-green-900">{item.targetEmissions.toLocaleString()} tCO₂e</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-purple-700">Target Year</span>
                            {isEditing ? (
                              <select
                                value={item.targetYear}
                                onChange={(e) => updateItemTarget(selectedCategory, item.id, 'targetYear', e.target.value)}
                                className="px-2 py-1 text-sm border border-purple-300 rounded"
                              >
                                {[2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="font-bold text-purple-900">{item.targetYear}</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-orange-700">Reduction Target</span>
                            <span className="font-bold text-orange-900">{reduction.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Khazra.ai</h1>
              <h2 className="text-lg text-gray-600">Asset-Level Target Management Platform</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <Target className="w-5 h-5" />
              <span className="font-medium">Granular Targets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 mb-8 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'overview' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'assets' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Asset Details</span>
        </button>
      </div>

      {/* Category Selection for Asset Details */}
      {activeTab === 'assets' && (
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'facilities', label: 'Facilities', icon: Building },
            { key: 'equipment', label: 'Equipment', icon: Wrench },
            { key: 'fleet', label: 'Fleet', icon: Car },
            { key: 'activities', label: 'Activities', icon: Activity },
            { key: 'suppliers', label: 'Suppliers', icon: Users }
          ].map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedCategory === category.key 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.label}</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                {assetData[category.key].length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[800px]">
        <div className="p-8">
          {activeTab === 'overview' && <OverviewDashboard />}
          {activeTab === 'assets' && <AssetDetailView />}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Asset-Level Carbon Target Management Platform</p>
        <p className="mt-1">Powered by Khazra.ai Sustainability Intelligence</p>
      </div>
    </div>
  );
};

export default AssetLevelTargetPlatform;