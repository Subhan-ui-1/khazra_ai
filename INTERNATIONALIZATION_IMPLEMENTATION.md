# Internationalization (i18n) Implementation Documentation

## Overview
This document outlines the implementation of a comprehensive internationalization system for the Khazra.ai application, supporting English and Arabic (UAE) languages with automatic language detection and manual language switching capabilities.

## Features Implemented

### 1. Multi-Language Support
- **English (en)**: Default language
- **Arabic (ar)**: Full RTL support with UAE-specific considerations

### 2. Automatic Language Detection
- Browser language preference detection
- IP-based geolocation detection (UAE users automatically get Arabic)
- Fallback to English for unsupported languages

### 3. Manual Language Switching
- Language switcher component in the header
- Persistent language selection (stored in localStorage)
- Real-time language switching without page reload

### 4. RTL (Right-to-Left) Support
- Full Arabic RTL layout support
- Automatic text alignment adjustments
- RTL-specific spacing and positioning
- Arabic font integration (Noto Sans Arabic)

## Files Created/Modified

### New Files Created

#### 1. Translation Files
- `src/i18n/locales/en.json` - English translations
- `src/i18n/locales/ar.json` - Arabic translations

#### 2. Configuration Files
- `src/i18n/config.ts` - i18n configuration and utilities
- `src/i18n/context.tsx` - React context for i18n state management

#### 3. Components
- `src/components/languageSwitcher/LanguageSwitcher.tsx` - Language switching component

#### 4. Hooks
- `src/hooks/useLanguageDetection.ts` - Custom hook for automatic language detection

### Modified Files

#### 1. Root Layout
- `src/app/layout.tsx` - Added I18nProvider wrapper

#### 2. Global Styles
- `src/app/globals.css` - Added RTL support and Arabic font styles

#### 3. Main Components
- `src/app/(dashboard)/dashboard/steps/page.tsx` - Integrated translations and language switcher
- `src/app/(dashboard)/dashboard/_components/sections/AddBoundarySection.tsx` - Added translation support
- `src/components/forms/DynamicForm.tsx` - Added translation support

## Implementation Details

### 1. Translation Structure
The translation files follow a nested structure:
```json
{
  "common": {
    "loading": "Loading...",
    "save": "Save"
  },
  "dashboard": {
    "setupOrganization": "Setup Your Organization"
  },
  "boundary": {
    "boundaryManagement": "Boundary Management"
  }
}
```

### 2. Context Provider
The `I18nProvider` manages:
- Current language state
- Translation loading
- Language switching
- RTL direction management
- Document language and direction attributes

### 3. Language Detection Logic
```typescript
// Priority order:
// 1. User's saved preference (localStorage)
// 2. IP geolocation (UAE = Arabic)
// 3. Browser language preference
// 4. Default to English
```

### 4. RTL Support Implementation
- CSS selectors for RTL layouts: `[dir="rtl"]`
- Automatic text alignment adjustments
- RTL-specific spacing and positioning
- Arabic font integration

## Usage Examples

### 1. Using Translations in Components
```typescript
import { useI18n } from '@/i18n/context';

const MyComponent = () => {
  const { t, locale, isRTL } = useI18n();
  
  return (
    <div>
      <h1>{t('dashboard.setupOrganization')}</h1>
      <p>Current language: {locale}</p>
      <p>Is RTL: {isRTL ? 'Yes' : 'No'}</p>
    </div>
  );
};
```

### 2. Language Switching
```typescript
import { useI18n } from '@/i18n/context';

const LanguageSwitcher = () => {
  const { switchLanguage, getCurrentLanguageName } = useI18n();
  
  return (
    <button onClick={switchLanguage}>
      Switch to {getCurrentLanguageName()}
    </button>
  );
};
```

### 3. RTL-Aware Styling
```css
/* RTL-specific adjustments */
[dir="rtl"] .text-left {
  text-align: right;
}

[dir="rtl"] .ml-auto {
  margin-left: unset;
  margin-right: auto;
}
```

## Technical Implementation

### 1. Package Dependencies
- `next-intl`: Next.js internationalization utilities
- `react-intl`: React internationalization components

### 2. State Management
- React Context for global i18n state
- localStorage for persistent language preferences
- Automatic state synchronization across components

### 3. Performance Optimizations
- Dynamic import of translation files
- Memoized translation functions
- Efficient RTL detection and application

### 4. Error Handling
- Fallback to English for missing translations
- Graceful degradation for geolocation failures
- Console logging for debugging

## Browser Compatibility

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Features by Browser
- **All browsers**: Basic i18n, language switching
- **Modern browsers**: Geolocation-based detection
- **RTL browsers**: Full Arabic RTL support

## Testing and Validation

### 1. Language Switching
- Verify all text changes language
- Check RTL layout for Arabic
- Validate localStorage persistence

### 2. RTL Layout
- Text alignment (right-aligned in Arabic)
- Spacing and positioning adjustments
- Button and form field orientations

### 3. Automatic Detection
- UAE IP addresses trigger Arabic
- Browser language preferences respected
- Fallback to English works correctly

## Future Enhancements

### 1. Additional Languages
- French (fr)
- German (de)
- Spanish (es)
- Chinese (zh)

### 2. Advanced Features
- Pluralization rules
- Date/time formatting
- Number formatting
- Currency formatting

### 3. Performance Improvements
- Translation bundling
- Lazy loading optimization
- Service worker caching

## Troubleshooting

### Common Issues

#### 1. Translations Not Loading
- Check file paths in `src/i18n/locales/`
- Verify JSON syntax
- Check browser console for errors

#### 2. RTL Layout Issues
- Ensure CSS selectors are correct
- Check for conflicting styles
- Validate Arabic font loading

#### 3. Language Detection Fails
- Check geolocation service availability
- Verify browser language settings
- Check localStorage permissions

### Debug Mode
Enable debug logging by setting:
```typescript
console.log('Current locale:', locale);
console.log('Translations:', translations);
console.log('RTL status:', isRTL);
```

## Conclusion

This internationalization implementation provides a robust, scalable foundation for multi-language support in the Khazra.ai application. The system automatically detects user preferences, supports RTL languages, and provides an intuitive interface for language switching.

The modular architecture makes it easy to add new languages and extend functionality as needed. All components are properly integrated with the translation system, ensuring consistent user experience across languages.
