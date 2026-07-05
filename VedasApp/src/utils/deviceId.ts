import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = '@vedas_device_id';

function generateId(): string {
  return `sg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function getDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existing?.trim()) {
      return existing.trim();
    }
    const id = generateId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
    return id;
  } catch {
    return generateId();
  }
}
