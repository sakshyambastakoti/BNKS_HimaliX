/**
 * OffPay Home Screen — Main Dashboard
 * Displays:
 * - Header with logo + settings
 * - Network status badge
 * - Balance card (total/online/offline)
 * - Send & Receive action buttons
 * - Quick actions grid (Top Up, Load Bond, Sync, Reverse Bond)
 * - Recent transactions list
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BalanceCard } from '@/components/BalanceCard';
import { NetworkStatusBadge } from '@/components/NetworkStatusBadge';
import { ActionButton } from '@/components/ActionButton';
import { QuickActions } from '@/components/QuickActions';
import { TransactionItem } from '@/components/TransactionItem';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { MOCK_TRANSACTIONS } from '@/constants/mock-data';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { onlineBalance, offlineBalance, totalBalance } = useAppStore();

  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 5);

  const quickActions = [
    { id: 'topup', icon: '⊕', label: 'Top Up', onPress: () => {} },
    { id: 'load-bond', icon: '⬡', label: 'Load Bond', onPress: () => {} },
    { id: 'sync', icon: '⟳', label: 'Sync', onPress: () => {} },
    { id: 'reverse', icon: '↩', label: 'Reverse', onPress: () => {} },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <ThemedText style={[styles.logo, { color: theme.primary }]}>
                Off
              </ThemedText>
              <ThemedText style={[styles.logo, { color: theme.text }]}>
                Pay
              </ThemedText>
            </View>
            <View style={styles.headerRight}>
              <NetworkStatusBadge />
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.section}>
            <BalanceCard
              totalBalance={totalBalance}
              onlineBalance={onlineBalance}
              offlineBalance={offlineBalance}
            />
          </View>

          {/* Send & Receive Buttons */}
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

          {/* Quick Actions */}
          <View style={styles.section}>
            <QuickActions actions={quickActions} />
          </View>

          {/* Recent Transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Recent Transactions
              </ThemedText>
              <Pressable onPress={() => router.push('/(tabs)/history')}>
                <ThemedText style={[styles.seeAll, { color: theme.primary }]}>
                  See All
                </ThemedText>
              </Pressable>
            </View>
            <View style={[styles.transactionsList, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {recentTransactions.map((tx, index) => (
                <React.Fragment key={tx.id}>
                  <TransactionItem transaction={tx} />
                  {index < recentTransactions.length - 1 && (
                    <View style={[styles.txDivider, { backgroundColor: theme.border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
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
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
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
