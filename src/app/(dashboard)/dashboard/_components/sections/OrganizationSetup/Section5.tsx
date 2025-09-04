import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React, { useState } from "react";
import { useI18n } from "@/i18n/context";

interface Section5Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}

const Section5: React.FC<Section5Props> = ({
  onFormSubmit,
  isCompleted,
  initialData = {},
}) => {
  const { t, locale } = useI18n();
  // State to track which form is currently open in modal
  const [currentOpenForm, setCurrentOpenForm] = useState<string | null>(null);
  
  // Shared form data state to persist data across navigation
  const [sharedFormData, setSharedFormData] = useState<Record<string, any>>({});
  
  // Define the order of forms within this section
  const formOrder = ['g1', 'g2', 'g3'];
  const formTitles = {
    g1: t('boundarySections.section5.titles.core'),
    g2: t('boundarySections.section5.titles.removals'),
    g3: t('boundarySections.section5.titles.biogenic')
  };
  const fields: ConditionalField[] = [
    {
      name: "ghgSourceInventory",
      label: t('boundarySections.section5.fields.ghgSourceInventory.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section5.fields.ghgSourceInventory.placeholder'),
      options: [
        {
          label: "Complete source inventory conducted",
          value: "Complete source inventory conducted",
        },
        {
          label: "Major sources identified, minor sources estimated",
          value: "Major sources identified, minor sources estimated",
        },
        {
          label: "Preliminary source identification only",
          value: "Preliminary source identification only",
        },
        {
          label: "Source inventory not yet conducted",
          value: "Source inventory not yet conducted",
        },
      ],
    },
    {
      name: "quantificationApproach",
      label: t('boundarySections.section5.fields.quantificationApproach.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section5.fields.quantificationApproach.placeholder'),
      options: [
        {
          label: "Measurement-based approach (continuous monitoring)",
          value: "Measurement-based approach (continuous monitoring)",
        },
        {
          label:
            "Calculation-based approach (activity data × emission factors)",
          value:
            "Calculation-based approach (activity data × emission factors)",
        },
        {
          label: "Hybrid approach (mix of measurement and calculation)",
          value: "Hybrid approach (mix of measurement and calculation)",
        },
        {
          label: "Approach not yet determined",
          value: "Approach not yet determined",
        },
      ],
    },
    {
      name: "emissionFactorsSelectionCriteria",
      label: t('boundarySections.section5.fields.emissionFactorsSelectionCriteria.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section5.fields.emissionFactorsSelectionCriteria.placeholder'),
      options: [
        {
          label: "Country-specific factors prioritized (UAE/ADNOC factors)",
          value: "Country-specific factors prioritized (UAE/ADNOC factors)",
        },
        {
          label: "International factors (IPCC) used",
          value: "International factors (IPCC) used",
        },
        {
          label: "Industry-specific factors used",
          value: "Industry-specific factors used",
        },
        {
          label: "Supplier-specific factors when available",
          value: "Supplier-specific factors when available",
        },
        {
          label: "Mix of approaches based on significance",
          value: "Mix of approaches based on significance",
        },
      ],
    },
    {
      name: "directMeasurementCapabilities",
      label: t('boundarySections.section5.fields.directMeasurementCapabilities.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section5.fields.directMeasurementCapabilities.placeholder'),
      options: [
        {
          label: "Continuous emissions monitoring systems",
          value: "Continuous emissions monitoring systems",
        },
        {
          label: "Portable emissions measurement equipment",
          value: "Portable emissions measurement equipment",
        },
        {
          label: "Laboratory analysis capabilities",
          value: "Laboratory analysis capabilities",
        },
        {
          label: "Third-party measurement services",
          value: "Third-party measurement services",
        },
        {
          label: "No direct measurement capabilities",
          value: "No direct measurement capabilities",
        },
        { label: "Not yet assessed", value: "Not yet assessed" },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section5.fields.directMeasurementCapabilities.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "haveGHGRemoval",
      label: t('boundarySections.section5.fields.haveGHGRemoval.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section5.fields.haveGHGRemoval.placeholder'),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "ghgRemovals",
      label: t('boundarySections.section5.fields.ghgRemovals.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section5.fields.ghgRemovals.placeholder'),
      options: [
        { label: "Forests/vegetation", value: "Forests/vegetation" },
        { label: "Carbon capture", value: "Carbon capture" },
        { label: "Soil carbon", value: "Soil carbon" },
        { label: "Biomass", value: "Biomass" },
        { label: "Other", value: "Other" },
      ],
      showWhen: [{ field: "haveGHGRemoval", value: "Yes" }],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section5.fields.ghgRemovals.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "approachForRemovals",
      label: t('boundarySections.section5.fields.approachForRemovals.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section5.fields.approachForRemovals.placeholder'),
      options: [
        { label: "Measurement", value: "Measurement" },
        { label: "Calculation", value: "Calculation" },
        { label: "Not yet determined", value: "Not yet determined" },
      ],
      showWhen: [{ field: "haveGHGRemoval", value: "Yes" }],
    },
    {
      name: "biogenicEmissionsPresent",
      label: t('boundarySections.section5.fields.biogenicEmissionsPresent.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section5.fields.biogenicEmissionsPresent.placeholder'),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "biogenicEmissionSources",
      label: t('boundarySections.section5.fields.biogenicEmissionSources.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section5.fields.biogenicEmissionSources.placeholder'),
      options: [
        { label: "Biomass combustion", value: "Biomass combustion" },
        { label: "Biofuels", value: "Biofuels" },
        { label: "Waste treatment", value: "Waste treatment" },
        { label: "Agriculture", value: "Agriculture" },
        { label: "Other", value: "Other" },
      ],
      showWhen: [{ field: "biogenicEmissionsPresent", value: "Yes" }],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section5.fields.biogenicEmissionSources.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "biogenicEmissionsPlanned",
      label: t('boundarySections.section5.fields.biogenicEmissionsPlanned.label'),
      type: "dropdown",
      required: true,
      placeholder:
        t('boundarySections.section5.fields.biogenicEmissionsPlanned.placeholder'),
      options: ([
        { label: "Yes", value: true },
        { label: "No", value: false },
      ] as any),
      showWhen: [{ field: "biogenicEmissionsPresent", value: "Yes" }],
    },
  ];

  const handleFormSubmit = (data: any) => {
    console.log("Section5 form submitted:", data);
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
      <div data-form-id="g1">
        <WorkingConditionalForm
          key={`g1-${locale}`}
          fields={fields.filter(f => [
            'ghgSourceInventory','quantificationApproach','emissionFactorsSelectionCriteria','directMeasurementCapabilities'
          ].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.g1}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('g1')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('g1')}
        />
      </div>
      <div data-form-id="g2">
        <WorkingConditionalForm
          key={`g2-${locale}`}
          fields={fields.filter(f => [
            'haveGHGRemoval','ghgRemovals','approachForRemovals'
          ].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.g2}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('g2')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('g2')}
        />
      </div>
      <div data-form-id="g3">
        <WorkingConditionalForm
          key={`g3-${locale}`}
          fields={fields.filter(f => [
            'biogenicEmissionsPresent','biogenicEmissionSources','biogenicEmissionsPlanned'
          ].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.g3}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('g3')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('g3')}
        />
      </div>
    </div>
    </div>
  );
};

export default Section5;

// fields are confirmed.
