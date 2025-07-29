'use client';

export default function DataCollectionSection() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Data Collection & Management
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Comprehensive emission data collection across all scopes with automated monitoring, 
          quality assurance, and real-time validation to ensure accurate sustainability reporting.
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-green-50 border border-green-800 rounded-lg p-4">
        <div className="font-semibold text-green-800 mb-2">🔍 Data Quality Status</div>
        <div className="text-sm text-green-800 opacity-80">
          Overall data completeness: 94.2% | Data accuracy: 97.8% | Last updated: 2 hours ago
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Active Data Sources
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">127</div>
              <div className="text-sm text-green-800 mb-2">▲ 8 new sources this month</div>
              <div className="text-xs text-green-800 opacity-60">
                Automated monitoring systems
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              📡
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Data Points Collected
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">45,673</div>
              <div className="text-sm text-green-800 mb-2">▲ 1,234 today</div>
              <div className="text-xs text-green-800 opacity-60">
                Real-time data collection
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              📊
            </div>
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: '🔥',
            title: 'Stationary Combustion',
            subtitle: 'Boilers, furnaces, generators and heating systems',
            value: '23',
            unit: 'Sources',
            quality: '96%',
            lastUpdate: '1 hour ago'
          },
          {
            icon: '🚗',
            title: 'Mobile Combustion',
            subtitle: 'Fleet vehicles, equipment and transportation',
            value: '45',
            unit: 'Vehicles',
            quality: '92%',
            lastUpdate: '30 min ago'
          },
          {
            icon: '⚡',
            title: 'Purchased Electricity',
            subtitle: 'Grid electricity consumption and renewable energy',
            value: '12',
            unit: 'Meters',
            quality: '98%',
            lastUpdate: '15 min ago'
          },
          {
            icon: '📦',
            title: 'Purchased Goods & Services',
            subtitle: 'Supply chain emissions from procurement',
            value: '156',
            unit: 'Suppliers',
            quality: '87%',
            lastUpdate: '2 hours ago'
          },
          {
            icon: '💨',
            title: 'Fugitive Emissions',
            subtitle: 'Unintentional leaks from equipment and processes',
            value: '67',
            unit: 'Components',
            quality: '94%',
            lastUpdate: '45 min ago'
          },
          {
            icon: '❄️',
            title: 'Refrigerant Emissions',
            subtitle: 'HVAC systems, cooling equipment and refrigeration',
            value: '34',
            unit: 'Systems',
            quality: '91%',
            lastUpdate: '1.5 hours ago'
          }
        ].map((source, index) => (
          <div key={index} className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                {source.icon}
              </div>
              <div>
                <h4 className="font-semibold text-green-800">{source.title}</h4>
                <div className="text-xs text-green-800 opacity-60">{source.subtitle}</div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="text-2xl font-bold text-green-800">{source.value}</div>
              <div className="text-sm text-green-800 opacity-60">{source.unit}</div>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-green-800 transition-all duration-1000" 
                style={{ width: source.quality }}
              ></div>
            </div>
            <div className="text-xs text-green-800 opacity-70 mb-3">
              Data Quality: {source.quality} | Last Update: {source.lastUpdate}
            </div>
            <button className="w-full bg-green-800 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Update Data
            </button>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Recent Data Updates</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Add Entry
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Source</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Data Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Quality Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Mar 20, 2025 14:30</td>
                <td className="px-6 py-4 text-sm text-green-800">Electricity Meter #12</td>
                <td className="px-6 py-4 text-sm text-green-800">kWh Consumption</td>
                <td className="px-6 py-4 text-sm text-green-800">2,847 kWh</td>
                <td className="px-6 py-4 text-sm text-green-800">98.5%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Validated
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Mar 20, 2025 14:15</td>
                <td className="px-6 py-4 text-sm text-green-800">Boiler B-2</td>
                <td className="px-6 py-4 text-sm text-green-800">Natural Gas</td>
                <td className="px-6 py-4 text-sm text-green-800">456 m³</td>
                <td className="px-6 py-4 text-sm text-green-800">96.2%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Validated
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Mar 20, 2025 14:00</td>
                <td className="px-6 py-4 text-sm text-green-800">Vehicle Fleet</td>
                <td className="px-6 py-4 text-sm text-green-800">Fuel Consumption</td>
                <td className="px-6 py-4 text-sm text-green-800">234 L</td>
                <td className="px-6 py-4 text-sm text-green-800">94.7%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-white text-green-800 rounded-full border border-green-800">
                    Processing
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Mar 20, 2025 13:45</td>
                <td className="px-6 py-4 text-sm text-green-800">AC System #3</td>
                <td className="px-6 py-4 text-sm text-green-800">Refrigerant Leak</td>
                <td className="px-6 py-4 text-sm text-green-800">0.12 kg</td>
                <td className="px-6 py-4 text-sm text-green-800">92.1%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-white text-green-800 rounded-full border border-green-800 opacity-70">
                    Review
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