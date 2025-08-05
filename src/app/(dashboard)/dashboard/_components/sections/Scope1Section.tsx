'use client';

import { useState } from "react";
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

import Table from "../../../../../components/Table";
import { Edit3, Trash2, Eye } from 'lucide-react';


type Source = {
  icon: string;
  title: string;
  subtitle: string;
  value: number;
  percentage: number;
  description: string;
};

type Scope1Source = {
  label: string;
  value: number;
  color: string; 
   
  percentage: number;
  rawColor: string; 
  
};

type DurationType = 'This Year' | 'Last Year' | 'Comparison';

type Scope1Data = {
  [key in DurationType]: Scope1Source[];
};

// Sample data for Scope 1 emission sources
const scope1EmissionData = [
  {
    id: 1,
    source: 'Boiler #1',
    facility: 'Main Plant',
    fuelType: 'Natural Gas',
    consumption: 1250.5,
    emissions: 2340.8,
    efficiency: 85.2,
    status: 'active',
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    source: 'Furnace #3',
    facility: 'Production Unit A',
    fuelType: 'Heating Oil',
    consumption: 890.3,
    emissions: 1675.2,
    efficiency: 78.9,
    status: 'active',
    lastUpdated: '2024-01-12'
  },
  {
    id: 3,
    source: 'Generator #2',
    facility: 'Backup Power',
    fuelType: 'Diesel',
    consumption: 456.7,
    emissions: 1234.5,
    efficiency: 82.1,
    status: 'maintenance',
    lastUpdated: '2024-01-10'
  },
  {
    id: 4,
    source: 'Fleet Vehicle #15',
    facility: 'Transportation',
    fuelType: 'Gasoline',
    consumption: 234.1,
    emissions: 567.8,
    efficiency: 75.4,
    status: 'active',
    lastUpdated: '2024-01-08'
  },
  {
    id: 5,
    source: 'Forklift #7',
    facility: 'Warehouse',
    fuelType: 'LPG',
    consumption: 89.2,
    emissions: 198.3,
    efficiency: 88.7,
    status: 'active',
    lastUpdated: '2024-01-05'
  }
];

const scope1DataByDuration: Scope1Data = {
  'This Year': [
    {
      label: 'Stationary Combustion',
      value: 1746.2,
      percentage: 43.8,
      color: 'fill-[#6f33e8]',
      rawColor: '#6f33e8',
    },
    {
      label: 'Mobile Combustion',
      value: 985.4,
      percentage: 30.3,
      color: 'fill-[#00bbff]',
      rawColor: '#00bbff',
    },
    {
      label: 'Process Emissions',
      value: 516.2,
      percentage: 15.9,
      color: 'fill-[#ff8c09]',
      rawColor: '#ff8c09',
    },
    {
      label: 'Emissions',
      value: 416.2,
      percentage: 10.9,
      color: 'fill-[#ffd900]',
      rawColor: '#ffd900',
    },
  ],
  'Last Year': [
    {
      label: 'Stationary Combustion',
      value: 1900,
      percentage: 50,
      color: 'fill-[#6f33e8]',
      rawColor: '#6f33e8',
    },
    {
      label: 'Mobile Combustion',
      value: 800,
      percentage: 25,
      color: 'fill-[#00bbff]',
      rawColor: '#00bbff',
    },
    {
      label: 'Process Emissions',
      value: 470,
      percentage: 15,
      color: 'fill-[#ff8c09]',
      rawColor: '#ff8c09',
    },
    {
      label: 'Emissions',
      value: 870,
      percentage: 10,
      color: 'fill-[#ffd900]',
      rawColor: '#ffd900',
    },
  ],
  'Comparison': [
    {
      label: 'Stationary Combustion',
      value: 1800,
      percentage: 40,
      color: 'fill-[#6f33e8]',
      rawColor: '#6f33e8',
    },
    {
      label: 'Mobile Combustion',
      value: 1100,
      percentage: 25,
      color: 'fill-[#00bbff]',
      rawColor: '#00bbff',
    },
    {
      label: 'Process Emissions',
      value: 700,
      percentage: 15,
      color: 'fill-[#ff8c09]',
      rawColor: '#ff8c09',
    },
    {
      label: ' Emissions',
      value: 600,
      percentage: 10,
      color: 'fill-[#ffd900]',
      rawColor: '#ffd900',
    },
  ],
};

const sourceData: Source[] = [
  {
    icon: '🔥',
    title: 'Stationary Combustion',
    subtitle: 'Boilers, furnaces, generators',
    value: 1746.2,
    percentage: 53.8,
    description: '23 sources • Natural gas, heating oil',
  },
  {
    icon: '🚗',
    title: 'Mobile Combustion',
    subtitle: 'Fleet vehicles, equipment',
    value: 985.4,
    percentage: 30.3,
    description: '45 vehicles • Diesel, gasoline, hybrid',
  },
  // {
  //   icon: '🏭',
  //   title: 'Process Emissions',
  //   subtitle: 'Industrial manufacturing',
  //   value: 516.2,
  //   percentage: 15.9,
  //   description: 'Chemical processes • Manufacturing',
  // },
  // {
  //   icon: '🏭',
  //   title: 'Process Emissions',
  //   subtitle: 'Industrial manufacturing',
  //   value: 516.2,
  //   percentage: 15.9,
  //   description: 'Chemical processes • Manufacturing',
  // },
];

