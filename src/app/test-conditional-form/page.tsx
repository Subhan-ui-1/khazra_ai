"use client";

import React, { useState, useMemo } from 'react';
import WorkingConditionalForm, { ConditionalField } from '@/components/forms/WorkingConditionalForm';
import StepWizardExample from '@/components/StepWizardExample';

// Move fields outside component to prevent recreation
const FIELDS: ConditionalField[] = [
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
    name: 'foundedDate',
    label: 'Company Founded Date',
    type: 'date',
    showWhen: [
      { field: 'hasCompany', value: 'yes' }
    ]
  }
];

// Country data for dynamic options
const countryData = {
  us: {
    states: [
      { value: 'ny', label: 'New York' },
      { value: 'ca', label: 'California' },
      { value: 'tx', label: 'Texas' },
      { value: 'fl', label: 'Florida' }
    ],
    cities: {
      ny: [
        { value: 'nyc', label: 'New York City' },
        { value: 'buffalo', label: 'Buffalo' }
      ],
      ca: [
        { value: 'la', label: 'Los Angeles' },
        { value: 'sf', label: 'San Francisco' }
      ],
      tx: [
        { value: 'houston', label: 'Houston' },
        { value: 'dallas', label: 'Dallas' }
      ]
    }
  },
  ca: {
    states: [
      { value: 'on', label: 'Ontario' },
      { value: 'qc', label: 'Quebec' },
      { value: 'bc', label: 'British Columbia' }
    ],
    cities: {
      on: [
        { value: 'toronto', label: 'Toronto' },
        { value: 'ottawa', label: 'Ottawa' }
      ],
      qc: [
        { value: 'montreal', label: 'Montreal' },
        { value: 'quebec', label: 'Quebec City' }
      ]
    }
  },
  uk: {
    states: [
      { value: 'england', label: 'England' },
      { value: 'scotland', label: 'Scotland' },
      { value: 'wales', label: 'Wales' }
    ],
    cities: {
      england: [
        { value: 'london', label: 'London' },
        { value: 'manchester', label: 'Manchester' }
      ],
      scotland: [
        { value: 'edinburgh', label: 'Edinburgh' },
        { value: 'glasgow', label: 'Glasgow' }
      ]
    }
  }
};

// Location fields with dynamic options
const LOCATION_FIELDS: ConditionalField[] = [
  {
    name: 'country',
    label: 'Country',
    type: 'dropdown',
    required: true,
    placeholder: 'Select a country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' }
    ]
  },
  {
    name: 'state',
    label: 'State/Province',
    type: 'dropdown',
    required: true,
    placeholder: 'Select state/province',
    dynamicOptions: {
      dependsOn: 'country',
      getOptions: (countryValue: string) => {
        if (!countryValue) return [];
        return countryData[countryValue as keyof typeof countryData]?.states || [];
      }
    }
  },
  {
    name: 'city',
    label: 'City',
    type: 'dropdown',
    required: true,
    placeholder: 'Select city',
    dynamicOptions: {
      dependsOn: 'state',
      getOptions: (stateValue: string, allFormData: any) => {
        const countryValue = allFormData.country;
        if (!countryValue || !stateValue) return [];
        const countryCities = countryData[countryValue as keyof typeof countryData]?.cities;
        if (!countryCities) return [];
        return (countryCities as any)[stateValue] || [];
      }
    }
  },
  {
    name: 'postalCode',
    label: 'Postal Code',
    type: 'input',
    required: true,
    placeholder: 'Enter postal code'
  },
  {
    name: 'address',
    label: 'Street Address',
    type: 'textarea',
    required: true,
    placeholder: 'Enter your street address',
    rows: 3
  }
];

