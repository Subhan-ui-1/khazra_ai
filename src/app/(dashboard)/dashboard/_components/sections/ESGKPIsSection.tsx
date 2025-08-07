'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Edit3, Trash2, Briefcase } from 'lucide-react';
import { getRequest, postRequest } from "@/utils/api";
import toast from "react-hot-toast";
import { safeLocalStorage } from '@/utils/localStorage';

export default function ESGKPIsSection() {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInitiativeForm, setShowInitiativeForm] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<any>(null);
  const [initiativeFormData, setInitiativeFormData] = useState({
    initiative: '',
    targetYear: 2026,
    category: 'energy efficiency',
    reduction: '',
    investment: '',
    priority: 'high',
    feasibility: 'high'
  });

  // API Functions
  const getToken = () => {
    const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
    return tokenData.accessToken;
  };

  // Fetch initiatives
  const fetchInitiatives = async () => {
    try {
      const response = await getRequest("initiatives/getInitiatives", getToken());
      if (response.success) {
        setInitiatives(response.initiatives || []);
      } else {
        // toast.error(response.message || "Failed to fetch initiatives");
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch initiatives");
    }
  };

  // Add initiative
  const addInitiative = async () => {
    if (!initiativeFormData.initiative || !initiativeFormData.reduction || !initiativeFormData.investment) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await postRequest(
        "initiatives/addInitiative",
        initiativeFormData,
        "Initiative added successfully",
        getToken(),
        "post"
      );

      if (response.success) {
        toast.success("Initiative added successfully");
        setShowInitiativeForm(false);
        setInitiativeFormData({
          initiative: '',
          targetYear: 2026,
          category: 'energy efficiency',
          reduction: '',
          investment: '',
          priority: 'high',
          feasibility: 'high'
        });
        await fetchInitiatives();
      } else {
        // toast.error(response.message || "Failed to add initiative");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to add initiative");
      console.log(error, 'error')
    } finally {
      setLoading(false);
    }
  };

  // Start editing initiative
  const startEditInitiative = (initiative: any) => {
    setEditingInitiative(initiative);
    setInitiativeFormData({
      initiative: initiative.initiative,
      targetYear: initiative.targetYear,
      category: initiative.category,
      reduction: initiative.reduction,
      investment: initiative.investment,
      priority: initiative.priority,
      feasibility: initiative.feasibility
    });
    setShowInitiativeForm(true);
  };

  // Load initiatives on component mount
  useEffect(() => {
    fetchInitiatives();
  }, []);

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6">
        <h1 className="text-3xl font-bold text-black mb-4">
          ESG Key Performance Indicators
        </h1>
        <p className="text-black opacity-70 max-w-4xl leading-relaxed">
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
              <div className="text-lg font-semibold text-black">Environmental</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-black mb-2">87.2</div>
          <div className="text-sm text-[#0D5942] mb-4">↑ 5.3% vs last quarter</div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '87.2%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <div className="text-lg font-semibold text-black">Social</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-black mb-2">92.4</div>
          <div className="text-sm text-[#0D5942] mb-4">↑ 2.1% vs last quarter</div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '92.4%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <div>
              <div className="text-lg font-semibold text-black">Governance</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-black mb-2">94.8</div>
          <div className="text-sm text-[#0D5942] mb-4">↑ 1.7% vs last quarter</div>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '94.8%' }}></div>
          </div>
        </div>
      </div>

      {/* Environmental KPIs */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h2 className="text-xl font-semibold text-black flex items-center gap-2">
            🌍 Environmental KPIs
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-[#0D5942] text-white rounded-md">Current</button>
            <button className="px-3 py-1 text-xs bg-white text-[#0D5942] border border-green-200 rounded-md hover:bg-green-50">Trend</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Carbon Emissions (Scope 1&2)</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">847.3</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &lt;850 tCO₂e</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '94%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">↓ 12.4% vs baseline</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Renewable Energy Usage</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">89.7%</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &gt;85%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '89.7%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">↑ 15.2% vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Water Usage Efficiency</div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">76.3%</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &gt;80%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '76.3%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">↑ 3.1% vs last quarter</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Waste Diverted from Landfill</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">92.1%</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &gt;90%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '92.1%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">↑ 7.8% vs last year</div>
          </div>
        </div>
      </div>

      {/* Social KPIs */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h2 className="text-xl font-semibold text-black flex items-center gap-2">
            👥 Social KPIs
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-[#0D5942] text-white rounded-md">Current</button>
            <button className="px-3 py-1 text-xs bg-white text-[#0D5942] border border-green-200 rounded-md hover:bg-green-50">Trend</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Employee Satisfaction Score</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">4.6/5</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &gt;4.2</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '92%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">↑ 0.3 vs last survey</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Gender Diversity (Leadership)</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">44.2%</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &gt;40%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '44.2%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">↑ 8.5% vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Training Hours per Employee</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">42.3</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &gt;35 hours</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '85.6%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">↑ 12.1% vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Safety Incident Rate</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">0.12</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &lt;0.5 per 100k hours</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '95%' }}></div>
            </div>
            <div className="text-xs text-black">↓ 67% vs industry avg</div>
          </div>
        </div>
      </div>

      {/* Governance KPIs */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h2 className="text-xl font-semibold text-black flex items-center gap-2">
            ⚖️ Governance KPIs
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-[#0D5942] text-white rounded-md">Current</button>
            <button className="px-3 py-1 text-xs bg-white text-[#0D5942] border border-green-200 rounded-md hover:bg-green-50">Trend</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Board Independence</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">78.6%</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &gt;75%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '78.6%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">Maintained vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Ethics Training Completion</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">99.2%</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &gt;95%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '99.2%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">↑ 2.1% vs last year</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Data Privacy Compliance</div>
              <div className="w-2 h-2 bg-[#0D5942] rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">100%</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: 100%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '100%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">No breaches reported</div>
          </div>

          <div className="bg-white border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-black">Audit Recommendations Closed</div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-black mb-1">87.3%</div>
            <div className="text-xs text-black opacity-60 mb-2">Target: &gt;90%</div>
            <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0D5942] transition-all duration-1000" style={{ width: '87.3%' }}></div>
            </div>
            <div className="text-xs text-[#0D5942]">↑ 5.2% vs last quarter</div>
          </div>
        </div>
      </div>

      {/* ESG Performance Summary */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-green-100 pb-4">
          <h3 className="text-lg font-semibold text-black flex items-center gap-2">
            📊 ESG Performance Summary
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-black mb-3">🏆 Strengths</h4>
            <ul className="space-y-2 text-sm text-black">
              <li className="flex items-start gap-2">
                <span className="text-black mt-1">•</span>
                <span>Excellent governance score (94.8) with 100% data privacy compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-1">•</span>
                <span>Strong social performance (92.4) with high employee satisfaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-1">•</span>
                <span>Leading environmental initiatives with 89.7% renewable energy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-1">•</span>
                <span>Industry-leading safety record with 67% below average incident rate</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-3">🎯 Focus Areas</h4>
            <ul className="space-y-2 text-sm text-black">
              <li className="flex items-start gap-2">
                <span className="text-black mt-1">•</span>
                <span>Improve water usage efficiency (76.3% vs 80% target)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-1">•</span>
                <span>Close audit recommendations (87.3% vs 90% target)</span>
              </li>
              <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                <span>Enhance board diversity beyond gender metrics</span>
              </li>
              <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                <span>Expand circular economy initiatives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ESG Data Table */}
      {/* <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-green-100">
          <div className="text-lg font-semibold text-[#0D5942]">ESG Performance Metrics</div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-[#0D5942] bg-white border border-[#0D5942] rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 bg-[#0D5942] text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5942]">ESG Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5942]">KPI</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5942]">Current Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5942]">Target</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5942]">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5942]">Trend</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5942]">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-[#0D5942]">Environmental</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">Carbon Emissions</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">847.3 tCO₂e</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">&lt;850 tCO₂e</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">94%</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">↓ 12.4%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-[#0D5942] rounded-full border border-[#0D5942]">
                    On Track
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-[#0D5942]">Environmental</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">Renewable Energy</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">89.7%</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">&gt;85%</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">105.5%</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">↑ 15.2%</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-[#0D5942] rounded-full border border-[#0D5942]">
                    Exceeded
                  </span>
                </td>
              </tr>
              <tr className="border-b border-green-100 hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-[#0D5942]">Social</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">Employee Satisfaction</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">4.6/5</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">&gt;4.2</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">109.5%</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">↑ 0.3</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-[#0D5942] rounded-full border border-[#0D5942]">
                    Exceeded
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-[#0D5942]">Governance</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">Data Privacy</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">100%</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">100%</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">100%</td>
                <td className="px-6 py-4 text-sm text-[#0D5942]">Maintained</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-[#0D5942] rounded-full border border-[#0D5942]">
                    Achieved
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Initiatives Section */}
      <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-black flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Sustainability Initiatives
          </h3>
          <button
            onClick={() => setShowInitiativeForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0D5942] text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Initiative</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Initiative
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Target Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reduction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Feasibility
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {initiatives.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">No initiatives yet</p>
                      <p className="text-sm">Add your first sustainability initiative to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                initiatives.map((initiative) => (
                  <tr key={initiative._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{initiative.initiative}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 capitalize">
                        {initiative.category.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{initiative.targetYear}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {initiative.reduction}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {initiative.investment}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-lg ${
                        initiative.priority === 'high' ? 'bg-red-100 text-red-700' :
                        initiative.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {initiative.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-lg ${
                        initiative.feasibility === 'high' ? 'bg-green-100 text-green-700' :
                        initiative.feasibility === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {initiative.feasibility}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditInitiative(initiative)}
                          className="text-green-600 hover:text-[#0D5942]"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                      </div>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Initiative Form Modal */}
      {showInitiativeForm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingInitiative ? 'Edit Initiative' : 'Add Initiative'}
              </h3>
              <button
                onClick={() => {
                  setShowInitiativeForm(false);
                  setEditingInitiative(null);
                  setInitiativeFormData({
                    initiative: '',
                    targetYear: 2026,
                    category: 'energy efficiency',
                    reduction: '',
                    investment: '',
                    priority: 'high',
                    feasibility: 'high'
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initiative Name *
                </label>
                <input
                  type="text"
                  value={initiativeFormData.initiative}
                  onChange={(e) => setInitiativeFormData(prev => ({ ...prev, initiative: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., LED Lighting Upgrade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Year
                </label>
                <select
                  value={initiativeFormData.targetYear}
                  onChange={(e) => setInitiativeFormData(prev => ({ ...prev, targetYear: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={initiativeFormData.category}
                  onChange={(e) => setInitiativeFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="energy efficiency">Energy Efficiency</option>
                  <option value="renewable energy">Renewable Energy</option>
                  <option value="transportation">Transportation</option>
                  <option value="waste management">Waste Management</option>
                  <option value="water conservation">Water Conservation</option>
                  <option value="process optimization">Process Optimization</option>
                  <option value="supply chain">Supply Chain</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reduction *
                </label>
                <input
                  type="text"
                  value={initiativeFormData.reduction}
                  onChange={(e) => setInitiativeFormData(prev => ({ ...prev, reduction: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 2,400 tCO₂e"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment *
                </label>
                <input
                  type="text"
                  value={initiativeFormData.investment}
                  onChange={(e) => setInitiativeFormData(prev => ({ ...prev, investment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., $150k"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={initiativeFormData.priority}
                  onChange={(e) => setInitiativeFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feasibility
                </label>
                <select
                  value={initiativeFormData.feasibility}
                  onChange={(e) => setInitiativeFormData(prev => ({ ...prev, feasibility: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => {
                  setShowInitiativeForm(false);
                  setEditingInitiative(null);
                  setInitiativeFormData({
                    initiative: '',
                    targetYear: 2026,
                    category: 'energy efficiency',
                    reduction: '',
                    investment: '',
                    priority: 'high',
                    feasibility: 'high'
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={addInitiative}
                disabled={loading || !initiativeFormData.initiative || !initiativeFormData.reduction || !initiativeFormData.investment}
                className="flex items-center space-x-2 px-4 py-2 bg-[#0D5942] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{loading ? 'Adding...' : (editingInitiative ? 'Update' : 'Add')} Initiative</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 