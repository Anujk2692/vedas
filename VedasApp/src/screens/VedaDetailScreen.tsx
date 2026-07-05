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
import type {Chapter, MediaItem, Veda} from '../api/types';
import {ChapterCard} from '../components/ChapterCard';
import {ErrorBanner} from '../components/ErrorBanner';
import {RemoteImage} from '../components/ui/RemoteImage';
import {ScreenLoader, SkeletonListRow} from '../components/ui/ScreenLoader';
import {SectionHeader} from '../components/ui/SectionHeader';
import {VedaDetailInfo} from '../components/VedaDetailInfo';
import {SanskritText} from '../components/SanskritText';
import {EmptyState} from '../components/ui/EmptyState';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';
import {flatListPerfProps} from '../utils/listPerf';
import {LIST_BOTTOM_INSET} from '../utils/layout';

export function VedaDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'VedaDetail'>>();
  const {language} = useLanguage();
  const {playTrack, playQueue} = useAudioPlayer();
  const [veda, setVeda] = useState<Veda | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingVeda, setLoadingVeda] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    setLoadingVeda(true);
    setLoadingChapters(true);
    let vedaLoaded = false;
    try {
      const vedaData = await api.getVeda(route.params.vedaId, language);
      setVeda(vedaData);
      vedaLoaded = true;
      setLoadingVeda(false);

      const [chaptersData, audioMedia] = await Promise.all([
        api.getChapters(route.params.vedaId, language),
        api.getVedaMedia(route.params.vedaId, 'AUDIO', language).catch(() => []),
      ]);
      setChapters(chaptersData);
      setMedia(audioMedia);
    } catch (e) {
      if (!vedaLoaded) {
        setVeda(null);
      }
      setChapters([]);
      setMedia([]);
      setError(e instanceof Error ? e.message : 'Failed to load veda');
    } finally {
      setLoadingVeda(false);
      setLoadingChapters(false);
    }
  }, [route.params.vedaId, language]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const playChapterAudio = async (chapter: Chapter, index: number) => {
    if (!chapter.audioUrl?.trim()) {
      return;
    }

    const chapterTracks = chapters
      .filter(c => c.audioUrl?.trim())
      .map(c => ({
        id: c.id,
        title: c.title,
        artist: veda?.title ?? 'Vedas',
        url: c.audioUrl,
        duration: c.durationSeconds,
      }));

    if (chapterTracks.length > 0) {
      const trackIndex = chapterTracks.findIndex(t => t.id === chapter.id);
      await playQueue(chapterTracks, Math.max(0, trackIndex >= 0 ? trackIndex : index));
    } else {
      await playTrack({
        id: chapter.id,
        title: chapter.title,
        artist: veda?.title ?? 'Vedas',
        url: chapter.audioUrl,
        duration: chapter.durationSeconds,
      });
    }
    navigation.navigate('AudioPlayer');
  };

  if (loadingVeda && !veda) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="cards" count={2} />
      </View>
    );
  }

  const ListHeader = () => (
    <View>
      {veda && (
        <>
          <View style={styles.heroWrap}>
            <RemoteImage uri={veda.coverImageUrl} style={styles.cover} placeholderIcon="📿" />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <SanskritText
                text={veda.sanskritName}
                style={styles.sanskrit}
                size={34}
                bold
                selectable={false}
              />
              <Text style={styles.transliteration}>{veda.transliteration}</Text>
            </View>
          </View>
            <View style={styles.header}>
              <Text style={styles.description}>{veda.description}</Text>
              {veda.hasPdf && veda.pdfUrl ? (
                <Pressable
                  style={({pressed}) => [styles.pdfBtn, pressed && styles.pressed]}
                  onPress={() =>
                    navigation.navigate('PdfViewer', {
                      url: veda.pdfUrl!,
                      title: veda.pdfTitle ?? `${veda.title} — PDF`,
                    })
                  }>
                  <Text style={styles.pdfBtnText}>
                    📄 पूर्ण ग्रंथ PDF — {veda.pdfSourceName ?? 'Gita Press'}
                  </Text>
                </Pressable>
              ) : null}
              {veda.pdfEditions && veda.pdfEditions.length > 1 ? (
                <View style={styles.pdfList}>
                  {veda.pdfEditions.slice(1).map(ed => (
                    <Pressable
                      key={ed.url}
                      style={({pressed}) => [styles.pdfLink, pressed && styles.pressed]}
                      onPress={() =>
                        navigation.navigate('PdfViewer', {url: ed.url, title: ed.title})
                      }>
                      <Text style={styles.pdfLinkText}>📖 {ed.title}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              {media.length > 0 && (
              <View style={styles.mediaPills}>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>🎵 {media.length} audio</Text>
                </View>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>🎬 video</Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.detailsSection}>
            <SectionHeader title="Full Details" subtitle="Philosophy, rituals & learning" />
            <VedaDetailInfo veda={veda} />
          </View>
        </>
      )}
      <SectionHeader
        title="Mandalas, Kandas & Chapters"
        subtitle={
          loadingChapters
            ? 'Loading chapters…'
            : `${chapters.length} divisions`
        }
      />
      {loadingChapters && (
        <View style={styles.chaptersLoader}>
          <SkeletonListRow />
          <SkeletonListRow />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={loadData} />}
      <FlatList
        data={chapters}
        keyExtractor={item => item.id}
        {...flatListPerfProps}
        renderItem={({item, index}) => (
          <ChapterCard
            chapter={item}
            onPress={() =>
              navigation.navigate('ChapterReader', {
                chapterId: item.id,
                title: item.title,
                vedaTitle: veda?.title,
              })
            }
            onAudioPress={() => playChapterAudio(item, index)}
            onVideoPress={
              item.videoUrl?.trim()
                ? () =>
                    navigation.navigate('VideoPlayer', {
                      url: item.videoUrl,
                      title: item.title,
                      subtitle: veda?.title,
                    })
                : undefined
            }
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          !error && !loadingChapters ? (
            <EmptyState icon="📖" title="Chapters coming soon" message="Content for this veda is being added." />
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
  heroWrap: {
    position: 'relative',
    marginBottom: 0,
  },
  cover: {
    width: '100%',
    height: 220,
    backgroundColor: colors.surfaceMuted,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(44, 24, 16, 0.45)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  sanskrit: {
    ...typography.hero,
    color: colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 6,
  },
  transliteration: {
    fontSize: 16,
    color: 'rgba(255,248,240,0.85)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    ...shadows.sm,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  pdfBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  pdfBtnText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 13,
    textAlign: 'center',
  },
  pdfList: {
    marginTop: spacing.sm,
    gap: 6,
  },
  pdfLink: {
    backgroundColor: colors.tabActive,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pdfLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  pressed: {opacity: 0.88},
  mediaPills: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.md,
  },
  pill: {
    backgroundColor: colors.tabActive,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  detailsSection: {
    padding: spacing.md,
    paddingBottom: 0,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: LIST_BOTTOM_INSET,
  },
  chaptersLoader: {
    marginVertical: spacing.md,
  },
});
