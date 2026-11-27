import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {Veda} from '../api/types';
import {ContinueReadingCard} from '../components/ContinueReadingCard';
import {ContinueLearningCard} from '../components/ContinueLearningCard';
import {ErrorBanner} from '../components/ErrorBanner';
import {GitaOfDayCard} from '../components/GitaOfDayCard';
import {LanguagePicker} from '../components/LanguagePicker';
import {LifeClarityCard} from '../components/LifeClarityCard';
import {MantraOfDayCard} from '../components/MantraOfDayCard';
import {PanchangCard} from '../components/PanchangCard';
import {RecentlyViewedCard} from '../components/RecentlyViewedCard';
import {SadhanaStreakCard} from '../components/SadhanaStreakCard';
import {InfoBanner} from '../components/ui/InfoBanner';
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

const SECTION_LABELS: Record<string, {title: string; subtitle: string}> = {
  VEDA: {title: 'चार वेद', subtitle: 'Rig · Sama · Yajur · Atharva'},
  ITIHASA: {title: 'इतिहास ग्रंथ', subtitle: 'Gita · Ramayana · Mahabharata · Ramcharitmanas'},
  UPANISHAD: {title: 'उपनिषद', subtitle: 'Philosophical teachings of the Vedas'},
  PURANA: {title: 'पुराण', subtitle: 'Bhagavata, Vishnu, Shiva and more'},
  DARSHAN: {title: 'दर्शन', subtitle: 'Yoga Sutra and classical philosophy'},
  NITI: {title: 'नीति ग्रंथ', subtitle: 'Manusmriti · Arthashastra · Chanakya Niti'},
};

type ListRow =
  | {kind: 'header'; key: string; title: string; subtitle: string}
  | {kind: 'veda'; key: string; veda: Veda};

