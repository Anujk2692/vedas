import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {api} from '../api/client';
import type {Language} from '../api/types';

const LANGUAGE_KEY = '@vedas_language';

interface LanguageContextValue {
  language: string;
  languages: Language[];
  loading: boolean;
  setLanguage: (code: string) => Promise<void>;
  refreshLanguages: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({children}: {children: React.ReactNode}) {
  const [language, setLanguageState] = useState('en');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshLanguages = useCallback(async () => {
    const data = await api.getLanguages();
    setLanguages(data);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (saved) {
          setLanguageState(saved);
        }
        await refreshLanguages();
      } catch {
        setLanguages([
          {id: '1', code: 'en', name: 'English', nativeName: 'English', script: 'Latin', rtl: false},
          {id: '2', code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', rtl: false},
          {id: '3', code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', rtl: false},
        ]);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [refreshLanguages]);

  const setLanguage = useCallback(async (code: string) => {
    setLanguageState(code);
    await AsyncStorage.setItem(LANGUAGE_KEY, code);
  }, []);

  const value = useMemo(
    () => ({language, languages, loading, setLanguage, refreshLanguages}),
    [language, languages, loading, setLanguage, refreshLanguages],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
