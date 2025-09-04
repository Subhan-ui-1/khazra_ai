'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { i18nConfig, Locale, isRTL, getDirection, getUAEArabicLocale } from './config';
import { safeLocalStorage } from '@/utils/localStorage';
import en from './locales/en.json';
import componentsEn from './locales/components/index.en';
import ar from './locales/ar.json';

const translationsMap: Record<Locale, any> = {
  en: { ...en, ...componentsEn },
  ar,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  t: (key: string, fallback?: string) => string;
  /**
   * Returns a namespaced translator for a component, so ct('key') looks up `${component}.${key}`
   */
  makeComponentT: (componentKey: string) => ((key: string, fallback?: string) => string);
  switchLanguage: () => void;
  getCurrentLanguageName: () => string;
  isReady: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isReady, setIsReady] = useState<boolean>(false);

  // Initialize locale from localStorage or detect from browser
  useEffect(() => {
    try {
      const savedLocale = safeLocalStorage.getItem('locale') as Locale;
      if (savedLocale && (i18nConfig.locales as readonly string[]).includes(savedLocale)) {
        setLocaleState(savedLocale);
      } else {
        const detectedLocale = getUAEArabicLocale();
        setLocaleState(detectedLocale);
        safeLocalStorage.setItem('locale', detectedLocale);
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    if ((i18nConfig.locales as readonly string[]).includes(newLocale)) {
      setLocaleState(newLocale);
      safeLocalStorage.setItem('locale', newLocale);
      document.documentElement.dir = getDirection(newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  const t = (key: string, fallback?: string): string => {
    const fallbackLocale = i18nConfig.fallbackLocale as Locale;
    const translations = translationsMap[locale] || translationsMap[fallbackLocale];
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    return typeof value === 'string' ? value : fallback || key;
  };

  const switchLanguage = () => {
    const currentIndex = (i18nConfig.locales as readonly string[]).indexOf(locale);
    const nextIndex = (currentIndex + 1) % i18nConfig.locales.length;
    setLocale(i18nConfig.locales[nextIndex]);
  };

  const getCurrentLanguageName = (): string => {
    return i18nConfig.localeNames[locale];
  };

  useEffect(() => {
    document.documentElement.dir = getDirection(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value: I18nContextType = {
    locale,
    setLocale,
    direction: getDirection(locale),
    isRTL: isRTL(locale),
    t,
    makeComponentT: (componentKey: string) => (key: string, fallback?: string) => t(`${componentKey}.${key}`, fallback),
    switchLanguage,
    getCurrentLanguageName,
    isReady,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
