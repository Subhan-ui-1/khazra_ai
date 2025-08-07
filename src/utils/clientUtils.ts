'use client';

// Safe scroll to function that checks for window availability
export const safeScrollTo = (options: ScrollToOptions) => {
  if (typeof window !== 'undefined') {
    window.scrollTo(options);
  }
};

// Safe scroll to top
export const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// Safe scroll to bottom
export const scrollToBottom = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }
};

// Safe get window inner width
export const getWindowInnerWidth = (): number => {
  if (typeof window !== 'undefined') {
    return window.innerWidth;
  }
  return 0;
};

// Safe add event listener
export const safeAddEventListener = (
  event: string,
  handler: EventListenerOrEventListenerObject
) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  }
  return () => {};
};

// Safe geolocation check
export const isGeolocationSupported = (): boolean => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    return !!navigator.geolocation;
  }
  return false;
};

// Safe document query selector
export const safeQuerySelector = (selector: string): Element | null => {
  if (typeof document !== 'undefined') {
    return document.querySelector(selector);
  }
  return null;
};

// Safe document query selector all
export const safeQuerySelectorAll = (selector: string): NodeListOf<Element> => {
  if (typeof document !== 'undefined') {
    return document.querySelectorAll(selector);
  }
  return new NodeList();
};