const TestConditionalFormPage = () => {
  const [formData, setFormData] = useState<any>({});
  const [locationFormData, setLocationFormData] = useState<any>({});

  // Use stable fields array
  const fields = useMemo(() => FIELDS, []);
  const locationFields = useMemo(() => LOCATION_FIELDS, []);

  const handleCompanySubmit = async (data: any) => {
    console.log('Company form submitted:', data);
    setFormData(data);
    alert('Company form submitted! Check console for data.');
  };

  const handleLocationSubmit = async (data: any) => {
    console.log('Location form submitted:', data);
    setLocationFormData(data);
    alert('Location form submitted! Check console for data.');
  };

  return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto p-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//           Test Conditional Form Examples
//         </h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Company Information Form */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4 text-blue-600">Company Information Form</h2>
//             <WorkingConditionalForm
//               title="Company Information"
//               fields={fields}
//               onSubmit={handleCompanySubmit}
//               submitText="Submit Company Info"
//             />
//           </div>

//           {/* Dynamic Location Form using WorkingConditionalForm */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4 text-green-600">Dynamic Location Form</h2>
//             <p className="text-sm text-gray-600 mb-4">
//               Select a country to see dynamic states and cities appear! Now using WorkingConditionalForm with dynamicOptions.
//             </p>
            
//             <WorkingConditionalForm
//               title="Location Information"
//               fields={locationFields}
//               onSubmit={handleLocationSubmit}
//               submitText="Submit Location"
//             />
//           </div>
//         </div>

//         {/* Form Data Display */}
//         <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {Object.keys(formData).length > 0 && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h2 className="text-lg font-semibold mb-3 text-blue-600">Company Form Data:</h2>
//               <pre className="text-xs bg-white p-3 rounded border overflow-auto">
//                 {JSON.stringify(formData, null, 2)}
//               </pre>
//             </div>
//           )}

//           {Object.keys(locationFormData).length > 0 && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h2 className="text-lg font-semibold mb-3 text-green-600">Location Form Data:</h2>
//               <pre className="text-xs bg-white p-3 rounded border overflow-auto">
//                 {JSON.stringify(locationFormData, null, 2)}
//               </pre>
//             </div>
//           )}
//         </div>

//         {/* Instructions */}
//         <div className="mt-8 bg-blue-50 p-6 rounded-lg">
//           <h3 className="text-lg font-medium text-blue-900 mb-3">How the Dynamic Location Form Works:</h3>
//           <ul className="text-blue-800 space-y-2 text-sm">
//             <li>• <strong>Select a country</strong> (US, Canada, UK)</li>
//             <li>• <strong>States/Provinces appear</strong> based on country selection</li>
//             <li>• <strong>Cities appear</strong> based on state/province selection</li>
//             <li>• <strong>All fields are dynamic</strong> and load based on previous selections</li>
//             <li>• <strong>Form data is preserved</strong> - no fields become empty!</li>
//             <li>• <strong>Now using WorkingConditionalForm</strong> with dynamicOptions feature</li>
//           </ul>
//         </div>

//         {/* Code Example */}
//         <div className="mt-8 bg-gray-800 p-6 rounded-lg text-white">
//           <h3 className="text-lg font-medium mb-3 text-green-400">Code Example - How to Use dynamicOptions:</h3>
//           <pre className="text-xs text-gray-300 overflow-auto">
// {`// Example of a field with dynamic options
// {
//   name: 'state',
//   label: 'State/Province',
//   type: 'dropdown',
//   required: true,
//   placeholder: 'Select state/province',
//   dynamicOptions: {
//     dependsOn: 'country',
//     getOptions: (countryValue: string) => {
//       if (!countryValue) return [];
//       return countryData[countryValue]?.states || [];
//     }
//   }
// }

// // The WorkingConditionalForm will automatically:
// // 1. Update options when 'country' field changes
// // 2. Reset dependent fields (like 'city') when 'country' changes
// // 3. Preserve all other form data`}
//           </pre>
//         </div>
//       </div>
//     </div>
<StepWizardExample />
  );
};

export default TestConditionalFormPage;
