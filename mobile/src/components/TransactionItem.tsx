/**
 * TransactionItem — Individual transaction row for history lists
 * Shows type icon, counterparty, time, amount, status, and offline badge.
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { type MockTransaction, formatNPR, formatTime } from '@/constants/mock-data';

interface TransactionItemProps {
  transaction: MockTransaction;
  onPress?: () => void;
}

const typeConfig = {
  sent: { icon: '↗', color: 'error' as const, prefix: '-' },
  received: { icon: '↙', color: 'success' as const, prefix: '+' },
  topup: { icon: '⊕', color: 'info' as const, prefix: '+' },
  bond_load: { icon: '⬡', color: 'warning' as const, prefix: '-' },
  bond_reverse: { icon: '↩', color: 'info' as const, prefix: '+' },
  sync: { icon: '⟳', color: 'success' as const, prefix: '' },
};

const statusConfig = {
  completed: { label: '✓', color: 'success' as const },
  pending: { label: '⏳', color: 'warning' as const },
  failed: { label: '✗', color: 'error' as const },
  synced: { label: '☁ synced', color: 'info' as const },
};

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const theme = useTheme();
  const type = typeConfig[transaction.type];
  const status = statusConfig[transaction.status];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? theme.backgroundSelected : 'transparent',
        },
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme[type.color] + '18' },
        ]}
      >
        <ThemedText style={[styles.icon, { color: theme[type.color] }]}>
          {type.icon}
        </ThemedText>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.topRow}>
          <ThemedText style={[styles.counterparty, { color: theme.text }]} numberOfLines={1}>
            {transaction.counterparty}
          </ThemedText>
          <ThemedText
            style={[
              styles.amount,
              { color: theme[type.color] },
            ]}
          >
            {type.prefix}{formatNPR(transaction.amount)}
          </ThemedText>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.metaRow}>
            <ThemedText style={[styles.time, { color: theme.textMuted }]}>
              {formatTime(transaction.timestamp)}
            </ThemedText>
            {transaction.isOffline && (
              <View style={[styles.offlineBadge, { backgroundColor: theme.accent + '20', borderColor: theme.accent + '40' }]}>
                <ThemedText style={[styles.offlineText, { color: theme.accent }]}>
                  OFFLINE
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText style={[styles.status, { color: theme[status.color] }]}>
            {status.label}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    borderRadius: BorderRadius.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  details: {
    flex: 1,
    gap: Spacing.one,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterparty: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    flex: 1,
    marginRight: Spacing.two,
  },
  amount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  time: {
    fontSize: FontSize.xs,
  },
  offlineBadge: {
    paddingHorizontal: Spacing.one + 2,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  offlineText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  status: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
