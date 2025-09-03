import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React, { useState } from "react";

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
  // State to track which form is currently open in modal
  const [currentOpenForm, setCurrentOpenForm] = useState<string | null>(null);
  
  // Shared form data state to persist data across navigation
  const [sharedFormData, setSharedFormData] = useState<Record<string, any>>({});
  
  // Define the order of forms within this section
  const formOrder = ['g1', 'g2', 'g3'];
  const formTitles = {
    g1: 'GHG Sources & Quantification — Core',
    g2: 'GHG Removals',
    g3: 'Biogenic Emissions'
  };
  const fields: ConditionalField[] = [
    {
      name: "ghgSourceInventory",
      label: "GHG source inventory completeness",
      type: "dropdown",
      required: true,
      placeholder: "Select your GHG source inventory completeness",
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
      label: "Quantification approach selection",
      type: "dropdown",
      required: true,
      placeholder: "Select your quantification approach selection",
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
      label: "Emission factors selection criteria",
      type: "dropdown",
      required: true,
      placeholder: "Select your emission factors selection criteria",
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
      label: "Direct measurement capabilities",
      type: "multiselect",
      required: true,
      placeholder: "Select your direct measurement capabilities",
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
            return "Direct measurement capabilities is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "haveGHGRemoval",
      label: "Do you have GHG removals or storage activities?",
      type: "dropdown",
      required: true,
      placeholder: "Select your GHG removals or storage activities",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "ghgRemovals",
      label: "Types of removals/storage?",
      type: "multiselect",
      required: true,
      placeholder: "Select your types of removals/storage?",
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
            return "Types of removals/storage is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "approachForRemovals",
      label: "Quantification approach for removals?",
      type: "dropdown",
      required: true,
      placeholder: "Select your quantification approach for removals?",
      options: [
        { label: "Measurement", value: "Measurement" },
        { label: "Calculation", value: "Calculation" },
        { label: "Not yet determined", value: "Not yet determined" },
      ],
      showWhen: [{ field: "haveGHGRemoval", value: "Yes" }],
    },
    {
      name: "biogenicEmissionsPresent",
      label: "Biogenic emissions present?",
      type: "dropdown",
      required: true,
      placeholder: "Select your biogenic emissions present?",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "biogenicEmissionSources",
      label: "Biogenic emission sources?",
      type: "multiselect",
      required: true,
      placeholder: "Select your biogenic emission sources?",
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
            return "Biogenic emission sources is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "biogenicEmissionsPlanned",
      label: "Separate tracking of biogenic emissions planned?",
      type: "dropdown",
      required: true,
      placeholder:
        "Select your separate tracking of biogenic emissions planned?",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
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
      previousFormText: "Previous",
      nextFormText: "Next",
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
          fields={fields.filter(f => [
            'ghgSourceInventory','quantificationApproach','emissionFactorsSelectionCriteria','directMeasurementCapabilities'
          ].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText="Save"
          title="GHG Sources & Quantification — Core"
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
          fields={fields.filter(f => [
            'haveGHGRemoval','ghgRemovals','approachForRemovals'
          ].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText="Save"
          title="GHG Removals"
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
          fields={fields.filter(f => [
            'biogenicEmissionsPresent','biogenicEmissionSources','biogenicEmissionsPlanned'
          ].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText="Save"
          title="Biogenic Emissions"
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
