import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React, { useState } from "react";
import { useI18n } from "@/i18n/context";

const COUNTRIES: string[] = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Côte d’Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

interface Section4Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}
const Section4: React.FC<Section4Props> = ({
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
  const formOrder = ["g1", "g2", "g3", "g4"];
  const formTitles = {
    g1: t("boundarySections.section4.titles.overview"),
    g2: t("boundarySections.section4.titles.facilities"),
    g3: t("boundarySections.section4.titles.assets"),
    g4: t("boundarySections.section4.titles.processes"),
  };
  const fields: ConditionalField[] = [
    {
      name: "primaryOperatingCountry",
      label: t("boundarySections.section4.fields.primaryOperatingCountry.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.primaryOperatingCountry.placeholder"),
      options: [
        { label: "United Arab Emirates", value: "United Arab Emirates" },
        // { label: "Others", value: "Other" },
      ],
    },
    {
      name: "primaryOperating",
      label: t("boundarySections.section4.fields.primaryOperating.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.primaryOperating.placeholder"),
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
      label: t("boundarySections.section4.fields.abroadOperations.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.abroadOperations.placeholder"),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      showWhen: [
        { field: "primaryOperatingCountry", value: "United Arab Emirates" },
      ],
    },
    {
      name: "operationsCountries",
      label: t("boundarySections.section4.fields.operationsCountries.label"),
      type: "multiselect",
      required: true,
      placeholder: t("boundarySections.section4.fields.operationsCountries.placeholder"),
      options: COUNTRIES.map((c) => ({ label: c, value: c })),
      customRender: ({ value, onChange, field }) => {
        const selected: string[] = Array.isArray(value) ? value : [];
        const datalistId = "countries-datalist";
        const handleAdd = (country: string) => {
          if (!country) return;
          if (!selected.includes(country)) {
            onChange([...(selected || []), country]);
          }
        };
        const handleRemove = (country: string) => {
          onChange((selected || []).filter((c: string) => c !== country));
        };
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                list={datalistId}
                placeholder={field.placeholder || t("boundarySections.section4.ui.searchCountries")}
                className="w-full px-3 py-2.5 rounded-lg border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 hover:border-gray-400"
                onChange={(e) => {
                  const country = e.target.value;
                  if (country && COUNTRIES.includes(country)) {
                    handleAdd(country);
                    // clear typed value
                    e.currentTarget.value = "";
                  }
                }}
              />
              <datalist id={datalistId}>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.length === 0 ? (
                <span className="text-sm text-gray-500">
                  {t("boundarySections.section4.ui.noCountriesSelected")}
                </span>
              ) : (
                selected.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm bg-gray-100 border border-gray-300 text-gray-800"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => handleRemove(c)}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      aria-label={`${t("common.delete")}: ${c}`}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        );
      },
      showWhen: [
        { field: "primaryOperatingCountry", value: "United Arab Emirates" },
        { field: "abroadOperations", value: "Yes" },
      ],
      validation: {
        custom: (value, formData) => {
          if (value.length === 0) {
            return t("boundarySections.section4.fields.operationsCountries.errorRequired");
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "percentageOperations",
      label: t("boundarySections.section4.fields.percentageOperations.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.percentageOperations.placeholder"),
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
      label: t("boundarySections.section4.fields.geographicReportingScope.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.geographicReportingScope.placeholder"),
      options: [
        { label: "UAE operations only", value: "UAE operations only" },
        { label: "GCC region operations", value: "GCC region operations" },
        { label: "MENA region operations", value: "MENA region operations" },
        { label: "Global operations", value: "Global operations" },
      ],
    },
    {
      name: "facilityInventoryAvailable",
      label: t("boundarySections.section4.fields.facilityInventoryAvailable.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.facilityInventoryAvailable.placeholder"),
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
      label: t("boundarySections.section4.fields.crossBorderActivities.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.crossBorderActivities.placeholder"),
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
      label: t("boundarySections.section4.fields.doYouHaveFacilities.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.doYouHaveFacilities.placeholder"),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "ownedFacilities",
      label: t("boundarySections.section4.fields.ownedFacilities.label"),
      type: "number",
      required: true,
      min: 1,
      placeholder: t("boundarySections.section4.fields.ownedFacilities.placeholder"),
      showWhen: [{ field: "doYouHaveFacilities", value: "Yes" }],
    },
    {
      name: "typesOfFacilities",
      label: t("boundarySections.section4.fields.typesOfFacilities.label"),
      type: "multiselect",
      required: true,
      placeholder: t("boundarySections.section4.fields.typesOfFacilities.placeholder"),
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
        custom: (value, formData) => {
          if (value.length === 0) {
            return t("boundarySections.section4.fields.typesOfFacilities.errorRequired");
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "haveLeasedFacilities",
      label: t("boundarySections.section4.fields.haveLeasedFacilities.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.haveLeasedFacilities.placeholder"),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "leasedFacilities",
      label: t("boundarySections.section4.fields.leasedFacilities.label"),
      type: "number",
      required: true,
      min: 1,
      placeholder: t("boundarySections.section4.fields.leasedFacilities.placeholder"),
      showWhen: [{ field: "haveLeasedFacilities", value: "Yes" }],
    },
    {
      name: "leasedFacilitiesNames", // need to ask for confirmation
      label: t("boundarySections.section4.fields.leasedFacilitiesNames.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.leasedFacilitiesNames.placeholder"),
      options: [
        { label: "All", value: "All" },
        { label: "Some", value: "Some" },
        { label: "None", value: "None" },
      ],
      showWhen: [{ field: "haveLeasedFacilities", value: "Yes" }],
    },
    {
      name: "haveMobileAssets",
      label: t("boundarySections.section4.fields.haveMobileAssets.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.haveMobileAssets.placeholder"),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "typesOfVehicles",
      label: t("boundarySections.section4.fields.typesOfVehicles.label"),
      type: "multiselect",
      required: true,
      placeholder: t("boundarySections.section4.fields.typesOfVehicles.placeholder"),
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
        custom: (value, formData) => {
          if (value.length === 0) {
            return t("boundarySections.section4.fields.typesOfVehicles.errorRequired");
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "numberOfVehicles",
      label: t("boundarySections.section4.fields.numberOfVehicles.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.numberOfVehicles.placeholder"),
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
      label: t("boundarySections.section4.fields.haveStationary.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.haveStationary.placeholder"),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "typesOfEquipment",
      label: t("boundarySections.section4.fields.typesOfEquipment.label"),
      type: "multiselect",
      required: true,
      placeholder: t("boundarySections.section4.fields.typesOfEquipment.placeholder"),
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
        custom: (value, formData) => {
          if (value.length === 0) {
            return t("boundarySections.section4.fields.typesOfEquipment.errorRequired");
          } else {
            return null;
          }
        },
      },
    },
    {
      name: "districtCooling",
      label: t("boundarySections.section4.fields.districtCooling.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.districtCooling.placeholder"),
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "percentageOfDistrictCooling",
      label: t("boundarySections.section4.fields.percentageOfDistrictCooling.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.percentageOfDistrictCooling.placeholder"),
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
      label: t("boundarySections.section4.fields.emissionGeneratingActivities.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.emissionGeneratingActivities.placeholder"),
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
      label: t("boundarySections.section4.fields.activityDataCollection.label"),
      type: "dropdown",
      required: true,
      placeholder: t("boundarySections.section4.fields.activityDataCollection.placeholder"),
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
  const [partial, setPartial] = React.useState<Record<string, any>>({});
  const [done, setDone] = React.useState({
    g1: false,
    g2: false,
    g3: false,
    g4: false,
  });
  const handlePartial = (groupKey: keyof typeof done) => (data: any) => {
    // Save group immediately (per-form update)
    onFormSubmit(data);
    // Keep local aggregated state for UX (Saved labels, navigation, etc.)
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
          const previousFormElement = document.querySelector(
            `[data-form-id="${previousFormId}"] button`
          );
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
          const nextFormElement = document.querySelector(
            `[data-form-id="${nextFormId}"] button`
          );
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
      onNextForm:
        currentIndex < formOrder.length - 1 ? handleNextForm : undefined,
      hasPreviousForm: currentIndex > 0,
      hasNextForm: currentIndex < formOrder.length - 1,
      previousFormText: t("common.previous"),
      nextFormText: t("common.next"),
    };
  };

  // Handle form data changes to persist across navigation
  const handleFormDataChange = (data: Record<string, any>) => {
    setSharedFormData((prev) => ({ ...prev, ...data }));
  };
  return (
    <div className="space-y-10">
      {/* {!isCompleted ? ( */}
      <div className="space-8 grid xl:grid-cols-2 grid-cols-1 gap-8">
        <div data-form-id="g1">
          <WorkingConditionalForm
            key={`g1-${locale}`}
            fields={fields.filter((f) =>
              [
                "primaryOperatingCountry",
                "primaryOperating",
                "abroadOperations",
                "operationsCountries",
                "percentageOperations",
                "geographicReportingScope",
              ].includes(f.name)
            )}
            onSubmit={handlePartial("g1")}
            submitText={t("common.save")}
            title={formTitles.g1}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            initialData={{ ...initialData, ...sharedFormData }}
            onModalOpen={() => setCurrentOpenForm("g1")}
            onFormDataChange={handleFormDataChange}
            externalFormData={sharedFormData}
            {...getFormNavigationProps("g1")}
          />
        </div>
        <div data-form-id="g2">
          <WorkingConditionalForm
            key={`g2-${locale}`}
            fields={fields.filter((f) =>
              [
                "facilityInventoryAvailable",
                "doYouHaveFacilities",
                "ownedFacilities",
                "typesOfFacilities",
                "haveLeasedFacilities",
                "leasedFacilities",
                "leasedFacilitiesNames",
              ].includes(f.name)
            )}
            onSubmit={handlePartial("g2")}
            submitText={t("common.save")}
            title={formTitles.g2}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            initialData={{ ...initialData, ...sharedFormData }}
            onModalOpen={() => setCurrentOpenForm("g2")}
            onFormDataChange={handleFormDataChange}
            externalFormData={sharedFormData}
            {...getFormNavigationProps("g2")}
          />
        </div>
        <div data-form-id="g3">
          <WorkingConditionalForm
            key={`g3-${locale}`}
            fields={fields.filter((f) =>
              [
                "haveMobileAssets",
                "typesOfVehicles",
                "numberOfVehicles",
                "haveStationary",
                "typesOfEquipment",
                "districtCooling",
                "percentageOfDistrictCooling",
              ].includes(f.name)
            )}
            onSubmit={handlePartial("g3")}
            submitText={t("common.save")}
            title={formTitles.g3}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            initialData={{ ...initialData, ...sharedFormData }}
            onModalOpen={() => setCurrentOpenForm("g3")}
            onFormDataChange={handleFormDataChange}
            externalFormData={sharedFormData}
            {...getFormNavigationProps("g3")}
          />
        </div>
        <div data-form-id="g4">
          <WorkingConditionalForm
            key={`g4-${locale}`}
            fields={fields.filter(
              (f) =>
                ![
                  "primaryOperatingCountry",
                  "primaryOperating",
                  "abroadOperations",
                  "operationsCountries",
                  "percentageOperations",
                  "geographicReportingScope",
                  "facilityInventoryAvailable",
                  "doYouHaveFacilities",
                  "ownedFacilities",
                  "typesOfFacilities",
                  "haveLeasedFacilities",
                  "leasedFacilities",
                  "leasedFacilitiesNames",
                  "haveMobileAssets",
                  "typesOfVehicles",
                  "numberOfVehicles",
                  "haveStationary",
                  "typesOfEquipment",
                  "districtCooling",
                  "percentageOfDistrictCooling",
                ].includes(f.name)
            )}
            onSubmit={handlePartial("g4")}
            submitText={t("common.save")}
            title={formTitles.g4}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            initialData={{ ...initialData, ...sharedFormData }}
            onModalOpen={() => setCurrentOpenForm("g4")}
            onFormDataChange={handleFormDataChange}
            externalFormData={sharedFormData}
            {...getFormNavigationProps("g4")}
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
                Geographic & Operational Boundaries has been configured
                successfully.
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Section4;

// fields are confirmed.
