import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useUserPreferences} from '../context/UserPreferencesContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';

export function ContinueReadingCard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {readingProgress, clearReadingProgress} = useUserPreferences();

  if (!readingProgress) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Pressable
        style={({pressed}) => [styles.main, pressed && styles.cardPressed]}
        onPress={() =>
          navigation.navigate('ChapterReader', {
            chapterId: readingProgress.chapterId,
            title: readingProgress.title,
            vedaTitle: readingProgress.vedaTitle,
          })
        }>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>📖</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Continue Reading</Text>
          <Text style={styles.title}>{readingProgress.title}</Text>
          {readingProgress.vedaTitle && (
            <Text style={styles.subtitle}>{readingProgress.vedaTitle}</Text>
          )}
        </View>
      </Pressable>
      <TouchableOpacity
        onPress={() => clearReadingProgress()}
        style={styles.dismiss}
        hitSlop={8}
        accessibilityLabel="Dismiss continue reading">
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingRight: spacing.xs,
  },
  cardPressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(196, 92, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  label: {
    ...typography.caption,
    color: colors.primary,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  dismiss: {
    padding: spacing.md,
  },
  dismissText: {
    color: colors.textMuted,
    fontSize: 16,
  },
});
