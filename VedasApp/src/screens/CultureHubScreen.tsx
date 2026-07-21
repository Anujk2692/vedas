import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {Deity, FestivalGuide, Temple} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {LIST_BOTTOM_INSET} from '../utils/layout';

type Tab = 'deities' | 'temples' | 'festivals';

export function CultureHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const [tab, setTab] = useState<Tab>('deities');

  const fetchDeities = useCallback(() => api.getDeities(language), [language]);
  const fetchTemples = useCallback(() => api.getTemples(language), [language]);
  const fetchFestivals = useCallback(() => api.getFestivals(language), [language]);

  const deities = useCachedFetch<Deity[]>('/sanatan/deities', language, fetchDeities, [language]);
  const temples = useCachedFetch<Temple[]>('/sanatan/temples', language, fetchTemples, [language]);
  const festivals = useCachedFetch<FestivalGuide[]>(
    '/sanatan/festivals',
    language,
    fetchFestivals,
    [language],
  );

  const loading =
    (tab === 'deities' && deities.loading && !deities.data) ||
    (tab === 'temples' && temples.loading && !temples.data) ||
    (tab === 'festivals' && festivals.loading && !festivals.data);
  const error =
    tab === 'deities' ? deities.error : tab === 'temples' ? temples.error : festivals.error;
  const refresh =
    tab === 'deities' ? deities.refresh : tab === 'temples' ? temples.refresh : festivals.refresh;

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="cards" count={4} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={refresh} />}
      <View style={styles.tabs}>
        {([
          ['deities', 'देवता'],
          ['temples', 'मंदिर'],
          ['festivals', 'त्योहार'],
        ] as const).map(([key, label]) => (
          <Pressable
            key={key}
            style={[styles.tab, tab === key && styles.tabActive]}
            onPress={() => setTab(key)}>
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'deities' && (
        <FlatList
          data={deities.data ?? []}
          keyExtractor={item => item.slug}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.card, pressed && styles.pressed]}
              onPress={() =>
                navigation.navigate('DeityDetail', {slug: item.slug, title: item.name})
              }>
              <Text style={styles.title}>
                {item.category === 'DEVI' ? '🪔' : '🕉'} {item.name}
              </Text>
              <Text style={styles.sa}>{item.sanskritName}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.story}
              </Text>
            </Pressable>
          )}
        />
      )}
      {tab === 'temples' && (
        <FlatList
          data={temples.data ?? []}
          keyExtractor={item => item.slug}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.card, pressed && styles.pressed]}
              onPress={() =>
                navigation.navigate('TempleDetail', {slug: item.slug, title: item.name})
              }>
              <Text style={styles.title}>🛕 {item.name}</Text>
              <Text style={styles.sa}>{item.location}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.importance}
              </Text>
            </Pressable>
          )}
        />
      )}
      {tab === 'festivals' && (
        <FlatList
          data={festivals.data ?? []}
          keyExtractor={item => item.slug}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.card, pressed && styles.pressed]}
              onPress={() =>
                navigation.navigate('FestivalDetail', {slug: item.slug, title: item.name})
              }>
              <Text style={styles.title}>🎉 {item.name}</Text>
              <Text style={styles.sa}>{item.whenLabel}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.why}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  tabs: {flexDirection: 'row', gap: 8, padding: spacing.md, paddingBottom: 0},
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  tabActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  tabText: {fontWeight: '700', color: colors.textSecondary, fontSize: 13},
  tabTextActive: {color: colors.white},
  list: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
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
  title: {fontSize: 16, fontWeight: '800', color: colors.text},
  sa: {fontSize: 12, color: colors.primary, marginTop: 4, fontWeight: '600'},
  desc: {fontSize: 13, color: colors.textMuted, marginTop: 6, lineHeight: 19},
});
