import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScreenHeader} from '../components/ui/ScreenHeader';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import type {PlaybackRate} from '../context/UserPreferencesContext';
import {borderRadius, colors, spacing} from '../theme/colors';
import {formatDuration} from '../utils/formatTime';

export function AudioPlayerScreen() {
  const navigation = useNavigation();
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    playNext,
    playPrevious,
    queue,
    stop,
    playbackRate,
    changePlaybackRate,
  } = useAudioPlayer();

  const rates: PlaybackRate[] = [0.75, 1, 1.25];

  const handleStop = useCallback(async () => {
    await stop();
    navigation.goBack();
  }, [navigation, stop]);

  const header = (
    <ScreenHeader
      variant="player"
      title="Now Playing"
      subtitle={currentTrack?.artist ?? 'Sacred audio patha'}
      showBack
      onBack={() => navigation.goBack()}
      rightLabel="Stop"
      onRightPress={handleStop}
    />
  );

  if (!currentTrack) {
    return (
      <View style={styles.root}>
        {header}
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎵</Text>
          <Text style={styles.emptyText}>No track playing</Text>
          <Text style={styles.emptyHint}>Select audio from the Audio tab or a chapter</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {header}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.artworkWrap}>
          <Image
            source={{uri: currentTrack.artwork || 'https://via.placeholder.com/300'}}
            style={styles.artwork}
          />
        </View>
        <Text style={styles.title}>{currentTrack.title}</Text>
        <Text style={styles.artist}>{currentTrack.artist}</Text>

        <View style={styles.progressSection}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            onSlidingComplete={seekTo}
            minimumTrackTintColor={colors.primaryLight}
            maximumTrackTintColor="rgba(255,255,255,0.2)"
            thumbTintColor={colors.primaryLight}
          />
          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatDuration(position)}</Text>
            <Text style={styles.time}>{formatDuration(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={playPrevious} style={styles.controlBtn}>
            <Text style={styles.controlIcon}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={skipBackward} style={styles.controlBtn}>
            <Text style={styles.controlIcon}>⏪ 15s</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayPause} style={styles.mainPlayBtn}>
            <Text style={styles.mainPlayIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={skipForward} style={styles.controlBtn}>
            <Text style={styles.controlIcon}>15s ⏩</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={playNext} style={styles.controlBtn}>
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>

        {queue.length > 1 && (
          <Text style={styles.queueInfo}>Queue: {queue.length} tracks</Text>
        )}

        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>Speed (for learning pronunciation)</Text>
          <View style={styles.rateBtns}>
            {rates.map(rate => (
              <TouchableOpacity
                key={rate}
                style={[styles.rateBtn, playbackRate === rate && styles.rateBtnActive]}
                onPress={() => changePlaybackRate(rate)}>
                <Text
                  style={[styles.rateBtnText, playbackRate === rate && styles.rateBtnTextActive]}>
                  {rate}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.playerBackground,
  },
  scrollContent: {
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.playerText,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyHint: {
    color: 'rgba(255,248,240,0.6)',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  artworkWrap: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  artwork: {
    width: 280,
    height: 280,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.playerText,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: 'rgba(255,248,240,0.7)',
    marginTop: 6,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  progressSection: {width: '100%', marginBottom: spacing.lg},
  slider: {width: '100%', height: 40},
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  time: {color: 'rgba(255,248,240,0.6)', fontSize: 12},
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  controlBtn: {padding: 12},
  controlIcon: {fontSize: 16, color: colors.playerText},
  mainPlayBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  mainPlayIcon: {fontSize: 28, color: colors.white},
  queueInfo: {
    marginTop: spacing.xl,
    color: 'rgba(255,248,240,0.5)',
    fontSize: 13,
  },
  rateRow: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  rateLabel: {
    color: 'rgba(255,248,240,0.6)',
    fontSize: 12,
    marginBottom: 8,
  },
  rateBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  rateBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,248,240,0.3)',
  },
  rateBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rateBtnText: {
    color: 'rgba(255,248,240,0.7)',
    fontWeight: '600',
  },
  rateBtnTextActive: {
    color: colors.white,
  },
});
