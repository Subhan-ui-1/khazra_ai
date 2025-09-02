'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import { useI18n } from '@/i18n/context';
import GlobalHeader from '@/components/GlobalHeader/GlobalHeader';
import BoundarySetupSteps from '../_components/sections/BoundarySetupSteps';
import GHGManage from '../_components/sections/GHGManage';
import AddEmissionSection from '../_components/sections/AddEmissionSection';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  completed?: boolean;
}

const steps: Step[] = [
  {
    id: 'boundary',
    title: 'Organizational Boundaries',
    description: 'Set up your organization boundaries and baseline information',
    icon: <Building2 className="w-5 h-5" />,
    component: BoundarySetupSteps,
  },
  {
    id: 'ghg',
    title: 'GHG Management',
    description: 'Define policies, training, and inventory practices for robust GHG governance',
    icon: <Shield className="w-5 h-5" />,
    component: GHGManage,
  },
  {
    id: 'emissions',
    title: 'Baseline & Reporting',
    description: 'Select baseline year, define reporting periods, and enter scope-wise data',
    icon: <TrendingUp className="w-5 h-5" />,
    component: AddEmissionSection,
  },
];

export default function StepsPage() {
  const { t, isRTL } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  const CurrentStepComponent = steps[currentStep].component;
  const completedCount = completedSteps.size;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader title="Setup Organization">
        <div className="ml-8">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
      </GlobalHeader>

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Organization Setup
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Configure your organization's boundaries, GHG management policies, and baseline emissions data to get started with your sustainability journey.
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Setup Progress: {completedCount} of {totalSteps} completed
              </span>
              <span className="text-sm font-medium text-gray-700">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#0D5942] h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Setup Steps - Top Left Corner */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            {/* Website Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#0D5942] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Setup Steps Title */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Setup Steps</h2>
              <p className="text-sm text-gray-600">Complete these steps to configure your organization</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const isCompleted = completedSteps.has(step.id);
                  const isCurrent = index === currentStep;

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      className={`w-full flex items-start space-x-3 p-4 rounded-xl transition-all duration-200 text-left ${
                        isCurrent
                          ? 'bg-[#0D5942] text-white shadow-md'
                          : isCompleted
                          ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className={`h-5 w-5 rounded-full border-2 ${
                            isCurrent ? 'border-white' : 'border-gray-400'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {step.icon}
                          <p className={`text-sm font-medium ${isCurrent ? 'text-white' : ''}`}>
                            {step.title}
                          </p>
                        </div>
                        <p className={`text-xs ${isCurrent ? 'text-white opacity-90' : 'text-gray-500'}`}>
                          {step.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Step Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  {steps[currentStep].icon}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {steps[currentStep].title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {steps[currentStep].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                <CurrentStepComponent
                  onComplete={() => handleStepComplete(steps[currentStep].id)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add Later Button - Fixed Bottom Right */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 font-medium hover:bg-gray-50"
          >
            <span>Add Later</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
