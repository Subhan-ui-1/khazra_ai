'use client';

export default function OverallEmissionDashboard() {
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
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <div className="text-lg font-semibold text-gray-800">Emissions Trends by Month</div>
            <div className="flex gap-1 border border-gray-200 rounded overflow-hidden">
              <button className="px-4 py-2 text-xs font-medium bg-teal-700 text-white">Monthly</button>
              <button className="px-4 py-2 text-xs font-medium bg-white text-gray-600 hover:bg-gray-50">Quarterly</button>
              <button className="px-4 py-2 text-xs font-medium bg-white text-gray-600 hover:bg-gray-50">Annual</button>
            </div>
          </div>
          <div className="h-80 relative">
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>1,500</span>
              <span>1,200</span>
              <span>900</span>
              <span>600</span>
              <span>300</span>
              <span>0</span>
            </div>
            <div className="ml-10 h-full flex items-end gap-2 pt-5">
              {[
                { height: '85%', value: '1,280', label: 'Jan' },
                { height: '78%', value: '1,170', label: 'Feb' },
                { height: '82%', value: '1,230', label: 'Mar' },
                { height: '65%', value: '975', label: 'Apr' },
                { height: '70%', value: '1,050', label: 'May' },
                { height: '88%', value: '1,320', label: 'Jun' },
                { height: '92%', value: '1,380', label: 'Jul' },
                { height: '89%', value: '1,335', label: 'Aug' },
                { height: '75%', value: '1,125', label: 'Sep' },
                { height: '68%', value: '1,020', label: 'Oct' },
                { height: '72%', value: '1,080', label: 'Nov' },
                { height: '85%', value: '1,275', label: 'Dec' }
              ].map((bar, index) => (
                <div key={index} className="flex-1 relative group">
                  <div 
                    className="bg-gradient-to-t from-teal-700 to-green-400 rounded-t transition-all duration-300 group-hover:opacity-80"
                    style={{ height: bar.height }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-800">
                      {bar.value}
                    </div>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 text-center">
                    {bar.label}
                  </div>
                </div>
              ))}
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
                <circle cx="125" cy="125" r="100" fill="none" stroke="#e2e8f0" strokeWidth="2"/>
                {/* Scope 1 - 45% */}
                <circle cx="125" cy="125" r="80" fill="none" stroke="#0f766e" strokeWidth="40" 
                        strokeDasharray="226 628" strokeDashoffset="0" transform="rotate(-90 125 125)"/>
                {/* Scope 2 - 35% */}
                <circle cx="125" cy="125" r="80" fill="none" stroke="#059669" strokeWidth="40" 
                        strokeDasharray="175.9 628" strokeDashoffset="-226" transform="rotate(-90 125 125)"/>
                {/* Scope 3 - 20% */}
                <circle cx="125" cy="125" r="80" fill="none" stroke="#34d399" strokeWidth="40" 
                        strokeDasharray="100.5 628" strokeDashoffset="-401.9" transform="rotate(-90 125 125)"/>
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-teal-700 rounded-sm"></div>
                <span className="text-sm text-gray-800">Scope 1 (Direct)</span>
              </div>
              <div className="font-semibold text-gray-800">5,781 tCO2e</div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <span className="text-sm text-gray-800">Scope 2 (Electricity)</span>
              </div>
              <div className="font-semibold text-gray-800">4,496 tCO2e</div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <span className="text-sm text-gray-800">Scope 3 (Indirect)</span>
              </div>
              <div className="font-semibold text-gray-800">2,570 tCO2e</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
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