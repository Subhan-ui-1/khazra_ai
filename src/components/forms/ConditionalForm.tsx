import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Types for the conditional form system
export interface ConditionalField {
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'dropdown' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any, formData: any) => string | null;
  };
  // Conditional rendering logic
  showWhen?: {
    field: string;
    value: any;
    operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  }[];
  // Field dependencies for complex logic
  dependsOn?: string[];
  // Custom render function for complex field logic
  customRender?: (props: {
    field: ConditionalField;
    value: any;
    onChange: (value: any) => void;
    formData: any;
    errors: Record<string, string>;
  }) => React.ReactNode;
}

export interface ConditionalFormProps {
  fields: ConditionalField[];
  onSubmit: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: Record<string, any>;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  title?: string;
  className?: string;
}

const ConditionalForm: React.FC<ConditionalFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  initialData = {},
  loading = false,
  submitText = 'Submit',
  cancelText = 'Cancel',
  title,
  className = '',
}) => {
  // Form state management
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    const initialFormData: Record<string, any> = {};
    fields.forEach(field => {
      if (initialData[field.name] !== undefined) {
        initialFormData[field.name] = initialData[field.name];
      } else if (field.type === 'checkbox') {
        initialFormData[field.name] = false;
      } else if (field.type === 'multiselect') {
        initialFormData[field.name] = [];
      } else {
        initialFormData[field.name] = '';
      }
    });
    setFormData(initialFormData);
  }, [fields, initialData]);

  // Memoized visible fields based on conditions
  const visibleFields = useMemo(() => {
    return fields.filter(field => {
      if (!field.showWhen || field.showWhen.length === 0) {
        return true;
      }

      return field.showWhen.every(condition => {
        const fieldValue = formData[condition.field];
        const operator = condition.operator || 'equals';

        switch (operator) {
          case 'equals':
            return fieldValue === condition.value;
          case 'notEquals':
            return fieldValue !== condition.value;
          case 'contains':
            return Array.isArray(fieldValue) 
              ? fieldValue.includes(condition.value)
              : String(fieldValue).includes(condition.value);
          case 'greaterThan':
            return Number(fieldValue) > Number(condition.value);
          case 'lessThan':
            return Number(fieldValue) < Number(condition.value);
          case 'in':
            return Array.isArray(condition.value) && condition.value.includes(fieldValue);
          case 'notIn':
            return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
          default:
            return fieldValue === condition.value;
        }
      });
    });
  }, [fields, formData]);

  // Field change handler with validation
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when field is modified
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, [errors]);

  // Validation function
  const validateField = useCallback((field: ConditionalField, value: any): string | null => {
    const validation = field.validation;
    if (!validation) return null;

    // Required validation
    if (validation.required && (value === '' || value === null || value === undefined)) {
      return `${field.label} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!validation.required && (value === '' || value === null || value === undefined)) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be no more than ${validation.maxLength} characters`;
      }
      if (validation.pattern && !validation.pattern.test(value)) {
        return `${field.label} format is invalid`;
      }
    }

    // Number validations
    if (typeof value === 'number' || !isNaN(Number(value))) {
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        return `${field.label} must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return `${field.label} must be no more than ${validation.max}`;
      }
    }

    // Custom validation
    if (validation.custom) {
      const customError = validation.custom(value, formData);
      if (customError) return customError;
    }

    return null;
  }, [formData]);

  // Validate all visible fields
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    visibleFields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [visibleFields, formData, validateField]);

  // Form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validateForm]);

  // Render individual field based on type
  const renderField = useCallback((field: ConditionalField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isTouched = touched[field.name];
    const showError = isTouched && error;

    const commonProps = {
      id: field.name,
      name: field.name,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let newValue: any = e.target.value;
        
        if (field.type === 'checkbox') {
          newValue = (e.target as HTMLInputElement).checked;
        } else if (field.type === 'number') {
          newValue = e.target.value === '' ? '' : Number(e.target.value);
        } else if (field.type === 'multiselect') {
          const select = e.target as HTMLSelectElement;
          const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
          newValue = selectedOptions;
        }
        
        handleFieldChange(field.name, newValue);
      },
      onBlur: () => setTouched(prev => ({ ...prev, [field.name]: true })),
      className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        showError ? 'border-red-500' : 'border-gray-300'
      }`,
      placeholder: field.placeholder,
      required: field.required,
    };

    // Custom render function
    if (field.customRender) {
      return field.customRender({
        field,
        value,
        onChange: (value) => handleFieldChange(field.name, value),
        formData,
        errors,
      });
    }

    switch (field.type) {
      case 'input':
        return (
          <input
            {...commonProps}
            type="text"
            pattern={field.pattern}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 3}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        );

      case 'dropdown':
        return (
          <select {...commonProps}>
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <select {...commonProps} multiple>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            {...commonProps}
            type="checkbox"
            checked={Boolean(value)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            {...commonProps}
            type="date"
          />
        );

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      default:
        return null;
    }
  }, [formData, errors, touched, handleFieldChange]);

  // Reset form
  const handleReset = useCallback(() => {
    setFormData({});
    setErrors({});
    setTouched({});
  }, []);

  return (
    <div className={className}>
      {title && (
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {visibleFields.map(field => (
          <div key={field.name} className="space-y-2">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {renderField(field)}
            
            {errors[field.name] && touched[field.name] && (
              <p className="text-sm text-red-600">{errors[field.name]}</p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {cancelText}
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || isSubmitting ? 'Submitting...' : submitText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConditionalForm;
