import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, AlertCircle } from 'lucide-react';

export interface Step {
  id: string | number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'pending' | 'active' | 'completed' | 'error';
  isOptional?: boolean;
  canSkip?: boolean;
}

export interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  onCancel?: () => void;
  showStepNumbers?: boolean;
  showProgressBar?: boolean;
  allowStepNavigation?: boolean;
  className?: string;
  stepContent: React.ReactNode;
  isLoading?: boolean;
  canProceed?: boolean;
  canGoBack?: boolean;
  nextButtonText?: string;
  backButtonText?: string;
  completeButtonText?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  stepValidation?: (step: number) => boolean | string;
  onStepValidation?: (step: number, isValid: boolean, error?: string) => void;
}

const StepWizard: React.FC<StepWizardProps> = ({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  onCancel,
  showStepNumbers = true,
  showProgressBar = true,
  allowStepNavigation = true,
  className = '',
  stepContent,
  isLoading = false,
  canProceed = true,
  canGoBack = true,
  nextButtonText = 'Next',
  backButtonText = 'Back',
  completeButtonText = 'Complete',
  showCancelButton = false,
  cancelButtonText = 'Cancel',
  stepValidation,
  onStepValidation,
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});
  const [touchedSteps, setTouchedSteps] = useState<Set<number>>(new Set());

  // Calculate progress percentage - handle edge cases for different step counts
  const getProgressPercentage = () => {
    if (steps.length <= 1) return 100;
    if (currentStep === 1) return 0;
    if (currentStep === steps.length) return 100;
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  const progressPercentage = getProgressPercentage();
  const currentStepData = steps[currentStep - 1];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  // Handle step navigation
  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }

    // Validate current step if validation function exists
    if (stepValidation) {
      const validationResult = stepValidation(currentStep);
      if (typeof validationResult === 'string') {
        // Validation failed with error message
        setValidationErrors(prev => ({ ...prev, [currentStep]: validationResult }));
        setTouchedSteps(prev => new Set([...prev, currentStep]));
        onStepValidation?.(currentStep, false, validationResult);
        return;
      } else if (!validationResult) {
        // Validation failed without error message
        setValidationErrors(prev => ({ ...prev, [currentStep]: 'This step requires attention before proceeding' }));
        setTouchedSteps(prev => new Set([...prev, currentStep]));
        onStepValidation?.(currentStep, false, 'This step requires attention before proceeding');
        return;
      }
    }

    // Clear validation error for current step
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentStep];
      return newErrors;
    });

    // Mark step as completed and move to next
    onStepValidation?.(currentStep, true);
    onStepChange(currentStep + 1);
  };

  const handleBack = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (!allowStepNavigation) return;
    
    // Allow navigation to completed steps or current step
    if (stepNumber <= currentStep || steps[stepNumber - 1].canSkip) {
      onStepChange(stepNumber);
    }
  };

  // Get step status
  const getStepStatus = (stepIndex: number): Step['status'] => {
    const stepNumber = stepIndex + 1;
    
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    if (validationErrors[stepNumber]) return 'error';
    return 'pending';
  };

  // Get step icon
  const getStepIcon = (step: Step, stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    
    if (step.icon) return step.icon;
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'active':
        return <Circle className="w-4 h-4 fill-current" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  // Get step styling
  const getStepStyles = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    const stepNumber = stepIndex + 1;
    const isClickable = allowStepNavigation && (stepNumber <= currentStep || steps[stepIndex].canSkip);
    
    let baseStyles = "flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 border-2";
    
    if (isClickable) {
      baseStyles += " cursor-pointer hover:shadow-md";
    }
    
    switch (status) {
      case 'completed':
        return `${baseStyles} bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-700 hover:bg-red-100`;
      case 'active':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-700 shadow-lg`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100`;
    }
  };

  // Responsive step title display
  const getStepTitle = (step: Step, stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    const stepNumber = stepIndex + 1;
    
    return (
      <div className="flex flex-col items-center text-center min-w-0">
        <div className={`text-sm font-semibold transition-colors duration-200 ${
          status === 'completed' ? 'text-emerald-700' :
          status === 'active' ? 'text-blue-700' :
          status === 'error' ? 'text-red-700' :
          'text-gray-500'
        }`}>
          {step.title}
        </div>
        {step.description && (
          <div className="text-xs text-gray-400 mt-1 hidden lg:block max-w-32">
            {step.description}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {/* Progress Header */}
      <div className="mb-8">
        {/* Progress Bar */}
        {showProgressBar && (
          <div className="relative w-full mb-8">
            {/* Background line */}
            <div className="absolute top-4 left-0 right-0 h-1.5 bg-gray-200 rounded-full" />
            
            {/* Progress line */}
            <div 
              className="absolute top-4 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-600 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
            />
            
            {/* Step indicators */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const status = getStepStatus(index);
                const isClickable = allowStepNavigation && (stepNumber <= currentStep || step.canSkip);
                
                return (
                  <div key={step.id} className="flex flex-col items-center relative">
                    <button
                      onClick={() => handleStepClick(stepNumber)}
                      disabled={!isClickable}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-sm ${
                        status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:scale-110'
                          : status === 'active'
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg hover:scale-110'
                          : status === 'error'
                          ? 'bg-red-500 border-red-500 text-white hover:bg-red-600 hover:scale-110'
                          : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                      } ${isClickable ? 'hover:shadow-md' : ''}`}
                    >
                      {getStepIcon(step, index)}
                    </button>
                    
                    {/* Step title */}
                    <div className="mt-3 w-full max-w-64">
                      {getStepTitle(step, index)}
                    </div>

                    {/* Step number badge */}
                    {/* {showStepNumbers && (
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        status === 'active' ? 'bg-blue-100 text-blue-700' :
                        status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {stepNumber}
                      </div>
                    )} */}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Step Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {currentStepData?.title}
          </h2>
          {currentStepData?.description && (
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              {currentStepData.description}
            </p>
          )}
          <div className="text-sm text-gray-500 mt-3 font-medium">
            Step {currentStep} of {steps.length}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl mb-8 overflow-hidden">
        <div className="p-8">
          {stepContent}
          
          {/* Validation Error Display */}
          {validationErrors[currentStep] && touchedSteps.has(currentStep) && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700 font-medium">{validationErrors[currentStep]}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-lg">
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          {!isFirstStep && (
            <button
              onClick={handleBack}
              disabled={!canGoBack || isLoading}
              className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{backButtonText}</span>
            </button>
          )}
          
          {/* Cancel Button */}
          {showCancelButton && onCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              {cancelButtonText}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          <div className="text-sm text-gray-600 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200">
            {currentStep} of {steps.length}
          </div>

          {/* Next/Complete Button */}
          <button
            onClick={handleNext}
            disabled={!canProceed || isLoading}
            className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-base"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isLastStep ? completeButtonText : nextButtonText}</span>
                {!isLastStep && <ChevronRight className="w-5 h-5" />}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step List (Alternative View) */}
      {showStepNumbers && (
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Step Overview</h3>
          <div className="space-y-3">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isClickable = allowStepNavigation && (stepNumber <= currentStep || step.canSkip);
              
              return (
                <div
                  key={step.id}
                  className={`${getStepStyles(index)} ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleStepClick(stepNumber)}
                >
                  {getStepIcon(step, index)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {showStepNumbers && (
                        <span className="text-sm font-bold text-gray-500 w-8 text-center">
                          {String(stepNumber).padStart(2, '0')}
                        </span>
                      )}
                      <span className={`font-semibold text-base ${
                        getStepStatus(index) === 'completed' ? 'text-emerald-700' :
                        getStepStatus(index) === 'active' ? 'text-blue-700' :
                        getStepStatus(index) === 'error' ? 'text-red-700' :
                        'text-gray-700'
                      }`}>
                        {step.title}
                      </span>
                      {step.isOptional && (
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full font-medium">
                          Optional
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepWizard;
