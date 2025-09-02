import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React from "react";

interface Section6Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}

const Section6: React.FC<Section6Props> = ({ onFormSubmit, isCompleted, initialData = {} }) => {
  const fields: ConditionalField[] = [
    {
      name: "ghgProtocolScopes",
      label: "Which GHG Protocol Scopes will you track?",
      type: "multiselect",
      required: true,
      placeholder: "Select the GHG Protocol Scopes",
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
      label: "Direct GHG emissions (ISO Category 1 / Scope 1)",
      type: "multiselect",
      required: true,
      placeholder: "Select the Direct GHG emissions",
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
            return "Direct GHG emissions is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "indirectGHGEmissions",
      label:
        "Indirect GHG emissions from imported energy (ISO Category 2 / Scope 2)",
      type: "multiselect",
      required: true,
      placeholder: "Select the Indirect GHG emissions",
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
            return "Indirect GHG emissions is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "electricitySupplyMethod",
      label: "Electricity Supply Method",
      type: "dropdown",
      required: true,
      placeholder: "Select the Electricity Supply Method",
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
      label: "Indirect GHG emissions from transportation (ISO Category 3)",
      type: "multiselect",
      required: true,
      placeholder: "Select the Indirect GHG emissions from transportation",
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
            return "Indirect GHG emissions from transportation is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "indirectGHGEmissionsFromProducts",
      label:
        "Indirect GHG emissions from products used by organization (ISO Category 4)",
      type: "multiselect",
      required: true,
      placeholder: "Select the Indirect GHG emissions from products",
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
            return "Indirect GHG emissions from products is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "indirectGHGEmissionsAssociated",
      label:
        "Indirect GHG emissions associated with use of products from organization (ISO Category 5)",
      type: "multiselect",
      required: true,
      placeholder:
        "Select the Indirect GHG emissions associated with use of products from organization",
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
            return "Indirect GHG emissions associated with use of products is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "indirectGHGEmissionsFromOtherSources",
      label: "Indirect GHG emissions from other sources (ISO Category 6)",
      type: "multiselect",
      required: true,
      placeholder: "Select the Indirect GHG emissions from other sources",
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
            return "Indirect GHG emissions from other sources is required";
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "relevantCategories",
      label: "Which Scope 3 categories are relevant to your business?",
      type: "multiselect",
      required: true,
      placeholder: "Select the relevant categories",
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
            return "Relevant categories is required";
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

  return (
    <div className="space-y-10">
    {/* {!isCompleted ? ( */}
      <div className="space-8 grid grid-cols-2 gap-8">
      <WorkingConditionalForm
        fields={fields.filter(f => ['ghgProtocolScopes'].includes(f.name))}
        onSubmit={handleFormSubmit}
        submitText="Save"
        title="Emission Scopes — Selection"
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        initialData={initialData}
      />
      <WorkingConditionalForm
        fields={fields.filter(f => ['directGHGEmissions'].includes(f.name))}
        onSubmit={handleFormSubmit}
        submitText="Save"
        title="Scope 1 — Direct Emissions"
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        initialData={initialData}
      />
      <WorkingConditionalForm
        fields={fields.filter(f => ['indirectGHGEmissions','electricitySupplyMethod'].includes(f.name))}
        onSubmit={handleFormSubmit}
        submitText="Save"
        title="Scope 2 — Purchased Energy"
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        initialData={initialData}
      />
      <WorkingConditionalForm
        fields={fields.filter(f => ['indirectGHGEmissionsFromTransportation','indirectGHGEmissionsFromProducts','indirectGHGEmissionsAssociated','indirectGHGEmissionsFromOtherSources','relevantCategories'].includes(f.name))}
        onSubmit={handleFormSubmit}
        submitText="Save"
        title="Scope 3 — Value Chain Emissions"
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        initialData={initialData}
      />
    </div>
    </div>
  );
};

export default Section6;

// fields are confirmed.

