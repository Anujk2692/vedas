import React, {useCallback} from 'react';
import {FlatList, Pressable, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {api} from '../api/client';
import type {MediaItem} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {EmptyState} from '../components/ui/EmptyState';
import {InfoBanner} from '../components/ui/InfoBanner';
import {RemoteImage} from '../components/ui/RemoteImage';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {SectionHeader} from '../components/ui/SectionHeader';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {formatDuration} from '../utils/formatTime';
import {LIST_BOTTOM_INSET} from '../utils/layout';
import {flatListPerfProps} from '../utils/listPerf';
import {mediaQualityLabel} from '../utils/mediaLabels';

export function AudioScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const {playTrack, playQueue} = useAudioPlayer();
  const fetchAudio = useCallback(
    () => api.getAllMedia('AUDIO', language, true),
    [language],
  );
  const {data, loading, refreshing, error, refresh} = useCachedFetch<MediaItem[]>(
    '/media/all?type=AUDIO',
    language,
    fetchAudio,
    [language],
  );
  const media = data ?? [];

  const toTracks = () =>
    media.map(m => ({
      id: m.id,
      title: m.title,
      artist: m.reciter,
      url: m.url,
      artwork: m.thumbnailUrl,
      duration: m.durationSeconds,
    }));

  const playAll = async () => {
    await playQueue(toTracks());
    navigation.navigate('AudioPlayer');
  };

  if (loading && media.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="rows" count={5} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={refresh} />}

      <FlatList
        data={media}
        keyExtractor={item => item.id}
        {...flatListPerfProps}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          media.length > 0 ? (
            <View style={styles.headerBlock}>
              <InfoBanner
                icon="🕉"
                text="Authentic Vedic chanting — traditional patha with clear Sanskrit pronunciation"
              />
              <Pressable
                style={({pressed}) => [styles.playAllBtn, pressed && styles.pressed]}
                onPress={playAll}>
                <Text style={styles.playAllIcon}>▶</Text>
                <View>
                  <Text style={styles.playAllText}>Play All</Text>
                  <Text style={styles.playAllSub}>{media.length} recordings</Text>
                </View>
              </Pressable>
              <SectionHeader title="Recordings" subtitle="Tap any track to begin" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="🎵"
            title="No audio content yet"
            message="Pull down to refresh or check your connection in Settings."
            actionLabel={error ? 'Retry' : undefined}
            onAction={error ? refresh : undefined}
          />
        }
        renderItem={({item}) => (
          <Pressable
            style={({pressed}) => [styles.card, pressed && styles.pressed]}
            onPress={async () => {
              const tracks = toTracks();
              const track = tracks.find(t => t.id === item.id)!;
              await playTrack(track, tracks);
              navigation.navigate('AudioPlayer');
            }}>
            <RemoteImage uri={item.thumbnailUrl} style={styles.thumb} placeholderIcon="🎵" />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.reciter}>{item.reciter}</Text>
              {mediaQualityLabel(item.url) && (
                <View style={styles.qualityPill}>
                  <Text style={styles.quality}>{mediaQualityLabel(item.url)}</Text>
                </View>
              )}
              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.duration}>{formatDuration(item.durationSeconds)}</Text>
            </View>
            <View style={styles.playCircle}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  headerBlock: {marginBottom: spacing.sm},
  playAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  playAllIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    lineHeight: 44,
    fontSize: 18,
    color: colors.white,
    overflow: 'hidden',
  },
  playAllText: {color: colors.white, fontWeight: '800', fontSize: 17},
  playAllSub: {color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2},
  pressed: {opacity: 0.9},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceMuted,
  },
  info: {flex: 1, marginLeft: spacing.sm, marginRight: spacing.xs},
  title: {fontSize: 15, fontWeight: '700', color: colors.text, lineHeight: 20},
  reciter: {fontSize: 13, color: colors.primary, marginTop: 3, fontWeight: '600'},
  qualityPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginTop: 4,
  },
  quality: {fontSize: 10, color: colors.primaryDark, fontWeight: '700'},
  desc: {fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 17},
  duration: {fontSize: 11, color: colors.textMuted, marginTop: 4, fontWeight: '600'},
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tabActive,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  playIcon: {fontSize: 16, color: colors.primary, marginLeft: 2},
});
