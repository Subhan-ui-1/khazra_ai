import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React, { useState } from "react";
import { useI18n } from "@/i18n/context";

interface Section6Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}

const Section6: React.FC<Section6Props> = ({ onFormSubmit, isCompleted, initialData = {} }) => {
  const { t, locale } = useI18n();
  // State to track which form is currently open in modal
  const [currentOpenForm, setCurrentOpenForm] = useState<string | null>(null);
  
  // Shared form data state to persist data across navigation
  const [sharedFormData, setSharedFormData] = useState<Record<string, any>>({});
  
  // Define the order of forms within this section
  const formOrder = ['g1', 'g2', 'g3', 'g4'];
  const formTitles = {
    g1: t('boundarySections.section6.titles.selection'),
    g2: t('boundarySections.section6.titles.scope1'),
    g3: t('boundarySections.section6.titles.scope2'),
    g4: t('boundarySections.section6.titles.scope3')
  };
  const fields: ConditionalField[] = [
    {
      name: "ghgProtocolScopes",
      label: t('boundarySections.section6.fields.ghgProtocolScopes.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section6.fields.ghgProtocolScopes.placeholder'),
      options: [
        {
          label: "Scope 1 - Direct Emissions (Required)",
          value: "Scope 1 - Direct Emissions (Required)",
          defaultSelected: true,
        },
        {
          label: "Scope 2 - Purchased Energy (Required)",
          value: "Scope 2 - Purchased Energy (Required)",
          defaultSelected: true,
        },
        {
          label: "Scope 3 - Value Chain Emissions (Recommended)",
          value: "Scope 3 - Value Chain Emissions (Recommended)",
        },
      ],
    },
    {
      name: "directGHGEmissions",
      label: t('boundarySections.section6.fields.directGHGEmissions.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section6.fields.directGHGEmissions.placeholder'),
      options: [
        { label: "Natural gas combustion", value: "Natural gas combustion" },
        { label: "Diesel fuel combustion", value: "Diesel fuel combustion" },
        {
          label: "Gasoline fuel consumption",
          value: "Gasoline fuel consumption",
        },
        { label: "Heavy fuel oil", value: "Heavy fuel oil" },
        { label: "LPG consumption", value: "LPG consumption" },
        { label: "Company vehicle fleet", value: "Company vehicle fleet" },
        { label: "Marine vessels", value: "Marine vessels" },
        { label: "Aircraft", value: "Aircraft" },
        { label: "Refrigerant leakage", value: "Refrigerant leakage" },
        { label: "Process emissions", value: "Process emissions" },
        { label: "Emergency generators", value: "Emergency generators" },
        { label: "Other", value: "Other" },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section6.fields.directGHGEmissions.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "indirectGHGEmissions",
      label:
        t('boundarySections.section6.fields.indirectGHGEmissions.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section6.fields.indirectGHGEmissions.placeholder'),
      options: [
        { label: "Purchased electricity", value: "Purchased electricity" },
        { label: "District cooling", value: "District cooling" },
        { label: "District heating", value: "District heating" },
        { label: "Purchased steam", value: "Purchased steam" },
        { label: "Other", value: "Other" },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section6.fields.indirectGHGEmissions.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "electricitySupplyMethod",
      label: t('boundarySections.section6.fields.electricitySupplyMethod.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section6.fields.electricitySupplyMethod.placeholder'),
      options: [
        {
          label: "ADWEA/DEWA grid electricity only",
          value: "ADWEA/DEWA grid electricity only",
        },
        {
          label: "Mix of grid and renewable energy",
          value: "Mix of grid and renewable energy",
        },
        {
          label: "Primarily renewable energy",
          value: "Primarily renewable energy",
        },
        { label: "Off-grid generation", value: "Off-grid generation" },
        { label: "Multiple supply methods", value: "Multiple supply methods" },
      ],
    },
    {
      name: "indirectGHGEmissionsFromTransportation",
      label: t('boundarySections.section6.fields.indirectGHGEmissionsFromTransportation.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section6.fields.indirectGHGEmissionsFromTransportation.placeholder'),
      options: [
        { label: "Business travel", value: "Business travel" },
        { label: "Employee commuting", value: "Employee commuting" },
        {
          label: "Upstream transportation of purchased materials",
          value: "Upstream transportation of purchased materials",
        },
        {
          label: "Downstream transportation of sold products",
          value: "Downstream transportation of sold products",
        },
        {
          label: "Third-party logistics services",
          value: "Third-party logistics services",
        },
        { label: "Prisoner transportation", value: "Prisoner transportation" },
        {
          label: "Court appearances and legal proceedings",
          value: "Court appearances and legal proceedings",
        },
      ],
      showWhen: [
        {
          field: "ghgProtocolScopes",
          value: "Scope 3 - Value Chain Emissions (Recommended)",
          operator: "contains",
        },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section6.fields.indirectGHGEmissionsFromTransportation.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "indirectGHGEmissionsFromProducts",
      label:
        t('boundarySections.section6.fields.indirectGHGEmissionsFromProducts.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section6.fields.indirectGHGEmissionsFromProducts.placeholder'),
      options: [
        {
          label: "Purchased goods and services",
          value: "Purchased goods and services",
        },
        { label: "Capital goods", value: "Capital goods" },
        {
          label: "Leased assets (upstream)",
          value: "Leased assets (upstream)",
        },
        { label: "Outsourced activities", value: "Outsourced activities" },
        { label: "Equipment and supplies", value: "Equipment and supplies" },
        {
          label: "Uniforms and protective equipment",
          value: "Uniforms and protective equipment",
        },
      ],
      showWhen: [
        {
          field: "ghgProtocolScopes",
          value: "Scope 3 - Value Chain Emissions (Recommended)",
          operator: "contains",
        },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section6.fields.indirectGHGEmissionsFromProducts.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "indirectGHGEmissionsAssociated",
      label:
        t('boundarySections.section6.fields.indirectGHGEmissionsAssociated.label'),
      type: "multiselect",
      required: true,
      placeholder:
        t('boundarySections.section6.fields.indirectGHGEmissionsAssociated.placeholder'),
      options: [
        { label: "Use of sold products", value: "Use of sold products" },
        {
          label: "End-of-life treatment of sold products",
          value: "End-of-life treatment of sold products",
        },
        {
          label: "Leased assets (downstream)",
          value: "Leased assets (downstream)",
        },
        { label: "Franchises", value: "Franchises" },
        {
          label: "Public services provided",
          value: "Public services provided",
        },
      ],
      showWhen: [
        {
          field: "ghgProtocolScopes",
          value: "Scope 3 - Value Chain Emissions (Recommended)",
          operator: "contains",
        },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section6.fields.indirectGHGEmissionsAssociated.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "indirectGHGEmissionsFromOtherSources",
      label: t('boundarySections.section6.fields.indirectGHGEmissionsFromOtherSources.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section6.fields.indirectGHGEmissionsFromOtherSources.placeholder'),
      options: [
        { label: "Investments", value: "Investments" },
        { label: "Waste treatment", value: "Waste treatment" },
        {
          label: "Water treatment and supply",
          value: "Water treatment and supply",
        },
        {
          label: "Community outreach and public events",
          value: "Community outreach and public events",
        },
        {
          label: "Training and education programs",
          value: "Training and education programs",
        },
        {
          label: "Other sources not covered above",
          value: "Other sources not covered above",
        },
      ],
      showWhen: [
        {
          field: "ghgProtocolScopes",
          value: "Scope 3 - Value Chain Emissions (Recommended)",
          operator: "contains",
        },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section6.fields.indirectGHGEmissionsFromOtherSources.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "relevantCategories",
      label: t('boundarySections.section6.fields.relevantCategories.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section6.fields.relevantCategories.placeholder'),
      options: [
        {
          label: "Purchased goods and services",
          value: "Purchased goods and services",
        },
        { label: "Capital goods", value: "Capital goods" },
        {
          label: "Fuel and energy-related activities",
          value: "Fuel and energy-related activities",
        },
        {
          label: "Upstream transportation & distribution",
          value: "Upstream transportation & distribution",
        },

        {
          label: "Waste generated in operations",
          value: "Waste generated in operations",
        },
        { label: "Business travel", value: "Business travel" },
        { label: "Employee commuting", value: "Employee commuting" },
        { label: "Upstream leased assets", value: "Upstream leased assets" },
        {
          label: "Downstream transportation & distribution",
          value: "Downstream transportation & distribution",
        },
        {
          label: "Processing of sold products",
          value: "Processing of sold products",
        },
        { label: "Use of sold products", value: "Use of sold products" },
        {
          label: "End-of-life treatment of sold products",
          value: "End-of-life treatment of sold products",
        },
        {
          label: "Downstream leased assets",
          value: "Downstream leased assets",
        },
        { label: "Franchises", value: "Franchises" },
      ],
      showWhen: [
        {
          field: "ghgProtocolScopes",
          value: "Scope 3 - Value Chain Emissions (Recommended)",
          operator: "contains",
        },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section6.fields.relevantCategories.errorRequired');
          } else {
            return null;
          }
        },
      },
    },
  ];

  const handleFormSubmit = (data: any) => {
    console.log("Section6 form submitted:", data);
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
          fields={fields.filter(f => ['ghgProtocolScopes'].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.g1}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('g1')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('g1')}
          confirmationMessage="Are you sure you want to save the selection information?"
        />
      </div>
      <div data-form-id="g2">
        <WorkingConditionalForm
          key={`g2-${locale}`}
          fields={fields.filter(f => ['directGHGEmissions'].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.g2}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('g2')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('g2')}
          confirmationMessage="Are you sure you want to save the scope 1 information?"
        />
      </div>
      <div data-form-id="g3">
        <WorkingConditionalForm
          key={`g3-${locale}`}
          fields={fields.filter(f => ['indirectGHGEmissions','electricitySupplyMethod'].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.g3}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('g3')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('g3')}
          confirmationMessage="Are you sure you want to save the scope 2 information?"
        />
      </div>
      <div data-form-id="g4">
        <WorkingConditionalForm
          key={`g4-${locale}`}
          fields={fields.filter(f => ['indirectGHGEmissionsFromTransportation','indirectGHGEmissionsFromProducts','indirectGHGEmissionsAssociated','indirectGHGEmissionsFromOtherSources','relevantCategories'].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.g4}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('g4')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('g4')}
          confirmationMessage="Are you sure you want to save the scope 3 information?"
        />
      </div>
    </div>
    </div>
  );
};

export default Section6;

// fields are confirmed.

