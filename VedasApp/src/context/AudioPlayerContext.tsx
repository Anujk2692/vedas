import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import type {AudioTrack} from '../api/types';
import {useUserPreferences, type PlaybackRate} from './UserPreferencesContext';
import {setupTrackPlayer} from '../services/trackPlayerService';

interface AudioPlayerContextValue {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  queue: AudioTrack[];
  ready: boolean;
  playbackRate: PlaybackRate;
  playTrack: (track: AudioTrack, queue?: AudioTrack[]) => Promise<void>;
  playQueue: (tracks: AudioTrack[], startIndex?: number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  skipForward: () => Promise<void>;
  skipBackward: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  stop: () => Promise<void>;
  changePlaybackRate: (rate: PlaybackRate) => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function AudioPlayerProvider({children}: {children: React.ReactNode}) {
  const {playbackRate, setPlaybackRate} = useUserPreferences();
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [ready, setReady] = useState(false);
  const playbackState = usePlaybackState();
  const progress = useProgress();

  const isPlaying = playbackState.state === State.Playing;

  const syncActiveTrack = useCallback(async () => {
    const track = await TrackPlayer.getActiveTrack();
    if (track) {
      setCurrentTrack({
        id: String(track.id ?? ''),
        title: track.title ?? '',
        artist: track.artist ?? '',
        url: track.url,
        artwork: track.artwork,
        duration: track.duration ?? 0,
      });
    } else {
      setCurrentTrack(null);
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        await setupTrackPlayer();
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SeekTo,
            Capability.JumpForward,
            Capability.JumpBackward,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.JumpForward,
            Capability.JumpBackward,
          ],
          forwardJumpInterval: 15,
          backwardJumpInterval: 15,
          progressUpdateEventInterval: 1,
        });
        setReady(true);
      } catch {
        setReady(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    TrackPlayer.setRate(playbackRate).catch(() => {});
  }, [playbackRate, ready]);

  useEffect(() => {
    const sub = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async () => {
        await syncActiveTrack();
      },
    );
    const queueSub = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      () => {
        setCurrentTrack(null);
        setQueue([]);
      },
    );
    return () => {
      sub.remove();
      queueSub.remove();
    };
  }, [syncActiveTrack]);

  const playQueue = useCallback(async (tracks: AudioTrack[], startIndex = 0) => {
    const playable = tracks.filter(t => t.url?.trim());
    if (!playable.length) {
      return;
    }
    const safeIndex = Math.min(Math.max(0, startIndex), playable.length - 1);
    await TrackPlayer.reset();
    await TrackPlayer.add(
      playable.map(t => ({
        id: t.id,
        url: t.url,
        title: t.title,
        artist: t.artist,
        artwork: t.artwork,
        duration: t.duration,
      })),
    );
    if (safeIndex > 0) {
      await TrackPlayer.skip(safeIndex);
    }
    setQueue(playable);
    setCurrentTrack(playable[safeIndex]);
    await TrackPlayer.setRate(playbackRate);
    await TrackPlayer.play();
  }, [playbackRate]);

  const changePlaybackRate = useCallback(
    async (rate: PlaybackRate) => {
      await TrackPlayer.setRate(rate);
      await setPlaybackRate(rate);
    },
    [setPlaybackRate],
  );

  const playTrack = useCallback(
    async (track: AudioTrack, trackQueue?: AudioTrack[]) => {
      const q = trackQueue ?? [track];
      const index = q.findIndex(t => t.id === track.id);
      await playQueue(q, Math.max(0, index));
    },
    [playQueue],
  );

  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }, [isPlaying]);

  const seekTo = useCallback(async (position: number) => {
    await TrackPlayer.seekTo(position);
  }, []);

  const skipForward = useCallback(async () => {
    const pos = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(pos + 15);
  }, []);

  const skipBackward = useCallback(async () => {
    const pos = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(Math.max(0, pos - 15));
  }, []);

  const playNext = useCallback(async () => {
    await TrackPlayer.skipToNext();
    await syncActiveTrack();
  }, [syncActiveTrack]);

  const playPrevious = useCallback(async () => {
    await TrackPlayer.skipToPrevious();
    await syncActiveTrack();
  }, [syncActiveTrack]);

  const stop = useCallback(async () => {
    await TrackPlayer.reset();
    setCurrentTrack(null);
    setQueue([]);
  }, []);

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      position: progress.position,
      duration: progress.duration,
      queue,
      ready,
      playTrack,
      playQueue,
      togglePlayPause,
      seekTo,
      skipForward,
      skipBackward,
      playNext,
      playPrevious,
      stop,
      playbackRate,
      changePlaybackRate,
    }),
    [
      currentTrack,
      isPlaying,
      progress.position,
      progress.duration,
      queue,
      ready,
      playbackRate,
      playTrack,
      playQueue,
      togglePlayPause,
      seekTo,
      skipForward,
      skipBackward,
      playNext,
      playPrevious,
      stop,
      changePlaybackRate,
    ],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return ctx;
}
