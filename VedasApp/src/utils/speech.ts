import Tts from 'react-native-tts';
import {Platform} from 'react-native';

const TTS_LANGUAGE: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  sa: 'hi-IN',
};

let initialized = false;
let voicesLoaded = false;
let hindiVoiceAvailable = false;
const voiceByLanguage: Record<string, string> = {};
let activeSpeakSeq = 0;

export async function ensureSpeechReady(): Promise<void> {
  if (initialized) {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    Tts.getInitStatus()
      .then(async () => {
        initialized = true;
        try {
          Tts.setIgnoreSilentSwitch('ignore');
          Tts.setDucking(true);
          if (Platform.OS === 'ios') {
            Tts.setDefaultRate(0.48);
          } else {
            Tts.setDefaultRate(0.5);
          }
        } catch {
          // ignore optional audio session config errors
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
    const voices = (await Tts.voices()) as Array<{
      id?: string;
      language?: string;
      notInstalled?: boolean;
    }>;
    const hiMatch = voices.find(
      v => !v.notInstalled && v.language?.toLowerCase().startsWith('hi'),
    );
    if (hiMatch?.id) {
      voiceByLanguage.hi = hiMatch.id;
      hindiVoiceAvailable = true;
    }
    const enMatch =
      voices.find(v => !v.notInstalled && v.language?.toLowerCase() === 'en-in') ??
      voices.find(v => !v.notInstalled && v.language?.toLowerCase().startsWith('en'));
    if (enMatch?.id) {
      voiceByLanguage.en = enMatch.id;
    }
    voicesLoaded = true;
  } catch {
    voicesLoaded = true;
  }
}

export function ttsLanguageCode(appLanguage: string): string {
  return TTS_LANGUAGE[appLanguage] ?? 'en-US';
}

/** Strip emoji, dandas, and normalize whitespace for TTS playback. */
export function stripForSpeech(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/[।॥|]+/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function speakAnswerText(text: string, appLanguage: string): Promise<void> {
  const speakable = stripForSpeech(text);
  if (!speakable) {
    return;
  }
  await speakTranslatedText(speakable, appLanguage);
}

/**
 * Speak devotional stanzas reliably on both real devices and simulators:
 * uses Hindi TTS when a Hindi voice is installed, and falls back to Roman
 * transliteration with English TTS when the device lacks a Hindi voice.
 */
export async function speakDevotionalText(
  sanskrit: string,
  transliteration: string,
  _appLanguage?: string,
): Promise<void> {
  await ensureSpeechReady();
  const useHindi = hindiVoiceAvailable && Boolean(stripForSpeech(sanskrit));
  const chosenText = useHindi
    ? stripForSpeech(sanskrit)
    : stripForSpeech(transliteration || sanskrit);
  if (!chosenText) {
    return;
  }
  await speakTranslatedText(chosenText, useHindi ? 'hi' : 'en');
}

export async function speakTranslatedText(text: string, appLanguage: string): Promise<void> {
  const trimmed = stripForSpeech(text);
  if (!trimmed) {
    return;
  }

  await ensureSpeechReady();
  const seq = ++activeSpeakSeq;
  try {
    await Tts.stop();
  } catch {
    // ignore
  }

  const langCode = ttsLanguageCode(appLanguage);
  try {
    await Tts.setDefaultLanguage(langCode);
  } catch {
    // fallback to device default language if locale is unavailable
  }

  const voiceKey = appLanguage === 'en' ? 'en' : 'hi';
  const voiceId = voiceByLanguage[voiceKey];
  if (voiceId) {
    try {
      await Tts.setDefaultVoice(voiceId);
    } catch {
      // ignore if voice id cannot be selected
    }
  }

  await new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = () => {
      if (settled || seq !== activeSpeakSeq) {
        return;
      }
      settled = true;
      resolve();
    };
    const fail = () => {
      if (settled || seq !== activeSpeakSeq) {
        return;
      }
      settled = true;
      reject(new Error('Speech playback failed'));
    };
    Tts.addEventListener('tts-finish', finish);
    Tts.addEventListener('tts-error', fail);

    try {
      Tts.speak(trimmed);
    } catch {
      fail();
    }
  });
}

export async function stopSpeech(): Promise<void> {
  activeSpeakSeq += 1;
  try {
    await Tts.stop();
  } catch {
    // ignore when engine is unavailable
  }
}

export function onSpeechFinish(callback: () => void): () => void {
  const handler = () => callback();
  Tts.addEventListener('tts-finish', handler);
  return () => undefined;
}
