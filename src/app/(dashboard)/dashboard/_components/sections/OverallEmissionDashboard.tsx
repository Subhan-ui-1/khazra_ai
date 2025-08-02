'use client';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import { useState } from 'react';

const BarChartData = {
  Monthly: [
    { height: 0.85, value: '1,280', label: 'Jan' },
    { height: 0.78, value: '1,170', label: 'Feb' },
    { height: 0.82, value: '1,230', label: 'Mar' },
    { height: 0.65, value: '975', label: 'Apr' },
    { height: 0.70, value: '1,050', label: 'May' },
    { height: 0.88, value: '1,320', label: 'Jun' },
    { height: 0.92, value: '1,380', label: 'Jul' },
    { height: 0.89, value: '1,335', label: 'Aug' },
    { height: 0.75, value: '1,125', label: 'Sep' },
    { height: 0.68, value: '1,020', label: 'Oct' },
    { height: 0.72, value: '1,080', label: 'Nov' },
    { height: 0.85, value: '1,275', label: 'Dec' },
  ],
  Quarterly: [
    { height: 0.85, value: '1,280', label: 'Jan', quarter: 'Q1' },
    { height: 0.78, value: '1,170', label: 'Feb', quarter: 'Q1' },
    { height: 0.82, value: '1,230', label: 'Mar', quarter: 'Q1' },
    { height: 0.65, value: '975', label: 'Apr', quarter: 'Q2' },
    { height: 0.70, value: '1,050', label: 'May', quarter: 'Q2' },
    { height: 0.88, value: '1,320', label: 'Jun', quarter: 'Q2' },
    { height: 0.92, value: '1,380', label: 'Jul', quarter: 'Q3' },
    { height: 0.89, value: '1,335', label: 'Aug', quarter: 'Q3' },
    { height: 0.75, value: '1,125', label: 'Sep', quarter: 'Q3' },
    { height: 0.68, value: '1,020', label: 'Oct', quarter: 'Q4' },
    { height: 0.72, value: '1,080', label: 'Nov', quarter: 'Q4' },
    { height: 0.85, value: '1,275', label: 'Dec', quarter: 'Q4' },
  ],
  Annual: [
    { height: 0.33, value: '5,515', label: '2013' },
    { height: 0.43, value: '6,515', label: '2014' },
    { height: 0.53, value: '7,515', label: '2015' },
    { height: 0.88, value: '14,015', label: '2016' },
    { height: 0.53, value: '10,515', label: '2017' },
    { height: 0.83, value: '13,515', label: '2018' },
    { height: 0.53, value: '10,515', label: '2019' },
    { height: 0.65, value: '12,515', label: '2020' },
    { height: 0.97, value: '16,515', label: '2021' },
    { height: 0.82, value: '14,515', label: '2022' },
    { height: 0.68, value: '11,880', label: '2023' },
    { height: 0.91, value: '15,410', label: '2024' },
  ]
};

const emissionsData = [
  {
    label: 'Scope 1 (Direct)',
    value: 5781,
    color: '#0f766e',
    displayColor: 'bg-teal-700',
    percentage: 25,
  },
  {
    label: 'Scope 2 (Electricity)',
    value: 4496,
    color: '#059669',
    displayColor: 'bg-green-600',
    percentage: 40,
  },
  {
    label: 'Scope 3 (Indirect)',
    value: 2570,
    color: '#34d399',
    displayColor: 'bg-green-400',
    percentage: 35,
  },
];


