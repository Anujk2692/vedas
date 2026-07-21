import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Linking, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {Temple} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function TempleDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'TempleDetail'>>();
  const {language} = useLanguage();
  const fetch = useCallback(() => api.getTemple(route.params.slug, language), [route.params.slug, language]);
  const {data, loading, error, refresh} = useCachedFetch<Temple>(
    `/sanatan/temples/${route.params.slug}`,
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
          <Text style={styles.sa}>{data.location}</Text>
          <Section title="History" body={data.history} />
          <Section title="Importance" body={data.importance} />
          <Section title="Architecture" body={data.architecture} />
          <Section title="Timings" body={data.timings} />
          <Section title="Nearby" body={data.nearby} />
          {data.virtualTourUrl ? (
            <Pressable style={styles.btn} onPress={() => Linking.openURL(data.virtualTourUrl!)}>
              <Text style={styles.btnText}>Open map / virtual tour</Text>
            </Pressable>
          ) : null}
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
  title: {fontSize: 22, fontWeight: '800', color: colors.text},
  sa: {fontSize: 14, color: colors.primary, marginBottom: spacing.md, fontWeight: '600'},
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
  btn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  btnText: {color: colors.white, fontWeight: '800'},
});
