import React from "react";
import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";

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
}

const Section2: React.FC<Section2Props> = ({ onFormSubmit, isCompleted }) => {
  const fields: ConditionalField[] = [
    {
      name: "existingEnvironmentalManagement",
      label: "Do you have an existing environmental management system?",
      type: "dropdown",
      required: true,
      placeholder: "Select your management system integration",
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
      label: "GHG management integration approach",
      type: "dropdown",
      required: true,
      placeholder: "Select your GHG management integration approach",
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
      label: "Who is responsible for GHG management?",
      type: "dropdown",
      required: true,
      placeholder: "Select the person responsible for GHG management",
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
      label: "GHG Policy Establishment",
      type: "dropdown",
      required: true,
      placeholder: "Select your GHG policy establishment",
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
      label: "Staff competence for GHG quantification",
      type: "dropdown",
      required: true,
      placeholder: "Select your staff competence for GHG quantification",
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
      label: "Training needs assessment completed?",
      type: "dropdown",
      required: true,
      placeholder: "Select your training needs assessment completed",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "trainingAssessed",
      label: "When will training needs be assessed?",
      type: "date",
      required: true,
      placeholder: "Select the date when training needs will be assessed",
      validation: {
        min: todayFormatted,
        max: sixMonthsAgoFormatted,
      },
      showWhen: [{ field: "trainingAssessment", value: "No" }],
    },
  ];

  const handleFormSubmit = (data: any) => {
    console.log("Section2 form submitted:", data);
    onFormSubmit(data);
  };

  return (
    <div className="space-y-6">
      {!isCompleted ? (
        <WorkingConditionalForm
          fields={fields}
          onSubmit={handleFormSubmit}
          submitText="Save & Continue"
          title="GHG Management System Configuration"
          className=""
        />
      ) : (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-800">Configuration Complete</h3>
              <p className="text-green-700">GHG Management System has been configured successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section2;


// fields are confirmed.