import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

const PRESETS = [5, 10, 15, 20, 30];

export function MeditationTimerScreen() {
  const {recordSadhanaPractice} = useUserPreferences();
  const [minutes, setMinutes] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [completed, setCompleted] = useState(false);

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
    <View style={styles.container}>
      <Text style={styles.title}>🧘 ध्यान टाइमर</Text>
      <Text style={styles.subtitle}>Competitor apps include meditation timers — sit with Gita wisdom daily.</Text>

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
              <Text style={[styles.presetText, minutes === m && styles.presetTextActive]}>{m} min</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        {!running ? (
          <Pressable style={styles.startBtn} onPress={start}>
            <Text style={styles.startBtnText}>Start</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.stopBtn} onPress={stop}>
            <Text style={styles.stopBtnText}>Stop</Text>
          </Pressable>
        )}
      </View>

      {completed ? (
        <Text style={styles.done}>🙏 शांति — meditation complete</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, padding: spacing.lg, alignItems: 'center'},
  title: {fontSize: 22, fontWeight: '800', color: colors.text, marginTop: spacing.md},
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    marginBottom: spacing.xl,
  },
  timerText: {fontSize: 42, fontWeight: '800', color: colors.primaryDark},
  presets: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: spacing.lg},
  preset: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.tabActive,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  presetActive: {backgroundColor: colors.primary, borderColor: colors.primaryDark},
  presetText: {fontSize: 13, fontWeight: '700', color: colors.primaryDark},
  presetTextActive: {color: colors.white},
  actions: {width: '100%', maxWidth: 280},
  startBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  startBtnText: {color: colors.white, fontWeight: '800', fontSize: 16},
  stopBtn: {
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stopBtnText: {color: colors.text, fontWeight: '800', fontSize: 16},
  done: {marginTop: spacing.lg, fontSize: 16, fontWeight: '700', color: colors.primary},
});
