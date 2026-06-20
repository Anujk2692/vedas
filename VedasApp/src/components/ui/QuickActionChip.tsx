import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {borderRadius, colors, shadows, spacing} from '../../theme/colors';

interface Props {
  icon: string;
  label: string;
  onPress: () => void;
  accent?: boolean;
}

export function QuickActionChip({icon, label, onPress, accent}: Props) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.chip,
        accent && styles.chipAccent,
        pressed && styles.chipPressed,
      ]}
      onPress={onPress}>
      <View style={[styles.iconWrap, accent && styles.iconWrapAccent]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.label, accent && styles.labelAccent]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  chipAccent: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
  },
  chipPressed: {
    opacity: 0.88,
    transform: [{scale: 0.98}],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconWrapAccent: {
    backgroundColor: 'rgba(196, 92, 0, 0.12)',
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  labelAccent: {
    color: colors.primaryDark,
  },
});
