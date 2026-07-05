import {getApiBaseUrl} from './config';
import {buildCacheKey, hydrateCache, storeCache} from './cache';
import type {
  AartiDetail,
  AartiSummary,
  Chapter,
  Language,
  MediaItem,
  SearchResult,
  TranslateResult,
  SanatanHub,
  StudyPath,
  Topic,
  DailyShlok,
  ExternalResource,
  Panchang,
  AskResponse,
  Veda,
  Verse,
} from './types';

type RequestOptions = {skipCache?: boolean};

async function request<T>(
  path: string,
  lang?: string,
  options: RequestOptions = {},
): Promise<T> {
  const {skipCache = false} = options;
  const cacheKey = buildCacheKey(path, lang);

  if (!skipCache) {
    const cached = await hydrateCache<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const baseUrl = await getApiBaseUrl();
  const separator = path.includes('?') ? '&' : '?';
  const langParam = lang ? `${separator}lang=${lang}` : '';
  const url = `${baseUrl}${path}${langParam}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {signal: controller.signal});
    if (!response.ok) {
      const message = await response.text().catch(() => '');
      throw new Error(message || `Server error (${response.status})`);
    }
    const json = (await response.json()) as T;
    await storeCache(cacheKey, json);
    return json;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Check that the backend is running.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function postRequest<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = await getApiBaseUrl();
  const url = `${baseUrl}${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      const message = await response.text().catch(() => '');
      throw new Error(message || `Server error (${response.status})`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Check that the backend is running.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  getLanguages: () => request<Language[]>('/languages'),
  getVedas: (lang: string, fresh = false) =>
    request<Veda[]>('/vedas', lang, {skipCache: fresh}),
  getVeda: (idOrSlug: string, lang: string, fresh = false) =>
    request<Veda>(`/vedas/${idOrSlug}`, lang, {skipCache: fresh}),
  getChapters: (vedaId: string, lang: string, fresh = false) =>
    request<Chapter[]>(`/vedas/${vedaId}/chapters`, lang, {skipCache: fresh}),
  getChapter: (chapterId: string, lang: string, fresh = false) =>
    request<Chapter>(`/chapters/${chapterId}`, lang, {skipCache: fresh}),
  getVerses: (chapterId: string, lang: string, fresh = false) =>
    request<Verse[]>(`/chapters/${chapterId}/verses`, lang, {skipCache: fresh}),
  getVerse: (verseId: string, lang: string) =>
    request<Verse>(`/verses/${verseId}`, lang),
  getFeaturedMedia: (type: 'AUDIO' | 'VIDEO', lang: string) =>
    request<MediaItem[]>(`/media/featured?type=${type}`, lang),
  getAllMedia: (type: 'AUDIO' | 'VIDEO', lang: string, fresh = false) =>
    request<MediaItem[]>(`/media/all?type=${type}`, lang, {skipCache: fresh}),
  getVedaMedia: (vedaId: string, type: 'AUDIO' | 'VIDEO', lang: string) =>
    request<MediaItem[]>(`/vedas/${vedaId}/media?type=${type}`, lang),
  getChapterMedia: (chapterId: string, type: 'AUDIO' | 'VIDEO', lang: string) =>
    request<MediaItem[]>(`/chapters/${chapterId}/media?type=${type}`, lang),
  search: (query: string, lang: string) =>
    request<SearchResult>(`/search?q=${encodeURIComponent(query)}`, lang, {skipCache: true}),
  getAartis: (lang: string, fresh = false) =>
    request<AartiSummary[]>('/aartis', lang, {skipCache: fresh}),
  getAartisByType: (type: 'DEVI' | 'DEVTA', lang: string, fresh = false) =>
    request<AartiSummary[]>(`/aartis/type/${type}`, lang, {skipCache: fresh}),
  getAarti: (slug: string, lang: string, fresh = false) =>
    request<AartiDetail>(`/aartis/${slug}`, lang, {skipCache: fresh}),
  translate: (text: string, lang: string) =>
    postRequest<TranslateResult>('/translate', {text, lang}),
  getSanatanHub: (lang: string, fresh = false) =>
    request<SanatanHub>('/sanatan/hub', lang, {skipCache: fresh}),
  getStudyPath: (slug: string, lang: string) =>
    request<StudyPath>(`/sanatan/study-paths/${slug}`, lang),
  getTopic: (slug: string, lang: string) =>
    request<Topic>(`/sanatan/topics/${slug}`, lang),
  getResources: (lang: string, scriptureSlug?: string, topicSlug?: string) => {
    const params = new URLSearchParams();
    if (scriptureSlug) params.set('scriptureSlug', scriptureSlug);
    if (topicSlug) params.set('topicSlug', topicSlug);
    const qs = params.toString();
    return request<ExternalResource[]>(`/sanatan/resources${qs ? `?${qs}` : ''}`, lang);
  },
  getDailyShlok: (lang: string) => request<DailyShlok>('/sanatan/daily-shlok', lang),
  getPanchang: (lang: string) => request<Panchang>('/sanatan/panchang', lang),
  askGuru: (question: string, lang: string) =>
    postRequest<AskResponse>('/sanatan/ask', {question, lang}),
};
