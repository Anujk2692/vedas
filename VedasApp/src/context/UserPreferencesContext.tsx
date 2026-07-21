import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {api} from '../api/client';
import {getDeviceId} from '../utils/deviceId';

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

export interface StudyPathProgress {
  pathSlug: string;
  completedSteps: number[];
  updatedAt: number;
}

export type RecentItemKind = 'scripture' | 'chapter' | 'topic';

export interface RecentItem {
  id: string;
  kind: RecentItemKind;
  title: string;
  subtitle?: string;
  /** Navigation target id/slug */
  targetId: string;
  viewedAt: number;
}

export interface SadhanaStreak {
  current: number;
  longest: number;
  lastDate: string | null;
}

interface UserPreferencesValue {
  favorites: SavedMantra[];
  readingProgress: ReadingProgress | null;
  studyPathProgress: StudyPathProgress[];
  recentlyViewed: RecentItem[];
  sadhanaStreak: SadhanaStreak;
  readingFontScale: ReadingFontScale;
  playbackRate: PlaybackRate;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Omit<SavedMantra, 'savedAt'>) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  setReadingProgress: (progress: Omit<ReadingProgress, 'updatedAt'>) => Promise<void>;
  clearReadingProgress: () => Promise<void>;
  addRecentItem: (item: Omit<RecentItem, 'viewedAt'>) => Promise<void>;
  recordSadhanaPractice: () => Promise<void>;
  isStudyStepComplete: (pathSlug: string, stepOrder: number) => boolean;
  toggleStudyStep: (pathSlug: string, stepOrder: number) => Promise<void>;
  getStudyPathProgress: (pathSlug: string) => StudyPathProgress | undefined;
  setReadingFontScale: (scale: ReadingFontScale) => Promise<void>;
  setPlaybackRate: (rate: PlaybackRate) => Promise<void>;
  syncBookmarksFromCloud: () => Promise<void>;
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
  studyPathProgress: StudyPathProgress[];
  recentlyViewed: RecentItem[];
  sadhanaStreak: SadhanaStreak;
  readingFontScale: ReadingFontScale;
  playbackRate: PlaybackRate;
}

const DEFAULT_STREAK: SadhanaStreak = {current: 0, longest: 0, lastDate: null};

