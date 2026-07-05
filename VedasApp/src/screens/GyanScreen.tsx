import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {ExternalResource, SanatanHub} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {EmptyState} from '../components/ui/EmptyState';
import {InfoBanner} from '../components/ui/InfoBanner';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {SectionHeader} from '../components/ui/SectionHeader';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList, TabParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {LIST_BOTTOM_INSET} from '../utils/layout';

const RESOURCE_ICONS: Record<string, string> = {
  PDF: '📄',
  WEB: '🌐',
  VIDEO: '🎬',
  LIBRARY: '📚',
  YOUTUBE: '▶',
};

export function GyanScreen() {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'Gyan'>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >();
  const {language} = useLanguage();
  const fetchHub = useCallback(() => api.getSanatanHub(language, true), [language]);
  const {data, loading, refreshing, error, refresh} = useCachedFetch<SanatanHub>(
    '/sanatan/hub',
    language,
    fetchHub,
    [language],
  );

  const openResource = async (resource: ExternalResource) => {
    try {
      await Linking.openURL(resource.url);
    } catch {
      // ignore
    }
  };

  const openScripture = (slug: string, title: string) => {
    navigation.navigate('VedaDetail', {vedaId: slug, title});
  };

  if (loading && !data) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="rows" count={4} />
      </View>
    );
  }

  const topics = data?.topics ?? [];
  const paths = data?.studyPaths ?? [];
  const resources = data?.resources ?? [];

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={refresh} />}
      <FlatList
        data={[{key: 'content'}]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <InfoBanner
              icon="📚"
              text="हाँ, सनातन धर्म के अधिकांश ग्रंथ हिंदी में ऑनलाइन निःशुल्क उपलब्ध हैं — यहाँ अध्ययन-पथ, ज्ञान और स्रोत एक स्थान पर हैं।"
            />
            <Pressable
              style={({pressed}) => [styles.guruBanner, pressed && styles.pressed]}
              onPress={() => navigation.navigate('AiGuru')}>
              <Text style={styles.guruIcon}>🙏</Text>
              <View style={styles.guruBody}>
                <Text style={styles.guruTitle}>AI Guru</Text>
                <Text style={styles.guruDesc}>बोलकर पूछें — लिखित + आवाज़ में उत्तर</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
            <Pressable
              style={({pressed}) => [styles.guruBanner, pressed && styles.pressed]}
              onPress={() => navigation.navigate('MeditationTimer')}>
              <Text style={styles.guruIcon}>🧘</Text>
              <View style={styles.guruBody}>
                <Text style={styles.guruTitle}>Meditation Timer</Text>
                <Text style={styles.guruDesc}>Daily dhyaan — 5 to 30 minutes</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
            <SectionHeader title="अध्ययन योजना" subtitle="Study paths — beginner to advanced" />
          </View>
        }
        renderItem={() => (
          <View>
            {paths.map(path => (
              <Pressable
                key={path.slug}
                style={({pressed}) => [styles.pathCard, pressed && styles.pressed]}
                onPress={() => navigation.navigate('StudyPathDetail', {slug: path.slug, title: path.title})}>
                <Text style={styles.pathIcon}>{path.icon}</Text>
                <View style={styles.pathBody}>
                  <Text style={styles.pathTitle}>{path.title}</Text>
                  <Text style={styles.pathMeta}>
                    {path.durationLabel} · {path.level}
                  </Text>
                  <Text style={styles.pathDesc} numberOfLines={2}>
                    {path.description}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}

            <SectionHeader title="ज्ञान विषय" subtitle="Dharma · Karma · Moksha · Yoga" />
            <View style={styles.topicGrid}>
              {topics.map(topic => (
                <Pressable
                  key={topic.slug}
                  style={({pressed}) => [styles.topicChip, pressed && styles.pressed]}
                  onPress={() => navigation.navigate('TopicDetail', {slug: topic.slug, title: topic.title})}>
                  <Text style={styles.topicIcon}>{topic.icon}</Text>
                  <Text style={styles.topicLabel} numberOfLines={2}>
                    {topic.title}
                  </Text>
                </Pressable>
              ))}
            </View>

            <SectionHeader title="ऑनलाइन स्रोत" subtitle="Gita Press · Archive.org · YouTube" />
            {resources.map(resource => (
              <Pressable
                key={resource.slug}
                style={({pressed}) => [styles.resourceCard, pressed && styles.pressed]}
                onPress={() => openResource(resource)}>
                <Text style={styles.resourceIcon}>{RESOURCE_ICONS[resource.type] ?? '🔗'}</Text>
                <View style={styles.resourceBody}>
                  <Text style={styles.resourceSource}>{resource.sourceName}</Text>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDesc} numberOfLines={2}>
                    {resource.description}
                  </Text>
                </View>
              </Pressable>
            ))}

            {!loading && paths.length === 0 && topics.length === 0 && (
              <EmptyState
                icon="📖"
                title="Knowledge hub loading"
                message="Restart backend and pull to refresh."
                actionLabel="Retry"
                onAction={refresh}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  pathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  pathIcon: {fontSize: 28, marginRight: spacing.sm},
  pathBody: {flex: 1, minWidth: 0},
  pathTitle: {fontSize: 16, fontWeight: '800', color: colors.text},
  pathMeta: {fontSize: 11, fontWeight: '700', color: colors.primary, marginTop: 2},
  pathDesc: {fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 18},
  chevron: {fontSize: 24, color: colors.textMuted, marginLeft: spacing.sm},
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.lg,
  },
  topicChip: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  topicIcon: {fontSize: 24, marginBottom: 6},
  topicLabel: {fontSize: 13, fontWeight: '700', color: colors.text, lineHeight: 18},
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  resourceIcon: {fontSize: 22, marginRight: spacing.sm},
  resourceBody: {flex: 1},
  resourceSource: {fontSize: 10, fontWeight: '800', color: colors.primary, textTransform: 'uppercase'},
  resourceTitle: {fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 2},
  resourceDesc: {fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 17},
  guruBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  guruIcon: {fontSize: 28, marginRight: spacing.sm},
  guruBody: {flex: 1},
  guruTitle: {fontSize: 16, fontWeight: '800', color: colors.white},
  guruDesc: {fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2},
  pressed: {opacity: 0.9},
});
