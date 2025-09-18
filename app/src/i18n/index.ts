import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import zh from './locales/zh.json';

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && ['zh', 'en'].includes(savedLanguage)) {
        callback(savedLanguage);
        return;
      }
    } catch (error) {
      console.log('Error reading language from storage:', error);
    }
    
    const locales = Localization.getLocales();
    const bestLanguage = locales[0]?.languageCode || 'en';
    callback(['zh', 'en'].includes(bestLanguage) ? bestLanguage : 'en');
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => {
    AsyncStorage.setItem('language', lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;