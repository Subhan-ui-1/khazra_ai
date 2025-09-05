// Utility functions for form handling and dependent field management

// Helper function to check if a value is empty/falsy
export const isEmptyValue = (v: any): boolean => {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  if (v === false) return true;
  return false;
};

// Helper function to sanitize payload - convert empty values to null
export const sanitizePayload = (obj: Record<string, any>) => {
  const sanitized: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (isEmptyValue(value)) {
      // Convert empty values to null for dependent fields that were cleared
      sanitized[key] = null;
    } else {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

// Helper function to clear dependent fields when parent field changes
export const clearDependentFields = (
  formData: Record<string, any>,
  changedFieldName: string,
  fieldDependencies: Record<string, string[]> // fieldName -> array of dependent field names
): Record<string, any> => {
  const newFormData = { ...formData };
  
  // Get all fields that depend on the changed field
  const dependentFields = fieldDependencies[changedFieldName] || [];
  
  // Clear all dependent fields to null
  dependentFields.forEach(dependentFieldName => {
    newFormData[dependentFieldName] = null;
  });
  
  return newFormData;
};

// Helper function to check if form has meaningful data
export const hasMeaningfulData = (data: Record<string, any>): boolean => {
  return Object.values(data).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== "" && value !== null && value !== "No" && value !== false;
  });
};
