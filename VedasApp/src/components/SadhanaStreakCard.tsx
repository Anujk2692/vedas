import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function SadhanaStreakCard() {
  const {sadhanaStreak, themeColors} = useUserPreferences();
  const current = sadhanaStreak.current;

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: themeColors.surfaceElevated, borderColor: themeColors.borderLight},
      ]}>
      <Text style={[styles.label, {color: themeColors.primary}]}>Sadhana Streak</Text>
      <Text style={[styles.streak, {color: themeColors.text}]}>
        {current > 0 ? `🔥 ${current} day${current === 1 ? '' : 's'}` : '🌱 Start today'}
      </Text>
      <Text style={[styles.hint, {color: themeColors.textMuted}]}>
        Meditate, finish aarti, or complete a quiz to keep your streak. Best: {sadhanaStreak.longest}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  label: {fontSize: 12, fontWeight: '800', color: colors.primary, textTransform: 'uppercase'},
  streak: {fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 6},
  hint: {fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 18},
});
