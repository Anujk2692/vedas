import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import {YogaPoseGraphic} from '../components/YogaPoseGraphic';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {YOGA_ASANAS, type YogaAsana} from '../data/yogaAsanas';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

const PRESETS = [5, 10, 15, 20, 30];

const CATEGORIES = [
  {key: 'All', en: 'All', hi: 'सभी'},
  {key: 'Standing', en: 'Standing', hi: 'खड़े होकर'},
  {key: 'Seated', en: 'Seated', hi: 'बैठकर'},
  {key: 'Backbend', en: 'Backbend', hi: 'पीछे झुकने'},
  {key: 'Inversion', en: 'Inversion', hi: 'उल्टे'},
  {key: 'Relaxation', en: 'Relaxation', hi: 'विश्राम'},
  {key: 'Pranayama', en: 'Pranayama', hi: 'प्राणायाम'},
];

export function MeditationTimerScreen() {
  const {recordSadhanaPractice} = useUserPreferences();
  const {language} = useLanguage();
  const isHi = language === 'hi' || language === 'sa';

  const [tab, setTab] = useState<'timer' | 'yoga'>('timer');
  const [minutes, setMinutes] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [category, setCategory] = useState('All');
  const [selectedAsana, setSelectedAsana] = useState<YogaAsana | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const filteredAsanas = useMemo(() => {
    if (category === 'All') {
      return YOGA_ASANAS;
    }
    return YOGA_ASANAS.filter(a => a.category === category);
  }, [category]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const start = () => {
    clearTimer();
    setCompleted(false);
    setSecondsLeft(minutes * 60);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          setCompleted(true);
          recordSadhanaPractice().catch(() => undefined);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => {
    clearTimer();
    setRunning(false);
    setSecondsLeft(0);
    setCompleted(false);
  };

  const displayMin = Math.floor(secondsLeft / 60);
  const displaySec = secondsLeft % 60;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabBtn, tab === 'timer' && styles.tabBtnActive]}
          onPress={() => setTab('timer')}>
          <Text style={[styles.tabText, tab === 'timer' && styles.tabTextActive]}>
            {isHi ? '🧘 ध्यान टाइमर' : '🧘 Meditation'}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, tab === 'yoga' && styles.tabBtnActive]}
          onPress={() => setTab('yoga')}>
          <Text style={[styles.tabText, tab === 'yoga' && styles.tabTextActive]}>
            {isHi ? '🤸 योग आसन (12)' : '🤸 Yoga Asanas (12)'}
          </Text>
        </Pressable>
      </View>

      {tab === 'timer' ? (
        <View style={styles.timerContainer}>
          <Text style={styles.title}>{isHi ? '🧘 ध्यान टाइमर' : '🧘 Meditation Timer'}</Text>
          <Text style={styles.subtitle}>
            {isHi
              ? 'दैनिक ध्यान और श्वास अभ्यास के लिए शांत टाइमर।'
              : 'Sit calmly with steady breath and Gita wisdom daily.'}
          </Text>

          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>
              {running || secondsLeft > 0
                ? `${String(displayMin).padStart(2, '0')}:${String(displaySec).padStart(2, '0')}`
                : `${minutes}:00`}
            </Text>
          </View>

          {!running ? (
            <View style={styles.presets}>
              {PRESETS.map(m => (
                <Pressable
                  key={m}
                  style={[styles.preset, minutes === m && styles.presetActive]}
                  onPress={() => setMinutes(m)}>
                  <Text style={[styles.presetText, minutes === m && styles.presetTextActive]}>
                    {m} min
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.actions}>
            {!running ? (
              <Pressable style={styles.startBtn} onPress={start}>
                <Text style={styles.startBtnText}>{isHi ? 'शुरू करें' : 'Start'}</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.stopBtn} onPress={stop}>
                <Text style={styles.stopBtnText}>{isHi ? 'रोकें' : 'Stop'}</Text>
              </Pressable>
            )}
          </View>

          {completed ? (
            <Text style={styles.done}>
              {isHi ? '🙏 शांति — ध्यान पूर्ण हुआ' : '🙏 Shanti — meditation complete'}
            </Text>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={filteredAsanas}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.yogaList}
          ListHeaderComponent={
            <View>
              <Text style={styles.yogaHeading}>
                {isHi ? '🤸 योग आसन, चित्र व वीडियो' : '🤸 Yoga Asanas, Graphics & Videos'}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.catRow}>
                {CATEGORIES.map(c => (
                  <Pressable
                    key={c.key}
                    style={[styles.catChip, category === c.key && styles.catChipActive]}
                    onPress={() => setCategory(c.key)}>
                    <Text style={[styles.catText, category === c.key && styles.catTextActive]}>
                      {isHi ? c.hi : c.en}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          }
          renderItem={({item}) => (
            <Pressable
              style={styles.yogaCard}
              onPress={() => {
                setSelectedAsana(item);
                setShowVideo(false);
              }}>
              <YogaPoseGraphic poseId={item.id} size={96} />
              <View style={styles.yogaCardInfo}>
                <Text style={styles.pillText}>
                  {isHi ? item.categoryHi : item.category} · {item.duration}
                </Text>
                <Text style={styles.yogaTitle}>{isHi ? item.titleHi : item.titleEn}</Text>
                <Text style={styles.yogaSanskrit}>{item.sanskrit}</Text>
                <Text style={styles.yogaBenefit} numberOfLines={2}>
                  ✅ {(isHi ? item.benefitsHi : item.benefitsEn)[0]}
                </Text>
                <Text style={styles.yogaLink}>
                  {isHi ? 'विधि, लाभ व वीडियो →' : 'Steps, Benefits & Video →'}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}

      <Modal
        visible={!!selectedAsana}
        animationType="slide"
        onRequestClose={() => setSelectedAsana(null)}>
        <SafeAreaView style={styles.modalRoot}>
          {selectedAsana ? (
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Pressable style={styles.closeBtn} onPress={() => setSelectedAsana(null)}>
                <Text style={styles.closeText}>
                  {isHi ? '← सभी योग आसन' : '← All Yoga Asanas'}
                </Text>
              </Pressable>

              <View style={styles.modalHero}>
                <YogaPoseGraphic poseId={selectedAsana.id} size={156} />
                <Text style={styles.modalPill}>
                  {isHi ? selectedAsana.categoryHi : selectedAsana.category} · {selectedAsana.duration}
                </Text>
                <Text style={styles.modalTitle}>
                  {isHi ? selectedAsana.titleHi : selectedAsana.titleEn}
                </Text>
                <Text style={styles.modalSanskrit}>{selectedAsana.sanskrit}</Text>
                <Text style={styles.breathBox}>
                  🌬️ {isHi ? selectedAsana.breathHi : selectedAsana.breathEn}
                </Text>
              </View>

              <View style={styles.videoBox}>
                <Text style={styles.sectionTitle}>
                  {isHi ? '🎥 गाइडेड वीडियो' : '🎥 Guided Video'}
                </Text>
                {showVideo ? (
                  <View style={styles.webviewWrap}>
                    <WebView
                      source={{uri: `https://www.youtube.com/embed/${selectedAsana.videoId}?rel=0`}}
                      style={styles.webview}
                      allowsFullscreenVideo
                      javaScriptEnabled
                    />
                  </View>
                ) : (
                  <Pressable style={styles.playBtn} onPress={() => setShowVideo(true)}>
                    <Text style={styles.playBtnText}>
                      {isHi ? '▶ ऐप में वीडियो चलाएं' : '▶ Play Guided Video In-App'}
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  style={styles.ytBtn}
                  onPress={() =>
                    Linking.openURL(`https://www.youtube.com/watch?v=${selectedAsana.videoId}`)
                  }>
                  <Text style={styles.ytBtnText}>
                    {isHi ? 'YouTube पर खोलें ↗' : 'Open on YouTube ↗'}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.panel}>
                <Text style={styles.sectionTitle}>
                  {isHi ? '📋 करने की विधि' : '📋 Step-by-Step Instructions'}
                </Text>
                {(isHi ? selectedAsana.stepsHi : selectedAsana.stepsEn).map((step, i) => (
                  <Text key={i} style={styles.listItem}>
                    {i + 1}. {step}
                  </Text>
                ))}
              </View>

              <View style={styles.panel}>
                <Text style={styles.sectionTitle}>
                  {isHi ? '✨ मुख्य लाभ' : '✨ Health & Mind Benefits'}
                </Text>
                {(isHi ? selectedAsana.benefitsHi : selectedAsana.benefitsEn).map((b, i) => (
                  <Text key={i} style={styles.listItem}>
                    ✅ {b}
                  </Text>
                ))}
                <Text style={styles.cautionBox}>
                  ⚠️ {isHi ? selectedAsana.cautionHi : selectedAsana.cautionEn}
                </Text>
              </View>
            </ScrollView>
          ) : null}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabBtnActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  tabText: {fontWeight: '700', color: colors.textSecondary, fontSize: 13},
  tabTextActive: {color: colors.white},
  timerContainer: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg},
  title: {fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 6},
  subtitle: {fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl},
  timerCircle: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: colors.surface,
    borderWidth: 6,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  timerText: {fontSize: 44, fontWeight: '800', color: colors.primaryDark},
  presets: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: spacing.lg},
  preset: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  presetText: {fontWeight: '700', color: colors.textSecondary},
  presetTextActive: {color: colors.white},
  actions: {width: '100%', alignItems: 'center'},
  startBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: borderRadius.full,
  },
  startBtnText: {color: colors.white, fontWeight: '800', fontSize: 16},
  stopBtn: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: borderRadius.full,
  },
  stopBtnText: {color: colors.primaryDark, fontWeight: '800', fontSize: 16},
  done: {marginTop: spacing.lg, fontSize: 16, fontWeight: '700', color: colors.primaryDark},
  yogaList: {padding: spacing.md, paddingBottom: 40, gap: 12},
  yogaHeading: {fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 10},
  catRow: {gap: 8, paddingBottom: 10},
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  catText: {fontSize: 12, fontWeight: '700', color: colors.textSecondary},
  catTextActive: {color: colors.white},
  yogaCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  yogaCardInfo: {flex: 1},
  pillText: {fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 2},
  yogaTitle: {fontSize: 15, fontWeight: '800', color: colors.text},
  yogaSanskrit: {fontSize: 12, color: colors.textMuted, marginBottom: 4},
  yogaBenefit: {fontSize: 12, color: colors.textSecondary, marginBottom: 4},
  yogaLink: {fontSize: 12, fontWeight: '700', color: colors.primaryDark},
  modalRoot: {flex: 1, backgroundColor: colors.background},
  modalContent: {padding: spacing.md, paddingBottom: 40, gap: 14},
  closeBtn: {paddingVertical: 6},
  closeText: {fontSize: 15, fontWeight: '700', color: colors.primary},
  modalHero: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 6,
  },
  modalPill: {fontSize: 12, fontWeight: '700', color: colors.primary},
  modalTitle: {fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'center'},
  modalSanskrit: {fontSize: 14, color: colors.textMuted},
  breathBox: {
    fontSize: 13,
    color: colors.textSecondary,
    backgroundColor: '#fff7ed',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  videoBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 10,
  },
  webviewWrap: {height: 210, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000'},
  webview: {flex: 1},
  playBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  playBtnText: {color: colors.white, fontWeight: '800', fontSize: 14},
  ytBtn: {alignItems: 'center', paddingVertical: 6},
  ytBtnText: {color: colors.primaryDark, fontWeight: '700', fontSize: 13},
  panel: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8,
  },
  sectionTitle: {fontSize: 16, fontWeight: '800', color: colors.primaryDark},
  listItem: {fontSize: 14, color: colors.text, lineHeight: 20},
  cautionBox: {
    marginTop: 4,
    fontSize: 13,
    color: '#9a3412',
    backgroundColor: '#ffedd5',
    padding: 10,
    borderRadius: 8,
  },
});
