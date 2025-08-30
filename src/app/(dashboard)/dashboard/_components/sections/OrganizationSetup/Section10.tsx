import WorkingConditionalForm, {
  ConditionalField,
} from "@/components/forms/WorkingConditionalForm";
import React from "react";

interface Section10Props {
  onFormSubmit: (data: any) => void;
  isCompleted: boolean;
}
const Section10: React.FC<Section10Props> = ({ onFormSubmit, isCompleted }) => {
  const fields: ConditionalField[] = [
    {
      name: "primaryFunctionalCurrency",
      label: "Primary functional currency",
      type: "dropdown",
      required: true,
      placeholder: "Select your primary functional currency",
      options: [
        { label: "AED - UAE Dirham", value: "AED - UAE Dirham" },
        { label: "USD - US Dollar", value: "USD - US Dollar" },
        { label: "EUR - Euro", value: "EUR - Euro" },
        { label: "GBP - British Pound", value: "GBP - British Pound" },
        { label: "Other", value: "Other" },
      ],
    },
    {
      name: "secondaryFunctionalCurrency",
      label: "Secondary reporting currency",
      type: "dropdown",
      required: false,
      placeholder: "Select your secondary reporting currency",
      options: [
        { label: "None", value: "None" },
        { label: "USD - US Dollar", value: "USD - US Dollar" },
        { label: "EUR - Euro", value: "EUR - Euro" },
        { label: "Other", value: "Other" },
      ],
    },
    {
      name: "currencyConversionApproach",
      label: "Currency conversion approach",
      type: "dropdown",
      required: true,
      placeholder: "Select your currency conversion approach",
      options: [
        {
          label: "Average annual exchange rates",
          value: "Average annual exchange rates",
        },
        {
          label: "Month-end exchange rates",
          value: "Month-end exchange rates",
        },
        { label: "Transaction date rates", value: "Transaction date rates" },
        { label: "Fixed rate for the year", value: "Fixed rate for the year" },
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
          <WorkingConditionalForm fields={fields} onSubmit={handleSubmit} submitText="Save & Continue" title="Currency & Financial Boundaries" className="" />
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
              <p className="text-green-700">Currency & Financial Boundaries has been configured successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section10;

// fields are confirmed.
