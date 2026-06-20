import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTextTranslate} from '../context/TextTranslateContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

interface Props {
  bottomOffset?: number;
}

export function TextTranslateBar({bottomOffset = 68}: Props) {
  const insets = useSafeAreaInsets();
  const {
    selectedText,
    translatedText,
    loading,
    speaking,
    error,
    targetLanguageLabel,
    translateSelection,
    listenSelection,
    replaySpeech,
    stopSpeaking,
    clearSelection,
  } = useTextTranslate();

  if (!selectedText) {
    return null;
  }

  const preview = translatedText ?? selectedText;

  return (
    <View
      style={[
        styles.wrap,
        {bottom: bottomOffset + insets.bottom + 8},
      ]}
      pointerEvents="box-none">
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>
            {translatedText ? `Translated · ${targetLanguageLabel}` : 'Selected text'}
          </Text>
          <Pressable onPress={clearSelection} hitSlop={8}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>
        <Text style={styles.preview} numberOfLines={3}>
          {preview}
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.actions}>
          {!translatedText ? (
            <>
              <Pressable
                style={({pressed}) => [styles.primaryBtn, pressed && styles.pressed]}
                onPress={translateSelection}
                disabled={loading || speaking}>
                {loading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.primaryBtnText}>
                    Translate & Listen · {targetLanguageLabel}
                  </Text>
                )}
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.secondaryBtn, styles.fullWidth, pressed && styles.pressed]}
                onPress={listenSelection}
                disabled={loading || speaking}>
                <Text style={styles.secondaryBtnText}>
                  🔊 Listen in {targetLanguageLabel}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={({pressed}) => [styles.secondaryBtn, pressed && styles.pressed]}
                onPress={replaySpeech}
                disabled={speaking}>
                <Text style={styles.secondaryBtnText}>
                  {speaking ? '🔊 Playing…' : '🔊 Replay audio'}
                </Text>
              </Pressable>
              {speaking ? (
                <Pressable
                  style={({pressed}) => [styles.secondaryBtn, pressed && styles.pressed]}
                  onPress={stopSpeaking}>
                  <Text style={styles.secondaryBtnText}>Stop</Text>
                </Pressable>
              ) : null}
              <Pressable
                style={({pressed}) => [styles.secondaryBtn, pressed && styles.pressed]}
                onPress={translateSelection}
                disabled={loading}>
                <Text style={styles.secondaryBtnText}>↻ Retranslate</Text>
              </Pressable>
            </>
          )}
        </View>
        {!translatedText ? (
          <Text style={styles.hint}>Highlight any sacred text while reading, then tap translate.</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 120,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  close: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '700',
  },
  preview: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  primaryBtn: {
    flexGrow: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    minWidth: '100%',
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: colors.tabActive,
    borderRadius: borderRadius.full,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fullWidth: {
    minWidth: '100%',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  hint: {
    marginTop: spacing.sm,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
  pressed: {opacity: 0.9},
});
