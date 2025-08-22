'use client'

export const safeLocalStorage = {
  getItem(key: string) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key); // ✅
  },
  setItem(key: string, value: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value); // ✅
  },
  removeItem(key: string) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key); // ✅
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.clear(); // ✅
  },
};

// Helper functions for storing section data
export const storeSectionData = (section: string, data: any) => {
  try {
    const existingData = safeLocalStorage.getItem(section);
    let sectionData = existingData ? JSON.parse(existingData) : [];
    
    // If data is an array, merge it with existing data
    if (Array.isArray(data)) {
      sectionData = [...sectionData, ...data];
    } else {
      // If data is a single item, add it to the array
      sectionData.push(data);
    }
    
    safeLocalStorage.setItem(section, JSON.stringify(sectionData));
    return true;
  } catch (error) {
    console.error(`Error storing ${section} data:`, error);
    return false;
  }
};

export const getSectionData = (section: string) => {
  try {
    const data = safeLocalStorage.getItem(section);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error retrieving ${section} data:`, error);
    return [];
  }
};

export const clearSectionData = (section: string) => {
  try {
    safeLocalStorage.removeItem(section);
    return true;
  } catch (error) {
    console.error(`Error clearing ${section} data:`, error);
    return false;
  }
};

export const hasSectionData = (section: string) => {
  try {
    const data = safeLocalStorage.getItem(section);
    if (!data) return false;
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) && parsedData.length > 0;
  } catch (error) {
    return false;
  }
};

// New function to store step completion with response data
export const storeStepCompletion = (stepId: string, responseData?: any) => {
  try {
    const completionData = {
      stepId,
      completed: true,
      timestamp: new Date().toISOString(),
      responseData: responseData || null
    };
    
    // Store in step-specific key
    safeLocalStorage.setItem(`step_${stepId}`, JSON.stringify(completionData));
    
    // Also store in general steps array
    const allSteps = safeLocalStorage.getItem('completed_steps') || '[]';
    const completedSteps = JSON.parse(allSteps);
    if (!completedSteps.includes(stepId)) {
      completedSteps.push(stepId);
      safeLocalStorage.setItem('completed_steps', JSON.stringify(completedSteps));
    }
    
    return true;
  } catch (error) {
    console.error(`Error storing step completion for ${stepId}:`, error);
    return false;
  }
};

// Function to check if a specific step is completed
export const isStepCompleted = (stepId: string) => {
  try {
    const data = safeLocalStorage.getItem(`step_${stepId}`);
    if (!data) return false;
    const stepData = JSON.parse(data);
    return stepData.completed === true;
  } catch (error) {
    return false;
  }
};

// Function to get all completed steps
export const getCompletedSteps = () => {
  try {
    const data = safeLocalStorage.getItem('completed_steps');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};


