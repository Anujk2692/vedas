import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {api} from '../api/client';
import type {AartiSummary} from '../api/types';
import {AartiListCard} from '../components/AartiListCard';
import {ErrorBanner} from '../components/ErrorBanner';
import {EmptyState} from '../components/ui/EmptyState';
import {FilterChip} from '../components/ui/FilterChip';
import {InfoBanner} from '../components/ui/InfoBanner';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {SectionHeader} from '../components/ui/SectionHeader';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList, TabParamList} from '../navigation/types';
import {colors, spacing} from '../theme/colors';
import {flatListPerfProps} from '../utils/listPerf';
import {LIST_BOTTOM_INSET} from '../utils/layout';
import {normalizeAartiSummary} from '../utils/normalizeAarti';

type Filter = 'ALL' | 'DEVI' | 'DEVTA';

const FILTER_LABELS: Record<Filter, string> = {
  ALL: 'All',
  DEVI: 'Devi',
  DEVTA: 'Devta',
};

export function AartiListScreen() {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'Aarti'>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >();
  const {language} = useLanguage();
  const [filter, setFilter] = useState<Filter>('ALL');
  const fetchAartis = useCallback(async () => {
    const data = await api.getAartis(language, true);
    return data.map(item => normalizeAartiSummary(item));
  }, [language]);
  const {data, loading, refreshing, error, refresh} = useCachedFetch<AartiSummary[]>(
    '/aartis',
    language,
    fetchAartis,
    [language],
  );
  const aartis = data ?? [];

  const filtered = useMemo(() => {
    if (filter === 'ALL') {
      return aartis;
    }
    return aartis.filter(a => a.deityType === filter);
  }, [aartis, filter]);

  if (loading && aartis.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="rows" count={5} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <ErrorBanner
          message={`${error}. Check Settings → Test Connection.`}
          onRetry={refresh}
        />
      )}

      <FlatList
        data={filtered}
        keyExtractor={item => item.id || item.slug}
        {...flatListPerfProps}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <InfoBanner
              icon="🪔"
              text="Full aarti text, Gita Press PDF, and latest singers — Anuradha Paudwal, Lata Mangeshkar, Suresh Wadkar & more"
            />
            <View style={styles.filterRow}>
              {(Object.keys(FILTER_LABELS) as Filter[]).map(key => (
                <FilterChip
                  key={key}
                  label={FILTER_LABELS[key]}
                  active={filter === key}
                  onPress={() => setFilter(key)}
                />
              ))}
            </View>
            <SectionHeader
              title={`${filtered.length} Aartis`}
              subtitle="PDF · latest singers · audio & video"
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="🪔"
            title={error ? 'Could not load aartis' : 'No aartis in this filter'}
            message={error ? undefined : 'Try another filter or pull down to refresh.'}
            actionLabel={error ? 'Retry' : undefined}
            onAction={error ? refresh : undefined}
          />
        }
        renderItem={({item}) => (
          <AartiListCard
            aarti={item}
            onPress={() =>
              navigation.navigate('AartiDetail', {slug: item.slug, title: item.title})
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  headerBlock: {marginBottom: spacing.sm},
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
});
