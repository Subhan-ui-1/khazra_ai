'use client';
import { useState } from 'react';
import MetricsModal from './overview/MetricsModal';

const metrics = [
  {
    icon: '📡',
    label: 'Active Data Sources',
    title: 'Active Data Sources',
    subtitle: 'Automated monitoring systems',
    value: '127',
    change: '▲ 8 new sources this month',
    changeType: 'increase',
    progress: 78,
    details: [
      {
        category: 'Top Sources',
        sources: [
          { name: 'Weather API', amount: '32' },
          { name: 'IoT Sensors', amount: '28' },
          { name: 'Satellite Feeds', amount: '20' },
          { name: 'Web Scrapers', amount: '15' },
        ]
      },
      {
        category: 'Recent Additions',
        sources: [
          { name: 'New Thermal Cameras', amount: '5' },
          { name: 'Air Quality Drones', amount: '3' },
        ]
      }
    ]
  },
  {
    icon: '📊',
    label: 'Data Points Collected',
    title: 'Data Points Collected',
    subtitle: 'Real-time data collection',
    value: '45,673',
    change: '▲ 1,234 today',
    changeType: 'increase',
    progress: 64,
    details: [
      {
        category: 'Source Breakdown',
        sources: [
          { name: 'IoT Sensors', amount: '18,000' },
          { name: 'API Inputs', amount: '15,000' },
          { name: 'User Feedback', amount: '7,500' },
          { name: 'Manual Entries', amount: '5,173' },
        ]
      },
      {
        category: 'Peak Times',
        sources: [
          { name: '9 AM - 12 PM', amount: '12,000' },
          { name: '3 PM - 6 PM', amount: '10,000' },
        ]
      }
    ]
  }
];

const sources = [
  {
    icon: '🔥',
    title: 'Stationary Combustion',
    subtitle: 'Boilers, furnaces, generators and heating systems',
    value: '23',
    unit: 'Sources',
    quality: '96%',
    lastUpdate: '1 hour ago',
    change: '▲ 3 new sources',
    changeType: 'increase',
    progress: 85,
    details: [
      {
        category: 'Top Equipment Types',
        sources: [
          { name: 'Diesel Generators', amount: '9 units' },
          { name: 'Industrial Boilers', amount: '6 units' },
          { name: 'Natural Gas Furnaces', amount: '8 units' }
        ]
      }
    ]
  },
  {
    icon: '🚗',
    title: 'Mobile Combustion',
    subtitle: 'Fleet vehicles, equipment and transportation',
    value: '45',
    unit: 'Vehicles',
    quality: '92%',
    lastUpdate: '30 min ago',
    change: '▼ 2 vehicles decommissioned',
    changeType: 'decrease',
    progress: 78,
    details: [
      {
        category: 'Fleet Types',
        sources: [
          { name: 'Delivery Vans', amount: '20' },
          { name: 'Company Cars', amount: '15' },
          { name: 'Forklifts & Machinery', amount: '10' }
        ]
      }
    ]
  },
  {
    icon: '⚡',
    title: 'Purchased Electricity',
    subtitle: 'Grid electricity consumption and renewable energy',
    value: '12',
    unit: 'Meters',
    quality: '98%',
    lastUpdate: '15 min ago',
    change: '▲ 1 new meter',
    changeType: 'increase',
    progress: 92,
    details: [
      {
        category: 'Energy Source Breakdown',
        sources: [
          { name: 'Grid Electricity', amount: '70%' },
          { name: 'Solar Panels', amount: '20%' },
          { name: 'Wind Power', amount: '10%' }
        ]
      }
    ]
  },
  {
    icon: '📦',
    title: 'Purchased Goods & Services',
    subtitle: 'Supply chain emissions from procurement',
    value: '156',
    unit: 'Suppliers',
    quality: '87%',
    lastUpdate: '2 hours ago',
    change: '▲ 10 suppliers added',
    changeType: 'increase',
    progress: 67,
    details: [
      {
        category: 'Top Categories',
        sources: [
          { name: 'Packaging Materials', amount: '48 suppliers' },
          { name: 'Machinery & Equipment', amount: '36 suppliers' },
          { name: 'Office Supplies', amount: '24 suppliers' }
        ]
      }
    ]
  },
  {
    icon: '💨',
    title: 'Fugitive Emissions',
    subtitle: 'Unintentional leaks from equipment and processes',
    value: '67',
    unit: 'Components',
    quality: '94%',
    lastUpdate: '45 min ago',
    change: '▲ 5 leak sources detected',
    changeType: 'increase',
    progress: 73,
    details: [
      {
        category: 'Leak Sources',
        sources: [
          { name: 'Valves & Fittings', amount: '24 points' },
          { name: 'Pipelines', amount: '18 points' },
          { name: 'Compressor Seals', amount: '25 points' }
        ]
      }
    ]
  },
  {
    icon: '❄️',
    title: 'Refrigerant Emissions',
    subtitle: 'HVAC systems, cooling equipment and refrigeration',
    value: '34',
    unit: 'Systems',
    quality: '91%',
    lastUpdate: '1.5 hours ago',
    change: '▼ 1 system removed',
    changeType: 'decrease',
    progress: 81,
    details: [
      {
        category: 'System Types',
        sources: [
          { name: 'Commercial HVAC', amount: '14' },
          { name: 'Cold Storage Units', amount: '12' },
          { name: 'Data Center Cooling', amount: '8' }
        ]
      }
    ]
  }
];

