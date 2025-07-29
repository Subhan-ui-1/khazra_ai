'use client';

export default function TargetsSection() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            name: 'Carbon Intensity Target',
            badge: 'SBTi',
            progress: 72,
            target: '70% target by 2030',
            meta: 'Per compute hour • Baseline: 2020 • Deadline: 2030',
            status: 'On track',
            current: '0.187 tCO₂e per unit (50.4% reduction)'
          },
          {
            name: 'Renewable Energy Target',
            badge: 'SBTi',
            progress: 95,
            target: '100% target by 2025',
            meta: 'Data centers • Deadline: December 2025',
            status: 'Nearly complete',
            current: '95% renewable energy (solar + wind + hydro)'
          },
          {
            name: 'Supply Chain Emissions',
            badge: 'SBTi',
            progress: 45,
            target: '25% target by 2030',
            meta: 'Scope 3 • Baseline: 2020 • Deadline: 2030',
            status: 'Ahead of schedule',
            current: '78% suppliers with targets set'
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