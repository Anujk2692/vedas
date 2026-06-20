import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {borderRadius, colors} from '../../theme/colors';

interface Props {
  label: string;
  active?: boolean;
  onPress: () => void;
}

export function FilterChip({label, active, onPress}: Props) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  textActive: {
    color: colors.white,
  },
  pressed: {opacity: 0.9},
});
