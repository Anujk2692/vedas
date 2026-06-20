import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import Orientation from 'react-native-orientation-locker';

function isLandscapeOrientation(orientation: string) {
  return (
    orientation === 'LANDSCAPE-LEFT' ||
    orientation === 'LANDSCAPE-RIGHT' ||
    orientation === 'LANDSCAPE'
  );
}

/** Allow rotation on video screen; restore portrait elsewhere. */
export function useVideoOrientation(onLandscapeChange?: (landscape: boolean) => void) {
  useFocusEffect(
    useCallback(() => {
      Orientation.unlockAllOrientations();

      const onOrientation = (orientation: string) => {
        onLandscapeChange?.(isLandscapeOrientation(orientation));
      };

      Orientation.addOrientationListener(onOrientation);
      Orientation.getOrientation(onOrientation);

      return () => {
        Orientation.removeOrientationListener(onOrientation);
        Orientation.lockToPortrait();
        onLandscapeChange?.(false);
      };
    }, [onLandscapeChange]),
  );
}

export function enterLandscapeVideo() {
  Orientation.lockToLandscape();
}

export function exitLandscapeVideo() {
  Orientation.lockToPortrait();
}
