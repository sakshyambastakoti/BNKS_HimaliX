/**
 * ActionButton — High-impact Action Button
 * Provides primary neon-gradient fill, glass secondary, and outline styling with tactile micro-interactions.
 */

import React from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight, Shadows } from '@/constants/theme';

interface ActionButtonProps {
  title: string;
  icon: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'large' | 'medium' | 'small';
  badge?: string;
}

export function ActionButton({
  title,
  icon,
  onPress,
  variant = 'primary',
  size = 'large',
  badge,
}: ActionButtonProps) {
  const theme = useTheme();

  const isPrimary = variant === 'primary';
  const isAccent = variant === 'accent';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  let backgroundColor: string = theme.primary;
  let textColor: string = '#07090E';
  let borderColor: string = 'transparent';

  if (isAccent) {
    backgroundColor = theme.accent;
    textColor = '#07090E';
  } else if (isSecondary) {
    backgroundColor = theme.cardElevated;
    textColor = theme.text;
    borderColor = theme.border;
  } else if (isOutline) {
    backgroundColor = 'transparent';
    textColor = theme.primary;
    borderColor = theme.primary;
  }

  const sizeStyles = {
    large: { paddingVertical: Spacing.four, paddingHorizontal: Spacing.four },
    medium: { paddingVertical: Spacing.three, paddingHorizontal: Spacing.four },
    small: { paddingVertical: Spacing.two + 2, paddingHorizontal: Spacing.three },
  };

  const iconSizes = {
    large: FontSize.xxl,
    medium: FontSize.xl,
    small: FontSize.md,
  };

  const textSizes = {
    large: FontSize.md,
    medium: FontSize.sm,
    small: FontSize.xs,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        sizeStyles[size],
        {
          backgroundColor,
          borderColor,
          borderWidth: isOutline || isSecondary ? 1 : 0,
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          ...(isPrimary ? Shadows.glowGreen : isAccent ? Shadows.glowAccent : Shadows.card),
        },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconBubble,
            {
              backgroundColor: isPrimary || isAccent ? 'rgba(7, 9, 14, 0.12)' : theme.primaryGlow,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.icon,
              {
                fontSize: iconSizes[size],
                color: isPrimary || isAccent ? '#07090E' : theme.primary,
              },
            ]}
          >
            {icon}
          </ThemedText>
        </View>

        <ThemedText
          style={[
            styles.title,
            {
              fontSize: textSizes[size],
              color: textColor,
            },
          ]}
        >
          {title}
        </ThemedText>

        {badge && (
          <View style={[styles.badge, { backgroundColor: theme.error }]}>
            <ThemedText style={styles.badgeText}>{badge}</ThemedText>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    flexDirection: 'column',
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontWeight: FontWeight.bold,
  },
  title: {
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
});
