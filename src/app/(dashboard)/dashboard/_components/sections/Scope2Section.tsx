'use client';

import { useState } from 'react';

export default function Scope2Section() {
  const [activeChart, setActiveChart] = useState('this-year');

  // Dynamic data arrays for Scope 2 charts
  const scope2BreakdownData = [
    {
      id: 'purchased-electricity',
      name: 'Purchased Electricity',
      value: 2124.7,
      percentage: 74.4,
      color: '#0f5744',
      opacity: 1,
      description: 'Grid electricity consumption'
    },
    {
      id: 'steam',
      name: 'Steam',
      value: 519.9,
      percentage: 18.2,
      color: '#0f5744',
      opacity: 0.8,
      description: 'Industrial steam consumption'
    },
    {
      id: 'heating-cooling',
      name: 'Heating & Cooling',
      value: 211.8,
      percentage: 7.4,
      color: '#0f5744',
      opacity: 0.6,
      description: 'HVAC and thermal systems'
    }
  ];

  const energyEfficiencyData = [
    { month: 'Jan', efficiency: 0.195, target: 0.15 },
    { month: 'Feb', efficiency: 0.192, target: 0.15 },
    { month: 'Mar', efficiency: 0.189, target: 0.15 },
    { month: 'Apr', efficiency: 0.186, target: 0.15 },
    { month: 'May', efficiency: 0.183, target: 0.15 },
    { month: 'Jun', efficiency: 0.180, target: 0.15 },
    { month: 'Jul', efficiency: 0.177, target: 0.15 },
    { month: 'Aug', efficiency: 0.174, target: 0.15 },
    { month: 'Sep', efficiency: 0.171, target: 0.15 },
    { month: 'Oct', efficiency: 0.168, target: 0.15 },
    { month: 'Nov', efficiency: 0.165, target: 0.15 },
    { month: 'Dec', efficiency: 0.162, target: 0.15 }
  ];

  const renewableEnergyData = [
    { source: 'Solar Power', percentage: 45.2, icon: '☀️' },
    { source: 'Wind Power', percentage: 28.7, icon: '💨' },
    { source: 'Hydroelectric', percentage: 15.8, icon: '🌊' },
    { source: 'Biomass', percentage: 10.3, icon: '🔥' }
  ];

  const energySourcesData = [
    {
      id: 'E-001',
      type: 'Electricity Meter',
      location: 'Main Campus',
      source: 'Grid + Solar',
      consumption: '2,847 MWh',
      emissions: 567.3,
      status: 'Monitored'
    },
    {
      id: 'S-023',
      type: 'Steam Line',
      location: 'Production Plant',
      source: 'Natural Gas',
      consumption: '45.7 GJ',
      emissions: 234.1,
      status: 'Monitored'
    },
    {
      id: 'H-005',
      type: 'HVAC System',
      location: 'Office Building',
      source: 'District Heating',
      consumption: '23.4 GJ',
      emissions: 89.3,
      status: 'Monitored'
    },
    {
      id: 'R-012',
      type: 'Renewable Certificates',
      location: 'Virtual',
      source: 'Solar/Wind',
      consumption: '1,200 MWh',
      emissions: 0,
      status: 'Verified'
    }
  ];

  const metricsData = [
    {
      id: 'total-scope2',
      title: 'Total Scope 2',
      value: '2,856.4',
      change: '▼ 15.8%',
      changeType: 'decrease',
      subtitle: 'tonnes CO₂e • 31.9% of total emissions',
      icon: '⚡',
      trend: [285, 282, 280, 278, 275, 272, 270, 268, 265, 262, 260, 258]
    },
    {
      id: 'purchased-electricity',
      title: 'Purchased Electricity',
      value: '2,124.7',
      change: '▼ 12.3%',
      changeType: 'decrease',
      subtitle: 'Largest source • 74.4% of Scope 2',
      icon: '🔌',
      progress: 74.4
    },
    {
      id: 'renewable-energy',
      title: 'Renewable Energy',
      value: '89.7%',
      change: '▲ 15.2%',
      changeType: 'increase',
      subtitle: 'Clean energy usage • Target: 100%',
      icon: '🌞',
      progress: 89.7
    },
    {
      id: 'energy-intensity',
      title: 'Energy Intensity',
      value: '0.187',
      change: '▼ 8.9%',
      changeType: 'decrease',
      subtitle: 'kWh per unit • Efficiency metric',
      icon: '📊',
      trend: [0.195, 0.192, 0.189, 0.186, 0.183, 0.180, 0.177, 0.174, 0.171, 0.168, 0.165, 0.162]
    }
  ];

  // Helper function to generate SVG points from data
  const generateChartPoints = (data: any[], key: string, maxValue: number, height: number, width: number) => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (item[key] / maxValue) * height;
      return `${x},${y}`;
    }).join(' ');
    return points;
  };

  // Calculate pie chart segments
  const calculatePieSegments = (data: any[]) => {
    const total = data.reduce((sum, item) => sum + item.percentage, 0);
    let currentAngle = 0;
    
    return data.map((item) => {
      const angle = (item.percentage / total) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      
      const x1 = 60 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1 = 60 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2 = 60 + 50 * Math.cos((currentAngle - 90) * Math.PI / 180);
      const y2 = 60 + 50 * Math.sin((currentAngle - 90) * Math.PI / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      return {
        ...item,
        path: `M 60,60 L ${x1},${y1} A 50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`,
        labelX: 60 + 35 * Math.cos(((startAngle + currentAngle) / 2 - 90) * Math.PI / 180),
        labelY: 60 + 35 * Math.sin(((startAngle + currentAngle) / 2 - 90) * Math.PI / 180)
      };
    });
  };

  const pieSegments = calculatePieSegments(scope2BreakdownData);
  const maxEfficiency = Math.max(...energyEfficiencyData.map(d => d.efficiency));
  const chartWidth = 300;
  const chartHeight = 150;

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Scope 2 Emissions Analysis
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Indirect greenhouse gas emissions from the generation of purchased electricity, steam, heating, and cooling 
          consumed by the organization, including detailed analysis of energy sources and efficiency metrics.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <div key={metric.id} className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                  {metric.title}
                </div>
                <div className="text-3xl font-bold text-green-800 mb-2">{metric.value}</div>
                <div className={`text-sm text-green-800 mb-2 ${metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} vs baseline
                </div>
                <div className="text-xs text-green-800 opacity-60">
                  {metric.subtitle}
                </div>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                {metric.icon}
              </div>
            </div>
            {metric.trend ? (
              <div className="h-10 relative">
                <svg width="100%" height="40" viewBox="0 0 200 40" className="absolute inset-0">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-green-800"
                    points={generateChartPoints(metric.trend.map((v, i) => ({ value: v })), 'value', Math.max(...metric.trend), 30, 180)}
                  />
                </svg>
              </div>
            ) : (
              <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: `${metric.progress}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📊 Scope 2 Breakdown by Source
            </h3>
            <div className="flex gap-2">
              <button 
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'this-year' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
                onClick={() => setActiveChart('this-year')}
              >
                This Year
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'last-year' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
                onClick={() => setActiveChart('last-year')}
              >
                Last Year
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'comparison' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
                onClick={() => setActiveChart('comparison')}
              >
                Comparison
              </button>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <svg viewBox="0 0 300 200" className="w-full h-full">
              <g transform="translate(150,100)">
                {pieSegments.map((segment, index) => (
                  <g key={segment.id}>
                    <path
                      d={segment.path}
                      fill={segment.color}
                      opacity={segment.opacity}
                    />
                    <text
                      x={segment.labelX}
                      y={segment.labelY}
                      textAnchor="middle"
                      fontSize="10"
                      fill="white"
                      dominantBaseline="middle"
                    >
                      {segment.percentage}%
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
          <div className="flex gap-5 mt-4 flex-wrap">
            {scope2BreakdownData.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color, opacity: item.opacity }}
                ></div>
                <span className="text-sm text-green-800">{item.name} ({item.value} tCO₂e)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📈 Energy Efficiency Trend
            </h3>
          </div>
          <div className="h-80 relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
              <defs>
                <pattern id="efficiencyGrid" width="30" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 15" fill="none" stroke="#e4f5d5" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#efficiencyGrid)" />

              {/* Efficiency line */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="3"
                points={generateChartPoints(energyEfficiencyData, 'efficiency', maxEfficiency, chartHeight, chartWidth)}
              />

              {/* Target line */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.5"
                points={`0,${chartHeight - (0.15 / maxEfficiency) * chartHeight} ${chartWidth},${chartHeight - (0.15 / maxEfficiency) * chartHeight}`}
              />

              {/* Data points */}
              {energyEfficiencyData.map((item, index) => {
                const x = (index / (energyEfficiencyData.length - 1)) * chartWidth;
                const y = chartHeight - (item.efficiency / maxEfficiency) * chartHeight;
                return (
                  <circle key={index} cx={x} cy={y} r="3" fill="#0f5744" />
                );
              })}

              {/* Labels */}
              {energyEfficiencyData.map((item, index) => {
                const x = (index / (energyEfficiencyData.length - 1)) * chartWidth;
                return (
                  <text key={index} x={x} y={chartHeight + 15} fontSize="8" fill="#0f5744" textAnchor="middle">
                    {item.month}
                  </text>
                );
              })}
            </svg>
          </div>
          <div className="text-center text-xs text-green-800 opacity-70 mt-4">
            Improving efficiency trend • Target: 0.15 kWh per unit by 2025
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
                <h4 className="font-semibold text-green-800">{source.name}</h4>
                <div className="text-xs text-green-800 opacity-60">{source.description}</div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="text-2xl font-bold text-green-800">{source.value}</div>
              <div className="text-sm text-green-800 opacity-60">{source.percentage}%</div>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-green-800 transition-all duration-1000" 
                style={{ width: `${source.percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-green-800 opacity-70">
              {source.id === 'purchased-electricity' ? '12 meters • Grid mix, renewable certificates' :
               source.id === 'steam' ? '8 steam lines • Natural gas, biomass' :
               '15 HVAC systems • District heating'}
            </div>
          </div>
        ))}
      </div>

      {/* Renewable Energy Section */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
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
              <div className="text-sm text-green-800 opacity-70">{energy.source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Scope 2 Energy Sources Detail</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Add Source
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Source ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Energy Source</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Annual Consumption</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Emissions</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {energySourcesData.map((source) => (
                <tr key={source.id} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-green-800">{source.id}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{source.type}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{source.location}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{source.source}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{source.consumption}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{source.emissions} tCO₂e</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                      source.status === 'Verified' 
                        ? 'bg-green-100 text-green-800 border-green-800'
                        : 'bg-green-100 text-green-800 border-green-800'
                    }`}>
                      {source.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 