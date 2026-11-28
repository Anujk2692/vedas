import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {api} from '../api/client';
import type {DetailedPanchangResponse} from '../api/types';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function PanchangMuhuratScreen() {
  const {themeColors} = useUserPreferences();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<DetailedPanchangResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (targetDate?: string) => {
    setLoading(true);
    try {
      setData(await api.getDetailedPanchang(targetDate ?? date));
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    load(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={[styles.root, {backgroundColor: themeColors.background}]} contentContainerStyle={styles.content}>
      <View style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
        <Text style={styles.title}>Date (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} />
        <Pressable style={styles.primaryBtn} onPress={() => load(date)} disabled={loading}>
          <Text style={styles.primaryBtnText}>{loading ? 'Loading…' : 'Check Panchang & Muhurat'}</Text>
        </Pressable>
      </View>

      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {data ? (
        <>
          <View style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
            <Text style={styles.title}>{data.weekday} · {data.date}</Text>
            <Text style={styles.meta}>Tithi: {data.paksha} {data.tithi}</Text>
            <Text style={styles.meta}>Nakshatra: {data.nakshatra} · Yoga: {data.yoga} · Karana: {data.karana}</Text>
            <Text style={styles.meta}>Sunrise: {data.sunrise} · Sunset: {data.sunset}</Text>
            <Text style={[styles.meta, {color: '#166534', fontWeight: '700'}]}>Abhijit Muhurat: {data.abhijitMuhurat}</Text>
            <Text style={[styles.meta, {color: '#b42318', fontWeight: '700'}]}>Rahu Kaal: {data.rahuKaal}</Text>
          </View>

          <Text style={styles.heading}>Day Choghadiya</Text>
          {data.dayChoghadiya.map(c => (
            <View key={c.period} style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
              <Text style={styles.title}>{c.name} ({c.quality})</Text>
              <Text style={styles.meta}>{c.timeRange}</Text>
            </View>
          ))}

          <Text style={styles.heading}>Shubh Muhurat Finder</Text>
          {data.shubhMuhurats.map(m => (
            <View key={m.activity} style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
              <Text style={styles.title}>{m.activity}</Text>
              <Text style={styles.meta}>{m.window} · {m.quality}</Text>
              <Text style={styles.meta}>{m.notes}</Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {padding: spacing.md, paddingBottom: 80, gap: 10},
  card: {borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, gap: 4, ...shadows.sm},
  input: {borderWidth: 1, borderColor: '#e2d5c8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#fff'},
  primaryBtn: {backgroundColor: colors.primary, paddingVertical: 11, borderRadius: borderRadius.full, alignItems: 'center', marginTop: 6},
  primaryBtnText: {color: colors.white, fontWeight: '800'},
  heading: {fontSize: 16, fontWeight: '800', color: colors.primaryDark, marginTop: 6},
  title: {fontSize: 14, fontWeight: '800', color: '#1f2937'},
  meta: {fontSize: 13, color: '#4b5563'},
});
