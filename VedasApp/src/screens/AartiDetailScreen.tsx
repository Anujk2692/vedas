import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {
  FlatList,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {AartiDetail, AartiLine, AartiRecording} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {SelectableReadableText} from '../components/SelectableReadableText';
import {SanskritText} from '../components/SanskritText';
import {EmptyState} from '../components/ui/EmptyState';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';
import {flatListPerfProps} from '../utils/listPerf';
import {normalizeAartiDetail} from '../utils/normalizeAarti';
import {formatDuration} from '../utils/formatTime';

function AartiLineCard({
  line,
  index,
  sanskritFontSize,
  translationFontSize,
}: {
  line: AartiLine;
  index: number;
  sanskritFontSize: number;
  translationFontSize: number;
}) {
  return (
    <View style={styles.lineCard}>
      <View style={styles.lineBadge}>
        <Text style={styles.lineNumber}>{index + 1}</Text>
      </View>
      <SanskritText text={line.sanskrit} size={sanskritFontSize} style={styles.lineSanskrit} />
      <SelectableReadableText
        text={line.transliteration}
        style={styles.lineTransliteration}
      />
      <SelectableReadableText
        text={line.translation}
        style={[styles.lineTranslation, {fontSize: translationFontSize}]}
      />
    </View>
  );
}

export function AartiDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AartiDetail'>>();
  const {language} = useLanguage();
  const {playTrack} = useAudioPlayer();
  const {sanskritFontSize, translationFontSize, recordSadhanaPractice} = useUserPreferences();
  const fetchAarti = useCallback(async () => {
    const data = await api.getAarti(route.params.slug, language, true);
    return normalizeAartiDetail(data);
  }, [route.params.slug, language]);
  const {data: aarti, loading, error, refresh} = useCachedFetch<AartiDetail>(
    `/aartis/${route.params.slug}`,
    language,
    fetchAarti,
    [route.params.slug, language],
  );

  useEffect(() => {
    if (aarti) {
      recordSadhanaPractice().catch(() => undefined);
    }
  }, [aarti, recordSadhanaPractice]);

  const shareAarti = async () => {
    if (!aarti) {
      return;
    }
    const message = [
      aarti.title,
      aarti.sanskritName,
      '',
      ...((aarti.lines ?? []).map(
        (line, i) =>
          `${i + 1}. ${line.sanskrit}\n${line.transliteration}\n${line.translation}`,
      )),
    ].join('\n\n');
    await Share.share({message, title: aarti.title});
  };

  const playRecording = async (recording: AartiRecording) => {
    if (!aarti || !recording.url?.trim()) {
      return;
    }
    if (recording.type === 'VIDEO') {
      navigation.navigate('VideoPlayer', {
        url: recording.url,
        title: recording.title,
        subtitle: recording.singer,
      });
      return;
    }
    await playTrack({
      id: `${aarti.id}-${recording.id}`,
      title: recording.title,
      artist: recording.singer,
      url: recording.url,
      artwork: aarti.coverImageUrl,
      duration: recording.durationSeconds,
    });
    navigation.navigate('AudioPlayer');
  };

  if (loading && !aarti) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="cards" count={2} />
      </View>
    );
  }

  if (!aarti && error) {
    return (
      <View style={styles.container}>
        <ErrorBanner message={error} onRetry={refresh} />
        <EmptyState
          icon="🪔"
          title="Could not load aarti"
          actionLabel="Retry"
          onAction={refresh}
        />
      </View>
    );
  }

  const lineCount = aarti?.lines?.length ?? 0;
  const showPdf = Boolean(aarti?.pdfUrl?.trim());
  const recordings = aarti?.recordings?.filter(r => r.url?.trim()) ?? [];
  const audioRecordings = recordings.filter(r => r.type === 'AUDIO');
  const videoRecordings = recordings.filter(r => r.type === 'VIDEO');

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={refresh} />}
      <FlatList
        data={aarti?.lines ?? []}
        keyExtractor={(_, index) => String(index)}
        {...flatListPerfProps}
        contentContainerStyle={styles.list}
        renderItem={({item, index}) => (
          <AartiLineCard
            line={item}
            index={index}
            sanskritFontSize={sanskritFontSize}
            translationFontSize={translationFontSize}
          />
        )}
        ListHeaderComponent={
          aarti ? (
            <View style={styles.headerCard}>
              <Text style={styles.deityType}>{aarti.deityType}</Text>
              <SanskritText text={aarti.sanskritName} style={styles.sanskrit} size={22} bold />
              <SelectableReadableText text={aarti.description} style={styles.description} />
              <View style={styles.readingDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.readingMode}>{lineCount} lines</Text>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.mediaActions}>
                {showPdf && (
                  <Pressable
                    style={({pressed}) => [styles.mediaBtn, styles.pdfBtn, pressed && styles.pressed]}
                    onPress={() =>
                      navigation.navigate('PdfViewer', {
                        url: aarti.pdfUrl,
                        title: `${aarti.title} — PDF`,
                      })
                    }>
                    <Text style={styles.mediaBtnText}>📄 Read full Aarti PDF (Gita Press)</Text>
                  </Pressable>
                )}
                {audioRecordings.length > 0 ? (
                  <View style={styles.recordingsBlock}>
                    <Text style={styles.recordingsTitle}>
                      🎵 Listen · {audioRecordings.length} singers & styles
                    </Text>
                    {audioRecordings.map(rec => (
                      <Pressable
                        key={rec.id}
                        style={({pressed}) => [styles.recordingCard, pressed && styles.pressed]}
                        onPress={() => playRecording(rec)}>
                        <View style={styles.recordingBody}>
                          <Text style={styles.recordingTitle}>{rec.title}</Text>
                          <Text style={styles.recordingSinger}>{rec.singer}</Text>
                          <Text style={styles.recordingStyle}>{rec.style}</Text>
                        </View>
                        <Text style={styles.recordingMeta}>
                          {formatDuration(rec.durationSeconds)} ›
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
                {videoRecordings.length > 0 ? (
                  <View style={styles.recordingsBlock}>
                    <Text style={styles.recordingsTitle}>
                      🎬 Watch · {videoRecordings.length} videos
                    </Text>
                    {videoRecordings.map(rec => (
                      <Pressable
                        key={rec.id}
                        style={({pressed}) => [styles.recordingCard, styles.videoCard, pressed && styles.pressed]}
                        onPress={() => playRecording(rec)}>
                        <View style={styles.recordingBody}>
                          <Text style={styles.recordingTitle}>{rec.title}</Text>
                          <Text style={styles.recordingSinger}>{rec.singer}</Text>
                          <Text style={styles.recordingStyle}>{rec.style}</Text>
                        </View>
                        <Text style={styles.recordingMeta}>
                          {formatDuration(rec.durationSeconds)} ›
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
                <Pressable
                  style={({pressed}) => [styles.mediaBtn, styles.shareBtn, pressed && styles.pressed]}
                  onPress={shareAarti}>
                  <Text style={styles.mediaBtnText}>↗ Share Aarti</Text>
                </Pressable>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !error ? (
            <EmptyState icon="📜" title="No aarti lines available" message="Try refreshing or open the PDF above." />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  list: {padding: spacing.md, paddingBottom: 120},
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  deityType: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: 4,
  },
  sanskrit: {
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 21,
  },
  readingDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  readingMode: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  mediaActions: {gap: 8},
  mediaBtn: {
    backgroundColor: colors.tabActive,
    borderRadius: borderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pdfBtn: {
    backgroundColor: colors.surfaceElevated,
  },
  videoBtn: {
    backgroundColor: colors.backgroundAlt,
  },
  shareBtn: {
    backgroundColor: colors.surface,
  },
  mediaBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  recordingsBlock: {
    gap: 8,
  },
  recordingsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  recordingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  videoCard: {
    backgroundColor: colors.surfaceMuted,
  },
  recordingBody: {
    flex: 1,
    minWidth: 0,
  },
  recordingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  recordingSinger: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  recordingStyle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  recordingMeta: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  lineCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  lineBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tabActive,
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  lineNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  lineSanskrit: {
    color: colors.text,
  },
  lineTransliteration: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 19,
  },
  lineTranslation: {
    color: colors.text,
    marginTop: 8,
    lineHeight: 24,
  },
  pressed: {opacity: 0.9},
});
