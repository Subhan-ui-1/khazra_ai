import React from "react";
import ConditionalFormExample from "@/components/forms/ConditionalFormExample";
import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";

const SIC_CODES = {
  "Energy & Utilities": [
    {
      label: "PS01 - Police Operations and Law Enforcement",
      value: "PS01 - Police Operations and Law Enforcement",
    },
    {
      label: "PS02 - Traffic Management and Road Safety",
      value: "PS02 - Traffic Management and Road Safety",
    },
    {
      label: "PS03 - Emergency Response Services",
      value: "PS03 - Emergency Response Services",
    },
    {
      label: "PS04 - Criminal Investigation Services",
      value: "PS04 - Criminal Investigation Services",
    },
  ],
  "Oil & Gas": [
    {
      label: "PS05 - Community Safety and Crime Prevention",
      value: "PS05 - Community Safety and Crime Prevention",
    },
    {
      label: "PS06 - Border Security and Immigration Control",
      value: "PS06 - Border Security and Immigration Control",
    },
    {
      label: "PS07 - Cyber Security and Digital Crime",
      value: "PS07 - Cyber Security and Digital Crime",
    },
    {
      label: "PS08 - Counter-terrorism and National Security",
      value: "PS08 - Counter-terrorism and National Security",
    },
    {
      label: "PS09 - Maritime Security and Coast Guard",
      value: "PS09 - Maritime Security and Coast Guard",
    },
  ],
  Manufacturing: [
    { label: "PS10 - Aviation Security", value: "PS10 - Aviation Security" },
    {
      label: "PS11 - VIP Protection and Executive Security",
      value: "PS11 - VIP Protection and Executive Security",
    },
    {
      label: "PS12 - Prison and Correctional Services",
      value: "PS12 - Prison and Correctional Services",
    },
    {
      label: "SS01 - Administrative Services",
      value: "SS01 - Administrative Services",
    },
  ],
  "Financial Services": [
    {
      label: "SS02 - Human Resources and Training",
      value: "SS02 - Human Resources and Training",
    },
    {
      label: "SS03 - Information Technology Services",
      value: "SS03 - Information Technology Services",
    },
    {
      label: "SS04 - Fleet Management and Transportation",
      value: "SS04 - Fleet Management and Transportation",
    },
  ],
  "Real Estate & Construction": [
    {
      label: "SS05 - Facilities Management and Maintenance",
      value: "SS05 - Facilities Management and Maintenance",
    },
    {
      label: "SS06 - Procurement and Supply Chain",
      value: "SS06 - Procurement and Supply Chain",
    },
  ],
  "Hospitality & Tourism": [
    {
      label: "SS07 - Finance and Budgeting",
      value: "SS07 - Finance and Budgeting",
    },
  ],
  "Transportation & Logistics": [
    {
      label: "SS08 - Legal Affairs and Compliance",
      value: "SS08 - Legal Affairs and Compliance",
    },
    {
      label: "SS09 - Public Relations and Communications",
      value: "SS09 - Public Relations and Communications",
    },
  ],
  Technology: [
    {
      label: "SS10 - Research and Development",
      value: "SS10 - Research and Development",
    },
  ],
  Healthcare: [
    {
      label: "SU01 - Forensic Sciences and Laboratory Services",
      value: "SU01 - Forensic Sciences and Laboratory Services",
    },
  ],
  "Retail & Consumer Goods": [
    {
      label: "SU02 - K-9 Units and Mounted Police",
      value: "SU02 - K-9 Units and Mounted Police",
    },
  ],
  Agriculture: [
    {
      label: "SU03 - SWAT and Special Operations",
      value: "SU03 - SWAT and Special Operations",
    },
  ],
  "Government/Public Sector": [
    {
      label: "SU04 - Intelligence and Surveillance",
      value: "SU04 - Intelligence and Surveillance",
    },
  ],
  Education: [
    { label: "Other (Please Specify)", value: "Other (Please Specify)" },
  ],
  Other: [{ label: "Dummy", value: "Dummy" }],
};

const today = new Date();

// Format the date as 'YYYY-MM-DD'
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
const day = String(today.getDate()).padStart(2, "0");

const todayFormatted = `${year}-${month}-${day}`;

