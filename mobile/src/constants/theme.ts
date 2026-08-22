/**
 * OffPay Design System
 * Dark theme with green gradient branding matching the OffPay logo.
 * Color palette: Deep blacks → vibrant greens (#00C853 → #76FF03)
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#F8FAFC',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8F5E9',
    card: '#FFFFFF',
    cardElevated: '#F1F5F9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    primary: '#00C853',
    primaryLight: '#69F0AE',
    primaryDark: '#00A844',
    accent: '#76FF03',
    gradientStart: '#00C853',
    gradientEnd: '#76FF03',
    success: '#00C853',
    warning: '#FFB300',
    error: '#FF5252',
    info: '#448AFF',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabBarActive: '#00C853',
    tabBarInactive: '#9CA3AF',
    statusOnline: '#00C853',
    statusOffline: '#FF5252',
    statusWifi: '#FFB300',
    overlay: 'rgba(0,0,0,0.5)',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    background: '#0A0A0F',
    backgroundElement: '#141420',
    backgroundSelected: '#1A2E1A',
    card: '#16162A',
    cardElevated: '#1E1E36',
    border: '#1E293B',
    borderLight: '#1E1E36',
    primary: '#00E676',
    primaryLight: '#69F0AE',
    primaryDark: '#00C853',
    accent: '#76FF03',
    gradientStart: '#00C853',
    gradientEnd: '#76FF03',
    success: '#00E676',
    warning: '#FFD54F',
    error: '#FF5252',
    info: '#448AFF',
    tabBar: '#0F0F1A',
    tabBarBorder: '#1E293B',
    tabBarActive: '#00E676',
    tabBarInactive: '#64748B',
    statusOnline: '#00E676',
    statusOffline: '#FF5252',
    statusWifi: '#FFD54F',
    overlay: 'rgba(0,0,0,0.7)',
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
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 28,
  xxxl: 36,
  display: 48,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
