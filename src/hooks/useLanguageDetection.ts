import { useEffect, useState } from 'react';
import { Locale } from '@/i18n/config';

interface LocationData {
  country: string;
  city?: string;
  region?: string;
}

export const useLanguageDetection = () => {
  const [detectedLocale, setDetectedLocale] = useState<Locale>('en');
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // Method 1: Check browser language preferences
        const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
        
        // Method 2: Check if user is in UAE or Arabic-speaking region
        let locationData: LocationData | null = null;
        
        try {
          // Try to get location from IP geolocation service
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            locationData = await response.json();
          }
        } catch (error) {
          console.log('Could not detect location from IP, falling back to browser language');
        }

        // Determine locale based on location and language preferences
        let locale: Locale = 'en';
        
        if (locationData?.country === 'AE' || browserLanguage.startsWith('ar')) {
          locale = 'ar';
        } else if (browserLanguage.startsWith('en')) {
          locale = 'en';
        } else {
          // Default to English for other languages
          locale = 'en';
        }

        setDetectedLocale(locale);
      } catch (error) {
        console.error('Error detecting language:', error);
        setDetectedLocale('en');
      } finally {
        setIsDetecting(false);
      }
    };

    detectLanguage();
  }, []);

  return { detectedLocale, isDetecting };
};
