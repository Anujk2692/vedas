import React, {useCallback, useMemo} from 'react';
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
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {formatDuration} from '../utils/formatTime';
import {LIST_BOTTOM_INSET} from '../utils/layout';
import {flatListPerfProps} from '../utils/listPerf';
import {mediaQualityLabel} from '../utils/mediaLabels';

export function VideoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const fetchVideos = useCallback(
    () => api.getAllMedia('VIDEO', language, true),
    [language],
  );
  const {data, loading, refreshing, error, refresh} = useCachedFetch<MediaItem[]>(
    '/media/all?type=VIDEO',
    language,
    fetchVideos,
    [language],
  );
  const media = data ?? [];
  const playlist = useMemo(
    () => media.map(item => ({url: item.url, title: item.title, subtitle: item.reciter})),
    [media],
  );

  if (loading && media.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="cards" count={3} />
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
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          media.length > 0 ? (
            <View style={styles.headerBlock}>
              <InfoBanner
                icon="🎬"
                text="Watch traditional Vedic patha — clear pronunciation & ritual chanting"
              />
              <SectionHeader title="Videos" subtitle={`${media.length} sacred recordings`} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="📽"
            title="No video content yet"
            message="Pull down to refresh or check your connection in Settings."
            actionLabel={error ? 'Retry' : undefined}
            onAction={error ? refresh : undefined}
          />
        }
        renderItem={({item, index}) => (
          <Pressable
            style={({pressed}) => [styles.card, pressed && styles.pressed]}
            onPress={() =>
              navigation.navigate('VideoPlayer', {
                url: item.url,
                title: item.title,
                subtitle: item.reciter,
                playlist,
                startIndex: index,
              })
            }>
            <View style={styles.thumbWrapper}>
              <RemoteImage uri={item.thumbnailUrl} style={styles.thumb} placeholderIcon="🎬" />
              <View style={styles.playOverlay}>
                <View style={styles.playCircle}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>
                  {formatDuration(item.durationSeconds)}
                </Text>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.reciter}>{item.reciter}</Text>
              {mediaQualityLabel(item.url) && (
                <View style={styles.qualityPill}>
                  <Text style={styles.quality}>{mediaQualityLabel(item.url)}</Text>
                </View>
              )}
              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  listContent: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  headerBlock: {marginBottom: spacing.sm},
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  pressed: {opacity: 0.95},
  thumbWrapper: {position: 'relative'},
  thumb: {width: '100%', height: 190, backgroundColor: colors.surfaceMuted},
  playOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(44, 24, 16, 0.25)',
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  playIcon: {fontSize: 22, color: colors.primary, marginLeft: 3},
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(26, 15, 10, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  durationText: {color: colors.white, fontSize: 12, fontWeight: '700'},
  info: {padding: spacing.md},
  title: {fontSize: 16, fontWeight: '800', color: colors.text, lineHeight: 22},
  reciter: {fontSize: 13, color: colors.primary, marginTop: 4, fontWeight: '600'},
  qualityPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginTop: 6,
  },
  quality: {fontSize: 10, color: colors.primaryDark, fontWeight: '700'},
  desc: {fontSize: 13, color: colors.textMuted, marginTop: 8, lineHeight: 19},
});
