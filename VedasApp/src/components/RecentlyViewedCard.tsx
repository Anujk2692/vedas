import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useUserPreferences} from '../context/UserPreferencesContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function RecentlyViewedCard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {recentlyViewed} = useUserPreferences();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Recently Viewed</Text>
      {recentlyViewed.map(item => (
        <Pressable
          key={`${item.kind}-${item.id}`}
          style={({pressed}) => [styles.row, pressed && styles.pressed]}
          onPress={() => {
            if (item.kind === 'chapter') {
              navigation.navigate('ChapterReader', {
                chapterId: item.targetId,
                title: item.title,
                vedaTitle: item.subtitle,
              });
            } else if (item.kind === 'topic') {
              navigation.navigate('TopicDetail', {slug: item.targetId, title: item.title});
            } else {
              navigation.navigate('VedaDetail', {vedaId: item.targetId, title: item.title});
            }
          }}>
          <Text style={styles.kind}>
            {item.kind === 'chapter' ? '📖' : item.kind === 'topic' ? '📚' : '🕉'}
          </Text>
          <View style={{flex: 1}}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            ) : null}
          </View>
        </Pressable>
      ))}
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
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
  },
  pressed: {opacity: 0.85},
  kind: {fontSize: 16},
  title: {fontSize: 14, fontWeight: '700', color: colors.text},
  subtitle: {fontSize: 12, color: colors.textMuted, marginTop: 2},
});
