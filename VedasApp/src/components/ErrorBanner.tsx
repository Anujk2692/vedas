import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {borderRadius, colors, spacing} from '../theme/colors';

interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({message, onRetry}: Props) {
  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Pressable style={({pressed}) => [styles.retryBtn, pressed && styles.pressed]} onPress={onRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.errorLight,
    borderColor: 'rgba(183, 28, 28, 0.25)',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...Platform.select({ios: {shadowOpacity: 0}, android: {elevation: 0}}),
  },
  icon: {
    fontSize: 18,
  },
  message: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  retryBtn: {
    backgroundColor: colors.error,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  retryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  pressed: {opacity: 0.9},
});
