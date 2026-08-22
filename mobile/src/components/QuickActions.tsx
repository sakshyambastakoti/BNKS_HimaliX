/**
 * QuickActions — Futuristic action tiles grid
 * Top Up, Load Bond, Sync, Reverse Bond, Scan QR
 */

import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight, Shadows } from '@/constants/theme';

export interface QuickActionItem {
  id: string;
  icon: string;
  label: string;
  badge?: string;
  onPress: () => void;
  color?: string;
}

interface QuickActionsProps {
  actions: QuickActionItem[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {actions.map((action) => {
        const itemColor = action.color ?? theme.primary;
        return (
          <Pressable
            key={action.id}
            onPress={action.onPress}
            style={({ pressed }) => [
              styles.actionItem,
              {
                backgroundColor: pressed ? theme.backgroundSelected : theme.cardGlass,
                borderColor: theme.border,
                opacity: pressed ? 0.82 : 1,
                transform: [{ scale: pressed ? 0.94 : 1 }],
                ...Shadows.subtle,
              },
            ]}
          >
            {/* Top icon bubble */}
            <View style={[styles.iconContainer, { backgroundColor: itemColor + '18' }]}>
              <ThemedText style={[styles.icon, { color: itemColor }]}>
                {action.icon}
              </ThemedText>
            </View>

            {/* Label */}
            <ThemedText style={[styles.label, { color: theme.text }]} numberOfLines={1}>
              {action.label}
            </ThemedText>

            {/* Micro Badge */}
            {action.badge && (
              <View style={[styles.badge, { backgroundColor: itemColor }]}>
                <ThemedText style={styles.badgeText}>{action.badge}</ThemedText>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.one + 2,
    position: 'relative',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: '#07090E',
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
  },
});
