import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {api} from '../api/client';
import type {DailyShlok} from '../api/types';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {SanskritText} from './SanskritText';

export function GitaOfDayCard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const fetch = useCallback(() => api.getGitaOfDay(language), [language]);
  const {data} = useCachedFetch<DailyShlok>('/sanatan/gita-of-day', language, fetch, [language]);

  if (!data?.sanskrit) {
    return null;
  }

  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.pressed]}
      onPress={() => navigation.navigate('VedaDetail', {vedaId: 'gita', title: 'Bhagavad Gita'})}>
      <View style={styles.header}>
        <Text style={styles.label}>गीता ऑफ़ द डे</Text>
        <Text style={styles.source}>{data.source}</Text>
      </View>
      <SanskritText text={data.sanskrit} style={styles.sanskrit} />
      {data.transliteration ? <Text style={styles.tr}>{data.transliteration}</Text> : null}
      <Text style={styles.translation}>{data.translation}</Text>
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
  header: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
  label: {fontSize: 12, fontWeight: '800', color: colors.primary, textTransform: 'uppercase'},
  source: {fontSize: 11, color: colors.textMuted, fontWeight: '600'},
  sanskrit: {fontSize: 18, color: colors.text, marginBottom: 6, lineHeight: 28},
  tr: {fontSize: 12, color: colors.textMuted, fontStyle: 'italic', marginBottom: 6},
  translation: {fontSize: 14, color: colors.textSecondary, lineHeight: 22},
});
