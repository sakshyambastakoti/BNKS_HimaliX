/**
 * OffPay Home Screen — Futuristic Neo-Banking Dashboard
 * Displays:
 * - BrandHeader with official OffPay logo + interactive network badge
 * - Offline mesh readiness banner
 * - Glassmorphic Balance Card
 * - High-impact Send & Receive Action Buttons
 * - Quick Action tiles (Top Up, Load Bond, Sync, Scan QR)
 * - Offline Bond Vault Snapshot
 * - Recent verified transactions ledger
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandHeader } from '@/components/BrandHeader';
import { BalanceCard } from '@/components/BalanceCard';
import { ActionButton } from '@/components/ActionButton';
import { QuickActions, type QuickActionItem } from '@/components/QuickActions';
import { TransactionItem } from '@/components/TransactionItem';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';
import { MOCK_TRANSACTIONS, MOCK_BONDS, formatNPR } from '@/constants/mock-data';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { onlineBalance, offlineBalance, totalBalance, networkStatus } = useAppStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const isOffline = networkStatus === 'offline';
  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 5);
  const activeBonds = MOCK_BONDS.filter((b) => b.status === 'available');

  const handleSync = () => {
    setIsSyncing(true);
    setSyncFeedback('Syncing local ledger with validator...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncFeedback('All offline transactions settled on-chain!');
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 1800);
  };

  const quickActions: QuickActionItem[] = [
    {
      id: 'topup',
      icon: '⊕',
      label: 'Top Up',
      color: theme.info,
      onPress: () => {
        Alert.alert('Top Up', 'Select bank account or payment provider to add NPR balance.');
      },
    },
    {
      id: 'load-bond',
      icon: '⬡',
      label: 'Load Bond',
      badge: `${activeBonds.length}`,
      color: theme.accent,
      onPress: () => {
        Alert.alert('Load Offline Bond', 'Convert NPR online balance into cryptographically signed offline bonds for zero-network spending.');
      },
    },
    {
      id: 'sync',
      icon: isSyncing ? '⏳' : '⟳',
      label: isSyncing ? 'Syncing...' : 'Fast Sync',
      color: theme.primary,
      onPress: handleSync,
    },
    {
      id: 'scan-qr',
      icon: '📷',
      label: 'Scan QR',
      color: theme.cyan,
      onPress: () => router.push('/scan-qr'),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header with Logo and Network Switcher */}
          <BrandHeader />

          {/* Offline Mesh Readiness Banner */}
          <View
            style={[
              styles.statusBanner,
              {
                backgroundColor: isOffline ? theme.errorBg : theme.primaryGlow,
                borderColor: isOffline ? theme.error + '40' : theme.primary + '35',
              },
            ]}
          >
            <ThemedText style={styles.bannerIcon}>
              {isOffline ? '⚡' : '🛡'}
            </ThemedText>
            <View style={styles.bannerTextContainer}>
              <ThemedText
                style={[
                  styles.bannerTitle,
                  { color: isOffline ? theme.error : theme.primary },
                ]}
              >
                {isOffline ? 'Offline Peer-to-Peer Mode Active' : 'OffPay Network Connected'}
              </ThemedText>
              <ThemedText style={[styles.bannerSubtitle, { color: theme.textSecondary }]}>
                {isOffline
                  ? `${activeBonds.length} offline bonds ready for zero-network exchange`
                  : 'Hardware Enclave armed • Ed25519 signatures verified'}
              </ThemedText>
            </View>
          </View>

          {/* Sync notification toast */}
          {syncFeedback && (
            <View style={[styles.syncToast, { backgroundColor: theme.primary, borderColor: theme.accent }]}>
              <ThemedText style={styles.syncToastText}>✓ {syncFeedback}</ThemedText>
            </View>
          )}

          {/* Balance Card */}
          <View style={styles.section}>
            <BalanceCard
              totalBalance={totalBalance}
              onlineBalance={onlineBalance}
              offlineBalance={offlineBalance}
            />
          </View>

          {/* Primary Action Buttons (Send & Receive) */}
          <View style={styles.actionRow}>
            <ActionButton
              title="Send"
              icon="↗"
              variant="primary"
              size="large"
              onPress={() => router.push('/send')}
            />
            <ActionButton
              title="Receive"
              icon="↙"
              variant="secondary"
              size="large"
              onPress={() => router.push('/receive')}
            />
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.text, marginBottom: Spacing.two }]}>
              QUICK COMMANDS
            </ThemedText>
            <QuickActions actions={quickActions} />
          </View>

          {/* Offline Bond Vault Snapshot */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.vaultTitleGroup}>
                <ThemedText style={[styles.vaultIcon, { color: theme.accent }]}>⬡</ThemedText>
                <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                  Offline Bond Vault
                </ThemedText>
              </View>
              <Pressable onPress={() => router.push('/(tabs)/account')}>
                <ThemedText style={[styles.seeAll, { color: theme.primary }]}>
                  Manage
                </ThemedText>
              </Pressable>
            </View>

            <View style={[styles.bondVaultCard, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
              <View style={styles.bondVaultHeader}>
                <View>
                  <ThemedText style={[styles.bondVaultCount, { color: theme.text }]}>
                    {activeBonds.length} Active Bonds
                  </ThemedText>
                  <ThemedText style={[styles.bondVaultLimit, { color: theme.textMuted }]}>
                    Total Offline Spending Capacity: {formatNPR(offlineBalance)}
                  </ThemedText>
                </View>
                <View style={[styles.activePill, { backgroundColor: theme.accent + '20', borderColor: theme.accent }]}>
                  <ThemedText style={[styles.activePillText, { color: theme.accent }]}>
                    READY
                  </ThemedText>
                </View>
              </View>

              {/* Bond Chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bondsScroll}>
                {activeBonds.map((bond) => (
                  <View
                    key={bond.bondId}
                    style={[
                      styles.bondChip,
                      {
                        backgroundColor: theme.cardElevated,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <ThemedText style={[styles.bondChipValue, { color: theme.accent }]}>
                      NPR {bond.value}
                    </ThemedText>
                    <ThemedText style={[styles.bondChipId, { color: theme.textMuted }]}>
                      {bond.bondId}
                    </ThemedText>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Recent Transactions
              </ThemedText>
              <Pressable onPress={() => router.push('/(tabs)/history')}>
                <ThemedText style={[styles.seeAll, { color: theme.primary }]}>
                  View Ledger ›
                </ThemedText>
              </Pressable>
            </View>

            <View style={[styles.transactionsList, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
              {recentTransactions.map((tx, index) => (
                <React.Fragment key={tx.id}>
                  <TransactionItem transaction={tx} />
                  {index < recentTransactions.length - 1 && (
                    <View style={[styles.txDivider, { backgroundColor: theme.borderLight }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Bottom spacing for floating tab bar */}
          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two + 2,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  bannerIcon: {
    fontSize: FontSize.lg,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bannerSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  syncToast: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginVertical: Spacing.two,
    alignItems: 'center',
  },
  syncToastText: {
    color: '#07090E',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
  },
  section: {
    marginTop: Spacing.four,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two + 2,
  },
  vaultTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
  },
  vaultIcon: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  seeAll: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  bondVaultCard: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  bondVaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bondVaultCount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  bondVaultLimit: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.8,
  },
  bondsScroll: {
    gap: Spacing.two,
  },
  bondChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  bondChipValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  bondChipId: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  transactionsList: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  txDivider: {
    height: 1,
    marginHorizontal: Spacing.three,
  },
});