interface Section1Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
}
const OrganizationSetupSection1: React.FC<Section1Props> = ({
  onFormSubmit,
  isCompleted,
}) => {
  //     industrySector,
  // businessNature,
  // primaryBusinessActivities,
  // standardIndustrialClassification,
  // numberOfEmployees,
  // annualRevenue,
  // businessFormationDate,
  // tradeLicenseNumber,
  // freeZoneOperation,
  const fields: ConditionalField[] = [
    {
      name: "industrySector",
      label: "Industry Sector",
      type: "dropdown",
      required: true,
      placeholder: "Select your industry sector",
      options: [
        { label: "Energy & Utilities", value: "Energy & Utilities" },
        { label: "Oil & Gas", value: "Oil & Gas" },
        { label: "Manufacturing", value: "Manufacturing" },
        { label: "Financial Services", value: "Financial Services" },
        {
          label: "Real Estate & Construction",
          value: "Real Estate & Construction",
        },
        { label: "Hospitality & Tourism", value: "Hospitality & Tourism" },
        {
          label: "Transportation & Logistics",
          value: "Transportation & Logistics",
        },
        { label: "Technology", value: "Technology" },
        { label: "Healthcare", value: "Healthcare" },
        { label: "Retail & Consumer Goods", value: "Retail & Consumer Goods" },
        { label: "Agriculture", value: "Agriculture" },
        {
          label: "Government/Public Sector",
          value: "Government/Public Sector",
        },
        { label: "Education", value: "Education" },
        { label: "Other", value: "Other" },
      ],
    },
    {
      name: "businessNature",
      label: "Business Nature",
      type: "dropdown",
      required: true,
      placeholder: "Choose your business nature",
      options: [
        { label: "Publicly Listed Company", value: "Publicly Listed Company" },
        { label: "Private Company", value: "Private Company" },
        {
          label: "Government Entity/Public Sector",
          value: "Government Entity/Public Sector",
        },
        { label: "State-Owned Enterprise", value: "State-Owned Enterprise" },
        { label: "Non-Profit Organization", value: "Non-Profit Organization" },
        {
          label: "Partnership/Joint Venture",
          value: "Partnership/Joint Venture",
        },
        { label: "Subsidiary/Division", value: "Subsidiary/Division" },
        { label: "Free Zone Entity", value: "Free Zone Entity" },
        { label: "Branch Office", value: "Branch Office" },
      ],
    },
    {
      name: "primaryBusinessActivities",
      label: "Primary Business Activities",
      type: "textarea",
      required: true,
      placeholder: "Describe your primary business activities",
      rows: 4,
      validation: {
        minLength: 50,
        maxLength: 1000,
      },
    },
    {
      name: "standardIndustrialClassification",
      label: "Standard Industrial Classification (SIC) Code",
      type: "dropdown",
      required: true,
      placeholder: "Select your Standard Industrial Classification (SIC) Code",
      dynamicOptions: {
        dependsOn: "industrySector",
        getOptions: (dependentValue: any, allFormData: any) => {
          return SIC_CODES[dependentValue as keyof typeof SIC_CODES];
        },
      },
    },
    {
      name: "numberOfEmployees",
      label: "Number of Employees",
      type: "dropdown",
      required: true,
      placeholder: "Enter the number of employees",
      options: [
        { label: "1-10", value: "1-10" },
        { label: "11-50", value: "11-50" },
        { label: "51-250", value: "51-250" },
        { label: "251-1,000", value: "251-1,000" },
        { label: "1,001-5,000", value: "1,001-5,000" },
        { label: "5,001-10,000", value: "5,001-10,000" },
        { label: "10,001+", value: "10,001+" },
      ],
    },
    {
      name: "annualRevenue",
      label: "Annual Revenue (AED)",
      type: "dropdown",
      required: true,
      placeholder: "Enter the annual revenue",
      options: [
        { label: "Under AED 1 Million", value: "Under AED 1 Million" },
        { label: "AED 1M - 10M", value: "AED 1M - 10M" },
        { label: "AED 10M - 50M", value: "AED 10M - 50M" },
        { label: "AED 50M - 250M", value: "AED 50M - 250M" },
        { label: "AED 250M - 1B", value: "AED 250M - 1B" },
        { label: "AED 1B - 5B", value: "AED 1B - 5B" },
        { label: "Over AED 5B", value: "Over AED 5B" },
      ],
    },
    {
      name: "businessFormationDate",
      label: "Business Formation Date",
      type: "date",
      required: true,
      placeholder: "Select the business formation date",
      validation: {
        max: todayFormatted,
      },
    },
    {
      name: "tradeLicenseNumber",
      label: "UAE Trade License Number",
      type: "input",
      required: true,
      placeholder: "Enter the UAE Trade License Number",
      validation: {
        pattern: /^[A-Z][ -]?\d+$/,
      },
    },
    {
      name: "freeZoneOperationQuestion",
      label: "Free Zone Operation",
      type: "dropdown",
      required: true,
      placeholder: "Select the free zone operation",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "freeZoneOperation",
      label: "Free Zone Name",
      type: "dropdown",
      required: true,
      placeholder: "Enter the free zone name",
      options: [
        { label: "Free Zone 1", value: "Free Zone 1" },
        { label: "Free Zone 2", value: "Free Zone 2" },
        { label: "Free Zone 3", value: "Free Zone 3" },
        { label: "Free Zone 4", value: "Free Zone 4" },
        { label: "Free Zone 5", value: "Free Zone 5" },
        { label: "Free Zone 6", value: "Free Zone 6" },
        { label: "Free Zone 7", value: "Free Zone 7" },
      ],
      showWhen: [{ field: "freeZoneOperationQuestion", value: "Yes" }],
    },
  ];
  const handleSubmit = (data: any) => {
    console.log(data);
    onFormSubmit(data);
  };
  return (
    <div className="space-y-10">
      {!isCompleted ? (
        <WorkingConditionalForm
          fields={fields}
          onSubmit={handleSubmit}
          submitText="Save & Continue"
          title="Organization & Industry Details"
          className=""
        />
      ) : (
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
                Organization & Industry Details has been configured
                successfully.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSetupSection1;

// fields are confirmed.
