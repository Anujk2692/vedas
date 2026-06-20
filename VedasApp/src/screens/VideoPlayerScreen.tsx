import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import {VideoPlayerView} from '../components/VideoPlayerView';
import {colors, spacing} from '../theme/colors';
import {mediaQualityLabel} from '../utils/mediaLabels';
import {
  enterLandscapeVideo,
  exitLandscapeVideo,
  useVideoOrientation,
} from '../utils/videoOrientation';
import type {RootStackParamList} from '../navigation/types';

function detectLandscape() {
  const {width, height} = Dimensions.get('window');
  return width > height;
}

export function VideoPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'VideoPlayer'>>();
  const [isLandscape, setIsLandscape] = useState(detectLandscape);

  const handleLandscapeChange = useCallback((landscape: boolean) => {
    setIsLandscape(landscape);
  }, []);

  useVideoOrientation(handleLandscapeChange);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({window}) => {
      setIsLandscape(window.width > window.height);
    });
    return () => sub.remove();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({headerShown: !isLandscape});
    StatusBar.setHidden(isLandscape);
    return () => StatusBar.setHidden(false);
  }, [navigation, isLandscape]);

  const toggleLandscape = () => {
    if (isLandscape) {
      exitLandscapeVideo();
    } else {
      enterLandscapeVideo();
    }
  };

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <VideoPlayerView
        url={route.params.url}
        title={route.params.title}
        subtitle={route.params.subtitle}
        playlist={route.params.playlist}
        startIndex={route.params.startIndex}
        isLandscape={isLandscape}
        onToggleLandscape={toggleLandscape}
        onClose={() => navigation.goBack()}
      />
      {!isLandscape && (
        <View style={styles.info}>
          {mediaQualityLabel(route.params.url) && (
            <View style={styles.qualityPill}>
              <Text style={styles.quality}>{mediaQualityLabel(route.params.url)}</Text>
            </View>
          )}
          <Text style={styles.tips}>
            Rotate your phone for landscape · Tap ↻ Landscape on the player · Tap left/right edges
            to skip ±10s · Lock 🔒 prevents accidental taps
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  containerLandscape: {
    backgroundColor: '#000',
  },
  info: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  qualityPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tabActive,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quality: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  tips: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
