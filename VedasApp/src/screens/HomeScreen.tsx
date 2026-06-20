import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {Veda} from '../api/types';
import {ContinueReadingCard} from '../components/ContinueReadingCard';
import {ErrorBanner} from '../components/ErrorBanner';
import {LanguagePicker} from '../components/LanguagePicker';
import {MantraOfDayCard} from '../components/MantraOfDayCard';
import {VedaCard} from '../components/VedaCard';
import {EmptyState} from '../components/ui/EmptyState';
import {HomeHero} from '../components/ui/HomeHero';
import {QuickActionChip} from '../components/ui/QuickActionChip';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {SectionHeader} from '../components/ui/SectionHeader';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import type {RootStackParamList, TabParamList} from '../navigation/types';
import {colors, spacing} from '../theme/colors';
import {flatListPerfProps} from '../utils/listPerf';
import {LIST_BOTTOM_INSET} from '../utils/layout';

export function HomeScreen() {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'Home'>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >();
  const {language, languages} = useLanguage();
  const {favorites} = useUserPreferences();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const fetchVedas = useCallback(() => api.getVedas(language, true), [language]);
  const {data, loading, refreshing, error, refresh} = useCachedFetch<Veda[]>(
    '/vedas',
    language,
    fetchVedas,
    [language],
  );
  const vedas = data ?? [];

  const currentLang = languages.find(l => l.code === language);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => StatusBar.setBarStyle('dark-content');
    }, []),
  );

  const loadVedas = refresh;

  if (loading && vedas.length === 0) {
    return (
      <View style={styles.container}>
        <HomeHero
          languageLabel={currentLang?.nativeName ?? language}
          onLanguagePress={() => setShowLanguagePicker(true)}
        />
        <ScreenLoader count={2} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={loadVedas} />}

      <FlatList
        data={vedas}
        keyExtractor={item => item.id}
        {...flatListPerfProps}
        renderItem={({item}) => (
          <VedaCard
            veda={item}
            onPress={() => navigation.navigate('VedaDetail', {vedaId: item.id, title: item.title})}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <HomeHero
              languageLabel={currentLang?.nativeName ?? language}
              onLanguagePress={() => setShowLanguagePicker(true)}
            />
            <MantraOfDayCard />
            <ContinueReadingCard />
            <View style={styles.quickRow}>
              <QuickActionChip icon="🪔" label="Aarti" onPress={() => navigation.navigate('Aarti')} />
              <QuickActionChip icon="🔍" label="Search" onPress={() => navigation.navigate('Search')} />
              <QuickActionChip icon="🎵" label="Listen" accent onPress={() => navigation.navigate('Audio')} />
              <QuickActionChip
                icon="❤️"
                label={`${favorites.length} Saved`}
                onPress={() => navigation.navigate('Settings')}
              />
            </View>
            <SectionHeader
              title="Four Sacred Vedas"
              subtitle="Rig · Sama · Yajur · Atharva"
            />
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          !error ? (
            <EmptyState
              icon="📿"
              title="Unable to load Vedas"
              message="Check that the backend is running, then open Settings to test your connection."
              actionLabel="Open Settings"
              onAction={() => navigation.navigate('Settings')}
            />
          ) : null
        }
      />

      <LanguagePicker visible={showLanguagePicker} onClose={() => setShowLanguagePicker(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: LIST_BOTTOM_INSET,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.lg,
  },
});
