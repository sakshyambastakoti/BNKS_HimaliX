/**
 * OffPay Official Brand Logo Component
 * High-definition rendering of the emerald-lime geometric loop logo and brand mark.
 * Supports size variants, layout modes, glowing ambient backlight, and pulse animations.
 */

import React from 'react';
import { View, StyleSheet, Image, useColorScheme, type ViewStyle, type StyleProp } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
export type LogoVariant = 'mark' | 'horizontal' | 'stacked';

interface OffPayLogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  glow?: boolean;
  glowColor?: string;
  style?: StyleProp<ViewStyle>;
  showTagline?: boolean;
}

const SIZES: Record<LogoSize, { markSize: number; textOffSize: number; textPaySize: number; gap: number }> = {
  xs: { markSize: 22, textOffSize: 16, textPaySize: 16, gap: 6 },
  sm: { markSize: 30, textOffSize: 20, textPaySize: 20, gap: 8 },
  md: { markSize: 40, textOffSize: 26, textPaySize: 26, gap: 10 },
  lg: { markSize: 52, textOffSize: 34, textPaySize: 34, gap: 12 },
  xl: { markSize: 68, textOffSize: 42, textPaySize: 42, gap: 14 },
  hero: { markSize: 88, textOffSize: 52, textPaySize: 52, gap: 16 },
};

export function OffPayLogo({
  size = 'md',
  variant = 'horizontal',
  glow = false,
  glowColor,
  style,
  showTagline = false,
}: OffPayLogoProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light';
  const theme = isDark ? Colors.dark : Colors.light;

  const { markSize, textOffSize, textPaySize, gap } = SIZES[size];
  const effectiveGlow = glowColor ?? theme.primary;

  return (
    <View
      style={[
        styles.wrapper,
        variant === 'stacked' && styles.stackedWrapper,
        style,
      ]}
    >
      {/* Mark Container with optional ambient backlight */}
      <View style={[styles.markContainer, { width: markSize, height: markSize }]}>
        {glow && (
          <View
            style={[
              styles.glowBackdrop,
              {
                width: markSize * 1.6,
                height: markSize * 1.6,
                backgroundColor: effectiveGlow,
                borderRadius: markSize,
                opacity: isDark ? 0.35 : 0.25,
              },
            ]}
          />
        )}
        <Image
          source={require('@/../assets/images/offpay-mark.png')}
          style={{ width: markSize, height: markSize }}
          resizeMode="contain"
        />
      </View>

      {/* Brand Text */}
      {variant !== 'mark' && (
        <View
          style={[
            variant === 'horizontal' ? styles.horizontalTextGroup : styles.stackedTextGroup,
            { marginLeft: variant === 'horizontal' ? gap : 0, marginTop: variant === 'stacked' ? gap : 0 },
          ]}
        >
          <View style={styles.textRow}>
            <ThemedText
              style={[
                styles.textOff,
                {
                  fontSize: textOffSize,
                  color: isDark ? '#FFFFFF' : '#0F172A',
                },
              ]}
            >
              Off
            </ThemedText>
            <ThemedText
              style={[
                styles.textPay,
                {
                  fontSize: textPaySize,
                  color: theme.primary,
                },
              ]}
            >
              Pay
            </ThemedText>
          </View>

          {showTagline && (
            <ThemedText
              style={[
                styles.tagline,
                {
                  color: theme.textMuted,
                  fontSize: Math.max(10, Math.floor(textOffSize * 0.36)),
                },
              ]}
            >
              OFFLINE-FIRST PAYMENTS
            </ThemedText>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowBackdrop: {
    position: 'absolute',
    transform: [{ scale: 1.1 }],
  },
  horizontalTextGroup: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  stackedTextGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  textOff: {
    fontWeight: FontWeight.black,
    letterSpacing: -0.8,
  },
  textPay: {
    fontWeight: FontWeight.black,
    letterSpacing: -0.8,
    marginLeft: 1,
  },
  tagline: {
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
    marginTop: 2,
  },
});
