'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import { getRequest } from '@/utils/api';
import { safeLocalStorage, storeStepCompletion, isStepCompleted, getCompletedSteps } from '@/utils/localStorage';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n/context';
import GlobalHeader from '@/components/GlobalHeader/GlobalHeader';
import AddBoundarySection from '../_components/sections/AddBoundarySection';
import AddDepartmentSection from '../_components/sections/AddDepartmentSection';
import AddFacilitySection from '../_components/sections/AddFacilitySection';
import AddVehicleSection from '../_components/sections/AddVehicleSection';
import AddEquipmentSection from '../_components/sections/AddEquipmentSection';
import AddRoleSection from '../_components/sections/AddRoleSection';
import AddUserSection from '../_components/sections/AddUserSection';

interface SetupStatus {
  hasBoundary: boolean;
  hasDepartments: boolean;
  hasFacilities: boolean;
  hasVehicles: boolean;
  hasEquipment: boolean;
}

interface BoundaryData {
  hasVehicles: string;
  hasFacilities: string;
  hasEquipment: string;
}

// Dynamic steps based on boundary responses
const getSteps = (boundaryData?: BoundaryData) => [
  {
    id: 'boundary',
    title: 'Add Boundary',
    description: 'Set up your organization boundaries and baseline information',
    component: AddBoundarySection,
    required: true
  },
  {
    id: 'facilities',
    title: 'Add Facilities',
    description: 'Add your organization facilities and locations',
    component: AddFacilitySection,
    required: false,
    show: boundaryData?.hasFacilities === 'Yes',
    skippable: true
  },
  {
    id: 'vehicles',
    title: 'Add Vehicles',
    description: 'Register your fleet vehicles for emissions tracking',
    component: AddVehicleSection,
    required: false,
    show: boundaryData?.hasVehicles === 'Yes',
    skippable: true
  },
  {
    id: 'equipment',
    title: 'Add Equipment',
    description: 'Add equipment and machinery for emissions calculation',
    component: AddEquipmentSection,
    required: false,
    show: boundaryData?.hasEquipment === 'Yes',
    skippable: true
  },
  // Optional steps that don't affect main progress
  {
    id: 'departments',
    title: 'Add Departments',
    description: 'Create organizational departments and structure (Optional)',
    component: AddDepartmentSection,
    required: false,
    show: true,
    optional: true,
    skippable: true
  },
  {
    id: 'roles',
    title: 'Add Roles',
    description: 'Define user roles and permissions (Optional)',
    component: AddRoleSection,
    required: false,
    show: true,
    optional: true,
    skippable: true
  },
  {
    id: 'users',
    title: 'Add Users',
    description: 'Invite team members to your organization (Optional)',
    component: AddUserSection,
    required: false,
    show: true,
    optional: true,
    skippable: true
  }
];

