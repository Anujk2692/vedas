import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {api} from '../api/client';
import type {SubscriptionStatus} from '../api/types';
import type {RootStackParamList} from '../navigation/types';

export const ACCOUNT_STORAGE_KEY = '@sanatan_sub_account_key';

interface SubscriptionContextValue {
  accountKey: string;
  setAccountKey: (key: string) => void;
  status: SubscriptionStatus | null;
  setStatus: (status: SubscriptionStatus | null) => void;
  isSubscribed: boolean;
  loading: boolean;
  refreshStatus: (keyOverride?: string) => Promise<SubscriptionStatus | null>;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  accountKey: 'demo@sanatangyan.app',
  setAccountKey: () => undefined,
  status: null,
  setStatus: () => undefined,
  isSubscribed: false,
  loading: true,
  refreshStatus: async () => null,
});

export function SubscriptionProvider({children}: {children: React.ReactNode}) {
  const [accountKey, setAccountKey] = useState('demo@sanatangyan.app');
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStatus = useCallback(
    async (keyOverride?: string): Promise<SubscriptionStatus | null> => {
      const key = (keyOverride ?? accountKey).trim() || 'demo@sanatangyan.app';
      await AsyncStorage.setItem(ACCOUNT_STORAGE_KEY, key).catch(() => undefined);
      setLoading(true);
      try {
        const res = await api.getSubscriptionStatus(key);
        setStatus(res);
        return res;
      } catch {
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accountKey],
  );

  useEffect(() => {
    AsyncStorage.getItem(ACCOUNT_STORAGE_KEY)
      .then(saved => {
        const key = saved?.trim() || 'demo@sanatangyan.app';
        setAccountKey(key);
        return refreshStatus(key);
      })
      .catch(() => refreshStatus('demo@sanatangyan.app'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        accountKey,
        setAccountKey,
        status,
        setStatus,
        isSubscribed: status?.active === true,
        loading,
        refreshStatus,
      }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function useRequireSubscription(
  featureLabel: string,
  options?: {isTab?: boolean},
) {
  const {isSubscribed, loading} = useSubscription();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      if (!loading && !isSubscribed) {
        if (options?.isTab) {
          navigation.navigate('Subscription', {lockedFeature: featureLabel});
        } else {
          navigation.replace('Subscription', {lockedFeature: featureLabel});
        }
      }
    }, [loading, isSubscribed, navigation, featureLabel, options?.isTab]),
  );

  return {isSubscribed, loading};
}
