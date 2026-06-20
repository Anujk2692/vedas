import {useCallback, useEffect, useRef, useState} from 'react';
import {hydrateCache, storeCache, buildCacheKey} from '../api/cache';

interface Options {
  enabled?: boolean;
  staleWhileRevalidate?: boolean;
}

export function useCachedFetch<T>(
  path: string,
  lang: string | undefined,
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: Options = {},
) {
  const {enabled = true, staleWhileRevalidate = true} = options;
  const key = buildCacheKey(path, lang);
  const [data, setData] = useState<T | null>(null);
  const dataRef = useRef<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(
    async (background = false) => {
      if (!enabled) {
        return;
      }
      if (!background) {
        setError(null);
      }

      if (!background) {
        const cached = await hydrateCache<T>(key);
        if (cached && mounted.current) {
          dataRef.current = cached;
          setData(cached);
          setLoading(false);
          if (!staleWhileRevalidate) {
            return;
          }
        }
      }

      if (background) {
        setRefreshing(true);
      } else if (!dataRef.current) {
        setLoading(true);
      }

      try {
        const fresh = await fetcher();
        if (!mounted.current) {
          return;
        }
        await storeCache(key, fresh);
        dataRef.current = fresh;
        setData(fresh);
        setError(null);
      } catch (e) {
        if (!mounted.current) {
          return;
        }
        if (!dataRef.current) {
          setError(e instanceof Error ? e.message : 'Failed to load');
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, fetcher, key, staleWhileRevalidate, ...deps],
  );

  useEffect(() => {
    load(false);
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  return {data, loading, refreshing, error, refresh, setData};
}
