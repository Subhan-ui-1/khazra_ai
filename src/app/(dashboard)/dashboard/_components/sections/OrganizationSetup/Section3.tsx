import React, { useState } from "react";
import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import { useI18n } from "@/i18n/context";

interface Section3Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}
const Section3: React.FC<Section3Props> = ({
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
  const formOrder = ['g1', 'g2', 'g3', 'g4'];
  const formTitles = {
    g1: t('boundarySections.section3.titles.controlOwnership'),
    g2: t('boundarySections.section3.titles.ventures'),
    g3: t('boundarySections.section3.titles.franchisedOps'),
    g4: t('boundarySections.section3.titles.otherConsiderations')
  };
  // organizationalControlApproach,
  // legalOwnership,
  // subsidiaries,
  // reportingBoundary,
  // assessmentCompleted,
  // controlPercentage,
  // ventures,
  // ownershipPercentage,
  // ventureAgreements,
  // decisionMakingAuthority,
  // franchisedLocations,
  // franchisee,
  // leasedOperations,
  // ownershipStructures,
  // structureExpected,
  const fields: ConditionalField[] = [
    {
      name: "organizationalControlApproach",
      label: t('boundarySections.section3.fields.organizationalControlApproach.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.organizationalControlApproach.placeholder'),
      options: [
        {
          label:
            "Financial Control (include operations where we have financial control)",
          value:
            "Financial Control (include operations where we have financial control)",
        },
        {
          label:
            "Operational Control (include operations where we have operational control)",
          value:
            "Operational Control (include operations where we have operational control)",
        },
        {
          label:
            "Equity Share (include operations based on our ownership percentage)",
          value:
            "Equity Share (include operations based on our ownership percentage)",
        },
      ],
    },
    {
      name: "legalOwnership",
      label: t('boundarySections.section3.fields.legalOwnership.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.legalOwnership.placeholder'),
      options: [
        {
          label: "Full legal documentation available",
          value: "Full legal documentation available",
        },
        {
          label: "Partial documentation available",
          value: "Partial documentation available",
        },
        {
          label: "Documentation needs to be gathered",
          value: "Documentation needs to be gathered",
        },
        {
          label: "External legal support needed",
          value: "External legal support needed",
        },
      ],
    },
    {
      name: "subsidiariesQuestion",
      label: t('boundarySections.section3.fields.subsidiariesQuestion.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.subsidiariesQuestion.placeholder'),
      options: [
        { label: "Yes", value: 'Yes' },
        { label: "No", value: 'No' },
      ],
    },
    {
      name: "subsidiaries",
      label: t('boundarySections.section3.fields.subsidiaries.label'),
      type: "number",
      required: true,
      placeholder: t('boundarySections.section3.fields.subsidiaries.placeholder'),
      showWhen: [{ field: "subsidiariesQuestion", value: 'Yes' }],
      min: 0,
    },
    {
      name: "reportingBoundary",
      label: t('boundarySections.section3.fields.reportingBoundary.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.reportingBoundary.placeholder'),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Partial", value: "Partial" },
      ],
      showWhen: [{ field: "subsidiariesQuestion", value: 'Yes' }],
    },
    {
      name: "assessmentCompleted",
      label: t('boundarySections.section3.fields.assessmentCompleted.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.assessmentCompleted.placeholder'),
      options: [
        { label: "Yes", value: 'true'  },
        { label: "No", value: 'false' },
      ],
      showWhen: [{ field: "subsidiariesQuestion", value: 'Yes' }],
    },
    {
      name: "controlPercentage",
      label: t('boundarySections.section3.fields.controlPercentage.label'),
      type: "textarea",
      required: true,
      placeholder: t('boundarySections.section3.fields.controlPercentage.placeholder'),
      showWhen: [
        { field: "subsidiariesQuestion", value: "Yes" },
        { field: "assessmentCompleted", value: true },
      ],
    },
    {
      name: "jointVentures",
      label: t('boundarySections.section3.fields.jointVentures.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.jointVentures.placeholder'),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "ventures",
      label: t('boundarySections.section3.fields.ventures.label'),
      type: "number",
      required: true,
      placeholder: t('boundarySections.section3.fields.ventures.placeholder'),
      showWhen: [{ field: "jointVentures", value: "Yes" }],
      min: 0,
    },
    {
      name: "ownershipPercentage",
      label: t('boundarySections.section3.fields.ownershipPercentage.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.ownershipPercentage.placeholder'),
      options: [
        { label: "<25%", value: "<25%" },
        { label: "25-50%", value: "25-50%" },
        { label: "50-75%", value: "50-75%" },
        { label: ">75%", value: ">75%" },
        { label: "Varies", value: "Varies" },
      ],
      showWhen: [{ field: "jointVentures", value: "Yes" }],
    },
    {
      name: "ventureAgreements",
      label: t('boundarySections.section3.fields.ventureAgreements.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.ventureAgreements.placeholder'),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Some", value: "Some" },
        { label: "Not specified", value: "Not specified" },
      ],
      showWhen: [{ field: "jointVentures", value: "Yes" }],
    },
    {
      name: "decisionMakingAuthority",
      label: t('boundarySections.section3.fields.decisionMakingAuthority.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.decisionMakingAuthority.placeholder'),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Partially", value: "Partially" },
      ],
      showWhen: [{ field: "jointVentures", value: "Yes" }],
    },
    {
      name: "operateFranchisedLocation",
      label: t('boundarySections.section3.fields.operateFranchisedLocation.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.operateFranchisedLocation.placeholder'),
      options: [
        { label: "Yes", value: 'true' },
        { label: "No", value: 'false' },
      ],
    },
    {
      name: "franchisee",
      label: t('boundarySections.section3.fields.franchisee.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.franchisee.placeholder'),
      options: [
        { label: "Franchisor", value: 'false' },
        { label: "Franchisee", value: 'true' },
      ],
      showWhen: [{ field: "operateFranchisedLocation", value: true }],
    },
    {
      name: "franchisedLocations",
      label: t('boundarySections.section3.fields.franchisedLocations.label'),
      type: "number",
      required: true,
      placeholder: t('boundarySections.section3.fields.franchisedLocations.placeholder'),
      showWhen: [{ field: "operateFranchisedLocation", value: true }],
      min: 0,
    },
    {
      name: "activities",
      label: t('boundarySections.section3.fields.activities.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.activities.placeholder'),
      options: [
        { label: "Yes", value: 'true' },
        { label: "No", value: 'false' },
      ],
    },
    {
      name: "leasedOperations",
      label: t('boundarySections.section3.fields.leasedOperations.label'),
      type: "multiselect",
      required: true,
      placeholder: t('boundarySections.section3.fields.leasedOperations.placeholder'),
      options: [
        { label: "Manufacturing", value: "Manufacturing" },
        { label: "Logistics", value: "Logistics" },
        { label: "IT Services", value: "IT Services" },
        { label: "Facilities Management", value: "Facilities Management" },
        { label: "Other", value: "Other" },
      ],
      showWhen: [{ field: "activities", value: true }],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t('boundarySections.section3.fields.leasedOperations.errorRequired', 'Types of activities is required');
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "complexOwnershipStructure",
      label: t('boundarySections.section3.fields.complexOwnershipStructure.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.complexOwnershipStructure.placeholder'),
      options: [
        { label: "Yes", value: 'true' },
        { label: "No", value: 'false' },
      ],
    },
    {
      name: "ownershipStructures",
      label: t('boundarySections.section3.fields.ownershipStructures.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.ownershipStructures.placeholder'),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Planning to", value: "Planning to" },
      ],
      showWhen: [{ field: "complexOwnershipStructure", value: 'true' }],
    },
    {
      name: "organizationalStructureExpected",
      label: t('boundarySections.section3.fields.organizationalStructureExpected.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.organizationalStructureExpected.placeholder'),
      options: [
        { label: "Yes", value: 'true' },
        { label: "No", value: 'false' },
      ],
    },
    {
      name: "structureExpected",
      label: t('boundarySections.section3.fields.structureExpected.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section3.fields.structureExpected.placeholder'),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Not yet", value: "Not yet" },
      ],
      showWhen: [{ field: "organizationalStructureExpected", value: 'true' }],
    },
  ];
  //   21
  const [partial, setPartial] = React.useState<Record<string, any>>({});
  const [done, setDone] = React.useState({ g1: false, g2: false, g3: false, g4: false });
  const handlePartial = (groupKey: keyof typeof done) => (data: any) => {
    // Save group immediately (per-form update)
    onFormSubmit(data);
    // Keep local aggregated state for UX
    const nextPartial = { ...partial, ...data };
    setPartial(nextPartial);
    const nextDone = { ...done, [groupKey]: true };
    setDone(nextDone);
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
              fields={fields.filter(f => ['organizationalControlApproach','legalOwnership','subsidiariesQuestion','subsidiaries','reportingBoundary','assessmentCompleted','controlPercentage'].includes(f.name))}
              onSubmit={handlePartial('g1')}
              submitText={done.g1 ? 'Saved' : 'Save'}
              title={t('boundarySections.section3.titles.controlOwnership')}
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
              fields={fields.filter(f => ['jointVentures','ventures','ownershipPercentage','ventureAgreements','decisionMakingAuthority'].includes(f.name))}
              onSubmit={handlePartial('g2')}
              submitText={done.g2 ? 'Saved' : 'Save'}
              title={t('boundarySections.section3.titles.ventures')}
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
              fields={fields.filter(f => ['operateFranchisedLocation','franchisee','franchisedLocations'].includes(f.name))}
              onSubmit={handlePartial('g3')}
              submitText={done.g3 ? 'Saved' : 'Save'}
              title={t('boundarySections.section3.titles.franchisedOps')}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
              initialData={{ ...initialData, ...sharedFormData }}
              onModalOpen={() => setCurrentOpenForm('g3')}
              onFormDataChange={handleFormDataChange}
              externalFormData={sharedFormData}
              {...getFormNavigationProps('g3')}
            />
          </div>
          <div data-form-id="g4">
            <WorkingConditionalForm
              fields={fields.filter(f => ['activities','leasedOperations','complexOwnershipStructure','ownershipStructures','organizationalStructureExpected','structureExpected'].includes(f.name))}
              onSubmit={handlePartial('g4')}
              submitText={done.g4 ? 'Saved' : 'Save'}
              title={t('boundarySections.section3.titles.otherConsiderations')}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
              initialData={{ ...initialData, ...sharedFormData }}
              onModalOpen={() => setCurrentOpenForm('g4')}
              onFormDataChange={handleFormDataChange}
              externalFormData={sharedFormData}
              {...getFormNavigationProps('g4')}
            />
          </div>
        </div>
      {/* ) : (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-800">
                Configuration Complete
              </h3>
              <p className="text-green-700">
                Organizational Control & Ownership has been configured
                successfully.
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Section3;

// fields are confirmed.
