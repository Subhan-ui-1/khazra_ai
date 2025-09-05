import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React from "react";
import { useI18n } from "@/i18n/context";

interface Section10Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
  initialData?: Record<string, any>;
}
const Section10: React.FC<Section10Props> = ({
  onFormSubmit,
  isCompleted,
  initialData = {},
}) => {
  const { t } = useI18n();
  const fields: ConditionalField[] = [
    {
      name: "primaryFunctionalCurrency",
      label: t('steps.boundary.section10.primaryFunctionalCurrency.label', 'Primary functional currency'),
      type: "dropdown",
      required: true,
      placeholder: t('steps.boundary.section10.primaryFunctionalCurrency.placeholder', 'Select your primary functional currency'),
      options: [
        { label: 'AED - UAE Dirham', value: "AED - UAE Dirham" },
        { label: 'USD - US Dollar', value: "USD - US Dollar" },
        { label: 'EUR - Euro', value: "EUR - Euro" },
        { label: 'GBP - British Pound', value: "GBP - British Pound" },
        { label: 'Other', value: "Other" },
      ],
    },
    {
      name: "secondaryFunctionalCurrency",
      label: t('steps.boundary.section10.secondaryFunctionalCurrency.label', 'Secondary reporting currency'),
      type: "dropdown",
      required: false,
      placeholder: t('steps.boundary.section10.secondaryFunctionalCurrency.placeholder', 'Select your secondary reporting currency'),
      options: [
        { label: 'None', value: "None" },
        { label: 'USD - US Dollar', value: "USD - US Dollar" },
        { label: 'EUR - Euro', value: "EUR - Euro" },
        { label: 'Other', value: "Other" },
      ],
    },
    {
      name: "currencyConversionApproach",
      label: t('steps.boundary.section10.currencyConversionApproach.label', 'Currency conversion approach'),
      type: "dropdown",
      required: true,
      placeholder: t('steps.boundary.section10.currencyConversionApproach.placeholder', 'Select your currency conversion approach'),
      options: [
        {
          label: 'Average annual exchange rates',
          value: "Average annual exchange rates",
        },
        {
          label: 'Month-end exchange rates',
          value: "Month-end exchange rates",
        },
        { label: 'Transaction date rates', value: "Transaction date rates" },
        { label: 'Fixed rate for the year', value: "Fixed rate for the year" },
      ],
    },
  ];
  const handleSubmit = (data: any) => {
    console.log(data);
    onFormSubmit(data);
  };
  return (
    <div className="space-y-10">
      {/* {!isCompleted ? ( */}
        <div className="space-8 grid xl:grid-cols-2 grid-cols-1 gap-8">
        <WorkingConditionalForm
          fields={fields}
          onSubmit={handleSubmit}
          submitText={t('steps.boundary.section10.submit', 'Save & Continue')}
          title={t('steps.boundary.step3.title', 'Currency & Financial Boundaries')}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          groups={[{ title: t('steps.boundary.section10.group.financial', 'Financial Boundaries'), remaining: true }]}
                      initialData={initialData}
    confirmationMessage="Are you sure you want to save the currency & financial boundaries information?"
          />
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
                Currency & Financial Boundaries has been configured
                successfully.
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Section10;

// fields are confirmed.
