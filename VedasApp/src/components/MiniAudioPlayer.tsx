import Slider from '@react-native-community/slider';
import React from 'react';
import {Image, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {formatDuration} from '../utils/formatTime';

interface Props {
  onExpand?: () => void;
}

export function MiniAudioPlayer({onExpand}: Props) {
  const insets = useSafeAreaInsets();
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    togglePlayPause,
    skipForward,
    skipBackward,
    stop,
  } = useAudioPlayer();

  if (!currentTrack) {
    return null;
  }

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View
      style={[
        styles.container,
        {paddingBottom: Math.max(insets.bottom / 2, spacing.sm)},
        Platform.OS === 'ios' ? shadows.lg : {elevation: 12},
      ]}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${Math.min(progress * 100, 100)}%`}]} />
      </View>

      <View style={styles.row}>
        <Pressable style={styles.infoArea} onPress={onExpand}>
          <Image
            source={{uri: currentTrack.artwork || 'https://via.placeholder.com/60'}}
            style={styles.artwork}
          />
          <View style={styles.info}>
            <Text style={styles.nowPlaying}>NOW PLAYING</Text>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
            <Text style={styles.time}>
              {formatDuration(position)} / {formatDuration(duration)}
            </Text>
          </View>
        </Pressable>

        <View style={styles.controls}>
          <Pressable onPress={skipBackward} style={styles.controlBtn} hitSlop={8}>
            <Text style={styles.controlIcon}>⏪</Text>
          </Pressable>
          <Pressable onPress={togglePlayPause} style={styles.playBtn}>
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </Pressable>
          <Pressable onPress={skipForward} style={styles.controlBtn} hitSlop={8}>
            <Text style={styles.controlIcon}>⏩</Text>
          </Pressable>
          <Pressable
            onPress={stop}
            style={styles.closeBtn}
            hitSlop={8}
            accessibilityLabel="Stop playback">
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        </View>
      </View>

      <Slider
        style={styles.sliderHidden}
        minimumValue={0}
        maximumValue={duration || 1}
        value={position}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        thumbTintColor="transparent"
        disabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.playerBackground,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: borderRadius.lg,
    right: borderRadius.lg,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  artwork: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
    minWidth: 0,
  },
  nowPlaying: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    color: colors.playerText,
    fontSize: 14,
    fontWeight: '700',
  },
  artist: {
    color: 'rgba(255,248,240,0.65)',
    fontSize: 12,
    marginTop: 1,
  },
  time: {
    color: 'rgba(255,248,240,0.45)',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlBtn: {
    padding: 4,
  },
  controlIcon: {
    fontSize: 14,
    color: colors.playerText,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  playIcon: {
    fontSize: 15,
    color: colors.white,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  closeIcon: {
    fontSize: 13,
    color: 'rgba(255,248,240,0.85)',
    fontWeight: '700',
  },
  sliderHidden: {
    height: 0,
    opacity: 0,
  },
});
