import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {borderRadius, colors, spacing} from '../../theme/colors';

function SkeletonBar({width, height = 14}: {width: number | `${number}%`; height?: number}) {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.bar,
        {width, height, opacity: pulse},
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <SkeletonBar width="100%" height={120} />
      <View style={styles.cardBody}>
        <SkeletonBar width="70%" height={16} />
        <SkeletonBar width="95%" height={12} />
        <SkeletonBar width="40%" height={12} />
      </View>
    </View>
  );
}

export function SkeletonListRow() {
  return (
    <View style={styles.row}>
      <SkeletonBar width={72} height={72} />
      <View style={styles.rowBody}>
        <SkeletonBar width="55%" height={14} />
        <SkeletonBar width="80%" height={12} />
        <SkeletonBar width="35%" height={10} />
      </View>
    </View>
  );
}

interface Props {
  variant?: 'cards' | 'rows';
  count?: number;
}

export function ScreenLoader({variant = 'cards', count = 3}: Props) {
  return (
    <View style={styles.wrap}>
      {Array.from({length: count}).map((_, i) =>
        variant === 'rows' ? <SkeletonListRow key={i} /> : <SkeletonCard key={i} />,
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  bar: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardBody: {
    padding: spacing.md,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  rowBody: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
});
