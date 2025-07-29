'use client';

import { useEffect, useState } from 'react';

export default function OverviewSection() {
  const [activeChart, setActiveChart] = useState('monthly');

  // Dynamic data arrays for charts
  const emissionTrendsData = {
    monthly: [
      { month: 'Jan', scope1: 320, scope2: 285, scope3: 284 },
      { month: 'Feb', scope1: 315, scope2: 282, scope3: 281 },
      { month: 'Mar', scope1: 310, scope2: 280, scope3: 279 },
      { month: 'Apr', scope1: 305, scope2: 278, scope3: 277 },
      { month: 'May', scope1: 300, scope2: 275, scope3: 275 },
      { month: 'Jun', scope1: 295, scope2: 272, scope3: 273 },
      { month: 'Jul', scope1: 290, scope2: 270, scope3: 271 },
      { month: 'Aug', scope1: 285, scope2: 268, scope3: 269 },
      { month: 'Sep', scope1: 280, scope2: 265, scope3: 267 },
      { month: 'Oct', scope1: 275, scope2: 262, scope3: 265 },
      { month: 'Nov', scope1: 270, scope2: 260, scope3: 263 },
      { month: 'Dec', scope1: 265, scope2: 258, scope3: 261 }
    ],
    quarterly: [
      { quarter: 'Q1', scope1: 945, scope2: 847, scope3: 844 },
      { quarter: 'Q2', scope1: 895, scope2: 825, scope3: 825 },
      { quarter: 'Q3', scope1: 855, scope2: 803, scope3: 803 },
      { quarter: 'Q4', scope1: 415, scope2: 781, scope3: 781 },
      { quarter: 'Q5', scope1: 595, scope2: 781, scope3: 781 },
      { quarter: 'Q6', scope1: 615, scope2: 781, scope3: 781 },
      { quarter: 'Q7', scope1: 715, scope2: 781, scope3: 781 },
      { quarter: 'Q8', scope1: 81, scope2: 781, scope3: 781 },
    ],
    annual: [
      { year: '2020', scope1: 3800, scope2: 3200, scope3: 3200 },
      { year: '2021', scope1: 3650, scope2: 3100, scope3: 3100 },
      { year: '2022', scope1: 3500, scope2: 3000, scope3: 3000 },
      { year: '2023', scope1: 3350, scope2: 2900, scope3: 2900 },
      { year: '2000', scope1: 1200, scope2: 9000, scope3: 1200 },
      { year: '2025', scope1: 3050, scope2: 2700, scope3: 2700 }
    ]
  };

  const metricsData = [
    {
      id: 'total-emissions',
      title: 'Total Emissions',
      value: '8,947.3',
      change: '▼ 8.2%',
      changeType: 'decrease',
      subtitle: 'tonnes CO₂e • All scopes combined',
      icon: '🏭',
      trend: [320, 315, 310, 305, 300, 295, 290, 285, 280, 275, 270, 265]
    },
    {
      id: 'target-progress',
      title: 'Target Progress',
      value: '82.4%',
      change: '▲ On track for 2025',
      changeType: 'increase',
      subtitle: 'SBTi validated targets • 2 months ahead',
      icon: '🎯',
      progress: 82.4
    },
    {
      id: 'esg-score',
      title: 'ESG Score',
      value: '91.5',
      change: '▲ 3.2% improvement',
      changeType: 'increase',
      subtitle: 'Combined E, S, G rating • Industry leading',
      icon: '🏆',
      progress: 91.5
    },
    {
      id: 'data-quality',
      title: 'Data Quality',
      value: '94.2%',
      change: '▲ 3.1% improvement',
      changeType: 'increase',
      subtitle: 'Verified & complete • Third-party audited',
      icon: '📊',
      progress: 94.2
    }
  ];

  const scopeBreakdownData = [
    {
      id: 'scope1',
      title: 'Scope 1 Emissions',
      subtitle: 'Direct emissions from owned sources',
      value: '3,247.8',
      percentage: 96.3,
      icon: '🔥',
      trend: [320, 315, 310, 305, 300, 295, 290, 285, 280, 275, 270, 265]
    },
    {
      id: 'scope2',
      title: 'Scope 2 Emissions',
      subtitle: 'Energy indirect emissions',
      value: '2,856.4',
      percentage: 31.9,
      icon: '⚡',
      trend: [285, 282, 280, 278, 275, 272, 270, 268, 265, 262, 260, 258]
    },
    {
      id: 'scope3',
      title: 'Scope 3 Emissions',
      subtitle: 'Value chain emissions',
      value: '2,843.1',
      percentage: 31.8,
      icon: '📦',
      trend: [284, 281, 279, 277, 275, 273, 271, 269, 267, 265, 263, 261]
    }
  ];

  const recentActivitiesData = [
    {
      id: 1,
      date: 'Mar 20, 2025',
      activity: 'Solar Panel Installation',
      scope: 'Scope 2',
      impact: '-145.2 tCO₂e',
      status: 'Complete',
      statusType: 'success'
    },
    {
      id: 2,
      date: 'Mar 18, 2025',
      activity: 'Fleet Electrification',
      scope: 'Scope 1',
      impact: '-67.8 tCO₂e',
      status: 'In Progress',
      statusType: 'pending'
    },
    {
      id: 3,
      date: 'Mar 15, 2025',
      activity: 'Supplier Engagement',
      scope: 'Scope 3',
      impact: '-234.5 tCO₂e',
      status: 'Complete',
      statusType: 'success'
    },
    {
      id: 4,
      date: 'Mar 12, 2025',
      activity: 'Energy Efficiency Upgrade',
      scope: 'Scope 2',
      impact: '-89.3 tCO₂e',
      status: 'Complete',
      statusType: 'success'
    },
    {
      id: 5,
      date: 'Mar 10, 2025',
      activity: 'Waste Reduction Program',
      scope: 'Scope 3',
      impact: '-45.7 tCO₂e',
      status: 'Complete',
      statusType: 'success'
    },
    {
      id: 6,
      date: 'Mar 8, 2025',
      activity: 'Building Automation',
      scope: 'Scope 2',
      impact: '-123.4 tCO₂e',
      status: 'In Progress',
      statusType: 'pending'
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

  // Get current data based on active chart
  const getCurrentData = () => {
    return emissionTrendsData[activeChart as keyof typeof emissionTrendsData];
  };

  // Calculate max value for chart scaling
  const getMaxValue = (data: any[]) => {
    const allValues = data.flatMap(item => [item.scope1, item.scope2, item.scope3]);
    return Math.max(...allValues) * 1.1; // Add 10% padding
  };

  useEffect(() => {
    // Animate progress bars when component mounts
    const animateProgressBars = () => {
      const progressBars = document.querySelectorAll('.progress-fill');
      progressBars.forEach((bar) => {
        const width = (bar as HTMLElement).style.width;
        (bar as HTMLElement).style.width = '0%';
        setTimeout(() => {
          (bar as HTMLElement).style.width = width;
        }, 100);
      });
    };

    animateProgressBars();
  }, []);

  const currentData = getCurrentData();
  const maxValue = getMaxValue(currentData);
  const chartWidth = 360;
  const chartHeight = 160;

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Sustainability Dashboard Overview
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Comprehensive view of your organization's sustainability performance across all environmental, 
          social, and governance metrics with real-time data and actionable insights.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <div key={metric.id} className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                  {metric.title}
                </div>
                <div className="text-3xl font-bold text-green-800 mb-2">{metric.value}</div>
                <div className={`text-sm text-green-800 mb-2 ${metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
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
                <div 
                  className="h-full bg-green-800 transition-all duration-1000 ease-out"
                  style={{ width: `${metric.progress}%` }}
                ></div>
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
              📈 Emission Trends by Scope
            </h3>
            <div className="flex gap-2">
              <button 
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'monthly' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
                onClick={() => setActiveChart('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'quarterly' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
                onClick={() => setActiveChart('quarterly')}
              >
                Quarterly
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'annual' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
                onClick={() => setActiveChart('annual')}
              >
                Annual
              </button>
            </div>
          </div>
          <div className="h-80 relative">
            <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              <defs>
                <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e4f5d5" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Scope 1 */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="3"
                points={generateChartPoints(currentData, 'scope1', maxValue, chartHeight, chartWidth)}
              />
              
              {/* Scope 2 */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="2"
                opacity="0.7"
                points={generateChartPoints(currentData, 'scope2', maxValue, chartHeight, chartWidth)}
              />
              
              {/* Scope 3 */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="2"
                opacity="0.5"
                points={generateChartPoints(currentData, 'scope3', maxValue, chartHeight, chartWidth)}
              />
              
              {/* Data points */}
              {currentData.map((item, index) => {
                const x = (index / (currentData.length - 1)) * chartWidth;
                const y1 = chartHeight - (item.scope1 / maxValue) * chartHeight;
                const y2 = chartHeight - (item.scope2 / maxValue) * chartHeight;
                const y3 = chartHeight - (item.scope3 / maxValue) * chartHeight;
                
                return (
                  <g key={index}>
                    <circle cx={x} cy={y1} r="3" fill="#0f5744" />
                    <circle cx={x} cy={y2} r="2" fill="#0f5744" opacity="0.7" />
                    <circle cx={x} cy={y3} r="2" fill="#0f5744" opacity="0.5" />
                  </g>
                );
              })}
              
              {/* Labels */}
              {currentData.map((item, index) => {
                const x = (index / (currentData.length - 1)) * chartWidth;
                const label = activeChart === 'monthly' ? item.month : activeChart === 'quarterly' ? item.quarter : item.year;
                return (
                  <text key={index} x={x} y={chartHeight + 15} fontSize="10" fill="#0f5744" textAnchor="middle">
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>
          <div className="flex gap-5 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
              <span className="text-sm text-green-800">Scope 1 ({scopeBreakdownData[0].value} tCO₂e)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-70"></div>
              <span className="text-sm text-green-800">Scope 2 ({scopeBreakdownData[1].value} tCO₂e)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-50"></div>
              <span className="text-sm text-green-800">Scope 3 ({scopeBreakdownData[2].value} tCO₂e)</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              🎯 Overall Progress
            </h3>
          </div>
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e4f5d5"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#0f5744"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(21.4 / 100) * 314} 314`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-lg font-bold text-green-800">82%</div>
                <div className="text-xs text-green-800 opacity-70">Complete</div>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-green-800 opacity-70 mt-4">
            SBTi Target Progress • 2025 Goal
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scopeBreakdownData.map((scope) => (
          <div key={scope.id} className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                {scope.icon}
              </div>
              <div>
                <h4 className="font-semibold text-green-800">{scope.title}</h4>
                <div className="text-xs text-green-800 opacity-60">{scope.subtitle}</div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="text-2xl font-bold text-green-800">{scope.value}</div>
              <div className="text-sm text-green-800 opacity-60">{scope.percentage}%</div>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: `${scope.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Recent Sustainability Activities</div>
          <div className="flex gap-3">
            <button className="p-2 text-green-800 hover:bg-green-50 rounded border border-green-200 transition-colors" title="Refresh">
              🔄
            </button>
            <button className="p-2 text-green-800 hover:bg-green-50 rounded border border-green-200 transition-colors" title="Export">
              📊
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Activity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Scope</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Impact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivitiesData.map((activity) => (
                <tr key={activity.id} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-green-800">{activity.date}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{activity.activity}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{activity.scope}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{activity.impact}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                      activity.statusType === 'success' 
                        ? 'bg-green-100 text-green-800 border-green-800'
                        : 'bg-white text-green-800 border-green-800'
                    }`}>
                      {activity.status}
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