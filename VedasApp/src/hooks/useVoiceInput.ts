import {useCallback, useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';

function voiceLocale(appLanguage: string): string {
  if (appLanguage === 'hi' || appLanguage === 'sa') {
    return 'hi-IN';
  }
  return 'en-US';
}

async function ensureMicPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Microphone permission',
      message: 'Sanatan Gyan needs microphone access so you can ask AI Guru by voice.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export function useVoiceInput(appLanguage: string) {
  const [listening, setListening] = useState(false);
  const [partialText, setPartialText] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const onResultRef = useRef<(text: string) => void>(() => {});

  useEffect(() => {
    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      const text = event.value?.[0]?.trim();
      if (text) {
        onResultRef.current(text);
      }
      setListening(false);
      setPartialText('');
    };
    Voice.onSpeechPartialResults = (event: SpeechResultsEvent) => {
      setPartialText(event.value?.[0] ?? '');
    };
    Voice.onSpeechError = (_event: SpeechErrorEvent) => {
      setListening(false);
      setPartialText('');
      setVoiceError('Could not recognize speech. Try again or type your question.');
    };
    Voice.onSpeechEnd = () => {
      setListening(false);
    };

    return () => {
      Voice.destroy()
        .then(Voice.removeAllListeners)
        .catch(() => undefined);
    };
  }, []);

  const startListening = useCallback(
    async (onResult: (text: string) => void) => {
      onResultRef.current = onResult;
      setVoiceError(null);
      setPartialText('');

      const permitted = await ensureMicPermission();
      if (!permitted) {
        setVoiceError('Microphone permission is required for voice questions.');
        return;
      }

      try {
        await Voice.cancel();
        setListening(true);
        await Voice.start(voiceLocale(appLanguage));
      } catch {
        setListening(false);
        setVoiceError('Voice input is not available on this device.');
      }
    },
    [appLanguage],
  );

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
    } catch {
      try {
        await Voice.cancel();
      } catch {
        // ignore
      }
    }
    setListening(false);
    setPartialText('');
  }, []);

  return {
    listening,
    partialText,
    voiceError,
    clearVoiceError: () => setVoiceError(null),
    startListening,
    stopListening,
  };
}