export default function StepsPage() {
  const { t, isRTL } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [boundaryData, setBoundaryData] = useState<BoundaryData | undefined>();
  const [setupStatus, setSetupStatus] = useState<SetupStatus>({
    hasBoundary: false,
    hasDepartments: false,
    hasFacilities: false,
    hasVehicles: false,
    hasEquipment: false
  });
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const router = useRouter();
  
  // Get dynamic steps based on boundary data
  const steps = getSteps(boundaryData);

  const getTokens = () => {
    const token = safeLocalStorage.getItem("tokens");
    const tokenData = JSON.parse(token || "{}");
    return tokenData.accessToken;
  };

  const getOrgId = () => {
    const id = safeLocalStorage.getItem("user");
    const userData = JSON.parse(id || "{}");
    return userData.organization;
  };

  // Check setup status with minimal API calls
  const checkSetupStatus = async () => {
    try {
      setLoading(true);
      
      // Prefer cached boundary from localStorage first to avoid an API call
      let hasBoundary = false;
      let boundaryInfo: BoundaryData | undefined;
      const cachedBoundaryRaw = safeLocalStorage.getItem('boundary');
      const cachedBoundary = cachedBoundaryRaw ? JSON.parse(cachedBoundaryRaw) : undefined;
      if (cachedBoundary && (cachedBoundary._id || cachedBoundary.vehicleCount !== undefined)) {
        hasBoundary = true;
        boundaryInfo = {
          hasVehicles: (cachedBoundary.vehicleCount || 0) > 0 ? 'Yes' : 'No',
          hasFacilities: (cachedBoundary.facilityCount || 0) > 0 ? 'Yes' : 'No',
          hasEquipment: (cachedBoundary.equipmentCount || 0) > 0 ? 'Yes' : 'No'
        };
        setBoundaryData(boundaryInfo);
      } else {
        // Fallback to a single boundary fetch
        const boundaryResponse = await getRequest('boundaries/getBoundaries', getTokens());
        if (boundaryResponse?.success && boundaryResponse.data?.boundaries?.length > 0) {
          hasBoundary = true;
          const boundary = boundaryResponse.data.boundaries[0];
          boundaryInfo = {
            hasVehicles: boundary.vehicleCount > 0 ? 'Yes' : 'No',
            hasFacilities: boundary.facilityCount > 0 ? 'Yes' : 'No',
            hasEquipment: boundary.equipmentCount > 0 ? 'Yes' : 'No'
          };
          setBoundaryData(boundaryInfo);
        }
      }

      // Check localStorage for existing data instead of calling APIs
      const hasFacilities = isStepCompleted('facilities');
      const hasVehicles = isStepCompleted('vehicles');
      const hasEquipment = isStepCompleted('equipment');
      const hasDepartments = isStepCompleted('departments');
      const hasRoles = isStepCompleted('roles');
      const hasUsers = isStepCompleted('users');

      const newSetupStatus = {
        hasBoundary,
        hasDepartments,
        hasFacilities,
        hasVehicles,
        hasEquipment
      };

      setSetupStatus(newSetupStatus);

      // Get completed steps from localStorage
      const localStorageCompleted = getCompletedSteps();
      const completed = new Set<string>();
      
      // Add boundary if it exists
      if (hasBoundary) completed.add('boundary');
      
      // Add other steps from localStorage
      localStorageCompleted.forEach((stepId: string) => {
        if (stepId !== 'boundary') {
          completed.add(stepId);
        }
      });

      setCompletedSteps(completed);

      // Set current step to first incomplete VISIBLE step
      const isVisibleWith = (bd: BoundaryData | undefined, id: string) => {
        if (id === 'boundary') return true;
        if (!bd) return false;
        if (id === 'facilities') return bd.hasFacilities === 'Yes';
        if (id === 'vehicles') return bd.hasVehicles === 'Yes';
        if (id === 'equipment') return bd.hasEquipment === 'Yes';
        if (['departments', 'roles', 'users'].includes(id)) return true;
        return false;
      };
      const visibleSteps = steps.filter(step => isVisibleWith(boundaryInfo, step.id));
      const firstIncompleteVisible = visibleSteps.find(step => !completed.has(step.id));
      if (firstIncompleteVisible) {
        const idx = steps.findIndex(s => s.id === firstIncompleteVisible.id);
        if (idx !== -1) setCurrentStep(idx);
      }

      return {
        boundaryInfo,
        setupStatus: newSetupStatus,
        completed,
      };
    } catch (error) {
      toast.error('Failed to check setup status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const handleStepComplete = async (responseData?: any) => {
    // Show only one success message
    const currentStepTitle = steps[currentStep].title;
    const isOptionalStep = ['departments', 'roles', 'users'].includes(steps[currentStep].id);
    
    // if (isOptionalStep) {
      // toast.success(`${currentStepTitle} completed successfully! (Optional step)`);
    // } else {
      // toast.success(`${currentStepTitle} completed successfully!`);
    // }
    
    // Mark current step as completed in localStorage and state
    const currentStepId = steps[currentStep].id;
    storeStepCompletion(currentStepId, responseData);
    setCompletedSteps(prev => new Set([...prev, currentStepId]));
    
    // If boundary step was completed, prefer using responseData to update steps immediately
    if (steps[currentStep].id === 'boundary' && responseData) {
      const newBoundaryInfo: BoundaryData = {
        hasVehicles: (responseData.vehicleCount || 0) > 0 ? 'Yes' : 'No',
        hasFacilities: (responseData.facilityCount || 0) > 0 ? 'Yes' : 'No',
        hasEquipment: (responseData.equipmentCount || 0) > 0 ? 'Yes' : 'No',
      };
      setBoundaryData(newBoundaryInfo);

      // Auto-navigate based on the freshly updated boundary info
      const currentSteps = getSteps(newBoundaryInfo);
      const visibleSteps = currentSteps.filter(step => {
        if (step.id === 'boundary') return true;
        if (step.id === 'facilities') return newBoundaryInfo.hasFacilities === 'Yes';
        if (step.id === 'vehicles') return newBoundaryInfo.hasVehicles === 'Yes';
        if (step.id === 'equipment') return newBoundaryInfo.hasEquipment === 'Yes';
        if (['departments', 'roles', 'users'].includes(step.id)) return true;
        return false;
      });
      const boundaryIndex = visibleSteps.findIndex(step => step.id === 'boundary');
      if (boundaryIndex > -1 && boundaryIndex < visibleSteps.length - 1) {
        const nextStep = visibleSteps[boundaryIndex + 1];
        const nextStepIndex = currentSteps.findIndex(step => step.id === nextStep.id);
        if (nextStepIndex !== -1) setCurrentStep(nextStepIndex);
      }
      return;
    }

    // Default: Auto-navigate to next visible step
    setTimeout(() => {
      const currentSteps = getSteps(boundaryData);
      const visibleSteps = currentSteps.filter(step => isStepVisible(step.id));
      const currentVisibleIndex = visibleSteps.findIndex(step => step.id === steps[currentStep].id);
      if (currentVisibleIndex < visibleSteps.length - 1) {
        const nextStep = visibleSteps[currentVisibleIndex + 1];
        const nextStepIndex = currentSteps.findIndex(step => step.id === nextStep.id);
        if (nextStepIndex !== -1) setCurrentStep(nextStepIndex);
      }
    }, 400);
  };

  const handleStepSkip = () => {
    const currentStepId = steps[currentStep].id;
    
    // Mark skipped step as completed
    storeStepCompletion(currentStepId, { skipped: true });
    setCompletedSteps(prev => new Set([...prev, currentStepId]));
    
    // Show skip message
    // toast.success(`${steps[currentStep].title} skipped successfully!`);
    
    // Auto-navigate to next step
    setTimeout(() => {
      const currentSteps = getSteps(boundaryData);
      const visibleSteps = currentSteps.filter(step => isStepVisible(step.id));
      const currentVisibleIndex = visibleSteps.findIndex(step => step.id === steps[currentStep].id);
      
      if (currentVisibleIndex < visibleSteps.length - 1) {
        const nextStep = visibleSteps[currentVisibleIndex + 1];
        const nextStepIndex = currentSteps.findIndex(step => step.id === nextStep.id);
        
        if (nextStepIndex !== -1) {
          setCurrentStep(nextStepIndex);
          // toast.success(`Moving to next step: ${nextStep.title}`);
        }
      }
    }, 500);
  };

  const handleNext = () => {
    const currentSteps = getSteps(boundaryData);
    const visibleSteps = currentSteps.filter(step => isStepVisible(step.id));
    const currentVisibleIndex = visibleSteps.findIndex(step => step.id === steps[currentStep].id);
    
    if (currentVisibleIndex < visibleSteps.length - 1) {
      const nextStep = visibleSteps[currentVisibleIndex + 1];
      const nextStepIndex = currentSteps.findIndex(step => step.id === nextStep.id);
      setCurrentStep(nextStepIndex);
    }
  };

  const handlePrevious = () => {
    const currentSteps = getSteps(boundaryData);
    const visibleSteps = currentSteps.filter(step => isStepVisible(step.id));
    const currentVisibleIndex = visibleSteps.findIndex(step => step.id === steps[currentStep].id);
    
    if (currentVisibleIndex > 0) {
      const prevStep = visibleSteps[currentVisibleIndex - 1];
      const prevStepIndex = currentSteps.findIndex(step => step.id === prevStep.id);
      setCurrentStep(prevStepIndex);
    }
  };

  const getStepStatus = (stepId: string) => {
    if (completedSteps.has(stepId)) return 'completed';
    if (currentStep === steps.findIndex(step => step.id === stepId)) return 'current';
    return 'pending';
  };

  // Function to check if a step should be visible
  const isStepVisible = (stepId: string) => {
    if (stepId === 'boundary') return true;
    if (!boundaryData) return false;
    
    // Main required steps based on boundary data
    if (stepId === 'facilities') return boundaryData.hasFacilities === 'Yes';
    if (stepId === 'vehicles') return boundaryData.hasVehicles === 'Yes';
    if (stepId === 'equipment') return boundaryData.hasEquipment === 'Yes';
    
    // Optional steps are always visible
    if (['departments', 'roles', 'users'].includes(stepId)) return true;
    
    return false;
  };

  // Get main required steps for progress calculation (treat core steps as required if visible)
  const getMainRequiredSteps = () => {
    const currentSteps = getSteps(boundaryData);
    return currentSteps.filter(step => 
      ['boundary', 'facilities', 'vehicles', 'equipment'].includes(step.id) &&
      isStepVisible(step.id)
    );
  };

  // Calculate main progress (only for required steps)
  const getMainProgress = () => {
    const mainRequiredSteps = getMainRequiredSteps();
    const mainCompleted = mainRequiredSteps.filter(step => completedSteps.has(step.id)).length;
    return mainRequiredSteps.length === 0 ? 0 : Math.min(100, Math.round((mainCompleted / mainRequiredSteps.length) * 100));
  };

  // Check if all main required steps are completed
  const allMainRequiredStepsCompleted = (() => {
    const mainRequiredSteps = getMainRequiredSteps();
    return mainRequiredSteps.every(step => completedSteps.has(step.id));
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D5942] mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;
  
  const allRequiredStepsCompleted = (() => {
    const currentStepsDef = getSteps(boundaryData);
    const mainRequiredSteps = currentStepsDef.filter(step => 
      ['boundary', 'facilities', 'vehicles', 'equipment'].includes(step.id) &&
      isStepVisible(step.id)
    );
    return mainRequiredSteps.every(step => completedSteps.has(step.id));
  })();

  // Get main required steps for progress calculation
  const mainSteps = (() => {
    const currentSteps = getSteps(boundaryData);
    return currentSteps.filter(step => 
      ['boundary', 'facilities', 'vehicles', 'equipment'].includes(step.id) &&
      isStepVisible(step.id)
    );
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader title={t('dashboard.setupOrganization')}>
        <div className="ml-8">
          <span className="text-sm text-gray-500">
            {(() => {
              const currentSteps = getSteps(boundaryData);
              const visibleSteps = currentSteps.filter(step => isStepVisible(step.id));
              const currentVisibleIndex = visibleSteps.findIndex(step => step.id === steps[currentStep].id);
              return `${t('dashboard.step')} ${currentVisibleIndex + 1} ${t('common.of')} ${visibleSteps.length}`;
            })()}
          </span>
        </div>
      </GlobalHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcomeKhazra')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('dashboard.setupDescription')}
          </p>
          {boundaryData && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-blue-800">
                <strong>{t('dashboard.setupConfiguration')}:</strong> {t('dashboard.setupConfigurationDescription')} 
                {t('dashboard.boundary')}
                {boundaryData.hasFacilities === 'Yes' && ` ${t('dashboard.facilities')}`}
                {boundaryData.hasVehicles === 'Yes' && ` ${t('dashboard.vehicles')}`}
                {boundaryData.hasEquipment === 'Yes' && ` ${t('dashboard.equipment')}`}
                {boundaryData.hasFacilities === 'No' && boundaryData.hasVehicles === 'No' && boundaryData.hasEquipment === 'No' && ` (${t('dashboard.noAdditionalSteps')})`}
              </p>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {(() => {
                const mainRequiredSteps = getMainRequiredSteps();
                const mainCompleted = mainRequiredSteps.filter(step => completedSteps.has(step.id)).length;
                return `${t('dashboard.mainSetupProgress')}: ${mainCompleted} ${t('common.of')} ${mainRequiredSteps.length} ${t('common.completed')}`;
              })()}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {getMainProgress()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#0D5942] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getMainProgress()}%` }}
            ></div>
          </div>
          
          {/* Optional Steps Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                {(() => {
                  const optionalSteps = ['departments', 'roles', 'users'];
                  const optionalCompleted = optionalSteps.filter(stepId => completedSteps.has(stepId)).length;
                  return `${t('dashboard.optionalSteps')}: ${optionalCompleted} ${t('common.of')} ${optionalSteps.length} ${t('common.completed')}`;
                })()}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div 
                className="bg-blue-400 h-1 rounded-full transition-all duration-500 ease-out"
                style={{ width: (() => {
                  const optionalSteps = ['departments', 'roles', 'users'];
                  const optionalCompleted = optionalSteps.filter(stepId => completedSteps.has(stepId)).length;
                  return optionalSteps.length === 0 ? 0 : Math.min(100, Math.round((optionalCompleted / optionalSteps.length) * 100));
                })() + '%' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.setupProgress')}</h2>
              <div className="space-y-4">
                {(() => {
                  const currentSteps = getSteps(boundaryData);
                  return currentSteps.map((step, index) => {
                    if (!isStepVisible(step.id)) {
                      return null;
                    }

                    const isCompleted = completedSteps.has(step.id);
                    const isCurrent = index === currentStep;
                    const isOptional = step.optional;

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          isCurrent
                            ? 'bg-[#0D5942] text-white shadow-md'
                            : isCompleted
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => setCurrentStep(index)}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isCurrent ? 'text-white' : ''}`}>
                            {step.title}
                          </p>
                          <p className={`text-xs ${isCurrent ? 'text-white opacity-90' : 'text-gray-500'}`}>
                            {step.description}
                          </p>
                          {isOptional && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {t('dashboard.optional')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {(() => {
                const currentSteps = getSteps(boundaryData);
                const CurrentStepComponent = currentSteps[currentStep]?.component;
                
                if (!CurrentStepComponent) {
                  return (
                    <div className="text-center py-12">
                      <p className="text-gray-500">{t('common.error')}</p>
                    </div>
                  );
                }

                return (
                  <CurrentStepComponent
                    onComplete={handleStepComplete}
                  />
                );
              })()}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              currentStep === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('common.previous')}</span>
          </button>

          <div className="flex space-x-3">
            {steps[currentStep]?.skippable && (
              <button
                onClick={handleStepSkip}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
              >
                {t('dashboard.skipThisStep')}
              </button>
            )}

            {/* Skip All Steps */}
            <button
              onClick={() => {
                const currentSteps = getSteps(boundaryData);
                const visibleSteps = currentSteps.filter(step => isStepVisible(step.id));
                visibleSteps.forEach(step => {
                  if (!completedSteps.has(step.id)) {
                    storeStepCompletion(step.id, { skipped: true });
                  }
                });
                const allStepIds = visibleSteps.map(step => step.id);
                setCompletedSteps(new Set(allStepIds));
                toast.success(t('dashboard.allStepsSkipped'));
                router.push('/dashboard');
              }}
              className="px-4 py-2 text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md font-medium transition-colors"
            >
              {t('dashboard.skipAllSteps')}
            </button>

            {/* Complete Setup */}
            <button
              onClick={() => allMainRequiredStepsCompleted && router.push('/dashboard')}
              disabled={!allMainRequiredStepsCompleted}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                allMainRequiredStepsCompleted
                  ? 'bg-[#0D5942] text-white hover:bg-[#0A4A37]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('dashboard.completeSetup')}
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                currentStep === steps.length - 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0D5942] text-white hover:bg-[#0A4A37]'
              }`}
            >
              <span>{currentStep === steps.length - 1 ? t('common.finish') : t('common.next')}</span>
              {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
