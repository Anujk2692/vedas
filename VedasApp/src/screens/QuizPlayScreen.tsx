import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {Quiz} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function QuizPlayScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'QuizPlay'>>();
  const {language} = useLanguage();
  const {recordSadhanaPractice} = useUserPreferences();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await api.getQuiz(route.params.quizId, language);
      setQuiz(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load quiz');
    }
  }, [route.params.quizId, language]);

  useEffect(() => {
    load();
  }, [load]);

  if (!quiz && !error) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="cards" count={1} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorBanner message={error} onRetry={load} />
      </View>
    );
  }

  if (!quiz) {
    return null;
  }

  if (done) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Quiz complete</Text>
          <Text style={styles.score}>
            Score: {score}/{quiz.questions.length}
          </Text>
          <Text style={styles.hint}>Sadhana streak updated for today.</Text>
        </View>
      </View>
    );
  }

  const question = quiz.questions[index];
  const revealed = selected !== null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.progress}>
        Question {index + 1} / {quiz.questions.length}
      </Text>
      <Text style={styles.prompt}>{question.prompt}</Text>
      {question.options.map((opt, i) => {
        const isCorrect = i === question.correctIndex;
        const isSelected = selected === i;
        return (
          <Pressable
            key={`${question.id}-${i}`}
            style={[
              styles.option,
              revealed && isCorrect && styles.optionCorrect,
              revealed && isSelected && !isCorrect && styles.optionWrong,
            ]}
            disabled={revealed}
            onPress={() => {
              setSelected(i);
              if (i === question.correctIndex) {
                setScore(s => s + 1);
              }
            }}>
            <Text style={styles.optionText}>{opt}</Text>
          </Pressable>
        );
      })}
      {revealed ? (
        <View style={styles.explain}>
          <Text style={styles.explainText}>{question.explanation}</Text>
          {question.scriptureRef ? (
            <Text style={styles.ref}>Ref: {question.scriptureRef}</Text>
          ) : null}
          <Pressable
            style={styles.nextBtn}
            onPress={async () => {
              if (index + 1 >= quiz.questions.length) {
                setDone(true);
                await recordSadhanaPractice();
              } else {
                setIndex(index + 1);
                setSelected(null);
              }
            }}>
            <Text style={styles.nextText}>
              {index + 1 >= quiz.questions.length ? 'Finish' : 'Next'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.md, paddingBottom: 40},
  progress: {fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 8},
  prompt: {fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.md, lineHeight: 26},
  option: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  optionCorrect: {
    backgroundColor: 'rgba(46, 125, 50, 0.12)',
    borderColor: '#2e7d32',
  },
  optionWrong: {
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
    borderColor: '#c62828',
  },
  optionText: {fontSize: 15, color: colors.text, fontWeight: '600'},
  explain: {marginTop: spacing.md},
  explainText: {fontSize: 14, color: colors.textSecondary, lineHeight: 21},
  ref: {fontSize: 12, color: colors.primary, fontWeight: '700', marginTop: 6},
  nextBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  nextText: {color: colors.white, fontWeight: '800'},
  card: {
    margin: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  title: {fontSize: 22, fontWeight: '800', color: colors.text},
  score: {fontSize: 18, fontWeight: '700', color: colors.primaryDark, marginTop: 12},
  hint: {fontSize: 13, color: colors.textMuted, marginTop: 8},
});
