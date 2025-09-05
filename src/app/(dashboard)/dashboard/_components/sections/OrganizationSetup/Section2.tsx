import React, { useState } from "react";
import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import { useI18n } from "@/i18n/context";

const today = new Date();

// Format the date as 'YYYY-MM-DD'
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
const day = String(today.getDate()).padStart(2, "0");

const todayFormatted = `${year}-${month}-${day}`;
const sixMonthsLater = new Date(today);
sixMonthsLater.setMonth(today.getMonth() + 6);

// Format the new date as 'YYYY-MM-DD'
const year6 = sixMonthsLater.getFullYear();
const month6 = String(sixMonthsLater.getMonth() + 1).padStart(2, '0');
const day6 = String(sixMonthsLater.getDate()).padStart(2, '0');

const sixMonthsAgoFormatted = `${year6}-${month6}-${day6}`;

interface Section2Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}

const Section2: React.FC<Section2Props> = ({ onFormSubmit, isCompleted, initialData = {} }) => {
  const { t, locale } = useI18n();
  // State to track which form is currently open in modal
  const [currentOpenForm, setCurrentOpenForm] = useState<string | null>(null);
  
  // Shared form data state to persist data across navigation
  const [sharedFormData, setSharedFormData] = useState<Record<string, any>>({});
  
  // Define the order of forms within this section
  const formOrder = ['overview', 'training'];
  const formTitles = {
    overview: t('boundarySections.section2.titles.overview'),
    training: t('boundarySections.section2.titles.training')
  };
  const fields: ConditionalField[] = [
    {
      name: "existingEnvironmentalManagement",
      label: t('boundarySections.section2.fields.existingEnvironmentalManagement.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section2.fields.existingEnvironmentalManagement.placeholder'),
      options: [
        {
          label: "ISO 14001 certified system",
          value: "ISO 14001 certified system",
        },
        {
          label: "Non-certified environmental management system",
          value: "Non-certified environmental management system",
        },
        {
          label: "Integrated management system (ISO 9001, 14001, 45001)",
          value: "Integrated management system (ISO 9001, 14001, 45001)",
        },
        {
          label: "No formal environmental management system",
          value: "No formal environmental management system",
        },
        { label: "Planning to implement", value: "Planning to implement" },
      ],
    },
    {
      name: "ghgManagementIntegration",
      label: t('boundarySections.section2.fields.ghgManagementIntegration.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section2.fields.ghgManagementIntegration.placeholder'),
      options: [
        {
          label: "Integrate with existing environmental management system",
          value: "Integrate with existing environmental management system",
        },
        {
          label: "Standalone GHG management system",
          value: "Standalone GHG management system",
        },
        {
          label: "Part of broader sustainability management system",
          value: "Part of broader sustainability management system",
        },
        {
          label: "Minimal management system approach",
          value: "Minimal management system approach",
        },
      ],
    },
    {
      name: "responsibleOfGHGManagement",
      label: t('boundarySections.section2.fields.responsibleOfGHGManagement.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section2.fields.responsibleOfGHGManagement.placeholder'),
      options: [
        {
          label: "Senior management (C-level)",
          value: "Senior management (C-level)",
        },
        {
          label: "Environmental/Sustainability manager",
          value: "Environmental/Sustainability manager",
        },
        { label: "Operations manager", value: "Operations manager" },
        { label: "External consultant", value: "External consultant" },
        { label: "Dedicated GHG team", value: "Dedicated GHG team" },
        { label: "Not yet assigned", value: "Not yet assigned" },
      ],
    },
    {
      name: "ghgPolicyEstablishment",
      label: t('boundarySections.section2.fields.ghgPolicyEstablishment.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section2.fields.ghgPolicyEstablishment.placeholder'),
      options: [
        {
          label: "Formal GHG policy already exists",
          value: "Formal GHG policy already exists",
        },
        { label: "Will develop GHG policy", value: "Will develop GHG policy" },
        {
          label: "Integrated in environmental policy",
          value: "Integrated in environmental policy",
        },
        {
          label: "Not planning formal policy",
          value: "Not planning formal policy",
        },
      ],
    },

    // Next subsection from here.
    {
      name: "ghgQuantification",
      label: t('boundarySections.section2.fields.ghgQuantification.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section2.fields.ghgQuantification.placeholder'),
      options: [
        {
          label: "Internal staff fully trained",
          value: "Internal staff fully trained",
        },
        {
          label: "Internal staff partially trained",
          value: "Internal staff partially trained",
        },
        {
          label: "External support required for quantification",
          value: "External support required for quantification",
        },
        {
          label: "Will develop internal competence",
          value: "Will develop internal competence",
        },
        { label: "Not yet assessed", value: "Not yet assessed" },
      ],
    },
    {
      name: "trainingAssessment",
      label: t('boundarySections.section2.fields.trainingAssessment.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section2.fields.trainingAssessment.placeholder'),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "trainingAssessed",
      label: t('boundarySections.section2.fields.trainingAssessed.label'),
      type: "date",
      required: true,
      placeholder: t('boundarySections.section2.fields.trainingAssessed.placeholder'),
      validation: {
        min: todayFormatted as any,
        max: sixMonthsAgoFormatted,
      },
      showWhen: [{ field: "trainingAssessment", value: "No" }],
    },
  ];

  const handleFormSubmit = (data: any) => {
    console.log("Section2 form submitted:", data);
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
      <div data-form-id="overview">
        <WorkingConditionalForm
          key={`overview-${locale}`}
          fields={fields.filter(f => [
            'existingEnvironmentalManagement',
            'ghgManagementIntegration',
            'responsibleOfGHGManagement',
            'ghgPolicyEstablishment',
          ].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.overview}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('overview')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('overview')}
          confirmationMessage="Are you sure you want to save the overview information?"
        />
      </div>
      <div data-form-id="training">
        <WorkingConditionalForm
          key={`training-${locale}`}
          fields={fields.filter(f => [
            'ghgQuantification',
            'trainingAssessment',
            'trainingAssessed',
          ].includes(f.name))}
          onSubmit={handleFormSubmit}
          submitText={t('common.save')}
          title={formTitles.training}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          initialData={{ ...initialData, ...sharedFormData }}
          onModalOpen={() => setCurrentOpenForm('training')}
          onFormDataChange={handleFormDataChange}
          externalFormData={sharedFormData}
          {...getFormNavigationProps('training')}
          confirmationMessage="Are you sure you want to save the training information?"
        />
      </div>
    </div>
    </div>
  );
};

export default Section2;


// fields are confirmed.