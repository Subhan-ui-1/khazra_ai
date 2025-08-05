'use client';

import React, { useState, useEffect } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'phone';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string; flag?: string; code?: string }>;
  validation?: {
    pattern?: RegExp;
    message?: string;
    custom?: (value: any) => { isValid: boolean; message: string };
  };
  maxLength?: number;
  minLength?: number;
  rows?: number;
  disabled?: boolean;
  defaultValue?: any;
  className?: string;
  condition?: (formData: any) => boolean;
  onChange?: (value: any) => void;
}

export interface DynamicFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  confirmationMessage?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  title,
  fields,
  onSubmit,
  onCancel,
  initialData = {},
  loading = false,
  submitText = 'Submit',
  cancelText = 'Cancel',
  showCloseButton = true,
  onClose,
  confirmationMessage = 'Do you really want to perform this action?'
}) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  // Initialize form data with initial values
  useEffect(() => {
    const initialFormData: any = {};
    fields.forEach(field => {
      initialFormData[field.name] = initialData[field.name] || field.defaultValue || '';
    });
    setFormData(initialFormData);
  }, [initialData, fields]);

  const validateField = (name: string, value: any): string => {
    const field = fields.find(f => f.name === name);
    if (!field) return '';

    // Required validation
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`;
    }

    // Skip validation if value is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return '';
    }

    // Pattern validation
    if (field.validation?.pattern && typeof value === 'string') {
      if (!field.validation.pattern.test(value)) {
        return field.validation.message || `${field.label} format is invalid`;
      }
    }

    // Custom validation
    if (field.validation?.custom) {
      const result = field.validation.custom(value);
      if (!result.isValid) {
        return result.message;
      }
    }

    // Phone number validation for phone type fields
    if (field.type === 'phone' && value) {
      const countryCode = formData[`${field.name}CountryCode`];
      if (countryCode && field.validation?.custom) {
        const result = field.validation.custom({ countryCode, phoneNumber: value });
        if (!result.isValid) {
          return result.message;
        }
      }
    }

    // Length validation
    if (typeof value === 'string') {
      if (field.minLength && value.length < field.minLength) {
        return `${field.label} must be at least ${field.minLength} characters`;
      }
      if (field.maxLength && value.length > field.maxLength) {
        return `${field.label} must be no more than ${field.maxLength} characters`;
      }
    }

    return '';
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [name]: '' }));
    }

    // Call custom onChange handler if it exists
    const field = fields.find(f => f.name === name);
    if (field?.onChange) {
      field.onChange(value);
    }

    // For phone fields, also validate when country code changes
    if (name.endsWith('CountryCode')) {
      const phoneFieldName = name.replace('CountryCode', '');
      const phoneValue = formData[phoneFieldName];
      if (phoneValue) {
        const phoneField = fields.find(f => f.name === phoneFieldName);
                 if (phoneField?.type === 'phone' && phoneField.validation?.custom) {
           const result = phoneField.validation.custom({ countryCode: value, phoneNumber: phoneValue });
           if (!result.isValid) {
             setErrors((prev: Record<string, string>) => ({ ...prev, [phoneFieldName]: result.message }));
           } else {
             setErrors((prev: Record<string, string>) => ({ ...prev, [phoneFieldName]: '' }));
           }
         }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all visible fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    const visibleFields = fields.filter(field => !field.condition || field.condition(formData));
    
    visibleFields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      // Show confirmation modal instead of submitting directly
      setPendingFormData(formData);
      setShowConfirmation(true);
    }
  };

  const handleConfirmSubmit = () => {
    if (pendingFormData) {
      onSubmit(pendingFormData);
      setShowConfirmation(false);
      setPendingFormData(null);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
    setPendingFormData(null);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const hasError = errors[field.name];
    const baseInputClasses = `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
      hasError 
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={baseInputClasses}
            disabled={field.disabled}
          />
        );

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseInputClasses}
            disabled={field.disabled}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <select
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            multiple
            className={baseInputClasses}
            disabled={field.disabled}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'phone':
        return (
          <div className="flex gap-2">
            <div className="w-1/5">
              <select
                name={`${field.name}CountryCode`}
                value={formData[`${field.name}CountryCode`] || ''}
                onChange={(e) => handleInputChange(`${field.name}CountryCode`, e.target.value)}
                className={baseInputClasses}
              >
                <option value="">Code</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.flag} {option.code || option.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-4/5">
              <input
                type="tel"
                id={field.name}
                name={field.name}
                value={value}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '');
                  handleInputChange(field.name, numericValue);
                }}
                maxLength={field.maxLength || 9}
                placeholder={field.placeholder}
                className={baseInputClasses}
                disabled={field.disabled}
              />
            </div>
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={baseInputClasses}
            disabled={field.disabled}
          />
        );
    }
  };

  // Group fields into pairs for 2-column layout
  const fieldGroups = [];
  const visibleFields = fields.filter(field => !field.condition || field.condition(formData));
  
  for (let i = 0; i < visibleFields.length; i += 2) {
    fieldGroups.push(visibleFields.slice(i, i + 2));
  }

  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          {fieldGroups.map((group, groupIndex) => (
            <div key={groupIndex} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {group.map((field) => (
                <div key={field.name} className={group.length === 1 ? 'md:col-span-2' : ''}>
                  <label htmlFor={field.name} className='block text-sm font-medium text-gray-700 mb-2'>
                    {field.label} {field.required && '*'}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <div className='mt-1 text-xs text-red-500'>
                      {errors[field.name]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          
          <div className='flex gap-3 pt-4'>
            <button
              type='submit'
              disabled={loading}
              className='bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2'
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {submitText}
                </>
              )}
            </button>
            <button
              type='button'
              onClick={onCancel}
              className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors duration-200'
            >
              {cancelText}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirm Action</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                {confirmationMessage}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelSubmit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DynamicForm; 