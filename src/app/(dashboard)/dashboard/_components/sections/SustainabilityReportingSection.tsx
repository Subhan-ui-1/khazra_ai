'use client';

export default function SustainabilityReportingSection() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Sustainability Reporting
        </h1>
        <p className="text-green-800 opacity-70 max-w-4xl leading-relaxed">
          Comprehensive sustainability disclosure management aligned with ISSB, CDP, GRI, and TCFD frameworks.
          Monitor compliance status and export ready-to-submit reports for regulatory and stakeholder requirements.
        </p>
      </div>

      {/* Reporting Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Overall Compliance
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">94.2%</div>
              <div className="text-sm text-green-800 mb-2">▲ 3.1% vs last quarter</div>
              <div className="text-xs text-green-800 opacity-60">
                Framework alignment • Industry leading
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              📋
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '94.2%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Reports Generated
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">12</div>
              <div className="text-sm text-green-800 mb-2">This quarter</div>
              <div className="text-xs text-green-800 opacity-60">
                Automated reports • 100% accuracy
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              📊
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
                Data Quality Score
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">96.8%</div>
              <div className="text-sm text-green-800 mb-2">▲ 2.1% vs baseline</div>
              <div className="text-xs text-green-800 opacity-60">
                Third-party verified • Audit ready
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              ✅
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '96.8%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-green-800 opacity-70 uppercase tracking-wider mb-2">
                Submission Status
              </div>
              <div className="text-3xl font-bold text-green-800 mb-2">8/8</div>
              <div className="text-sm text-green-800 mb-2">On time</div>
              <div className="text-xs text-green-800 opacity-60">
                All frameworks • No delays
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              🎯
            </div>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 transition-all duration-1000" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Framework Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📊 Framework Compliance Status
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-800 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  ISSB
                </div>
                <div>
                  <div className="font-semibold text-green-800">ISSB Standards</div>
                  <div className="text-xs text-green-800 opacity-70">IFRS S1 & S2 Compliance</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-800">98.4%</div>
                <div className="text-xs text-green-800 opacity-70">Compliant</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-white border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-800 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  CDP
                </div>
                <div>
                  <div className="font-semibold text-green-800">CDP Climate</div>
                  <div className="text-xs text-green-800 opacity-70">Carbon Disclosure Project</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-800">96.7%</div>
                <div className="text-xs text-green-800 opacity-70">A- Rating</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-white border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-800 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  GRI
                </div>
                <div>
                  <div className="font-semibold text-green-800">GRI Standards</div>
                  <div className="text-xs text-green-800 opacity-70">Global Reporting Initiative</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-800">92.1%</div>
                <div className="text-xs text-green-800 opacity-70">Core Option</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-white border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-800 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  TCFD
                </div>
                <div>
                  <div className="font-semibold text-green-800">TCFD Alignment</div>
                  <div className="text-xs text-green-800 opacity-70">Task Force on Climate Disclosure</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-800">89.5%</div>
                <div className="text-xs text-green-800 opacity-70">Advanced</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              📈 Reporting Trends
            </h3>
          </div>
          <div className="h-80 relative">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <defs>
                <pattern id="reportingGrid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e4f5d5" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#reportingGrid)" />
              
              {/* Compliance Score */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="3"
                points="20,120 60,115 100,110 140,105 180,100 220,95 260,90 300,85 340,80 380,75"
              />
              
              {/* Data Quality */}
              <polyline
                fill="none"
                stroke="#0f5744"
                strokeWidth="2"
                opacity="0.7"
                points="20,140 60,135 100,130 140,125 180,120 220,115 260,110 300,105 340,100 380,95"
              />
              
              {/* Data points */}
              <circle cx="380" cy="75" r="4" fill="#0f5744" />
              <circle cx="380" cy="95" r="3" fill="#0f5744" opacity="0.7" />
              
              {/* Labels */}
              <text x="20" y="190" fontSize="10" fill="#0f5744">Q1</text>
              <text x="100" y="190" fontSize="10" fill="#0f5744">Q2</text>
              <text x="180" y="190" fontSize="10" fill="#0f5744">Q3</text>
              <text x="260" y="190" fontSize="10" fill="#0f5744">Q4</text>
              <text x="340" y="190" fontSize="10" fill="#0f5744">Q1</text>
            </svg>
          </div>
          <div className="flex gap-5 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
              <span className="text-sm text-green-800">Compliance Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-800 rounded-sm opacity-70"></div>
              <span className="text-sm text-green-800">Data Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            📄 Report Generation & Management
          </h3>
          <button className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            Generate New Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-green-100 rounded-lg p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-sm">
                📊
              </div>
              <div className="font-semibold text-green-800">Annual Sustainability Report</div>
            </div>
            <div className="text-sm text-green-800 opacity-70 mb-3">
              Comprehensive ESG performance overview
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-green-800 opacity-60">Last updated: Dec 2024</div>
              <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors">
                Download
              </button>
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-sm">
                🌍
              </div>
              <div className="font-semibold text-green-800">CDP Climate Response</div>
            </div>
            <div className="text-sm text-green-800 opacity-70 mb-3">
              Carbon disclosure project submission
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-green-800 opacity-60">Status: Submitted</div>
              <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-sm">
                ⚖️
              </div>
              <div className="font-semibold text-green-800">TCFD Report</div>
            </div>
            <div className="text-sm text-green-800 opacity-70 mb-3">
              Climate-related financial disclosures
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-green-800 opacity-60">Due: Mar 2025</div>
              <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors">
                Preview
              </button>
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-sm">
                📈
              </div>
              <div className="font-semibold text-green-800">Quarterly ESG Update</div>
            </div>
            <div className="text-sm text-green-800 opacity-70 mb-3">
              Q4 2024 performance summary
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-green-800 opacity-60">Generated: Jan 2025</div>
              <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors">
                Download
              </button>
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-sm">
                🎯
              </div>
              <div className="font-semibold text-green-800">SBTi Progress Report</div>
            </div>
            <div className="text-sm text-green-800 opacity-70 mb-3">
              Science-based targets validation
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-green-800 opacity-60">Status: Validated</div>
              <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors">
                View
              </button>
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-sm">
                📋
              </div>
              <div className="font-semibold text-green-800">GRI Index</div>
            </div>
            <div className="text-sm text-green-800 opacity-70 mb-3">
              Global reporting initiative compliance
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-green-800 opacity-60">Updated: Dec 2024</div>
              <button className="px-3 py-1 text-xs bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Monitoring */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            🔍 Compliance Monitoring & Alerts
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-3">✅ Compliance Status</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>ISSB S1 & S2: 98.4% compliant (industry leading)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>CDP Climate: A- rating achieved (top tier)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>GRI Standards: Core option fully implemented</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>TCFD: Advanced alignment with all pillars</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-3">⚠️ Upcoming Deadlines</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>TCFD Report submission: March 15, 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>CDP Climate response: April 30, 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>Annual sustainability report: June 30, 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-800 mt-1">•</span>
                <span>SBTi validation renewal: December 2025</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reporting Data Table */}
      <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-green-800">Reporting Framework Details</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-green-800 bg-white border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Export Data
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Framework</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Compliance Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Last Submission</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Next Due</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Rating/Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">ISSB S1 & S2</td>
                <td className="px-6 py-4 text-sm text-green-800">98.4%</td>
                <td className="px-6 py-4 text-sm text-green-800">Dec 15, 2024</td>
                <td className="px-6 py-4 text-sm text-green-800">Dec 15, 2025</td>
                <td className="px-6 py-4 text-sm text-green-800">Industry Leading</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Compliant
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">CDP Climate</td>
                <td className="px-6 py-4 text-sm text-green-800">96.7%</td>
                <td className="px-6 py-4 text-sm text-green-800">Jul 31, 2024</td>
                <td className="px-6 py-4 text-sm text-green-800">Jul 31, 2025</td>
                <td className="px-6 py-4 text-sm text-green-800">A- Rating</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Submitted
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">GRI Standards</td>
                <td className="px-6 py-4 text-sm text-green-800">92.1%</td>
                <td className="px-6 py-4 text-sm text-green-800">Jun 30, 2024</td>
                <td className="px-6 py-4 text-sm text-green-800">Jun 30, 2025</td>
                <td className="px-6 py-4 text-sm text-green-800">Core Option</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-800">
                    Compliant
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-green-800">TCFD</td>
                <td className="px-6 py-4 text-sm text-green-800">89.5%</td>
                <td className="px-6 py-4 text-sm text-green-800">Mar 15, 2024</td>
                <td className="px-6 py-4 text-sm text-green-800">Mar 15, 2025</td>
                <td className="px-6 py-4 text-sm text-green-800">Advanced</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-800">
                    Due Soon
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