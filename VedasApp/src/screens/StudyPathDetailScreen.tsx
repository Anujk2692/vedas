import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {api} from '../api/client';
import type {StudyPath} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {ScreenLoader} from '../components/ui/ScreenLoader';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';
import {LIST_BOTTOM_INSET} from '../utils/layout';

export function StudyPathDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'StudyPathDetail'>>();
  const {language} = useLanguage();
  const {isStudyStepComplete, toggleStudyStep, getStudyPathProgress} = useUserPreferences();
  const fetchPath = useCallback(
    () => api.getStudyPath(route.params.slug, language),
    [route.params.slug, language],
  );
  const {data: path, loading, error, refresh} = useCachedFetch<StudyPath>(
    `/sanatan/study-paths/${route.params.slug}`,
    language,
    fetchPath,
    [route.params.slug, language],
  );

  const progress = getStudyPathProgress(route.params.slug);
  const totalSteps = path?.steps?.length ?? 0;
  const completedCount = progress?.completedSteps.length ?? 0;
  const percent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const progressLabel = useMemo(() => {
    if (totalSteps === 0) {
      return '';
    }
    return `${completedCount}/${totalSteps} पूर्ण · ${percent}%`;
  }, [completedCount, totalSteps, percent]);

  if (loading && !path) {
    return (
      <View style={styles.container}>
        <ScreenLoader variant="rows" count={3} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={refresh} />}
      <FlatList
        data={path?.steps ?? []}
        keyExtractor={item => String(item.order)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          path ? (
            <View style={styles.header}>
              <Text style={styles.icon}>{path.icon}</Text>
              <Text style={styles.title}>{path.title}</Text>
              <Text style={styles.meta}>
                {path.durationLabel} · {path.level}
              </Text>
              {totalSteps > 0 ? (
                <View style={styles.progressWrap}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, {width: `${percent}%`}]} />
                  </View>
                  <Text style={styles.progressText}>{progressLabel}</Text>
                </View>
              ) : null}
              <Text style={styles.description}>{path.description}</Text>
            </View>
          ) : null
        }
        renderItem={({item, index}) => {
          const done = isStudyStepComplete(route.params.slug, item.order);
          return (
            <View style={[styles.stepCard, done && styles.stepCardDone]}>
              <Pressable
                style={[styles.stepBadge, done && styles.stepBadgeDone]}
                onPress={() => toggleStudyStep(route.params.slug, item.order)}>
                <Text style={styles.stepNum}>{done ? '✓' : index + 1}</Text>
              </Pressable>
              <View style={styles.stepBody}>
                <Text style={[styles.stepTitle, done && styles.stepTitleDone]}>{item.title}</Text>
                <Text style={styles.stepDesc}>{item.description}</Text>
                {item.scriptureSlug ? (
                  <Pressable
                    style={styles.readBtn}
                    onPress={() =>
                      navigation.navigate('VedaDetail', {
                        vedaId: item.scriptureSlug!,
                        title: item.title,
                      })
                    }>
                    <Text style={styles.readBtnText}>ग्रंथ पढ़ें →</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  header: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  icon: {fontSize: 36, marginBottom: spacing.sm},
  title: {fontSize: 22, fontWeight: '800', color: colors.text},
  meta: {fontSize: 12, fontWeight: '700', color: colors.primary, marginTop: 4},
  progressWrap: {marginTop: spacing.sm},
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {height: '100%', backgroundColor: colors.primary, borderRadius: 4},
  progressText: {fontSize: 11, fontWeight: '700', color: colors.primary, marginTop: 4},
  description: {fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 22},
  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  stepCardDone: {borderColor: colors.primary, backgroundColor: colors.tabActive},
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.tabActive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepBadgeDone: {backgroundColor: colors.primary},
  stepNum: {fontWeight: '800', color: colors.primaryDark},
  stepBody: {flex: 1},
  stepTitle: {fontSize: 15, fontWeight: '800', color: colors.text},
  stepTitleDone: {color: colors.primaryDark},
  stepDesc: {fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 19},
  readBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  readBtnText: {color: colors.white, fontWeight: '700', fontSize: 12},
});
