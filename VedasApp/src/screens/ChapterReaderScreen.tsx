import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {Chapter, Verse} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {SelectableReadableText} from '../components/SelectableReadableText';
import {SanskritText} from '../components/SanskritText';
import {VerseCard} from '../components/VerseCard';
import {EmptyState} from '../components/ui/EmptyState';
import {ScreenLoader, SkeletonListRow} from '../components/ui/ScreenLoader';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';
import {flatListPerfProps} from '../utils/listPerf';
import {formatDuration} from '../utils/formatTime';
import {LIST_BOTTOM_INSET} from '../utils/layout';

export function ChapterReaderScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ChapterReader'>>();
  const {language} = useLanguage();
  const {setReadingProgress, addRecentItem, sanskritFontSize, translationFontSize} = useUserPreferences();
  const {playQueue} = useAudioPlayer();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingChapter, setLoadingChapter] = useState(true);
  const [loadingVerses, setLoadingVerses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setError(null);
    setLoadingChapter(true);
    setLoadingVerses(true);
    let chapterLoaded = false;
    try {
      const chapterData = await api.getChapter(route.params.chapterId, language);
      setChapter(chapterData);
      chapterLoaded = true;
      setLoadingChapter(false);

      const versesData = await api.getVerses(route.params.chapterId, language);
      setVerses(versesData);
      await setReadingProgress({
        chapterId: route.params.chapterId,
        title: chapterData.title || route.params.title,
        vedaTitle: route.params.vedaTitle,
      });
      await addRecentItem({
        id: route.params.chapterId,
        kind: 'chapter',
        title: chapterData.title || route.params.title,
        subtitle: route.params.vedaTitle,
        targetId: route.params.chapterId,
      });
    } catch (e) {
      if (!chapterLoaded) {
        setChapter(null);
      }
      setVerses([]);
      setError(e instanceof Error ? e.message : 'Failed to load chapter');
    } finally {
      setLoadingChapter(false);
      setLoadingVerses(false);
    }
  }, [route.params.chapterId, route.params.title, route.params.vedaTitle, language, setReadingProgress, addRecentItem]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const buildVerseTracks = () =>
    verses
      .filter(v => v.audioUrl?.trim())
      .map(v => ({
        id: v.id,
        title: `Verse ${v.number}`,
        artist: route.params.title,
        url: v.audioUrl,
        duration: v.audioDurationSeconds,
      }));

  const playAndOpen = async (tracks: ReturnType<typeof buildVerseTracks>, index: number) => {
    if (!tracks.length) {
      return;
    }
    await playQueue(tracks, index);
    navigation.navigate('AudioPlayer');
  };

  const playVerseAudio = (verse: Verse) => {
    const tracks = buildVerseTracks();
    const index = tracks.findIndex(t => t.id === verse.id);
    playAndOpen(tracks, Math.max(0, index));
  };

  const playChapterAudio = () => {
    if (chapter?.audioUrl?.trim()) {
      playAndOpen(
        [{
          id: chapter.id,
          title: chapter.title,
          artist: route.params.title,
          url: chapter.audioUrl,
          duration: chapter.durationSeconds,
        }],
        0,
      );
      return;
    }
    playAndOpen(buildVerseTracks(), 0);
  };

  if (loadingChapter && !chapter) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="cards" count={2} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={loadContent} />}
      <FlatList
        data={verses}
        keyExtractor={item => item.id}
        {...flatListPerfProps}
        renderItem={({item}) => (
          <VerseCard
            verse={item}
            showSanskrit
            chapterId={route.params.chapterId}
            chapterTitle={route.params.title}
            vedaTitle={route.params.vedaTitle}
            sanskritFontSize={sanskritFontSize}
            translationFontSize={translationFontSize}
            onAudioPress={() => playVerseAudio(item)}
            onVideoPress={
              item.videoUrl
                ? () =>
                    navigation.navigate('VideoPlayer', {
                      url: item.videoUrl,
                      title: `${route.params.title} — Verse ${item.number}`,
                      subtitle: item.transliteration,
                    })
                : undefined
            }
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            {chapter && (
              <>
                {chapter.divisionLabel && (
                  <Text style={styles.divisionLabel}>{chapter.divisionLabel}</Text>
                )}
                <SanskritText text={chapter.sanskritName} style={styles.sanskrit} size={26} bold />
                <SelectableReadableText text={chapter.summary} style={styles.summary} />
                {chapter.overview && (
                  <SelectableReadableText text={chapter.overview} style={styles.overview} />
                )}
                {chapter.mantraCount != null && chapter.mantraCount > 0 && (
                  <View style={styles.statsPill}>
                    <Text style={styles.stats}>
                      📜 {chapter.suktaCount ?? 0} suktas ·{' '}
                      {chapter.mantraCount.toLocaleString()} mantras in tradition
                    </Text>
                  </View>
                )}
                {chapter.attributedSages && chapter.attributedSages.length > 0 && (
                  <View style={styles.chipRow}>
                    {chapter.attributedSages.map(sage => (
                      <View key={sage} style={styles.chip}>
                        <Text style={styles.chipText}>{sage}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {chapter.keyThemes && chapter.keyThemes.length > 0 && (
                  <View style={styles.chipRow}>
                    {chapter.keyThemes.map(theme => (
                      <View key={theme} style={[styles.chip, styles.themeChip]}>
                        <Text style={styles.chipText}>{theme}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {chapter.notableSuktas && chapter.notableSuktas.length > 0 && (
                  <View style={styles.notableBox}>
                    <Text style={styles.notableLabel}>Notable Suktas & Hymns</Text>
                    {chapter.notableSuktas.map(item => (
                      <SelectableReadableText
                        key={item}
                        text={`• ${item}`}
                        style={styles.notableItem}
                      />
                    ))}
                  </View>
                )}
              </>
            )}
            <View style={styles.readingDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.readingMode}>
                {loadingVerses ? 'Loading mantras…' : `${verses.length} mantras`}
              </Text>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.mediaActions}>
              {(chapter?.audioUrl || verses.some(v => v.audioUrl)) && (
                <Pressable
                  style={({pressed}) => [styles.mediaBtn, pressed && styles.pressed]}
                  onPress={playChapterAudio}>
                  <Text style={styles.mediaBtnText}>🎵 Listen Full Patha</Text>
                </Pressable>
              )}
              {chapter?.videoUrl && (
                <Pressable
                  style={({pressed}) => [styles.mediaBtn, styles.videoBtn, pressed && styles.pressed]}
                  onPress={() =>
                    navigation.navigate('VideoPlayer', {
                      url: chapter.videoUrl,
                      title: chapter.title,
                      subtitle: formatDuration(chapter.durationSeconds),
                    })
                  }>
                  <Text style={styles.mediaBtnText}>🎬 Watch Video</Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          loadingVerses ? (
            <View style={styles.versesLoader}>
              <SkeletonListRow />
              <SkeletonListRow />
              <SkeletonListRow />
            </View>
          ) : !error ? (
            <EmptyState icon="📜" title="No verses found" message="This chapter has no mantra text yet." />
          ) : null
        }
      />
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
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  divisionLabel: {
    ...typography.caption,
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 6,
  },
  sanskrit: {
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  overview: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  statsPill: {
    alignSelf: 'center',
    backgroundColor: colors.tabActive,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  stats: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  themeChip: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.tabActive,
  },
  chipText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  notableBox: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notableLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  notableItem: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 2,
  },
  readingDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  readingMode: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  mediaActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  mediaBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
  },
  videoBtn: {
    backgroundColor: colors.primaryDark,
  },
  mediaBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  pressed: {opacity: 0.9},
  list: {
    padding: spacing.md,
    paddingBottom: LIST_BOTTOM_INSET,
  },
  versesLoader: {
    marginVertical: spacing.sm,
  },
});
