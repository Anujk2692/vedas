import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {api} from '../api/client';
import type {TranslateResult} from '../api/types';
import {useLanguage} from './LanguageContext';
import {onSpeechFinish, speakTranslatedText, stopSpeech} from '../utils/speech';

interface TextTranslateContextValue {
  selectedText: string | null;
  translatedText: string | null;
  translation: TranslateResult | null;
  loading: boolean;
  speaking: boolean;
  error: string | null;
  setSelectedText: (text: string | null) => void;
  translateSelection: () => Promise<void>;
  listenSelection: () => Promise<void>;
  replaySpeech: () => Promise<void>;
  stopSpeaking: () => Promise<void>;
  clearSelection: () => void;
  targetLanguageLabel: string;
}

const TextTranslateContext = createContext<TextTranslateContextValue | null>(null);

export function TextTranslateProvider({children}: {children: React.ReactNode}) {
  const {language, languages} = useLanguage();
  const [selectedText, setSelectedTextState] = useState<string | null>(null);
  const [translation, setTranslation] = useState<TranslateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetLanguageLabel =
    languages.find(l => l.code === language)?.nativeName ?? language.toUpperCase();

  const setSelectedText = useCallback((text: string | null) => {
    const next = text?.trim() || null;
    if (next && next.length >= 2) {
      setSelectedTextState(next);
      setTranslation(null);
      setError(null);
    } else if (text === null) {
      setSelectedTextState(null);
      setTranslation(null);
      setError(null);
    }
  }, []);

  const clearSelection = useCallback(async () => {
    setSelectedTextState(null);
    setTranslation(null);
    setError(null);
    setSpeaking(false);
    await stopSpeech();
  }, []);

  const speakTranslation = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        return;
      }
      setSpeaking(true);
      setError(null);
      try {
        await speakTranslatedText(text, language);
      } catch (e) {
        setSpeaking(false);
        setError(e instanceof Error ? e.message : 'Could not play audio');
      }
    },
    [language],
  );

  const listenSelection = useCallback(async () => {
    if (!selectedText) {
      return;
    }
    setError(null);
    try {
      if (translation?.translatedText) {
        await speakTranslation(translation.translatedText);
        return;
      }
      const result = await api.translate(selectedText, language);
      setTranslation(result);
      await speakTranslation(result.translatedText);
    } catch {
      await speakTranslation(selectedText);
    }
  }, [language, selectedText, speakTranslation, translation]);

  const translateSelection = useCallback(async () => {
    if (!selectedText) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.translate(selectedText, language);
      setTranslation(result);
      await speakTranslation(result.translatedText);
    } catch (e) {
      setTranslation(null);
      setError(e instanceof Error ? e.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  }, [language, selectedText, speakTranslation]);

  const replaySpeech = useCallback(async () => {
    const text = translation?.translatedText ?? selectedText;
    if (text) {
      await speakTranslation(text);
    }
  }, [selectedText, speakTranslation, translation]);

  const stopSpeakingFn = useCallback(async () => {
    setSpeaking(false);
    await stopSpeech();
  }, []);

  useEffect(() => {
    const remove = onSpeechFinish(() => setSpeaking(false));
    return () => {
      remove();
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    setTranslation(null);
    setError(null);
  }, [language]);

  const value = useMemo(
    () => ({
      selectedText,
      translatedText: translation?.translatedText ?? null,
      translation,
      loading,
      speaking,
      error,
      setSelectedText,
      translateSelection,
      listenSelection,
      replaySpeech,
      stopSpeaking: stopSpeakingFn,
      clearSelection,
      targetLanguageLabel,
    }),
    [
      selectedText,
      translation,
      loading,
      speaking,
      error,
      setSelectedText,
      translateSelection,
      listenSelection,
      replaySpeech,
      stopSpeakingFn,
      clearSelection,
      targetLanguageLabel,
    ],
  );

  return (
    <TextTranslateContext.Provider value={value}>{children}</TextTranslateContext.Provider>
  );
}

export function useTextTranslate() {
  const ctx = useContext(TextTranslateContext);
  if (!ctx) {
    throw new Error('useTextTranslate must be used within TextTranslateProvider');
  }
  return ctx;
}
