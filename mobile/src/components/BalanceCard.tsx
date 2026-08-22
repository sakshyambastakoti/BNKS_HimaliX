/**
 * BalanceCard — Glassmorphic card showing Total / Online / Offline balances
 * Features gradient border, animated balance display, and split balance view.
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { formatNPR } from '@/constants/mock-data';

interface BalanceCardProps {
  totalBalance: number;
  onlineBalance: number;
  offlineBalance: number;
}

export function BalanceCard({ totalBalance, onlineBalance, offlineBalance }: BalanceCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          ...Platform.select({
            ios: {
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      ]}
    >
      {/* Gradient accent bar */}
      <View style={[styles.accentBar, { backgroundColor: theme.primary }]} />

      <View style={styles.content}>
        {/* Total balance */}
        <View style={styles.totalSection}>
          <ThemedText
            style={[styles.label, { color: theme.textSecondary }]}
          >
            Total Balance
          </ThemedText>
          <ThemedText
            style={[styles.totalAmount, { color: theme.text }]}
          >
            {formatNPR(totalBalance)}
          </ThemedText>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Split balances */}
        <View style={styles.splitSection}>
          <View style={styles.balanceColumn}>
            <View style={styles.balanceLabelRow}>
              <View style={[styles.dot, { backgroundColor: theme.primary }]} />
              <ThemedText
                style={[styles.splitLabel, { color: theme.textSecondary }]}
              >
                Online
              </ThemedText>
            </View>
            <ThemedText
              style={[styles.splitAmount, { color: theme.text }]}
            >
              {formatNPR(onlineBalance)}
            </ThemedText>
          </View>

          <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />

          <View style={styles.balanceColumn}>
            <View style={styles.balanceLabelRow}>
              <View style={[styles.dot, { backgroundColor: theme.accent }]} />
              <ThemedText
                style={[styles.splitLabel, { color: theme.textSecondary }]}
              >
                Offline
              </ThemedText>
            </View>
            <ThemedText
              style={[styles.splitAmount, { color: theme.text }]}
            >
              {formatNPR(offlineBalance)}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: Spacing.four,
  },
  totalSection: {
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.two,
  },
  totalAmount: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: Spacing.three,
  },
  splitSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceColumn: {
    flex: 1,
    alignItems: 'center',
  },
  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  splitLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  splitAmount: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  verticalDivider: {
    width: 1,
    height: 40,
  },
});
