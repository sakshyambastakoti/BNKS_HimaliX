/**
 * TransactionItem — High-fidelity Ledger Transaction Row
 * Displays counterparty, cryptographic offline badges, time, formatted amount, and status pill.
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
  sent: { icon: '↗', colorKey: 'error' as const, prefix: '-', label: 'Sent' },
  received: { icon: '↙', colorKey: 'success' as const, prefix: '+', label: 'Received' },
  topup: { icon: '⊕', colorKey: 'info' as const, prefix: '+', label: 'Top Up' },
  bond_load: { icon: '⬡', colorKey: 'warning' as const, prefix: '⚡', label: 'Bond Mint' },
  bond_reverse: { icon: '↩', colorKey: 'cyan' as const, prefix: '↩', label: 'Bond Release' },
  sync: { icon: '⟳', colorKey: 'success' as const, prefix: '✓', label: 'Synced' },
};

const statusConfig = {
  completed: { label: 'Settled', colorKey: 'success' as const },
  pending: { label: 'Pending Sync', colorKey: 'warning' as const },
  failed: { label: 'Failed', colorKey: 'error' as const },
  synced: { label: 'Validated', colorKey: 'info' as const },
};

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const theme = useTheme();
  const type = typeConfig[transaction.type] ?? typeConfig.sent;
  const status = statusConfig[transaction.status] ?? statusConfig.completed;

  const typeColor = theme[type.colorKey];
  const statusColor = theme[status.colorKey];

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
      {/* Icon Bubble */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: typeColor + '18',
            borderColor: typeColor + '30',
          },
        ]}
      >
        <ThemedText style={[styles.icon, { color: typeColor }]}>
          {type.icon}
        </ThemedText>
      </View>

      {/* Center Details */}
      <View style={styles.details}>
        <View style={styles.topRow}>
          <ThemedText style={[styles.counterparty, { color: theme.text }]} numberOfLines={1}>
            {transaction.counterparty}
          </ThemedText>
          <ThemedText
            style={[
              styles.amount,
              { color: transaction.type === 'received' ? theme.success : theme.text },
            ]}
          >
            {type.prefix}{formatNPR(transaction.amount)}
          </ThemedText>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.metaGroup}>
            <ThemedText style={[styles.time, { color: theme.textMuted }]}>
              {formatTime(transaction.timestamp)}
            </ThemedText>

            {transaction.isOffline && (
              <View style={[styles.offlineBadge, { backgroundColor: theme.accent + '20', borderColor: theme.accent + '50' }]}>
                <ThemedText style={[styles.offlineText, { color: theme.accent }]}>
                  OFFLINE BOND
                </ThemedText>
              </View>
            )}
          </View>

          <View style={[styles.statusPill, { backgroundColor: statusColor + '15' }]}>
            <ThemedText style={[styles.statusText, { color: statusColor }]}>
              {status.label}
            </ThemedText>
          </View>
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
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  icon: {
    fontSize: FontSize.lg,
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
    fontWeight: FontWeight.bold,
    flex: 1,
    marginRight: Spacing.two,
  },
  amount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  time: {
    fontSize: FontSize.xs,
  },
  offlineBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  offlineText: {
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.bold,
  },
});
