import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React, { useState } from "react";
import { useI18n } from "@/i18n/context";

interface Section9Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}

const Section9: React.FC<Section9Props> = ({ onFormSubmit, isCompleted, initialData = {} }) => {
  const { t, locale } = useI18n();
  // State to track which form is currently open in modal
  const [currentOpenForm, setCurrentOpenForm] = useState<string | null>(null);
  
  // Shared form data state to persist data across navigation
  const [sharedFormData, setSharedFormData] = useState<Record<string, any>>({});
  
  // Define the order of forms within this section
  const formOrder = ['core', 'additional'];
  const formTitles = {
    core: t('boundarySections.section9.titles.core'),
    additional: t('boundarySections.section9.titles.additional')
  };
  const fields: ConditionalField[] = [
    {
      name: "baselineDataCompleteness",
      label: t('boundarySections.section9.fields.baselineDataCompleteness.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section9.fields.baselineDataCompleteness.placeholder'),
      options: [
        {
          label: "Complete baseline data available",
          value: "Complete baseline data available",
        },
        {
          label: "Partial baseline data (need to fill gaps)",
          value: "Partial baseline data (need to fill gaps)",
        },
        {
          label: "Limited baseline data (major reconstruction needed)",
          value: "Limited baseline data (major reconstruction needed)",
        },
        {
          label: "No baseline data (establishing first year)",
          value: "No baseline data (establishing first year)",
        },
      ],
    },
    {
      name: "baselineYearSelectionCriteria",
      label: t('boundarySections.section9.fields.baselineYearSelectionCriteria.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section9.fields.baselineYearSelectionCriteria.placeholder'),
      options: [
        {
          label: "Data availability and quality",
          value: "Data availability and quality",
        },
        {
          label: "Representative of normal operations",
          value: "Representative of normal operations",
        },
        { label: "Strategic significance", value: "Strategic significance" },
        { label: "Regulatory requirements", value: "Regulatory requirements" },
        {
          label: "Stakeholder expectations",
          value: "Stakeholder expectations",
        },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section9.fields.baselineYearSelectionCriteria.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "baselineRecalculationPolicy",
      label: t('boundarySections.section9.fields.baselineRecalculationPolicy.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section9.fields.baselineRecalculationPolicy.placeholder'),
      options: [
        {
          label: "Recalculate for structural changes >5%",
          value: "Recalculate for structural changes >5%",
        },
        {
          label: "Recalculate for any organizational changes",
          value: "Recalculate for any organizational changes",
        },
        {
          label: "Recalculate only for methodology changes",
          value: "Recalculate only for methodology changes",
        },
        {
          label: "Case-by-case recalculation decisions",
          value: "Case-by-case recalculation decisions",
        },
      ],
    },
    {
      name: "baselineRecalculationTriggers",
      label: t('boundarySections.section9.fields.baselineRecalculationTriggers.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section9.fields.baselineRecalculationTriggers.placeholder'),
      options: [
        {
          label: "Structural changes to organization",
          value: "Structural changes to organization",
        },
        {
          label: "Changes in calculation methodology",
          value: "Changes in calculation methodology",
        },
        {
          label: "Discovery of significant errors",
          value: "Discovery of significant errors",
        },
        {
          label: "Changes in data availability",
          value: "Changes in data availability",
        },
        { label: "External requirements", value: "External requirements" },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section9.fields.baselineRecalculationTriggers.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "changeManagementProcessEstablished",
      label: t('boundarySections.section9.fields.changeManagementProcessEstablished.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section9.fields.changeManagementProcessEstablished.placeholder'),
      options: [
        {
          label: "Formal change management process operational",
          value: "Formal change management process operational",
        },
        {
          label: "Basic change management procedures",
          value: "Basic change management procedures",
        },
        {
          label: "Ad-hoc change management",
          value: "Ad-hoc change management",
        },
        {
          label: "No change management process",
          value: "No change management process",
        },
      ],
    },
    {
      name: "financialYearPeriodStart",
      label: t('boundarySections.section9.fields.financialYearPeriodStart.label'),
      type: "date",
      required: true,
      placeholder: t('boundarySections.section9.fields.financialYearPeriodStart.placeholder'),
      validation: {
        custom: (value, formData) => {
          if (value) {
            const startDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to start of day

            // Prevent selecting dates too far in the future (e.g., more than 5 years)
            const maxFutureYears = 5;
            const maxFutureDate = new Date();
            maxFutureDate.setFullYear(today.getFullYear() + maxFutureYears);

            if (startDate > maxFutureDate) {
              return t('boundarySections.section9.fields.financialYearPeriodStart.errorFuture', { years: maxFutureYears } as any);
            }

            // Check if end date exists and validate against it
            if (formData.financialYearPeriodEnd) {
              const endDate = new Date(formData.financialYearPeriodEnd);

              if (startDate >= endDate) {
                return t('boundarySections.section9.fields.financialYearPeriodStart.errorBeforeEnd');
              }

              // Ensure reasonable date range (e.g., not more than 10 years)
              const maxYears = 10;
              const maxEndDate = new Date(startDate);
              maxEndDate.setFullYear(startDate.getFullYear() + maxYears);

              if (endDate > maxEndDate) {
                return t('boundarySections.section9.fields.financialYearPeriodStart.errorRange', { years: maxYears } as any);
              }
            }
          }
          return null; // No error
        },
      },
    },
    {
      name: "financialYearPeriodEnd",
      label: t('boundarySections.section9.fields.financialYearPeriodEnd.label'),
      type: "date",
      required: true,
      placeholder: t('boundarySections.section9.fields.financialYearPeriodEnd.placeholder'),
      validation: {
        custom: (value, formData) => {
          if (value) {
            const endDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to start of day

            // Prevent selecting dates too far in the future (e.g., more than 5 years)
            const maxFutureYears = 5;
            const maxFutureDate = new Date();
            maxFutureDate.setFullYear(today.getFullYear() + maxFutureYears);

            if (endDate > maxFutureDate) {
              return t('boundarySections.section9.fields.financialYearPeriodEnd.errorFuture', { years: maxFutureYears } as any);
            }

            // Check if start date exists and validate against it
            if (formData.financialYearPeriodStart) {
              const startDate = new Date(formData.financialYearPeriodStart);

              if (endDate <= startDate) {
                return t('boundarySections.section9.fields.financialYearPeriodEnd.errorAfterStart');
              }

              // Ensure reasonable date range (e.g., not more than 10 years)
              const maxYears = 10;
              const maxEndDate = new Date(startDate);
              maxEndDate.setFullYear(startDate.getFullYear() + maxYears);

              if (endDate > maxEndDate) {
                return t('boundarySections.section9.fields.financialYearPeriodEnd.errorRange', { years: maxYears } as any);
              }
            }
          }
          return null; // No error
        },
      },
    },
    {
      name: "environmentalReportingPeriod",
      label: t('boundarySections.section9.fields.environmentalReportingPeriod.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section9.fields.environmentalReportingPeriod.placeholder'),
      options: [
        { label: "Same as financial year", value: "Same as financial year" },
        { label: "Calendar year (Jan-Dec)", value: "Calendar year (Jan-Dec)" },
        { label: "Other 12-month period", value: "Other 12-month period" },
        {
          label: "Multiple reporting periods",
          value: "Multiple reporting periods",
        },
      ],
    },
    {
      name: "dataCollectionFrequency",
      label: t('boundarySections.section9.fields.dataCollectionFrequency.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section9.fields.dataCollectionFrequency.placeholder'),
      options: [
        { label: "Monthly data collection", value: "Monthly data collection" },
        {
          label: "Quarterly data collection",
          value: "Quarterly data collection",
        },
        {
          label: "Bi-annual data collection",
          value: "Bi-annual data collection",
        },
        {
          label: "Annual data collection only",
          value: "Annual data collection only",
        },
      ],
    },
    {
      name: "historicalDataRetentionPeriod",
      label: t('boundarySections.section9.fields.historicalDataRetentionPeriod.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section9.fields.historicalDataRetentionPeriod.placeholder'),
      options: [
        {
          label: "Minimum 7 years (ISO recommendation)",
          value: "Minimum 7 years (ISO recommendation)",
        },
        { label: "10+ years", value: "10+ years" },
        {
          label: "As required by regulation",
          value: "As required by regulation",
        },
        { label: "Not yet determined", value: "Not yet determined" },
      ],
    },
    {
      name: "dataArchivingAndRetrievalSystem",
      label: t('boundarySections.section9.fields.dataArchivingAndRetrievalSystem.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section9.fields.dataArchivingAndRetrievalSystem.placeholder'),
      options: [
        {
          label: "Comprehensive digital archiving system",
          value: "Comprehensive digital archiving system",
        },
        {
          label: "Basic digital filing system",
          value: "Basic digital filing system",
        },
        { label: "Manual filing system", value: "Manual filing system" },
        {
          label: "No formal archiving system",
          value: "No formal archiving system",
        },
      ],
    },
  ];

  const handleFormSubmit = (data: any) => {
    console.log("Section9 form submitted:", data);
    onFormSubmit(data);
  };

  // Navigation functions for internal form navigation
  const handlePreviousForm = () => {
    if (currentOpenForm) {
      // Submit current form data before navigating
      const currentData = sharedFormData[currentOpenForm] || {};
      if (Object.keys(currentData).length > 0) {
        onFormSubmit(currentData);
      }
      
      const currentIndex = formOrder.indexOf(currentOpenForm);
      if (currentIndex > 0) {
        const previousFormId = formOrder[currentIndex - 1];
        setCurrentOpenForm(previousFormId);
        // Trigger opening the previous form's modal
        setTimeout(() => {
          const previousFormElement = document.querySelector(`[data-form-id="${previousFormId}"] button`);
          if (previousFormElement) {
            (previousFormElement as HTMLButtonElement).click();
          }
        }, 300);
      }
    }
  };

  const handleNextForm = () => {
    if (currentOpenForm) {
      // Submit current form data before navigating
      const currentData = sharedFormData[currentOpenForm] || {};
      if (Object.keys(currentData).length > 0) {
        onFormSubmit(currentData);
      }
      
      const currentIndex = formOrder.indexOf(currentOpenForm);
      if (currentIndex < formOrder.length - 1) {
        const nextFormId = formOrder[currentIndex + 1];
        setCurrentOpenForm(nextFormId);
        // Trigger opening the next form's modal
        setTimeout(() => {
          const nextFormElement = document.querySelector(`[data-form-id="${nextFormId}"] button`);
          if (nextFormElement) {
            (nextFormElement as HTMLButtonElement).click();
          }
        }, 300);
      }
    }
  };

  const getFormNavigationProps = (formId: string) => {
    const currentIndex = formOrder.indexOf(formId);
    return {
      onPreviousForm: currentIndex > 0 ? handlePreviousForm : undefined,
      onNextForm: currentIndex < formOrder.length - 1 ? handleNextForm : undefined,
      hasPreviousForm: currentIndex > 0,
      hasNextForm: currentIndex < formOrder.length - 1,
      previousFormText: t('common.previous'),
      nextFormText: t('common.next'),
    };
  };

  // Handle form data changes to persist across navigation
  const handleFormDataChange = (data: Record<string, any>) => {
    setSharedFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="space-y-10">
    {/* {!isCompleted ? ( */}
      <div className="space-8 grid xl:grid-cols-2 grid-cols-1 gap-8">
      <div data-form-id="core">
        <WorkingConditionalForm
          key={`core-${locale}`}
          fields={fields.slice(0,5)}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.core}
           className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                      initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('core')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('core')}
            />
      </div>
      <div data-form-id="additional">
        <WorkingConditionalForm
          key={`additional-${locale}`}
          fields={fields.slice(5)}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.additional}
           className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                      initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('additional')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('additional')}
            />
      </div>
    </div>
    </div>
  );
};

export default Section9;
