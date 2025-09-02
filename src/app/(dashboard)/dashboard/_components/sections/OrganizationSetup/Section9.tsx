import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React from "react";

interface Section9Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}

const Section9: React.FC<Section9Props> = ({ onFormSubmit, isCompleted, initialData = {} }) => {
  const fields: ConditionalField[] = [
    {
      name: "baselineDataCompleteness",
      label: "Baseline data completeness",
      type: "dropdown",
      required: true,
      placeholder: "Select the baseline data completeness",
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
      label: "Baseline year selection criteria",
      type: "multiselect",
      required: true,
      placeholder: "Select the baseline year selection criteria",
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
            return "Baseline year selection criteria is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "baselineRecalculationPolicy",
      label: "Baseline recalculation policy",
      type: "dropdown",
      required: true,
      placeholder: "Select the baseline recalculation policy",
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
      label: "Baseline recalculation triggers",
      type: "multiselect",
      required: true,
      placeholder: "Select the baseline recalculation triggers",
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
            return "Baseline recalculation triggers is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "changeManagementProcessEstablished",
      label: "Change management process established?",
      type: "dropdown",
      required: true,
      placeholder: "Select the change management process established",
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
      label: "Financial year period Start Date",
      type: "date",
      required: true,
      placeholder: "Select the financial year period Start Date",
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
              return `Start date cannot be more than ${maxFutureYears} years in the future`;
            }

            // Check if end date exists and validate against it
            if (formData.financialYearPeriodEnd) {
              const endDate = new Date(formData.financialYearPeriodEnd);

              if (startDate >= endDate) {
                return "Start date must be before end date";
              }

              // Ensure reasonable date range (e.g., not more than 10 years)
              const maxYears = 10;
              const maxEndDate = new Date(startDate);
              maxEndDate.setFullYear(startDate.getFullYear() + maxYears);

              if (endDate > maxEndDate) {
                return `End date cannot be more than ${maxYears} years after start date`;
              }
            }
          }
          return null; // No error
        },
      },
    },
    {
      name: "financialYearPeriodEnd",
      label: "Financial year period End Date",
      type: "date",
      required: true,
      placeholder: "Select the financial year period End Date",
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
              return `End date cannot be more than ${maxFutureYears} years in the future`;
            }

            // Check if start date exists and validate against it
            if (formData.financialYearPeriodStart) {
              const startDate = new Date(formData.financialYearPeriodStart);

              if (endDate <= startDate) {
                return "End date must be after start date";
              }

              // Ensure reasonable date range (e.g., not more than 10 years)
              const maxYears = 10;
              const maxEndDate = new Date(startDate);
              maxEndDate.setFullYear(startDate.getFullYear() + maxYears);

              if (endDate > maxEndDate) {
                return `End date cannot be more than ${maxYears} years after start date`;
              }
            }
          }
          return null; // No error
        },
      },
    },
    {
      name: "environmentalReportingPeriod",
      label: "Environmental reporting period",
      type: "dropdown",
      required: true,
      placeholder: "Select the environmental reporting period",
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
      label: "Data collection frequency",
      type: "dropdown",
      required: true,
      placeholder: "Select the data collection frequency",
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
      label: "Historical data retention period",
      type: "dropdown",
      required: true,
      placeholder: "Select the historical data retention period",
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
      label: "Data archiving and retrieval system",
      type: "dropdown",
      required: true,
      placeholder: "Select the data archiving and retrieval system",
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

  return (
    <div className="space-y-10">
    {/* {!isCompleted ? ( */}
      <div className="space-8 grid grid-cols-2 gap-8">
      <WorkingConditionalForm
        fields={fields.slice(0,5)}
        onSubmit={handleFormSubmit}
        submitText="Save"
        title="Baseline & Reporting — Core"
         className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        initialData={initialData}
      />
      <WorkingConditionalForm
        fields={fields.slice(5)}
        onSubmit={handleFormSubmit}
        submitText="Save"
        title="Baseline & Reporting — Additional"
         className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        initialData={initialData}
      />
    </div>
    </div>
  );
};

export default Section9;
