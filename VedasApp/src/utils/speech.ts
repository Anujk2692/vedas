import Tts from 'react-native-tts';
import {Platform} from 'react-native';

const TTS_LANGUAGE: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  sa: 'hi-IN',
};

let initialized = false;
let voicesLoaded = false;
const voiceByLanguage: Record<string, string> = {};

export async function ensureSpeechReady(): Promise<void> {
  if (initialized) {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    Tts.getInitStatus()
      .then(async () => {
        initialized = true;
        Tts.setIgnoreSilentSwitch('ignore');
        Tts.setDucking(true);
        if (Platform.OS === 'ios') {
          Tts.setDefaultRate(0.48);
        } else {
          Tts.setDefaultRate(0.5);
        }
        await loadPreferredVoices();
        resolve();
      })
      .catch((err: unknown) => {
        Tts.requestInstallEngine?.();
        reject(err);
      });
  });
}

async function loadPreferredVoices(): Promise<void> {
  if (voicesLoaded) {
    return;
  }
  try {
    const voices = (await Tts.voices()) as Array<{id?: string; language?: string; notInstalled?: boolean}>;
    for (const lang of ['hi-IN', 'en-US', 'en-GB']) {
      const match = voices.find(
        v => !v.notInstalled && v.language?.startsWith(lang.split('-')[0]),
      );
      if (match?.id) {
        voiceByLanguage[lang.split('-')[0]] = match.id;
      }
    }
    voicesLoaded = true;
  } catch {
    voicesLoaded = true;
  }
}

export function ttsLanguageCode(appLanguage: string): string {
  return TTS_LANGUAGE[appLanguage] ?? 'en-US';
}

export async function speakTranslatedText(text: string, appLanguage: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }

  await ensureSpeechReady();
  await Tts.stop();

  const langCode = ttsLanguageCode(appLanguage);
  await Tts.setDefaultLanguage(langCode);

  const voiceKey = appLanguage === 'en' ? 'en' : 'hi';
  const voiceId = voiceByLanguage[voiceKey];
  if (voiceId) {
    await Tts.setDefaultVoice(voiceId);
  }

  await new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      reject(new Error('Speech playback failed'));
    };
    Tts.addEventListener('tts-finish', finish);
    Tts.addEventListener('tts-cancel', finish);
    Tts.addEventListener('tts-error', fail);

    try {
      Tts.speak(trimmed);
    } catch (e) {
      fail();
    }
  });
}

export async function stopSpeech(): Promise<void> {
  try {
    await Tts.stop();
  } catch {
    // ignore when engine is unavailable
  }
}

export function onSpeechFinish(callback: () => void): () => void {
  Tts.addEventListener('tts-finish', callback);
  return () => undefined;
}
