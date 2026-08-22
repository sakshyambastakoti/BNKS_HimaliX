/**
 * OffPay Design System & Visual Tokens
 * Neo-banking aesthetic tailored for offline-first peer-to-peer crypto transactions.
 * Brand Colors: Neon Emerald (#00E676) + Electric Lime (#76FF03) + Obsidian Dark (#080B10)
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textSubtle: '#CBD5E1',
    background: '#F8FAFC',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8F5E9',
    card: '#FFFFFF',
    cardElevated: '#F1F5F9',
    cardGlass: 'rgba(255, 255, 255, 0.85)',
    cardBorderGlow: 'rgba(0, 200, 83, 0.25)',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderStrong: '#CBD5E1',
    primary: '#00C853',
    primaryLight: '#69F0AE',
    primaryDark: '#00A844',
    primaryGlow: 'rgba(0, 200, 83, 0.20)',
    accent: '#76FF03',
    accentLight: '#B2FF59',
    accentGlow: 'rgba(118, 255, 3, 0.20)',
    cyan: '#00B0FF',
    cyanGlow: 'rgba(0, 176, 255, 0.15)',
    gradientStart: '#00C853',
    gradientEnd: '#76FF03',
    success: '#00C853',
    successBg: '#E8F5E9',
    warning: '#FF9800',
    warningBg: '#FFF3E0',
    error: '#EF4444',
    errorBg: '#FEE2E2',
    info: '#3B82F6',
    infoBg: '#EFF6FF',
    security: '#7C4DFF',
    securityBg: '#EDE7F6',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabBarActive: '#00C853',
    tabBarInactive: '#94A3B8',
    statusOnline: '#00C853',
    statusOffline: '#EF4444',
    statusWifi: '#FF9800',
    statusMesh: '#00B0FF',
    overlay: 'rgba(15, 23, 42, 0.6)',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textSubtle: '#334155',
    background: '#07090E',
    backgroundElement: '#0F1420',
    backgroundSelected: 'rgba(0, 230, 118, 0.12)',
    card: '#0F1420',
    cardElevated: '#151C2C',
    cardGlass: 'rgba(15, 20, 32, 0.78)',
    cardBorderGlow: 'rgba(0, 230, 118, 0.3)',
    border: '#1A2234',
    borderLight: '#242F46',
    borderStrong: '#334155',
    primary: '#00E676',
    primaryLight: '#69F0AE',
    primaryDark: '#00C853',
    primaryGlow: 'rgba(0, 230, 118, 0.22)',
    accent: '#76FF03',
    accentLight: '#B2FF59',
    accentGlow: 'rgba(118, 255, 3, 0.22)',
    cyan: '#00E5FF',
    cyanGlow: 'rgba(0, 229, 255, 0.2)',
    gradientStart: '#00E676',
    gradientEnd: '#76FF03',
    success: '#00E676',
    successBg: 'rgba(0, 230, 118, 0.12)',
    warning: '#FFB300',
    warningBg: 'rgba(255, 179, 0, 0.12)',
    error: '#FF4757',
    errorBg: 'rgba(255, 71, 87, 0.12)',
    info: '#38BDF8',
    infoBg: 'rgba(56, 189, 248, 0.12)',
    security: '#A78BFA',
    securityBg: 'rgba(167, 139, 250, 0.14)',
    tabBar: '#0A0E17',
    tabBarBorder: '#161D2B',
    tabBarActive: '#00E676',
    tabBarInactive: '#64748B',
    statusOnline: '#00E676',
    statusOffline: '#FF4757',
    statusWifi: '#FFB300',
    statusMesh: '#00E5FF',
    overlay: 'rgba(7, 9, 14, 0.85)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, serif',
    rounded: 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif',
    mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export const FontSize = {
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  display: 44,
  hero: 56,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const Shadows = {
  subtle: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    android: { elevation: 2 },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  glowGreen: Platform.select({
    ios: {
      shadowColor: '#00E676',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
    default: {},
  }),
  glowAccent: Platform.select({
    ios: {
      shadowColor: '#76FF03',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 14,
    },
    android: { elevation: 6 },
    default: {},
  }),
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