export default function Scope1Section() {
  const [duration, setDuration] = useState<'This Year' | 'Last Year' | 'Comparison'>('This Year');
  const scope1Sources = scope1DataByDuration[duration];

  const pieData = {
    labels: [
      scope1Sources.map((item) => item.label)
    ],
    datasets: [
      {
        data: scope1Sources.map((item) => item.value),
        backgroundColor: scope1Sources.map((item) => item.rawColor),
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
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Scope 1 Emissions',
        data: [20, 45, 60, 78, 85, 100, 75, 85, 120],
        borderColor: '#0f5744',
        backgroundColor: '#0f5744',
        pointBorderColor: '#0f5744',
        pointBackgroundColor: '#0f5744',
        tension: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#000000',
        },
        grid: {
          color: '#c1c1c127',
        },
      },
      y: {
        beginAtZero: true,
        max: 200,
        ticks: {
          color: '#000000',
        },
        grid: {
          color: '#c1c1c127',
        },
      },
    },
  };

  // Table configuration
  const tableColumns = [
    { key: 'source', label: 'Source', type: 'text' as const },
    { key: 'facility', label: 'Facility', type: 'text' as const },
    { key: 'fuelType', label: 'Fuel Type', type: 'text' as const },
    { 
      key: 'consumption', 
      label: 'Consumption (GJ)', 
      type: 'number' as const,
      align: 'right' as const 
    },
    { 
      key: 'emissions', 
      label: 'Emissions (tCO₂e)', 
      type: 'number' as const,
      align: 'right' as const 
    },
    { 
      key: 'efficiency', 
      label: 'Efficiency (%)', 
      type: 'number' as const,
      align: 'right' as const 
    },
    { key: 'status', label: 'Status', type: 'status' as const },
    { key: 'lastUpdated', label: 'Last Updated', type: 'date' as const }
  ];


  const handleAddSource = () => {
    console.log('Add new source');
    // Add new source functionality here
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Add search functionality here
  };

  const handleFilter = () => {
    console.log('Filter sources');
    // Add filter functionality here
  };


  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-black mb-4">
          Scope 1 Emissions Analysis
        </h1>
        <p className="text-black opacity-70 max-w-4xl leading-relaxed">
          Direct greenhouse gas emissions from sources owned or controlled by your organization, 
          including detailed analysis of stationary combustion, mobile combustion, process emissions, and fugitive emissions.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Total Scope 1
              </div>
              <div className="text-3xl font-bold text-black mb-2">3,247.8</div>
              <div className="text-sm text-green-800 mb-2">▼ 12.4% vs baseline</div>
              <div className="text-xs text-black opacity-60">
                tonnes CO₂e • 36.3% of total emissions
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🏭
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '83.8%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Stationary Combustion
              </div>
              <div className="text-3xl font-bold text-black mb-2">1,746.2</div>
              <div className="text-sm text-green-800 mb-2">▼ 8.5% vs last year</div>
              <div className="text-xs text-black opacity-60">
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
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Mobile Combustion
              </div>
              <div className="text-3xl font-bold text-black mb-2">985.4</div>
              <div className="text-sm text-green-800 mb-2">▼ 15.2% vs last year</div>
              <div className="text-xs text-black opacity-60">
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

        {/* <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                Process Emissions
              </div>
              <div className="text-3xl font-bold text-black mb-2">516.2</div>
              <div className="text-sm text-green-800 mb-2">▼ 5.8% vs last year</div>
              <div className="text-xs text-black opacity-60">
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
        </div> */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4 w-full">
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
              📊 Scope 1 Breakdown by Source
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
            {scope1Sources.map((item, i) => (
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

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📈 Monthly Trends
            </h3>
          </div>
          <div className="flex flex-col justify-center h-[80%]">
            <div className="h-45">
              <Line data={lineData} options={lineOptions} />
            </div>
            <div className="text-center text-xs text-green-800 opacity-70 mt-4">
              Continuous reduction trend • Target: -15% by Dec 2025
            </div>
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sourceData.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold text-black">{item.title}</h4>
                <div className="text-xs text-black opacity-60">{item.subtitle}</div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="text-2xl font-bold text-black">{item.value.toLocaleString()}</div>
              <div className="text-sm text-green-800 opacity-60">{item.percentage.toFixed(1)}%</div>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-green-800 transition-all duration-1000"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-black opacity-70">{item.description}</div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <Table
        title="Scope 1 Emission Sources Detail"
        columns={tableColumns}
        data={scope1EmissionData}
        // actions={tableActions}
        // showSearch={true}
        // showFilter={true}
        showAddButton={false}
        // addButtonLabel="Add Source"
        onAddClick={handleAddSource}
        onSearch={handleSearch}
        onFilter={handleFilter}
        emptyMessage="No emission sources found"
        rowKey="id"
      />
    </div>
  );
}