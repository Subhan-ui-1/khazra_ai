import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Target, TrendingDown, Calendar, DollarSign, CheckCircle, 
  AlertCircle, Plus, X, BarChart3, Settings, FileText, Calculator, 
  Globe, Factory, Zap, Truck, Building, AlertTriangle, Info, Award, 
  Shield, Users, Briefcase, Activity, LineChart, MapPin, Car, Wrench,
  Home, Layers, Edit3, Save, RotateCcw
} from 'lucide-react';
import { postRequest, getRequest } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// TypeScript interfaces
interface AssetData {
  facilities: Facility[];
  equipment: Equipment[];
  fleet: Fleet[];
}

interface Facility {
  id: string;
  facilityName: string;
  fullAddress: string;
  city: string;
  stateProvince: string;
  country: string;
  facilityType: string;
  floorArea: number;
  numberOfEmployees: number;
  status: string;
}

interface Equipment {
  id: string;
  equipmentName: string;
  facilityId: {
    facilityName: string;
  };
  equipmentTypeId: {
    equipmentName: string;
  };
  manufacturer: string;
  model: string;
  capacityValue: number;
  capacityUnit: string;
  efficiency: number;
  status: string;
}

interface Fleet {
  id: string;
  vehicleType: string;
  make: string;
  model: string;
  fuelType: string;
  annualMileage: {
    value: number;
    unit: string;
  };
  status: string;
}

interface GranularTarget {
  id: string;
  targetCategory: string;
  baselineEmissions: number;
  currentEmissions: number;
  targetEmissions: number;
  targetYear: number;
  assetId?: string;
  targetCategoryId?: string; // This will contain the actual asset ID
}

interface Totals {
  facilities: { current: number; baseline: number; target: number };
  equipment: { current: number; baseline: number; target: number };
  fleet: { current: number; baseline: number; target: number };
  overall: { current: number; baseline: number; target: number };
}

