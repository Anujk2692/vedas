import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {SubscriptionPlan, SubscriptionStatus} from '../api/types';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

const ACCOUNT_STORAGE_KEY = '@sanatan_sub_account_key';

export function SubscriptionScreen() {
  const {language} = useLanguage();
  const {themeColors} = useUserPreferences();
  const isHi = language === 'hi' || language === 'sa';

  const [accountKey, setAccountKey] = useState('demo@sanatangyan.app');
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async (keyOverride?: string) => {
    const key = (keyOverride ?? accountKey).trim();
    if (!key) {
      return;
    }
    await AsyncStorage.setItem(ACCOUNT_STORAGE_KEY, key).catch(() => undefined);
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSubscriptionStatus(key);
      setStatus(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to check subscription');
    } finally {
      setLoading(false);
    }
  }, [accountKey]);

  useEffect(() => {
    AsyncStorage.getItem(ACCOUNT_STORAGE_KEY)
      .then(saved => {
        const key = saved?.trim() || 'demo@sanatangyan.app';
        setAccountKey(key);
        loadStatus(key);
      })
      .catch(() => loadStatus('demo@sanatangyan.app'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activate = async (plan: SubscriptionPlan, sandbox: boolean) => {
    const key = accountKey.trim();
    if (!key) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const storeProvider = Platform.OS === 'ios' ? 'APPLE' : 'GOOGLE';
      const txId = sandbox
        ? `DEV-${plan.code}-${Date.now()}`
        : `${storeProvider}-LIVE-${plan.code}-${Date.now()}`;
      const res = await api.activateSubscription({
        accountKey: key,
        planCode: plan.code,
        provider: sandbox ? 'DEV_SANDBOX' : storeProvider,
        transactionId: txId,
        sandbox,
      });
      setStatus(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Activation failed');
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    const key = accountKey.trim();
    if (!key) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.cancelSubscription(key);
      setStatus(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cancel failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.root, {backgroundColor: themeColors.background}]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.heading, {color: themeColors.text}]}>
        {isHi ? '👑 सनातन प्लस (एक सदस्यता)' : '👑 Sanatan Plus (One Subscription)'}
      </Text>
      <Text style={[styles.sub, {color: themeColors.textSecondary}]}>
        {isHi
          ? 'एक ही सदस्यता से Web, iOS और Android पर संपूर्ण ग्रंथ, AI गुरु ज्योतिष/अंक ज्योतिष, आरती, चालीसा, भजन और योग अनलॉक करें।'
          : 'One unified subscription unlocks AI Guru Jyotish/Numerology, all 48 Aartis, 47 Chalisas, 59 Bhajans & 24 Yoga Asanas across Web, iOS & Android.'}
      </Text>

      <View
        style={[
          styles.card,
          {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight},
        ]}>
        <Text style={[styles.label, {color: themeColors.primaryDark}]}>
          {isHi ? 'साझा खाता (Email / Phone)' : 'Shared Account Key (Email or Phone)'}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeColors.surfaceMuted,
              color: themeColors.text,
              borderColor: themeColors.borderLight,
            },
          ]}
          value={accountKey}
          onChangeText={setAccountKey}
          autoCapitalize="none"
          placeholder="you@example.com or +9198..."
          placeholderTextColor={themeColors.textMuted}
        />
        <Pressable
          style={[styles.outlineBtn, {borderColor: themeColors.primary}]}
          onPress={() => loadStatus()}
          disabled={loading}>
          <Text style={[styles.outlineBtnText, {color: themeColors.primaryDark}]}>
            {isHi ? '🔄 स्थिति जांचें / Restore Purchase' : '🔄 Check Status / Restore Purchase'}
          </Text>
        </Pressable>
      </View>

      {loading ? <ActivityIndicator color={colors.primary} style={{marginVertical: 8}} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {status ? (
        <>
          <View
            style={[
              styles.card,
              {
                backgroundColor: status.active ? '#f0fdf4' : themeColors.surface,
                borderColor: status.active ? '#22c55e' : themeColors.borderLight,
              },
            ]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.badge, status.active && styles.badgeOn]}>
                {status.active
                  ? isHi
                    ? '✅ सक्रिय (ACTIVE)'
                    : '✅ ACTIVE'
                  : isHi
                    ? 'मुफ़्त प्लान (FREE)'
                    : 'FREE PLAN'}
              </Text>
              {status.sandboxMode ? (
                <Text style={styles.devPill}>🧪 Dev Sandbox</Text>
              ) : null}
            </View>
            <Text style={styles.statusTitle}>
              {status.planCode} · {status.provider}
            </Text>
            {status.expiresAt ? (
              <Text style={styles.meta}>
                {isHi ? 'वैधता:' : 'Valid until:'} {status.expiresAt.slice(0, 10)}
              </Text>
            ) : null}
            {status.active ? (
              <Pressable style={styles.cancelBtn} onPress={cancel} disabled={loading}>
                <Text style={styles.cancelText}>
                  {isHi ? 'सदस्यता रद्द / रीसेट करें' : 'Cancel / Reset to Free'}
                </Text>
              </Pressable>
            ) : null}
          </View>

          {status.devTestingEnabled ? (
            <View style={styles.devBanner}>
              <Text style={styles.devTitle}>
                {isHi ? '🧪 डेवलपर टेस्टिंग मोड चालू है' : '🧪 Developer Testing Mode Enabled'}
              </Text>
              <Text style={styles.devSub}>
                {isHi
                  ? 'बिना भुगतान तुरंत कोई भी प्लान टेस्ट करें।'
                  : 'Test any plan instantly without payment. Set VEDAS_SUBSCRIPTION_DEV_TESTING_ENABLED=false for production.'}
              </Text>
            </View>
          ) : null}

          {status.plans.map(plan => (
            <View
              key={plan.code}
              style={[
                styles.card,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: plan.code === 'YEARLY' ? themeColors.primary : themeColors.borderLight,
                  borderWidth: plan.code === 'YEARLY' ? 2 : 1,
                },
              ]}>
              <Text style={[styles.planCode, {color: themeColors.primary}]}>{plan.code}</Text>
              <Text style={[styles.planTitle, {color: themeColors.text}]}>
                {isHi ? plan.titleHi : plan.titleEn}
              </Text>
              <Text style={[styles.price, {color: themeColors.primaryDark}]}>{plan.priceDisplay}</Text>
              <Text style={[styles.planNote, {color: themeColors.textSecondary}]}>
                {isHi ? plan.billingNoteHi : plan.billingNoteEn}
              </Text>

              {status.devTestingEnabled ? (
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => activate(plan, true)}
                  disabled={loading}>
                  <Text style={styles.primaryBtnText}>
                    {isHi ? '🧪 टेस्ट सक्रिय करें (Dev)' : '🧪 Activate (Dev Test)'}
                  </Text>
                </Pressable>
              ) : null}
              <Pressable
                style={[styles.outlineBtn, {borderColor: themeColors.primary}]}
                onPress={() => activate(plan, false)}
                disabled={loading}>
                <Text style={[styles.outlineBtnText, {color: themeColors.primaryDark}]}>
                  {Platform.OS === 'ios'
                    ? isHi
                      ? '🍎 App Store से सब्सक्राइब करें'
                      : '🍎 Subscribe via App Store'
                    : isHi
                      ? '▶ Google Play से सब्सक्राइब करें'
                      : '▶ Subscribe via Google Play'}
                </Text>
              </Pressable>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {padding: spacing.md, paddingBottom: 48, gap: 12},
  heading: {fontSize: 22, fontWeight: '800'},
  sub: {fontSize: 13, lineHeight: 19},
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    gap: 8,
    ...shadows.sm,
  },
  label: {fontSize: 13, fontWeight: '700'},
  input: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  badge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    color: '#374151',
    overflow: 'hidden',
  },
  badgeOn: {backgroundColor: '#dcfce7', color: '#166534'},
  devPill: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#fef3c7',
    color: '#92400e',
    overflow: 'hidden',
  },
  statusTitle: {fontSize: 16, fontWeight: '800', color: '#1f2937'},
  meta: {fontSize: 13, color: '#4b5563'},
  devBanner: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  devTitle: {fontSize: 13, fontWeight: '800', color: '#78350f'},
  devSub: {fontSize: 12, color: '#92400e', lineHeight: 17},
  planCode: {fontSize: 11, fontWeight: '800'},
  planTitle: {fontSize: 16, fontWeight: '800'},
  price: {fontSize: 22, fontWeight: '800'},
  planNote: {fontSize: 13, lineHeight: 18},
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 11,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  primaryBtnText: {color: colors.white, fontWeight: '800', fontSize: 13},
  outlineBtn: {
    borderWidth: 1.5,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  outlineBtnText: {fontWeight: '800', fontSize: 13},
  cancelBtn: {alignSelf: 'flex-start', paddingVertical: 6},
  cancelText: {color: '#b91c1c', fontWeight: '700', fontSize: 13},
  error: {color: '#b91c1c', backgroundColor: '#fef2f2', padding: 10, borderRadius: 10, fontSize: 13},
});
