'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import { getRequest } from '@/utils/api';
import { safeLocalStorage } from '@/utils/localStorage';
import toast from 'react-hot-toast';
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
    required: boundaryData?.hasFacilities === 'Yes',
    show: boundaryData?.hasFacilities === 'Yes'
  },
  {
    id: 'vehicles',
    title: 'Add Vehicles',
    description: 'Register your fleet vehicles for emissions tracking',
    component: AddVehicleSection,
    required: boundaryData?.hasVehicles === 'Yes',
    show: boundaryData?.hasVehicles === 'Yes'
  },
  {
    id: 'equipment',
    title: 'Add Equipment',
    description: 'Add equipment and machinery for emissions calculation',
    component: AddEquipmentSection,
    required: boundaryData?.hasEquipment === 'Yes',
    show: boundaryData?.hasEquipment === 'Yes'
  },
  // Optional steps that don't affect main progress
  {
    id: 'departments',
    title: 'Add Departments',
    description: 'Create organizational departments and structure (Optional)',
    component: AddDepartmentSection,
    required: false,
    show: true,
    optional: true
  },
  {
    id: 'roles',
    title: 'Add Roles',
    description: 'Define user roles and permissions (Optional)',
    component: AddRoleSection,
    required: false,
    show: true,
    optional: true
  },
  {
    id: 'users',
    title: 'Add Users',
    description: 'Invite team members to your organization (Optional)',
    component: AddUserSection,
    required: false,
    show: true,
    optional: true
  }
];

