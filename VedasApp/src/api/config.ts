import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {clearAllApiCache} from './cache';

const API_HOST_KEY = '@vedas_api_host';

// Your Mac's LAN IP — iPhone must use this instead of localhost
export const DEV_MACHINE_IP = '192.168.0.111';

function defaultDevHost(): string {
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  // iOS Simulator reaches the Mac backend at localhost; physical iPhone needs LAN IP in Settings
  return 'localhost';
}

let cachedHost: string | null = null;

export async function getApiHost(): Promise<string> {
  if (cachedHost) {
    return cachedHost;
  }
  try {
    const saved = await AsyncStorage.getItem(API_HOST_KEY);
    cachedHost = saved?.trim() || defaultDevHost();
  } catch {
    cachedHost = defaultDevHost();
  }
  return cachedHost;
}

export async function setApiHost(host: string): Promise<void> {
  const trimmed = host.trim();
  cachedHost = trimmed || defaultDevHost();
  await AsyncStorage.setItem(API_HOST_KEY, cachedHost);
  await clearAllApiCache();
}

export async function testApiConnection(host?: string): Promise<{ok: boolean; message: string}> {
  const targetHost = host?.trim() || (await getApiHost());
  const url = `http://${targetHost}:8080/api/languages`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
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
      return {ok: false, message: 'Timed out — is the backend running on port 8080?'};
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
  return `http://${host}:8080/api`;
}

export function getDefaultApiHost(): string {
  return defaultDevHost();
}
