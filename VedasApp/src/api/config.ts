import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {clearAllApiCache} from './cache';

const API_HOST_KEY = '@vedas_api_host';

/** Live Render backend — https://vedas-oax2.onrender.com/api */
export const PRODUCTION_API_HOST = 'vedas-oax2.onrender.com';

// Your Mac's LAN IP — physical iPhone local dev
export const DEV_MACHINE_IP = '192.168.0.111';

function defaultDevHost(): string {
  if (!__DEV__) {
    return PRODUCTION_API_HOST;
  }
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  return 'localhost';
}

let cachedHost: string | null = null;

/** Strip protocol, path, and trailing slashes — store host only. */
export function normalizeApiHost(input: string): string {
  let host = input.trim();
  if (!host) {
    return defaultDevHost();
  }
  host = host.replace(/^https?:\/\//i, '');
  host = host.replace(/\/api\/?$/i, '');
  host = host.replace(/\/+$/, '');
  return host.split('/')[0];
}

export function buildApiBaseUrl(host: string): string {
  const normalized = normalizeApiHost(host);
  if (normalized.includes('onrender.com')) {
    return `https://${normalized}/api`;
  }
  const withPort = normalized.includes(':') ? normalized : `${normalized}:8080`;
  return `http://${withPort}/api`;
}

export async function getApiHost(): Promise<string> {
  if (cachedHost) {
    return cachedHost;
  }
  try {
    const saved = await AsyncStorage.getItem(API_HOST_KEY);
    cachedHost = saved?.trim() ? normalizeApiHost(saved) : defaultDevHost();
  } catch {
    cachedHost = defaultDevHost();
  }
  return cachedHost;
}

export async function setApiHost(host: string): Promise<void> {
  cachedHost = normalizeApiHost(host) || defaultDevHost();
  await AsyncStorage.setItem(API_HOST_KEY, cachedHost);
  await clearAllApiCache();
}

export async function testApiConnection(host?: string): Promise<{ok: boolean; message: string}> {
  const targetHost = host?.trim() ? normalizeApiHost(host) : await getApiHost();
  const url = `${buildApiBaseUrl(targetHost)}/languages`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {signal: controller.signal});
    if (!response.ok) {
      return {ok: false, message: `Server returned ${response.status}`};
    }
    const data = await response.json();
    const count = Array.isArray(data) ? data.length : 0;
    return {ok: true, message: `Connected — ${count} languages loaded`};
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return {ok: false, message: 'Timed out — check server address and try again'};
    }
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Could not reach backend',
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getApiBaseUrl(): Promise<string> {
  const host = await getApiHost();
  return buildApiBaseUrl(host);
}

export function getDefaultApiHost(): string {
  return defaultDevHost();
}

export function getProductionApiHost(): string {
  return PRODUCTION_API_HOST;
}
