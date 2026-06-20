import {Platform} from 'react-native';

/** Bundled Noto Sans Devanagari — linked via react-native.config.js */
export const fonts = {
  sanskrit: 'NotoSansDevanagari-Regular',
  sanskritBold: 'NotoSansDevanagari-Bold',
  /** System fallbacks if custom font fails to load */
  sanskritFallback: Platform.select({
    ios: 'Kohinoor Devanagari',
    android: 'sans-serif',
    default: undefined,
  }),
};

export function sanskritFontFamily(bold = false): string {
  return bold ? fonts.sanskritBold : fonts.sanskrit;
}
