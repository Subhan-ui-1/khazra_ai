'use client';

export default function Scope3Section() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Scope 3 Emissions Analysis
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          All indirect emissions that occur in the value chain of the reporting company, including both upstream 
          and downstream emissions from purchased goods, business travel, employee commuting, and waste disposal.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Total Scope 3
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">2,843.1</div>
              <div className="text-sm text-green-800 mb-2">▼ 18.7% vs baseline</div>
              <div className="text-xs text-green-800 opacity-60">
                tonnes CO₂e • 31.8% of total emissions
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              📦
            </div>
          </div>
          <div className="h-10 relative">
            <svg width="100%" height="40" viewBox="0 0 200 40" className="absolute inset-0">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green-800"
                points="0,35 20,30 40,25 60,20 80,15 100,12 120,10 140,8 160,6 180,5 200,4"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Purchased Goods
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">1,247.8</div>
              <div className="text-sm text-green-800 mb-2">▼ 12.4% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
                Largest source • 43.9% of Scope 3
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🛒
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '43.9%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Business Travel
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">624.5</div>
              <div className="text-sm text-green-800 mb-2">▼ 25.3% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
                Travel optimization • 22.0% of Scope 3
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ✈️
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '22.0%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Employee Commuting
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">456.2</div>
              <div className="text-sm text-green-800 mb-2">▼ 8.7% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
                Remote work impact • 16.0% of Scope 3
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🚗
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '16.0%' }}></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📊 Scope 3 Breakdown by Category
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
                {/* Purchased Goods - 43.9% */}
                <path
                  d="M 0,-60 A 60,60 0 1,1 52.7,33.1 L 0,0 Z"
                  fill="#0f5744"
                  opacity="1"
                />
                {/* Business Travel - 22.0% */}
                <path
                  d="M 52.7,33.1 A 60,60 0 0,1 26.4,53.2 L 0,0 Z"
                  fill="#0f5744"
                  opacity="0.8"
                />
                {/* Employee Commuting - 16.0% */}
                <path
                  d="M 26.4,53.2 A 60,60 0 0,1 -26.4,53.2 L 0,0 Z"
                  fill="#0f5744"
                  opacity="0.6"
                />
                {/* Waste - 8.1% */}
                <path
                  d="M -26.4,53.2 A 60,60 0 0,1 -52.7,33.1 L 0,0 Z"
                  fill="#0f5744"
                  opacity="0.4"
                />
                {/* Other - 10.0% */}
                <path
                  d="M -52.7,33.1 A 60,60 0 0,1 0,-60 L 0,0 Z"
                  fill="#0f5744"
                  opacity="0.2"
                />

                {/* Labels */}
                <text x="0" y="-35" textAnchor="middle" fontSize="10" fill="white">
                  43.9%
                </text>
                <text x="30" y="15" textAnchor="middle" fontSize="10" fill="white">
                  22.0%
                </text>
                <text x="0" y="35" textAnchor="middle" fontSize="10" fill="white">
                  16.0%
                </text>
                <text x="-30" y="15" textAnchor="middle" fontSize="10" fill="white">
                  8.1%
                </text>
                <text x="-25" y="-25" textAnchor="middle" fontSize="10" fill="white">
                  10.0%
                </text>
              </g>
            </svg>
          </div>
          <div className="flex gap-5 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
              <span className="text-sm text-green-800">Purchased Goods (1,247.8 tCO₂e)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-80"></div>
              <span className="text-sm text-green-800">Business Travel (624.5 tCO₂e)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-60"></div>
              <span className="text-sm text-green-800">Employee Commuting (456.2 tCO₂e)</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📈 Supply Chain Engagement
            </h3>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-800 mb-1">78%</div>
              <div className="text-sm text-green-800 opacity-70">Suppliers with targets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-800 mb-1">156</div>
              <div className="text-sm text-green-800 opacity-70">Active suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-800 mb-1">45%</div>
              <div className="text-sm text-green-800 opacity-70">Target progress</div>
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '45%' }}></div>
          </div>
          <div className="text-center text-xs text-green-800 opacity-70 mt-2">
            SBTi supply chain target • 25% by 2030
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🛒
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Purchased Goods & Services</h4>
              <div className="text-xs text-green-800 opacity-60">Supply chain emissions</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">1,247.8</div>
            <div className="text-sm text-green-800 opacity-60">43.9%</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '43.9%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            156 suppliers • Raw materials, components
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ✈️
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Business Travel</h4>
              <div className="text-xs text-green-800 opacity-60">Flights, hotels, conferences</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">624.5</div>
            <div className="text-sm text-green-800 opacity-60">22.0%</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '22.0%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            1,247 trips • Air travel, accommodation
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🚗
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Employee Commuting</h4>
              <div className="text-xs text-green-800 opacity-60">Daily travel to work</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">456.2</div>
            <div className="text-sm text-green-800 opacity-60">16.0%</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '16.0%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            2,847 employees • Cars, public transport
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🗑️
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Waste Generated</h4>
              <div className="text-xs text-green-800 opacity-60">Operational waste disposal</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">230.1</div>
            <div className="text-sm text-green-800 opacity-60">8.1%</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '8.1%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            92% diverted • Landfill, recycling
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🚚
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Transportation & Distribution</h4>
              <div className="text-xs text-green-800 opacity-60">Product logistics</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">284.5</div>
            <div className="text-sm text-green-800 opacity-60">10.0%</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '10.0%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            Freight, delivery • 3PL partners
          </div>
        </div>
      </div>

      {/* Supplier Engagement Section */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            🤝 Supplier Engagement Program
          </h3>
          <div className="text-sm text-green-800 opacity-70">156 active suppliers</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
              🎯
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">78%</div>
            <div className="text-sm text-green-800 opacity-70">With SBTi targets</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
              📊
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">92%</div>
            <div className="text-sm text-green-800 opacity-70">Data quality score</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
              📈
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">45%</div>
            <div className="text-sm text-green-800 opacity-70">Target progress</div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Scope 3 Categories Detail</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Add Category
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Annual Emissions</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">YoY Change</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Data Quality</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Purchased Goods</td>
                <td className="px-6 py-4 text-sm text-green-800">Raw materials, components, supplies</td>
                <td className="px-6 py-4 text-sm text-green-800">1,247.8 tCO₂e</td>
                <td className="px-6 py-4 text-sm text-green-800">-12.4%</td>
                <td className="px-6 py-4 text-sm text-green-800">87%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Monitored
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Business Travel</td>
                <td className="px-6 py-4 text-sm text-green-800">Flights, hotels, conferences</td>
                <td className="px-6 py-4 text-sm text-green-800">624.5 tCO₂e</td>
                <td className="px-6 py-4 text-sm text-green-800">-25.3%</td>
                <td className="px-6 py-4 text-sm text-green-800">94%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Monitored
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Employee Commuting</td>
                <td className="px-6 py-4 text-sm text-green-800">Daily travel to work</td>
                <td className="px-6 py-4 text-sm text-green-800">456.2 tCO₂e</td>
                <td className="px-6 py-4 text-sm text-green-800">-8.7%</td>
                <td className="px-6 py-4 text-sm text-green-800">91%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Monitored
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Waste Generated</td>
                <td className="px-6 py-4 text-sm text-green-800">Operational waste disposal</td>
                <td className="px-6 py-4 text-sm text-green-800">230.1 tCO₂e</td>
                <td className="px-6 py-4 text-sm text-green-800">-15.2%</td>
                <td className="px-6 py-4 text-sm text-green-800">89%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Monitored
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 