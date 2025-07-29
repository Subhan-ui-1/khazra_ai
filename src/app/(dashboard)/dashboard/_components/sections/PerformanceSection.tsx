'use client';

export default function PerformanceSection() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Performance Analytics
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Comprehensive performance tracking and analytics for sustainability initiatives, including trend analysis, 
          benchmarking, predictive insights, and strategic recommendations for continuous improvement.
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Overall Performance
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">91.5</div>
              <div className="text-sm text-green-800 mb-2">▲ 3.2% vs last quarter</div>
              <div className="text-xs text-green-800 opacity-60">
                Composite score • Industry leading
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              📊
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '91.5%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Target Achievement
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">82.4%</div>
              <div className="text-sm text-green-800 mb-2">▲ 8.3% this quarter</div>
              <div className="text-xs text-green-800 opacity-60">
                SBTi targets • On track for 2025
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🎯
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '82.4%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Efficiency Score
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">87.3</div>
              <div className="text-sm text-green-800 mb-2">▲ 5.1% vs baseline</div>
              <div className="text-xs text-green-800 opacity-60">
                Resource optimization • Top quartile
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ⚡
            </div>
          </div>
          <div className="h-10 relative">
            <svg width="100%" height="40" viewBox="0 0 200 40" className="absolute inset-0">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green-800"
                points="0,30 20,28 40,25 60,22 80,18 100,15 120,12 140,10 160,8 180,6 200,5"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Innovation Index
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">94.8</div>
              <div className="text-sm text-green-800 mb-2">▲ 12.7% vs last year</div>
              <div className="text-xs text-green-800 opacity-60">
                Technology adoption • Industry leader
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              💡
            </div>
          </div>
          <div className="h-10 relative">
            <svg width="100%" height="40" viewBox="0 0 200 40" className="absolute inset-0">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green-800"
                points="0,35 20,30 40,25 60,20 80,15 100,10 120,8 140,6 160,5 180,4 200,3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📈 Performance Trends (12 Months)
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md">Overall</button>
              <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-200 rounded-md hover:bg-green-50">Targets</button>
              <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-200 rounded-md hover:bg-green-50">Efficiency</button>
            </div>
          </div>
          <div className="h-80 relative">
            <svg viewBox="0 0 400 200" className="w-full h-full">
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
                points="20,120 60,115 100,110 140,105 180,100 220,95 260,90 300,85 340,80 380,75"
              />
              
              {/* Target Achievement */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="2"
                opacity="0.7"
                points="20,140 60,135 100,130 140,125 180,120 220,115 260,110 300,105 340,100 380,95"
              />
              
              {/* Efficiency Score */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="2"
                opacity="0.5"
                points="20,160 60,155 100,150 140,145 180,140 220,135 260,130 300,125 340,120 380,115"
              />
              
              {/* Data points */}
              <circle cx="380" cy="75" r="4" fill="#0f5744" />
              <circle cx="380" cy="95" r="3" fill="#0f5744" opacity="0.7" />
              <circle cx="380" cy="115" r="3" fill="#0f5744" opacity="0.5" />
              
              {/* Labels */}
              <text x="20" y="190" fontSize="10" fill="#0f5744">Jan</text>
              <text x="100" y="190" fontSize="10" fill="#0f5744">Apr</text>
              <text x="180" y="190" fontSize="10" fill="#0f5744">Jul</text>
              <text x="260" y="190" fontSize="10" fill="#0f5744">Oct</text>
              <text x="340" y="190" fontSize="10" fill="#0f5744">Dec</text>
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
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <div className="font-semibold text-green-800">Your Company</div>
                  <div className="text-xs text-green-800 opacity-70">91.5 points</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-green-800">Top 1%</div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <div className="font-semibold text-green-800">Industry Average</div>
                  <div className="text-xs text-green-800 opacity-70">67.3 points</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-green-800">+24.2</div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <div className="font-semibold text-green-800">Sector Leader</div>
                  <div className="text-xs text-green-800 opacity-70">89.2 points</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-green-800">+2.3</div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <div className="font-semibold text-green-800">Global Average</div>
                  <div className="text-xs text-green-800 opacity-70">58.7 points</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-green-800">+32.8</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🌍
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Environmental Performance</h4>
              <div className="text-xs text-green-800 opacity-60">Emissions, energy, waste</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">94.2</div>
            <div className="text-sm text-green-800 opacity-60">Score</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '94.2%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            ▲ 5.3% vs last quarter • Top performer
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              💰
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Financial Performance</h4>
              <div className="text-xs text-green-800 opacity-60">Cost savings, ROI</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">88.7</div>
            <div className="text-sm text-green-800 opacity-60">Score</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '88.7%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            ▲ 3.1% vs last quarter • 285% ROI
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🚀
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Operational Excellence</h4>
              <div className="text-xs text-green-800 opacity-60">Efficiency, productivity</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">92.4</div>
            <div className="text-sm text-green-800 opacity-60">Score</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '92.4%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            ▲ 4.2% vs last quarter • 30% efficiency gain
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Goal Achievement</h4>
              <div className="text-xs text-green-800 opacity-60">Target completion</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">85.6</div>
            <div className="text-sm text-green-800 opacity-60">Score</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '85.6%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            ▲ 7.8% vs last quarter • 6/8 targets on track
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              📊
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Data Quality</h4>
              <div className="text-xs text-green-800 opacity-60">Accuracy, completeness</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">96.8</div>
            <div className="text-sm text-green-800 opacity-60">Score</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '96.8%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            ▲ 2.1% vs last quarter • Third-party verified
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🔮
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Innovation Index</h4>
              <div className="text-xs text-green-800 opacity-60">Technology adoption</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-bold text-green-800">94.8</div>
            <div className="text-sm text-green-800 opacity-60">Score</div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '94.8%' }}></div>
          </div>
          <div className="text-xs text-green-800 opacity-70">
            ▲ 12.7% vs last year • Industry leader
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            💡 Performance Insights & Recommendations
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-3">🎯 Key Achievements</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Exceeded SBTi targets by 8.3% this quarter</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Achieved 285% ROI on sustainability investments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Improved energy efficiency by 30% year-over-year</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Reached 96.8% data quality score (industry leading)</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-3">🚀 Opportunities</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Expand renewable energy portfolio to 100% by 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Implement AI-driven predictive analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Enhance supply chain engagement program</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Develop circular economy initiatives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Data Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Performance Metrics Detail</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Export
            </button>
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Metric</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Current Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Target</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Trend</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Overall Performance Score</td>
                <td className="px-6 py-4 text-sm text-green-800">91.5</td>
                <td className="px-6 py-4 text-sm text-green-800">90.0</td>
                <td className="px-6 py-4 text-sm text-green-800">101.7%</td>
                <td className="px-6 py-4 text-sm text-green-800">▲ +3.2%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Exceeded
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Target Achievement Rate</td>
                <td className="px-6 py-4 text-sm text-green-800">82.4%</td>
                <td className="px-6 py-4 text-sm text-green-800">80.0%</td>
                <td className="px-6 py-4 text-sm text-green-800">103.0%</td>
                <td className="px-6 py-4 text-sm text-green-800">▲ +8.3%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    On Track
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Efficiency Score</td>
                <td className="px-6 py-4 text-sm text-green-800">87.3</td>
                <td className="px-6 py-4 text-sm text-green-800">85.0</td>
                <td className="px-6 py-4 text-sm text-green-800">102.7%</td>
                <td className="px-6 py-4 text-sm text-green-800">▲ +5.1%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Exceeded
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Innovation Index</td>
                <td className="px-6 py-4 text-sm text-green-800">94.8</td>
                <td className="px-6 py-4 text-sm text-green-800">90.0</td>
                <td className="px-6 py-4 text-sm text-green-800">105.3%</td>
                <td className="px-6 py-4 text-sm text-green-800">▲ +12.7%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Leading
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