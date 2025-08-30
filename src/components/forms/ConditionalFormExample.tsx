import React, { useState } from 'react';
import ConditionalForm, { ConditionalField } from './ConditionalForm';

// Example component demonstrating ConditionalForm usage
const ConditionalFormExample: React.FC = () => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Example fields with complex dependencies
  const fields: ConditionalField[] = [
    {
      name: 'hasCompany',
      label: 'Do you have a company?',
      type: 'dropdown',
      required: true,
      placeholder: 'Select an option',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'input',
      required: true,
      placeholder: 'Enter company name',
      showWhen: [
        { field: 'hasCompany', value: 'yes' }
      ],
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100
      }
    },
    {
      name: 'companyType',
      label: 'Company Type',
      type: 'dropdown',
      required: true,
      placeholder: 'Select company type',
      options: [
        { value: 'startup', label: 'Startup' },
        { value: 'small', label: 'Small Business' },
        { value: 'medium', label: 'Medium Business' },
        { value: 'large', label: 'Large Corporation' }
      ],
      showWhen: [
        { field: 'hasCompany', value: 'yes' }
      ]
    },
    {
      name: 'hasEmployees',
      label: 'Do you have employees?',
      type: 'dropdown',
      required: true,
      placeholder: 'Select an option',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ],
      showWhen: [
        { field: 'hasCompany', value: 'yes' }
      ]
    },
    {
      name: 'employeeCount',
      label: 'Number of Employees',
      type: 'number',
      required: true,
      placeholder: 'Enter employee count',
      min: 1,
      max: 10000,
      showWhen: [
        { field: 'hasCompany', value: 'yes' },
        { field: 'hasEmployees', value: 'yes' }
      ],
      validation: {
        required: true,
        min: 1,
        max: 10000
      }
    },
    {
      name: 'hasOffices',
      label: 'Do you have multiple offices?',
      type: 'dropdown',
      required: true,
      placeholder: 'Select an option',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ],
      showWhen: [
        { field: 'hasCompany', value: 'yes' },
        { field: 'companyType', value: 'large' }
      ]
    },
    {
      name: 'officeLocations',
      label: 'Office Locations',
      type: 'multiselect',
      required: true,
      options: [
        { value: 'us', label: 'United States' },
        { value: 'eu', label: 'Europe' },
        { value: 'asia', label: 'Asia' },
        { value: 'other', label: 'Other' }
      ],
      showWhen: [
        { field: 'hasCompany', value: 'yes' },
        { field: 'hasOffices', value: 'yes' }
      ]
    },
    {
      name: 'hasRevenue',
      label: 'Do you have annual revenue?',
      type: 'dropdown',
      required: true,
      placeholder: 'Select an option',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ],
      showWhen: [
        { field: 'hasCompany', value: 'yes' }
      ]
    },
    {
      name: 'annualRevenue',
      label: 'Annual Revenue (USD)',
      type: 'number',
      required: true,
      placeholder: 'Enter annual revenue',
      min: 0,
      step: 1000,
      showWhen: [
        { field: 'hasCompany', value: 'yes' },
        { field: 'hasRevenue', value: 'yes' }
      ],
      validation: {
        required: true,
        min: 0,
        custom: (value, formData) => {
          if (formData.companyType === 'startup' && value > 1000000) {
            return 'Startup revenue cannot exceed $1M';
          }
          return null;
        }
      }
    },
    {
      name: 'businessDescription',
      label: 'Business Description',
      type: 'textarea',
      placeholder: 'Describe your business',
      rows: 4,
      showWhen: [
        { field: 'hasCompany', value: 'yes' }
      ],
      validation: {
        maxLength: 500
      }
    },
    {
      name: 'isPublic',
      label: 'Is your company publicly traded?',
      type: 'checkbox',
      showWhen: [
        { field: 'hasCompany', value: 'yes' },
        { field: 'companyType', value: 'large' }
      ]
    },
    {
      name: 'stockSymbol',
      label: 'Stock Symbol',
      type: 'input',
      placeholder: 'Enter stock symbol (e.g., AAPL)',
      showWhen: [
        { field: 'hasCompany', value: 'yes' },
        { field: 'companyType', value: 'large' },
        { field: 'isPublic', value: true }
      ],
      validation: {
        required: true,
        pattern: /^[A-Z]{1,5}$/,
        custom: (value) => {
          if (value && !/^[A-Z]{1,5}$/.test(value)) {
            return 'Stock symbol must be 1-5 uppercase letters';
          }
          return null;
        }
      }
    },
    {
      name: 'hasPartners',
      label: 'Do you have business partners?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'maybe', label: 'Maybe in the future' }
      ],
      showWhen: [
        { field: 'hasCompany', value: 'yes' }
      ]
    },
    {
      name: 'partnerNames',
      label: 'Partner Company Names',
      type: 'textarea',
      placeholder: 'List your business partners',
      rows: 3,
      showWhen: [
        { field: 'hasCompany', value: 'yes' },
        { field: 'hasPartners', value: 'yes' }
      ]
    },
    {
      name: 'foundedDate',
      label: 'Company Founded Date',
      type: 'date',
      showWhen: [
        { field: 'hasCompany', value: 'yes' }
      ],
      validation: {
        custom: (value, formData) => {
          if (value) {
            const foundedDate = new Date(value);
            const today = new Date();
            if (foundedDate > today) {
              return 'Founded date cannot be in the future';
            }
          }
          return null;
        }
      }
    },
    {
      name: 'customField',
      label: 'Custom Field',
      type: 'input',
      placeholder: 'This field shows custom logic',
      showWhen: [
        { field: 'employeeCount', value: 100, operator: 'greaterThan' }
      ],
      customRender: ({ field, value, onChange, formData, errors }) => {
        const employeeCount = formData.employeeCount || 0;
        const isLargeCompany = employeeCount > 100;
        
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                isLargeCompany ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
              placeholder={field.placeholder}
            />
            {isLargeCompany && (
              <p className="text-sm text-green-600">
                🎉 Congratulations! You're managing a large company!
              </p>
            )}
          </div>
        );
      }
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFormData(data);
    setLoading(false);
    console.log('Form submitted:', data);
    alert('Form submitted successfully! Check console for data.');
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Conditional Form Example
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ConditionalForm
            title="Company Information Form"
            fields={fields}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            submitText="Submit Company Info"
            cancelText="Cancel"
          />
        </div>

        {/* Data Display Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Form Data Preview
          </h2>
          
          {Object.keys(formData).length === 0 ? (
            <p className="text-gray-500">No data submitted yet. Fill out the form to see data here.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded border">
                  <div className="font-medium text-gray-700">{key}:</div>
                  <div className="text-gray-900">
                    {Array.isArray(value) 
                      ? value.join(', ') 
                      : typeof value === 'boolean' 
                        ? value ? 'Yes' : 'No'
                        : String(value) || 'N/A'
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          How This Form Works:
        </h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Fields appear/disappear based on your selections</li>
          <li>• Complex dependencies: Company type affects available options</li>
          <li>• Custom validation: Startup revenue limits, future date checks</li>
          <li>• Custom rendering: Special styling for large companies</li>
          <li>• All field types supported: input, textarea, dropdown, multiselect, checkbox, radio, date, number</li>
        </ul>
      </div>

      {/* Debug Info */}
      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Debug Information:
        </h3>
        <p className="text-sm text-gray-600">
          Current form data: {JSON.stringify(formData, null, 2)}
        </p>
      </div>
    </div>
  );
};

export default ConditionalFormExample;
