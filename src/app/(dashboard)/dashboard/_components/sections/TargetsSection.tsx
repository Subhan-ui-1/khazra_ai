'use client';

import { useState } from "react";
import ScopeAlignmentChart from "./overview/ScopeAlignmentChart";

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

export default function TargetsSection() {
  const [duration, setDuration] = useState<'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const TOTAL_CIRCUMFERENCE = 2 * Math.PI * 80;
  let offset = 0;
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Science-Based Targets Management
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Comprehensive tracking and management of science-based emission reduction targets aligned with SBTi requirements, 
          including detailed progress monitoring, milestone tracking, and performance analytics.
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-green-50 border border-green-800 rounded-lg p-4">
        <div className="font-semibold text-green-800 mb-2">🎯 SBTi Validation Status</div>
        <div className="text-sm text-green-800 opacity-80">
          All targets validated by Science Based Targets initiative • Net-zero commitment by 2030 • Last review: February 2025
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Targets Set
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">8</div>
              <div className="text-sm text-green-800 mb-2">100% SBTi compliant</div>
              <div className="text-xs text-green-800 opacity-60">Science-based targets</div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🎯
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                On Track
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">6</div>
              <div className="text-sm text-green-800 mb-2">75% achieving milestones</div>
              <div className="text-xs text-green-800 opacity-60">Meeting deadlines</div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Average Progress
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">73.5%</div>
              <div className="text-sm text-green-800 mb-2">▲ 8.3% this quarter</div>
              <div className="text-xs text-green-800 opacity-60">Weighted by scope</div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              📊
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Time to Target
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">5.3</div>
              <div className="text-sm text-green-800 mb-2">Years remaining</div>
              <div className="text-xs text-green-800 opacity-60">To 2030 net-zero</div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ⏰
            </div>
          </div>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          {
            name: 'Scope 1&2 Emissions Reduction',
            badge: 'SBTi',
            progress: 85,
            target: '42% target by 2030',
            meta: 'Absolute reduction • Baseline: 2020 • Deadline: 2030',
            status: 'Ahead of schedule by 1.2 years',
            current: '35.7% achieved vs 2020 baseline'
          },
          {
            name: 'Net-Zero Target',
            badge: 'SBTi',
            progress: 68,
            target: '90% target by 2030',
            meta: 'All operations • Deadline: 2030',
            status: 'On track',
            current: '61.2% reduction + offsetting for residuals'
          },
          {
            name: 'Energy Efficiency Target',
            badge: 'Internal',
            progress: 60,
            target: '50% target by 2025',
            meta: 'kWh per model training • Deadline: 2025',
            status: 'Exceeded target',
            current: '30% efficiency improvement'
          }
        ].map((target, index) => (
          <div key={index} className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="font-semibold text-green-800 text-sm">{target.name}</div>
              <div className="px-2 py-1 bg-white border border-green-800 text-green-800 rounded-full text-xs font-semibold">
                {target.badge}
              </div>
            </div>
            <div className="flex justify-between text-xs text-green-800 mb-2">
              <span>{target.progress}% achieved</span>
              <span>{target.target}</span>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-green-800 transition-all duration-1000" 
                style={{ width: `${target.progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-green-800 opacity-60 mb-3">{target.meta}</div>
            <div className="text-xs text-green-800">
              <strong>Status:</strong> {target.status}<br />
              <strong>Current:</strong> {target.current}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div>
          <ScopeAlignmentChart title="📊 Targets by facility" />
        </div>
        <div>
          <ScopeAlignmentChart title="📊 Targets by equipments" />
        </div>
        <div>
          <ScopeAlignmentChart title="📊 Targets by vehicle" />
        </div>
      </div>


      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full">
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

            <div className="xl:ml-14 ml-10 xl:w-[91%] h-full flex justify-between items-end ga-x-2 relative z-10 overflow-x-scroll no-scrollbar">
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
      </div>


      {/* Data Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Target Milestones & Deadlines</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Calendar View
            </button>
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Set Milestone
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Target</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Next Milestone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Risk Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Renewable Energy 100%</td>
                <td className="px-6 py-4 text-sm text-green-800">Complete solar installation</td>
                <td className="px-6 py-4 text-sm text-green-800">Sep 2025</td>
                <td className="px-6 py-4 text-sm text-green-800">95%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Low
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-800 rounded hover:bg-green-50 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Scope 1&2 Reduction</td>
                <td className="px-6 py-4 text-sm text-green-800">Fleet electrification phase 2</td>
                <td className="px-6 py-4 text-sm text-green-800">Dec 2025</td>
                <td className="px-6 py-4 text-sm text-green-800">85%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Low
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-800 rounded hover:bg-green-50 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Supply Chain Engagement</td>
                <td className="px-6 py-4 text-sm text-green-800">Tier 2 supplier targets</td>
                <td className="px-6 py-4 text-sm text-green-800">Jun 2025</td>
                <td className="px-6 py-4 text-sm text-green-800">45%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-white text-green-800 rounded-full border border-green-800">
                    Medium
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-800 rounded hover:bg-green-50 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Net-Zero Validation</td>
                <td className="px-6 py-4 text-sm text-green-800">SBTi net-zero review</td>
                <td className="px-6 py-4 text-sm text-green-800">Mar 2026</td>
                <td className="px-6 py-4 text-sm text-green-800">68%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Low
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-800 rounded hover:bg-green-50 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 