const DEFAULTS: StoredPrefs = {
  favorites: [],
  readingProgress: null,
  studyPathProgress: [],
  recentlyViewed: [],
  sadhanaStreak: DEFAULT_STREAK,
  readingFontScale: 'normal',
  playbackRate: 1,
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function UserPreferencesProvider({children}: {children: React.ReactNode}) {
  const [favorites, setFavorites] = useState<SavedMantra[]>([]);
  const [readingProgress, setReadingProgressState] = useState<ReadingProgress | null>(null);
  const [studyPathProgress, setStudyPathProgressState] = useState<StudyPathProgress[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentItem[]>([]);
  const [sadhanaStreak, setSadhanaStreak] = useState<SadhanaStreak>(DEFAULT_STREAK);
  const [readingFontScale, setReadingFontScaleState] = useState<ReadingFontScale>('normal');
  const [playbackRate, setPlaybackRateState] = useState<PlaybackRate>(1);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const didInitialSync = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (!raw) {
          setPrefsLoaded(true);
          return;
        }
        const parsed = JSON.parse(raw) as StoredPrefs;
        setFavorites(parsed.favorites ?? []);
        setReadingProgressState(parsed.readingProgress ?? null);
        setStudyPathProgressState(parsed.studyPathProgress ?? []);
        setRecentlyViewed(parsed.recentlyViewed ?? []);
        setSadhanaStreak(parsed.sadhanaStreak ?? DEFAULT_STREAK);
        setReadingFontScaleState(parsed.readingFontScale ?? 'normal');
        setPlaybackRateState(parsed.playbackRate ?? 1);
        setPrefsLoaded(true);
      })
      .catch(() => setPrefsLoaded(true));
  }, []);

  const persist = useCallback(
    async (next: Partial<StoredPrefs>) => {
      const merged: StoredPrefs = {
        favorites: next.favorites ?? favorites,
        readingProgress: next.readingProgress !== undefined ? next.readingProgress : readingProgress,
        studyPathProgress: next.studyPathProgress ?? studyPathProgress,
        recentlyViewed: next.recentlyViewed ?? recentlyViewed,
        sadhanaStreak: next.sadhanaStreak ?? sadhanaStreak,
        readingFontScale: next.readingFontScale ?? readingFontScale,
        playbackRate: next.playbackRate ?? playbackRate,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    },
    [favorites, readingProgress, studyPathProgress, recentlyViewed, sadhanaStreak, readingFontScale, playbackRate],
  );

  const isFavorite = useCallback((id: string) => favorites.some(f => f.id === id), [favorites]);

  const syncBookmarksToCloud = useCallback(async (items: SavedMantra[]) => {
    try {
      const deviceId = await getDeviceId();
      const payload = items.map(f => ({
        itemId: f.id,
        type: f.type,
        title: f.title,
        sanskrit: f.sanskrit,
        subtitle: f.subtitle,
        chapterId: f.chapterId,
        vedaTitle: f.vedaTitle,
        savedAt: f.savedAt,
      }));
      const merged = await api.syncBookmarks(deviceId, payload);
      if (merged.length > 0) {
        const mapped: SavedMantra[] = merged.map(b => ({
          id: b.itemId,
          type: (b.type as 'verse' | 'chapter') ?? 'verse',
          title: b.title,
          sanskrit: b.sanskrit,
          subtitle: b.subtitle,
          chapterId: b.chapterId,
          vedaTitle: b.vedaTitle,
          savedAt: b.savedAt,
        }));
        setFavorites(mapped);
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            favorites: mapped,
            readingProgress,
            studyPathProgress,
            recentlyViewed,
            sadhanaStreak,
            readingFontScale,
            playbackRate,
          }),
        );
      }
    } catch {
      // offline — local favorites still work
    }
  }, [readingProgress, studyPathProgress, recentlyViewed, sadhanaStreak, readingFontScale, playbackRate]);

  const syncBookmarksFromCloud = useCallback(async () => {
    await syncBookmarksToCloud(favorites);
  }, [favorites, syncBookmarksToCloud]);

  useEffect(() => {
    if (!prefsLoaded || didInitialSync.current) {
      return;
    }
    didInitialSync.current = true;
    syncBookmarksToCloud(favorites).catch(() => undefined);
  }, [prefsLoaded, favorites, syncBookmarksToCloud]);

  const toggleFavorite = useCallback(
    async (item: Omit<SavedMantra, 'savedAt'>) => {
      const exists = favorites.find(f => f.id === item.id);
      const next = exists
        ? favorites.filter(f => f.id !== item.id)
        : [{...item, savedAt: Date.now()}, ...favorites].slice(0, 50);
      setFavorites(next);
      await persist({favorites: next});
      await syncBookmarksToCloud(next);
    },
    [favorites, persist, syncBookmarksToCloud],
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      const next = favorites.filter(f => f.id !== id);
      setFavorites(next);
      await persist({favorites: next});
      await syncBookmarksToCloud(next);
    },
    [favorites, persist, syncBookmarksToCloud],
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

  const addRecentItem = useCallback(
    async (item: Omit<RecentItem, 'viewedAt'>) => {
      const entry: RecentItem = {...item, viewedAt: Date.now()};
      const next = [entry, ...recentlyViewed.filter(r => !(r.kind === item.kind && r.id === item.id))].slice(0, 5);
      setRecentlyViewed(next);
      await persist({recentlyViewed: next});
    },
    [recentlyViewed, persist],
  );

  const recordSadhanaPractice = useCallback(async () => {
    const today = todayKey();
    if (sadhanaStreak.lastDate === today) {
      return;
    }
    const nextCurrent = sadhanaStreak.lastDate === yesterdayKey() ? sadhanaStreak.current + 1 : 1;
    const next: SadhanaStreak = {
      current: nextCurrent,
      longest: Math.max(sadhanaStreak.longest, nextCurrent),
      lastDate: today,
    };
    setSadhanaStreak(next);
    await persist({sadhanaStreak: next});
  }, [sadhanaStreak, persist]);

  const getStudyPathProgress = useCallback(
    (pathSlug: string) => studyPathProgress.find(p => p.pathSlug === pathSlug),
    [studyPathProgress],
  );

  const isStudyStepComplete = useCallback(
    (pathSlug: string, stepOrder: number) => {
      const entry = studyPathProgress.find(p => p.pathSlug === pathSlug);
      return entry?.completedSteps.includes(stepOrder) ?? false;
    },
    [studyPathProgress],
  );

  const toggleStudyStep = useCallback(
    async (pathSlug: string, stepOrder: number) => {
      const existing = studyPathProgress.find(p => p.pathSlug === pathSlug);
      let next: StudyPathProgress[];
      if (existing) {
        const completed = existing.completedSteps.includes(stepOrder)
          ? existing.completedSteps.filter(o => o !== stepOrder)
          : [...existing.completedSteps, stepOrder].sort((a, b) => a - b);
        next = studyPathProgress.map(p =>
          p.pathSlug === pathSlug ? {...p, completedSteps: completed, updatedAt: Date.now()} : p,
        );
      } else {
        next = [
          ...studyPathProgress,
          {pathSlug, completedSteps: [stepOrder], updatedAt: Date.now()},
        ];
      }
      setStudyPathProgressState(next);
      await persist({studyPathProgress: next});
    },
    [studyPathProgress, persist],
  );

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
      studyPathProgress,
      recentlyViewed,
      sadhanaStreak,
      readingFontScale,
      playbackRate,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      setReadingProgress,
      clearReadingProgress,
      addRecentItem,
      recordSadhanaPractice,
      isStudyStepComplete,
      toggleStudyStep,
      getStudyPathProgress,
      setReadingFontScale,
      setPlaybackRate: setPlaybackRatePref,
      syncBookmarksFromCloud,
      sanskritFontSize: fontSizes.sanskrit,
      translationFontSize: fontSizes.translation,
    }),
    [
      favorites,
      readingProgress,
      studyPathProgress,
      recentlyViewed,
      sadhanaStreak,
      readingFontScale,
      playbackRate,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      setReadingProgress,
      clearReadingProgress,
      addRecentItem,
      recordSadhanaPractice,
      isStudyStepComplete,
      toggleStudyStep,
      getStudyPathProgress,
      setReadingFontScale,
      setPlaybackRatePref,
      syncBookmarksFromCloud,
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
