import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ReadingFontScale = 'normal' | 'large' | 'xlarge';
export type PlaybackRate = 0.75 | 1 | 1.25;

export interface SavedMantra {
  id: string;
  type: 'verse' | 'chapter';
  title: string;
  sanskrit?: string;
  subtitle?: string;
  chapterId: string;
  vedaTitle?: string;
  savedAt: number;
}

export interface ReadingProgress {
  chapterId: string;
  title: string;
  vedaTitle?: string;
  updatedAt: number;
}

interface UserPreferencesValue {
  favorites: SavedMantra[];
  readingProgress: ReadingProgress | null;
  readingFontScale: ReadingFontScale;
  playbackRate: PlaybackRate;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Omit<SavedMantra, 'savedAt'>) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  setReadingProgress: (progress: Omit<ReadingProgress, 'updatedAt'>) => Promise<void>;
  clearReadingProgress: () => Promise<void>;
  setReadingFontScale: (scale: ReadingFontScale) => Promise<void>;
  setPlaybackRate: (rate: PlaybackRate) => Promise<void>;
  sanskritFontSize: number;
  translationFontSize: number;
}

const STORAGE_KEY = '@vedas_user_prefs_v1';

const FONT_SIZES: Record<ReadingFontScale, {sanskrit: number; translation: number}> = {
  normal: {sanskrit: 20, translation: 16},
  large: {sanskrit: 24, translation: 18},
  xlarge: {sanskrit: 28, translation: 20},
};

const UserPreferencesContext = createContext<UserPreferencesValue | null>(null);

interface StoredPrefs {
  favorites: SavedMantra[];
  readingProgress: ReadingProgress | null;
  readingFontScale: ReadingFontScale;
  playbackRate: PlaybackRate;
}

const DEFAULTS: StoredPrefs = {
  favorites: [],
  readingProgress: null,
  readingFontScale: 'normal',
  playbackRate: 1,
};

export function UserPreferencesProvider({children}: {children: React.ReactNode}) {
  const [favorites, setFavorites] = useState<SavedMantra[]>([]);
  const [readingProgress, setReadingProgressState] = useState<ReadingProgress | null>(null);
  const [readingFontScale, setReadingFontScaleState] = useState<ReadingFontScale>('normal');
  const [playbackRate, setPlaybackRateState] = useState<PlaybackRate>(1);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw) as StoredPrefs;
        setFavorites(parsed.favorites ?? []);
        setReadingProgressState(parsed.readingProgress ?? null);
        setReadingFontScaleState(parsed.readingFontScale ?? 'normal');
        setPlaybackRateState(parsed.playbackRate ?? 1);
      })
      .catch(() => {})
      .finally(() => {});
  }, []);

  const persist = useCallback(
    async (next: Partial<StoredPrefs>) => {
      const merged: StoredPrefs = {
        favorites: next.favorites ?? favorites,
        readingProgress: next.readingProgress !== undefined ? next.readingProgress : readingProgress,
        readingFontScale: next.readingFontScale ?? readingFontScale,
        playbackRate: next.playbackRate ?? playbackRate,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    },
    [favorites, readingProgress, readingFontScale, playbackRate],
  );

  const isFavorite = useCallback((id: string) => favorites.some(f => f.id === id), [favorites]);

  const toggleFavorite = useCallback(
    async (item: Omit<SavedMantra, 'savedAt'>) => {
      const exists = favorites.find(f => f.id === item.id);
      const next = exists
        ? favorites.filter(f => f.id !== item.id)
        : [{...item, savedAt: Date.now()}, ...favorites].slice(0, 50);
      setFavorites(next);
      await persist({favorites: next});
    },
    [favorites, persist],
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      const next = favorites.filter(f => f.id !== id);
      setFavorites(next);
      await persist({favorites: next});
    },
    [favorites, persist],
  );

  const setReadingProgress = useCallback(
    async (progress: Omit<ReadingProgress, 'updatedAt'>) => {
      const next: ReadingProgress = {...progress, updatedAt: Date.now()};
      setReadingProgressState(next);
      await persist({readingProgress: next});
    },
    [persist],
  );

  const clearReadingProgress = useCallback(async () => {
    setReadingProgressState(null);
    await persist({readingProgress: null});
  }, [persist]);

  const setReadingFontScale = useCallback(
    async (scale: ReadingFontScale) => {
      setReadingFontScaleState(scale);
      await persist({readingFontScale: scale});
    },
    [persist],
  );

  const setPlaybackRatePref = useCallback(
    async (rate: PlaybackRate) => {
      setPlaybackRateState(rate);
      await persist({playbackRate: rate});
    },
    [persist],
  );

  const fontSizes = FONT_SIZES[readingFontScale];

  const value = useMemo(
    () => ({
      favorites,
      readingProgress,
      readingFontScale,
      playbackRate,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      setReadingProgress,
      clearReadingProgress,
      setReadingFontScale,
      setPlaybackRate: setPlaybackRatePref,
      sanskritFontSize: fontSizes.sanskrit,
      translationFontSize: fontSizes.translation,
    }),
    [
      favorites,
      readingProgress,
      readingFontScale,
      playbackRate,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      setReadingProgress,
      clearReadingProgress,
      setReadingFontScale,
      setPlaybackRatePref,
      fontSizes.sanskrit,
      fontSizes.translation,
    ],
  );

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return ctx;
}
