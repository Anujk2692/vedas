export const colors = {
  primary: '#C45C00',
  primaryDark: '#7A3200',
  primaryLight: '#E8922A',
  secondary: '#D4A017',
  gold: '#B8860B',
  background: '#FAF6F0',
  backgroundAlt: '#F3EBE0',
  surface: '#FFFFFF',
  surfaceElevated: '#FFF9F3',
  surfaceMuted: '#F5EDE4',
  text: '#2C1810',
  textSecondary: '#5C4033',
  textMuted: '#9A7B6A',
  border: 'rgba(196, 92, 0, 0.14)',
  borderLight: 'rgba(196, 92, 0, 0.08)',
  accent: '#A84300',
  success: '#2E7D32',
  error: '#B71C1C',
  errorLight: '#FFF5F5',
  headerDark: '#0D0806',
  overlay: 'rgba(44, 24, 16, 0.55)',
  cardShadow: 'rgba(122, 50, 0, 0.18)',
  gradientStart: '#8B3A00',
  gradientMid: '#C45C00',
  gradientEnd: '#E8922A',
  playerBackground: '#1A0F0A',
  playerText: '#FFF8F0',
  tabActive: '#FFF3E6',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const typography = {
  hero: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  h1: {
    fontSize: 24,
    fontWeight: '800' as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 20,
  },
  caption: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  sanskrit: {
    fontFamily: 'NotoSansDevanagari-Regular',
    fontSize: 22,
    fontWeight: '400' as const,
    lineHeight: 36,
    letterSpacing: 0.3,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#2C1810',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#7A3200',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  lg: {
    shadowColor: '#7A3200',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
};
