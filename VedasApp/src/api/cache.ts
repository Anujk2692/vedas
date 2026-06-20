import AsyncStorage from '@react-native-async-storage/async-storage';

const MEMORY = new Map<string, {data: unknown; expiry: number}>();
const DEFAULT_TTL_MS = 15 * 60 * 1000;
const PERSIST_PREFIX = '@vedas_api_cache:v2:';
const PERSIST_TTL_MS = 60 * 60 * 1000;
const MAX_PERSIST_ENTRIES = 40;

const PERSIST_PATHS = [
  '/vedas',
  '/aartis',
  '/media/all?type=VIDEO',
  '/media/all?type=AUDIO',
];

export function buildCacheKey(path: string, lang?: string): string {
  return `${path}|${lang ?? ''}`;
}

export function getMemoryCache<T>(key: string): T | null {
  const hit = MEMORY.get(key);
  if (!hit || hit.expiry <= Date.now()) {
    if (hit) {
      MEMORY.delete(key);
    }
    return null;
  }
  return hit.data as T;
}

export function setMemoryCache(key: string, data: unknown, ttlMs = DEFAULT_TTL_MS): void {
  MEMORY.set(key, {data, expiry: Date.now() + ttlMs});
}

export function clearApiCache(): void {
  MEMORY.clear();
}

export async function clearPersistedCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(PERSIST_PREFIX) || k.startsWith('@vedas_api_cache:'));
    if (cacheKeys.length > 0) {
      await Promise.all(cacheKeys.map(k => AsyncStorage.removeItem(k)));
    }
  } catch {
    // ignore
  }
}

export async function clearAllApiCache(): Promise<void> {
  clearApiCache();
  await clearPersistedCache();
}

function shouldPersist(path: string): boolean {
  const base = path.split('?')[0];
  if (PERSIST_PATHS.some(p => base.startsWith(p) || base === p)) {
    return true;
  }
  if (/^\/aartis\/[^/?]+$/.test(base)) {
    return true;
  }
  if (/^\/vedas\/[^/?]+$/.test(base)) {
    return true;
  }
  if (/^\/vedas\/[^/?]+\/chapters$/.test(base)) {
    return true;
  }
  if (/^\/chapters\/[^/?]+$/.test(base)) {
    return true;
  }
  return false;
}

export async function getPersistedCache<T>(key: string): Promise<T | null> {
  if (!shouldPersist(key.split('|')[0])) {
    return null;
  }
  try {
    const raw = await AsyncStorage.getItem(PERSIST_PREFIX + key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as {data: T; expiry: number};
    if (parsed.expiry <= Date.now()) {
      await AsyncStorage.removeItem(PERSIST_PREFIX + key);
      return null;
    }
    setMemoryCache(key, parsed.data, parsed.expiry - Date.now());
    return parsed.data;
  } catch {
    return null;
  }
}

export async function setPersistedCache(key: string, data: unknown): Promise<void> {
  if (!shouldPersist(key.split('|')[0])) {
    return;
  }
  try {
    const payload = JSON.stringify({data, expiry: Date.now() + PERSIST_TTL_MS});
    await AsyncStorage.setItem(PERSIST_PREFIX + key, payload);
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(PERSIST_PREFIX));
    if (cacheKeys.length > MAX_PERSIST_ENTRIES) {
      const toRemove = cacheKeys.slice(0, cacheKeys.length - MAX_PERSIST_ENTRIES);
      await Promise.all(toRemove.map(k => AsyncStorage.removeItem(k)));
    }
  } catch {
    // ignore storage failures
  }
}

export async function hydrateCache<T>(key: string): Promise<T | null> {
  const mem = getMemoryCache<T>(key);
  if (mem) {
    return mem;
  }
  return getPersistedCache<T>(key);
}

export async function storeCache(key: string, data: unknown): Promise<void> {
  setMemoryCache(key, data);
  await setPersistedCache(key, data);
}
