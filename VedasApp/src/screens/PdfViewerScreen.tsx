import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {
  Linking,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import type {WebView as WebViewType} from 'react-native-webview';
import {ErrorBanner} from '../components/ErrorBanner';
import {StackScreenHeader} from '../components/ui/ScreenHeader';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, spacing} from '../theme/colors';

function PdfHeaderActions({
  onOpen,
  onShare,
}: {
  onOpen: () => void;
  onShare: () => void;
}) {
  return (
    <View style={styles.headerActions}>
      <Pressable
        style={({pressed}) => [styles.headerBtn, pressed && styles.pressed]}
        onPress={onShare}
        accessibilityLabel="Share PDF">
        <Text style={styles.headerBtnText}>Share</Text>
      </Pressable>
      <Pressable
        style={({pressed}) => [styles.headerBtn, styles.headerBtnPrimary, pressed && styles.pressed]}
        onPress={onOpen}
        accessibilityLabel="Open PDF in browser">
        <Text style={[styles.headerBtnText, styles.headerBtnTextPrimary]}>Open</Text>
      </Pressable>
    </View>
  );
}

export function PdfViewerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PdfViewer'>>();
  const webRef = useRef<WebViewType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useGoogleViewer, setUseGoogleViewer] = useState(Platform.OS === 'android');

  const pdfUrl = route.params.url;

  const viewerUrl = useMemo(() => {
    if (useGoogleViewer) {
      return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
    }
    return pdfUrl;
  }, [pdfUrl, useGoogleViewer]);

  const openExternal = useCallback(async () => {
    try {
      await Linking.openURL(pdfUrl);
    } catch {
      setError('Could not open PDF in browser');
    }
  }, [pdfUrl]);

  const sharePdf = useCallback(async () => {
    try {
      await Share.share({
        message: `${route.params.title}\n${pdfUrl}`,
        url: pdfUrl,
        title: route.params.title,
      });
    } catch {
      setError('Could not share PDF');
    }
  }, [pdfUrl, route.params.title]);

  const reloadViewer = useCallback(() => {
    setLoading(true);
    setError(null);
    webRef.current?.reload();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <StackScreenHeader
          title={route.params.title}
          subtitle="Gita Press · sacred text PDF"
          rightNode={<PdfHeaderActions onOpen={openExternal} onShare={sharePdf} />}
        />
      ),
    });
  }, [navigation, openExternal, route.params.title, sharePdf]);

  const handleViewerError = () => {
    if (!useGoogleViewer && Platform.OS === 'ios') {
      setUseGoogleViewer(true);
      setLoading(true);
      setError(null);
      return;
    }
    setLoading(false);
    setError('Failed to load PDF. Tap Open to view in browser.');
  };

  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} onRetry={() => setError(null)} />}

      <View style={styles.actionStrip}>
        <Pressable style={({pressed}) => [styles.stripBtn, pressed && styles.pressed]} onPress={reloadViewer}>
          <Text style={styles.stripBtnText}>↻ Reload</Text>
        </Pressable>
        <Pressable style={({pressed}) => [styles.stripBtn, pressed && styles.pressed]} onPress={openExternal}>
          <Text style={styles.stripBtnText}>🌐 Browser</Text>
        </Pressable>
        <View style={styles.stripHint}>
          <Text style={styles.stripHintText}>Pinch to zoom · scroll to read</Text>
        </View>
      </View>

      {loading && (
        <View style={styles.loaderOverlay}>
          <Text style={styles.loaderIcon}>📄</Text>
          <Text style={styles.loaderText}>Loading sacred text…</Text>
        </View>
      )}

      <WebView
        ref={webRef}
        source={{uri: viewerUrl}}
        onLoadEnd={() => setLoading(false)}
        onError={handleViewerError}
        onHttpError={handleViewerError}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        setBuiltInZoomControls={Platform.OS === 'android'}
        setDisplayZoomControls={false}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  headerActions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  headerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    backgroundColor: colors.tabActive,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerBtnPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  headerBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  headerBtnTextPrimary: {
    color: colors.white,
  },
  actionStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  stripBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stripBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  stripHint: {
    flex: 1,
    alignItems: 'flex-end',
  },
  stripHintText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFill,
    top: 52,
    backgroundColor: 'rgba(250, 246, 240, 0.92)',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  loaderText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 14,
  },
  webview: {flex: 1, backgroundColor: colors.background},
  pressed: {opacity: 0.88},
});
