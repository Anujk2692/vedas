import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {Chapter} from '../api/types';
import {SanskritText} from './SanskritText';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';
import {formatDuration} from '../utils/formatTime';
import {mediaQualityLabel} from '../utils/mediaLabels';

interface Props {
  chapter: Chapter;
  onPress: () => void;
  onAudioPress?: () => void;
  onVideoPress?: () => void;
}

export function ChapterCard({chapter, onPress, onAudioPress, onVideoPress}: Props) {
  const hasMedia = (chapter.audioUrl && onAudioPress) || (chapter.videoUrl && onVideoPress);

  return (
    <View style={styles.card}>
      <Pressable style={({pressed}) => [styles.mainArea, pressed && styles.pressed]} onPress={onPress}>
        <View style={styles.numberBadge}>
          <Text style={styles.number}>{chapter.number}</Text>
        </View>
        <View style={styles.content}>
          {chapter.divisionLabel ? (
            <Text style={styles.divisionLabel}>{chapter.divisionLabel}</Text>
          ) : null}
          <SanskritText
            text={chapter.sanskritName}
            style={styles.sanskrit}
            size={17}
            bold
            selectable={false}
          />
          <Text style={styles.title}>{chapter.title}</Text>
          <Text style={styles.summary} numberOfLines={2}>
            {chapter.summary}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>
              {chapter.suktaCount ? `${chapter.suktaCount} suktas · ` : ''}
              {chapter.mantraCount ? `${chapter.mantraCount.toLocaleString()} mantras · ` : ''}
              {chapter.verseCount} in app
            </Text>
            <View style={styles.durationPill}>
              <Text style={styles.durationText}>{formatDuration(chapter.durationSeconds)}</Text>
            </View>
          </View>
          {mediaQualityLabel(chapter.audioUrl) && (
            <Text style={styles.quality}>{mediaQualityLabel(chapter.audioUrl)}</Text>
          )}
        </View>
      </Pressable>
      {hasMedia ? (
        <View style={styles.actions}>
          {chapter.audioUrl && onAudioPress && (
            <Pressable
              style={({pressed}) => [styles.actionBtn, styles.audioBtn, pressed && styles.actionPressed]}
              onPress={onAudioPress}>
              <Text style={styles.actionText}>🎵 Listen</Text>
            </Pressable>
          )}
          {chapter.videoUrl && onVideoPress && (
            <Pressable
              style={({pressed}) => [styles.actionBtn, styles.videoBtn, pressed && styles.actionPressed]}
              onPress={onVideoPress}>
              <Text style={styles.videoActionText}>🎬 Watch</Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.92,
  },
  mainArea: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  number: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 17,
  },
  content: {
    flex: 1,
  },
  divisionLabel: {
    ...typography.caption,
    color: colors.primaryDark,
    marginBottom: 4,
  },
  sanskrit: {
    color: colors.primary,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  summary: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: 8,
  },
  meta: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
  durationPill: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  quality: {
    fontSize: 11,
    color: colors.primaryDark,
    marginTop: 6,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: 2,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  audioBtn: {
    backgroundColor: colors.tabActive,
    borderWidth: 1,
    borderColor: colors.border,
  },
  videoBtn: {
    backgroundColor: colors.primaryDark,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionText: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  videoActionText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '700',
  },
});
