import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Platform} from 'react-native';

const REMINDER_KEY = '@vedas_daily_shlok_reminder';
const ANDROID_CHANNEL_ID = 'daily-shlok';

export async function isDailyReminderEnabled(): Promise<boolean> {
  const v = await AsyncStorage.getItem(REMINDER_KEY);
  return v === 'true';
}

export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: 'Daily Shlok',
    importance: AndroidImportance.HIGH,
  });
}

export async function setDailyReminderEnabled(enabled: boolean): Promise<{ok: boolean; message: string}> {
  if (enabled) {
    const granted = await requestNotificationPermission();
    if (!granted) {
      return {
        ok: false,
        message:
          Platform.OS === 'android'
            ? 'Allow notifications in system settings to receive daily shlok reminders.'
            : 'Allow notifications when prompted to receive daily shlok reminders.',
      };
    }
    await AsyncStorage.setItem(REMINDER_KEY, 'true');
    await scheduleDailyShlokReminder();
    return {ok: true, message: 'Daily reminder scheduled for 7:00 AM.'};
  }

  await AsyncStorage.setItem(REMINDER_KEY, 'false');
  await notifee.cancelTriggerNotifications();
  return {ok: true, message: 'Daily reminder turned off.'};
}

export async function scheduleDailyShlokReminder(hour = 7, minute = 0): Promise<void> {
  await ensureAndroidChannel();

  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hour, minute, 0, 0);
  if (triggerDate.getTime() <= now.getTime()) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerDate.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.cancelTriggerNotifications();
  await notifee.createTriggerNotification(
    {
      id: 'daily-shlok-reminder',
      title: '🕉 आज का श्लोक',
      body: 'Sanatan Gyan — अपना दैनिक श्लोक पढ़ें',
      android: {
        channelId: ANDROID_CHANNEL_ID,
        pressAction: {id: 'default'},
      },
      ios: {
        sound: 'default',
      },
    },
    trigger,
  );
}

/** Fire an immediate notification — use from Settings to verify on a physical device. */
export async function sendTestNotification(): Promise<{ok: boolean; message: string}> {
  const granted = await requestNotificationPermission();
  if (!granted) {
    return {
      ok: false,
      message:
        Platform.OS === 'android'
          ? 'Permission denied. Open Settings → Apps → Sanatan Gyan → Notifications and allow.'
          : 'Permission denied. Open Settings → Sanatan Gyan → Notifications and allow.',
    };
  }

  await ensureAndroidChannel();
  await notifee.displayNotification({
    id: `test-${Date.now()}`,
    title: '🕉 Test — Sanatan Gyan',
    body: 'Notifications are working. Daily shlok arrives at 7:00 AM.',
    android: {
      channelId: ANDROID_CHANNEL_ID,
      pressAction: {id: 'default'},
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });

  return {ok: true, message: 'Test notification sent — check your notification shade.'};
}

export function showNotificationHelp(): void {
  Alert.alert(
    'Notification testing',
    Platform.OS === 'android'
      ? '1. Tap "Send Test Notification"\n2. If blocked, allow notifications for Sanatan Gyan in Android Settings\n3. Turn on Daily Shlok Reminder for 7 AM alerts'
      : '1. Run pod install in VedasApp/ios after pulling\n2. Rebuild the app on your iPhone\n3. Tap "Send Test Notification" and allow alerts\n4. Turn on Daily Shlok Reminder for 7 AM alerts',
  );
}
