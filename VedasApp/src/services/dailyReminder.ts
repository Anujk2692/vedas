import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

const REMINDER_KEY = '@vedas_daily_shlok_reminder';

export async function isDailyReminderEnabled(): Promise<boolean> {
  const v = await AsyncStorage.getItem(REMINDER_KEY);
  return v === 'true';
}

export async function setDailyReminderEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(REMINDER_KEY, enabled ? 'true' : 'false');
  if (enabled) {
    await scheduleDailyShlokReminder();
  } else {
    await notifee.cancelTriggerNotifications();
  }
}

export async function scheduleDailyShlokReminder(hour = 7, minute = 0): Promise<void> {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'daily-shlok',
      name: 'Daily Shlok',
      importance: AndroidImportance.HIGH,
    });
  }

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
      title: '🕉 आज का श्लोक',
      body: 'Sanatan Gyan — अपना दैनिक श्लोक पढ़ें',
      android: {
        channelId: 'daily-shlok',
        pressAction: {id: 'default'},
      },
      ios: {
        sound: 'default',
      },
    },
    trigger,
  );
}
