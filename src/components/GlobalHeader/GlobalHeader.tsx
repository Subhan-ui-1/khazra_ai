'use client';

import React from 'react';
import { useI18n } from '@/i18n/context';
import LanguageSwitcher from '@/components/languageSwitcher/LanguageSwitcher';

interface GlobalHeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
  children?: React.ReactNode;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ 
  title, 
  showLanguageSwitcher = true, 
  children 
}) => {
  const { t, locale, isRTL } = useI18n();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {title && (
              <h1 className={`text-2xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {title}
              </h1>
            )}
            {children}
          </div>
          
          {showLanguageSwitcher && (
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
