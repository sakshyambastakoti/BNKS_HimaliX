/**
 * ActionButton — Large, gradient-filled action buttons with press animation
 * Used for Send/Receive and other primary actions.
 */

import React from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight } from '@/constants/theme';

interface ActionButtonProps {
  title: string;
  icon: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'large' | 'medium' | 'small';
}

export function ActionButton({
  title,
  icon,
  onPress,
  variant = 'primary',
  size = 'large',
}: ActionButtonProps) {
  const theme = useTheme();

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  const bgColor = isPrimary
    ? theme.primary
    : isSecondary
      ? theme.cardElevated
      : 'transparent';

  const textColor = isPrimary
    ? '#0A0A0F'
    : isSecondary
      ? theme.text
      : theme.primary;

  const borderColor = isOutline ? theme.primary : 'transparent';

  const sizeStyles = {
    large: { paddingVertical: Spacing.three + 4, paddingHorizontal: Spacing.four },
    medium: { paddingVertical: Spacing.three, paddingHorizontal: Spacing.four },
    small: { paddingVertical: Spacing.two + 2, paddingHorizontal: Spacing.three },
  };

  const iconSizeStyles = {
    large: FontSize.xxl,
    medium: FontSize.xl,
    small: FontSize.lg,
  };

  const textSizeStyles = {
    large: FontSize.lg,
    medium: FontSize.md,
    small: FontSize.sm,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        sizeStyles[size],
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: isOutline ? 1.5 : 0,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          ...Platform.select({
            ios: {
              shadowColor: isPrimary ? theme.primary : '#000',
              shadowOffset: { width: 0, height: isPrimary ? 4 : 2 },
              shadowOpacity: isPrimary ? 0.35 : 0.1,
              shadowRadius: isPrimary ? 12 : 4,
            },
            android: {
              elevation: isPrimary ? 8 : 3,
            },
          }),
        },
      ]}
    >
      <View style={styles.content}>
        <ThemedText style={[styles.icon, { fontSize: iconSizeStyles[size], color: textColor }]}>
          {icon}
        </ThemedText>
        <ThemedText
          style={[
            styles.title,
            {
              fontSize: textSizeStyles[size],
              color: textColor,
            },
          ]}
        >
          {title}
        </ThemedText>
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
  },
  content: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  icon: {
    textAlign: 'center',
  },
  title: {
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});
