import React, { useState } from "react";
import { useI18n } from "@/i18n/context";
import ConditionalFormExample from "@/components/forms/ConditionalFormExample";
import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";

// SIC codes will be constructed after i18n is available

const today = new Date();

// Format the date as 'YYYY-MM-DD'
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
const day = String(today.getDate()).padStart(2, "0");

const todayFormatted = `${year}-${month}-${day}`;

interface Section1Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}
const OrganizationSetupSection1: React.FC<Section1Props> = ({
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
    g1: t('boundarySections.section1.titles.industry'),
    g2: t('boundarySections.section1.titles.businessProfile'),
    g3: t('boundarySections.section1.titles.scaleRevenue'),
    g4: t('boundarySections.section1.titles.otherDetails')
  };
  
  const SIC_CODES = {
    "Energy & Utilities": [
      { label: t('sic.PS01'), value: "PS01 - Police Operations and Law Enforcement" },
      { label: t('sic.PS02'), value: "PS02 - Traffic Management and Road Safety" },
      { label: t('sic.PS03'), value: "PS03 - Emergency Response Services" },
      { label: t('sic.PS04'), value: "PS04 - Criminal Investigation Services" },
    ],
    "Oil & Gas": [
      { label: t('sic.PS05'), value: "PS05 - Community Safety and Crime Prevention" },
      { label: t('sic.PS06'), value: "PS06 - Border Security and Immigration Control" },
      { label: t('sic.PS07'), value: "PS07 - Cyber Security and Digital Crime" },
      { label: t('sic.PS08'), value: "PS08 - Counter-terrorism and National Security" },
      { label: t('sic.PS09'), value: "PS09 - Maritime Security and Coast Guard" },
    ],
    Manufacturing: [
      { label: t('sic.PS10'), value: "PS10 - Aviation Security" },
      { label: t('sic.PS11'), value: "PS11 - VIP Protection and Executive Security" },
      { label: t('sic.PS12'), value: "PS12 - Prison and Correctional Services" },
      { label: t('sic.SS01'), value: "SS01 - Administrative Services" },
    ],
    "Financial Services": [
      { label: t('sic.SS02'), value: "SS02 - Human Resources and Training" },
      { label: t('sic.SS03'), value: "SS03 - Information Technology Services" },
      { label: t('sic.SS04'), value: "SS04 - Fleet Management and Transportation" },
    ],
    "Real Estate & Construction": [
      { label: t('sic.SS05'), value: "SS05 - Facilities Management and Maintenance" },
      { label: t('sic.SS06'), value: "SS06 - Procurement and Supply Chain" },
    ],
    "Hospitality & Tourism": [
      { label: t('sic.SS07'), value: "SS07 - Finance and Budgeting" },
    ],
    "Transportation & Logistics": [
      { label: t('sic.SS08'), value: "SS08 - Legal Affairs and Compliance" },
      { label: t('sic.SS09'), value: "SS09 - Public Relations and Communications" },
    ],
    Technology: [
      { label: t('sic.SS10'), value: "SS10 - Research and Development" },
    ],
    Healthcare: [
      { label: t('sic.SU01'), value: "SU01 - Forensic Sciences and Laboratory Services" },
    ],
    "Retail & Consumer Goods": [
      { label: t('sic.SU02'), value: "SU02 - K-9 Units and Mounted Police" },
    ],
    Agriculture: [
      { label: t('sic.SU03'), value: "SU03 - SWAT and Special Operations" },
    ],
    "Government/Public Sector": [
      { label: t('sic.SU04'), value: "SU04 - Intelligence and Surveillance" },
    ],
    Education: [
      { label: t('sic.OTHER_SPECIFY'), value: "Other (Please Specify)" },
    ],
    Other: [{ label: t('sic.DUMMY'), value: "Dummy" }],
  };
  //     industrySector,
  // businessNature,
  // primaryBusinessActivities,
  // standardIndustrialClassification,
  // numberOfEmployees,
  // annualRevenue,
  // businessFormationDate,
  // tradeLicenseNumber,
  // freeZoneOperation,
  const fields: ConditionalField[] = React.useMemo(() => ([
    {
      name: "industrySector",
      label: t('boundarySections.section1.fields.industrySector.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section1.fields.industrySector.placeholder'),
      options: [
        { label: t('boundarySections.section1.options.industrySector.energyUtilities'), value: 'Energy & Utilities' },
        { label: t('boundarySections.section1.options.industrySector.oilGas'), value: 'Oil & Gas' },
        { label: t('boundarySections.section1.options.industrySector.manufacturing'), value: 'Manufacturing' },
        { label: t('boundarySections.section1.options.industrySector.financialServices'), value: 'Financial Services' },
        { label: t('boundarySections.section1.options.industrySector.realEstateConstruction'), value: 'Real Estate & Construction' },
        { label: t('boundarySections.section1.options.industrySector.hospitalityTourism'), value: 'Hospitality & Tourism' },
        { label: t('boundarySections.section1.options.industrySector.transportationLogistics'), value: 'Transportation & Logistics' },
        { label: t('boundarySections.section1.options.industrySector.technology'), value: 'Technology' },
        { label: t('boundarySections.section1.options.industrySector.healthcare'), value: 'Healthcare' },
        { label: t('boundarySections.section1.options.industrySector.retailConsumer'), value: 'Retail & Consumer Goods' },
        { label: t('boundarySections.section1.options.industrySector.agriculture'), value: 'Agriculture' },
        { label: t('boundarySections.section1.options.industrySector.governmentPublic'), value: 'Government/Public Sector' },
        { label: t('boundarySections.section1.options.industrySector.education'), value: 'Education' },
        { label: t('boundarySections.section1.options.industrySector.other'), value: 'Other' },
      ],
    },
    {
      name: "businessNature",
      label: t('boundarySections.section1.fields.businessNature.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section1.fields.businessNature.placeholder'),
      options: [
        { label: t('boundarySections.section1.options.businessNature.publicListed'), value: 'Publicly Listed Company' },
        { label: t('boundarySections.section1.options.businessNature.privateCompany'), value: 'Private Company' },
        { label: t('boundarySections.section1.options.businessNature.publicSector'), value: 'Government Entity/Public Sector' },
        { label: t('boundarySections.section1.options.businessNature.stateOwned'), value: 'State-Owned Enterprise' },
        { label: t('boundarySections.section1.options.businessNature.nonProfit'), value: 'Non-Profit Organization' },
        { label: t('boundarySections.section1.options.businessNature.partnership'), value: 'Partnership/Joint Venture' },
        { label: t('boundarySections.section1.options.businessNature.subsidiary'), value: 'Subsidiary/Division' },
        { label: t('boundarySections.section1.options.businessNature.freeZone'), value: 'Free Zone Entity' },
        { label: t('boundarySections.section1.options.businessNature.branchOffice'), value: 'Branch Office' },
      ],
    },
    {
      name: "primaryBusinessActivities",
      label: t('boundarySections.section1.fields.primaryBusinessActivities.label'),
      type: "textarea",
      required: true,
      placeholder: t('boundarySections.section1.fields.primaryBusinessActivities.placeholder'),
      rows: 4,
      validation: {
        minLength: 50,
        maxLength: 1000,
      },
    },
    {
      name: "standardIndustrialClassification",
      label: t('boundarySections.section1.fields.standardIndustrialClassification.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section1.fields.standardIndustrialClassification.placeholder'),
      dynamicOptions: {
        dependsOn: "industrySector",
        getOptions: (dependentValue: any, allFormData: any) => {
          return SIC_CODES[dependentValue as keyof typeof SIC_CODES];
        },
      },
    },
    {
      name: "numberOfEmployees",
      label: t('boundarySections.section1.fields.numberOfEmployees.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section1.fields.numberOfEmployees.placeholder'),
      options: [
        { label: t('boundarySections.section1.options.employees.r1'), value: '1-10' },
        { label: t('boundarySections.section1.options.employees.r2'), value: '11-50' },
        { label: t('boundarySections.section1.options.employees.r3'), value: '51-250' },
        { label: t('boundarySections.section1.options.employees.r4'), value: '251-1,000' },
        { label: t('boundarySections.section1.options.employees.r5'), value: '1,001-5,000' },
        { label: t('boundarySections.section1.options.employees.r6'), value: '5,001-10,000' },
        { label: t('boundarySections.section1.options.employees.r7'), value: '10,001+' },
      ],
    },
    {
      name: "annualRevenue",
      label: t('boundarySections.section1.fields.annualRevenue.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section1.fields.annualRevenue.placeholder'),
      options: [
        { label: 'Under AED 1 Million', value: 'Under AED 1 Million' },
        { label: 'AED 1M - 10M', value: 'AED 1M - 10M' },
        { label: 'AED 10M - 50M', value: 'AED 10M - 50M' },
        { label: 'AED 50M - 250M', value: 'AED 50M - 250M' },
        { label: 'AED 250M - 1B', value: 'AED 250M - 1B' },
        { label: 'AED 1B - 5B', value: 'AED 1B - 5B' },
        { label: 'Over AED 5B', value: 'Over AED 5B' },
      ],
    },
    {
      name: "businessFormationDate",
      label: t('boundarySections.section1.fields.businessFormationDate.label'),
      type: "date",
      required: true,
      placeholder: t('boundarySections.section1.fields.businessFormationDate.placeholder'),
      validation: {
        max: todayFormatted,
      },
    },
    {
      name: "tradeLicenseNumber",
      label: t('boundarySections.section1.fields.tradeLicenseNumber.label'),
      type: "input",
      required: true,
      placeholder: t('boundarySections.section1.fields.tradeLicenseNumber.placeholder'),
      validation: {
        pattern: /^[A-Z][ -]?\d+$/,
      },
    },
    {
      name: "freeZoneOperationQuestion",
      label: t('boundarySections.section1.fields.freeZoneOperationQuestion.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section1.fields.freeZoneOperationQuestion.placeholder'),
      options: [
        { label: "Yes", value: 'true' },
        { label: "No", value: 'false' },
      ],
    },
    {
      name: "freeZoneOperation",
      label: t('boundarySections.section1.fields.freeZoneOperation.label'),
      type: "dropdown",
      required: true,
      placeholder: t('boundarySections.section1.fields.freeZoneOperation.placeholder'),
      options: [
        { label: 'Free Zone 1', value: 'Free Zone 1' },
        { label: 'Free Zone 2', value: 'Free Zone 2' },
        { label: 'Free Zone 3', value: 'Free Zone 3' },
        { label: 'Free Zone 4', value: 'Free Zone 4' },
        { label: 'Free Zone 5', value: 'Free Zone 5' },
        { label: 'Free Zone 6', value: 'Free Zone 6' },
        { label: 'Free Zone 7', value: 'Free Zone 7' },
      ],
      showWhen: [{ field: "freeZoneOperationQuestion", value: 'true' }],
    },
  ]), [locale, todayFormatted]);
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
        // Trigger opening the previous form's modal with smooth transition
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
        // Trigger opening the next form's modal with smooth transition
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
              fields={fields.filter(f => ['industrySector','standardIndustrialClassification'].includes(f.name))}
              onSubmit={handlePartial('g1')}
              submitText={t('common.save')}
              title={formTitles.g1}
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
              key={`g2-${locale}`}
              fields={fields.filter(f => ['businessNature','primaryBusinessActivities'].includes(f.name))}
              onSubmit={handlePartial('g2')}
              submitText={t('common.save')}
              title={formTitles.g2}
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
              key={`g3-${locale}`}
              fields={fields.filter(f => ['numberOfEmployees','annualRevenue'].includes(f.name))}
              onSubmit={handlePartial('g3')}
              submitText={t('common.save')}
              title={formTitles.g3}
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
              key={`g4-${locale}`}
              fields={fields.filter(f => !['industrySector','standardIndustrialClassification','businessNature','primaryBusinessActivities','numberOfEmployees','annualRevenue'].includes(f.name))}
              onSubmit={handlePartial('g4')}
              submitText={t('common.save')}
              title={formTitles.g4}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
              initialData={{ ...initialData, ...sharedFormData }}
              onModalOpen={() => setCurrentOpenForm('g4')}
              onFormDataChange={handleFormDataChange}
              externalFormData={sharedFormData}
              {...getFormNavigationProps('g4')}
            />
          </div>
        </div>
      {/* // ) : (
      //   <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
      //     <div className="flex items-center space-x-3">
      //       <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
      //         <svg
      //           className="w-5 h-5 text-white"
      //           fill="none"
      //           stroke="currentColor"
      //           viewBox="0 0 24 24"
      //         >
      //           <path
      //             strokeLinecap="round"
      //             strokeLinejoin="round"
      //             strokeWidth={2}
      //             d="M5 13l4 4L19 7"
      //           />
      //         </svg>
      //       </div>
      //       <div>
      //         <h3 className="text-lg font-medium text-green-800">
      //           Configuration Complete
      //         </h3>
      //         <p className="text-green-700">
      //           Organization & Industry Details has been configured
      //           successfully.
      //         </p>
      //       </div>
      //     </div>
      //   </div>
      // )} */}
    </div>
  );
};

export default OrganizationSetupSection1;

// fields are confirmed.