export default function StepsPage() {
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

  // Check setup status
  const checkSetupStatus = async () => {
    try {
      setLoading(true);
      
      // Fetch boundary + existence checks in parallel to reduce latency
      const [boundaryResponse, facilitiesResp, vehiclesResp, equipmentResp] = await Promise.all([
        getRequest('boundaries/getBoundaries', getTokens()),
        getRequest('facilities/getFacilities?limit=1', getTokens()),
        getRequest('vehicles/getVehicles?limit=1', getTokens()),
        getRequest('equipments/getEquipments?limit=1', getTokens()),
      ]);

      let hasBoundary = false;
      let boundaryInfo: BoundaryData | undefined;

      if (boundaryResponse.success && boundaryResponse.data?.boundaries?.length > 0) {
        hasBoundary = true;
        const boundary = boundaryResponse.data.boundaries[0];
        boundaryInfo = {
          hasVehicles: boundary.vehicleCount > 0 ? 'Yes' : 'No',
          hasFacilities: boundary.facilityCount > 0 ? 'Yes' : 'No',
          hasEquipment: boundary.equipmentCount > 0 ? 'Yes' : 'No'
        };
        setBoundaryData(boundaryInfo);
      }

      const facilitiesExist = facilitiesResp.success && facilitiesResp.data?.facilities?.length > 0;
      const vehiclesExist = vehiclesResp.success && vehiclesResp.data?.vehicles?.length > 0;
      const equipmentExist = equipmentResp.success && equipmentResp.data?.equipments?.length > 0;

      const hasFacilities = boundaryInfo?.hasFacilities === 'Yes' && facilitiesExist;
      const hasVehicles = boundaryInfo?.hasVehicles === 'Yes' && vehiclesExist;
      const hasEquipment = boundaryInfo?.hasEquipment === 'Yes' && equipmentExist;

      const newSetupStatus = {
        hasBoundary,
        hasDepartments: false,
        hasFacilities,
        hasVehicles,
        hasEquipment
      };

      setSetupStatus(newSetupStatus);

      // Only count steps that exist in the current step definition
      const currentSteps = getSteps(boundaryInfo);
      const stepIds = new Set(currentSteps.map(s => s.id));

      // Mark completed steps (main steps only; optional steps are never auto-completed)
      const completed = new Set<string>();
      if (hasBoundary && stepIds.has('boundary')) completed.add('boundary');
      if (hasFacilities && stepIds.has('facilities')) completed.add('facilities');
      if (hasVehicles && stepIds.has('vehicles')) completed.add('vehicles');
      if (hasEquipment && stepIds.has('equipment')) completed.add('equipment');

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
      const visibleSteps = currentSteps.filter(step => isVisibleWith(boundaryInfo, step.id));
      const firstIncompleteVisible = visibleSteps.find(step => !completed.has(step.id));
      if (firstIncompleteVisible) {
        const idx = currentSteps.findIndex(s => s.id === firstIncompleteVisible.id);
        if (idx !== -1) setCurrentStep(idx);
      }

      return {
        boundaryInfo,
        setupStatus: newSetupStatus,
        completed,
      };
    } catch (error) {
      console.error('Error checking setup status:', error);
      toast.error('Failed to check setup status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const handleStepComplete = async () => {
    // Show success message
    const currentStepTitle = steps[currentStep].title;
    const isOptionalStep = ['departments', 'roles', 'users'].includes(steps[currentStep].id);
    
    if (isOptionalStep) {
      toast.success(`${currentStepTitle} completed successfully! (Optional step)`);
    } else {
      toast.success(`${currentStepTitle} completed successfully!`);
    }
    
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, steps[currentStep].id]));
    
    // If boundary step was completed, fetch boundary data to update steps
    if (steps[currentStep].id === 'boundary') {
      try {
        const boundaryResponse = await getRequest(
          'boundaries/getBoundaries',
          getTokens()
        );
        
        if (boundaryResponse.success && boundaryResponse.data?.boundaries?.length > 0) {
          const boundary = boundaryResponse.data.boundaries[0];
          const boundaryInfo: BoundaryData = {
            hasVehicles: boundary.vehicleCount > 0 ? 'Yes' : 'No',
            hasEquipment: boundary.equipmentCount > 0 ? 'Yes' : 'No',
            hasFacilities: boundary.facilityCount > 0 ? 'Yes' : 'No'
          };
          setBoundaryData(boundaryInfo);
          
          // Show which steps will be available
          const availableSteps = [];
          if (boundaryInfo.hasFacilities === 'Yes') availableSteps.push('Facilities');
          if (boundaryInfo.hasVehicles === 'Yes') availableSteps.push('Vehicles');
          if (boundaryInfo.hasEquipment === 'Yes') availableSteps.push('Equipment');
          
          if (availableSteps.length > 0) {
            toast.success(`Based on your boundary setup, you'll need to complete: ${availableSteps.join(', ')}`);
          } else {
            toast.success('Based on your boundary setup, you only need to complete the main required steps.');
          }
        }
      } catch (error) {
        console.error('Error fetching boundary details after completion:', error);
      }
    }
    
    // Wait a moment for state to update, then check if we should move to next step
    setTimeout(async () => {
      // Refresh setup status after completing a step
      const status = await checkSetupStatus();
      const effectiveBoundary = status?.boundaryInfo || boundaryData;
      
      // Check if all main required steps are completed
      const currentSteps = getSteps(effectiveBoundary);
      const mainRequiredSteps = currentSteps.filter(step => 
        step.required && 
        ['boundary', 'facilities', 'vehicles', 'equipment'].includes(step.id) &&
        isStepVisible(step.id)
      );
      const completedMainRequiredSteps = mainRequiredSteps.filter(step => completedSteps.has(step.id));
      
      // Do not auto-redirect; allow user to click Complete Setup when ready
      
      // Automatically move to next step if available (only for main required steps)
      if (!isOptionalStep) {
        const visibleSteps = currentSteps.filter(step => {
          if (step.id === 'boundary') return true;
          if (!effectiveBoundary) return false;
          if (step.id === 'facilities') return effectiveBoundary.hasFacilities === 'Yes';
          if (step.id === 'vehicles') return effectiveBoundary.hasVehicles === 'Yes';
          if (step.id === 'equipment') return effectiveBoundary.hasEquipment === 'Yes';
          return false;
        });
        const currentStepId = steps[currentStep].id;
        const currentVisibleIndex = visibleSteps.findIndex(step => step.id === currentStepId);
        
        if (currentVisibleIndex < visibleSteps.length - 1) {
          const nextStep = visibleSteps[currentVisibleIndex + 1];
          const nextStepIndex = currentSteps.findIndex(step => step.id === nextStep.id);
          
          setTimeout(() => {
            setCurrentStep(nextStepIndex);
            toast.success(`Moving to next step: ${nextStep.title}`);
          }, 1500); // Small delay to show completion feedback
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

  // Get main required steps for progress calculation
  const getMainRequiredSteps = () => {
    const currentSteps = getSteps(boundaryData);
    return currentSteps.filter(step => 
      step.required && 
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
          <p className="text-gray-600">Checking your setup...</p>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;
  
  const allRequiredStepsCompleted = (() => {
    const currentStepsDef = getSteps(boundaryData);
    // Only count main required steps (boundary, facilities, vehicles, equipment)
    const mainRequiredSteps = currentStepsDef.filter(step => 
      step.required && 
      ['boundary', 'facilities', 'vehicles', 'equipment'].includes(step.id) &&
      isStepVisible(step.id)
    );
    return mainRequiredSteps.every(step => completedSteps.has(step.id));
  })();

  // Get main required steps for progress calculation
  const mainSteps = (() => {
    const currentSteps = getSteps(boundaryData);
    return currentSteps.filter(step => 
      step.required && 
      ['boundary', 'facilities', 'vehicles', 'equipment'].includes(step.id) &&
      isStepVisible(step.id)
    );
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Setup Your Organization</h1>
            </div>
                         <div className="flex items-center space-x-4">
               <span className="text-sm text-gray-500">
                 {(() => {
                   const currentSteps = getSteps(boundaryData);
                   const visibleSteps = currentSteps.filter(step => isStepVisible(step.id));
                   const currentVisibleIndex = visibleSteps.findIndex(step => step.id === steps[currentStep].id);
                   return `Step ${currentVisibleIndex + 1} of ${visibleSteps.length}`;
                 })()}
               </span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Khazra.ai Setup
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Let's get your organization set up for sustainability tracking. Complete the required steps below to configure your boundaries, facilities, vehicles, and equipment. Additional optional steps are available for departments, roles, and users.
          </p>
          {boundaryData && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Setup Configuration:</strong> Based on your boundary setup, you'll need to complete: 
                Boundary
                {boundaryData.hasFacilities === 'Yes' && ' Facilities'}
                {boundaryData.hasVehicles === 'Yes' && ' Vehicles'}
                {boundaryData.hasEquipment === 'Yes' && ' Equipment'}
                {boundaryData.hasFacilities === 'No' && boundaryData.hasVehicles === 'No' && boundaryData.hasEquipment === 'No' && ' (No additional steps required)'}
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
                return `Main Setup Progress: ${mainCompleted} of ${mainRequiredSteps.length} completed`;
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
                  return `Optional Steps: ${optionalCompleted} of ${optionalSteps.length} completed`;
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
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Setup Progress</h2>
                             <div className="space-y-4">
                 {(() => {
                   const currentSteps = getSteps(boundaryData);
                   return currentSteps.map((step, index) => {
                     // Only show steps that should be visible based on boundary data
                     if (!isStepVisible(step.id)) {
                       return null;
                     }
                     
                     const status = getStepStatus(step.id);
                     const isCompleted = status === 'completed';
                     const isCurrent = status === 'current';
                     
                     return (
                       <div
                         key={step.id}
                         className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                           isCurrent ? 'bg-green-50 border border-green-200' : ''
                         }`}
                       >
                         <div className="flex-shrink-0">
                           {isCompleted ? (
                             <CheckCircle className="h-6 w-6 text-[#0D5942]" />
                           ) : (
                             <Circle className={`h-6 w-6 ${
                               isCurrent ? 'text-[#0D5942]' : 'text-gray-300'
                             }`} />
                           )}
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className={`text-sm font-medium ${
                             isCompleted ? 'text-green-900' : isCurrent ? 'text-green-800' : 'text-gray-500'
                           }`}>
                             {step.title}
                             {step.optional && <span className="text-xs text-blue-600 ml-1">(Optional)</span>}
                           </p>
                           <p className={`text-xs ${
                             isCompleted ? 'text-green-700' : isCurrent ? 'text-[#0D5942]' : 'text-gray-400'
                           }`}>
                             {step.description}
                           </p>
                         </div>
                       </div>
                     );
                   });
                 })()}
               </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Step Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {steps[currentStep].title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {steps[currentStep].description}
                    </p>
                  </div>
                                     <div className="flex items-center space-x-2">
                     <span className="text-sm text-gray-500">
                       {(() => {
                         const currentSteps = getSteps(boundaryData);
                         const visibleSteps = currentSteps.filter(step => isStepVisible(step.id));
                         const currentVisibleIndex = visibleSteps.findIndex(step => step.id === steps[currentStep].id);
                         return `${currentVisibleIndex + 1} of ${visibleSteps.length}`;
                       })()}
                     </span>
                   </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                <CurrentStepComponent onComplete={handleStepComplete} />
              </div>

              {/* Step Navigation */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentStep === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-3">
                    {/* Skip button for optional steps */}
                    {!steps[currentStep].required && (
                      <button
                        onClick={handleNext}
                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Skip This Step
                      </button>
                    )}
                    
                                         {(() => {
                       const currentSteps = getSteps(boundaryData);
                       const visibleSteps = currentSteps.filter(step => isStepVisible(step.id));
                       const currentVisibleIndex = visibleSteps.findIndex(step => step.id === steps[currentStep].id);
                       
                       if (currentVisibleIndex < visibleSteps.length - 1) {
                         return (
                           <button
                             onClick={handleNext}
                             className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-[#0D5942] rounded-md hover:bg-green-700 transition-colors"
                           >
                             Next
                             <ArrowRight className="h-4 w-4" />
                           </button>
                         );
                       } else {
                         return (
                           <button
                             onClick={() => allMainRequiredStepsCompleted && router.push('/dashboard')}
                             disabled={!allMainRequiredStepsCompleted}
                             className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${allMainRequiredStepsCompleted ? 'bg-[#0D5942] hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                           >
                             Complete Setup
                             <CheckCircle className="h-4 w-4" />
                           </button>
                         );
                       }
                     })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
