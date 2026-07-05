import React from 'react';
import {Image, StyleSheet, View, type ImageStyle, type StyleProp, type ViewStyle} from 'react-native';
import {borderRadius, colors, shadows} from '../../theme/colors';

const LOGO = require('../../../assets/images/app-logo-sm.png');

interface Props {
  size?: number;
  showRing?: boolean;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export function AppLogo({size = 48, showRing = true, style, imageStyle}: Props) {
  const ring = size + 8;
  return (
    <View
      style={[
        showRing && styles.ring,
        showRing && {
          width: ring,
          height: ring,
          borderRadius: ring / 2,
        },
        style,
      ]}>
      <Image
        source={LOGO}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size * 0.22,
          },
          imageStyle,
        ]}
        resizeMode="cover"
        accessibilityLabel="Sanatan Gyan logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    ...shadows.sm,
  },
});
