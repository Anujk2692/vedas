import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {Deity} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function DeityDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'DeityDetail'>>();
  const {language} = useLanguage();
  const fetch = useCallback(() => api.getDeity(route.params.slug, language), [route.params.slug, language]);
  const {data, loading, error, refresh} = useCachedFetch<Deity>(
    `/sanatan/deities/${route.params.slug}`,
    language,
    fetch,
    [route.params.slug, language],
  );

  if (loading && !data) {
    return (
      <View style={styles.container}>
        <ScreenLoader count={1} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error && <ErrorBanner message={error} onRetry={refresh} />}
      {data ? (
        <>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.sa}>{data.sanskritName}</Text>
          <Section title="Story" body={data.story} />
          <Section title="Symbolism" body={data.symbolism} />
          <Section title="Family" body={data.family} />
          <Section title="Weapons" body={data.weapons} />
          <Section title="Vehicle" body={data.vehicles} />
          <Section title="Mantras" body={data.mantras.join('\n')} />
        </>
      ) : null}
    </ScrollView>
  );
}

function Section({title, body}: {title: string; body: string}) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.md, paddingBottom: 40},
  title: {fontSize: 24, fontWeight: '800', color: colors.text},
  sa: {fontSize: 16, color: colors.primary, marginBottom: spacing.md},
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  label: {fontSize: 12, fontWeight: '800', color: colors.primary, textTransform: 'uppercase'},
  body: {fontSize: 14, color: colors.textSecondary, marginTop: 6, lineHeight: 22},
});
