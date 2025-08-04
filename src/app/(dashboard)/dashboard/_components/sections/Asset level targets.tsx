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
import { safeLocalStorage } from '@/utils/localStorage';

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
  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");

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
      <div className="space-y-10">
        {/* Summary Cards - Updated to match dashboard design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Total Current Emissions
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {totals.overall.current.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700 mb-2">tCO₂e/year</div>
                <div className="text-xs text-gray-500">
                  Current year emissions
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Target Emissions
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {totals.overall.target.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700 mb-2">tCO₂e/year by 2030</div>
                <div className="text-xs text-gray-500">
                  Target year emissions
                </div>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Total Reduction
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {overallReduction.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-700 mb-2">from baseline</div>
                <div className="text-xs text-gray-500">
                  Reduction target
                </div>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Asset Categories
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
                <div className="text-sm text-gray-700 mb-2">with targets set</div>
                <div className="text-xs text-gray-500">
                  Active categories
                </div>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown - Updated styling */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(totals).filter(([key]) => key !== 'overall').map(([category, data], index) => {
              const reduction = data.baseline > 0 ? ((data.baseline - data.target) / data.baseline * 100) : 0;
              const icons: { [key: string]: any } = {
                facilities: Building,
                equipment: Wrench,
                fleet: Car
              };
              const colors = ['blue', 'purple', 'orange'];
              const color = colors[index];
              const Icon = icons[category];
              
              return (
                <div key={category} className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className={`text-xs font-semibold text-${color}-800 opacity-70 uppercase tracking-wider mb-1.5`}>
                        {category} Emissions
                      </div>
                      <div className={`text-3xl font-bold text-${color}-800 mb-1.5`}>
                        {data.current.toLocaleString()}
                      </div>
                      <div className={`text-sm text-${color}-800 mb-1.5`}>tCO₂e/year</div>
                      <div className={`text-xs text-${color}-800 opacity-60`}>
                        Current emissions
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Icon className={`w-6 h-6 text-${color}-600`} />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium text-gray-900">{data.target.toLocaleString()} tCO₂e</span>
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

        {/* Asset Summary Table - Updated styling */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
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
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">Facilities</td>
                  <td className="px-4 py-3 text-gray-700">{assetData.facilities.length} locations</td>
                  <td className="px-4 py-3 text-gray-700">{totals.facilities.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-gray-700">{totals.facilities.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">
                    {totals.facilities.baseline > 0 
                      ? ((totals.facilities.baseline - totals.facilities.target) / totals.facilities.baseline * 100).toFixed(1)
                      : '0'}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 border border-green-800 rounded-lg text-xs font-semibold">On Track</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">Equipment</td>
                  <td className="px-4 py-3 text-gray-700">{assetData.equipment.length} units</td>
                  <td className="px-4 py-3 text-gray-700">{totals.equipment.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-gray-700">{totals.equipment.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">
                    {totals.equipment.baseline > 0 
                      ? ((totals.equipment.baseline - totals.equipment.target) / totals.equipment.baseline * 100).toFixed(1)
                      : '0'}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 border border-green-800 rounded-lg text-xs font-semibold">On Track</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">Fleet</td>
                  <td className="px-4 py-3 text-gray-700">{assetData.fleet.length} vehicles</td>
                  <td className="px-4 py-3 text-gray-700">{totals.fleet.current.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-gray-700">{totals.fleet.target.toLocaleString()} tCO₂e</td>
                  <td className="px-4 py-3 text-green-600">
                    {totals.fleet.baseline > 0 
                      ? ((totals.fleet.baseline - totals.fleet.target) / totals.fleet.baseline * 100).toFixed(1)
                      : '0'}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 border border-yellow-800 rounded-lg text-xs font-semibold">At Risk</span>
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
        color: 'purple',
        targetCategory: 'Equipment'
      },
      fleet: {
        title: 'Fleet',
        icon: Car,
        color: 'orange',
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
        {/* Category Header - Updated styling */}
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

        {/* Asset Cards - Updated styling */}
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
              <div key={item._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
                          className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Targets</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleSave}
                            className="flex items-center space-x-2 px-3 py-1 text-green-600 hover:bg-green-50 rounded-md border border-green-200"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="flex items-center space-x-2 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200"
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
                              <span className="font-medium text-gray-900 capitalize">{item.facilityType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Size:</span>
                              <span className="font-medium text-gray-900">{item.floorArea?.toLocaleString()} sq ft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Employees:</span>
                              <span className="font-medium text-gray-900">{item.numberOfEmployees}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Address:</span>
                              <span className="font-medium text-gray-900">{item.fullAddress}</span>
                            </div>
                          </>
                        )}
                        {selectedCategory === 'equipment' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Facility:</span>
                              <span className="font-medium text-gray-900">{item.facilityId?.facilityName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium text-gray-900">{item.equipmentTypeId?.equipmentName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Capacity:</span>
                              <span className="font-medium text-gray-900">{item.capacityValue} {item.capacityUnit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Efficiency:</span>
                              <span className="font-medium text-gray-900">{item.efficiency}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Manufacturer:</span>
                              <span className="font-medium text-gray-900">{item.manufacturer}</span>
                            </div>
                          </>
                        )}
                        {selectedCategory === 'fleet' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium text-gray-900">{item.vehicleType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Fuel:</span>
                              <span className="font-medium text-gray-900 capitalize">{item.fuelType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Annual Mileage:</span>
                              <span className="font-medium text-gray-900">{item.annualMileage?.value?.toLocaleString()} {item.annualMileage?.unit}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Emissions & Targets - Updated styling */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Emissions & Targets</h5>
                      <div className="space-y-3">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
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

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
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

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
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

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
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

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
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
      <div className="space-y-10">
        <div className="border-b border-green-100 pb-6">
          <h1 className="text-3xl font-bold text-black mb-4">
            Asset-Level Target Management
          </h1>
          <p className="text-black opacity-70 max-w-4xl leading-relaxed">
            Set and manage granular carbon reduction targets for individual assets across facilities, equipment, and fleet.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading asset data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header - Updated to match dashboard design */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-black mb-4">
          Asset-Level Target Management
        </h1>
        <p className="text-black opacity-70 max-w-4xl leading-relaxed">
          Set and manage granular carbon reduction targets for individual assets across facilities, equipment, and fleet.
        </p>
      </div>

      {/* Navigation - Updated styling */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'assets' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Asset Details</span>
          </button>
        </div>
      </div>

      {/* Category Selection for Asset Details - Updated styling */}
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

      {/* Content - Updated styling */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {activeTab === 'overview' && <OverviewDashboard />}
          {activeTab === 'assets' && <AssetDetailView />}
        </div>
      </div>
    </div>
  );
};

export default AssetLevelTargetPlatform;