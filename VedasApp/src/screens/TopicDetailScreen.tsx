import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {FlatList, Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {ExternalResource, Topic} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {SectionHeader} from '../components/ui/SectionHeader';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {LIST_BOTTOM_INSET} from '../utils/layout';

export function TopicDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TopicDetail'>>();
  const {language} = useLanguage();
  const {addRecentItem} = useUserPreferences();
  const fetchTopic = useCallback(
    () => api.getTopic(route.params.slug, language),
    [route.params.slug, language],
  );
  const fetchResources = useCallback(
    () => api.getResources(language, undefined, route.params.slug),
    [language, route.params.slug],
  );
  const {data: topic, loading, error, refresh} = useCachedFetch<Topic>(
    `/sanatan/topics/${route.params.slug}`,
    language,
    fetchTopic,
    [route.params.slug, language],
  );
  const {data: resources} = useCachedFetch<ExternalResource[]>(
    `/sanatan/resources?topic=${route.params.slug}`,
    language,
    fetchResources,
    [route.params.slug, language],
  );

  useEffect(() => {
    if (!topic) {
      return;
    }
    addRecentItem({
      id: topic.slug,
      kind: 'topic',
      title: topic.title,
      subtitle: 'Gyan topic',
      targetId: topic.slug,
    }).catch(() => undefined);
  }, [topic, addRecentItem]);

  if (loading && !topic) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="cards" count={1} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={refresh} />}
      <FlatList
        data={resources ?? []}
        keyExtractor={item => item.slug}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          topic ? (
            <View style={styles.header}>
              <Text style={styles.icon}>{topic.icon}</Text>
              <Text style={styles.title}>{topic.title}</Text>
              <Text style={styles.sectionLabel}>Simple</Text>
              <Text style={styles.description}>
                {topic.simpleExplanation || topic.summary || topic.description}
              </Text>
              <Text style={styles.sectionLabel}>Detailed</Text>
              <Text style={styles.description}>
                {topic.detailedExplanation || topic.description}
              </Text>
              {(topic.relatedScriptureSlugs?.length ?? 0) > 0 && (
                <>
                  <SectionHeader title="संबंधित ग्रंथ" subtitle="Related scriptures" />
                  <View style={styles.scriptureRow}>
                    {topic.relatedScriptureSlugs!.map(slug => (
                      <Pressable
                        key={slug}
                        style={styles.scriptureChip}
                        onPress={() =>
                          navigation.navigate('VedaDetail', {vedaId: slug, title: slug})
                        }>
                        <Text style={styles.scriptureChipText}>{slug}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}
              {(resources?.length ?? 0) > 0 && (
                <SectionHeader title="ऑनलाइन स्रोत" subtitle="Free resources" />
              )}
            </View>
          ) : null
        }
        renderItem={({item}) => (
          <Pressable
            style={({pressed}) => [styles.resourceCard, pressed && styles.pressed]}
            onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.resourceTitle}>{item.title}</Text>
            <Text style={styles.resourceDesc}>{item.description}</Text>
            <Text style={styles.resourceLink}>{item.sourceName} →</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  header: {marginBottom: spacing.sm},
  icon: {fontSize: 40, marginBottom: spacing.sm},
  title: {fontSize: 24, fontWeight: '800', color: colors.text},
  sectionLabel: {
    marginTop: spacing.md,
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  description: {fontSize: 15, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 24},
  scriptureRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md},
  scriptureChip: {
    backgroundColor: colors.tabActive,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scriptureChipText: {fontSize: 12, fontWeight: '700', color: colors.primaryDark},
  resourceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  resourceTitle: {fontSize: 15, fontWeight: '700', color: colors.text},
  resourceDesc: {fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 19},
  resourceLink: {fontSize: 12, fontWeight: '700', color: colors.primary, marginTop: 8},
  pressed: {opacity: 0.9},
});
