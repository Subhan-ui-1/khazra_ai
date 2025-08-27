export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'ar'] as const,
  localeNames: {
    en: 'English',
    ar: 'العربية'
  },
  rtlLocales: ['ar'] as const,
  fallbackLocale: 'en'
};

export type Locale = typeof i18nConfig.locales[number];

export const isRTL = (locale: Locale): boolean => {
  return (i18nConfig.rtlLocales as readonly string[]).includes(locale);
};

export const getDirection = (locale: Locale): 'ltr' | 'rtl' => {
  return isRTL(locale) ? 'rtl' : 'ltr';
};

// UAE-specific locale detection
export const getUAEArabicLocale = (): Locale => {
  // Check if user is in UAE or prefers Arabic
  if (typeof window !== 'undefined') {
    const userLanguage = navigator.language || navigator.languages?.[0] || 'en';
    const userCountry = navigator.languages?.find(lang => lang.includes('-AE')) || '';
    
    // If user is in UAE or prefers Arabic, return Arabic
    if (userCountry.includes('-AE') || userLanguage.startsWith('ar')) {
      return 'ar';
    }
  }
  return 'en';
};