const dataTableRows = [
  {
    timestamp: 'Mar 20, 2025 14:30', source: 'Electricity Meter #12', type: 'kWh Consumption', value: '2,847 kWh', score: '98.5%', status: 'Validated'
  },
  {
    timestamp: 'Mar 20, 2025 14:15', source: 'Boiler B-2', type: 'Natural Gas', value: '456 m³', score: '96.2%', status: 'Validated'
  },
  {
    timestamp: 'Mar 20, 2025 14:00', source: 'Vehicle Fleet', type: 'Fuel Consumption', value: '234 L', score: '94.7%', status: 'Processing'
  },
  {
    timestamp: 'Mar 20, 2025 13:45', source: 'AC System #3', type: 'Refrigerant Leak', value: '0.12 kg', score: '92.1%', status: 'Review'
  }
];

export default function DataCollectionSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);

  const openModal = (metric: any) => {
      setSelectedMetric(metric);
      setModalOpen(true);
  };
  return (
    <div className="space-y-10">
      {/* Header */}
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((m, i) => (
          <div
            key={i}
            onClick={() => openModal(m)}
            className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">{m.label}</div>
                <div className="text-3xl font-bold text-green-800 mb-2">{m.value}</div>
                <div className="text-sm text-green-800 mb-2">{m.change}</div>
                <div className="text-xs text-green-800 opacity-60">{m.subtitle}</div>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                {m.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      <MetricsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedMetric={selectedMetric}
      />

      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((src, i) => (
          <div
            key={i}
            onClick={() => openModal(src)}
            className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">{src.icon}</div>
              <div>
                <h4 className="font-semibold text-green-800">{src.title}</h4>
                <div className="text-xs text-green-800 opacity-60">{src.subtitle}</div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="text-2xl font-bold text-green-800">{src.value}</div>
              <div className="text-sm text-green-800 opacity-60">{src.unit}</div>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-green-800 transition-all duration-1000"
                style={{ width: src.quality }}
              ></div>
            </div>
            <div className="text-xs text-green-800 opacity-70 mb-3">
              Data Quality: {src.quality} | Last Update: {src.lastUpdate}
            </div>
            <button className="w-full  cursor-pointer bg-green-800 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
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
                {['Timestamp', 'Source', 'Data Type', 'Value', 'Quality Score', 'Status'].map((head) => (
                  <th key={head} className="px-6 py-4 text-left text-sm font-semibold text-green-800">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataTableRows.map((row, i) => (
                <tr key={i} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-green-800">{row.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.source}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.type}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.value}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{row.score}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border border-green-800 
                      ${row.status === 'Validated' ? 'bg-green-100 text-green-800' : 'bg-white text-green-800 opacity-70'}`}>
                      {row.status}
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
