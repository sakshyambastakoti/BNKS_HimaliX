/**
 * OffPay Mobile Banking Design System
 * Clean, modern banking aesthetic inspired by contemporary mobile banking apps.
 * Palette: Soft light canvas (#F4F7FB), pure white elevated cards (#FFFFFF),
 * deep emerald primary (#00A859 / #0F4A3C), coral red highlights (#FF5B5B), and slate typography.
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A2533',
    textSecondary: '#7C8BA0',
    textMuted: '#9AA8BC',
    textSubtle: '#CBD5E1',
    background: '#F4F7FB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E6F6EE',
    card: '#FFFFFF',
    cardElevated: '#F9FAFC',
    cardGlass: '#FFFFFF',
    cardBorderGlow: 'rgba(0, 168, 89, 0.15)',
    border: '#E8EEF4',
    borderLight: '#F0F4F8',
    borderStrong: '#CBD5E1',
    primary: '#00A859',
    primaryLight: '#4ADE80',
    primaryDark: '#0F4A3C',
    primaryGlow: 'rgba(0, 168, 89, 0.12)',
    accent: '#00C853',
    accentLight: '#69F0AE',
    accentGlow: 'rgba(0, 200, 83, 0.15)',
    cyan: '#0284C7',
    cyanGlow: 'rgba(2, 132, 199, 0.12)',
    coral: '#FF5B5B',
    coralGlow: 'rgba(255, 91, 91, 0.15)',
    gradientStart: '#0F4A3C',
    gradientEnd: '#00A859',
    success: '#00A859',
    successBg: '#E6F6EE',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    error: '#FF5B5B',
    errorBg: '#FEE2E2',
    info: '#0284C7',
    infoBg: '#E0F2FE',
    security: '#6366F1',
    securityBg: '#EEF2FF',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E8EEF4',
    tabBarActive: '#00A859',
    tabBarInactive: '#9AA8BC',
    statusOnline: '#00A859',
    statusOffline: '#FF5B5B',
    statusWifi: '#F59E0B',
    statusMesh: '#0284C7',
    overlay: 'rgba(26, 37, 51, 0.5)',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textSubtle: '#334155',
    background: '#0B0F17',
    backgroundElement: '#131926',
    backgroundSelected: 'rgba(0, 230, 118, 0.12)',
    card: '#131926',
    cardElevated: '#1A2234',
    cardGlass: '#131926',
    cardBorderGlow: 'rgba(0, 230, 118, 0.25)',
    border: '#1E293B',
    borderLight: '#242F46',
    borderStrong: '#334155',
    primary: '#00E676',
    primaryLight: '#69F0AE',
    primaryDark: '#00C853',
    primaryGlow: 'rgba(0, 230, 118, 0.20)',
    accent: '#76FF03',
    accentLight: '#B2FF59',
    accentGlow: 'rgba(118, 255, 3, 0.20)',
    cyan: '#00E5FF',
    cyanGlow: 'rgba(0, 229, 255, 0.2)',
    coral: '#FF5B5B',
    coralGlow: 'rgba(255, 91, 91, 0.20)',
    gradientStart: '#00E676',
    gradientEnd: '#76FF03',
    success: '#00E676',
    successBg: 'rgba(0, 230, 118, 0.12)',
    warning: '#FFB300',
    warningBg: 'rgba(255, 179, 0, 0.12)',
    error: '#FF5B5B',
    errorBg: 'rgba(255, 91, 91, 0.14)',
    info: '#38BDF8',
    infoBg: 'rgba(56, 189, 248, 0.12)',
    security: '#A78BFA',
    securityBg: 'rgba(167, 139, 250, 0.14)',
    tabBar: '#0E131F',
    tabBarBorder: '#1A2234',
    tabBarActive: '#00E676',
    tabBarInactive: '#64748B',
    statusOnline: '#00E676',
    statusOffline: '#FF5B5B',
    statusWifi: '#FFB300',
    statusMesh: '#00E5FF',
    overlay: 'rgba(11, 15, 23, 0.85)',
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
  four: 20,
  five: 28,
  six: 40,
  seven: 56,
} as const;

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
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
  xxl: 26,
  xxxl: 32,
  display: 40,
  hero: 48,
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
      shadowColor: '#1A2533',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#1A2533',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 14,
    },
    android: { elevation: 3 },
    default: {},
  }),
  serviceTile: Platform.select({
    ios: {
      shadowColor: '#1A2533',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    android: { elevation: 2 },
    default: {},
  }),
  glowGreen: Platform.select({
    ios: {
      shadowColor: '#00A859',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 14,
    },
    android: { elevation: 6 },
    default: {},
  }),
  glowAccent: Platform.select({
    ios: {
      shadowColor: '#00C853',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
