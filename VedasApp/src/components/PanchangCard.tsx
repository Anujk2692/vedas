import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {Panchang} from '../api/types';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function PanchangCard() {
  const {language} = useLanguage();
  const fetchPanchang = useCallback(() => api.getPanchang(language), [language]);
  const {data} = useCachedFetch<Panchang>('/sanatan/panchang', language, fetchPanchang, [language]);

  if (!data) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>आज का पंचांग</Text>
        <Text style={styles.date}>{data.dateLabel}</Text>
      </View>
      <Text style={styles.weekday}>{data.weekday}</Text>
      <View style={styles.row}>
        <Text style={styles.chip}>🌙 {data.tithi}</Text>
        <Text style={styles.chip}>⭐ {data.nakshatra}</Text>
      </View>
      {data.festival ? (
        <Text style={styles.festival}>🪔 {data.festival}</Text>
      ) : null}
      <Text style={styles.note}>{data.note}</Text>
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
  festival: {fontSize: 14, fontWeight: '700', color: colors.primaryDark, marginBottom: 6},
  note: {fontSize: 11, color: colors.textMuted, lineHeight: 16},
});
