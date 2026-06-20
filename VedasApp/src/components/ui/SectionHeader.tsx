import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing, typography} from '../../theme/colors';

interface Props {
  title: string;
  subtitle?: string;
}

export function SectionHeader({title, subtitle}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.accent} />
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  accent: {
    width: 4,
    height: 28,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
});
