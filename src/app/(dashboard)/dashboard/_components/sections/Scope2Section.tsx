'use client';

import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Table from '@/components/Table';
import { Edit3, Eye, Trash2 } from 'lucide-react';
import { safeLocalStorage } from "@/utils/localStorage";
import { getRequest } from "@/utils/api";
ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


type Scope2Source = {
  label: string;
  value: number;
  color: string;
  percentage: number;
  rawColor: string; 
};


type DurationType = 'This Year' | 'Last Year' | 'Comparison';

type Scope2Data = {
  [key in DurationType]: Scope2Source[];
};

export default function Scope2Section() {
  const [duration, setDuration] = useState<'This Year' | 'Last Year' | 'Comparison'>('This Year');
  const [dashboardData, setDashboardData] = useState({
    scope2Emissions: 0,
    totalEmissions: 0,
    emissionByFacility: 0,
    emissionByEquipment: 0,
    emissionByVehicle: 0,
    recentActivities: [],
  });

  const getTokens = () => {
    const token = safeLocalStorage.getItem("tokens");
    const tokenData = JSON.parse(token || "");
    return tokenData.accessToken;
  };

  const getDashboard = async () => {
    try {
      const response = await getRequest(
        `dashboard/getDashboardData`,
        getTokens()
      );

      if (response.success) {
        setDashboardData(response.dashboardData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  // Update scope2DataByDuration with real data
  const scope2DataByDuration: Scope2Data = {
    'This Year': [
      {
        label: 'Purchased Electricity',
        value: dashboardData.scope2Emissions * 0.8, // Assuming 80% is electricity
        percentage: 73.8,
        color: 'fill-[#6f33e8]',
        rawColor: '#6f33e8',
      },
      {
        label: 'steam',
        value: dashboardData.scope2Emissions * 0.15, // Assuming 15% is steam
        percentage: 17.3,
        color: 'fill-[#00bbff]',
        rawColor: '#00bbff',
      },
      {
        label: 'Heating & Cooling',
        value: dashboardData.scope2Emissions * 0.05, // Assuming 5% is heating/cooling
        percentage: 19.9,
        color: 'fill-[#ff8c09]',
        rawColor: '#ff8c09',
      },
    ],
    'Last Year': [
      {
        label: 'Purchased Electricity',
        value: dashboardData.scope2Emissions * 0.8 * 1.1, // 10% higher than current
        percentage: 60,
        color: 'fill-[#6f33e8]',
        rawColor: '#6f33e8',
      },
      {
        label: 'steam',
        value: dashboardData.scope2Emissions * 0.15 * 1.1,
        percentage: 25,
        color: 'fill-[#00bbff]',
        rawColor: '#00bbff',
      },
      {
        label: 'Heating & Cooling',
        value: dashboardData.scope2Emissions * 0.05 * 1.1,
        percentage: 15,
        color: 'fill-[#ff8c09]',
        rawColor: '#ff8c09',
      },
    ],
    'Comparison': [
      {
        label: 'Purchased Electricity',
        value: dashboardData.scope2Emissions * 0.8,
        percentage: 74.4,
        color: 'fill-[#6f33e8]',
        rawColor: '#6f33e8',
      },
      {
        label: 'steam',
        value: dashboardData.scope2Emissions * 0.15,
        percentage: 18.2,
        color: 'fill-[#00bbff]',
        rawColor: '#00bbff',
      },
      {
        label: 'Heating & Cooling',
        value: dashboardData.scope2Emissions * 0.05,
        percentage: 7.4,
        color: 'fill-[#ff8c09]',
        rawColor: '#ff8c09',
      },
    ],
  };

  const scope2Sources = scope2DataByDuration[duration];

  const energyEfficiencyData = [
    { month: 'Jan', efficiency: 0.145, target: 0.15 },
    { month: 'Feb', efficiency: 0.122, target: 0.15 },
    { month: 'Mar', efficiency: 0.189, target: 0.15 },
    { month: 'Apr', efficiency: 0.086, target: 0.15 },
    { month: 'May', efficiency: 0.103, target: 0.15 },
    { month: 'Jun', efficiency: 0.190, target: 0.15 },
    { month: 'Jul', efficiency: 0.167, target: 0.15 },
    { month: 'Aug', efficiency: 0.164, target: 0.15 },
    { month: 'Sep', efficiency: 0.184, target: 0.15 },
    { month: 'Oct', efficiency: 0.168, target: 0.15 },
    { month: 'Nov', efficiency: 0.165, target: 0.15 },
    { month: 'Dec', efficiency: 0.162, target: 0.15 }
  ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMode, setReviewMode] = useState<'add' | 'edit' | null>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [formData, setFormData] = useState({
    month: '',
    year: '',
    facilityId: '',
    energyType: '',
    gridLocation: '',
    consumedUnits: '',
    amountOfConsumption: '',
    customEmissionFactor: '',
    emissions: ''
  });

  const pieData = {
    labels: [
      scope2Sources.map((item) => item.label)
    ],
    datasets: [
      {
        data: scope2Sources.map((item) => item.value),
        backgroundColor: scope2Sources.map((item) => item.rawColor),
        borderColor: '#ffffff',
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        display: false,
      },
    },
  };

  const lineData = {
    labels: energyEfficiencyData.map(item => item.month),
    datasets: [
      {
        label: 'Efficiency',
        data: energyEfficiencyData.map(item => item.efficiency),
        borderColor: '#0f5744',
        backgroundColor: '#0f5744',
        tension: 0,
        pointRadius: 3,
        pointHoverRadius: 4,
        fill: false,
      },
      {
        label: 'Target (0.15 kWh/unit)',
        data: energyEfficiencyData.map(() => 0.15),
        borderColor: '#0f5744',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'line'>) => {
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.raw;
            return `${label}: ${value} kWh/unit`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMin: 0.14,
        suggestedMax: 0.40,
        title: {
          display: false,
        },
        ticks: {
          stepSize: 0.01
        },
        grid: {
          color: '#e4e4e438'
        }
      },
      x: {
        title: {
          display: false,
        },
        grid: {
          color: '#e4e4e438'
        }
      }
    }
  };

  // State for table data array
  const [purchasedElectricityData, setPurchasedElectricityData] = useState([
    {
      id: 1,
      month: 'January',
      year: '2024',
      facilityId: 'FAC-001',
      energyType: 'Grid Electricity',
      gridLocation: 'Main Campus',
      consumedUnits: 'MWh',
      amountOfConsumption: '2,847',
      customEmissionFactor: '0.199 kg CO₂e/kWh',
      emissions: '567.3'
    },
    {
      id: 2,
      month: 'January',
      year: '2024',
      facilityId: 'FAC-002',
      energyType: 'Solar Power',
      gridLocation: 'Production Plant',
      consumedUnits: 'MWh',
      amountOfConsumption: '1,200',
      customEmissionFactor: '0.0 kg CO₂e/kWh',
      emissions: '0.0'
    },
    {
      id: 3,
      month: 'January',
      year: '2024',
      facilityId: 'FAC-003',
      energyType: 'Wind Power',
      gridLocation: 'Office Building',
      consumedUnits: 'MWh',
      amountOfConsumption: '850',
      customEmissionFactor: '0.0 kg CO₂e/kWh',
      emissions: '0.0'
    }
  ]);

  // Energy type options for dropdown
  const energyTypeOptions = [
    'Grid Electricity',
    'Solar Power',
    'Wind Power',
    'Hydroelectric',
    'Biomass',
    'Geothermal',
    'Nuclear'
  ];

  // Unit options for dropdown
  const unitOptions = [
    'MWh',
    'kWh',
    'GJ',
    'MJ',
    'BTU'
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Purchased Electricity Data:', formData);
    
    // Show review modal instead of directly adding
    setReviewData(formData);
    setReviewMode('add');
    setShowReviewModal(true);
    setIsAddModalOpen(false);
  };

  const handleEdit = (rowData: any, index: number) => {
    setEditingData(rowData);
    setEditingIndex(index);
    setFormData({
      month: rowData.month,
      year: rowData.year,
      facilityId: rowData.facilityId,
      energyType: rowData.energyType,
      gridLocation: rowData.gridLocation,
      consumedUnits: rowData.consumedUnits,
      amountOfConsumption: rowData.amountOfConsumption,
      customEmissionFactor: rowData.customEmissionFactor,
      emissions: rowData.emissions
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Purchased Electricity Data:', formData);
    console.log('Original Data:', editingData);
    
    // Show review modal instead of directly updating
    setReviewData(formData);
    setReviewMode('edit');
    setShowReviewModal(true);
    setIsEditModalOpen(false);
  };

  // Review modal handlers
  const handleReviewConfirm = () => {
    if (reviewMode === 'add') {
      const newRow = {
        id: Math.max(...purchasedElectricityData.map(row => row.id)) + 1,
        ...reviewData
      };
      setPurchasedElectricityData([...purchasedElectricityData, newRow]);
      console.log('Confirmed: Added new purchased electricity row');
    } else if (reviewMode === 'edit' && editingIndex !== null) {
      const updatedData = [...purchasedElectricityData];
      updatedData[editingIndex] = {
        ...updatedData[editingIndex],
        ...reviewData
      };
      setPurchasedElectricityData(updatedData);
      console.log('Confirmed: Updated purchased electricity row');
    }
    
    // Reset review modal
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);
    
    // Reset editing states
    setEditingData(null);
    setEditingIndex(null);
    
    // Reset form
    setFormData({
      month: '',
      year: '',
      facilityId: '',
      energyType: '',
      gridLocation: '',
      consumedUnits: '',
      amountOfConsumption: '',
      customEmissionFactor: '',
      emissions: ''
    });
  };

  const handleReviewCancel = () => {
    setShowReviewModal(false);
    setReviewMode(null);
    setReviewData(null);
    
    // Reset editing states
    setEditingData(null);
    setEditingIndex(null);
    
    // Reset form
    setFormData({
      month: '',
      year: '',
      facilityId: '',
      energyType: '',
      gridLocation: '',
      consumedUnits: '',
      amountOfConsumption: '',
      customEmissionFactor: '',
      emissions: ''
    });
  };

  const handleReviewEdit = () => {
    setShowReviewModal(false);
    
    // Reopen the appropriate modal for editing
    setFormData(reviewData);
    if (reviewMode === 'add') {
      setIsAddModalOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
    
    setReviewMode(null);
    setReviewData(null);
  };

  // Table configuration for Scope 2
  const tableColumns = [
    {
      key: "date",
      label: "Date",
      type: "text" as const,
    },
    {
      key: "activity",
      label: "Activity",
      type: "text" as const,
    },
    {
      key: "scope",
      label: "Scope",
      type: "text" as const,
    },
    {
      key: "impact",
      label: "Impact",
      type: "text" as const,
    },
    {
      key: "status",
      label: "Status",
      type: "status" as const,
      render: (value: string, row: any) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-lg  ${
            row.statusType === "success"
              ? "bg-green-100 text-green-800 "
              : "bg-red-100 text-red-800 "
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const tableActions = [
    {
      label: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: (row: any) => {
        console.log('View purchased electricity:', row);
        // Add view functionality here
      },
      variant: 'primary' as const
    },
    {
      label: 'Edit',
      icon: <Edit3 className="w-4 h-4" />,
      onClick: (row: any) => {
        console.log('Edit purchased electricity:', row);
        handleEdit(row, purchasedElectricityData.findIndex(item => item.id === row.id));
      },
      variant: 'secondary' as const
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: any) => {
        console.log('Delete purchased electricity:', row);
        // Add delete functionality here
      },
      variant: 'danger' as const
    }
  ];

  const handleAddPurchasedElectricity = () => {
    setIsAddModalOpen(true);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Add search functionality here
  };

  const handleFilter = () => {
    console.log('Filter purchased electricity');
    // Add filter functionality here
  };

  // Transform recent activities data for Scope 2 display
  const transformScope2ActivitiesData = () => {
    if (!dashboardData.recentActivities) return [];

    return dashboardData.recentActivities
      .filter((activity: any) => activity.scope === 'scope2')
      .map((activity: any, index: number) => ({
        _id: activity._id || `activity-${index}`,
        date: new Date(activity.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        activity: `${activity.scopeType} ${activity.scope} emissions`,
        scope: activity.scope || "Scope 2",
        impact:
          activity.totalEmissions > 1000
            ? "High"
            : activity.totalEmissions > 100
            ? "Medium"
            : "Low",
        status: "Completed",
        statusType: "success",
        originalData: activity,
      }));
  };

  // Dynamic data arrays for Scope 2 charts
  const scope2BreakdownData = [
    {
      id: 'purchased-electricity',
      name: 'Purchased Electricity',
      value: dashboardData.scope2Emissions * 0.8,
      percentage: dashboardData.totalEmissions > 0 ? ((dashboardData.scope2Emissions * 0.8) / dashboardData.totalEmissions) * 100 : 0,
      color: '#0f5744',
      opacity: 1,
      description: 'Grid electricity consumption'
    },
    {
      id: 'steam',
      name: 'Steam',
      value: dashboardData.scope2Emissions * 0.15,
      percentage: dashboardData.totalEmissions > 0 ? ((dashboardData.scope2Emissions * 0.15) / dashboardData.totalEmissions) * 100 : 0,
      color: '#0f5744',
      opacity: 0.8,
      description: 'Industrial steam consumption'
    },
    {
      id: 'heating-cooling',
      name: 'Heating & Cooling',
      value: dashboardData.scope2Emissions * 0.05,
      percentage: dashboardData.totalEmissions > 0 ? ((dashboardData.scope2Emissions * 0.05) / dashboardData.totalEmissions) * 100 : 0,
      color: '#0f5744',
      opacity: 0.6,
      description: 'HVAC and thermal systems'
    }
  ];

  const renewableEnergyData = [
    { source: 'Solar Power', percentage: 45.2, icon: '☀️' },
    { source: 'Wind Power', percentage: 28.7, icon: '💨' },
    { source: 'Hydroelectric', percentage: 15.8, icon: '🌊' },
    { source: 'Biomass', percentage: 10.3, icon: '🔥' }
  ];

  // const energySourcesData = [
  //   {
  //     id: 'E-001',
  //     type: 'Electricity Meter',
  //     location: 'Main Campus',
  //     source: 'Grid + Solar',
  //     consumption: '2,847 MWh',
  //     emissions: 567.3,
  //     status: 'Monitored'
  //   },
  //   {
  //     id: 'S-023',
  //     type: 'Steam Line',
  //     location: 'Production Plant',
  //     source: 'Natural Gas',
  //     consumption: '45.7 GJ',
  //     emissions: 234.1,
  //     status: 'Monitored'
  //   },
  //   {
  //     id: 'H-005',
  //     type: 'HVAC System',
  //     location: 'Office Building',
  //     source: 'District Heating',
  //     consumption: '23.4 GJ',
  //     emissions: 89.3,
  //     status: 'Monitored'
  //   },
  //   {
  //     id: 'R-012',
  //     type: 'Renewable Certificates',
  //     location: 'Virtual',
  //     source: 'Solar/Wind',
  //     consumption: '1,200 MWh',
  //     emissions: 0,
  //     status: 'Verified'
  //   }
  // ];

  const metricsData = [
    {
      id: 'total-scope2',
      title: 'Total Scope 2',
      value: dashboardData.scope2Emissions.toFixed(1),
      // change: '▼ 15.8%',
      // changeType: 'decrease',
      subtitle: `tonnes CO₂e • ${dashboardData.totalEmissions > 0 ? ((dashboardData.scope2Emissions / dashboardData.totalEmissions) * 100).toFixed(1) : 0}% of total emissions`,
      icon: '⚡',
      progress: dashboardData.totalEmissions > 0 ? ((dashboardData.scope2Emissions / dashboardData.totalEmissions) * 100) : 0
    },
    {
      id: 'purchased-electricity',
      title: 'Purchased Electricity',
      value: (dashboardData.scope2Emissions * 0.8).toFixed(1),
      // change: '▼ 12.3%',
      // changeType: 'decrease',
      subtitle: 'Largest source',
      icon: '🔌',
      // progress: 74.4
    },
    {
      id: 'renewable-energy',
      title: 'Renewable Energy',
      value: '0%',
      change: '▲ 0%',
      changeType: 'increase',
      subtitle: 'Clean energy usage • Target: 100%',
      icon: '🌞',
      progress: 0
    },
    {
      id: 'energy-intensity',
      title: 'Energy Intensity',
      value: '0',
      change: '▼ 0%',
      changeType: 'decrease',
      subtitle: 'kWh per unit • Efficiency metric',
      icon: '📊',
      progress: 0
    }
  ];



  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-black mb-4">
          Scope 2 Emissions Analysis
        </h1>
        <p className="text-black opacity-70 max-w-4xl leading-relaxed">
          Indirect greenhouse gas emissions from the generation of purchased electricity, steam, heating, and cooling 
          consumed by the organization, including detailed analysis of energy sources and efficiency metrics.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <div key={metric.id} className="bg-white border border-green-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                  {metric.title}
                </div>
                <div className="text-3xl font-bold text-black mb-2">{metric.value}</div>
                <div className={`text-sm text-green-800 mb-2 ${metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} 
                </div>
                <div className="text-xs text-black opacity-60">
                  {metric.subtitle}
                </div>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                {metric.icon}
              </div>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: `${metric.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="w-full xl:flex flex-wrap justify-between gap-4">
        <div className="xl:w-[55%] bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📊 Scope 2 Breakdown by Source
            </h3>
            <div className="flex gap-1 border border-gray-200 rounded overflow-hidden">
              {(['This Year', 'Last Year', 'Comparison'] as DurationType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setDuration(type)}
                  className={`px-4 py-2 text-xs font-medium ${
                    duration === type
                      ? 'bg-teal-700 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 py-2 w-full justify-center items-center">
            <Pie data={pieData} options={pieOptions}/>
          </div>

          <div className="flex gap-5 mt-4 flex-wrap ">
            {scope2Sources.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-sm`}
                  style={{ backgroundColor: item.rawColor }}
                ></div>
                <span className="text-sm text-green-800">
                  {item.label} ({item.value.toLocaleString()} tCO₂e)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:w-[40%] bg-white border border-green-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📈 Energy Efficiency Trend
            </h3>
          </div>
          <div className='flex flex-col items-center justify-center h-[80%] w-full'>
            <div className="h-70 relative w-full">
              <Line data={lineData} options={lineOptions} />
            </div>
            <div className="text-center text-xs text-green-800 opacity-70 mt-4">
              Improving efficiency trend • Target: 0.15 kWh per unit by 2025
            </div>
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scope2BreakdownData.map((source) => (
          <div key={source.id} className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                {source.id === 'purchased-electricity' ? '🔌' : source.id === 'steam' ? '💨' : '❄️'}
              </div>
              <div>
                <h4 className="font-semibold text-black">{source.name}</h4>
                <div className="text-xs text-black opacity-60">{source.description}</div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="text-2xl font-bold text-black">{source.value}</div>
              <div className="text-sm text-green-800 opacity-60">{source.percentage}%</div>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-green-800 transition-all duration-1000" 
                style={{ width: `${source.percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-black opacity-70">
              {source.id === 'purchased-electricity' ? '12 meters • Grid mix, renewable certificates' :
                source.id === 'steam' ? '8 steam lines • Natural gas, biomass' :
                '15 HVAC systems • District heating'}
            </div>
          </div>
        ))}
      </div>

      {/* Renewable Energy Section */}
      {/* <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-black flex items-center gap-2">
            🌞 Renewable Energy Portfolio
          </h3>
          <div className="text-sm text-green-800 opacity-70">89.7% renewable energy usage</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {renewableEnergyData.map((energy, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                {energy.icon}
              </div>
              <div className="text-2xl font-bold text-green-800 mb-1">{energy.percentage}%</div>
              <div className="text-sm text-black opacity-70">{energy.source}</div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Recent Scope 2 Activities Table */}
      <Table
        title="Recent Scope 2 Activities"
        columns={tableColumns}
        data={transformScope2ActivitiesData()}
        // actions={tableActions}
        showSearch={false}
        showFilter={false}
        showAddButton={false}
        // addButtonLabel="Add Purchased Electricity"
        onAddClick={handleAddPurchasedElectricity}
        onSearch={handleSearch}
        onFilter={handleFilter}
        emptyMessage="No recent Scope 2 activities found"
        rowKey="_id"
      />

      {/* Add Purchased Electricity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">Add Purchased Electricity</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Month</label>
                  <select 
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
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
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2024"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Facility ID</label>
                  <input 
                    type="text"
                    value={formData.facilityId}
                    onChange={(e) => setFormData({...formData, facilityId: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="FAC-001"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Energy Type</label>
                  <select 
                    value={formData.energyType}
                    onChange={(e) => setFormData({...formData, energyType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Energy Type</option>
                    {energyTypeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Grid Location</label>
                  <input 
                    type="text"
                    value={formData.gridLocation}
                    onChange={(e) => setFormData({...formData, gridLocation: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Main Campus"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Consumed Units</label>
                  <select 
                    value={formData.consumedUnits}
                    onChange={(e) => setFormData({...formData, consumedUnits: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Units</option>
                    {unitOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Amount of Consumption</label>
                  <input 
                    type="text"
                    value={formData.amountOfConsumption}
                    onChange={(e) => setFormData({...formData, amountOfConsumption: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2,847"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Custom Emission Factor</label>
                  <input 
                    type="text"
                    value={formData.customEmissionFactor}
                    onChange={(e) => setFormData({...formData, customEmissionFactor: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.199 kg CO₂e/kWh"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Emissions</label>
                  <input 
                    type="text"
                    value={formData.emissions}
                    onChange={(e) => setFormData({...formData, emissions: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="567.3"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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

      {/* Edit Purchased Electricity Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">Edit Purchased Electricity</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Month</label>
                  <select 
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
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
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2024"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Facility ID</label>
                  <input 
                    type="text"
                    value={formData.facilityId}
                    onChange={(e) => setFormData({...formData, facilityId: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="FAC-001"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Energy Type</label>
                  <select 
                    value={formData.energyType}
                    onChange={(e) => setFormData({...formData, energyType: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Energy Type</option>
                    {energyTypeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Grid Location</label>
                  <input 
                    type="text"
                    value={formData.gridLocation}
                    onChange={(e) => setFormData({...formData, gridLocation: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Main Campus"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Consumed Units</label>
                  <select 
                    value={formData.consumedUnits}
                    onChange={(e) => setFormData({...formData, consumedUnits: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Units</option>
                    {unitOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Amount of Consumption</label>
                  <input 
                    type="text"
                    value={formData.amountOfConsumption}
                    onChange={(e) => setFormData({...formData, amountOfConsumption: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2,847"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Custom Emission Factor</label>
                  <input 
                    type="text"
                    value={formData.customEmissionFactor}
                    onChange={(e) => setFormData({...formData, customEmissionFactor: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.199 kg CO₂e/kWh"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Emissions</label>
                  <input 
                    type="text"
                    value={formData.emissions}
                    onChange={(e) => setFormData({...formData, emissions: e.target.value})}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="567.3"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
                      {reviewMode === 'add' ? 'Review New Entry' : 'Review Changes'}
                    </h2>
                    <p className="text-green-100 text-sm">
                      {reviewMode === 'add' ? 'New Purchased Electricity Entry' : 'Edit Purchased Electricity Entry'}
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
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">Facility ID</span>
                        <span className="text-gray-900 font-semibold">{reviewData.facilityId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Energy Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Energy Type</span>
                        <span className="text-gray-900 font-semibold">{reviewData.energyType}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">Grid Location</span>
                        <span className="text-gray-900 font-semibold">{reviewData.gridLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Consumption Data</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Consumed Units</span>
                        <span className="text-gray-900 font-semibold">{reviewData.consumedUnits}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">Amount of Consumption</span>
                        <span className="text-gray-900 font-semibold">{reviewData.amountOfConsumption}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Emission Data</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Custom Emission Factor</span>
                        <span className="text-gray-900 font-semibold">{reviewData.customEmissionFactor || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-t border-gray-200 pt-3">
                        <span className="text-gray-600 font-medium">Emissions</span>
                        <span className="text-green-600 font-bold text-lg">{reviewData.emissions}</span>
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
                  {reviewMode === 'add' ? 'Confirm Add' : 'Confirm Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 