import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useUserPreferences} from '../../context/UserPreferencesContext';
import {borderRadius, colors, spacing} from '../../theme/colors';

interface Props {
  icon?: string;
  text: string;
}

export function InfoBanner({icon = '✨', text}: Props) {
  const {themeColors} = useUserPreferences();

  return (
    <View
      style={[
        styles.banner,
        {backgroundColor: themeColors.tabActive, borderColor: themeColors.borderLight},
      ]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.text, {color: themeColors.primaryDark}]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tabActive,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  icon: {fontSize: 26},
  text: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryDark,
    lineHeight: 19,
    fontWeight: '600',
  },
});
