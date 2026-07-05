import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {AskResponse} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {SanskritText} from '../components/SanskritText';
import {InfoBanner} from '../components/ui/InfoBanner';
import {useVoiceInput} from '../hooks/useVoiceInput';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {speakAnswerText, stopSpeech} from '../utils/speech';
import {LIST_BOTTOM_INSET} from '../utils/layout';

const SUGGESTIONS = ['कर्म योग क्या है?', 'मोक्ष का मार्ग', 'भगवद गीता का सार', 'What is dharma?'];
const HISTORY_KEY = '@sanatan_ai_guru_history';
const AUTO_SPEAK_KEY = '@sanatan_ai_guru_auto_speak';

type HistoryItem = {
  id: string;
  question: string;
  answer: string;
  at: number;
};

export function AiGuruScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const {
    listening,
    partialText,
    voiceError,
    clearVoiceError,
    startListening,
    stopListening,
  } = useVoiceInput(language);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(AUTO_SPEAK_KEY),
      AsyncStorage.getItem(HISTORY_KEY),
    ]).then(([auto, hist]) => {
      if (auto != null) {
        setAutoSpeak(auto !== 'false');
      }
      if (hist) {
        try {
          setHistory(JSON.parse(hist) as HistoryItem[]);
        } catch {
          setHistory([]);
        }
      }
    });
    return () => {
      stopSpeech().catch(() => undefined);
    };
  }, []);

  const saveHistory = useCallback(async (q: string, answer: string) => {
    const item: HistoryItem = {
      id: `${Date.now()}`,
      question: q,
      answer,
      at: Date.now(),
    };
    setHistory(prev => {
      const next = [item, ...prev.filter(h => h.question !== q)].slice(0, 8);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const toggleAutoSpeak = useCallback(async (value: boolean) => {
    setAutoSpeak(value);
    await AsyncStorage.setItem(AUTO_SPEAK_KEY, value ? 'true' : 'false');
  }, []);

  const playAnswer = useCallback(
    async (text: string) => {
      if (speaking) {
        await stopSpeech();
        setSpeaking(false);
        return;
      }
      setSpeaking(true);
      try {
        await speakAnswerText(text, language);
      } catch {
        setError('Could not play audio answer on this device.');
      } finally {
        setSpeaking(false);
      }
    },
    [language, speaking],
  );

  const ask = useCallback(
    async (q: string, options?: {skipVoiceStop?: boolean}) => {
      const trimmed = q.trim();
      if (trimmed.length < 2) {
        return;
      }
      if (!options?.skipVoiceStop) {
        await stopListening();
      }
      await stopSpeech();
      setSpeaking(false);
      setLoading(true);
      setError(null);
      clearVoiceError();
      try {
        const result = await api.askGuru(trimmed, language);
        setResponse(result);
        setQuestion(trimmed);
        await saveHistory(trimmed, result.answer);
        if (autoSpeak && result.answer) {
          setSpeaking(true);
          try {
            await speakAnswerText(result.answer, language);
          } catch {
            // non-fatal — written answer still shown
          } finally {
            setSpeaking(false);
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to get answer');
      } finally {
        setLoading(false);
      }
    },
    [autoSpeak, clearVoiceError, language, saveHistory, stopListening],
  );

  const onMicPress = async () => {
    if (listening) {
      await stopListening();
      return;
    }
    await startListening(text => {
      setQuestion(text);
      ask(text, {skipVoiceStop: true});
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <InfoBanner
          icon="🙏"
          text="AI Guru — बोलकर पूछें, लिखित + आवाज़ में उत्तर पाएँ। शास्त्र-आधारित मार्गदर्शन।"
        />
        {error && <ErrorBanner message={error} onRetry={() => ask(question)} />}
        {voiceError && <ErrorBanner message={voiceError} onRetry={clearVoiceError} />}

        <View style={styles.autoSpeakRow}>
          <Text style={styles.autoSpeakLabel}>उत्तर स्वचालित सुनें</Text>
          <Switch
            value={autoSpeak}
            onValueChange={toggleAutoSpeak}
            trackColor={{false: colors.borderLight, true: colors.primaryLight}}
            thumbColor={autoSpeak ? colors.primary : colors.textMuted}
          />
        </View>

        {listening ? (
          <View style={styles.listeningCard}>
            <Text style={styles.listeningTitle}>🎤 सुन रहा हूँ…</Text>
            <Text style={styles.listeningHint}>
              {partialText || 'धर्म, कर्म, मोक्ष, गीता — अपना प्रश्न बोलें'}
            </Text>
          </View>
        ) : null}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="अपना प्रश्न पूछें या 🎤 दबाएँ…"
            placeholderTextColor={colors.textMuted}
            value={question}
            onChangeText={setQuestion}
            onSubmitEditing={() => ask(question)}
            returnKeyType="search"
          />
          <Pressable
            style={({pressed}) => [
              styles.micBtn,
              listening && styles.micBtnActive,
              pressed && styles.pressed,
            ]}
            onPress={onMicPress}
            disabled={loading}>
            <Text style={styles.micBtnText}>{listening ? '⏹' : '🎤'}</Text>
          </Pressable>
          <Pressable
            style={[styles.askBtn, loading && styles.askBtnDisabled]}
            onPress={() => ask(question)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.askBtnText}>पूछें</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.suggestions}>
          {SUGGESTIONS.map(s => (
            <Pressable key={s} style={styles.chip} onPress={() => ask(s)}>
              <Text style={styles.chipText}>{s}</Text>
            </Pressable>
          ))}
        </View>

        {response ? (
          <View style={styles.answerCard}>
            <View style={styles.answerHeader}>
              <Text style={styles.answerLabel}>
              उत्तर{response.aiPowered ? ' · ✨ Krishna AI' : ''}
            </Text>
              <Pressable
                style={({pressed}) => [styles.listenBtn, pressed && styles.pressed]}
                onPress={() => playAnswer(response.answer)}>
                <Text style={styles.listenBtnText}>
                  {speaking ? '⏹ रोकें' : '🔊 सुनें'}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.answer}>{response.answer}</Text>
          </View>
        ) : null}

        {response?.relatedVerses?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>संबंधित श्लोक</Text>
            {response.relatedVerses.map(v => (
              <Pressable
                key={v.id}
                style={styles.verseCard}
                onPress={() =>
                  navigation.navigate('ChapterReader', {
                    chapterId: v.chapterId,
                    title: `Verse ${v.number}`,
                  })
                }>
                <SanskritText text={v.sanskrit} size={18} />
                <Text style={styles.verseTr} numberOfLines={3}>
                  {v.translation}
                </Text>
                {v.audioUrl?.trim() ? (
                  <Text style={styles.verseAudioHint}>🎵 Chapter audio available</Text>
                ) : null}
              </Pressable>
            ))}
          </View>
        ) : null}

        {response?.relatedTopics?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>संबंधित विषय</Text>
            {response.relatedTopics.map(t => (
              <Pressable
                key={t.slug}
                style={styles.topicRow}
                onPress={() => navigation.navigate('TopicDetail', {slug: t.slug, title: t.title})}>
                <Text style={styles.topicIcon}>{t.icon}</Text>
                <Text style={styles.topicTitle}>{t.title}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {history.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>हाल के प्रश्न</Text>
            {history.map(item => (
              <Pressable
                key={item.id}
                style={styles.historyRow}
                onPress={() => {
                  setQuestion(item.question);
                  setResponse({answer: item.answer, relatedScriptures: [], relatedChapters: [], relatedVerses: [], relatedTopics: []});
                }}>
                <Text style={styles.historyQ} numberOfLines={1}>{item.question}</Text>
                <Text style={styles.historyA} numberOfLines={2}>{item.answer}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  scroll: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  autoSpeakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  autoSpeakLabel: {fontSize: 13, fontWeight: '700', color: colors.textSecondary},
  listeningCard: {
    backgroundColor: colors.tabActive,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  listeningTitle: {fontSize: 15, fontWeight: '800', color: colors.primaryDark},
  listeningHint: {fontSize: 13, color: colors.textSecondary, marginTop: 6, lineHeight: 20},
  inputRow: {flexDirection: 'row', gap: 8, marginBottom: spacing.sm, alignItems: 'center'},
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  micBtn: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  micBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  micBtnText: {fontSize: 20},
  askBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 16,
    minHeight: 46,
    justifyContent: 'center',
    ...shadows.sm,
  },
  askBtnDisabled: {opacity: 0.7},
  askBtnText: {color: colors.white, fontWeight: '800', fontSize: 14},
  pressed: {opacity: 0.88},
  suggestions: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg},
  chip: {
    backgroundColor: colors.tabActive,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipText: {fontSize: 12, fontWeight: '600', color: colors.primaryDark},
  answerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  answerLabel: {fontSize: 11, fontWeight: '800', color: colors.primary},
  listenBtn: {
    backgroundColor: colors.tabActive,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  listenBtnText: {fontSize: 12, fontWeight: '800', color: colors.primaryDark},
  answer: {fontSize: 15, lineHeight: 24, color: colors.text},
  section: {marginBottom: spacing.lg},
  sectionTitle: {fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: spacing.sm},
  verseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  verseTr: {fontSize: 13, color: colors.textSecondary, marginTop: 6, lineHeight: 19},
  verseAudioHint: {fontSize: 11, color: colors.primary, marginTop: 8, fontWeight: '600'},
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: 10,
  },
  topicIcon: {fontSize: 22},
  topicTitle: {fontSize: 14, fontWeight: '700', color: colors.text, flex: 1},
  historyRow: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  historyQ: {fontSize: 13, fontWeight: '800', color: colors.text},
  historyA: {fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 18},
});
