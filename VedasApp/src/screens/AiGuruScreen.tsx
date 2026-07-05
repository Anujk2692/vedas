import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {AskResponse} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {SanskritText} from '../components/SanskritText';
import {InfoBanner} from '../components/ui/InfoBanner';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {LIST_BOTTOM_INSET} from '../utils/layout';

const SUGGESTIONS = ['कर्म योग क्या है?', 'मोक्ष का मार्ग', 'भगवद गीता का सार', 'What is dharma?'];

export function AiGuruScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AskResponse | null>(null);

  const ask = async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.askGuru(trimmed, language);
      setResponse(result);
      setQuestion(trimmed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to get answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <InfoBanner
          icon="🙏"
          text="AI Guru शास्त्र-आधारित उत्तर देता है — संबंधित श्लोक, अध्याय और विषय खोजकर।"
        />
        {error && <ErrorBanner message={error} onRetry={() => ask(question)} />}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="अपना प्रश्न पूछें..."
            placeholderTextColor={colors.textMuted}
            value={question}
            onChangeText={setQuestion}
            onSubmitEditing={() => ask(question)}
            returnKeyType="search"
          />
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
            <Text style={styles.answerLabel}>उत्तर</Text>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  scroll: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  inputRow: {flexDirection: 'row', gap: 8, marginBottom: spacing.sm},
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
  askBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 18,
    justifyContent: 'center',
    ...shadows.sm,
  },
  askBtnDisabled: {opacity: 0.7},
  askBtnText: {color: colors.white, fontWeight: '800', fontSize: 14},
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
  answerLabel: {fontSize: 11, fontWeight: '800', color: colors.primary, marginBottom: 8},
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
});
