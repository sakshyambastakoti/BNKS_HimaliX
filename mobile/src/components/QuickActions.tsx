/**
 * QuickActions — Grid of quick action buttons
 * Top Up, Load Bond, Sync, Reverse Bond
 */

import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight } from '@/constants/theme';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
  requiresOnline?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          onPress={action.onPress}
          style={({ pressed }) => [
            styles.actionItem,
            {
              backgroundColor: pressed ? theme.backgroundSelected : theme.cardElevated,
              borderColor: theme.border,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 2,
                },
              }),
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
            <ThemedText style={[styles.icon, { color: theme.primary }]}>
              {action.icon}
            </ThemedText>
          </View>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1}>
            {action.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.two + 2,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: FontSize.xl,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
});
