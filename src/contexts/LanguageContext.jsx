/**
 * LanguageContext.jsx
 * Single source of truth for app language (AR / EN).
 *
 * All screens call `useTranslation()` which reads from this context,
 * so toggling language on ANY screen (e.g. the Dashboard header) is
 * immediately reflected everywhere — including the Detail and Filters screens.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { I18nManager } from 'react-native';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'en' ? 'ar' : 'en';
      // Informs RN text/layout engine of direction change.
      // A full reload is required for I18nManager to take full effect globally.
      I18nManager.forceRTL(next === 'ar');
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Internal hook — consumed only by useTranslation.
 * Do not call this directly from components; use useTranslation() instead.
 */
export function useLanguageContext() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguageContext must be used inside <LanguageProvider>');
  }
  return ctx;
}
