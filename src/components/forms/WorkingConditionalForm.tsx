import React, { useState, useMemo, useEffect } from "react";

// Types for the conditional form system
export interface ConditionalField {
  name: string;
  label: string;
  type:
    | "input"
    | "textarea"
    | "dropdown"
    | "multiselect"
    | "checkbox"
    | "radio"
    | "date"
    | "number";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string; defaultSelected?: boolean }>;
  // Dynamic options that change based on other field values
  dynamicOptions?: {
    dependsOn: string; // Field name this depends on
    getOptions: (
      dependentValue: any,
      allFormData: any
    ) => Array<{ value: string; label: string }>;
  };
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
    max?: number | string;
    pattern?: RegExp;
    custom?: (value: any, formData: any) => string | null;
  };
  // Conditional rendering logic
  showWhen?: {
    field: string;
    value: any;
    operator?:
      | "equals"
      | "notEquals"
      | "contains"
      | "greaterThan"
      | "lessThan"
      | "in"
      | "notIn";
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
  groups?: Array<{ title: string; fields?: string[]; remaining?: boolean }>;
}

const WorkingConditionalForm: React.FC<ConditionalFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  initialData = {},
  loading = false,
  submitText = "Submit",
  cancelText = "Cancel",
  title,
  className = "",
  groups,
}) => {
  // Form state management - initialize with default values
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialFormData: Record<string, any> = {};

    // First, populate all fields with their initial values
    fields.forEach((field) => {
      if (initialData[field.name] !== undefined) {
        if (field.type === "multiselect") {
          // For multiselect, merge initial data with default selected options
          const initialValues = Array.isArray(initialData[field.name])
            ? initialData[field.name]
            : [];
          const defaultSelectedValues =
            field.options
              ?.filter((option) => option.defaultSelected)
              .map((option) => option.value) || [];

          // Combine initial values with default selected values, removing duplicates
          const combinedValues = [
            ...new Set([...initialValues, ...defaultSelectedValues]),
          ];
          initialFormData[field.name] = combinedValues;
        } else {
          initialFormData[field.name] = initialData[field.name];
        }
      } else if (field.type === "checkbox") {
        initialFormData[field.name] = false;
      } else if (field.type === "multiselect") {
        // Initialize with default selected options
        const defaultSelectedValues =
          field.options
            ?.filter((option) => option.defaultSelected)
            .map((option) => option.value) || [];
        initialFormData[field.name] = defaultSelectedValues;
      } else {
        initialFormData[field.name] = "";
      }
    });

    // Then, ensure all fields from initialData are included, even if not in fields array
    Object.keys(initialData).forEach((key) => {
      if (initialFormData[key] === undefined) {
        initialFormData[key] = initialData[key];
      }
    });

    // Apply reverse dependency logic: if a dependent field has a value, set its parent field
    fields.forEach((field) => {
      if (field.showWhen && field.showWhen.length > 0) {
        // Check if this field has a value
        const fieldValue = initialFormData[field.name];
        const hasValue =
          fieldValue !== undefined &&
          fieldValue !== "" &&
          fieldValue !== null &&
          !(Array.isArray(fieldValue) && fieldValue.length === 0);

        if (hasValue) {
          // This field has a value, so set its parent field to make it visible
          field.showWhen.forEach((condition) => {
            const parentFieldName = condition.field;
            const requiredValue = condition.value;

            // Only set if the parent field doesn't already have the correct value
            if (initialFormData[parentFieldName] !== requiredValue) {
              initialFormData[parentFieldName] = requiredValue;
            }
          });
        }
      }
    });

    return initialFormData;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useMemo(
    () => `wcf-${Math.random().toString(36).slice(2)}`,
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Determine if we have any initial values for display mode
  const hasInitialValues = useMemo(() => {
    return fields.some((f) => {
      const v = initialData[f.name];
      if (Array.isArray(v)) return v.length > 0;
      return v !== undefined && v !== "" && v !== null;
    });
  }, [fields, initialData]);
  const [isViewing, setIsViewing] = useState<boolean>(hasInitialValues);
  useEffect(() => {
    setIsViewing(hasInitialValues);
  }, [hasInitialValues]);

  // Handle dynamic field updates and initial data changes
  useEffect(() => {
    const newFormData: Record<string, any> = { ...formData };
    let hasChanges = false;

    // First, populate missing fields with defaults
    fields.forEach((field) => {
      if (newFormData[field.name] === undefined) {
        if (field.type === "checkbox") {
          newFormData[field.name] = false;
        } else if (field.type === "multiselect") {
          newFormData[field.name] = [];
        } else {
          newFormData[field.name] = "";
        }
        hasChanges = true;
      }
    });

    // Then, update with any new initial data
    Object.keys(initialData).forEach((key) => {
      if (
        initialData[key] !== undefined &&
        newFormData[key] !== initialData[key]
      ) {
        newFormData[key] = initialData[key];
        hasChanges = true;
      }
    });

    // Apply reverse dependency logic: if a dependent field has a value, set its parent field
    fields.forEach((field) => {
      if (field.showWhen && field.showWhen.length > 0) {
        // Check if this field has a value
        const fieldValue = newFormData[field.name];
        const hasValue =
          fieldValue !== undefined &&
          fieldValue !== "" &&
          fieldValue !== null &&
          !(Array.isArray(fieldValue) && fieldValue.length === 0);

        if (hasValue) {
          // This field has a value, so set its parent field to make it visible
          field.showWhen.forEach((condition) => {
            const parentFieldName = condition.field;
            const requiredValue = condition.value;

            // Only set if the parent field doesn't already have the correct value
            if (newFormData[parentFieldName] !== requiredValue) {
              newFormData[parentFieldName] = requiredValue;
              hasChanges = true;
            }
          });
        }
      }
    });

    if (hasChanges) {
      setFormData(newFormData);
    }
  }, [fields, initialData]);

  // Get dynamic options for a field
  const getFieldOptions = (
    field: ConditionalField
  ): Array<{ value: string; label: string; defaultSelected?: boolean }> => {
    if (field.dynamicOptions) {
      const dependentValue = formData[field.dynamicOptions.dependsOn];
      return field.dynamicOptions.getOptions(dependentValue, formData);
    }
    return field.options || [];
  };

  // Memoized visible fields based on conditions
  const visibleFields = useMemo(() => {
    return fields.filter((field) => {
      if (!field.showWhen || field.showWhen.length === 0) {
        return true;
      }

      // Group conditions by their dependent field name. Within each group, conditions are OR'd.
      // Across groups (different dependent fields), we AND the results.
      const groups: Record<string, typeof field.showWhen> = {} as any;
      field.showWhen.forEach((condition) => {
        const key = condition.field;
        if (!groups[key]) groups[key] = [];
        groups[key]!.push(condition);
      });

      // Helper function to normalize values for comparison
      const normalizeValue = (val: any) => {
        if (typeof val === "string") {
          // Convert string representations of booleans to actual booleans
          if (val === "true") return true;
          if (val === "false") return false;
        }
        return val;
      };

      const compare = (left: any, right: any, operator: string) => {
        const normalizedFieldValue = normalizeValue(left);
        const normalizedConditionValue = normalizeValue(right);
        switch (operator) {
          case "equals":
            return normalizedFieldValue === normalizedConditionValue;
          case "notEquals":
            return normalizedFieldValue !== normalizedConditionValue;
          case "contains":
            return Array.isArray(normalizedFieldValue)
              ? normalizedFieldValue.includes(normalizedConditionValue)
              : String(normalizedFieldValue).includes(
                  String(normalizedConditionValue)
                );
          case "greaterThan":
            return (
              Number(normalizedFieldValue) > Number(normalizedConditionValue)
            );
          case "lessThan":
            return (
              Number(normalizedFieldValue) < Number(normalizedConditionValue)
            );
          case "in":
            return (
              Array.isArray(normalizedConditionValue) &&
              normalizedConditionValue.includes(normalizedFieldValue)
            );
          case "notIn":
            return (
              Array.isArray(normalizedConditionValue) &&
              !normalizedConditionValue.includes(normalizedFieldValue)
            );
          default:
            return normalizedFieldValue === normalizedConditionValue;
        }
      };

      // AND across groups
      return Object.entries(groups).every(([depField, conditions]) => {
        const currentValue = formData[depField];
        // OR within a group
        return conditions!.some((condition) =>
          compare(currentValue, condition.value, condition.operator || "equals")
        );
      });
    });
  }, [fields, formData]);

  const formatDisplayValue = (val: any, field: ConditionalField): string => {
    if (val === undefined || val === null || val === "") return "-";
    if (Array.isArray(val)) return val.length ? val.join(", ") : "-";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (field.type === "date" && typeof val === "string") {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
    }
    if (val.length > 20) return val.substring(0, 30) + "...";
    return String(val);
  };

  // Field change handler with validation and dependent field reset
  const handleFieldChange = (fieldName: string, value: any) => {
    // Convert string representations of booleans to actual booleans
    let normalizedValue = value;
    if (typeof value === "string") {
      if (value === "true") normalizedValue = true;
      else if (value === "false") normalizedValue = false;
    }

    // Find the field to check if it's a date field
    const field = fields.find((f) => f.name === fieldName);
    if (field && field.type === "date" && value) {
      // For date fields, ensure we store the value as-is (YYYY-MM-DD format)
      // The backend should handle the conversion to ISO format if needed
      normalizedValue = value;
    }

    const newFormData = { ...formData, [fieldName]: normalizedValue };

    // Reset dependent fields when a field with dynamicOptions changes
    fields.forEach((field) => {
      if (
        field.dynamicOptions &&
        field.dynamicOptions.dependsOn === fieldName
      ) {
        newFormData[field.name] = field.type === "multiselect" ? [] : "";
      }
    });

    setFormData(newFormData);

    // Clear error when field is modified
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Validation function
  const validateField = (
    field: ConditionalField,
    value: any
  ): string | null => {
    const validation = field.validation;
    if (!validation) return null;

    // Required validation
    if (validation.required) {
      if (field.type === "multiselect") {
        // For multiselect, check if at least one option is selected
        if (!Array.isArray(value) || value.length === 0) {
          return `${field.label} must have at least one option selected`;
        }
      } else if (value === "" || value === null || value === undefined) {
        return `${field.label} is required`;
      }
    }

    // Skip other validations if field is empty and not required
    if (
      !validation.required &&
      (value === "" || value === null || value === undefined)
    ) {
      return null;
    }

    // Date validations
    if (field.type === "date" && value) {
      if (validation.min && new Date(value) < new Date(validation.min)) {
        return `${field.label} must be on or after ${validation.min}`;
      }
      if (validation.max && new Date(value) > new Date(validation.max)) {
        return `${field.label} must be on or before ${validation.max}`;
      }
    }

    // String validations
    if (typeof value === "string") {
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
    if (typeof value === "number" || !isNaN(Number(value))) {
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        return `${field.label} must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && numValue > Number(validation.max)) {
        return `${field.label} must be no more than ${validation.max}`;
      }
    }

    // Custom validation
    if (validation.custom) {
      const customError = validation.custom(value, formData);
      if (customError) return customError;
    }

    return null;
  };

  // Validate all visible fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    visibleFields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit");
    if (!validateForm()) {
      return;
    }

    // Filter out values from hidden fields before submission
    const visibleFormData: Record<string, any> = {};
    visibleFields.forEach((field) => {
      if (formData[field.name] !== undefined) {
        if (field.type === "multiselect") {
          // For multiselect, ensure defaultSelected options are always included
          const currentValues = Array.isArray(formData[field.name])
            ? formData[field.name]
            : [];
          const defaultSelectedValues =
            field.options
              ?.filter((option) => option.defaultSelected)
              .map((option) => option.value) || [];

          // Combine current values with default selected values, removing duplicates
          const combinedValues = [
            ...new Set([...currentValues, ...defaultSelectedValues]),
          ];
          visibleFormData[field.name] = combinedValues;
        } else {
          visibleFormData[field.name] = formData[field.name];
        }
      }
    });

    setIsSubmitting(true);
    try {
      await onSubmit(visibleFormData);
      
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsModalOpen(false);
      setIsSubmitting(false);
      setIsViewing(true);
    }
  };

  // Render individual field based on type
  const renderField = (field: ConditionalField) => {
    const value =
      formData[field.name] !== undefined ? formData[field.name] : "";
    const error = errors[field.name];
    const isTouched = touched[field.name];
    const showError = isTouched && error;
    const fieldOptions = getFieldOptions(field);

    // For dropdowns and dates, ensure the value is properly converted for HTML compatibility
    const getDisplayValue = () => {
      if (field.type === "dropdown") {
        // Convert boolean values to strings for HTML select compatibility
        if (typeof value === "boolean") {
          return value.toString();
        }
        return value;
      } else if (field.type === "date") {
        // Convert ISO date strings to YYYY-MM-DD format for HTML date input
        if (value && typeof value === "string") {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
            }
          } catch (error) {
            console.warn("Invalid date format:", value);
          }
        }
        return value;
      }
      return value;
    };

    const commonProps = {
      id: field.name,
      name: field.name,
      value: getDisplayValue(),
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        let newValue: any = e.target.value;

        if (field.type === "checkbox") {
          newValue = (e.target as HTMLInputElement).checked;
        } else if (field.type === "number") {
          newValue = e.target.value === "" ? "" : Number(e.target.value);
        }

        handleFieldChange(field.name, newValue);
      },
      onBlur: () => setTouched((prev) => ({ ...prev, [field.name]: true })),
      className: `w-full px-3 py-2.5 rounded-lg border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        showError ? "border-red-500" : "border-gray-300 hover:border-gray-400"
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
      case "input":
        return (
          <input
            {...commonProps}
            type="text"
            pattern={field.pattern}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        );

      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 3}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        );

      case "dropdown":
        return (
          <select {...commonProps}>
            <option value="">{field.placeholder || "Select an option"}</option>
            {fieldOptions?.map((option) => (
              <option key={option.value} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className="w-full col-span-2">
            <div className="flex flex-wrap gap-3 max-h-64 overflow-y-auto  border-gray-300 rounded-lg p-3 bg-white">
              {fieldOptions?.map((option) => {
                const selected =
                  Array.isArray(value) && value.includes(option.value);
                const disabled = Boolean(option.defaultSelected);
                const baseCard =
                  "w-[30%] inline-flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm transition-colors ";
                const stateStyles = selected
                  ? "bg-gray-100 border-gray-400 text-black"
                  : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-100";
                const disabledStyles = disabled
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer";
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => {
                      if (disabled) return;
                      const currentValues = Array.isArray(value)
                        ? [...value]
                        : [];
                      if (selected) {
                        const index = currentValues.indexOf(option.value);
                        if (index > -1) currentValues.splice(index, 1);
                      } else {
                        if (!currentValues.includes(option.value))
                          currentValues.push(option.value);
                      }
                      handleFieldChange(field.name, currentValues);
                    }}
                    className={`${baseCard} ${stateStyles} `}
                    aria-pressed={selected}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="font-medium">{option.label}</span>
                      {disabled && (
                        <span className="text-xs text-gray-500">(Default)</span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full border ${
                        selected
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {selected && (
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    {/* Hidden checkbox for accessibility/form semantics */}
                    <input
                      type="checkbox"
                      name={field.name}
                      value={option.value}
                      checked={selected}
                      readOnly
                      className="sr-only"
                    />
                  </button>
                );
              })}
              {fieldOptions?.length === 0 && (
                <p className="col-span-full text-sm text-gray-500 italic">
                  No options available
                </p>
              )}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <input
            {...commonProps}
            type="checkbox"
            checked={Boolean(value)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        );

      case "radio":
        return (
          <div className="space-y-2">
            {fieldOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "date":
        return (
          <input
            {...commonProps}
            max={field.validation?.max}
            min={field.validation?.min}
            type="date"
          />
        );

      case "number":
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
  };

  // Reset form
  const handleReset = () => {
    setFormData({});
    setErrors({});
    setTouched({});
  };
  return (
    <div
      className={`${className} bg-white border border-gray-200 rounded-xl p-5 shadow-sm`}
    >
      <div className="flex justify-between items-center mb-5">
        {title && (
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {title}
          </h2>
        )}
        {isViewing || !hasInitialValues ? (
          <button
            type="button"
            onClick={() => {
              setIsViewing(false);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 h-9 text-sm font-medium text-white bg-[#0D5942] rounded-lg shadow-sm hover:bg-[#0d59428a] focus:outline-none focus:ring-2 focus:ring-[#0d59428b]"
          >
            {hasInitialValues ? "Edit" : "Add"}
          </button>
        ) : null}
      </div>

      {isViewing && hasInitialValues ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleFields.map((field) => {
            const v = formData[field.name];
            const hasValue = Array.isArray(v)
              ? v.length > 0
              : v !== undefined && v !== "" && v !== null;
            if (!hasValue) return null;
            return (
              <div
                key={field.name}
                className="p-3 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div className="text-xs font-medium text-gray-500">
                  {field.label}
                </div>
                <div className="text-gray-900 text-sm mt-1">
                  {formatDisplayValue(v, field)}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[5px]"
            onClick={() => {
              setIsModalOpen(false);
              setIsViewing(true);
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title || "Edit Details"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Update the fields below and click {submitText || "Submit"}{" "}
                    to save.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsViewing(true);
                  }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
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
              </div>
              <form onSubmit={handleSubmit} id={formId}>
                <div className="max-h-[70vh] overflow-y-auto px-5 py-4 space-y-6">
                  {(!groups || groups.length === 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visibleFields.map((field) => {
                        let cmplt = false;
                        if (field.type === "multiselect") {
                          cmplt = true;
                        }
                        return (
                          <div
                            key={field.name}
                            className={`space-y-2 ${cmplt ? "col-span-2" : ""}`}
                          >
                            <label
                              htmlFor={field.name}
                              className="block text-sm font-medium text-gray-700"
                            >
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            {renderField(field)}
                            {field.type === "multiselect"
                              ? errors[field.name] && (
                                  <p className="text-sm text-red-600">
                                    {errors[field.name]}
                                  </p>
                                )
                              : errors[field.name] &&
                                touched[field.name] && (
                                  <p className="text-sm text-red-600">
                                    {errors[field.name]}
                                  </p>
                                )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {groups &&
                    groups.length > 0 &&
                    (() => {
                      const included = new Set<string>();
                      const renderGroup = (group: {
                        title: string;
                        fields?: string[];
                        remaining?: boolean;
                      }) => {
                        let groupFields = [] as typeof visibleFields;
                        if (group.remaining) {
                          groupFields = visibleFields.filter(
                            (f) => !included.has(f.name)
                          );
                        } else if (group.fields && group.fields.length > 0) {
                          groupFields = visibleFields.filter((f) =>
                            group.fields!.includes(f.name)
                          );
                        }
                        groupFields.forEach((f) => included.add(f.name));
                        if (groupFields.length === 0) return null;
                        return (
                          <div key={group.title}>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                              {group.title}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {groupFields.map((field) => (
                                <div key={field.name} className="space-y-2">
                                  <label
                                    htmlFor={field.name}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    {field.label}
                                    {field.required && (
                                      <span className="text-red-500 ml-1">
                                        *
                                      </span>
                                    )}
                                  </label>
                                  {renderField(field)}
                                  {field.type === "multiselect"
                                    ? errors[field.name] && (
                                        <p className="text-sm text-red-600">
                                          {errors[field.name]}
                                        </p>
                                      )
                                    : errors[field.name] &&
                                      touched[field.name] && (
                                        <p className="text-sm text-red-600">
                                          {errors[field.name]}
                                        </p>
                                      )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      };
                      return <>{groups.map((g) => renderGroup(g))}</>;
                    })()}
                </div>
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center px-4 h-9 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Reset
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsViewing(true);
                      }}
                      className="inline-flex items-center px-4 h-9 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {cancelText}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="inline-flex items-center px-5 h-9 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading || isSubmitting ? "Submitting..." : submitText}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkingConditionalForm;
