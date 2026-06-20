import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {AartiSummary} from '../api/types';
import {RemoteImage} from './ui/RemoteImage';
import {SanskritText} from './SanskritText';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

interface Props {
  aarti: AartiSummary;
  onPress: () => void;
}

export function AartiListCard({aarti, onPress}: Props) {
  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${aarti.title} aarti`}>
      <RemoteImage uri={aarti.coverImageUrl} style={styles.thumb} placeholderIcon="🪔" />
      <View style={styles.body}>
        <Text style={styles.type}>{aarti.deityType}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {aarti.title}
        </Text>
        <SanskritText
          text={aarti.sanskritName}
          style={styles.sanskrit}
          size={14}
          bold
          selectable={false}
          numberOfLines={1}
        />
        <View style={styles.badges}>
          {aarti.hasPdf && <Text style={styles.badge}>PDF</Text>}
          {aarti.hasAudio && <Text style={styles.badge}>Audio</Text>}
          {aarti.hasVideo && <Text style={styles.badge}>Video</Text>}
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  pressed: {opacity: 0.95},
  thumb: {
    width: 76,
    height: 76,
    borderRadius: borderRadius.md,
  },
  body: {
    flex: 1,
    marginLeft: spacing.sm,
    minWidth: 0,
  },
  type: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 21,
  },
  sanskrit: {
    color: colors.textMuted,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    backgroundColor: colors.tabActive,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  chevron: {
    fontSize: 26,
    color: colors.textMuted,
    marginLeft: 4,
    fontWeight: '300',
  },
});
