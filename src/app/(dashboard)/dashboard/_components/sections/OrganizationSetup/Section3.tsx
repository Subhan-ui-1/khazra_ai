import React from "react";
import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";

interface Section3Props {
    onFormSubmit: (data: any) => void;
    isCompleted: boolean;
}
const Section3: React.FC<Section3Props> = ({ onFormSubmit, isCompleted }) => {
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
      label: "Organizational control Approach",
      type: "dropdown",
      required: true,
      placeholder: "Select your organizational control",
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
      label: "Legal ownership vs operational control documentation",
      type: "dropdown",
      required: true,
      placeholder:
        "Select your legal ownership vs operational control documentation",
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
      label: "Do you have subsidiaries?",
      type: "dropdown",
      required: true,
      placeholder: "Select your subsidiaries",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "subsidiaries",
      label: "How many subsidiaries?",
      type: "number",
      required: true,
      placeholder: "Enter the number of subsidiaries",
      showWhen: [{ field: "subsidiariesQuestion", value: "Yes" }],
      min: 0,
    },
    {
      name: "reportingBoundary",
      label: "Are all subsidiaries included in reporting boundary?",
      type: "dropdown",
      required: true,
      placeholder: "Select your included in reporting boundary",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Partial", value: "Partial" },
      ],
      showWhen: [{ field: "subsidiariesQuestion", value: "Yes" }],
    },
    {
      name: "assessmentCompleted",
      label: "Subsidiary control assessment completed?",
      type: "dropdown",
      required: true,
      placeholder: "Select your subsidiary control assessment completed",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      showWhen: [{ field: "subsidiariesQuestion", value: "Yes" }],
    },
    {
      name: "controlPercentage",
      label: "List all subsidiaries with control percentage",
      type: "textarea",
      required: true,
      placeholder: "Enter the subsidiaries with control percentage",
      showWhen: [
        { field: "subsidiariesQuestion", value: "Yes" },
        { field: "assessmentCompleted", value: true },
      ],
    },
    {
      name: "jointVentures",
      label: "Do you have joint ventures or partnerships?",
      type: "dropdown",
      required: true,
      placeholder: "Select your joint ventures or partnerships",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "ventures",
      label: "How many joint ventures?",
      type: "number",
      required: true,
      placeholder: "Enter the number of joint ventures",
      showWhen: [{ field: "jointVentures", value: "Yes" }],
      min: 0,
    },
    {
      name: "ownershipPercentage",
      label: "Your typical ownership percentage?",
      type: "dropdown",
      required: true,
      placeholder: "Select your ownership percentage",
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
      label: "Joint venture agreements specify GHG responsibility?",
      type: "dropdown",
      required: true,
      placeholder:
        "Select your joint venture agreements specify GHG responsibility",
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
      label: "Decision-making authority for environmental matters documented?",
      type: "dropdown",
      required: true,
      placeholder:
        "Select your decision-making authority for environmental matters documented",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Partially", value: "Partially" },
      ],
      showWhen: [{ field: "jointVentures", value: "Yes" }],
    },
    {
      name: "operateFranchisedLocation",
      label: "Do you operate franchised locations?",
      type: "dropdown",
      required: true,
      placeholder: "Select your operate franchised locations",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "franchisee",
      label: "Are you the franchisor or franchisee?",
      type: "dropdown",
      required: true,
      placeholder: "Select your franchisor or franchisee",
      options: [
        { label: "Franchisor", value: false },
        { label: "Franchisee", value: true },
      ],
      showWhen: [{ field: "operateFranchisedLocation", value: "Yes" }],
    },
    {
      name: "franchisedLocations",
      label: "How many franchised locations?",
      type: "number",
      required: true,
      placeholder: "Enter the number of franchised locations",
      showWhen: [{ field: "operateFranchisedLocation", value: "Yes" }],
      min: 0,
    },
    {
      name: "activities",
      label: "Do you have leased operations or outsourced activities?",
      type: "dropdown",
      required: true,
      placeholder: "Select your leased operations or outsourced activities",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "leasedOperations",
      label: "What types?",
      type: "multiselect",
      required: true,
      placeholder: "Select the types of activities",
      options: [
        { label: "Manufacturing", value: "Manufacturing" },
        { label: "Logistics", value: "Logistics" },
        { label: "IT Services", value: "IT Services" },
        { label: "Facilities Management", value: "Facilities Management" },
        { label: "Other", value: "Other" },
      ],
      showWhen: [{ field: "activities", value: "Yes" }],
      validation: {
        custom: (value, formData)=>{
          if(value.length===0){
            return "Types of activities is required";
          } else {
            return null;
          }
        }
      }
    },
    {
      name: "complexOwnershipStructure",
      label: "Complex ownership structures present?",
      type: "dropdown",
      required: true,
      placeholder: "Select your complex ownership structures present",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "ownershipStructures",
      label: "Professional advice obtained for boundary definition?",
      type: "dropdown",
      required: true,
      placeholder:
        "Select your professional advice obtained for boundary definition",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Planning to", value: "Planning to" },
      ],
      showWhen: [{ field: "complexOwnershipStructure", value: "Yes" }],
    },
    {
      name: "organizationalStructureExpected",
      label: "Changes in organizational structure expected?",
      type: "dropdown",
      required: true,
      placeholder: "Select your changes in organizational structure expected",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "structureExpected",
      label: "Change management process for GHG boundaries defined?",
      type: "dropdown",
      required: true,
      placeholder:
        "Select your change management process for GHG boundaries defined",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Not yet", value: "Not yet" },
      ],
      showWhen: [{ field: "organizationalStructureExpected", value: "Yes" }],
    },
  ];
//   21
  const handleSubmit = (data: any) => {
    console.log(data);
    onFormSubmit(data);
  };
  return (
    <div className="space-y-10">
      {!isCompleted ? (
        <WorkingConditionalForm fields={fields} onSubmit={handleSubmit} submitText="Save & Continue" title="Organizational Control & Ownership" className="" />
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
              <p className="text-green-700">Organizational Control & Ownership has been configured successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section3;


// fields are confirmed.