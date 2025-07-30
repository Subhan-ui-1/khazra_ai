'use client';

export default function Scope1Section() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Scope 1 Emissions Analysis
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Direct greenhouse gas emissions from sources owned or controlled by your organization, 
          including detailed analysis of stationary combustion, mobile combustion, process emissions, and fugitive emissions.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Total Scope 1
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">3,247.8</div>
              <div className="text-sm text-green-800 mb-2">▼ 12.4% vs baseline</div>
              <div className="text-xs text-green-800 opacity-60">
                tonnes CO₂e • 36.3% of total emissions
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🏭
            </div>
          </div>
          <div className="h-10 relative">
            <svg width="100%" height="40" viewBox="0 0 200 40" className="absolute inset-0">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green-800"
                points="0,35 20,32 40,30 60,28 80,25 100,23 120,20 140,18 160,15 180,12 200,10"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Stationary Combustion
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">1,746.2</div>
              <div className="text-sm text-green-800 mb-2">▼ 8.5% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
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
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Mobile Combustion
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">985.4</div>
              <div className="text-sm text-green-800 mb-2">▼ 15.2% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
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

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Process Emissions
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">516.2</div>
              <div className="text-sm text-green-800 mb-2">▼ 5.8% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
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
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📊 Scope 1 Breakdown by Source
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md">This Year</button>
              <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-200 rounded-md hover:bg-green-50">Last Year</button>
              <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-200 rounded-md hover:bg-green-50">Comparison</button>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <svg viewBox="0 0 300 200" className="w-full h-full">
              <g transform="translate(150,100)">
                {/* Stationary Combustion - 53.8% */}
                <path
                  d="M 0,-60 A 60,60 0 1,1 32.3,49.7 L 0,0 Z"
                  fill="#0f5744"
                  opacity="1"
                />
                {/* Mobile Combustion - 30.3% */}
                <path
                  d="M 32.3,49.7 A 60,60 0 0,1 -58.5,-10.8 L 0,0 Z"
                  fill="#0f5744"
                  opacity="0.8"
                />
                {/* Process Emissions - 15.9% */}
                <path
                  d="M -58.5,-10.8 A 60,60 0 0,1 0,-60 L 0,0 Z"
                  fill="#0f5744"
                  opacity="0.6"
                />

                {/* Labels */}
                <text x="0" y="-35" textAnchor="middle" fontSize="10" fill="white">
                  53.8%
                </text>
                <text x="20" y="25" textAnchor="middle" fontSize="10" fill="white">
                  30.3%
                </text>
                <text x="-25" y="-25" textAnchor="middle" fontSize="10" fill="white">
                  15.9%
                </text>
              </g>
            </svg>
          </div>
          <div className="flex gap-5 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
              <span className="text-sm text-green-800">Stationary Combustion (1,746.2 tCO₂e)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-80"></div>
              <span className="text-sm text-green-800">Mobile Combustion (985.4 tCO₂e)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-60"></div>
              <span className="text-sm text-green-800">Process Emissions (516.2 tCO₂e)</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📈 Monthly Trends
            </h3>
          </div>
          <div className="h-80 relative">
            <svg viewBox="0 0 300 150" className="w-full h-full">
              {/* Grid */}
              <defs>
                <pattern id="monthlyGrid" width="30" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 15" fill="none" stroke="#e4f5d5" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#monthlyGrid)" />

              {/* Data line */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="3"
                points="15,120 45,115 75,110 105,108 135,105 165,100 195,98 225,95 255,90 285,85"
              />

              {/* Data points */}
              <circle cx="285" cy="85" r="4" fill="#0f5744" />

              {/* Labels */}
              <text x="15" y="140" fontSize="8" fill="#0f5744">Jan</text>
              <text x="75" y="140" fontSize="8" fill="#0f5744">Mar</text>
              <text x="135" y="140" fontSize="8" fill="#0f5744">May</text>
              <text x="195" y="140" fontSize="8" fill="#0f5744">Jul</text>
              <text x="255" y="140" fontSize="8" fill="#0f5744">Sep</text>
            </svg>
          </div>
          <div className="text-center text-xs text-green-800 opacity-70 mt-4">
            Continuous reduction trend • Target: -15% by Dec 2025
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              🔥
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800">Stationary Combustion</h3>
              <p className="text-sm text-green-800 opacity-60">Boilers, furnaces, generators</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800 opacity-70">Total Emissions</span>
              <span className="text-lg font-bold text-green-800">1,746.2 tCO₂e</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800 opacity-70">Active Sources</span>
              <span className="text-sm font-semibold text-green-800">23</span>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '53.8%' }}></div>
            </div>
            <div className="text-xs text-green-800 opacity-60">
              53.8% of Scope 1 emissions
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-100">
            <button className="w-full px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Manage Stationary Combustion
            </button>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              🚗
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800">Mobile Combustion</h3>
              <p className="text-sm text-green-800 opacity-60">Fleet vehicles, equipment</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800 opacity-70">Total Emissions</span>
              <span className="text-lg font-bold text-green-800">985.4 tCO₂e</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800 opacity-70">Fleet Size</span>
              <span className="text-sm font-semibold text-green-800">45 vehicles</span>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '30.3%' }}></div>
            </div>
            <div className="text-xs text-green-800 opacity-60">
              30.3% of Scope 1 emissions
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-100">
            <button className="w-full px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Manage Mobile Combustion
            </button>
          </div>
        </div>
      </div>

      {/* Additional Scope 1 Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              🏭
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800">Process Emissions</h3>
              <p className="text-sm text-green-800 opacity-60">Industrial manufacturing</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800 opacity-70">Total Emissions</span>
              <span className="text-lg font-bold text-green-800">516.2 tCO₂e</span>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '15.9%' }}></div>
            </div>
            <div className="text-xs text-green-800 opacity-60">
              15.9% of Scope 1 emissions
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-100">
            <button className="w-full px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Manage Process Emissions
            </button>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              💨
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800">Fugitive Emissions</h3>
              <p className="text-sm text-green-800 opacity-60">Leaks, venting, flaring</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800 opacity-70">Total Emissions</span>
              <span className="text-lg font-bold text-green-800">Coming Soon</span>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '0%' }}></div>
            </div>
            <div className="text-xs text-green-800 opacity-60">
              Under development
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-100">
            <button className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm font-medium cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 