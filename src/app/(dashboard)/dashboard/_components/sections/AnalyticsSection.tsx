'use client';

import { useState } from 'react';

export default function AnalyticsSection() {
  const [activeChart, setActiveChart] = useState('overall');

  // Dynamic data arrays for Analytics charts
  const performanceTrendsData = [
    { month: 'Jan', overall: 88.3, targets: 74.1, efficiency: 82.2 },
    { month: 'Feb', overall: 89.1, targets: 75.8, efficiency: 83.5 },
    { month: 'Mar', overall: 89.7, targets: 77.2, efficiency: 84.8 },
    { month: 'Apr', overall: 90.2, targets: 78.5, efficiency: 85.3 },
    { month: 'May', overall: 90.8, targets: 79.8, efficiency: 86.1 },
    { month: 'Jun', overall: 91.2, targets: 80.4, efficiency: 86.7 },
    { month: 'Jul', overall: 91.5, targets: 81.1, efficiency: 87.2 },
    { month: 'Aug', overall: 91.8, targets: 81.7, efficiency: 87.6 },
    { month: 'Sep', overall: 92.1, targets: 82.1, efficiency: 88.1 },
    { month: 'Oct', overall: 92.4, targets: 82.4, efficiency: 88.5 },
    { month: 'Nov', overall: 92.7, targets: 82.8, efficiency: 88.9 },
    { month: 'Dec', overall: 93.0, targets: 83.2, efficiency: 89.3 }
  ];

  const benchmarkingData = [
    {
      rank: 1,
      name: 'Your Company',
      score: 91.5,
      status: 'Top 1%',
      difference: null,
      isCurrent: true
    },
    {
      rank: 2,
      name: 'Industry Average',
      score: 67.3,
      status: 'Baseline',
      difference: '+24.2',
      isCurrent: false
    },
    {
      rank: 3,
      name: 'Sector Leader',
      score: 89.2,
      status: 'Competitor',
      difference: '+2.3',
      isCurrent: false
    },
    {
      rank: 4,
      name: 'Global Average',
      score: 58.7,
      status: 'Market',
      difference: '+32.8',
      isCurrent: false
    }
  ];

  const kpiPerformanceData = [
    {
      id: 'environmental',
      title: 'Environmental Performance',
      subtitle: 'Emissions, energy, waste',
      score: 94.2,
      change: '+5.3%',
      changeType: 'increase',
      icon: '🌍',
      description: '▲ 5.3% vs last quarter • Top performer'
    },
    {
      id: 'financial',
      title: 'Financial Performance',
      subtitle: 'Cost savings, ROI',
      score: 88.7,
      change: '+3.1%',
      changeType: 'increase',
      icon: '💰',
      description: '▲ 3.1% vs last quarter • 285% ROI'
    },
    {
      id: 'operational',
      title: 'Operational Excellence',
      subtitle: 'Efficiency, productivity',
      score: 92.4,
      change: '+4.2%',
      changeType: 'increase',
      icon: '🚀',
      description: '▲ 4.2% vs last quarter • 30% efficiency gain'
    },
    {
      id: 'goals',
      title: 'Goal Achievement',
      subtitle: 'Target completion',
      score: 85.6,
      change: '+7.8%',
      changeType: 'increase',
      icon: '🎯',
      description: '▲ 7.8% vs last quarter • 6/8 targets on track'
    },
    {
      id: 'data-quality',
      title: 'Data Quality',
      subtitle: 'Accuracy, completeness',
      score: 96.8,
      change: '+2.1%',
      changeType: 'increase',
      icon: '📊',
      description: '▲ 2.1% vs last quarter • Third-party verified'
    },
    {
      id: 'innovation',
      title: 'Innovation Index',
      subtitle: 'Technology adoption',
      score: 94.8,
      change: '+12.7%',
      changeType: 'increase',
      icon: '🔮',
      description: '▲ 12.7% vs last year • Industry leader'
    }
  ];

  const insightsData = [
    {
      id: 'energy-optimization',
      title: 'Energy Optimization',
      icon: '⚡',
      description: 'AI analysis identified 23% energy savings potential through smart building automation',
      impact: 'Impact: $847K annual savings • 1,234 tCO₂e reduction'
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain Efficiency',
      icon: '🚚',
      description: 'Route optimization could reduce logistics emissions by 18% while improving delivery times',
      impact: 'Impact: $456K annual savings • 567 tCO₂e reduction'
    },
    {
      id: 'circular-economy',
      title: 'Circular Economy',
      icon: '🌱',
      description: 'Waste-to-resource initiatives could generate $234K revenue while reducing waste by 45%',
      impact: 'Impact: $234K revenue • 345 tCO₂e reduction'
    },
    {
      id: 'process-optimization',
      title: 'Process Optimization',
      icon: '🏭',
      description: 'Predictive maintenance could prevent 67% of equipment failures and reduce emissions by 12%',
      impact: 'Impact: $567K savings • 789 tCO₂e reduction'
    },
    {
      id: 'building-efficiency',
      title: 'Building Efficiency',
      icon: '🏢',
      description: 'Smart HVAC systems could reduce building energy consumption by 28% through AI optimization',
      impact: 'Impact: $678K savings • 456 tCO₂e reduction'
    },
    {
      id: 'data-driven',
      title: 'Data-Driven Decisions',
      icon: '📊',
      description: 'Real-time analytics could improve operational efficiency by 34% and reduce costs by 22%',
      impact: 'Impact: $1.2M savings • 890 tCO₂e reduction'
    }
  ];

  const riskAnalysisData = {
    highPriority: [
      {
        risk: 'Regulatory compliance changes',
        probability: 85,
        impact: 'High',
        description: 'Probability: 85%, Impact: High'
      },
      {
        risk: 'Supply chain disruption',
        probability: 45,
        impact: 'High',
        description: 'Probability: 45%, Impact: High'
      },
      {
        risk: 'Energy price volatility',
        probability: 67,
        impact: 'Medium',
        description: 'Probability: 67%, Impact: Medium'
      }
    ],
    mediumPriority: [
      {
        risk: 'Technology obsolescence',
        probability: 34,
        impact: 'Medium',
        description: 'Probability: 34%, Impact: Medium'
      },
      {
        risk: 'Reputation damage',
        probability: 23,
        impact: 'High',
        description: 'Probability: 23%, Impact: High'
      },
      {
        risk: 'Data security breach',
        probability: 12,
        impact: 'High',
        description: 'Probability: 12%, Impact: High'
      }
    ]
  };

  const analyticsMetricsData = [
    {
      category: 'Predictive Analytics',
      metric: 'Emissions Forecast',
      currentValue: '94.7%',
      target: '>90%',
      accuracy: '±2.3%',
      status: 'Exceeded'
    },
    {
      category: 'Cost Optimization',
      metric: 'Savings Identified',
      currentValue: '$2.4M',
      target: '>$1.5M',
      accuracy: '67% realized',
      status: 'On Track'
    },
    {
      category: 'Risk Management',
      metric: 'Risk Score',
      currentValue: '12.3',
      target: '<20',
      accuracy: 'Low risk',
      status: 'Excellent'
    },
    {
      category: 'Insights Generation',
      metric: 'Actionable Insights',
      currentValue: '247',
      target: '>200',
      accuracy: '89% implemented',
      status: 'Exceeded'
    }
  ];

  const metricsData = [
    {
      id: 'predictive-accuracy',
      title: 'Predictive Accuracy',
      value: '94.7%',
      change: '▲ 2.3%',
      changeType: 'increase',
      subtitle: 'AI model performance • Industry leading',
      icon: '🔮',
      progress: 94.7
    },
    {
      id: 'insights-generated',
      title: 'Insights Generated',
      value: '247',
      change: 'This quarter',
      changeType: 'neutral',
      subtitle: 'Actionable insights • 89% implemented',
      icon: '💡',
      trend: [180, 90, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345]
    },
    {
      id: 'cost-savings',
      title: 'Cost Savings Identified',
      value: '$2.4M',
      change: '▲ 18.7%',
      changeType: 'increase',
      subtitle: 'Optimization opportunities • 67% realized',
      icon: '💰',
      trend: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9]
    },
    {
      id: 'risk-score',
      title: 'Risk Score',
      value: '12.3',
      change: '▼ 8.4%',
      changeType: 'decrease',
      subtitle: 'Low risk • Excellent management',
      icon: '🛡️',
      progress: 12.3
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

  const maxValue = Math.max(...performanceTrendsData.map(d => Math.max(d.overall, d.targets, d.efficiency)));
  const chartWidth = 400;
  const chartHeight = 200;

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Analytics & Insights
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Advanced analytics and insights for sustainability performance, including predictive modeling, 
          scenario analysis, and strategic recommendations to drive continuous improvement and competitive advantage.
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <div key={metric.id} className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                  {metric.title}
                </div>
                <div className="text-3xl font-bold text-green-800 mb-2">{metric.value}</div>
                <div className={`text-sm text-green-800 mb-2 ${metric.changeType === 'increase' ? 'text-green-600' : metric.changeType === 'decrease' ? 'text-red-600' : 'text-green-800'}`}>
                  {metric.change} vs last month
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

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📈 Performance Trends (12 Months)
            </h3>
            <div className="flex gap-2">
              <button 
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'overall' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
                onClick={() => setActiveChart('overall')}
              >
                Overall
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'targets' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
                onClick={() => setActiveChart('targets')}
              >
                Targets
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeChart === 'efficiency' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
                onClick={() => setActiveChart('efficiency')}
              >
                Efficiency
              </button>
            </div>
          </div>
          <div className="h-80 relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
              <defs>
                <pattern id="trendGrid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e4f5d5" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#trendGrid)" />
              
              {/* Overall Performance */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="3"
                points={generateChartPoints(performanceTrendsData, 'overall', maxValue, chartHeight, chartWidth)}
              />
              
              {/* Target Achievement */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="2"
                opacity="0.7"
                points={generateChartPoints(performanceTrendsData, 'targets', maxValue, chartHeight, chartWidth)}
              />
              
              {/* Efficiency Score */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="2"
                opacity="0.5"
                points={generateChartPoints(performanceTrendsData, 'efficiency', maxValue, chartHeight, chartWidth)}
              />
              
              {/* Data points */}
              {performanceTrendsData.map((item, index) => {
                const x = (index / (performanceTrendsData.length - 1)) * chartWidth;
                const y1 = chartHeight - (item.overall / maxValue) * chartHeight;
                const y2 = chartHeight - (item.targets / maxValue) * chartHeight;
                const y3 = chartHeight - (item.efficiency / maxValue) * chartHeight;
                
                return (
                  <g key={index}>
                    <circle cx={x} cy={y1} r="3" fill="#0f5744" />
                    <circle cx={x} cy={y2} r="2" fill="#0f5744" opacity="0.7" />
                    <circle cx={x} cy={y3} r="2" fill="#0f5744" opacity="0.5" />
                  </g>
                );
              })}
              
              {/* Labels */}
              {performanceTrendsData.map((item, index) => {
                const x = (index / (performanceTrendsData.length - 1)) * chartWidth;
                return (
                  <text key={index} x={x} y={chartHeight + 15} fontSize="10" fill="#0f5744" textAnchor="middle">
                    {item.month}
                  </text>
                );
              })}
            </svg>
          </div>
          <div className="flex gap-5 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
              <span className="text-sm text-green-800">Overall Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-70"></div>
              <span className="text-sm text-green-800">Target Achievement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-50"></div>
              <span className="text-sm text-green-800">Efficiency Score</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              🏆 Industry Benchmarking
            </h3>
          </div>
          <div className="space-y-4">
            {benchmarkingData.map((item) => (
              <div key={item.rank} className={`flex justify-between items-center p-3 rounded-lg ${
                item.isCurrent ? 'bg-green-50' : 'bg-white border border-green-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    item.isCurrent ? 'bg-green-800 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {item.rank}
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">{item.name}</div>
                    <div className="text-xs text-green-800 opacity-70">{item.score} points</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-800">{item.status}</div>
                  {item.difference && (
                    <div className="text-xs text-green-800 opacity-70">{item.difference}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiPerformanceData.map((kpi) => (
          <div key={kpi.id} className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                {kpi.icon}
              </div>
              <div>
                <h4 className="font-semibold text-green-800">{kpi.title}</h4>
                <div className="text-xs text-green-800 opacity-60">{kpi.subtitle}</div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="text-2xl font-bold text-green-800">{kpi.score}</div>
              <div className="text-sm text-green-800 opacity-60">Score</div>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: `${kpi.score}%` }}></div>
            </div>
            <div className="text-xs text-green-800 opacity-70">
              {kpi.description}
            </div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            💡 Key Insights & Recommendations
          </h3>
          <div className="text-sm text-green-800 opacity-70">247 insights generated this quarter</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insightsData.map((insight) => (
            <div key={insight.id} className="bg-white border border-green-100 rounded-lg p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-sm">
                  {insight.icon}
                </div>
                <div className="font-semibold text-green-800">{insight.title}</div>
              </div>
              <div className="text-sm text-green-800 opacity-70 mb-3">
                {insight.description}
              </div>
              <div className="text-xs text-green-800 opacity-60">
                {insight.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            🛡️ Risk Analysis & Mitigation
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-3">🔴 High Priority Risks</h4>
            <ul className="space-y-2 text-sm text-green-800">
              {riskAnalysisData.highPriority.map((risk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{risk.risk} ({risk.description})</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-3">🟡 Medium Priority Risks</h4>
            <ul className="space-y-2 text-sm text-green-800">
              {riskAnalysisData.mediumPriority.map((risk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{risk.risk} ({risk.description})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Analytics Data Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Analytics Performance Metrics</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Analytics Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Metric</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Current Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Target</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Accuracy</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {analyticsMetricsData.map((metric, index) => (
                <tr key={index} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-green-800">{metric.category}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{metric.metric}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{metric.currentValue}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{metric.target}</td>
                  <td className="px-6 py-4 text-sm text-green-800">{metric.accuracy}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                      metric.status === 'Exceeded' 
                        ? 'bg-green-100 text-green-800 border-green-800'
                        : metric.status === 'Excellent'
                        ? 'bg-green-100 text-green-800 border-green-800'
                        : 'bg-green-100 text-green-800 border-green-800'
                    }`}>
                      {metric.status}
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