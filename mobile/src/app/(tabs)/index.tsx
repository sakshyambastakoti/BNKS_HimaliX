/**
 * OffPay Home Screen — Mobile Banking Experience (Inspired by Reference Design)
 * Layout:
 * 1. BankingHeader (Morning Greeting + Avatar + Red Scan button + Status)
 * 2. BalanceCard (Primary Account Card + Bond Vault Card + World Card Carousel)
 * 3. Services Grid (2x3 Grid: Transfer, Payment, Withdraw, Scan Pay, Top Up, Loans)
 * 4. Recent Counterparties Carousel
 * 5. Transactions Feed with merchant icon badges
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BankingHeader } from '@/components/BankingHeader';
import { BalanceCard } from '@/components/BalanceCard';
import { QuickActions, type ServiceItem } from '@/components/QuickActions';
import { RecentPeersCarousel } from '@/components/RecentPeersCarousel';
import { TransactionItem } from '@/components/TransactionItem';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';
import { MOCK_TRANSACTIONS, MOCK_BONDS } from '@/constants/mock-data';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { onlineBalance, offlineBalance, totalBalance, networkStatus } = useAppStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const isOffline = networkStatus === 'offline';
  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 4);

  const services: ServiceItem[] = [
    {
      id: 'transfer',
      icon: '⇄',
      label: 'Transfer',
      onPress: () => router.push('/send'),
    },
    {
      id: 'payment',
      icon: '🧾',
      label: 'Payment',
      onPress: () => router.push('/receive'),
    },
    {
      id: 'withdraw',
      icon: '⬡',
      label: 'Withdraw',
      badge: `${MOCK_BONDS.filter((b) => b.status === 'available').length}`,
      onPress: () => Alert.alert('Offline Bond Withdrawal', 'Allocate offline bonds to device enclave for zero-network payments.'),
    },
    {
      id: 'scan-pay',
      icon: '⚲',
      label: 'Scan Pay',
      onPress: () => router.push('/scan-qr'),
    },
    {
      id: 'topup',
      icon: '⊕',
      label: 'Top Up',
      onPress: () => Alert.alert('Top Up Account', 'Select linked bank account or mobile wallet to add NPR funds.'),
    },
    {
      id: 'sync',
      icon: isSyncing ? '⏳' : '⟳',
      label: isSyncing ? 'Syncing...' : 'Fast Sync',
      onPress: () => {
        setIsSyncing(true);
        setTimeout(() => {
          setIsSyncing(false);
          Alert.alert('Sync Successful', 'Offline bond ledger synchronized with validator node.');
        }, 1400);
      },
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
          {/* Top Banking Header (Avatar, Greeting, Red QR, Status) */}
          <BankingHeader />

          {/* Account Balance Card Carousel (Primary Account, Bond Vault, World Card) */}
          <BalanceCard
            totalBalance={totalBalance}
            onlineBalance={onlineBalance}
            offlineBalance={offlineBalance}
          />

          {/* Services 2x3 Grid */}
          <QuickActions services={services} />

          {/* Recent Counterparties Avatar Row */}
          <RecentPeersCarousel />

          {/* Recent Transactions Feed */}
          <View style={styles.transactionSection}>
            <View style={styles.transactionHeader}>
              <ThemedText style={[styles.transactionTitle, { color: theme.text }]}>
                Transaction
              </ThemedText>
              <Pressable onPress={() => router.push('/(tabs)/history')}>
                <ThemedText style={[styles.seeAllText, { color: theme.primary }]}>
                  See All ›
                </ThemedText>
              </Pressable>
            </View>

            <View style={[styles.transactionCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
              {recentTransactions.map((tx, idx) => (
                <React.Fragment key={tx.id}>
                  <TransactionItem transaction={tx} />
                  {idx < recentTransactions.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Bottom padding for tab bar */}
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
  transactionSection: {
    marginVertical: Spacing.two,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two + 2,
    paddingHorizontal: Spacing.one,
  },
  transactionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.black,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  transactionCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.three,
  },
});
