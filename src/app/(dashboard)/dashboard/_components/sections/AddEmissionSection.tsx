"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import StepWizard, { Step } from "@/components/StepWizard";
import Section9 from "./OrganizationSetup/Section9";
import {
  CheckCircle,
  BarChart3,
  Globe,
  Target,
  Edit,
  Eye,
  Save,
  X,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { postRequest, getRequest } from "@/utils/api";
import { safeLocalStorage } from "@/utils/localStorage";
import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import { useI18n } from "@/i18n/context";
import { isEmptyValue, sanitizePayload, clearDependentFields, hasMeaningfulData } from "@/utils/formUtils";

type baselineCategory =
  | "scopeTotals"
  | "scopeCategory"
  | "scopeCategoryFacility"
  | "comprehensive";

interface BaselineData {
  _id: string;
  // Step 1: Emission Data
  baselineCategory: baselineCategory;
  scope1TotalEmissions?: number;
  scope2TotalEmissions?: number;
  facility?: string;
  scope1?: {
    stationary: number;
    mobile: number;
  };
  scope2?: {
    electricity: number;
    heating: number;
    cooling: number;
    steam: number;
  };
  totals?: {
    facilities: number;
    equipment: number;
    vehicles: number;
  };
  // Step 2: Baseline & Reporting Configuration
  baselineYear: string;
  reasonChooseBaselineYear: string;
  scope1Stationary: number;
  baselineDataCompleteness: string;
  baselineYearSelectionCriteria: string[];
  baselineRecalculationPolicy: string;
  baselineRecalculationTriggers: string[];
  changeManagementProcessEstablished: string;
  // financialYearPeriod: {
  //   startDate: string;
  //   endDate: string;
  // };
  financialYearPeriodEnd: string;
  financialYearPeriodStart: string;
  environmentalReportingPeriod: string;
  dataCollectionFrequency: string;
  historicalDataRetentionPeriod: string;
  dataArchivingAndRetrievalSystem: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface AddEmissionSectionProps {
  onProgressChange?: (percent: number) => void;
}

const AddEmissionSection: React.FC<AddEmissionSectionProps> = ({ onProgressChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [baselineData, setBaselineData] = useState<BaselineData | null>(null);
  const router = useRouter();
  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
  const { t, locale } = useI18n();

  // State to track form completion for each step
  const [formCompletionStatus, setFormCompletionStatus] = useState({
    step1: false,
    step2: false,
  });

  // State to store form data for each step
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
  });

  const steps: Step[] = [
    {
      id: 1,
      title: t('steps.emissions.step1.title'),
      description: t('steps.emissions.step1.description'),
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 2,
      title: t('steps.emissions.step2.title'),
      description: t('steps.emissions.step2.description'),
      icon: <Calendar className="w-5 h-5" />,
    },
  ];

  // Field dependencies for clearing dependent fields when parent changes
  const fieldDependencies: Record<string, string[]> = {
    // Add your field dependencies here
    // Example: 'parentField': ['childField1', 'childField2']
  };

  const pick = (src: Record<string, any>, keys: string[]) => {
    const out: Record<string, any> = {};
    keys.forEach((k) => {
      if (k in src) out[k] = src[k];
    });
    return out;
  };

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

  const computeProgressPercent = (data: Partial<BaselineData> | null): number => {
    if (!data) return 0;
    const keys: Array<keyof BaselineData> = [
      'baselineCategory','scope1TotalEmissions','scope2TotalEmissions','facility','scope1','scope2','totals',
      'baselineYear','reasonChooseBaselineYear','scope1Stationary','baselineDataCompleteness','baselineYearSelectionCriteria','baselineRecalculationPolicy','baselineRecalculationTriggers','changeManagementProcessEstablished','financialYearPeriodEnd','financialYearPeriodStart','environmentalReportingPeriod','dataCollectionFrequency','historicalDataRetentionPeriod','dataArchivingAndRetrievalSystem',
    ];
    const total = keys.length;
    const filled = keys.reduce((acc, key) => {
      const v: any = (data as any)[key];
      if (Array.isArray(v)) return acc + (v.length > 0 ? 1 : 0);
      if (v && typeof v === 'object') return acc + (Object.keys(v).length > 0 ? 1 : 0);
      return acc + (v !== undefined && v !== null && String(v).toString().trim() !== '' ? 1 : 0);
    }, 0);
    return Math.round((filled / Math.max(total, 1)) * 100);
  };

  // Fetch existing baseline data
  const fetchBaselineData = async () => {
    try {
      setIsLoading(true);
      let raw = null;
      const response = await getRequest(
        "baseline/getBaseline",
        tokenData.accessToken
      );
      if (
        response.success &&
        response.data.baseline &&
        response.data.baseline.length > 0
      ) {
        raw = response.data.baseline[0];
        // keep cache fresh if used elsewhere
        safeLocalStorage.setItem("baselineData", JSON.stringify(raw));
      }
        console.log("response.data.baseline", raw);
       
        // Normalize incoming API data to a consistent internal shape
        const normalized = {
          ...raw,
          scope1: {
            stationary:
              raw.scope1?.stationary ?? raw.scope1Stationary ?? undefined,
            mobile: raw.scope1?.mobile ?? raw.scope1Mobile ?? undefined,
          },
          scope2: {
            electricity:
              raw.scope2?.electricity ??
              raw.scope2PurchasedElectricity ??
              undefined,
            heating: raw.scope2?.heating ?? raw.scope2Heating ?? undefined,
            cooling: raw.scope2?.cooling ?? raw.scope2Cooling ?? undefined,
            steam: raw.scope2?.steam ?? raw.scope2Steam ?? undefined,
          },
          totals: {
            facilities:
              raw.totals?.facilities ?? raw.facilitiesTotal ?? undefined,
            equipment: raw.totals?.equipment ?? raw.equipmentTotal ?? undefined,
            vehicles: raw.totals?.vehicles ?? raw.vehiclesTotal ?? undefined,
          },
        } as BaselineData;

        setBaselineData(normalized);

        // Pre-populate form data for edit mode (MERGE with existing to retain local additions)
        setFormData((prev) => ({
          step1: {
            ...(prev.step1 || {}),
            baselineCategory: normalized.baselineCategory,
            scope1TotalEmissions:
              normalized.scope1TotalEmissions ?? raw.scope1TotalEmissions,
            scope2TotalEmissions:
              normalized.scope2TotalEmissions ?? raw.scope2TotalEmissions,
            // facility: normalized.facility,
            scope1Stationary:
              normalized.scope1?.stationary ?? raw.scope1Stationary,
            scope1Mobile: normalized.scope1?.mobile ?? raw.scope1Mobile,
            scope2PurchasedElectricity:
              normalized.scope2?.electricity ?? raw.scope2PurchasedElectricity,
            scope2Heating: normalized.scope2?.heating ?? raw.scope2Heating,
            scope2Cooling: normalized.scope2?.cooling ?? raw.scope2Cooling,
            scope2Steam: normalized.scope2?.steam ?? raw.scope2Steam,
            facilitiesTotal:
              normalized.totals?.facilities ?? raw.facilitiesTotal,
            equipmentTotal: normalized.totals?.equipment ?? raw.equipmentTotal,
            vehiclesTotal: normalized.totals?.vehicles ?? raw.vehiclesTotal,
            baselineYear: normalized.baselineYear,
            reasonChooseBaselineYear: normalized.reasonChooseBaselineYear,
          },
          step2: {
            ...(prev.step2 || {}),
            baselineDataCompleteness: normalized.baselineDataCompleteness,
            baselineYearSelectionCriteria:
              normalized.baselineYearSelectionCriteria,
            baselineRecalculationPolicy: normalized.baselineRecalculationPolicy,
            baselineRecalculationTriggers:
              normalized.baselineRecalculationTriggers,
            changeManagementProcessEstablished:
              normalized.changeManagementProcessEstablished,
            financialYearPeriodStart: normalized.financialYearPeriodStart,
            financialYearPeriodEnd: normalized.financialYearPeriodEnd,
            environmentalReportingPeriod:
              normalized.environmentalReportingPeriod,
            dataCollectionFrequency: normalized.dataCollectionFrequency,
            historicalDataRetentionPeriod:
              normalized.historicalDataRetentionPeriod,
            dataArchivingAndRetrievalSystem:
              normalized.dataArchivingAndRetrievalSystem,
          },
        }));

        // Mark all steps as completed since data exists
        setFormCompletionStatus({
          step1: true,
          step2: true,
        });
        // Report progress upward on initial load
        try {
          const pct = computeProgressPercent(normalized);
          onProgressChange && onProgressChange(pct);
        } catch {}
      
    } catch (error) {
      console.error("Error fetching baseline data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBaselineData();
  }, []);

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
    const { step1, step2 } = currentState;
    const aggregate = {
      ...(baselineData || {}),
      ...(step1 || {}),
      ...(step2 || {}),
    } as Record<string, any>;

    // Decide create vs update based on GET presence
    const isUpdate = Boolean(baselineData && (baselineData as any));
    const endpoint = isUpdate && baselineData?._id
      ? `baseline/updateBaseline/${baselineData._id}`
      : 'baseline/addBaseline';
    const method = isUpdate && baselineData?._id ? 'put' : 'post';
    const successMessage = method === 'put' ? 'Baseline updated successfully!' : 'Baseline created successfully!';

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
    delete (fullPayload as any).scope1
    delete (fullPayload as any).scope2
    delete (fullPayload as any).totals

    const response = await postRequest(endpoint, fullPayload, successMessage, tokenData.accessToken, method);
    if (response?.success) {
      // Optimistically merge full payload
      setBaselineData((prev) => ({ ...(prev || {} as any), ...(fullPayload as any) } as any));
      safeLocalStorage.setItem("baselineData", JSON.stringify(response.baseline));
      if(method==="post"){
        await fetchBaselineData();
      }
      // Report progress upward using merged snapshot
      const merged = { ...(baselineData || {}), ...(fullPayload as any) } as Partial<BaselineData>;
      try {
        const pct = computeProgressPercent(merged);
        onProgressChange && onProgressChange(pct);
      } catch {}
      // await fetchBaselineData();
    }
  };

  // Step validation function
  const validateStep = (step: number): boolean | string => {
    switch (step) {
      case 1:
        if (!formCompletionStatus.step1) {
          return "Please complete the Emission Data configuration before proceeding";
        }
        return true;

      case 2:
        if (!formCompletionStatus.step2) {
          return "Please complete the Baseline & Reporting Configuration before proceeding";
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
    if (formCompletionStatus.step1 && formCompletionStatus.step2) {
      console.log("All baseline setup steps completed!", formData);
      const { step1, step2 } = formData;

      const endpoint =
        isEditMode && baselineData
          ? `baseline/updateBaseline/${baselineData._id}`
          : "baseline/addBaseline";

      const method = isEditMode ? "put" : "post";
      const successMessage = isEditMode
        ? "Baseline setup updated successfully!"
        : "Baseline setup completed successfully!";

      // Build payload from both steps and sanitize it
      const rawPayload = buildPayload(step1, step2);
      const payload = sanitizePayload(rawPayload);

      const response = await postRequest(
        endpoint,
        payload,
        successMessage,
        tokenData.accessToken,
        method
      );

      if (response.success) {
        setIsEditMode(false);
        await fetchBaselineData(); // Refresh data
        router.push("/dashboard?section=add-emission");
      }
    }
  };

  // Build payload from form data
  const buildPayload = (step1Data: any, step2Data: any) => {
    const payload: any = {
      // baselineCategory: step1Data.baselineCategory,
      ...step1Data,
      ...step2Data, // Include all step2 data
    };

    // Convert the separate date fields back to the expected structure
    // if (
    //   step2Data.financialYearPeriodStart &&
    //   step2Data.financialYearPeriodEnd
    // ) {
    //   // payload.financialYearPeriod = {
    //   //   startDate: step2Data.financialYearPeriodStart,
    //   //   endDate: step2Data.financialYearPeriodEnd,
    //   // };
    //   // Remove the separate fields to avoid duplication
    //   delete payload.financialYearPeriodStart;
    //   delete payload.financialYearPeriodEnd;
    // }

    // Add step1 data based on input mode
    // switch (step1Data.baselineCategory as baselineCategory) {
    //   case "scopeTotals": {
    //     payload.scope1TotalEmissions = Number(
    //       step1Data.scope1TotalEmissions || 0
    //     );
    //     payload.scope2TotalEmissions = Number(
    //       step1Data.scope2TotalEmissions || 0
    //     );
    //     break;
    //   }
    //   case "scopeCategory": {
    //     payload.scope1 = {
    //       stationary: Number(step1Data.scope1Stationary || 0),
    //       mobile: Number(step1Data.scope1Mobile || 0),
    //     };
    //     payload.scope2 = {
    //       electricity: Number(step1Data.scope2PurchasedElectricity || 0),
    //       heating: Number(step1Data.scope2Heating || 0),
    //       cooling: Number(step1Data.scope2Cooling || 0),
    //       steam: Number(step1Data.scope2Steam || 0),
    //     };
    //     break;
    //   }
    //   case "scopeCategoryFacility": {
    //     // payload.facility = step1Data.facility;
    //     payload.scope1 = {
    //       stationary: Number(step1Data.scope1Stationary || 0),
    //       mobile: Number(step1Data.scope1Mobile || 0),
    //     };
    //     payload.scope2 = {
    //       electricity: Number(step1Data.scope2PurchasedElectricity || 0),
    //       heating: Number(step1Data.scope2Heating || 0),
    //       cooling: Number(step1Data.scope2Cooling || 0),
    //       steam: Number(step1Data.scope2Steam || 0),
    //     };
    //     break;
    //   }
    //   case "comprehensive": {
    //     payload.scope1 = {
    //       stationary: Number(step1Data.scope1Stationary || 0),
    //       mobile: Number(step1Data.scope1Mobile || 0),
    //     };
    //     payload.scope2 = {
    //       electricity: Number(step1Data.scope2PurchasedElectricity || 0),
    //       heating: Number(step1Data.scope2Heating || 0),
    //       cooling: Number(step1Data.scope2Cooling || 0),
    //       steam: Number(step1Data.scope2Steam || 0),
    //     };
    //     payload.totals = {
    //       facilities: Number(step1Data.facilitiesTotal || 0),
    //       equipment: Number(step1Data.equipmentTotal || 0),
    //       vehicles: Number(step1Data.vehiclesTotal || 0),
    //     };
    //     break;
    //   }
    // }
    return payload;
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
    if (baselineData) {
      const data = baselineData;
      setFormData({
        step1: {
          baselineCategory: data.baselineCategory,
          scope1TotalEmissions: data.scope1TotalEmissions,
          scope2TotalEmissions: data.scope2TotalEmissions,
          scope1Stationary: data.scope1?.stationary,
          scope1Mobile: data.scope1?.mobile,
          scope2PurchasedElectricity: data.scope2?.electricity,
          scope2Heating: data.scope2?.heating,
          scope2Cooling: data.scope2?.cooling,
          scope2Steam: data.scope2?.steam,
          facilitiesTotal: data.totals?.facilities,
          equipmentTotal: data.totals?.equipment,
          vehiclesTotal: data.totals?.vehicles,
        },
        step2: {
          baselineYear: data.baselineYear,
          reasonChooseBaselineYear: data.reasonChooseBaselineYear,
          baselineDataCompleteness: data.baselineDataCompleteness,
          baselineYearSelectionCriteria: data.baselineYearSelectionCriteria,
          baselineRecalculationPolicy: data.baselineRecalculationPolicy,
          baselineRecalculationTriggers: data.baselineRecalculationTriggers,
          changeManagementProcessEstablished:
            data.changeManagementProcessEstablished,
          financialYearPeriodStart: data.financialYearPeriodStart,
          financialYearPeriodEnd: data.financialYearPeriodEnd,
          environmentalReportingPeriod: data.environmentalReportingPeriod,
          dataCollectionFrequency: data.dataCollectionFrequency,
          historicalDataRetentionPeriod: data.historicalDataRetentionPeriod,
          dataArchivingAndRetrievalSystem: data.dataArchivingAndRetrievalSystem,
        },
      });
    }
  };

  // Step 1 fields for emission data
  const getStep1Fields = (): ConditionalField[] => {
    return [
      {
        name: "baselineYear",
        label: t('emissionsSetup.fields.baselineYear.label'),
        type: "dropdown",
        required: true,
        placeholder: t('emissionsSetup.fields.baselineYear.placeholder'),
        options: [
          { label: "2024", value: "2024" },
          { label: "2023", value: "2023" },
          { label: "2022", value: "2022" },
          { label: "2021", value: "2021" },
          { label: "2020", value: "2020" },
          { label: "2019", value: "2019" },
          { label: "2018", value: "2018" },
          { label: "Other", value: "Other" },
        ],
      },
      {
        name: "reasonChooseBaselineYear",
        label: t('emissionsSetup.fields.reasonChooseBaselineYear.label'),
        type: "dropdown",
        required: true,
        placeholder: t('emissionsSetup.fields.reasonChooseBaselineYear.placeholder'),
        options: [
          {
            label: "Most recent year with complete data",
            value: "Most recent year with complete data",
          },
          {
            label: "First year of comprehensive tracking",
            value: "First year of comprehensive tracking",
          },
          {
            label: "Aligns with corporate targets/strategy",
            value: "Aligns with corporate targets/strategy",
          },
          { label: "Regulatory requirement", value: "Regulatory requirement" },
          {
            label: "Representative of normal operations",
            value: "Representative of normal operations",
          },
          { label: "Other", value: "Other" },
        ],
      },
      {
        name: "baselineCategory",
        label: t('emissionsSetup.fields.baselineCategory.label'),
        type: "dropdown",
        required: true,
        placeholder: t('emissionsSetup.fields.baselineCategory.placeholder'),
        options: [
          { value: "scopeTotals", label: "Scope wise - 1, 2 total" },
          { value: "scopeCategory", label: "Scope and category wise" },
          {
            value: "scopeCategoryFacility",
            label: "Scope, category and facility wise",
          },
          {
            value: "comprehensive",
            label:
              "Comprehensive (Scope 1 stationary, facility, equipment/vehicle, etc.)",
          },
        ],
      },
      // Mode 1: Scope totals
      {
        name: "scope1TotalEmissions",
        label: t('emissionsSetup.fields.scope1TotalEmissions.label'),
        type: "number",
        required: true,
        showWhen: [{ field: "baselineCategory", value: "scopeTotals" }],
      },
      {
        name: "scope2TotalEmissions",
        label: t('emissionsSetup.fields.scope2TotalEmissions.label'),
        type: "number",
        required: true,
        showWhen: [{ field: "baselineCategory", value: "scopeTotals" }],
      },
      // Facility field for scopeCategoryFacility mode
      // {
      //   name: "facility",
      //   label: "Facility",
      //   type: "input",
      //   required: true,
      //   placeholder: "Enter facility name",
      //   showWhen: [{ field: "baselineCategory", value: "scopeCategoryFacility" }],
      // },
      // Comprehensive fields
      {
        name: "scope1Stationary",
        label: t('emissionsSetup.fields.scope1Stationary.label'),
        type: "number",
        required: true,
        showWhen: [
          { field: "baselineCategory", value: "scopeCategory" },
          { field: "baselineCategory", value: "scopeCategoryFacility" },
          { field: "baselineCategory", value: "comprehensive" },
        ],
      },
      {
        name: "scope1Mobile",
        label: t('emissionsSetup.fields.scope1Mobile.label'),
        type: "number",
        required: true,
        showWhen: [
          { field: "baselineCategory", value: "scopeCategory" },
          { field: "baselineCategory", value: "comprehensive" },
          { field: "baselineCategory", value: "scopeCategoryFacility" },
        ],
      },
      {
        name: "scope2PurchasedElectricity",
        label: t('emissionsSetup.fields.scope2PurchasedElectricity.label'),
        type: "number",
        required: true,
        showWhen: [
          { field: "baselineCategory", value: "scopeCategory" },
          { field: "baselineCategory", value: "comprehensive" },
          { field: "baselineCategory", value: "scopeCategoryFacility" },
        ],
      },
      {
        name: "scope2Heating",
        label: t('emissionsSetup.fields.scope2Heating.label'),
        type: "number",
        required: false,
        showWhen: [
          { field: "baselineCategory", value: "scopeCategory" },
          { field: "baselineCategory", value: "comprehensive" },
          { field: "baselineCategory", value: "scopeCategoryFacility" },
        ],
      },
      {
        name: "scope2Cooling",
        label: t('emissionsSetup.fields.scope2Cooling.label'),
        type: "number",
        required: false,
        showWhen: [
          { field: "baselineCategory", value: "scopeCategory" },
          { field: "baselineCategory", value: "comprehensive" },
          { field: "baselineCategory", value: "scopeCategoryFacility" },
        ],
      },
      {
        name: "scope2Steam",
        label: t('emissionsSetup.fields.scope2Steam.label'),
        type: "number",
        required: false,
        showWhen: [
          { field: "baselineCategory", value: "scopeCategory" },
          { field: "baselineCategory", value: "comprehensive" },
          { field: "baselineCategory", value: "scopeCategoryFacility" },
        ],
      },
      // Comprehensive totals
      {
        name: "facilitiesTotal",
        label: t('emissionsSetup.fields.facilitiesTotal.label'),
        type: "number",
        required: false,
        showWhen: [
          { field: "baselineCategory", value: "scopeCategoryFacility" },
          { field: "baselineCategory", value: "comprehensive" },
        ],
      },
      {
        name: "equipmentTotal",
        label: t('emissionsSetup.fields.equipmentTotal.label'),
        type: "number",
        required: false,
        showWhen: [{ field: "baselineCategory", value: "comprehensive" }],
      },
      {
        name: "vehiclesTotal",
        label: t('emissionsSetup.fields.vehiclesTotal.label'),
        type: "number",
        required: false,
        showWhen: [{ field: "baselineCategory", value: "comprehensive" }],
      },
    ];
  };

  // Render step content
  const renderStepContent = () => {
    const step1Fields = getStep1Fields();
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-8  ">
              <WorkingConditionalForm
                fields={step1Fields.filter((f) =>
                  ["baselineYear", "reasonChooseBaselineYear"].includes(f.name)
                )}
                onSubmit={(data) => handleStepFormSubmit(1, data)}
                submitText={t('common.continue')}
                title={t('emissionsSetup.titles.baselineSetup')}
                className="bg-white p-4 rounded-lg border border-gray-200 h-full shadow-sm"
                initialData={formData.step1}
                confirmationMessage="Are you sure you want to save the baseline setup information?"
              />
              <WorkingConditionalForm
                fields={step1Fields.filter(
                  (f) =>
                    !["baselineYear", "reasonChooseBaselineYear"].includes(
                      f.name
                    )
                )}
                onSubmit={(data) => handleStepFormSubmit(1, data)}
                submitText={t('common.continue')}
                title={t('emissionsSetup.titles.emissionConfiguration')}
                className="bg-white p-4 rounded-lg border border-gray-200 h-full shadow-sm"
                initialData={formData.step1}
                confirmationMessage="Are you sure you want to save the emission configuration information?"
              />
            </div>
            {/* {formCompletionStatus.step1 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Step 1 completed successfully! You can now proceed to the
                    next step.
                  </span>
                </div>
              </div>
            )} */}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Section9
              onFormSubmit={(data) => handleStepFormSubmit(2, data)}
              isCompleted={formCompletionStatus.step2}
              initialData={formData.step2}
            />

            {/* {formCompletionStatus.step2 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Step 2 completed successfully! You can now complete the
                    setup.
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
    if (!baselineData) return null;

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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Baseline Configuration
            </h2>
            <p className="text-gray-600 mt-1">
              Your organization's emission data and baseline setup
            </p>
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
        </div>

        {/* Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emission Data */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Emission Data
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Baseline Category
                </label>
                <p className="text-gray-900">{baselineData.baselineCategory}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Baseline Year
                </label>
                <p className="text-gray-900">{baselineData.baselineYear}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Reason for Baseline Year
                </label>
                <p className="text-gray-900">
                  {baselineData.reasonChooseBaselineYear}
                </p>
              </div>

              {/* Scope totals */}
              {baselineData.scope1TotalEmissions !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Scope 1 Total
                  </label>
                  <p className="text-gray-900">
                    {baselineData.scope1TotalEmissions} tCO2e
                  </p>
                </div>
              )}
              {baselineData.scope2TotalEmissions !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Scope 2 Total
                  </label>
                  <p className="text-gray-900">
                    {baselineData.scope2TotalEmissions} tCO2e
                  </p>
                </div>
              )}

              {/* Facility if included */}
              {/* {baselineData.facilitiesTotal && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Facility</label>
                  <p className="text-gray-900">{baselineData.facilitiesTotal}</p>
                </div>
              )} */}

              {/* Scope 1 breakdown */}
              {baselineData.scope1 && (
                <>
                  {baselineData.scope1.stationary !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Scope 1 - Stationary
                      </label>
                      <p className="text-gray-900">
                        {baselineData.scope1.stationary} tCO2e
                      </p>
                    </div>
                  )}
                  {baselineData.scope1.mobile !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Scope 1 - Mobile
                      </label>
                      <p className="text-gray-900">
                        {baselineData.scope1.mobile} tCO2e
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Scope 2 breakdown */}
              {baselineData.scope2 && (
                <>
                  {baselineData.scope2.electricity !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Scope 2 - Electricity
                      </label>
                      <p className="text-gray-900">
                        {baselineData.scope2.electricity} tCO2e
                      </p>
                    </div>
                  )}
                  {baselineData.scope2.heating !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Scope 2 - Heating
                      </label>
                      <p className="text-gray-900">
                        {baselineData.scope2.heating} tCO2e
                      </p>
                    </div>
                  )}
                  {baselineData.scope2.cooling !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Scope 2 - Cooling
                      </label>
                      <p className="text-gray-900">
                        {baselineData.scope2.cooling} tCO2e
                      </p>
                    </div>
                  )}
                  {baselineData.scope2.steam !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Scope 2 - Steam
                      </label>
                      <p className="text-gray-900">
                        {baselineData.scope2.steam} tCO2e
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Totals if available */}
              {baselineData.totals && (
                <>
                  {baselineData.totals.facilities !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Facilities Total
                      </label>
                      <p className="text-gray-900">
                        {baselineData.totals.facilities}
                      </p>
                    </div>
                  )}
                  {baselineData.totals.equipment !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Equipment Total
                      </label>
                      <p className="text-gray-900">
                        {baselineData.totals.equipment}
                      </p>
                    </div>
                  )}
                  {baselineData.totals.vehicles !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Vehicle Total
                      </label>
                      <p className="text-gray-900">
                        {baselineData.totals.vehicles}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Baseline & Reporting Configuration */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Baseline & Reporting Configuration
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Data Completeness
                </label>
                <p className="text-gray-900">
                  {baselineData.baselineDataCompleteness}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Selection Criteria
                </label>
                <p className="text-gray-900">
                  {formatArray(baselineData.baselineYearSelectionCriteria)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Recalculation Policy
                </label>
                <p className="text-gray-900">
                  {baselineData.baselineRecalculationPolicy}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Recalculation Triggers
                </label>
                <p className="text-gray-900">
                  {formatArray(baselineData.baselineRecalculationTriggers)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Change Management Process
                </label>
                <p className="text-gray-900">
                  {baselineData.changeManagementProcessEstablished}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Financial Year Period
                </label>
                <p className="text-gray-900">
                  {formatDate(baselineData.financialYearPeriodStart)} -{" "}
                  {formatDate(baselineData.financialYearPeriodEnd)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Environmental Reporting Period
                </label>
                <p className="text-gray-900">
                  {baselineData.environmentalReportingPeriod}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Data Collection Frequency
                </label>
                <p className="text-gray-900">
                  {baselineData.dataCollectionFrequency}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Historical Data Retention
                </label>
                <p className="text-gray-900">
                  {baselineData.historicalDataRetentionPeriod}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Data Archiving System
                </label>
                <p className="text-gray-900">
                  {baselineData.dataArchivingAndRetrievalSystem}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {/* <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 text-gray-900">
                {formatDate(baselineData.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 text-gray-900">
                {formatDate(baselineData.updatedAt)}
              </span>
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
            <p className="mt-4 text-gray-600">{t('steps.emissions.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show data display if data exists and not in edit mode
  // if (baselineData && !isEditMode) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-8">
  //       <div className="max-w-6xl mx-auto px-4">{renderDataDisplay()}</div>
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
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Baseline Configuration
                </h2>
                <p className="text-gray-600 mt-1">
                  Update your organization's emission data and baseline setup
                </p>
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
            {isEditMode ? "Edit Baseline Setup" : "Baseline Setup"}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {isEditMode
              ? "Update your organization's emission data and baseline configuration through this step-by-step setup process."
              : "Configure your organization's emission data and baseline configuration through this step-by-step setup process."}
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

export default AddEmissionSection;
