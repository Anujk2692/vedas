import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {StudyPath} from '../api/types';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function ContinueLearningCard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const {studyPathProgress, getStudyPathProgress} = useUserPreferences();
  const [path, setPath] = useState<StudyPath | null>(null);

  const load = useCallback(async () => {
    try {
      const hub = await api.getSanatanHub(language);
      const preferred =
        studyPathProgress
          .slice()
          .sort((a, b) => b.updatedAt - a.updatedAt)[0]?.pathSlug ?? 'beginner-path';
      const found = hub.studyPaths.find(p => p.slug === preferred) ?? hub.studyPaths[0] ?? null;
      setPath(found);
    } catch {
      setPath(null);
    }
  }, [language, studyPathProgress]);

  useEffect(() => {
    load();
  }, [load]);

  if (!path) {
    return null;
  }

  const progress = getStudyPathProgress(path.slug);
  const done = progress?.completedSteps.length ?? 0;
  const total = path.steps?.length ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.pressed]}
      onPress={() => navigation.navigate('StudyPathDetail', {slug: path.slug, title: path.title})}>
      <Text style={styles.label}>Continue Learning</Text>
      <Text style={styles.title}>
        {path.icon} {path.title}
      </Text>
      <Text style={styles.meta}>
        {done}/{total} steps · {pct}%
      </Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, {width: `${pct}%`}]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  pressed: {opacity: 0.92},
  label: {fontSize: 12, fontWeight: '800', color: colors.primary, textTransform: 'uppercase'},
  title: {fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 6},
  meta: {fontSize: 12, color: colors.textMuted, marginTop: 4, marginBottom: 8},
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  barFill: {height: 6, backgroundColor: colors.primary},
});
