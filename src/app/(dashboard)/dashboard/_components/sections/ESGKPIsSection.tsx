'use client';

export default function ESGKPIsSection() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          ESG Key Performance Indicators
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Monitor and track Environmental, Social, and Governance performance indicators to ensure sustainable 
          business practices and stakeholder value creation across all operational areas.
        </p>
      </div>

      {/* ESG Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              🌍
            </div>
            <div>
              <div className="text-lg font-semibold text-green-800">Environmental</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-800 mb-2">87.2</div>
          <div className="text-sm text-green-800 mb-4">↑ 5.3% vs last quarter</div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '87.2%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <div className="text-lg font-semibold text-green-800">Social</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-800 mb-2">92.4</div>
          <div className="text-sm text-green-800 mb-4">↑ 2.1% vs last quarter</div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '92.4%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <div>
              <div className="text-lg font-semibold text-green-800">Governance</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-800 mb-2">94.8</div>
          <div className="text-sm text-green-800 mb-4">↑ 1.7% vs last quarter</div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '94.8%' }}></div>
          </div>
        </div>
      </div>

      {/* Environmental KPIs */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
            🌍 Environmental KPIs
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md">Current</button>
            <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-200 rounded-md hover:bg-green-50">Trend</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Carbon Emissions (Scope 1&2)</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">847.3</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &lt;850 tCO₂e</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '94%' }}></div>
            </div>
            <div className="text-xs text-green-800">↓ 12.4% vs baseline</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Renewable Energy Usage</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">89.7%</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &gt;85%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '89.7%' }}></div>
            </div>
            <div className="text-xs text-green-800">↑ 15.2% vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Water Usage Efficiency</div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">76.3%</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &gt;80%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '76.3%' }}></div>
            </div>
            <div className="text-xs text-green-800">↑ 3.1% vs last quarter</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Waste Diverted from Landfill</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">92.1%</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &gt;90%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '92.1%' }}></div>
            </div>
            <div className="text-xs text-green-800">↑ 7.8% vs last year</div>
          </div>
        </div>
      </div>

      {/* Social KPIs */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
            👥 Social KPIs
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md">Current</button>
            <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-200 rounded-md hover:bg-green-50">Trend</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Employee Satisfaction Score</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">4.6/5</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &gt;4.2</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '92%' }}></div>
            </div>
            <div className="text-xs text-green-800">↑ 0.3 vs last survey</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Gender Diversity (Leadership)</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">44.2%</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &gt;40%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '44.2%' }}></div>
            </div>
            <div className="text-xs text-green-800">↑ 8.5% vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Training Hours per Employee</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">42.3</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &gt;35 hours</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '85.6%' }}></div>
            </div>
            <div className="text-xs text-green-800">↑ 12.1% vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Safety Incident Rate</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">0.12</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &lt;0.5 per 100k hours</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '95%' }}></div>
            </div>
            <div className="text-xs text-green-800">↓ 67% vs industry avg</div>
          </div>
        </div>
      </div>

      {/* Governance KPIs */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
            ⚖️ Governance KPIs
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md">Current</button>
            <button className="px-3 py-1 text-xs bg-white text-green-800 border border-green-200 rounded-md hover:bg-green-50">Trend</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Board Independence</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">78.6%</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &gt;75%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '78.6%' }}></div>
            </div>
            <div className="text-xs text-green-800">Maintained vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Ethics Training Completion</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">99.2%</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &gt;95%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '99.2%' }}></div>
            </div>
            <div className="text-xs text-green-800">↑ 2.1% vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Data Privacy Compliance</div>
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">100%</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: 100%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '100%' }}></div>
            </div>
            <div className="text-xs text-green-800">No breaches reported</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-green-800">Audit Recommendations Closed</div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">87.3%</div>
            <div className="text-xs text-green-800 opacity-60 mb-2">Target: &gt;90%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '87.3%' }}></div>
            </div>
            <div className="text-xs text-green-800">↑ 5.2% vs last quarter</div>
          </div>
        </div>
      </div>

      {/* ESG Performance Summary */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            📊 ESG Performance Summary
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-3">🏆 Strengths</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Excellent governance score (94.8) with 100% data privacy compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Strong social performance (92.4) with high employee satisfaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Leading environmental initiatives with 89.7% renewable energy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Industry-leading safety record with 67% below average incident rate</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-3">🎯 Focus Areas</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Improve water usage efficiency (76.3% vs 80% target)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Close audit recommendations (87.3% vs 90% target)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Enhance board diversity beyond gender metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Expand circular economy initiatives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ESG Data Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">ESG Performance Metrics</div>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">ESG Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">KPI</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Current Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Target</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Trend</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Environmental</td>
                <td className="px-6 py-4 text-sm text-green-800">Carbon Emissions</td>
                <td className="px-6 py-4 text-sm text-green-800">847.3 tCO₂e</td>
                <td className="px-6 py-4 text-sm text-green-800">&lt;850 tCO₂e</td>
                <td className="px-6 py-4 text-sm text-green-800">94%</td>
                <td className="px-6 py-4 text-sm text-green-800">↓ 12.4%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    On Track
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Environmental</td>
                <td className="px-6 py-4 text-sm text-green-800">Renewable Energy</td>
                <td className="px-6 py-4 text-sm text-green-800">89.7%</td>
                <td className="px-6 py-4 text-sm text-green-800">&gt;85%</td>
                <td className="px-6 py-4 text-sm text-green-800">105.5%</td>
                <td className="px-6 py-4 text-sm text-green-800">↑ 15.2%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Exceeded
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Social</td>
                <td className="px-6 py-4 text-sm text-green-800">Employee Satisfaction</td>
                <td className="px-6 py-4 text-sm text-green-800">4.6/5</td>
                <td className="px-6 py-4 text-sm text-green-800">&gt;4.2</td>
                <td className="px-6 py-4 text-sm text-green-800">109.5%</td>
                <td className="px-6 py-4 text-sm text-green-800">↑ 0.3</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Exceeded
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">Governance</td>
                <td className="px-6 py-4 text-sm text-green-800">Data Privacy</td>
                <td className="px-6 py-4 text-sm text-green-800">100%</td>
                <td className="px-6 py-4 text-sm text-green-800">100%</td>
                <td className="px-6 py-4 text-sm text-green-800">100%</td>
                <td className="px-6 py-4 text-sm text-green-800">Maintained</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Achieved
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