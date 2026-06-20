import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TAB_BAR_HEIGHT} from '../../utils/layout';
import {borderRadius, colors, shadows, spacing} from '../../theme/colors';

type TabKey = 'Home' | 'Aarti' | 'Audio' | 'Video' | 'Search' | 'Settings';

const TAB_META: Record<TabKey, {label: string; icon: string; activeIcon: string}> = {
  Home: {label: 'Home', icon: '⌂', activeIcon: '⌂'},
  Aarti: {label: 'Aarti', icon: '🪔', activeIcon: '🪔'},
  Audio: {label: 'Audio', icon: '♪', activeIcon: '♫'},
  Video: {label: 'Video', icon: '▷', activeIcon: '▶'},
  Search: {label: 'Search', icon: '⌕', activeIcon: '⌕'},
  Settings: {label: 'Settings', icon: '⚙', activeIcon: '⚙'},
};

export function VedasTabBar({state, descriptors, navigation}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, {paddingBottom: Math.max(insets.bottom, 10)}]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const meta = TAB_META[route.name as TabKey] ?? {
            label: route.name,
            icon: '•',
            activeIcon: '•',
          };
          const {options} = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? meta.label;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({pressed}) => [styles.tab, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityState={{selected: focused}}
              accessibilityLabel={String(label)}>
              {focused && <View style={styles.activeIndicator} />}
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Text style={[styles.icon, focused && styles.iconActive]}>
                  {focused ? meta.activeIcon : meta.icon}
                </Text>
              </View>
              <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
                {String(label)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.tabBar,
  },
  bar: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT - 10,
    paddingTop: 6,
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  iconWrap: {
    width: 34,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  iconWrapActive: {
    backgroundColor: colors.tabActive,
  },
  icon: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '600',
  },
  iconActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.88,
  },
});