export function HomeScreen() {
  const {themeColors, themeMode} = useUserPreferences();
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'Home'>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >();
  const {language, languages} = useLanguage();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const fetchVedas = useCallback(() => api.getVedas(language, true), [language]);
  const {data, loading, refreshing, error, refresh} = useCachedFetch<Veda[]>(
    '/vedas',
    language,
    fetchVedas,
    [language],
  );
  const vedas = useMemo(() => data ?? [], [data]);

  const rows = useMemo(() => {
    const order = ['VEDA', 'ITIHASA', 'UPANISHAD', 'PURANA', 'DARSHAN', 'NITI'];
    const grouped: ListRow[] = [];
    order.forEach(type => {
      const items = vedas.filter(v => (v.scriptureType ?? 'VEDA') === type);
      if (items.length === 0) {
        return;
      }
      const meta = SECTION_LABELS[type] ?? {title: type, subtitle: ''};
      grouped.push({kind: 'header', key: `h-${type}`, title: meta.title, subtitle: meta.subtitle});
      items.forEach(v => grouped.push({kind: 'veda', key: v.id, veda: v}));
    });
    return grouped;
  }, [vedas]);

  const currentLang = languages.find(l => l.code === language);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => StatusBar.setBarStyle('dark-content');
    }, []),
  );

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
    <SafeAreaView style={[styles.container, {backgroundColor: themeColors.background}]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      {error && <ErrorBanner message={error} onRetry={refresh} />}

      <FlatList
        data={rows}
        keyExtractor={item => item.key}
        {...flatListPerfProps}
        renderItem={({item}) =>
          item.kind === 'header' ? (
            <SectionHeader title={item.title} subtitle={item.subtitle} />
          ) : (
            <VedaCard
              veda={item.veda}
              onPress={() =>
                navigation.navigate('VedaDetail', {vedaId: item.veda.id, title: item.veda.title})
              }
            />
          )
        }
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <HomeHero
              languageLabel={currentLang?.nativeName ?? language}
              onLanguagePress={() => setShowLanguagePicker(true)}
            />
            <SectionHeader
              title={language === 'hi' || language === 'sa' ? 'त्वरित सेवाएं' : 'Quick Access'}
              subtitle={
                language === 'hi' || language === 'sa'
                  ? 'आरती, चालीसा, भजन, AI गुरु और नामकरण'
                  : 'Aarti, Chalisa, Bhajan, AI Guru & more'
              }
            />
            <View style={styles.quickRow}>
              <QuickActionChip icon="🙏" label={language === 'hi' || language === 'sa' ? 'AI गुरु' : 'AI Guru'} accent onPress={() => navigation.navigate('AiGuru')} />
              <QuickActionChip icon="🪔" label={language === 'hi' || language === 'sa' ? 'आरती' : 'Aarti'} onPress={() => navigation.navigate('Aarti')} />
              <QuickActionChip
                icon="📿"
                label={language === 'hi' || language === 'sa' ? 'चालीसा' : 'Chalisa'}
                onPress={() =>
                  navigation.navigate('Devotional', {
                    mode: 'chalisas',
                    title: language === 'hi' || language === 'sa' ? 'चालीसा संग्रह' : 'Chalisa Collection',
                  })
                }
              />
              <QuickActionChip
                icon="🎶"
                label={language === 'hi' || language === 'sa' ? 'भजन' : 'Bhajan'}
                onPress={() =>
                  navigation.navigate('Devotional', {
                    mode: 'bhajans',
                    title: language === 'hi' || language === 'sa' ? 'भजन संग्रह' : 'Bhajan Collection',
                  })
                }
              />
              <QuickActionChip icon="👶" label={language === 'hi' || language === 'sa' ? 'नामकरण' : 'Child Names'} onPress={() => navigation.navigate('ChildNames')} />
              <QuickActionChip icon="📚" label={language === 'hi' || language === 'sa' ? 'ज्ञान' : 'Gyan'} onPress={() => navigation.navigate('Gyan')} />
              <QuickActionChip icon="🧠" label={language === 'hi' || language === 'sa' ? 'क्विज़' : 'Quiz'} onPress={() => navigation.navigate('QuizList')} />
              <QuickActionChip
                icon="🛕"
                label={language === 'hi' || language === 'sa' ? 'संस्कृति' : 'Culture'}
                onPress={() => navigation.navigate('CultureHub')}
              />
              <QuickActionChip icon="🔍" label={language === 'hi' || language === 'sa' ? 'खोजें' : 'Search'} onPress={() => navigation.navigate('Search')} />
            </View>
            <LifeClarityCard onAskGuru={() => navigation.navigate('AiGuru')} />
            <SectionHeader
              title={language === 'hi' || language === 'sa' ? 'आज का आध्यात्मिक चिंतन' : "Today's Spiritual Anchor"}
              subtitle={
                language === 'hi' || language === 'sa'
                  ? 'दैनिक मंत्र, गीता श्लोक और पंचांग'
                  : 'Daily mantra, Gita verse & Panchang'
              }
            />
            <MantraOfDayCard />
            <GitaOfDayCard />
            <PanchangCard />
            <SectionHeader
              title={language === 'hi' || language === 'sa' ? 'आपकी साधना' : 'Your Sadhana'}
              subtitle={
                language === 'hi' || language === 'sa'
                  ? 'नियमित अभ्यास और हालिया पठन'
                  : 'Streak, learning path & recent reading'
              }
            />
            <SadhanaStreakCard />
            <ContinueLearningCard />
            <ContinueReadingCard />
            <RecentlyViewedCard />
            <InfoBanner
              icon="📥"
              text={
                language === 'hi' || language === 'sa'
                  ? 'ऑफ़लाइन: एक बार खोलने पर सामग्री कैश हो जाती है। Settings → Clear App Cache से रीफ़्रेश करें।'
                  : 'Offline: Content is cached once opened. Refresh via Settings → Clear App Cache.'
              }
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
              title="Unable to load scriptures"
              message="Check backend is running, then Settings → Test Connection."
              actionLabel="Open Settings"
              onAction={() => navigation.navigate('Settings')}
            />
          ) : null
        }
      />

      <LanguagePicker visible={showLanguagePicker} onClose={() => setShowLanguagePicker(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: LIST_BOTTOM_INSET,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.lg,
  },
});
