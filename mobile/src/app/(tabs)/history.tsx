/**
 * OffPay History Screen
 * Displays full transaction history with filter tabs:
 * All, Sent, Received, Offline
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TransactionItem } from '@/components/TransactionItem';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { MOCK_TRANSACTIONS, type MockTransaction } from '@/constants/mock-data';

type FilterTab = 'all' | 'sent' | 'received' | 'offline';

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sent', label: 'Sent' },
  { key: 'received', label: 'Received' },
  { key: 'offline', label: 'Offline' },
];

export default function HistoryScreen() {
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    switch (activeFilter) {
      case 'sent':
        return tx.type === 'sent';
      case 'received':
        return tx.type === 'received';
      case 'offline':
        return tx.isOffline;
      default:
        return true;
    }
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={[styles.title, { color: theme.text }]}>
            Transaction History
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Online + offline ledger
          </ThemedText>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <Pressable
                  key={filter.key}
                  onPress={() => setActiveFilter(filter.key)}
                  style={[
                    styles.filterTab,
                    {
                      backgroundColor: isActive ? theme.primary : theme.cardElevated,
                      borderColor: isActive ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.filterLabel,
                      { color: isActive ? '#0A0A0F' : theme.textSecondary },
                    ]}
                  >
                    {filter.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ThemedText style={[styles.emptyIcon]}>📭</ThemedText>
              <ThemedText style={[styles.emptyText, { color: theme.textMuted }]}>
                No transactions found
              </ThemedText>
            </View>
          }
        />
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
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: Spacing.one,
  },
  filterContainer: {
    paddingVertical: Spacing.three,
  },
  filterScroll: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  filterTab: {
    paddingHorizontal: Spacing.three + 4,
    paddingVertical: Spacing.two + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 120,
  },
  separator: {
    height: 1,
    marginHorizontal: Spacing.three,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.three,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
});
