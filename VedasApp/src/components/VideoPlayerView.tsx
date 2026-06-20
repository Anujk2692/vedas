import Slider from '@react-native-community/slider';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video, {type OnLoadData, type OnProgressData, type VideoRef} from 'react-native-video';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {borderRadius, colors, spacing} from '../theme/colors';
import {formatDuration} from '../utils/formatTime';

export interface VideoPlaylistItem {
  url: string;
  title: string;
  subtitle?: string;
}

interface Props {
  url: string;
  title: string;
  subtitle?: string;
  playlist?: VideoPlaylistItem[];
  startIndex?: number;
  isLandscape?: boolean;
  onToggleLandscape?: () => void;
  onClose?: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5] as const;
type Speed = (typeof SPEEDS)[number];

export function VideoPlayerView({
  url: initialUrl,
  title: initialTitle,
  subtitle: initialSubtitle,
  playlist,
  startIndex = 0,
  isLandscape = false,
  onToggleLandscape,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const videoRef = useRef<VideoRef>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [scrubPosition, setScrubPosition] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [locked, setLocked] = useState(false);
  const [rate, setRate] = useState<Speed>(1);
  const [resizeMode, setResizeMode] = useState<'contain' | 'cover'>('contain');
  const [playlistIndex, setPlaylistIndex] = useState(startIndex);
  const [screen, setScreen] = useState(Dimensions.get('window'));

  const items = playlist?.length ? playlist : [{url: initialUrl, title: initialTitle, subtitle: initialSubtitle}];
  const current = items[Math.min(playlistIndex, items.length - 1)];
  const hasPrev = playlistIndex > 0;
  const hasNext = playlistIndex < items.length - 1;

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({window}) => setScreen(window));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    return () => {
      setPaused(true);
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const scheduleHideControls = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    if (paused || ended || locked) {
      return;
    }
    hideTimer.current = setTimeout(() => setShowControls(false), 4000);
  }, [paused, ended, locked]);

  useEffect(() => {
    if (showControls && !locked) {
      scheduleHideControls();
    }
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, [showControls, scheduleHideControls, locked, position]);

  const revealControls = () => {
    setShowControls(true);
    scheduleHideControls();
  };

  const loadVideo = (index: number) => {
    setPlaylistIndex(index);
    setPosition(0);
    setScrubPosition(0);
    setIsScrubbing(false);
    setDuration(0);
    setEnded(false);
    setError(null);
    setLoading(true);
    setPaused(false);
  };

  const onLoad = (data: OnLoadData) => {
    setDuration(data.duration);
    setLoading(false);
    setError(null);
    setEnded(false);
  };

  const onProgress = (data: OnProgressData) => {
    if (!isScrubbing) {
      setPosition(data.currentTime);
    }
  };

  const seekTo = (value: number) => {
    videoRef.current?.seek(value);
    setPosition(value);
    setScrubPosition(value);
    setIsScrubbing(false);
    setEnded(false);
  };

  const skip = (delta: number) => {
    const next = Math.max(0, Math.min(duration, position + delta));
    seekTo(next);
    revealControls();
  };

  const handleClose = () => {
    setPaused(true);
    onClose?.();
  };

  const handleEnd = () => {
    if (loop) {
      seekTo(0);
      setPaused(false);
      return;
    }
    if (hasNext) {
      loadVideo(playlistIndex + 1);
      return;
    }
    setEnded(true);
    setPaused(true);
    setShowControls(true);
  };

  const replay = () => {
    setEnded(false);
    seekTo(0);
    setPaused(false);
    revealControls();
  };

  if (!current?.url) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.errorText}>No video URL available</Text>
      </View>
    );
  }

  const displayPosition = isScrubbing ? scrubPosition : position;
  const immersive = isLandscape;

  return (
    <View style={[styles.container, immersive && styles.containerImmersive]}>
      <Pressable
        style={[
          styles.videoWrapper,
          immersive && {
            flex: 1,
            aspectRatio: undefined,
            width: screen.width,
            height: screen.height,
          },
        ]}
        onPress={() => {
          if (locked) {
            setShowControls(true);
            return;
          }
          setShowControls(prev => !prev);
        }}>
        <Video
          ref={videoRef}
          key={current.url}
          source={{uri: current.url}}
          style={immersive ? styles.videoImmersive : [styles.video, {width: screen.width}]}
          paused={paused}
          rate={rate}
          volume={1}
          muted={muted}
          repeat={loop}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onLoadStart={() => setLoading(true)}
          onReadyForDisplay={() => setLoading(false)}
          onProgress={onProgress}
          onEnd={handleEnd}
          onBuffer={({isBuffering}) => setLoading(isBuffering)}
          onError={() => {
            setLoading(false);
            setError('Failed to load video. Check your connection.');
          }}
          controls={false}
          playInBackground={false}
          ignoreSilentSwitch="ignore"
          bufferConfig={{
            minBufferMs: 2000,
            maxBufferMs: 20000,
            bufferForPlaybackMs: 500,
            bufferForPlaybackAfterRebufferMs: 1000,
          }}
          preferredForwardBufferDuration={8}
          automaticallyWaitsToMinimizeStalling={false}
        />

        {loading && !error && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primaryLight} />
            <Text style={styles.loadingText}>Connecting to video…</Text>
          </View>
        )}

        {error && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setError(null);
                setLoading(true);
                videoRef.current?.seek(0);
              }}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {ended && !error && (
          <View style={styles.endOverlay}>
            <Text style={styles.endTitle}>Finished</Text>
            <Text style={styles.endSubtitle}>{current.title}</Text>
            <View style={styles.endActions}>
              <TouchableOpacity style={styles.endBtn} onPress={replay}>
                <Text style={styles.endBtnText}>↺ Replay</Text>
              </TouchableOpacity>
              {hasNext && (
                <TouchableOpacity style={[styles.endBtn, styles.endBtnPrimary]} onPress={() => loadVideo(playlistIndex + 1)}>
                  <Text style={styles.endBtnText}>Next ▶</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {!locked && showControls && !error && !ended && (
          <>
            <Pressable style={styles.tapZoneLeft} onPress={() => skip(-10)} />
            <Pressable style={styles.tapZoneRight} onPress={() => skip(10)} />
          </>
        )}

        {showControls && !error && !ended && (
          <View
            style={[
              styles.controlsOverlay,
              locked && styles.controlsLocked,
              immersive && {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
              },
            ]}
            pointerEvents="box-none">
            <View style={styles.topBar}>
              <View style={styles.topBarText}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {current.title}
                </Text>
                {current.subtitle ? (
                  <Text style={styles.videoSubtitle} numberOfLines={1}>
                    {current.subtitle}
                  </Text>
                ) : null}
                {items.length > 1 && (
                  <Text style={styles.playlistMeta}>
                    {playlistIndex + 1} / {items.length}
                  </Text>
                )}
              </View>
              <View style={styles.topActions}>
                <TouchableOpacity
                  onPress={() => setLocked(!locked)}
                  style={styles.iconBtn}>
                  <Text style={styles.iconBtnText}>{locked ? '🔓' : '🔒'}</Text>
                </TouchableOpacity>
                {onClose ? (
                  <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {!locked && (
              <>
                <View style={styles.centerControls}>
                  {hasPrev && (
                    <TouchableOpacity onPress={() => loadVideo(playlistIndex - 1)} style={styles.skipBtn}>
                      <Text style={styles.skipText}>⏮</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => skip(-30)} style={styles.skipBtn}>
                    <Text style={styles.skipText}>-30s</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => skip(-10)} style={styles.skipBtn}>
                    <Text style={styles.skipText}>-10s</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setPaused(!paused)} style={styles.playBtn}>
                    <Text style={styles.playIcon}>{paused ? '▶' : '⏸'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => skip(10)} style={styles.skipBtn}>
                    <Text style={styles.skipText}>+10s</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => skip(30)} style={styles.skipBtn}>
                    <Text style={styles.skipText}>+30s</Text>
                  </TouchableOpacity>
                  {hasNext && (
                    <TouchableOpacity onPress={() => loadVideo(playlistIndex + 1)} style={styles.skipBtn}>
                      <Text style={styles.skipText}>⏭</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.bottomPanel}>
                  <View style={styles.bottomBar}>
                    <Text style={styles.timeText}>{formatDuration(displayPosition)}</Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={duration || 1}
                      value={displayPosition}
                      onSlidingStart={() => {
                        setIsScrubbing(true);
                        setScrubPosition(position);
                      }}
                      onValueChange={setScrubPosition}
                      onSlidingComplete={seekTo}
                      minimumTrackTintColor={colors.primaryLight}
                      maximumTrackTintColor="rgba(255,255,255,0.3)"
                      thumbTintColor={colors.primaryLight}
                    />
                    <Text style={styles.timeText}>{formatDuration(duration)}</Text>
                  </View>

                  <View style={styles.toolRow}>
                    <TouchableOpacity onPress={() => setMuted(!muted)} style={styles.toolBtn}>
                      <Text style={styles.toolBtnText}>{muted ? '🔇' : '🔊'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setLoop(!loop)} style={[styles.toolBtn, loop && styles.toolBtnActive]}>
                      <Text style={styles.toolBtnText}>{loop ? '🔁 On' : '🔁'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setResizeMode(m => (m === 'contain' ? 'cover' : 'contain'))}
                      style={styles.toolBtn}>
                      <Text style={styles.toolBtnText}>{resizeMode === 'contain' ? '⛶ Fit' : '⛶ Fill'}</Text>
                    </TouchableOpacity>
                    {onToggleLandscape ? (
                      <TouchableOpacity onPress={onToggleLandscape} style={[styles.toolBtn, immersive && styles.toolBtnActive]}>
                        <Text style={styles.toolBtnText}>{immersive ? '↻ Portrait' : '↻ Landscape'}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  {!immersive && (
                  <View style={styles.speedRow}>
                    <Text style={styles.speedLabel}>Speed</Text>
                    {SPEEDS.map(s => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => setRate(s)}
                        style={[styles.speedBtn, rate === s && styles.speedBtnActive]}>
                        <Text style={[styles.speedBtnText, rate === s && styles.speedBtnTextActive]}>
                          {s}x
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  )}
                </View>
              </>
            )}

            {locked && (
              <View style={styles.lockHintWrap}>
                <Text style={styles.lockHint}>Controls locked — tap 🔓 to unlock</Text>
              </View>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  containerImmersive: {
    flex: 1,
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  video: {
    alignSelf: 'center',
  },
  videoImmersive: {
    ...StyleSheet.absoluteFill,
  },
  tapZoneLeft: {
    position: 'absolute',
    left: 0,
    top: '25%',
    bottom: '25%',
    width: '35%',
  },
  tapZoneRight: {
    position: 'absolute',
    right: 0,
    top: '25%',
    bottom: '25%',
    width: '35%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: spacing.md,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.sm,
    fontSize: 13,
  },
  endOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: spacing.lg,
  },
  endTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  endSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  endActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.lg,
  },
  endBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  endBtnPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  endBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  controlsLocked: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  topBarText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  videoSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  playlistMeta: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  iconBtn: {
    padding: 8,
  },
  iconBtnText: {
    fontSize: 18,
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  skipBtn: {
    padding: 10,
  },
  skipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  playIcon: {
    fontSize: 24,
    color: '#fff',
  },
  bottomPanel: {
    paddingBottom: spacing.md,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  timeText: {
    color: '#fff',
    fontSize: 11,
    width: 44,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  toolRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    paddingHorizontal: spacing.sm,
  },
  toolBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  toolBtnActive: {
    backgroundColor: colors.primary,
  },
  toolBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: spacing.sm,
  },
  speedLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 4,
  },
  speedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  speedBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  speedBtnText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  speedBtnTextActive: {
    color: '#fff',
  },
  lockHintWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  lockHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  errorBox: {
    backgroundColor: '#000',
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});
