import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {QuizSummary} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {LIST_BOTTOM_INSET} from '../utils/layout';

export function QuizListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const fetchQuizzes = useCallback(() => api.getQuizzes(language), [language]);
  const {data, loading, error, refresh} = useCachedFetch<QuizSummary[]>(
    '/sanatan/quizzes',
    language,
    fetchQuizzes,
    [language],
  );

  if (loading && !data) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="cards" count={3} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={refresh} />}
      <FlatList
        data={data ?? []}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.intro}>
            Short quizzes on Dharma, Karma, and the Gita — earn your daily sadhana streak.
          </Text>
        }
        renderItem={({item}) => (
          <Pressable
            style={({pressed}) => [styles.card, pressed && styles.pressed]}
            onPress={() => navigation.navigate('QuizPlay', {quizId: item.id, title: item.title})}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.meta}>
              {item.questionCount} questions · {item.level}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  intro: {fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 20},
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  pressed: {opacity: 0.9},
  title: {fontSize: 17, fontWeight: '800', color: colors.text},
  desc: {fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 19},
  meta: {fontSize: 12, fontWeight: '700', color: colors.primary, marginTop: 8},
});
