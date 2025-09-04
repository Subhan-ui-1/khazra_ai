import StepWizard, { Step } from "@/components/StepWizard";
import React, { useState, useEffect } from "react";
import Section1 from "./OrganizationSetup/Section1";
import Section3 from "./OrganizationSetup/Section3";
import Section4 from "./OrganizationSetup/Section4";
import Section10 from "./OrganizationSetup/Section10";
import { CheckCircle, BarChart3, Globe, Target, Edit, Eye, Save, X, Building2, MapPin, DollarSign } from "lucide-react";
import { postRequest, getRequest } from "@/utils/api";
import { safeLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";

interface BoundaryData {
  _id: string;
  organizationId: string;
  industry: string;
  businessNature: string;
  baselineYear: string;
  hasBaselineEmissions: string;
  baselineEmissions: string;
  hasVehicles: string;
  vehicleCount: number;
  hasFacilities: string;
  facilityCount: number;
  hasEquipment: string;
  equipmentCount: number;
  businessFormationDate: string;
  reportingPeriodStartDate: string;
  reportingPeriodEndDate: string;
  reportingPeriod: {
    start: string;
    end: string;
  };
  primaryFunctionalCurrency: string;
  numberOfEmployees: string;
  secondaryFunctionalCurrency: string;
  annualRevenue: string;
  internationalBusinessTraveling: boolean;
  // Section1 fields
  industrySector?: string;
  primaryBusinessActivities?: string;
  standardIndustrialClassification?: string;
  tradeLicenseNumber?: string;
  freeZoneOperationQuestion?: string;
  freeZoneOperation?: string;
  // Section3 fields
  organizationalControlApproach?: string;
  legalOwnership?: string;
  subsidiariesQuestion?: string;
  subsidiaries?: number;
  reportingBoundary?: string;
  assessmentCompleted?: string;
  controlPercentage?: number;
  ventures?: string;
  ownershipPercentage?: number;
  ventureAgreements?: string;
  decisionMakingAuthority?: string;
  franchisedLocations?: string;
  franchisee?: string;
  leasedOperations?: string[];
  ownershipStructures?: string;
  organizationalStructureExpected?: string;
  structureExpected?: string;
  // Section4 fields
  primaryOperatingCountry?: string;
  primaryOperating?: string;
  abroadOperations?: string;
  operationsCountries?: string[];
  percentageOperations?: string;
  geographicReportingScope?: string;
  facilityInventoryAvailable?: string;
  crossBorderActivities?: string;
  doYouHaveFacilities?: string;
  ownedFacilities?: number;
  typesOfFacilities?: string[];
  haveLeasedFacilities?: string;
  leasedFacilities?: number;
  leasedFacilitiesNames?: string;
  haveMobileAssets?: string;
  typesOfVehicles?: string[];
  numberOfVehicles?: string;
  haveStationary?: string;
  typesOfEquipment?: string[];
  districtCooling?: string;
  percentageOfDistrictCooling?: string;
  operationalBoundaries?: string;
  emissionGeneratingActivities?: string;
  activityDataCollection?: string;
  // Section10 fields
  currencyConversionApproach?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface BoundarySetupStepsProps {
  onProgressChange?: (percent: number) => void;
}

const BoundarySetupSteps: React.FC<BoundarySetupStepsProps> = ({ onProgressChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [boundaryData, setBoundaryData] = useState<BoundaryData | null>(null);
  const router = useRouter();
  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
  
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
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Organizational Control & Ownership",
      description: "Define your organizational control and ownership",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Currency & Financial Boundaries",
      description: "Select your currency and financial boundaries",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Geographic & Operational Boundaries",
      description: "Select your geographic and operational boundaries",
      icon: <MapPin className="w-5 h-5" />,
    },
  ];

  // Fields belonging to each step, used for precise diffs
  const stepFieldKeys: Record<number, Array<keyof BoundaryData>> = {
    1: [
      'industrySector','industry','businessNature','primaryBusinessActivities',
      'standardIndustrialClassification','numberOfEmployees','annualRevenue',
      'businessFormationDate','tradeLicenseNumber','freeZoneOperationQuestion','freeZoneOperation',
    ],
    2: [
      'organizationalControlApproach','legalOwnership','subsidiariesQuestion','subsidiaries',
      'reportingBoundary','assessmentCompleted','controlPercentage','ventures','ownershipPercentage',
      'ventureAgreements','decisionMakingAuthority','franchisedLocations','franchisee',
      'leasedOperations','ownershipStructures','organizationalStructureExpected','structureExpected',
    ],
    3: [
      'primaryFunctionalCurrency','secondaryFunctionalCurrency','currencyConversionApproach',
    ],
    4: [
      'primaryOperatingCountry','primaryOperating','abroadOperations','operationsCountries',
      'percentageOperations','geographicReportingScope','facilityInventoryAvailable','crossBorderActivities',
      'doYouHaveFacilities','ownedFacilities','typesOfFacilities','haveLeasedFacilities','leasedFacilities',
      'leasedFacilitiesNames','haveMobileAssets','typesOfVehicles','numberOfVehicles','haveStationary',
      'typesOfEquipment','districtCooling','percentageOfDistrictCooling','operationalBoundaries',
      'emissionGeneratingActivities','activityDataCollection',
    ],
  };

  // Keys to always ignore for update payloads (transient toggles or derived)
  const TRANSIENT_KEYS: Array<keyof any> = [
    'districtCooling',
    'haveStationary',
    'haveMobileAssets',
    'haveLeasedFacilities',
    'doYouHaveFacilities',
    'organizationalStructureExpected',
    'complexOwnershipStructure',
    'activities',
    'operateFranchisedLocation',
    'jointVentures',
    'subsidiariesQuestion',
    'freeZoneOperationQuestion',
  ];

  const isEmptyValue = (v: any): boolean => {
    if (v === undefined || v === null) return true;
    if (typeof v === 'string' && v.trim() === '') return true;
    if (Array.isArray(v) && v.length === 0) return true;
    return false;
  };

  const sanitizePayload = (obj: Record<string, any>) => {
    const sanitized: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (TRANSIENT_KEYS.includes(key)) return; // ignore unwanted keys
      if (isEmptyValue(value)) return; // omit blanks to avoid clearing on backend
      sanitized[key] = value;
    });
    return sanitized;
  };

  const pick = (src: Record<string, any>, keys: string[]) => {
    const out: Record<string, any> = {};
    keys.forEach((k) => {
      if (k in src) out[k] = src[k];
    });
    return out;
  };

  // Shallow diff: returns keys whose values differ (strict equality) between prev and next
  const diffObjects = (prev: Record<string, any>, next: Record<string, any>) => {
    const changed: Record<string, any> = {};
    const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);
    allKeys.forEach((k) => {
      const pv = prev[k];
      const nv = next[k];
      const bothArrays = Array.isArray(pv) && Array.isArray(nv);
      if (bothArrays) {
        const sameLength = pv.length === nv.length;
        const sameItems = sameLength && pv.every((v: any, i: number) => v === nv[i]);
        if (!sameItems) changed[k] = nv;
        return;
      }
      if (pv !== nv) changed[k] = nv;
    });
    return changed;
  };

  const computeProgressPercent = (data: Partial<BoundaryData> | null): number => {
    if (!data) return 0;
    // Keys represented by the current UI sections
    const keys: Array<keyof BoundaryData> = [
      // Section 1
      'industrySector','industry','businessNature','primaryBusinessActivities','standardIndustrialClassification','numberOfEmployees','annualRevenue','businessFormationDate','tradeLicenseNumber','freeZoneOperationQuestion','freeZoneOperation',
      // Section 2
      'organizationalControlApproach','legalOwnership','subsidiariesQuestion','subsidiaries','reportingBoundary','assessmentCompleted','controlPercentage','ventures','ownershipPercentage','ventureAgreements','decisionMakingAuthority','franchisedLocations','franchisee','leasedOperations','ownershipStructures','organizationalStructureExpected','structureExpected',
      // Section 3 (Section10)
      'primaryFunctionalCurrency','secondaryFunctionalCurrency','currencyConversionApproach',
      // Section 4
      'primaryOperatingCountry','primaryOperating','abroadOperations','operationsCountries','percentageOperations','geographicReportingScope','facilityInventoryAvailable','crossBorderActivities','doYouHaveFacilities','ownedFacilities','typesOfFacilities','haveLeasedFacilities','leasedFacilities','leasedFacilitiesNames','haveMobileAssets','typesOfVehicles','numberOfVehicles','haveStationary','typesOfEquipment','districtCooling','percentageOfDistrictCooling','operationalBoundaries','emissionGeneratingActivities','activityDataCollection',
    ];
    const total = keys.length;
    const filled = keys.reduce((acc, key) => {
      const v: any = (data as any)[key];
      if (Array.isArray(v)) {
        return acc + (v.length > 0 ? 1 : 0);
      }
      return acc + (v !== undefined && v !== null && String(v).toString().trim() !== '' ? 1 : 0);
    }, 0);
    return Math.round((filled / Math.max(total, 1)) * 100);
  };

  // Fetch existing boundary data
  const fetchBoundaryData = async () => {
    try {
      setIsLoading(true);
      const response = await getRequest('boundaries/getBoundaries', tokenData.accessToken);
      if (response.success && response.data.boundaries && response.data.boundaries.length > 0) {
        const data = response.data.boundaries[0];
        setBoundaryData(data);
        
        // Pre-populate form data for edit mode (MERGE with any locally added values)
        setFormData((prev) => ({
          step1: {
            ...(prev.step1 || {}),
            industrySector: data.industrySector || data.industry,
            businessNature: data.businessNature,
            primaryBusinessActivities: data.primaryBusinessActivities,
            standardIndustrialClassification: data.standardIndustrialClassification,
            numberOfEmployees: data.numberOfEmployees,
            annualRevenue: data.annualRevenue,
            businessFormationDate: data.businessFormationDate,
            tradeLicenseNumber: data.tradeLicenseNumber,
            freeZoneOperationQuestion: data.freeZoneOperationQuestion,
            freeZoneOperation: data.freeZoneOperation,
          },
          step2: {
            ...(prev.step2 || {}),
            organizationalControlApproach: data.organizationalControlApproach,
            legalOwnership: data.legalOwnership,
            subsidiariesQuestion: data.subsidiariesQuestion,
            subsidiaries: data.subsidiaries,
            reportingBoundary: data.reportingBoundary,
            assessmentCompleted: data.assessmentCompleted,
            controlPercentage: data.controlPercentage,
            ventures: data.ventures,
            ownershipPercentage: data.ownershipPercentage,
            ventureAgreements: data.ventureAgreements,
            decisionMakingAuthority: data.decisionMakingAuthority,
            franchisedLocations: data.franchisedLocations,
            franchisee: data.franchisee,
            leasedOperations: data.leasedOperations,
            ownershipStructures: data.ownershipStructures,
            organizationalStructureExpected: data.organizationalStructureExpected,
            structureExpected: data.structureExpected,
          },
          step4: {
            ...(prev.step4 || {}),
            primaryOperatingCountry: data.primaryOperatingCountry,
            primaryOperating: data.primaryOperating,
            abroadOperations: data.abroadOperations,
            operationsCountries: data.operationsCountries,
            percentageOperations: data.percentageOperations,
            geographicReportingScope: data.geographicReportingScope,
            facilityInventoryAvailable: data.facilityInventoryAvailable,
            crossBorderActivities: data.crossBorderActivities,
            doYouHaveFacilities: data.doYouHaveFacilities,
            ownedFacilities: data.ownedFacilities,
            typesOfFacilities: data.typesOfFacilities,
            haveLeasedFacilities: data.haveLeasedFacilities,
            leasedFacilities: data.leasedFacilities,
            leasedFacilitiesNames: data.leasedFacilitiesNames,
            haveMobileAssets: data.haveMobileAssets,
            typesOfVehicles: data.typesOfVehicles,
            numberOfVehicles: data.numberOfVehicles,
            haveStationary: data.haveStationary,
            typesOfEquipment: data.typesOfEquipment,
            districtCooling: data.districtCooling,
            percentageOfDistrictCooling: data.percentageOfDistrictCooling,
            operationalBoundaries: data.operationalBoundaries,
            emissionGeneratingActivities: data.emissionGeneratingActivities,
            activityDataCollection: data.activityDataCollection,
          },
          step3: {
            ...(prev.step3 || {}),
            primaryFunctionalCurrency: data.primaryFunctionalCurrency,
            secondaryFunctionalCurrency: data.secondaryFunctionalCurrency,
            currencyConversionApproach: data.currencyConversionApproach,
          },
        }));
        
        // Mark all steps as completed since data exists
        setFormCompletionStatus({
          step1: true,
          step2: true,
          step3: true,
          step4: true,
        });
        // Report progress upward
        try {
          const pct = computeProgressPercent(data);
          onProgressChange && onProgressChange(pct);
        } catch {}
      }
    } catch (error) {
      console.error('Error fetching boundary data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoundaryData();
  }, []);

  // Handle form submission for each step
  const handleStepFormSubmit = async (step: number, data: any) => {
    console.log(`Step ${step} form submitted:`, data);

    // Merge this group's data into existing step state (preserve prior inputs)
    const mergedStep = {
      ...(formData as any)[`step${step}`],
      ...(data || {}),
    };
    const updated = {
      ...formData,
      [`step${step}`]: mergedStep,
    } as typeof formData;
    setFormData(updated);

    // Mark step as completed
    setFormCompletionStatus(prev => ({
      ...prev,
      [`step${step}`]: true
    }));

    // Build full aggregated payload from server snapshot + all steps (ensure fields absent in GET but edited locally are included)
    const aggregate = {
      ...(boundaryData || {} as any),
      ...(updated.step1 || {}),
      ...(updated.step2 || {}),
      ...(updated.step3 || {}),
      ...(updated.step4 || {}),
    } as Record<string, any>;

    // Decide create vs update purely based on presence of any fetched record
    const isUpdate = Boolean(boundaryData && (boundaryData as any));
    const endpoint = isUpdate && boundaryData?._id
      ? `boundaries/updateBoundary/${boundaryData._id}`
      : 'boundaries/addBoundary';
    const method = isUpdate && boundaryData?._id ? 'put' : 'post';
    const successMessage = method === 'put'
      ? 'Boundary setup updated successfully!'
      : 'Boundary setup created successfully!';

    const fullPayload: any = method === 'put'
      ? { ...aggregate }
      : {
          organizationId: JSON.parse(safeLocalStorage.getItem("user") || "{}").organization,
          ...aggregate,
        };

    // Remove server-only fields
    delete (fullPayload as any)._id;
    delete (fullPayload as any).createdAt;
    delete (fullPayload as any).updatedAt;

    // For updates, strip transient toggles not needed by backend
    if (method === 'put') {
      delete (fullPayload as any).organizationId;
      delete (fullPayload as any).districtCooling;
      delete (fullPayload as any).haveStationary;
      delete (fullPayload as any).haveMobileAssets;
      delete (fullPayload as any).haveLeasedFacilities;
      delete (fullPayload as any).doYouHaveFacilities;
      delete (fullPayload as any).organizationalStructureExpected;
      delete (fullPayload as any).complexOwnershipStructure;
      delete (fullPayload as any).activities;
      delete (fullPayload as any).operateFranchisedLocation;
      delete (fullPayload as any).jointVentures;
      delete (fullPayload as any).subsidiariesQuestion;
      delete (fullPayload as any).freeZoneOperationQuestion;
      delete (fullPayload as any).createdBy;
      delete (fullPayload as any).abroadOperations;

    }

    const response = await postRequest(endpoint, fullPayload, successMessage, tokenData.accessToken, method);
    if (response?.success) {
      // Optimistically merge full payload
      setBoundaryData((prev) => ({ ...(prev || {} as any), ...(fullPayload as any) } as any));
      if(method==="post"){
        await fetchBoundaryData();
      }
      // await fetchBoundaryData();
      const merged = { ...(boundaryData || {}), ...(fullPayload as any) } as Partial<BoundaryData>;
      try {
        const pct = computeProgressPercent(merged);
        onProgressChange && onProgressChange(pct);
      } catch {}
    }

    // Do not auto-advance the wizard on per-form saves; user stays in the same step
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
          return "Please complete the Currency & Financial Boundaries configuration before proceeding";
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
      console.log('All boundary setup steps completed!', formData);
      const {step1, step2, step3, step4} = formData;

    const payload: any = {
      organizationId: JSON.parse(safeLocalStorage.getItem("user") || "{}").organization,
      ...step1,
      ...step2,
      ...step3,
      ...step4,
      }
      console.log(payload, "payload")
      const endpoint = isEditMode && boundaryData 
        ? `boundaries/updateBoundary/${boundaryData._id}`
        : 'boundaries/addBoundary';
      
      const method = isEditMode ? 'put' : 'post';
      const successMessage = isEditMode 
        ? 'Boundary setup updated successfully!' 
        : 'Boundary setup completed successfully!';

        if(isEditMode){
          delete (payload as any).organizationId
          delete (payload as any).districtCooling
          delete (payload as any).haveStationary
          delete (payload as any).haveMobileAssets
          delete (payload as any).haveLeasedFacilities
          delete (payload as any).doYouHaveFacilities
          delete (payload as any).organizationalStructureExpected
          delete (payload as any).complexOwnershipStructure
          delete (payload as any).activities
          delete (payload as any).operateFranchisedLocation
          delete (payload as any).jointVentures
          delete (payload as any).subsidiariesQuestion
          delete (payload as any).freeZoneOperationQuestion
          delete (payload as any).createdBy
        }
      
      const response = await postRequest(endpoint, {
       ...payload
      }, successMessage, tokenData.accessToken, method);
      
      if(response.success){
        setIsEditMode(false);
        await fetchBoundaryData(); // Refresh data
        router.push('/dashboard?section=boundary-setup');
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
    if (boundaryData) {
      const data = boundaryData;
      setFormData({
        step1: {
          industrySector: data.industrySector || data.industry,
          businessNature: data.businessNature,
          primaryBusinessActivities: data.primaryBusinessActivities,
          standardIndustrialClassification: data.standardIndustrialClassification,
          numberOfEmployees: data.numberOfEmployees,
          annualRevenue: data.annualRevenue,
          businessFormationDate: data.businessFormationDate,
          tradeLicenseNumber: data.tradeLicenseNumber,
          freeZoneOperationQuestion: data.freeZoneOperationQuestion,
          freeZoneOperation: data.freeZoneOperation,
        },
        step2: {
          organizationalControlApproach: data.organizationalControlApproach,
          legalOwnership: data.legalOwnership,
          subsidiariesQuestion: data.subsidiariesQuestion,
          subsidiaries: data.subsidiaries,
          reportingBoundary: data.reportingBoundary,
          assessmentCompleted: data.assessmentCompleted,
          controlPercentage: data.controlPercentage,
          ventures: data.ventures,
          ownershipPercentage: data.ownershipPercentage,
          ventureAgreements: data.ventureAgreements,
          decisionMakingAuthority: data.decisionMakingAuthority,
          franchisedLocations: data.franchisedLocations,
          franchisee: data.franchisee,
          leasedOperations: data.leasedOperations,
          ownershipStructures: data.ownershipStructures,
          organizationalStructureExpected: data.organizationalStructureExpected,
          structureExpected: data.structureExpected,
        },
        step4: {
          primaryOperatingCountry: data.primaryOperatingCountry,
          primaryOperating: data.primaryOperating,
          abroadOperations: data.abroadOperations,
          operationsCountries: data.operationsCountries,
          percentageOperations: data.percentageOperations,
          geographicReportingScope: data.geographicReportingScope,
          facilityInventoryAvailable: data.facilityInventoryAvailable,
          crossBorderActivities: data.crossBorderActivities,
          doYouHaveFacilities: data.doYouHaveFacilities,
          ownedFacilities: data.ownedFacilities,
          typesOfFacilities: data.typesOfFacilities,
          haveLeasedFacilities: data.haveLeasedFacilities,
          leasedFacilities: data.leasedFacilities,
          leasedFacilitiesNames: data.leasedFacilitiesNames,
          haveMobileAssets: data.haveMobileAssets,
          typesOfVehicles: data.typesOfVehicles,
          numberOfVehicles: data.numberOfVehicles,
          haveStationary: data.haveStationary,
          typesOfEquipment: data.typesOfEquipment,
          districtCooling: data.districtCooling,
          percentageOfDistrictCooling: data.percentageOfDistrictCooling,
          operationalBoundaries: data.operationalBoundaries,
          emissionGeneratingActivities: data.emissionGeneratingActivities,
          activityDataCollection: data.activityDataCollection,
        },
        step3: {
          primaryFunctionalCurrency: data.primaryFunctionalCurrency,
          secondaryFunctionalCurrency: data.secondaryFunctionalCurrency,
          currencyConversionApproach: data.currencyConversionApproach,
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
            <Section1
              onFormSubmit={(data) => handleStepFormSubmit(1, data)}
              isCompleted={formCompletionStatus.step1}
              initialData={formData.step1}
            />
            
            {/* {formCompletionStatus.step1 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Step 1 completed successfully! You can now proceed to the next step.
                  </span>
                </div>
              </div>
            )} */}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Section3
              onFormSubmit={(data) => handleStepFormSubmit(2, data)}
              isCompleted={formCompletionStatus.step2}
              initialData={formData.step2}
            />
            
            {/* {formCompletionStatus.step2 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Step 2 completed successfully! You can now proceed to the next step.
                  </span>
                </div>
              </div>
            )} */}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Section4 
              onFormSubmit={(data) => handleStepFormSubmit(4, data)}
              isCompleted={formCompletionStatus.step3}
              initialData={formData.step4}
            />
            
      {/* //       {formCompletionStatus.step3 && (
      //         <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
      //           <div className="flex items-center space-x-2">
      //             <CheckCircle className="w-5 h-5 text-green-600" />
      //             <span className="text-sm text-green-700 font-medium">
      //               Step 3 completed successfully! You can now complete the setup.
      //             </span>
      //           </div>
      //         </div>
      //       )} */}
          </div>
        );

      case 3:

        return (
          <div className="space-y-6">
            <Section10 
              onFormSubmit={(data) => handleStepFormSubmit(3, data)}
              isCompleted={formCompletionStatus.step3}
              initialData={formData.step3}
            />
            
            {/* {formCompletionStatus.step3 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Step 4 completed successfully! You can now complete the setup.
                  </span>
                </div>
              </div>
            )} */}
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

  // Render data display component
  const renderDataDisplay = () => {
    if (!boundaryData) return null;

    const formatArray = (arr: string[] | undefined) => {
      if (!arr || arr.length === 0) return "None";
      return arr.join(", ");
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    console.log(boundaryData.primaryFunctionalCurrency)

    return (
      <div className="space-y-8">
        {/* Header with actions */}
        <div className="flex justify-between items-center">
          {/* <div>
            <h2 className="text-2xl font-bold text-gray-900">Boundary Configuration</h2>
            <p className="text-gray-600 mt-1">Your organization's geographic and financial boundaries setup</p>
          </div> */}
          <div className="flex space-x-3">
            <button
              onClick={handleEditMode}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Configuration
            </button>
          </div>
        </div>

        {/* Data Sections */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Organization & Industry Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Industry Sector</label>
                <p className="text-gray-900">{boundaryData.industrySector || boundaryData.industry}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Business Nature</label>
                <p className="text-gray-900">{boundaryData.businessNature}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Number of Employees</label>
                <p className="text-gray-900">{boundaryData.numberOfEmployees}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Annual Revenue</label>
                <p className="text-gray-900">{boundaryData.annualRevenue}</p>
              </div>
              {boundaryData.businessFormationDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Formation Date</label>
                  <p className="text-gray-900">{formatDate(boundaryData.businessFormationDate)}</p>
                </div>
              )}
              {boundaryData.tradeLicenseNumber && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Trade License Number</label>
                  <p className="text-gray-900">{boundaryData.tradeLicenseNumber}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Organizational Control & Ownership</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Control Approach</label>
                <p className="text-gray-900">{boundaryData.organizationalControlApproach}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Legal Ownership</label>
                <p className="text-gray-900">{boundaryData.legalOwnership}</p>
              </div>
              {boundaryData.subsidiariesQuestion && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Subsidiaries</label>
                  <p className="text-gray-900">{boundaryData.subsidiariesQuestion}</p>
                </div>
              )}
              {boundaryData.subsidiaries && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Number of Subsidiaries</label>
                  <p className="text-gray-900">{boundaryData.subsidiaries}</p>
                </div>
              )}
              {boundaryData.reportingBoundary && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Reporting Boundary</label>
                  <p className="text-gray-900">{boundaryData.reportingBoundary}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Geographic & Operational Boundaries</h3>
            </div>
            <div className="space-y-4">
              {boundaryData.primaryOperatingCountry && <div>
                <label className="text-sm font-medium text-gray-500">Primary Operating Country</label>
                <p className="text-gray-900">{boundaryData.primaryOperatingCountry}</p>
              </div>}
              {boundaryData.primaryOperating && <div>
                <label className="text-sm font-medium text-gray-500">Primary Operating Emirate</label>
                <p className="text-gray-900">{boundaryData.primaryOperating}</p>
              </div>}
              {boundaryData.abroadOperations && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Operations Outside UAE</label>
                  <p className="text-gray-900">{boundaryData.abroadOperations}</p>
                </div>
              )}
              {boundaryData.operationsCountries && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Operations Countries</label>
                  <p className="text-gray-900">{formatArray(boundaryData.operationsCountries)}</p>
                </div>
              )}
              {boundaryData.percentageOperations && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Percentage Outside UAE</label>
                  <p className="text-gray-900">{boundaryData.percentageOperations}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Currency & Financial Boundaries</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Primary Functional Currency</label>
                <p className="text-gray-900">{boundaryData.primaryFunctionalCurrency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Secondary Functional Currency</label>
                <p className="text-gray-900">{boundaryData.secondaryFunctionalCurrency || "None"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Currency Conversion Approach</label>
                <p className="text-gray-900">{boundaryData.currencyConversionApproach}</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Metadata */}
        {/* <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 text-gray-900">{formatDate(boundaryData.createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 text-gray-900">{formatDate(boundaryData.updatedAt)}</span>
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
            <p className="mt-4 text-gray-600">Loading boundary configuration data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show data display if data exists and not in edit mode
  // if (boundaryData && !isEditMode) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-8">
  //       <div className=" mx-auto px-4">
  //         {renderDataDisplay()}
  //       </div>
  //     </div>
  //   );
  // }

  // Show form in edit mode or when no data exists
  return (
    <div className=" bg-white py-8">
      <div className=" mx-auto px-4">
        {/* Edit mode header */}
        {/* {isEditMode && (
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Boundary Configuration</h2>
                <p className="text-gray-600 mt-1">Update your organization's geographic and financial boundaries setup</p>
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
            {isEditMode ? 'Edit Boundary Setup' : 'Boundary Setup'}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {isEditMode 
              ? 'Update your organization\'s geographic and financial boundaries through this step-by-step setup process.'
              : 'Configure your organization\'s geographic and financial boundaries through this step-by-step setup process.'
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

export default BoundarySetupSteps;