const AssetLevelTargetPlatform = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('facilities');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Asset data from APIs
  const [assetData, setAssetData] = useState<AssetData>({
    facilities: [],
    equipment: [],
    fleet: []
  });

  // Granular targets data
  const [granularTargets, setGranularTargets] = useState<GranularTarget[]>([]);

  // Token data
  const tokenData = JSON.parse(localStorage.getItem("tokens") || "{}");

  // Fetch data on component mount
  useEffect(() => {
    if (!tokenData.accessToken) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    fetchAssetData();
    fetchGranularTargets();
  }, []);

  // Fetch asset data from APIs
  const fetchAssetData = async () => {
    try {
      setLoading(true);
      
      // Fetch facilities
      const facilitiesResponse = await getRequest('facilities/getFacilities', tokenData.accessToken);
      if (facilitiesResponse.success) {
        setAssetData(prev => ({
          ...prev,
          facilities: facilitiesResponse.data.facilities || []
        }));
      }

      // Fetch equipment
      const equipmentResponse = await getRequest('equipments/getEquipments', tokenData.accessToken);
      if (equipmentResponse.success) {
        setAssetData(prev => ({
          ...prev,
          equipment: equipmentResponse.data.equipments || []
        }));
      }

      // Fetch vehicles (fleet)
      const vehiclesResponse = await getRequest('vehicles/getVehicles', tokenData.accessToken);
      if (vehiclesResponse.success) {
        setAssetData(prev => ({
          ...prev,
          fleet: vehiclesResponse.data.vehicles || []
        }));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch asset data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch granular targets
  const fetchGranularTargets = async () => {
    try {
      const response = await getRequest('granular-targets/getGranularTargets', tokenData.accessToken);
      if (response.success) {
        setGranularTargets(response.granularTargets || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch granular targets:', error);
    }
  };

  // Add/Update granular target
  const saveGranularTarget = async (targetData: {
    targetCategory: string;
    baselineEmissions: number;
    currentEmissions: number;
    targetEmissions: number;
    targetYear: number;
    targetCategoryId: string; // This will be the actual asset ID (facility/equipment/fleet ID)
    assetId: string;
  }) => {
    try {
      const response = await postRequest(
        'granular-targets/addGranularTarget',
        targetData,
        'Target saved successfully',
        tokenData.accessToken,
        'post'
      );
      
      if (response.success) {
        toast.success('Target saved successfully');
        fetchGranularTargets(); // Refresh targets
        setEditingItem(null);
      } else {
        toast.error(response.message || 'Failed to save target');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save target');
    }
  };

  // Calculate totals and rollups
  const calculateTotals = (): Totals => {
    const totals: Totals = {
      facilities: {
        current: granularTargets
          .filter(t => t.targetCategory === 'Facilities')
          .reduce((sum, t) => sum + t.currentEmissions, 0),
        baseline: granularTargets
          .filter(t => t.targetCategory === 'Facilities')
          .reduce((sum, t) => sum + t.baselineEmissions, 0),
        target: granularTargets
          .filter(t => t.targetCategory === 'Facilities')
          .reduce((sum, t) => sum + t.targetEmissions, 0)
      },
      equipment: {
        current: granularTargets
          .filter(t => t.targetCategory === 'Equipment')
          .reduce((sum, t) => sum + t.currentEmissions, 0),
        baseline: granularTargets
          .filter(t => t.targetCategory === 'Equipment')
          .reduce((sum, t) => sum + t.baselineEmissions, 0),
        target: granularTargets
          .filter(t => t.targetCategory === 'Equipment')
          .reduce((sum, t) => sum + t.targetEmissions, 0)
      },
      fleet: {
        current: granularTargets
          .filter(t => t.targetCategory === 'Fleet')
          .reduce((sum, t) => sum + t.currentEmissions, 0),
        baseline: granularTargets
          .filter(t => t.targetCategory === 'Fleet')
          .reduce((sum, t) => sum + t.baselineEmissions, 0),
        target: granularTargets
          .filter(t => t.targetCategory === 'Fleet')
          .reduce((sum, t) => sum + t.targetEmissions, 0)
      },
      overall: {
        current: 0,
        baseline: 0,
        target: 0
      }
    };

    totals.overall = {
      current: totals.facilities.current + totals.equipment.current + totals.fleet.current,
      baseline: totals.facilities.baseline + totals.equipment.baseline + totals.fleet.baseline,
      target: totals.facilities.target + totals.equipment.target + totals.fleet.target
    };

    return totals;
  };

  // Overview Dashboard
  const OverviewDashboard = () => {
    const totals = calculateTotals();
    const overallReduction = totals.overall.baseline > 0 
      ? ((totals.overall.baseline - totals.overall.target) / totals.overall.baseline * 100)
      : 0;
    
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
                <p className="text-3xl font-bold text-orange-600">3</p>
                <p className="text-xs text-gray-500 mt-1">with targets set</p>
              </div>
              <Layers className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Category</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(totals).filter(([key]) => key !== 'overall').map(([category, data]) => {
              const reduction = data.baseline > 0 ? ((data.baseline - data.target) / data.baseline * 100) : 0;
              const icons: { [key: string]: any } = {
                facilities: Building,
                equipment: Wrench,
                fleet: Car
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
                  <td className="px-4 py-3 text-green-600">
                    {totals.facilities.baseline > 0 
                      ? ((totals.facilities.baseline - totals.facilities.target) / totals.facilities.baseline * 100).toFixed(1)
                      : '0'}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">On Track</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Equipment</td>
                  <td className="px-4 py-3">{assetData.equipment.length} units</td>
                  <td className="px-4 py-3">{totals.equipment.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3">{totals.equipment.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">
                    {totals.equipment.baseline > 0 
                      ? ((totals.equipment.baseline - totals.equipment.target) / totals.equipment.baseline * 100).toFixed(1)
                      : '0'}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">On Track</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Fleet</td>
                  <td className="px-4 py-3">{assetData.fleet.length} vehicles</td>
                  <td className="px-4 py-3">{totals.fleet.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3">{totals.fleet.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">
                    {totals.fleet.baseline > 0 
                      ? ((totals.fleet.baseline - totals.fleet.target) / totals.fleet.baseline * 100).toFixed(1)
                      : '0'}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">At Risk</span>
                  </td>
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
    const categoryConfig: { [key: string]: any } = {
      facilities: {
        title: 'Facilities',
        icon: Building,
        color: 'blue',
        targetCategory: 'Facilities'
      },
      equipment: {
        title: 'Equipment',
        icon: Wrench,
        color: 'green',
        targetCategory: 'Equipment'
      },
      fleet: {
        title: 'Fleet',
        icon: Car,
        color: 'purple',
        targetCategory: 'Fleet'
      }
    };

    const config = categoryConfig[selectedCategory];
    const data = assetData[selectedCategory as keyof AssetData] as any[];
    const Icon = config.icon;

    // Get target data for this category
    const getTargetData = (assetId: string) => {
      return granularTargets.find(t => 
        // t.targetCategory === config.targetCategory && 
        t.targetCategoryId === assetId // Map using targetCategoryId which contains the asset ID
      );
    };
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
            const targetData = getTargetData(item._id);
            const isEditing = editingItem === item._id;
            console.log(getTargetData(item._id), 'target data...........................')
            
            // Default values if no target data exists
            const baselineEmissions = targetData?.baselineEmissions || 0;
            const currentEmissions = targetData?.currentEmissions || 0;
            const targetEmissions = targetData?.targetEmissions || 0;
            const targetYear = targetData?.targetYear || 2030;
            
            const reduction = baselineEmissions > 0 
              ? ((baselineEmissions - targetEmissions) / baselineEmissions * 100)
              : 0;

            // State for editing - initialize with current target data
            const [editData, setEditData] = useState({
              baselineEmissions: targetData?.baselineEmissions || 0,
              currentEmissions: targetData?.currentEmissions || 0,
              targetEmissions: targetData?.targetEmissions || 0,
              targetYear: targetData?.targetYear || 2030
            });

            // Update editData when targetData changes
            useEffect(() => {
              setEditData({
                baselineEmissions: targetData?.baselineEmissions || 0,
                currentEmissions: targetData?.currentEmissions || 0,
                targetEmissions: targetData?.targetEmissions || 0,
                targetYear: targetData?.targetYear || 2030
              });
            }, [targetData]);

            const handleSave = () => {
              saveGranularTarget({
                targetCategory: config.targetCategory,
                baselineEmissions: editData.baselineEmissions,
                currentEmissions: editData.currentEmissions,
                targetEmissions: editData.targetEmissions,
                targetYear: editData.targetYear,
                targetCategoryId: item._id, // Send the actual asset ID
                assetId: item.id
              });
            };
            
            return (
              <div key={item._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 text-${config.color}-600`} />
                      <h4 className="text-lg font-semibold text-gray-900">
                        {selectedCategory === 'facilities' ? item.facilityName : 
                         selectedCategory === 'equipment' ? item.equipmentName : 
                         `${item.make} ${item.model}`}
                      </h4>
                      {selectedCategory === 'facilities' && (
                        <span className="text-sm text-gray-500">• {item.city}, {item.stateProvince}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {!isEditing ? (
                        <button
                          onClick={() => setEditingItem(item._id)}
                          className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Targets</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleSave}
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
                              <span className="font-medium capitalize">{item.facilityType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Size:</span>
                              <span className="font-medium">{item.floorArea?.toLocaleString()} sq ft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Employees:</span>
                              <span className="font-medium">{item.numberOfEmployees}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Address:</span>
                              <span className="font-medium">{item.fullAddress}</span>
                            </div>
                          </>
                        )}
                        {selectedCategory === 'equipment' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Facility:</span>
                              <span className="font-medium">{item.facilityId?.facilityName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium">{item.equipmentTypeId?.equipmentName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Capacity:</span>
                              <span className="font-medium">{item.capacityValue} {item.capacityUnit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Efficiency:</span>
                              <span className="font-medium">{item.efficiency}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Manufacturer:</span>
                              <span className="font-medium">{item.manufacturer}</span>
                            </div>
                          </>
                        )}
                        {selectedCategory === 'fleet' && (
                          <>
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
                              <span className="font-medium">{item.annualMileage?.value?.toLocaleString()} {item.annualMileage?.unit}</span>
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
                            {isEditing ? (
                              <input
                                type="number"
                                value={editData.baselineEmissions}
                                onChange={(e) => setEditData(prev => ({
                                  ...prev,
                                  baselineEmissions: parseFloat(e.target.value) || 0
                                }))}
                                className="w-24 px-2 py-1 text-right text-sm border border-gray-300 rounded"
                              />
                            ) : (
                              <span className="font-bold text-gray-900">{baselineEmissions.toLocaleString()} tCO₂e</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-blue-700">Current Emissions</span>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editData.currentEmissions}
                                onChange={(e) => setEditData(prev => ({
                                  ...prev,
                                  currentEmissions: parseFloat(e.target.value) || 0
                                }))}
                                className="w-24 px-2 py-1 text-right text-sm border border-blue-300 rounded"
                              />
                            ) : (
                              <span className="font-bold text-blue-900">{currentEmissions.toLocaleString()} tCO₂e</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-green-700">Target Emissions ({targetYear})</span>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editData.targetEmissions}
                                onChange={(e) => setEditData(prev => ({
                                  ...prev,
                                  targetEmissions: parseFloat(e.target.value) || 0
                                }))}
                                className="w-24 px-2 py-1 text-right text-sm border border-green-300 rounded"
                              />
                            ) : (
                              <span className="font-bold text-green-900">{targetEmissions.toLocaleString()} tCO₂e</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-purple-700">Target Year</span>
                            {isEditing ? (
                              <select
                                value={editData.targetYear}
                                onChange={(e) => setEditData(prev => ({
                                  ...prev,
                                  targetYear: parseInt(e.target.value)
                                }))}
                                className="px-2 py-1 text-sm border border-purple-300 rounded"
                              >
                                {[2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="font-bold text-purple-900">{targetYear}</span>
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading asset data...</p>
        </div>
      </div>
    );
  }

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
            { key: 'fleet', label: 'Fleet', icon: Car }
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
                {assetData[category.key as keyof AssetData]?.length || 0}
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