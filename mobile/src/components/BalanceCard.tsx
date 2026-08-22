/**
 * BalanceCard — Ultra-premium Glassmorphic card
 * Shows Total / Online / Offline breakdown with progress ratio bar,
 * cryptographic security badge, and instant visual feedback.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight, Shadows } from '@/constants/theme';
import { formatNPR } from '@/constants/mock-data';

interface BalanceCardProps {
  totalBalance: number;
  onlineBalance: number;
  offlineBalance: number;
}

export function BalanceCard({ totalBalance, onlineBalance, offlineBalance }: BalanceCardProps) {
  const theme = useTheme();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const total = totalBalance > 0 ? totalBalance : 1;
  const onlinePercent = Math.round((onlineBalance / total) * 100);
  const offlinePercent = 100 - onlinePercent;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardGlass,
          borderColor: theme.borderLight,
          ...Shadows.card,
        },
      ]}
    >
      {/* Top Emerald Gradient Glow Line */}
      <View style={[styles.glowHeader, { backgroundColor: theme.primary }]} />

      <View style={styles.content}>
        {/* Total balance Section */}
        <View style={styles.topRow}>
          <View style={styles.labelGroup}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
              TOTAL ASSETS
            </ThemedText>
            <View style={[styles.vaultBadge, { backgroundColor: theme.primaryGlow }]}>
              <ThemedText style={[styles.vaultText, { color: theme.primary }]}>
                VAULT SECURED
              </ThemedText>
            </View>
          </View>

          <Pressable
            onPress={() => setIsBalanceHidden(!isBalanceHidden)}
            style={({ pressed }) => [
              styles.eyeButton,
              { backgroundColor: theme.cardElevated, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ThemedText style={[styles.eyeIcon, { color: theme.textSecondary }]}>
              {isBalanceHidden ? '👁‍🗨' : '👁'}
            </ThemedText>
          </Pressable>
        </View>

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <ThemedText style={[styles.currencyPrefix, { color: theme.primary }]}>
            NPR
          </ThemedText>
          <ThemedText style={[styles.totalAmount, { color: theme.text }]}>
            {isBalanceHidden ? '••••••' : formatNPR(totalBalance).replace('NPR ', '')}
          </ThemedText>
        </View>

        {/* Distribution Progress Bar */}
        <View style={[styles.ratioBarContainer, { backgroundColor: theme.backgroundElement }]}>
          <View
            style={[
              styles.ratioSegment,
              { width: `${Math.max(5, onlinePercent)}%`, backgroundColor: theme.primary },
            ]}
          />
          <View
            style={[
              styles.ratioSegment,
              { width: `${Math.max(5, offlinePercent)}%`, backgroundColor: theme.accent },
            ]}
          />
        </View>

        {/* Split Balances Grid */}
        <View style={styles.splitSection}>
          {/* Online Column */}
          <View style={[styles.splitCard, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
            <View style={styles.splitHeaderRow}>
              <View style={[styles.indicatorDot, { backgroundColor: theme.primary }]} />
              <ThemedText style={[styles.splitLabel, { color: theme.textSecondary }]}>
                Online Bank ({onlinePercent}%)
              </ThemedText>
            </View>
            <ThemedText style={[styles.splitAmount, { color: theme.text }]}>
              {isBalanceHidden ? '••••' : formatNPR(onlineBalance)}
            </ThemedText>
            <ThemedText style={[styles.splitSubtext, { color: theme.textMuted }]}>
              Instant settlement
            </ThemedText>
          </View>

          {/* Offline Column */}
          <View style={[styles.splitCard, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
            <View style={styles.splitHeaderRow}>
              <View style={[styles.indicatorDot, { backgroundColor: theme.accent }]} />
              <ThemedText style={[styles.splitLabel, { color: theme.textSecondary }]}>
                Offline Bonds ({offlinePercent}%)
              </ThemedText>
            </View>
            <ThemedText style={[styles.splitAmount, { color: theme.accent }]}>
              {isBalanceHidden ? '••••' : formatNPR(offlineBalance)}
            </ThemedText>
            <ThemedText style={[styles.splitSubtext, { color: theme.textMuted }]}>
              Zero-network ready
            </ThemedText>
          </View>
        </View>

        {/* Security Enclave Footer Note */}
        <View style={[styles.enclaveRow, { borderTopColor: theme.border }]}>
          <ThemedText style={[styles.enclaveIcon, { color: theme.security }]}>🔐</ThemedText>
          <ThemedText style={[styles.enclaveText, { color: theme.textMuted }]}>
            Protected by Ed25519 & Hardware Secure Enclave
          </ThemedText>
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
  glowHeader: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: Spacing.four,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
  },
  vaultBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  vaultText: {
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.8,
  },
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: FontSize.sm,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one + 2,
    marginVertical: Spacing.two,
  },
  currencyPrefix: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  totalAmount: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.black,
    letterSpacing: -1.2,
  },
  ratioBarContainer: {
    height: 6,
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: Spacing.one,
    marginBottom: Spacing.four,
  },
  ratioSegment: {
    height: '100%',
  },
  splitSection: {
    flexDirection: 'row',
    gap: Spacing.two + 2,
  },
  splitCard: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  splitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    marginBottom: Spacing.one,
  },
  indicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  splitLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  splitAmount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    marginTop: 2,
  },
  splitSubtext: {
    fontSize: FontSize.xxs,
    marginTop: 2,
  },
  enclaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
  enclaveIcon: {
    fontSize: FontSize.xs,
  },
  enclaveText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
