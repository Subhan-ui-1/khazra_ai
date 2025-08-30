import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React from "react";

interface Section4Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
}
const Section4: React.FC<Section4Props> = ({ onFormSubmit, isCompleted }) => {
  const fields: ConditionalField[] = [
    {
      name: "primaryOperatingCountry",
      label: "Primary Operating Country",
      type: "dropdown",
      required: true,
      placeholder: "Select your primary operating country",
      options: [
        { label: "United Arab Emirates", value: "United Arab Emirates" },
        { label: "Others", value: "Other" },
      ],
    },
    {
      name: "primaryOperating",
      label: "Primary Operating Emirate",
      type: "dropdown",
      required: true,
      placeholder: "Select your primary operating emirate",
      options: [
        { label: "Abu Dhabi", value: "Abu Dhabi" },
        { label: "Dubai", value: "Dubai" },
        { label: "Sharjah", value: "Sharjah" },
        { label: "Ajman", value: "Ajman" },
        { label: "Ras Al Khaimah", value: "Ras Al Khaimah" },
        { label: "Fujairah", value: "Fujairah" },
        { label: "Umm Al Quwain", value: "Umm Al Quwain" },
        { label: "Multiple Emirates", value: "Multiple Emirates" },
      ],
    },
    {
      name: "abroadOperations",
      label: "Do you have operations outside UAE?",
      type: "dropdown",
      required: true,
      placeholder: "Select your operations outside UAE",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      showWhen: [{ field: "primaryOperatingCountry", value: "United Arab Emirates" }],
    },
    {
      name: "operationsCountries",
      label: "Which Countries",
      type: "multiselect",
      required: true,
      placeholder: "Select the countries",
      options: [
        { label: "Pakistan", value: "Pakistan" },
        { label: "Saudi Arabia", value: "Saudi Arabia" },
        { label: "Other", value: "Other" },
      ],
      showWhen: [
        { field: "primaryOperatingCountry", value: "United Arab Emirates" },
        { field: "abroadOperations", value: "Yes" },
      ],
      validation: {
        custom: (value, formData)=>{
          if(value.length===0){
            return "Countries is required";
          } else {
            return null;
          }
        }
      }
    },
    {
      name: "percentageOperations",
      label: "What percentage of total operations is outside UAE?",
      type: "dropdown",
      required: true,
      placeholder: "Select the percentage of total operations is outside UAE",
      options: [
        { label: "<10%", value: "<10%" },
        { label: "10-25%", value: "10-25%" },
        { label: "25-50%", value: "25-50%" },
        { label: "50-75%", value: "50-75%" },
        { label: ">75%", value: ">75%" },
      ],
      showWhen: [
        { field: "abroadOperations", value: "Yes" },
        { field: "primaryOperatingCountry", value: "United Arab Emirates" },
      ],
    },
    {
      name: "geographicReportingScope",
      label: "Geographic Reporting Scope",
      type: "dropdown",
      required: true,
      placeholder: "Select the geographic reporting scope",
      options: [
        { label: "UAE operations only", value: "UAE operations only" },
        { label: "GCC region operations", value: "GCC region operations" },
        { label: "MENA region operations", value: "MENA region operations" },
        { label: "Global operations", value: "Global operations" },
      ],
    },
    {
      name: "facilityInventoryAvailable",
      label: "Complete facility inventory available?",
      type: "dropdown",
      required: true,
      placeholder: "Select the complete facility inventory available",
      options: [
        {
          label: "Complete inventory with addresses and activities",
          value: "Complete inventory with addresses and activities",
        },
        {
          label: "Partial inventory (major facilities only)",
          value: "Partial inventory (major facilities only)",
        },
        {
          label: "Inventory needs to be developed",
          value: "Inventory needs to be developed",
        },
        {
          label: "External audit of facilities required",
          value: "External audit of facilities required",
        },
      ],
    },
    {
      name: "crossBorderActivities",
      label: "Cross-border activities documentation",
      type: "dropdown",
      required: true,
      placeholder: "Select the cross-border activities documentation",
      options: [
        {
          label: "All cross-border activities documented",
          value: "All cross-border activities documented",
        },
        {
          label: "Major cross-border activities documented",
          value: "Major cross-border activities documented",
        },
        {
          label: "Limited documentation of cross-border activities",
          value: "Limited documentation of cross-border activities",
        },
        {
          label: "No current cross-border activities",
          value: "No current cross-border activities",
        },
      ],
    },
    {
      name: "doYouHaveFacilities",
      label: "Do you have owned facilities?",
      type: "dropdown",
      required: true,
      placeholder: "Do you have Facilities?",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "ownedFacilities",
      label: "How many owned facilities?",
      type: "number",
      required: true,
      min: 1,
      placeholder: "Enter the number of owned facilities",
      showWhen: [{ field: "doYouHaveFacilities", value: "Yes" }],
    },
    {
      name: "typesOfFacilities",
      label: "Types of owned facilities?",
      type: "multiselect",
      required: true,
      placeholder: "Select the types of owned facilities",
      options: [
        { label: "Offices", value: "Offices" },
        { label: "Manufacturing", value: "Manufacturing" },
        { label: "Warehouses", value: "Warehouses" },
        { label: "Retail", value: "Retail" },
        { label: "Hotels", value: "Hotels" },
        { label: "Police Stations", value: "Police Stations" },
        { label: "Training Centers", value: "Training Centers" },
        { label: "Other", value: "Other" },
      ],
      showWhen: [{ field: "doYouHaveFacilities", value: "Yes" }],
      validation: {
        custom: (value, formData)=>{
          if(value.length===0){
            return "Types of owned facilities is required";
          } else {
            return null;
          }
        }
      }
    },
    {
      name: "haveLeasedFacilities",
      label: "Do you have leased facilities?",
      type: "dropdown",
      required: true,
      placeholder: "Select the leased facilities",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "leasedFacilities",
      label: "How many leased facilities?",
      type: "number",
      required: true,
      min: 1,
      placeholder: "Enter the number of leased facilities",
      showWhen: [{ field: "haveLeasedFacilities", value: "Yes" }],
    },
    {
      name: "leasedFacilitiesNames",  // need to ask for confirmation
      label: "Do you pay utilities for leased facilities?",
      type: "dropdown",
      required: true,
      placeholder: "Select how?",
      options: [
        { label: "All", value: "All" },
        { label: "Some", value: "Some" },
        { label: "None", value: "None" },
      ],
      showWhen: [{ field: "haveLeasedFacilities", value: "Yes" }],
    },
    {
      name: "haveMobileAssets",
      label: "Do you have mobile assets? (vehicles)",
      type: "dropdown",
      required: true,
      placeholder: "Select the mobile assets",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "typesOfVehicles",
      label: "Types of vehicles?",
      type: "multiselect",
      required: true,
      placeholder: "Select the types of vehicles",
      options: [
        { label: "Patrol Cars", value: "Patrol Cars" },
        { label: "Motorcycles", value: "Motorcycles" },
        { label: "Trucks", value: "Trucks" },
        { label: "Buses", value: "Buses" },
        { label: "Marine Vessels", value: "Marine Vessels" },
        { label: "Aircraft", value: "Aircraft" },
        { label: "Construction Equipment", value: "Construction Equipment" },
        { label: "Emergency Vehicles", value: "Emergency Vehicles" },
        { label: "Other", value: "Other" },
      ],
      showWhen: [{ field: "haveMobileAssets", value: "Yes" }],
      validation: {
        custom: (value, formData)=>{
          if(value.length===0){
            return "Types of vehicles is required";
          } else {
            return null;
          }
        }
      }
    },
    {
      name: "numberOfVehicles",
      label: "Approximate number of vehicles?",
      type: "dropdown",
      required: true,
      placeholder: "Enter the approximate number of vehicles",
      options: [
        { label: "1-10", value: "1-10" },
        { label: "11-50", value: "11-50" },
        { label: "51-250", value: "51-250" },
        { label: "251-1000", value: "251-1000" },
        { label: "1000+", value: "1000+" },
      ],
      showWhen: [{ field: "haveMobileAssets", value: "Yes" }],
    },
    {
      name: "haveStationary",
      label: "Do you have stationary equipment?",
      type: "dropdown",
      required: true,
      placeholder: "Select the stationary equipment",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "typesOfEquipment",
      label: "Types of equipment?",
      type: "multiselect",
      required: true,
      placeholder: "Select the types of equipment",
      options: [
        { label: "Boilers", value: "Boilers" },
        { label: "Generators", value: "Generators" },
        { label: "HVAC Systems", value: "HVAC Systems" },
        { label: "Industrial Equipment", value: "Industrial Equipment" },
        { label: "Refrigeration", value: "Refrigeration" },
        { label: "Communication Equipment", value: "Communication Equipment" },
        { label: "Other", value: "Other" },
      ],
      showWhen: [{ field: "haveStationary", value: "Yes" }],
      validation: {
        custom: (value, formData)=>{
          if(value.length===0){
            return "Types of equipment is required";
          } else {
            return null;
          }
        }
      }
    },
    {
      name: "districtCooling",
      label: "Do you use district cooling?",
      type: "dropdown",
      required: true,
      placeholder: "Select the district cooling",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "percentageOfDistrictCooling",
      label: "For what percentage of your cooling needs?",
      type: "dropdown",
      required: true,
      placeholder: "Select the percentage of your cooling needs",
      options: [
        { label: "<25%", value: "<25%" },
        { label: "25-50%", value: "25-50%" },
        { label: "50-75%", value: "50-75%" },
        { label: ">75%", value: ">75%" },
      ],
      showWhen: [{ field: "districtCooling", value: "Yes" }],
    },
    {
      name: "emissionGeneratingActivities",
      label: "All emission-generating activities identified?",
      type: "dropdown",
      required: true,
      placeholder: "Select the emission-generating activities",
      options: [
        {
          label: "Comprehensive activity assessment completed",
          value: "Comprehensive activity assessment completed",
        },
        {
          label: "Major activities identified, minor activities estimated",
          value: "Major activities identified, minor activities estimated",
        },
        {
          label: "Preliminary assessment only",
          value: "Preliminary assessment only",
        },
        {
          label: "Activity assessment not yet conducted",
          value: "Activity assessment not yet conducted",
        },
      ],
    },
    {
      name: "activityDataCollection",
      label: "Activity data collection systems in place?",
      type: "dropdown",
      required: true,
      placeholder: "Select the data collection systems",
      options: [
        {
          label: "Comprehensive data systems operational",
          value: "Comprehensive data systems operational",
        },
        {
          label: "Partial data systems, some manual collection",
          value: "Partial data systems, some manual collection",
        },
        {
          label: "Mainly manual data collection",
          value: "Mainly manual data collection",
        },
        {
          label: "Data systems need to be established",
          value: "Data systems need to be established",
        },
      ],
    },
  ];
  const handleSubmit = (data: any) => {
    console.log(data);
    onFormSubmit(data);
  };
  return (
    <div className="space-y-10">
      {!isCompleted ? (
        <WorkingConditionalForm fields={fields} onSubmit={handleSubmit} submitText="Save & Continue" title="Geographic & Operational Boundaries" className="" />
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
              <p className="text-green-700">Geographic & Operational Boundaries has been configured successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section4;

// fields are confirmed. 