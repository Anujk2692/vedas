import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {borderRadius, colors, shadows, spacing, typography} from '../../theme/colors';

type Variant = 'default' | 'player' | 'dark';

interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
  variant?: Variant;
  showBack?: boolean;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
  rightNode?: React.ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  icon,
  variant = 'default',
  showBack = false,
  onBack,
  rightLabel,
  onRightPress,
  rightNode,
}: Props) {
  const insets = useSafeAreaInsets();
  const isDark = variant === 'player' || variant === 'dark';

  return (
    <View
      style={[
        styles.wrap,
        isDark ? styles.wrapDark : styles.wrapLight,
        variant === 'player' && styles.wrapPlayer,
        {paddingTop: insets.top + spacing.xs},
      ]}>
      <View style={[styles.accent, isDark ? styles.accentDark : styles.accentLight]} />

      <View style={styles.row}>
        {showBack ? (
          <Pressable
            onPress={onBack}
            style={({pressed}) => [
              styles.backBtn,
              isDark ? styles.backBtnDark : styles.backBtnLight,
              pressed && styles.pressed,
            ]}
            hitSlop={8}
            accessibilityLabel="Go back">
            <Text style={[styles.backIcon, isDark && styles.backIconDark]}>‹</Text>
          </Pressable>
        ) : icon ? (
          <View style={[styles.iconBadge, isDark ? styles.iconBadgeDark : styles.iconBadgeLight]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        ) : (
          <View style={styles.backSpacer} />
        )}

        <View style={styles.titles}>
          <Text
            style={[styles.title, isDark && styles.titleDark]}
            numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[styles.subtitle, isDark && styles.subtitleDark]}
              numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightNode ??
          (rightLabel && onRightPress ? (
            <Pressable
              onPress={onRightPress}
              style={({pressed}) => [
                styles.rightBtn,
                isDark ? styles.rightBtnDark : styles.rightBtnLight,
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.rightText, isDark && styles.rightTextDark]}>
                {rightLabel}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.backSpacer} />
          ))}
      </View>
    </View>
  );
}

/** Stack header wired to navigation goBack */
export function StackScreenHeader(props: Omit<Props, 'showBack' | 'onBack'> & {showBack?: boolean}) {
  const navigation = useNavigation();
  return (
    <ScreenHeader
      {...props}
      showBack={props.showBack ?? true}
      onBack={() => navigation.goBack()}
    />
  );
}

export const TAB_HEADER_META: Record<
  string,
  {title: string; subtitle: string; icon: string}
> = {
  Audio: {
    title: 'Sacred Audio',
    subtitle: 'Traditional patha · clear pronunciation',
    icon: '🎵',
  },
  Aarti: {
    title: 'Devi & Devta Aarti',
    subtitle: 'Latest singers · PDF · audio · video',
    icon: '🪔',
  },
  Video: {
    title: 'Sacred Video',
    subtitle: 'Watch Vedic chanting & rituals',
    icon: '🎬',
  },
  Search: {
    title: 'Search',
    subtitle: 'Vedas, aartis, mantras & media',
    icon: '🔍',
  },
  Settings: {
    title: 'Settings',
    subtitle: 'Reading, audio & saved mantras',
    icon: '⚙️',
  },
};

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  wrapLight: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.borderLight,
    ...shadows.sm,
  },
  wrapDark: {
    backgroundColor: colors.headerDark,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  wrapPlayer: {
    backgroundColor: colors.playerBackground,
  },
  accent: {
    height: 3,
    borderRadius: 2,
    marginBottom: spacing.sm,
    marginHorizontal: 2,
  },
  accentLight: {
    backgroundColor: colors.primary,
    opacity: 0.85,
  },
  accentDark: {
    backgroundColor: colors.primaryLight,
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnLight: {
    backgroundColor: colors.tabActive,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  backIcon: {
    fontSize: 28,
    lineHeight: 30,
    color: colors.primaryDark,
    fontWeight: '300',
    marginTop: -2,
    marginLeft: -2,
  },
  backIconDark: {
    color: colors.playerText,
  },
  backSpacer: {
    width: 36,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeLight: {
    backgroundColor: colors.tabActive,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconBadgeDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  icon: {
    fontSize: 22,
  },
  titles: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    letterSpacing: -0.2,
  },
  titleDark: {
    color: colors.playerText,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  subtitleDark: {
    color: 'rgba(255,248,240,0.6)',
  },
  rightBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  rightBtnLight: {
    backgroundColor: colors.tabActive,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rightBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  rightText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  rightTextDark: {
    color: colors.playerText,
  },
  pressed: {
    opacity: 0.85,
  },
});
