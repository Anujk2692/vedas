import React from 'react';
import {Image, StyleSheet, View, type ImageStyle, type StyleProp, type ViewStyle} from 'react-native';
import {shadows} from '../../theme/colors';

/** Square Om/lotus mark — always rendered with contain so petals never crop. */
const LOGO = require('../../../assets/images/app-logo-sm.png');

interface Props {
  size?: number;
  showRing?: boolean;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export function AppLogo({size = 48, showRing = true, style, imageStyle}: Props) {
  const ring = Math.round(size + size * 0.18);
  return (
    <View
      style={[
        styles.wrap,
        showRing && styles.ring,
        showRing && {
          width: ring,
          height: ring,
          borderRadius: ring / 2,
        },
        !showRing && {width: size, height: size},
        style,
      ]}>
      <Image
        source={LOGO}
        style={[
          {
            width: size,
            height: size,
          },
          imageStyle,
        ]}
        resizeMode="contain"
        accessibilityLabel="Sanatan Gyan logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'visible',
  },
  ring: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    ...shadows.sm,
  },
});
