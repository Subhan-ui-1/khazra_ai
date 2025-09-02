import React, { useState } from 'react';
import { Target, Globe, BarChart3, CheckCircle } from 'lucide-react';
import StepWizard, { Step } from './StepWizard';

// Example of how to integrate StepWizard with the existing target setting functionality
const StepWizardExample: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [targetData, setTargetData] = useState({
    targetCategory: '',
    methodology: '',
    targetType: '',
    ambitionLevel: '',
    scopeCoverage: {
      scope1: true,
      scope2: true,
      scope3: false,
    },
    geographicCoverage: '',
    baselineYear: 0,
    targetYear: 0,
    baselineEmissions: {
      scope1: 0,
      scope2: 0,
      total: 0,
    },
    targetValue: 0,
  });

  // Define steps configuration
  const steps: Step[] = [
    {
      id: 1,
      title: 'Target Strategy',
      description: 'Define your target approach and methodology',
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: 2,
      title: 'Scope & Coverage',
      description: 'Select emission scopes and coverage boundaries',
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: 3,
      title: 'Baseline & Targets',
      description: 'Set baseline data and target values',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 4,
      title: 'Review & Deploy',
      description: 'Review configuration and deploy target',
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  // Step validation function
  const validateStep = (step: number): boolean | string => {
    switch (step) {
      case 1:
        if (!targetData.targetCategory) return 'Please select a target category';
        if (!targetData.methodology) return 'Please select a methodology';
        if (!targetData.targetType) return 'Please select a target type';
        return true;
      
      case 2:
        if (!targetData.scopeCoverage.scope1 && !targetData.scopeCoverage.scope2) {
          return 'Please select at least one emission scope';
        }
        if (!targetData.geographicCoverage) return 'Please select geographic coverage';
        return true;
      
      case 3:
        if (!targetData.baselineYear) return 'Please select baseline year';
        if (!targetData.targetYear) return 'Please select target year';
        if (targetData.targetYear <= targetData.baselineYear) {
          return 'Target year must be after baseline year';
        }
        if (targetData.baselineEmissions.total <= 0) return 'Please enter baseline emissions';
        if (targetData.targetValue <= 0) return 'Please enter target value';
        return true;
      
      default:
        return true;
    }
  };

  // Handle step change
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  // Handle completion
  const handleComplete = () => {
    console.log('Target setup completed!', targetData);
    // Here you would typically:
    // 1. Submit the data to your API
    // 2. Show success message
    // 3. Redirect or reset the form
    alert('Target setup completed successfully!');
  };

  // Handle cancellation
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      setCurrentStep(1);
      setTargetData({
        targetCategory: '',
        methodology: '',
        targetType: '',
        ambitionLevel: '',
        scopeCoverage: { scope1: true, scope2: true, scope3: false },
        geographicCoverage: '',
        baselineYear: 0,
        targetYear: 0,
        baselineEmissions: { scope1: 0, scope2: 0, total: 0 },
        targetValue: 0,
      });
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Category *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'net_zero', label: 'Net Zero Commitment', desc: 'Achieve carbon neutrality' },
                  { value: 'custom', label: 'Custom Strategy', desc: 'Tailored approach for your business' },
                ].map((category) => (
                  <div
                    key={category.value}
                    onClick={() => setTargetData(prev => ({ ...prev, targetCategory: category.value }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      targetData.targetCategory === category.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{category.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{category.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Type *
                </label>
                <select
                  value={targetData.targetType}
                  onChange={(e) => setTargetData(prev => ({ ...prev, targetType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select target type</option>
                  <option value="absolute">Absolute Reduction</option>
                  <option value="intensity_revenue">Intensity per Revenue</option>
                  <option value="intensity_employee">Intensity per Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Methodology *
                </label>
                <select
                  value={targetData.methodology}
                  onChange={(e) => setTargetData(prev => ({ ...prev, methodology: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select methodology</option>
                  <option value="custom">Custom Methodology</option>
                  <option value="sectoral">Sectoral Best Practice</option>
                  <option value="regulatory">Regulatory Framework</option>
                  <option value="science_based">Science-Based Approach</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="scope1"
                    checked={targetData.scopeCoverage.scope1}
                    onChange={(e) => setTargetData(prev => ({
                      ...prev,
                      scopeCoverage: { ...prev.scopeCoverage, scope1: e.target.checked }
                    }))}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="scope1" className="font-medium text-orange-900">
                    Scope 1 - Direct Emissions
                  </label>
                </div>
                <p className="text-sm text-orange-700">
                  On-site combustion, company vehicles, process emissions
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="scope2"
                    checked={targetData.scopeCoverage.scope2}
                    onChange={(e) => setTargetData(prev => ({
                      ...prev,
                      scopeCoverage: { ...prev.scopeCoverage, scope2: e.target.checked }
                    }))}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="scope2" className="font-medium text-blue-900">
                    Scope 2 - Indirect Emissions
                  </label>
                </div>
                <p className="text-sm text-blue-700">
                  Purchased electricity, steam, heating & cooling
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geographic Coverage *
              </label>
              <select
                value={targetData.geographicCoverage}
                onChange={(e) => setTargetData(prev => ({ ...prev, geographicCoverage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select coverage</option>
                <option value="global">Global Operations</option>
                <option value="regional">Regional Operations</option>
                <option value="country">Country-Specific</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baseline Year *
                </label>
                <select
                  value={targetData.baselineYear}
                  onChange={(e) => setTargetData(prev => ({ ...prev, baselineYear: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select year</option>
                  {[2024, 2023, 2022, 2021, 2020].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Year *
                </label>
                <select
                  value={targetData.targetYear}
                  onChange={(e) => setTargetData(prev => ({ ...prev, targetYear: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select year</option>
                  {[2025, 2026, 2027, 2028, 2029, 2030, 2035, 2040, 2050].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {targetData.scopeCoverage.scope1 && (
                <div>
                  <label className="block text-sm text-orange-700 mb-1">Scope 1 Emissions</label>
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
                          total: value + prev.baselineEmissions.scope2,
                        },
                      }));
                    }}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>
              )}

              {targetData.scopeCoverage.scope2 && (
                <div>
                  <label className="block text-sm text-blue-700 mb-1">Scope 2 Emissions</label>
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
                          total: prev.baselineEmissions.scope1 + value,
                        },
                      }));
                    }}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700 mb-1">Total Baseline</label>
                <input
                  type="number"
                  value={targetData.baselineEmissions.total}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Emissions ({targetData.targetYear}) *
              </label>
              <input
                type="number"
                value={targetData.targetValue}
                onChange={(e) => setTargetData(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3">Target Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium text-gray-900 capitalize">
                    {targetData.targetCategory.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Methodology:</span>
                  <span className="ml-2 font-medium text-gray-900 capitalize">
                    {targetData.methodology.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Baseline:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {targetData.baselineEmissions.total.toLocaleString()} tCO₂e ({targetData.baselineYear})
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Target:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {targetData.targetValue.toLocaleString()} tCO₂e ({targetData.targetYear})
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-600">
              <p>Review your target configuration above. Click "Complete" to deploy your target.</p>
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carbon Target Setting
          </h1>
          <p className="text-gray-600">
            Set and manage your organization's carbon reduction targets
          </p>
        </div>

        <StepWizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onComplete={handleComplete}
          onCancel={handleCancel}
          stepContent={renderStepContent()}
          stepValidation={validateStep}
          showCancelButton={true}
          cancelButtonText="Reset Form"
          nextButtonText="Continue"
          completeButtonText="Deploy Target"
          className="bg-white rounded-lg shadow-lg p-6"
        />
      </div>
    </div>
  );
};

export default StepWizardExample;
