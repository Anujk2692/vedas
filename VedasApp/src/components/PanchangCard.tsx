import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {Panchang} from '../api/types';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function PanchangCard() {
  const {language} = useLanguage();
  const {themeColors} = useUserPreferences();
  const fetchPanchang = useCallback(() => api.getPanchang(language), [language]);
  const {data} = useCachedFetch<Panchang>('/sanatan/panchang', language, fetchPanchang, [language]);

  if (!data) {
    return null;
  }

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: themeColors.surfaceElevated, borderColor: themeColors.borderLight},
      ]}>
      <View style={styles.header}>
        <Text style={[styles.label, {color: themeColors.primary}]}>आज का पंचांग</Text>
        <Text style={[styles.date, {color: themeColors.textMuted}]}>{data.dateLabel}</Text>
      </View>
      <Text style={[styles.weekday, {color: themeColors.text}]}>{data.weekday}</Text>
      <View style={styles.row}>
        <Text style={[styles.chip, {color: themeColors.textSecondary}]}>🌙 {data.tithi}</Text>
        <Text style={[styles.chip, {color: themeColors.textSecondary}]}>⭐ {data.nakshatra}</Text>
        {data.yoga ? <Text style={[styles.chip, {color: themeColors.textSecondary}]}>🧘 {data.yoga}</Text> : null}
      </View>
      {data.festival ? <Text style={[styles.festival, {color: themeColors.primaryDark}]}>🪔 {data.festival}</Text> : null}
      {data.festivalWhy ? <Text style={[styles.why, {color: themeColors.textSecondary}]}>{data.festivalWhy}</Text> : null}
      {data.festivalRitual ? <Text style={[styles.ritual, {color: themeColors.text}]}>Ritual: {data.festivalRitual}</Text> : null}
      <Text style={[styles.note, {color: themeColors.textMuted}]}>{data.note}</Text>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {fontSize: 12, fontWeight: '800', color: colors.primary, textTransform: 'uppercase'},
  date: {fontSize: 11, color: colors.textMuted, fontWeight: '600'},
  weekday: {fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.sm},
  row: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm},
  chip: {fontSize: 12, color: colors.textSecondary, fontWeight: '600'},
  festival: {fontSize: 14, fontWeight: '700', color: colors.primaryDark, marginBottom: 4},
  why: {fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4},
  ritual: {fontSize: 12, color: colors.text, fontWeight: '600', marginBottom: 6},
  note: {fontSize: 11, color: colors.textMuted, lineHeight: 16},
});
