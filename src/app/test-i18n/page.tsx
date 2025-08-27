'use client';

import { useI18n } from '@/i18n/context';
import LanguageSwitcher from '@/components/languageSwitcher/LanguageSwitcher';

export default function TestI18nPage() {
  const { t, locale, isRTL, direction } = useI18n();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Prominent Header with Language Switcher */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🌐 {t('language.switchLanguage')} - Test Page
              </h1>
              <p className="text-lg text-gray-600">
                Click the language switcher button to test translations!
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-blue-800 mb-2 font-medium">Language Switcher:</p>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Current Language Status */}
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold text-green-900 mb-4">✅ Current Language Settings</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Language Code:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{locale}</span>
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Direction:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{direction}</span>
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Is RTL:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{isRTL ? 'Yes' : 'No'}</span>
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Language Name:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{t('language.arabic')}</span>
              </div>
            </div>
          </div>

          {/* Translation Test */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">🔤 Translation Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold mb-2">Common Words:</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Loading:</strong> {t('common.loading')}</div>
                  <div><strong>Save:</strong> {t('common.save')}</div>
                  <div><strong>Cancel:</strong> {t('common.cancel')}</div>
                  <div><strong>Next:</strong> {t('common.next')}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold mb-2">Dashboard:</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Setup:</strong> {t('dashboard.setupOrganization')}</div>
                  <div><strong>Welcome:</strong> {t('dashboard.welcomeKhazra')}</div>
                  <div><strong>Boundary:</strong> {t('dashboard.boundary')}</div>
                  <div><strong>Facilities:</strong> {t('dashboard.facilities')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RTL Test Content */}
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-900 mb-4">📝 RTL Test Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold mb-2">English Text (LTR):</h3>
                <p className="text-left">This is English text that reads from left to right.</p>
                <p className="text-left">The language switcher should be visible in the top-right corner.</p>
              </div>
              <div className="bg-white p-4 rounded border" dir="rtl">
                <h3 className="font-semibold mb-2 text-right">Arabic Text (RTL):</h3>
                <p className="text-right text-lg">هذا نص تجريبي للاختبار</p>
                <p className="text-right text-sm text-gray-600">This is test text for RTL testing</p>
                <p className="text-right">النص العربي يجب أن يكون محاذياً لليمين</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">📋 How to Test</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm space-y-3">
              <li className="bg-white p-3 rounded border">
                <strong>Find the Language Switcher:</strong> Look for the globe icon (🌐) button in the top-right corner of this page
              </li>
              <li className="bg-white p-3 rounded border">
                <strong>Switch Languages:</strong> Click the globe icon to see a dropdown with "English" and "العربية" options
              </li>
              <li className="bg-white p-3 rounded border">
                <strong>Observe Changes:</strong> Notice how all the text changes language when you switch
              </li>
              <li className="bg-white p-3 rounded border">
                <strong>Check RTL Layout:</strong> When Arabic is selected, text should be right-aligned and the layout should adjust
              </li>
              <li className="bg-white p-3 rounded border">
                <strong>Verify Persistence:</strong> Refresh the page to see if your language choice is remembered
              </li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-xl font-semibold text-red-900 mb-4">🚨 If Language Switcher is Not Visible</h2>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Check Console:</strong> Open browser developer tools (F12) and look for any JavaScript errors
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Clear Cache:</strong> Try hard refresh (Ctrl+F5 or Cmd+Shift+R)
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Check URL:</strong> Make sure you're on the correct test page: <code className="bg-gray-100 px-2 py-1 rounded">/test-i18n</code>
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Language Switcher Location:</strong> It should appear in the top-right corner of this page, highlighted in a blue box
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
