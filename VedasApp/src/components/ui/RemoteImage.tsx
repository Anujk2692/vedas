import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, type ImageStyle, type StyleProp} from 'react-native';
import {borderRadius, colors} from '../../theme/colors';

interface Props {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  placeholderIcon?: string;
}

export function RemoteImage({uri, style, placeholderIcon = '🕉'}: Props) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !uri?.trim() || failed;

  if (showPlaceholder) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderIcon}>{placeholderIcon}</Text>
      </View>
    );
  }

  const resolvedUri = uri!.trim();

  return (
    <Image
      source={{uri: resolvedUri}}
      style={style}
      onError={() => setFailed(true)}
      progressiveRenderingEnabled
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  placeholderIcon: {
    fontSize: 28,
    opacity: 0.45,
  },
});
