import TrackPlayer, {Event} from 'react-native-track-player';

let isPlayerSetup = false;

export async function setupTrackPlayer() {
  if (isPlayerSetup) {
    return true;
  }
  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });
    isPlayerSetup = true;
    return true;
  } catch (error) {
    const message = String(error);
    if (message.includes('already been initialized')) {
      isPlayerSetup = true;
      return true;
    }
    throw error;
  }
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.reset();
  });
  TrackPlayer.addEventListener(Event.RemoteSeek, ({position}) =>
    TrackPlayer.seekTo(position),
  );
  TrackPlayer.addEventListener(Event.RemoteJumpForward, async () => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(position + 15);
  });
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async () => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(Math.max(0, position - 15));
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious(),
  );
}
