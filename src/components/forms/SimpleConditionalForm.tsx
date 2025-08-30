import React, { useState, useEffect } from 'react';

interface Field {
  name: string;
  label: string;
  type: 'input' | 'dropdown';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  showWhen?: {
    field: string;
    value: string;
  }[];
}

interface SimpleConditionalFormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
  title?: string;
}

const SimpleConditionalForm: React.FC<SimpleConditionalFormProps> = ({
  fields,
  onSubmit,
  title
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Initialize form data
  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  }, [fields]);

  // Get visible fields based on conditions
  const getVisibleFields = () => {
    return fields.filter(field => {
      if (!field.showWhen || field.showWhen.length === 0) {
        return true;
      }
      return field.showWhen.every(condition => {
        return formData[condition.field] === condition.value;
      });
    });
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const visibleFields = getVisibleFields();

  return (
    <div className="space-y-6">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {visibleFields.map(field => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'dropdown' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required={field.required}
              >
                <option value="">{field.placeholder || 'Select an option'}</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required={field.required}
              />
            )}
          </div>
        ))}
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      
      {/* Debug info */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Debug - Form Data:</h3>
        <pre className="text-sm">{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default SimpleConditionalForm;
