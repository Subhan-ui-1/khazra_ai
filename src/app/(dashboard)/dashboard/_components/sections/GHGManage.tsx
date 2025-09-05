import StepWizard, { Step } from "@/components/StepWizard";
import React, { useState, useEffect } from "react";
import Section2 from "./OrganizationSetup/Section2";
import Section5 from "./OrganizationSetup/Section5";
import Section6 from "./OrganizationSetup/Section6";
import { CheckCircle, BarChart3, Globe, Target, Edit, Eye, Save, X } from "lucide-react";
import { postRequest, getRequest } from "@/utils/api";
import { safeLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { isEmptyValue, sanitizePayload, clearDependentFields, hasMeaningfulData } from "@/utils/formUtils";

interface GHGManagementData {
  _id: string;
  organization: string;
  existingEnvironmentalManagement: string;
  ghgManagementIntegration: string;
  responsibleOfGHGManagement: string;
  ghgPolicyEstablishment: string;
  ghgQuantification: string;
  trainingAssessed?: string;
  ghgSourceInventory: string;
  quantificationApproach: string;
  emissionFactorsSelectionCriteria: string;
  directMeasurementCapabilities: string[];
  haveGHGRemoval?: string;
  ghgRemovals?: string[];
  approachForRemovals?: string;
  biogenicEmissionsPresent?: string;
  biogenicEmissionSources?: string[];
  biogenicEmissionsPlanned?: boolean;
  ghgProtocolScopes: string[];
  directGHGEmissions: string[];
  indirectGHGEmissions: string[];
  electricitySupplyMethod: string;
  indirectGHGEmissionsFromTransportation?: string[];
  indirectGHGEmissionsFromProducts?: string[];
  indirectGHGEmissionsAssociated?: string[];
  indirectGHGEmissionsFromOtherSources?: string[];
  relevantCategories: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface GHGManageProps {
  onProgressChange?: (percent: number) => void;
}

const GHGManage: React.FC<GHGManageProps> = ({ onProgressChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ghgData, setGhgData] = useState<GHGManagementData | null>(null);
  const router = useRouter();
  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
  
  // State to track form completion for each step
  const [formCompletionStatus, setFormCompletionStatus] = useState({
    step1: false,
    step2: false,
    step3: false,
  });

  // State to store form data for each step
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step3: {},
  });

  const { t } = useI18n();

  // Field dependencies for clearing dependent fields when parent changes
  const fieldDependencies: Record<string, string[]> = {
    // Add your field dependencies here
    // Example: 'parentField': ['childField1', 'childField2']
  };

  const steps: Step[] = [
    {
      id: 1,
      title: t('steps.ghg.step1.title'),
      description: t('steps.ghg.step1.description'),
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: 2,
      title: t('steps.ghg.step2.title'),
      description: t('steps.ghg.step2.description'),
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: 3,
      title: t('steps.ghg.step3.title'),
      description: t('steps.ghg.step3.description'),
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  // Fetch existing GHG management data
  const fetchGHGData = async () => {
    try {
      setIsLoading(true);
      const response = await getRequest('ghg-managment/getGhgManagment', tokenData.accessToken);
      if (response.success && response.data.ghgManagment) {
        setGhgData(response.data.ghgManagment[0]);
        
        // Pre-populate form data for edit mode
        const data = response.data.ghgManagment[0];
        setFormData({
          step1: {
            existingEnvironmentalManagement: data?.existingEnvironmentalManagement,
            ghgManagementIntegration: data?.ghgManagementIntegration,
            responsibleOfGHGManagement: data?.responsibleOfGHGManagement,
            ghgPolicyEstablishment: data?.ghgPolicyEstablishment,
            ghgQuantification: data?.ghgQuantification,
            trainingAssessment: data?.trainingAssessed,
            trainingAssessed: data?.trainingAssessed,
          },
          step2: {
            ghgSourceInventory: data?.ghgSourceInventory,
            quantificationApproach: data?.quantificationApproach,
            emissionFactorsSelectionCriteria: data?.emissionFactorsSelectionCriteria,
            directMeasurementCapabilities: data?.directMeasurementCapabilities,
            haveGHGRemoval: data?.haveGHGRemoval,
            ghgRemovals: data?.ghgRemovals,
            approachForRemovals: data?.approachForRemovals,
            biogenicEmissionsPresent: data?.biogenicEmissionsPresent,
            biogenicEmissionSources: data?.biogenicEmissionSources,
            biogenicEmissionsPlanned: data?.biogenicEmissionsPlanned === 'true'?"Yes":data?.biogenicEmissionsPlanned === 'false'?"No":"",
          },
          step3: {
            ghgProtocolScopes: data?.ghgProtocolScopes,
            directGHGEmissions: data?.directGHGEmissions,
            indirectGHGEmissions: data?.indirectGHGEmissions,
            electricitySupplyMethod: data?.electricitySupplyMethod,
            indirectGHGEmissionsFromTransportation: data?.indirectGHGEmissionsFromTransportation,
            indirectGHGEmissionsFromProducts: data?.indirectGHGEmissionsFromProducts,
            indirectGHGEmissionsAssociated: data?.indirectGHGEmissionsAssociated,
            indirectGHGEmissionsFromOtherSources: data?.indirectGHGEmissionsFromOtherSources,
            relevantCategories: data?.relevantCategories,
          },
        });

        if(data?.ghgProtocolScopes?.length>0){
          safeLocalStorage.setItem("ghgProtocolScopes", JSON.stringify(data?.ghgProtocolScopes));
        } else {
          safeLocalStorage.removeItem("ghgProtocolScopes");
        }

        // Report progress upward on initial load
        try {
          const pct = computeProgressPercent(data);
          onProgressChange && onProgressChange(pct);
        } catch {}
        
        // Mark steps as completed only if they have meaningful data
        const hasStep1Data = data?.existingEnvironmentalManagement || data?.ghgManagementIntegration || data?.responsibleOfGHGManagement || data?.ghgPolicyEstablishment || data?.ghgQuantification || data?.trainingAssessed;
        const hasStep2Data = data?.ghgSourceInventory || data?.quantificationApproach || data?.emissionFactorsSelectionCriteria || (data?.directMeasurementCapabilities && data.directMeasurementCapabilities.length > 0) || data?.haveGHGRemoval || data?.approachForRemovals || data?.biogenicEmissionsPresent;
        const hasStep3Data = (data?.ghgProtocolScopes && data.ghgProtocolScopes.length > 0) || (data?.directGHGEmissions && data.directGHGEmissions.length > 0) || (data?.indirectGHGEmissions && data.indirectGHGEmissions.length > 0) || data?.electricitySupplyMethod || (data?.relevantCategories && data.relevantCategories.length > 0);
        
        setFormCompletionStatus({
          step1: Boolean(hasStep1Data),
          step2: Boolean(hasStep2Data),
          step3: Boolean(hasStep3Data),
        });
      }
    } catch (error) {
      console.error('Error fetching GHG data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGHGData();
  }, []);

  const computeProgressPercent = (data: Partial<GHGManagementData> | null): number => {
    if (!data) return 0;
    // Keys represented by the three steps in this section
    const keys: Array<keyof GHGManagementData> = [
      // Step 1
      'existingEnvironmentalManagement','ghgManagementIntegration','responsibleOfGHGManagement','ghgPolicyEstablishment','ghgQuantification','trainingAssessed',
      // Step 2
      'ghgSourceInventory','quantificationApproach','emissionFactorsSelectionCriteria','directMeasurementCapabilities','haveGHGRemoval','ghgRemovals','approachForRemovals','biogenicEmissionsPresent','biogenicEmissionSources','biogenicEmissionsPlanned',
      // Step 3
      'ghgProtocolScopes','directGHGEmissions','indirectGHGEmissions','electricitySupplyMethod','indirectGHGEmissionsFromTransportation','indirectGHGEmissionsFromProducts','indirectGHGEmissionsAssociated','indirectGHGEmissionsFromOtherSources','relevantCategories',
    ];
    const total = keys.length;
    const filled = keys.reduce((acc, key) => {
      const v: any = (data as any)[key];
      if (Array.isArray(v)) return acc + (v.length > 0 ? 1 : 0);
      return acc + (v !== undefined && v !== null && String(v).toString().trim() !== '' ? 1 : 0);
    }, 0);
    return Math.round((filled / Math.max(total, 1)) * 100);
  };

  // Handle form submission for each step
  const handleStepFormSubmit = async (step: number, data: any) => {
    console.log(`Step ${step} form submitted:`, data);
    
    // Clear dependent fields when any field changes
    let processedData = { ...data };
    Object.keys(data).forEach(fieldName => {
      if (data[fieldName] !== undefined) {
        processedData = clearDependentFields(processedData, fieldName, fieldDependencies);
      }
    });
    
    // Merge this group's data into existing step state (preserve prior inputs)
    setFormData((prev) => {
      const mergedStep = { ...(prev as any)[`step${step}`], ...processedData };
      return {
      ...prev,
        [`step${step}`]: mergedStep,
      } as typeof prev;
    });

    // Mark step as completed only if it has meaningful data
    const hasMeaningfulStepData = hasMeaningfulData(processedData);
    
    setFormCompletionStatus((prev) => ({
      ...prev,
      [`step${step}`]: hasMeaningfulStepData,
    }));

    // Build full aggregated payload across all steps
    // Build aggregate from latest merged state AND server snapshot so fields not returned by GET are preserved
    const latestStep = { ...(formData as any)[`step${step}`], ...processedData };
    const currentState = { ...formData, [`step${step}`]: latestStep } as typeof formData;
    const { step1, step2, step3 } = currentState;
    const aggregate = {
      ...(ghgData || {}),
      ...(step1 || {}),
      ...(step2 || {}),
      ...(step3 || {}),
    } as Record<string, any>;

    // Decide create vs update based on GET presence
    const isUpdate = Boolean(ghgData && (ghgData as any));
    const endpoint = isUpdate && ghgData?._id
      ? `ghg-managment/updateGhgManagment/${ghgData._id}`
      : 'ghg-managment/addGhgManagment';
    const method = isUpdate && ghgData?._id ? 'put' : 'post';
    const successMessage = method === 'put' ? 'GHG Management updated successfully!' : 'GHG Management created successfully!';

    // Sanitize the aggregate data to convert empty values to null
    const sanitizedAggregate = sanitizePayload(aggregate);

    const fullPayload: any = method === 'put'
      ? { ...sanitizedAggregate }
      : {
          organizationId: JSON.parse(safeLocalStorage.getItem("user") || "{}").organization,
          ...sanitizedAggregate,
        };

    // Clean server-only fields
    delete (fullPayload as any)._id;
    delete (fullPayload as any).createdAt;
    delete (fullPayload as any).updatedAt;
    delete (fullPayload as any).createdBy;
    delete (fullPayload as any).organization;

    // Clean transient fields for update
    if (method === 'put') {
      delete (fullPayload as any).biogenicEmissionsPresent;
      delete (fullPayload as any).haveGHGRemoval;
      delete (fullPayload as any).trainingAssessment;
    }
    if(fullPayload&&fullPayload?.biogenicEmissionsPlanned==="Yes"){
      fullPayload.biogenicEmissionSources=true;
    } else if(fullPayload&&fullPayload?.biogenicEmissionsPlanned==="No"){
      fullPayload.biogenicEmissionSources=false;
    }

    try {
      const response = await postRequest(endpoint, fullPayload, successMessage, tokenData.accessToken, method);
      
      if (response.success && method==="post") {
        // Refresh data to get latest from server
        await fetchGHGData();
      }
      // Report progress up using merged snapshot
      const merged = { ...(ghgData || {}), ...(fullPayload as any) } as Partial<GHGManagementData>;
      try {
        const pct = computeProgressPercent(merged);
        onProgressChange && onProgressChange(pct);
      } catch {}
    } catch (error) {
      console.error('Error submitting step data:', error);
    }
  };

  // Step validation function
  const validateStep = (step: number): boolean | string => {
    switch (step) {
      case 1:
        if (!formCompletionStatus.step1) {
          return "Please complete the GHG Management System configuration before proceeding";
        }
        return true;
      
      case 2:
        if (!formCompletionStatus.step2) {
          return "Please complete the GHG Sources and Quantification Approach configuration before proceeding";
        }
        return true;
      
      case 3:
        if (!formCompletionStatus.step3) {
          return "Please complete the Emission Scopes & Categories configuration before proceeding";
        }
        return true;
      
      default:
        return true;
    }
  };

  // Handle step change with auto-submit of current step
  const handleStepChange = async (step: number) => {
    try {
      // Submit current step data before navigating
      const currentData = (formData as any)[`step${currentStep}`] || {};
      // if (Object.keys(currentData).length > 0) {
      //   await handleStepFormSubmit(currentStep, currentData);
      // }
    } catch (error) {
      console.error('Error submitting current step data:', error);
    }
    setCurrentStep(step);
  };

  // Handle wizard completion
  const handleComplete = async () => {
    if (formCompletionStatus.step1 && formCompletionStatus.step2 && formCompletionStatus.step3) {
      console.log('All GHG management steps completed!', formData);
      const {step1, step2, step3} = formData;
      
      const endpoint = isEditMode && ghgData 
        ? `ghg-managment/updateGhgManagment/${ghgData._id}`
        : 'ghg-managment/addGhgManagment';
      
      const method = isEditMode ? 'put' : 'post';
      const successMessage = isEditMode 
        ? 'GHG Management updated successfully!' 
        : 'GHG Management setup completed successfully!';
        // Sanitize each step data to convert empty values to null
        const sanitizedStep1 = sanitizePayload(step1 || {});
        const sanitizedStep2 = sanitizePayload(step2 || {});
        const sanitizedStep3 = sanitizePayload(step3 || {});

        const payload: any = {
          ...sanitizedStep1,
          ...sanitizedStep2,
          ...sanitizedStep3,
        }
        if(isEditMode){
          delete (payload as any).biogenicEmissionsPresent
          delete (payload as any).haveGHGRemoval
          delete (payload as any).trainingAssessment
        }
      const response = await postRequest(endpoint, {
        ...payload,
      }, successMessage, tokenData.accessToken, method);
      
      if(response.success){
        setIsEditMode(false);
        await fetchGHGData(); // Refresh data
        router.push('/dashboard?section=GHGManage');
      }
    } 
  };

  // Handle edit mode toggle
  const handleEditMode = () => {
    setIsEditMode(true);
    setCurrentStep(1);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setCurrentStep(1);
    // Reset form data to original values
    if (ghgData) {
      const data = ghgData;
      setFormData({
        step1: {
          existingEnvironmentalManagement: data?.existingEnvironmentalManagement,
          ghgManagementIntegration: data?.ghgManagementIntegration,
          responsibleOfGHGManagement: data?.responsibleOfGHGManagement,
          ghgPolicyEstablishment: data?.ghgPolicyEstablishment,
          ghgQuantification: data?.ghgQuantification,
          trainingAssessment: data?.trainingAssessed ? "Yes" : "No",
          trainingAssessed: data?.trainingAssessed,
        },
        step2: {
          ghgSourceInventory: data?.ghgSourceInventory,
          quantificationApproach: data?.quantificationApproach,
          emissionFactorsSelectionCriteria: data?.emissionFactorsSelectionCriteria,
          directMeasurementCapabilities: data?.directMeasurementCapabilities,
          haveGHGRemoval: data?.haveGHGRemoval,
          ghgRemovals: data?.ghgRemovals,
          approachForRemovals: data?.approachForRemovals,
          biogenicEmissionsPresent: data?.biogenicEmissionsPresent,
          biogenicEmissionSources: data?.biogenicEmissionSources,
          biogenicEmissionsPlanned: data?.biogenicEmissionsPlanned ? "Yes" : "No",
        },
        step3: {
          ghgProtocolScopes: data.ghgProtocolScopes,
          directGHGEmissions: data?.directGHGEmissions,
          indirectGHGEmissions: data?.indirectGHGEmissions,
          electricitySupplyMethod: data?.electricitySupplyMethod,
          indirectGHGEmissionsFromTransportation: data?.indirectGHGEmissionsFromTransportation,
          indirectGHGEmissionsFromProducts: data?.indirectGHGEmissionsFromProducts,
          indirectGHGEmissionsAssociated: data?.indirectGHGEmissionsAssociated,
          indirectGHGEmissionsFromOtherSources: data?.indirectGHGEmissionsFromOtherSources,
          relevantCategories: data?.relevantCategories,
        },
      });
    }
  };

  // Render step content with WorkingConditionalForm integration
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Section2 
              onFormSubmit={(data) => handleStepFormSubmit(1, data)}
              isCompleted={formCompletionStatus.step1}
              initialData={formData.step1}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Section5 
              onFormSubmit={(data) => handleStepFormSubmit(2, data)}
              isCompleted={formCompletionStatus.step2}
              initialData={formData.step2}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Section6 
              onFormSubmit={(data) => handleStepFormSubmit(3, data)}
              isCompleted={formCompletionStatus.step3}
              initialData={formData.step3}
            />
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
      default:
        return false;
    }
  };

  // Check if user can go back
  const canGoBack = () => {
    return currentStep > 1;
  };

  // Render data display component
  const renderDataDisplay = () => {
    if (!ghgData) return null;

    const formatArray = (arr: string[] | undefined) => {
      if (!arr || arr.length === 0) return "None";
      return arr.join(", ");
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };

    return (
      <div className="space-y-8">
        {/* Header with actions */}
        {/* <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">GHG Management Configuration</h2>
            <p className="text-gray-600 mt-1">Your organization's greenhouse gas management setup</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEditMode}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Configuration
            </button>
          </div>
        </div> */}

        {/* Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* GHG Management System */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">GHG Management System</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Environmental Management System</label>
                <p className="text-gray-900">{ghgData?.existingEnvironmentalManagement}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Integration Approach</label>
                <p className="text-gray-900">{ghgData?.ghgManagementIntegration}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Responsible Person</label>
                <p className="text-gray-900">{ghgData?.responsibleOfGHGManagement}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Policy Establishment</label>
                <p className="text-gray-900">{ghgData?.ghgPolicyEstablishment}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Staff Competence</label>
                <p className="text-gray-900">{ghgData?.ghgQuantification}</p>
              </div>
              {ghgData?.trainingAssessed && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Training Assessment Date</label>
                  <p className="text-gray-900">{formatDate(ghgData?.trainingAssessed)}</p>
                </div>
              )}
            </div>
          </div>

          {/* GHG Sources and Quantification */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sources & Quantification</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Source Inventory</label>
                <p className="text-gray-900">{ghgData.ghgSourceInventory}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Quantification Approach</label>
                <p className="text-gray-900">{ghgData.quantificationApproach}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Emission Factors</label>
                <p className="text-gray-900">{ghgData.emissionFactorsSelectionCriteria}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Measurement Capabilities</label>
                <p className="text-gray-900">{formatArray(ghgData.directMeasurementCapabilities)}</p>
              </div>
              {ghgData.haveGHGRemoval && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">GHG Removals</label>
                    <p className="text-gray-900">{formatArray(ghgData.ghgRemovals)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Removal Approach</label>
                    <p className="text-gray-900">{ghgData.approachForRemovals}</p>
                  </div>
                </>
              )}
              {ghgData.biogenicEmissionsPresent && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Biogenic Sources</label>
                    <p className="text-gray-900">{formatArray(ghgData.biogenicEmissionSources)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Separate Tracking</label>
                    <p className="text-gray-900">{ghgData.biogenicEmissionsPlanned ? "Yes" : "No"}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Emission Scopes & Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Emission Scopes & Categories</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">GHG Protocol Scopes</label>
                  <p className="text-gray-900">{formatArray(ghgData.ghgProtocolScopes)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Direct GHG Emissions</label>
                  <p className="text-gray-900">{formatArray(ghgData.directGHGEmissions)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Indirect GHG Emissions</label>
                  <p className="text-gray-900">{formatArray(ghgData.indirectGHGEmissions)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Electricity Supply Method</label>
                  <p className="text-gray-900">{ghgData.electricitySupplyMethod}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Transportation Emissions</label>
                  <p className="text-gray-900">{formatArray(ghgData.indirectGHGEmissionsFromTransportation)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Product Emissions</label>
                  <p className="text-gray-900">{formatArray(ghgData.indirectGHGEmissionsFromProducts)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Associated Emissions</label>
                  <p className="text-gray-900">{formatArray(ghgData.indirectGHGEmissionsAssociated)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Other Sources</label>
                  <p className="text-gray-900">{formatArray(ghgData.indirectGHGEmissionsFromOtherSources)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relevant Categories</label>
                  <p className="text-gray-900">{formatArray(ghgData.relevantCategories)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {/* <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 text-gray-900">{formatDate(ghgData.createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 text-gray-900">{formatDate(ghgData.updatedAt)}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className="ml-2 text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div> */}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className=" bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('steps.ghg.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show data display if data exists and not in edit mode
  // if (ghgData && !isEditMode) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-8">
  //       <div className="max-w-6xl mx-auto px-4">
  //         {renderDataDisplay()}
  //       </div>
  //     </div>
  //   );
  // }

  // Show form in edit mode or when no data exists
  return (
    <div className=" bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Edit mode header */}
        {/* {isEditMode && (
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit GHG Management Configuration</h2>
                <p className="text-gray-600 mt-1">Update your organization's greenhouse gas management setup</p>
              </div>
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )} */}

        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit GHG Management Setup' : 'GHG Management Setup'}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {isEditMode 
              ? 'Update your organization\'s Greenhouse Gas management system, emission sources, and tracking categories.'
              : 'Configure your organization\'s Greenhouse Gas management system, emission sources, and tracking categories through this step-by-step setup process.'
            }
          </p>
        </div> */}

        <StepWizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onComplete={handleComplete}
          stepContent={renderStepContent()}
          stepValidation={validateStep}
          showCancelButton={false}
          nextButtonText=""
          completeButtonText=""
          canProceed={false}
          canGoBack={canGoBack()}
          allowStepNavigation={true}
          className=""
        />
      </div>
    </div>
  );
};

export default GHGManage;