export default function OverallEmissionDashboard() {

  const [duration, setDuration] = useState<'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const TOTAL_CIRCUMFERENCE = 2 * Math.PI * 80;
  // const router = useRouter()
  let offset = 0;

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Total Emissions (All Scopes)
            </div>
            <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center text-sm text-green-600">
              📊
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-2">12,847</div>
          <div className="text-sm font-medium text-red-600 mb-4">▼ 6.4% vs last year</div>
          <div className="text-xs text-gray-600 mb-4">tonnes CO2e • 68% of annual target</div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-700 transition-all duration-1000" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Emission Reduction
            </div>
            <div className="w-8 h-8 bg-pink-50 rounded flex items-center justify-center text-sm text-pink-600">
              📉
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-2">1,247</div>
          <div className="text-sm font-medium text-green-600 mb-4">▲ 18.7% improvement</div>
          <div className="text-xs text-gray-600">tonnes CO2e reduced • 92% of target</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Target Progress
            </div>
            <div className="w-8 h-8 bg-yellow-50 rounded flex items-center justify-center text-sm text-yellow-600">
              🎯
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-2">78.6</div>
          <div className="text-sm font-medium text-green-600 mb-4">▲ On track for 2025</div>
          <div className="text-xs text-gray-600">Annual reduction goal • 1.5 months ahead</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Emission Intensity
            </div>
            <div className="w-8 h-8 bg-yellow-50 rounded flex items-center justify-center text-sm text-yellow-600">
              ⚡
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-2">0.34</div>
          <div className="text-sm font-medium text-red-600 mb-4">▼ 8.9% vs baseline</div>
          <div className="text-xs text-gray-600">tCO2e per employee • Sector benchmark: 0.42</div>
        </div>
      </div>

      {/* Additional KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Data Quality Score
            </div>
            <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center text-sm text-green-600">
              📈
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-2">91.7</div>
          <div className="text-sm font-medium text-green-600 mb-4">▲ 2.8% improvement</div>
          <div className="text-xs text-gray-600 mb-4">Completeness & accuracy • Third-party verified</div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-700 transition-all duration-1000" style={{ width: '92%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Cost Savings
            </div>
            <div className="w-8 h-8 bg-yellow-50 rounded flex items-center justify-center text-sm text-yellow-600">
              💰
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-2">2.4M</div>
          <div className="text-sm font-medium text-green-600 mb-4">▲ 19% increase</div>
          <div className="text-xs text-gray-600">USD from efficiency improvements • ROI 285%</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full">
          <div className="flex flex-wrap gap-y-2.5 justify-between items-center mb-6 border-b border-gray-200 pb-4 w-full">
            <div className="text-lg font-semibold text-gray-800">Emissions Trends by {duration}</div>
            <div className="flex gap-1 border border-gray-200 rounded overflow-hidden">
              {['Monthly', 'Quarterly', 'Annual'].map((type) => (
                <button
                  key={type}
                  onClick={() => setDuration(type as 'Monthly' | 'Quarterly' | 'Annual')}
                  className={`px-4 py-2 text-xs font-medium ${
                    duration === type
                      ? 'bg-green-800 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

            <div className="h-90 relative overflow-visible">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>1,500</span>
              <span>1,200</span>
              <span>900</span>
              <span>600</span>
              <span>300</span>
              <span>0</span>
            </div>

            <div className="xl:ml-14 ml-10 w-[91%] h-full flex justify-between items-end ga-x-2 relative z-10 overflow-x-scroll no-scrollbar">
              {duration === 'Quarterly' ? (
                // Grouped bars for quarterly view
                ['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                  <div
                    key={quarter}
                    className="flex flex-col items-center px-2 bg-white border-x border-green-100 shadow-sm h-full"
                  >
                    <div className="text-sm font-semibold text-gray-600 mb-5">{quarter}</div>
                    <div className="flex gap-6 items-end h-full">
                      {BarChartData.Quarterly.filter(bar => bar.quarter === quarter).map((bar, index) => (
                        <div key={index} className="flex flex-col justify-end items-center min-w-7 h-full relative group">
                          <div
                            className="w-full bg-gradient-to-t from-[#0a1c10] to-[#41ffb9] rounded-t-2xl transition-all duration-300 group-hover:opacity-80"
                            style={{ height: `${bar.height * 100}%` }}
                          />
                          <div className="absolute -top-6 text-xs font-semibold text-gray-800 group-hover:opacity-100 opacity-0 transition">
                            {bar.value}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">{bar.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Default flat bars for Monthly or Yearly
                BarChartData[duration].map((bar, index) => (
                  <div key={index} className="flex flex-col justify-end items-center min-w-7 h-full relative group">
                    <div
                      className="w-full bg-gradient-to-t from-[#0a1c10] to-[#3cf6b2] rounded-t-2xl transition-all duration-300 group-hover:opacity-80"
                      style={{ height: `${bar.height * 100}%` }}
                    />
                    <div className="absolute -top-6 text-xs font-semibold text-gray-800 group-hover:opacity-100 opacity-0 transition">
                      {bar.value}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">{bar.label}</div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>


        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <div className="text-lg font-semibold text-gray-800">Emissions by Scope</div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg width="250" height="250" viewBox="0 0 250 250" className="w-full h-full">
                <circle cx="125" cy="125" r="100" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                  {emissionsData.map((item, index) => {
                    const length = (item.percentage / 100) * TOTAL_CIRCUMFERENCE;
                    const strokeDasharray = `${length} ${TOTAL_CIRCUMFERENCE}`;
                    const strokeDashoffset = -offset;
                    offset += length;
                    return (
                      <circle
                        key={index}
                        cx="125"
                        cy="125"
                        r="80"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="40"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 125 125)"
                      />
                    );
                  })}
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            {emissionsData.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${item.displayColor} rounded-sm`}></div>
                  <span className="text-sm text-gray-800">{item.label}</span>
                </div>
                <div className="font-semibold text-gray-800">
                  {item.value.toLocaleString()} tCO₂e
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { icon: '🚗', title: 'Fleet Vehicles', subtitle: 'Company vehicles, delivery trucks, employee commuting', value: '4,235', change: '-5.2%', color: 'bg-teal-700' },
          { icon: '🏢', title: 'Buildings & Facilities', subtitle: 'Offices, data centers, warehouses, manufacturing', value: '3,890', change: '+2.1%', color: 'bg-green-600' },
          { icon: '⚡', title: 'Equipment & Technology', subtitle: 'IT infrastructure, machinery, production equipment', value: '2,147', change: '-8.7%', color: 'bg-green-400' },
          { icon: '✈️', title: 'Business Travel', subtitle: 'Flights, hotels, conferences, client meetings', value: '1,624', change: '+12.4%', color: 'bg-green-500' },
          { icon: '🔧', title: 'Operations & Maintenance', subtitle: 'Equipment servicing, facility upkeep, repairs', value: '951', change: '-3.8%', color: 'bg-green-300' }
        ].map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${item.color} text-white rounded flex items-center justify-center text-xl`}>
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.subtitle}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-gray-800">{item.value}</div>
              <div className={`text-xs px-2 py-1 rounded ${
                item.change.startsWith('+') 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-green-100 text-green-600'
              }`}>
                {item.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 