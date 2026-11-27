import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useUserPreferences} from '../../context/UserPreferencesContext';
import {colors, spacing, typography} from '../../theme/colors';

interface Props {
  title: string;
  subtitle?: string;
}

export function SectionHeader({title, subtitle}: Props) {
  const {themeColors} = useUserPreferences();

  return (
    <View style={styles.wrap}>
      <View style={[styles.accent, {backgroundColor: themeColors.primary}]} />
      <View>
        <Text style={[styles.title, {color: themeColors.text}]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, {color: themeColors.textMuted}]}>{subtitle}</Text>
        ) : null}
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
