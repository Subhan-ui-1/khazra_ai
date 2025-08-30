import StepWizard, { Step } from "@/components/StepWizard";
import React, { useState } from "react";
import Section2 from "./OrganizationSetup/Section2";
import Section5 from "./OrganizationSetup/Section5";
import Section6 from "./OrganizationSetup/Section6";
import Section10 from "./OrganizationSetup/Section10";
import Section4 from "./OrganizationSetup/Section4";
import Section3 from "./OrganizationSetup/Section3";
import Section1 from "./OrganizationSetup/Section1";
import { CheckCircle, BarChart3, Globe, Target } from "lucide-react";

const BoundarySetupSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // State to track form completion for each step
  const [formCompletionStatus, setFormCompletionStatus] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  });

  // State to store form data for each step
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  });

  const steps: Step[] = [
    {
      id: 1,
      title: "Organization & Industry Details",
      description: "Configure your organization and industry details",
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Organizational Control & Ownership",
      description: "Define your organizational control and ownership",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Geographic & Operational Boundaries",
      description: "Select your geographic and operational boundaries",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Currency & Financial Boundaries",
      description: "Select your currency and financial boundaries",
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  // Handle form submission for each step
  const handleStepFormSubmit = (step: number, data: any) => {
    console.log(`Step ${step} form submitted:`, data);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [`step${step}`]: data
    }));

    // Mark step as completed
    setFormCompletionStatus(prev => ({
      ...prev,
      [`step${step}`]: true
    }));

    // Automatically proceed to next step if not the last step
    if (step < steps.length) {
      setCurrentStep(step + 1);
    }
  };

  // Step validation function
  const validateStep = (step: number): boolean | string => {
    switch (step) {
      case 1:
        if (!formCompletionStatus.step1) {
          return "Please complete the Organization & Industry Details configuration before proceeding";
        }
        return true;
      
      case 2:
        if (!formCompletionStatus.step2) {
          return "Please complete the Organizational Control & Ownership configuration before proceeding";
        }
        return true;
      
      case 3:
        if (!formCompletionStatus.step3) {
          return "Please complete the Geographic & Operational Boundaries configuration before proceeding";
        }
        return true;
      
      case 4:
        if (!formCompletionStatus.step4) {
          return "Please complete the Currency & Financial Boundaries configuration before proceeding";
        }
        return true;
      
      default:
        return true;
    }
  };

  // Handle step change with validation
  const handleStepChange = (step: number) => {
    // Allow going back to previous steps
    if (step < currentStep) {
      setCurrentStep(step);
      return;
    }

    // Validate current step before allowing progression
    const validationResult = validateStep(currentStep);
    if (typeof validationResult === 'string') {
      // Step validation failed - don't allow progression
      return;
    }

    // Step is valid, allow progression
    setCurrentStep(step);
  };

  // Handle wizard completion
  const handleComplete = () => {
    if (formCompletionStatus.step1 && formCompletionStatus.step2 && formCompletionStatus.step3 && formCompletionStatus.step4) {
      console.log('All GHG management steps completed!', formData);
      // Here you would typically:
      // 1. Submit all data to your API
      // 2. Show success message
      // 3. Redirect or show completion message
      alert('Boundary setup completed successfully!');
    } else {
      alert('Please complete all steps before finishing');
    }
  };

  // Render step content with WorkingConditionalForm integration
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Organization & Industry Details Configuration
              </h3>
              <p className="text-gray-600">
                Configure your organization's and industry details.
              </p>
            </div> */}
            
            <Section1
              onFormSubmit={(data) => handleStepFormSubmit(1, data)}
              isCompleted={formCompletionStatus.step1}
            />
            
            {formCompletionStatus.step1 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Step 1 completed successfully! You can now proceed to the next step.
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Organizational Control & Ownership Configuration
              </h3>
              <p className="text-gray-600">
                Define your emission sources and select appropriate quantification methods.
              </p>
            </div> */}
            
            <Section3
              onFormSubmit={(data) => handleStepFormSubmit(2, data)}
              isCompleted={formCompletionStatus.step2}
            />
            
            {formCompletionStatus.step2 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Step 2 completed successfully! You can now proceed to the next step.
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Geographic & Operational Boundaries Configuration
              </h3>
              <p className="text-gray-600">
                Select which geographic and operational boundaries your organization will track.
              </p>
            </div> */}
            
            <Section4 
              onFormSubmit={(data) => handleStepFormSubmit(3, data)}
              isCompleted={formCompletionStatus.step3}
            />
            
            {formCompletionStatus.step3 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Step 3 completed successfully! You can now complete the setup.
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 4:

        return (
          <div className="space-y-6">
            {/* <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Currency & Financial Boundaries Configuration
              </h3>
              <p className="text-gray-600">
                Select which currency and financial boundaries your organization will track.
              </p>
            </div> */}
            
            <Section10 
              onFormSubmit={(data) => handleStepFormSubmit(4, data)}
              isCompleted={formCompletionStatus.step4}
            />
            
            {formCompletionStatus.step4 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Step 4 completed successfully! You can now complete the setup.
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  // Check if user can proceed to next step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formCompletionStatus.step1;
      case 2:
        return formCompletionStatus.step2;
      case 3:
        return formCompletionStatus.step3;
      case 4:
        return formCompletionStatus.step4;
      default:
        return false;
    }
  };

  // Check if user can go back
  const canGoBack = () => {
    return currentStep > 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Boundary Setup
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Configure your organization's geographic and financial boundaries through this step-by-step setup process.
          </p>
        </div>

        <StepWizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onComplete={handleComplete}
          stepContent={renderStepContent()}
          stepValidation={validateStep}
          showCancelButton={false}
          nextButtonText="Continue"
          completeButtonText="Complete Setup"
          canProceed={canProceedToNextStep()}
          canGoBack={canGoBack()}
          allowStepNavigation={false} // Disable clicking on steps to prevent skipping
          className=""
        />

        {/* Progress Summary */}
        {/* <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              formCompletionStatus.step1 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  formCompletionStatus.step1 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {formCompletionStatus.step1 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">1</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">GHG Management System</div>
                  <div className="text-sm text-gray-500">
                    {formCompletionStatus.step1 ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              formCompletionStatus.step2 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  formCompletionStatus.step2 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {formCompletionStatus.step2 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">2</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">Sources & Quantification</div>
                  <div className="text-sm text-gray-500">
                    {formCompletionStatus.step2 ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              formCompletionStatus.step3 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  formCompletionStatus.step3 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {formCompletionStatus.step3 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">3</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">Scopes & Categories</div>
                  <div className="text-sm text-gray-500">
                    {formCompletionStatus.step3 ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BoundarySetupSteps;
