import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Target, TrendingDown, Calendar, DollarSign, CheckCircle, 
  AlertCircle, Plus, X, BarChart3, Settings, FileText, Calculator, 
  Globe, Factory, Zap, Truck, Building, AlertTriangle, Info, Award, 
  Shield, Users, Briefcase, Activity, LineChart, MapPin
} from 'lucide-react';

const FlexibleTargetPlatform = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [targetData, setTargetData] = useState({
    // Organization Info
    organizationName: 'Acme Corporation',
    industry: 'manufacturing',
    headquarters: 'United States',
    revenue: 500000000,
    employees: 2500,
    
    // Target Strategy
    targetCategory: 'voluntary', // voluntary, regulatory, net_zero, custom
    targetType: 'absolute', // absolute, intensity_revenue, intensity_employee, intensity_product
    methodology: 'custom', // custom, regulatory, sectoral, science_based
    ambitionLevel: 'moderate', // conservative, moderate, ambitious, transformational
    
    // Scope & Coverage
    scopeCoverage: {
      scope1: true,
      scope2: true,
      scope3: false,
      scope3Categories: []
    },
    geographicCoverage: 'global', // global, regional, country, facility
    businessCoverage: 100, // percentage of business operations
    
    // Baseline & Target
    baselineYear: 2022,
    baselineEmissions: {
      scope1: 45000,
      scope2: 32000,
      scope3: 0,
      total: 77000
    },
    targetYear: 2030,
    targetValue: 38500, // 50% reduction
    targetUnit: 'tCO2e',
    
    // Business Context
    intensityMetrics: {
      revenue: 500000000,
      employees: 2500,
      productUnits: 50000,
      floorArea: 150000
    },
    
    // Regulatory Context
    regulations: {
      euTaxonomy: false,
      csrd: false,
      cdp: true,
      tcfd: false,
      localRegulations: []
    },
    
    // Milestones & Verification
    milestones: [
      { year: 2025, target: 61600, description: '20% reduction' },
      { year: 2027, target: 46200, description: '40% reduction' }
    ],
    verificationRequired: false,
    verificationFrequency: 'annual'
  });

  const [initiatives, setInitiatives] = useState([
    {
      id: 1,
      name: 'LED Lighting Upgrade',
      category: 'energy_efficiency',
      priority: 'high',
      estimatedReduction: 2400,
      investmentCost: 150000,
      implementationYear: 2024,
      paybackPeriod: 2.1,
      feasibility: 'high'
    },
    {
      id: 2,
      name: 'Solar Installation',
      category: 'renewable_energy',
      priority: 'medium',
      estimatedReduction: 8500,
      investmentCost: 850000,
      implementationYear: 2025,
      paybackPeriod: 6.8,
      feasibility: 'medium'
    },
    {
      id: 3,
      name: 'Fleet Electrification',
      category: 'transportation',
      priority: 'medium',
      estimatedReduction: 3200,
      investmentCost: 420000,
      implementationYear: 2026,
      paybackPeriod: 8.2,
      feasibility: 'medium'
    }
  ]);

  const industries = [
    'agriculture', 'automotive', 'chemicals', 'construction', 'energy', 'financial_services',
    'food_beverage', 'healthcare', 'manufacturing', 'mining', 'oil_gas', 'retail', 
    'technology', 'telecommunications', 'transportation', 'utilities', 'real_estate'
  ];

  const targetCategories = [
    { value: 'voluntary', label: 'Voluntary Commitment', desc: 'Self-determined sustainability goals' },
    { value: 'regulatory', label: 'Regulatory Compliance', desc: 'Meet legal requirements' },
    { value: 'net_zero', label: 'Net Zero Commitment', desc: 'Achieve carbon neutrality' },
    { value: 'custom', label: 'Custom Strategy', desc: 'Tailored approach for your business' }
  ];

  const methodologies = [
    { value: 'custom', label: 'Custom Methodology', desc: 'Business-specific approach' },
    { value: 'sectoral', label: 'Sectoral Best Practice', desc: 'Industry benchmarks' },
    { value: 'regulatory', label: 'Regulatory Framework', desc: 'Government guidelines' },
    { value: 'science_based', label: 'Science-Based Approach', desc: 'Climate science aligned' }
  ];

  // Calculation Functions
  const calculateTargetMetrics = () => {
    const totalReduction = ((targetData.baselineEmissions.total - targetData.targetValue) / targetData.baselineEmissions.total) * 100;
    const years = targetData.targetYear - targetData.baselineYear;
    const annualReduction = totalReduction / years;
    
    return {
      totalReduction: totalReduction.toFixed(1),
      annualReduction: annualReduction.toFixed(1),
      absoluteReduction: (targetData.baselineEmissions.total - targetData.targetValue).toFixed(0),
      years
    };
  };

  const calculateIntensityMetrics = () => {
    const baseline = targetData.baselineEmissions.total;
    const target = targetData.targetValue;
    
    return {
      revenueIntensity: {
        baseline: (baseline / (targetData.intensityMetrics.revenue / 1000000)).toFixed(2),
        target: (target / (targetData.intensityMetrics.revenue / 1000000)).toFixed(2)
      },
      employeeIntensity: {
        baseline: (baseline / targetData.intensityMetrics.employees).toFixed(2),
        target: (target / targetData.intensityMetrics.employees).toFixed(2)
      }
    };
  };

  const assessTargetAmbition = () => {
    const metrics = calculateTargetMetrics();
    const annualRate = parseFloat(metrics.annualReduction);
    
    if (annualRate < 2) return { level: 'Conservative', color: 'orange', desc: 'Below industry average' };
    if (annualRate < 4) return { level: 'Moderate', color: 'blue', desc: 'Industry aligned' };
    if (annualRate < 6) return { level: 'Ambitious', color: 'green', desc: 'Above industry average' };
    return { level: 'Transformational', color: 'purple', desc: 'Leading edge' };
  };

  // Target Setup Form
  const TargetSetupForm = () => (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
              currentStep >= step ? 'bg-blue-600 text-white border-blue-600' : 
              currentStep === step ? 'bg-white text-blue-600 border-blue-600' :
              'bg-gray-100 text-gray-400 border-gray-300'
            }`}>
              {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
            </div>
            {step < 5 && <div className={`h-1 w-16 mx-3 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="grid grid-cols-5 gap-4 mb-8 text-center text-sm">
        <div className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Organization Profile
        </div>
        <div className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Target Strategy
        </div>
        <div className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Scope & Coverage
        </div>
        <div className={currentStep >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Baseline & Targets
        </div>
        <div className={currentStep >= 5 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Review & Deploy
        </div>
      </div>

      {/* Step 1: Organization Profile */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Building className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-900">Organization Profile</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Organization Name *</label>
                <input
                  type="text"
                  value={targetData.organizationName}
                  onChange={(e) => setTargetData(prev => ({...prev, organizationName: e.target.value}))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Industry *</label>
                <select
                  value={targetData.industry}
                  onChange={(e) => setTargetData(prev => ({...prev, industry: e.target.value}))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Headquarters</label>
                <input
                  type="text"
                  value={targetData.headquarters}
                  onChange={(e) => setTargetData(prev => ({...prev, headquarters: e.target.value}))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Country/Region"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Annual Revenue (USD)</label>
                <input
                  type="number"
                  value={targetData.revenue}
                  onChange={(e) => setTargetData(prev => ({...prev, revenue: parseFloat(e.target.value)}))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Number of Employees</label>
                <input
                  type="number"
                  value={targetData.employees}
                  onChange={(e) => setTargetData(prev => ({...prev, employees: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Regulatory Context */}
            <div className="mt-6">
              <h4 className="font-medium text-blue-900 mb-3">Regulatory & Reporting Context</h4>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { key: 'euTaxonomy', label: 'EU Taxonomy' },
                  { key: 'csrd', label: 'CSRD' },
                  { key: 'cdp', label: 'CDP' },
                  { key: 'tcfd', label: 'TCFD' }
                ].map((reg) => (
                  <div key={reg.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={reg.key}
                      checked={targetData.regulations[reg.key]}
                      onChange={(e) => setTargetData(prev => ({
                        ...prev,
                        regulations: {...prev.regulations, [reg.key]: e.target.checked}
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={reg.key} className="text-sm text-blue-700">{reg.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Target Strategy */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-purple-900">Target Strategy & Approach</h3>
            </div>
            
            {/* Target Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-700 mb-3">Target Category *</label>
              <div className="grid grid-cols-2 gap-4">
                {targetCategories.map((category) => (
                  <div
                    key={category.value}
                    onClick={() => setTargetData(prev => ({...prev, targetCategory: category.value}))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      targetData.targetCategory === category.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{category.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{category.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-700 mb-3">Methodology *</label>
              <div className="grid grid-cols-2 gap-4">
                {methodologies.map((method) => (
                  <div
                    key={method.value}
                    onClick={() => setTargetData(prev => ({...prev, methodology: method.value}))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      targetData.methodology === method.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{method.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{method.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Target Type *</label>
                <select
                  value={targetData.targetType}
                  onChange={(e) => setTargetData(prev => ({...prev, targetType: e.target.value}))}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="absolute">Absolute Reduction</option>
                  <option value="intensity_revenue">Intensity per Revenue</option>
                  <option value="intensity_employee">Intensity per Employee</option>
                  <option value="intensity_product">Intensity per Product</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Ambition Level</label>
                <select
                  value={targetData.ambitionLevel}
                  onChange={(e) => setTargetData(prev => ({...prev, ambitionLevel: e.target.value}))}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="conservative">Conservative (1-2% annual)</option>
                  <option value="moderate">Moderate (2-4% annual)</option>
                  <option value="ambitious">Ambitious (4-6% annual)</option>
                  <option value="transformational">Transformational (6%+ annual)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Scope & Coverage */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Scope Coverage & Boundaries</h3>
            </div>
            
            {/* Emission Scopes */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="scope1"
                    checked={targetData.scopeCoverage.scope1}
                    onChange={(e) => setTargetData(prev => ({
                      ...prev,
                      scopeCoverage: {...prev.scopeCoverage, scope1: e.target.checked}
                    }))}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <Factory className="w-5 h-5 text-orange-600" />
                  <label htmlFor="scope1" className="font-medium text-orange-900">Scope 1</label>
                </div>
                <p className="text-sm text-orange-700">Direct emissions from owned/controlled sources</p>
                <div className="mt-2 text-xs text-orange-600">
                  • On-site combustion<br/>
                  • Company vehicles<br/>
                  • Process emissions
                </div>
              </div>

              <div className="border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="scope2"
                    checked={targetData.scopeCoverage.scope2}
                    onChange={(e) => setTargetData(prev => ({
                      ...prev,
                      scopeCoverage: {...prev.scopeCoverage, scope2: e.target.checked}
                    }))}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Zap className="w-5 h-5 text-blue-600" />
                  <label htmlFor="scope2" className="font-medium text-blue-900">Scope 2</label>
                </div>
                <p className="text-sm text-blue-700">Indirect emissions from purchased energy</p>
                <div className="mt-2 text-xs text-blue-600">
                  • Purchased electricity<br/>
                  • Purchased steam<br/>
                  • Heating & cooling
                </div>
              </div>

              <div className="border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="scope3"
                    checked={targetData.scopeCoverage.scope3}
                    onChange={(e) => setTargetData(prev => ({
                      ...prev,
                      scopeCoverage: {...prev.scopeCoverage, scope3: e.target.checked}
                    }))}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Truck className="w-5 h-5 text-green-600" />
                  <label htmlFor="scope3" className="font-medium text-green-900">Scope 3</label>
                </div>
                <p className="text-sm text-green-700">Other indirect emissions in value chain</p>
                <div className="mt-2 text-xs text-green-600">
                  • Supply chain<br/>
                  • Business travel<br/>
                  • Product lifecycle
                </div>
              </div>
            </div>

            {/* Coverage Parameters */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Geographic Coverage</label>
                <select
                  value={targetData.geographicCoverage}
                  onChange={(e) => setTargetData(prev => ({...prev, geographicCoverage: e.target.value}))}
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="global">Global Operations</option>
                  <option value="regional">Regional Operations</option>
                  <option value="country">Country-Specific</option>
                  <option value="facility">Facility-Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Business Coverage (%)</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={targetData.businessCoverage}
                  onChange={(e) => setTargetData(prev => ({...prev, businessCoverage: parseInt(e.target.value)}))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-green-600 mt-1">
                  <span>50%</span>
                  <span className="font-medium">{targetData.businessCoverage}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Baseline & Targets */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-semibold text-indigo-900">Baseline Data & Target Setting</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-2">Baseline Year</label>
                <select
                  value={targetData.baselineYear}
                  onChange={(e) => setTargetData(prev => ({...prev, baselineYear: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-2">Target Year</label>
                <select
                  value={targetData.targetYear}
                  onChange={(e) => setTargetData(prev => ({...prev, targetYear: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2040, 2045, 2050].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Baseline Emissions */}
            <div className="mb-6">
              <h4 className="font-medium text-indigo-900 mb-3">Baseline Emissions (tCO₂e)</h4>
              <div className="grid grid-cols-4 gap-4">
                {targetData.scopeCoverage.scope1 && (
                  <div>
                    <label className="block text-sm text-orange-700 mb-1">Scope 1</label>
                    <input
                      type="number"
                      value={targetData.baselineEmissions.scope1}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setTargetData(prev => ({
                          ...prev,
                          baselineEmissions: {
                            ...prev.baselineEmissions,
                            scope1: value,
                            total: value + prev.baselineEmissions.scope2 + prev.baselineEmissions.scope3
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-orange-300 rounded-md focus:ring-orange-500"
                    />
                  </div>
                )}

                {targetData.scopeCoverage.scope2 && (
                  <div>
                    <label className="block text-sm text-blue-700 mb-1">Scope 2</label>
                    <input
                      type="number"
                      value={targetData.baselineEmissions.scope2}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setTargetData(prev => ({
                          ...prev,
                          baselineEmissions: {
                            ...prev.baselineEmissions,
                            scope2: value,
                            total: prev.baselineEmissions.scope1 + value + prev.baselineEmissions.scope3
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500"
                    />
                  </div>
                )}

                {targetData.scopeCoverage.scope3 && (
                  <div>
                    <label className="block text-sm text-green-700 mb-1">Scope 3</label>
                    <input
                      type="number"
                      value={targetData.baselineEmissions.scope3}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setTargetData(prev => ({
                          ...prev,
                          baselineEmissions: {
                            ...prev.baselineEmissions,
                            scope3: value,
                            total: prev.baselineEmissions.scope1 + prev.baselineEmissions.scope2 + value
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-green-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Total</label>
                  <input
                    type="number"
                    value={targetData.baselineEmissions.total}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Target Setting */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Target Emissions ({targetData.targetYear})
              </label>
              <input
                type="number"
                value={targetData.targetValue}
                onChange={(e) => setTargetData(prev => ({...prev, targetValue: parseFloat(e.target.value)}))}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Target Analysis */}
            {targetData.baselineEmissions.total && targetData.targetValue && (
              <div className="bg-white border border-indigo-200 rounded-lg p-6">
                <h4 className="font-medium text-indigo-900 mb-4">Target Analysis</h4>
                
                {(() => {
                  const metrics = calculateTargetMetrics();
                  const ambition = assessTargetAmbition();
                  const intensity = calculateIntensityMetrics();
                  
                  return (
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-700">{metrics.totalReduction}%</div>
                        <div className="text-sm text-indigo-600">Total Reduction</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-700">{metrics.annualReduction}%</div>
                        <div className="text-sm text-indigo-600">Annual Rate</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-${ambition.color}-700`}>{ambition.level}</div>
                        <div className="text-sm text-indigo-600">{ambition.desc}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 5: Review & Deploy */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900">Review & Deploy Target</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Target Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organization:</span>
                    <span className="font-medium">{targetData.organizationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{targetData.targetCategory.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Methodology:</span>
                    <span className="font-medium capitalize">{targetData.methodology.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{targetData.targetType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage:</span>
                    <span className="font-medium">{targetData.businessCoverage}% of operations</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Target Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Baseline ({targetData.baselineYear}):</span>
                    <span className="font-medium">{targetData.baselineEmissions.total.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target ({targetData.targetYear}):</span>
                    <span className="font-medium">{targetData.targetValue.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reduction:</span>
                    <span className="font-medium text-green-600">{calculateTargetMetrics().totalReduction}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Rate:</span>
                    <span className="font-medium text-blue-600">{calculateTargetMetrics().annualReduction}%/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ambition:</span>
                    <span className="font-medium text-purple-600">{assessTargetAmbition().level}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope Coverage Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Scope Coverage</h4>
              <div className="flex space-x-6">
                {targetData.scopeCoverage.scope1 && (
                  <div className="flex items-center space-x-2">
                    <Factory className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-medium">Scope 1</span>
                    <span className="text-sm text-gray-600">({targetData.baselineEmissions.scope1.toLocaleString()} tCO₂e)</span>
                  </div>
                )}
                {targetData.scopeCoverage.scope2 && (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Scope 2</span>
                    <span className="text-sm text-gray-600">({targetData.baselineEmissions.scope2.toLocaleString()} tCO₂e)</span>
                  </div>
                )}
                {targetData.scopeCoverage.scope3 && (
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-medium">Scope 3</span>
                    <span className="text-sm text-gray-600">({targetData.baselineEmissions.scope3.toLocaleString()} tCO₂e)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Previous</span>
        </button>
        
        {currentStep < 5 ? (
          <button
            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              alert('✅ Target Successfully Deployed!\n\nYour carbon reduction target has been configured and is ready for implementation.');
              setActiveTab('dashboard');
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Deploy Target</span>
          </button>
        )}
      </div>
    </div>
  );

  // Target Dashboard
  const TargetDashboard = () => {
    const metrics = calculateTargetMetrics();
    const ambition = assessTargetAmbition();
    const intensity = calculateIntensityMetrics();
    
    return (
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Target Progress</p>
                <p className="text-3xl font-bold text-blue-600">32%</p>
                <p className="text-xs text-gray-500 mt-1">On track</p>
              </div>
              <Target className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Emissions</p>
                <p className="text-3xl font-bold text-green-600">52.4k</p>
                <p className="text-xs text-gray-500 mt-1">tCO₂e (2024)</p>
              </div>
              <BarChart3 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Annual Reduction</p>
                <p className="text-3xl font-bold text-purple-600">{metrics.annualReduction}%</p>
                <p className="text-xs text-gray-500 mt-1">per year</p>
              </div>
              <TrendingDown className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ambition Level</p>
                <p className={`text-3xl font-bold text-${ambition.color}-600`}>{ambition.level.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 mt-1">{ambition.desc}</p>
              </div>
              <Award className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Target Trajectory */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emission Reduction Trajectory</h3>
          <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border border-blue-200">
            <div className="text-center text-gray-600">
              <LineChart className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-medium">Target Trajectory Visualization</p>
              <p className="text-sm mb-2">
                {targetData.baselineYear}: {targetData.baselineEmissions.total.toLocaleString()} tCO₂e → 
                {targetData.targetYear}: {targetData.targetValue.toLocaleString()} tCO₂e
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Total Reduction: {metrics.totalReduction}%</div>
                <div>Annual Rate: {metrics.annualReduction}%/year</div>
                <div>Strategy: {targetData.targetCategory.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Initiatives & Progress */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Reduction Initiatives</h4>
            <div className="space-y-4">
              {initiatives.slice(0, 3).map((initiative) => (
                <div key={initiative.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{initiative.name}</div>
                    <div className="text-sm text-gray-600 capitalize">{initiative.category.replace('_', ' ')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{initiative.estimatedReduction.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">tCO₂e</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Target Details</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Target Category:</span>
                <span className="font-medium capitalize">{targetData.targetCategory.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Methodology:</span>
                <span className="font-medium capitalize">{targetData.methodology.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Geographic Coverage:</span>
                <span className="font-medium capitalize">{targetData.geographicCoverage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Business Coverage:</span>
                <span className="font-medium">{targetData.businessCoverage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verification:</span>
                <span className="font-medium">{targetData.verificationRequired ? 'Required' : 'Optional'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Initiative Manager
  const InitiativeManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Reduction Initiatives Portfolio</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>Add Initiative</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Initiative</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reduction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feasibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {initiatives.map((initiative) => (
              <tr key={initiative.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{initiative.name}</div>
                  <div className="text-xs text-gray-500">Target: {initiative.implementationYear}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 capitalize">
                    {initiative.category.replace('_', ' ')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {initiative.estimatedReduction.toLocaleString()} tCO₂e
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    ${(initiative.investmentCost / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-gray-500">
                    {initiative.paybackPeriod}yr payback
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    initiative.priority === 'high' ? 'bg-red-100 text-red-700' :
                    initiative.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {initiative.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    initiative.feasibility === 'high' ? 'bg-green-100 text-green-700' :
                    initiative.feasibility === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {initiative.feasibility}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Khazra.ai</h1>
              <h2 className="text-lg text-gray-600">Flexible Carbon Target Setting Platform</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <Target className="w-5 h-5" />
              <span className="font-medium">Custom Targets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 mb-8 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={() => setActiveTab('setup')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'setup' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Target Setup</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'dashboard' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Target Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('initiatives')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'initiatives' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Initiatives</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[800px]">
        <div className="p-8">
          {activeTab === 'setup' && <TargetSetupForm />}
          {activeTab === 'dashboard' && <TargetDashboard />}
          {activeTab === 'initiatives' && <InitiativeManager />}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Flexible Carbon Target Setting Platform</p>
        <p className="mt-1">Powered by Khazra.ai Sustainability Intelligence</p>
      </div>
    </div>
  );
};

export default FlexibleTargetPlatform;