"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/i18n/context";
import FileUploadModal from "@/components/FileUploadModal";
import { Paperclip, X } from "lucide-react";

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "textarea"
    | "select"
    | "multiselect"
    | "checkbox"
    | "radio"
    | "date"
    | "phone"
    | "file";
  required?: boolean;
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
    flag?: string;
    code?: string;
  }>;
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
  min?: number;
  max?: number;
  condition?: (formData: any) => boolean;
  onChange?: (value: any) => void;
  // File-specific properties
  acceptedTypes?: string[];
  maxSize?: number;
  showAttachment?: boolean;
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
  showCancelButton?: boolean;
  onFileChange?: (file: File | null) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  title,
  fields,
  onSubmit,
  onCancel,
  initialData = {},
  loading = false,
  submitText = "Submit",
  cancelText = "Cancel",
  showCloseButton = true,
  showCancelButton = true,
  onClose,
  confirmationMessage = "Do you really want to perform this action?",
  onFileChange,
}) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [selectedFieldForFileUpload, setSelectedFieldForFileUpload] = useState<string | null>(null);

  // Initialize form data once; avoid clobbering user input on subsequent parent updates
  useEffect(() => {
    setFormData((prev: any) => {
      const isPrevEmpty = Object.keys(prev).length === 0;
      if (!isPrevEmpty) return prev;
      const updatedFormData: any = {};
      fields.forEach((field) => {
        if (initialData[field.name] !== undefined) {
          updatedFormData[field.name] = initialData[field.name];
        } else if (field.defaultValue !== undefined) {
          updatedFormData[field.name] = field.defaultValue;
        } else {
          updatedFormData[field.name] = "";
        }
      });
      return updatedFormData;
    });
  }, [initialData, fields]);

  const handleFileSelect = (file: File) => {
    if (selectedFieldForFileUpload) {
      setFiles((prev: { [key: string]: File | null }) => ({
        ...prev,
        [selectedFieldForFileUpload]: file
      }));
      setFormData((prev: any) => ({
        ...prev,
        [selectedFieldForFileUpload]: file.name
      }));
      setShowFileUploadModal(false);
      setSelectedFieldForFileUpload(null);
      
      // Call onFileChange callback if provided
      if (onFileChange) {
        onFileChange(file);
      }
    }
  };

  const handleRemoveFile = (fieldName: string) => {
    setFiles((prev: { [key: string]: File | null }) => ({
      ...prev,
      [fieldName]: null
    }));
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: ""
    }));
    
    // Call onFileChange callback if provided
    if (onFileChange) {
      onFileChange(null);
    }
  };

  const getFileForField = (fieldName: string): File | null => {
    return files[fieldName] || null;
  };

  const clearAllFiles = () => {
    setFiles({});
    // Clear file names from form data
    const updatedFormData = { ...formData };
    fields.forEach(field => {
      if (field.type === 'file') {
        updatedFormData[field.name] = "";
      }
    });
    setFormData(updatedFormData);
  };

  const validateField = (name: string, value: any): string => {
    const field = fields.find((f) => f.name === name);
    if (!field) return "";

    // Required validation
    if (
      field.required &&
      (!value || (typeof value === "string" && !value.trim()))
    ) {
      return `${field.label} is required`;
    }

    // Skip validation if value is empty and not required
    if (!value || (typeof value === "string" && !value.trim())) {
      return "";
    }

    // Pattern validation
    if (field.validation?.pattern && typeof value === "string") {
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
    if (field.type === "phone" && value) {
      const countryCode = formData[`${field.name}CountryCode`];
      if (countryCode && field.validation?.custom) {
        const result = field.validation.custom({
          countryCode,
          phoneNumber: value,
        });
        if (!result.isValid) {
          return result.message;
        }
      }
    }

    // Length validation
    if (typeof value === "string") {
      if (field.minLength && value.length < field.minLength) {
        return `${field.label} must be at least ${field.minLength} characters`;
      }
      if (field.maxLength && value.length > field.maxLength) {
        return `${field.label} must be no more than ${field.maxLength} characters`;
      }
    }

    return "";
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [name]: "" }));
    }

    // Call custom onChange handler if it exists
    const field = fields.find((f) => f.name === name);
    if (field?.onChange) {
      field.onChange(value);
    }

    // For phone fields, also validate when country code changes
    if (name.endsWith("CountryCode")) {
      const phoneFieldName = name.replace("CountryCode", "");
      const phoneValue = formData[phoneFieldName];
      if (phoneValue) {
        const phoneField = fields.find((f) => f.name === phoneFieldName);
        if (phoneField?.type === "phone" && phoneField.validation?.custom) {
          const result = phoneField.validation.custom({
            countryCode: value,
            phoneNumber: phoneValue,
          });
          if (!result.isValid) {
            setErrors((prev: Record<string, string>) => ({
              ...prev,
              [phoneFieldName]: result.message,
            }));
          } else {
            setErrors((prev: Record<string, string>) => ({
              ...prev,
              [phoneFieldName]: "",
            }));
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

    const visibleFields = fields.filter(
      (field) => !field.condition || field.condition(formData)
    );

    visibleFields.forEach((field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      setPendingFormData(formData);
      setShowConfirmation(true);
    }
  };

  const handleConfirmSubmit = () => {
    if (pendingFormData) {
      // Include files data in the submission
      const submissionData = {
        ...pendingFormData,
        files: files
      };
      onSubmit(submissionData);
      setShowConfirmation(false);
      setPendingFormData(null);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
    setPendingFormData(null);
  };
  const maxim = (type: string): string | undefined => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1; // Months are 0-indexed
    let day = today.getDate();

    // Pad month and day with leading zeros if necessary
    if (month < 10) {
        month = Number('0' + month);
    }
    if (day < 10) {
        day = Number('0' + day);
    }

    const maxDate = `${year}-${month}-${day}`;
    if(type === 'date'){
      return maxDate;
    } 
    return undefined;
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name] || "";
    const hasError = errors[field.name];
    const baseInputClasses = `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
      hasError
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300"
    }`;

    switch (field.type) {
      case "textarea":
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

      case "select":
        return (
          <select
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseInputClasses}
            disabled={field.disabled}
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
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

      case "phone":
        return (
          <div className="flex gap-2">
            <div className="w-1/5">
              <select
                name={`${field.name}CountryCode`}
                value={formData[`${field.name}CountryCode`] || ""}
                onChange={(e) =>
                  handleInputChange(`${field.name}CountryCode`, e.target.value)
                }
                className={`${baseInputClasses} h-full`}
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
                  const numericValue = e.target.value.replace(/\D/g, "");
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

      case "file":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* <input
                type="text"
                id={field.name}
                name={field.name}
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder || "File name will appear here"}
                className={baseInputClasses}
                disabled={field.disabled}
                readOnly
              /> */}
              <button
                type="button"
                onClick={() => {
                  setSelectedFieldForFileUpload(field.name);
                  setShowFileUploadModal(true);
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Paperclip className="h-4 w-4 mr-2" />
                {files[field.name] ? "Change File" : "Upload File"}
              </button>
            </div>
            
            {files[field.name] && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Selected:</span>
                <span className="text-sm font-medium text-gray-900">
                  {files[field.name]?.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(field.name)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={value}
            min={field.min}
            max={field.type==='date'?maxim(field.type):field.max}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            disabled={field.disabled}
          />
        );
    }
  };

  // Group fields into pairs for 2-column layout
  const fieldGroups = [];
  const visibleFields = fields.filter(
    (field) => !field.condition || field.condition(formData)
  );

  for (let i = 0; i < visibleFields.length; i += 2) {
    fieldGroups.push(visibleFields.slice(i, i + 2));
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fieldGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {group.map((field) => (
                <div
                  key={field.name}
                  className={group.length === 1 ? "md:col-span-2" : ""}
                >
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field.label} {field.required && "*"}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <div className="mt-1 text-xs text-red-500">
                      {errors[field.name]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0D5942]  disabled:bg-[#0A4A37] text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
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
                  {submitText}
                </>
              )}
            </button>
            {showCancelButton && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors duration-200"
              >
                {cancelText}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('boundary.confirmAction')}
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">{confirmationMessage}</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelSubmit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {t('boundary.noCancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="bg-[#0D5942] hover:bg-[#0A4A37] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {t('boundary.yesContinue')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showFileUploadModal && selectedFieldForFileUpload && (
        <FileUploadModal
          isOpen={showFileUploadModal}
          onClose={() => setShowFileUploadModal(false)}
          onFileSelect={handleFileSelect}
          acceptedTypes={fields.find((f) => f.name === selectedFieldForFileUpload)?.acceptedTypes || ['.pdf', '.png', '.jpg', '.jpeg', '.csv', '.xlsx', '.xls']}
          maxSize={fields.find((f) => f.name === selectedFieldForFileUpload)?.maxSize || 10}
          title="Upload Attachment"
          description="Drag and drop your file here or click to browse"
        />
      )}
    </>
  );
};

export default DynamicForm;
