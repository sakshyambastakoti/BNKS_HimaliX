/**
 * TransactionItem — Matching the Reference Design Transaction Row
 * Displays circular merchant badge, description, timestamp, and bold color-coded amount.
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

const merchantColors: Record<string, { bg: string; text: string; icon: string }> = {
  sent: { bg: '#FEE2E2', text: '#FF5B5B', icon: '🛒' },
  received: { bg: '#E6F6EE', text: '#00A859', icon: '💰' },
  topup: { bg: '#E0F2FE', text: '#0284C7', icon: '🏦' },
  bond_load: { bg: '#FEF3C7', text: '#D97706', icon: '⚡' },
  bond_reverse: { bg: '#FCE7F3', text: '#DB2777', icon: '↩' },
  sync: { bg: '#E6F6EE', text: '#00A859', icon: '✓' },
};

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const theme = useTheme();
  const isReceived = transaction.type === 'received' || transaction.type === 'topup' || transaction.type === 'bond_reverse';
  const badgeInfo = merchantColors[transaction.type] ?? merchantColors.sent;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? theme.cardElevated : theme.card,
        },
      ]}
    >
      {/* Circular Merchant Badge (Matching Reference) */}
      <View style={[styles.merchantBadge, { backgroundColor: badgeInfo.bg }]}>
        <ThemedText style={styles.merchantIcon}>{badgeInfo.icon}</ThemedText>
      </View>

      {/* Center Details */}
      <View style={styles.details}>
        <ThemedText style={[styles.counterparty, { color: theme.text }]} numberOfLines={1}>
          {transaction.counterparty}
        </ThemedText>
        <View style={styles.subRow}>
          <ThemedText style={[styles.time, { color: theme.textSecondary }]}>
            Today {formatTime(transaction.timestamp)}
          </ThemedText>
          {transaction.isOffline && (
            <View style={[styles.offlineTag, { backgroundColor: '#FEF3C7' }]}>
              <ThemedText style={styles.offlineTagText}>Offline</ThemedText>
            </View>
          )}
        </View>
      </View>

      {/* Right Amount */}
      <ThemedText
        style={[
          styles.amount,
          { color: isReceived ? '#00A859' : '#FF5B5B' },
        ]}
      >
        {isReceived ? '+' : '-'}{formatNPR(transaction.amount)}
      </ThemedText>
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
  },
  merchantBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantIcon: {
    fontSize: FontSize.lg,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  counterparty: {
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.bold,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  time: {
    fontSize: FontSize.xxs,
  },
  offlineTag: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  offlineTagText: {
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
    color: '#D97706',
  },
  amount: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.extrabold,
  },
});
