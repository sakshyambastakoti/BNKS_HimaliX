/**
 * OffPay History Screen — Transaction Feed & Statements
 * Matching the clean Mobile Banking layout with search, category filters, and merchant badges.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BankingHeader } from '@/components/BankingHeader';
import { TransactionItem } from '@/components/TransactionItem';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';
import { MOCK_TRANSACTIONS, formatNPR } from '@/constants/mock-data';

type FilterTab = 'all' | 'sent' | 'received' | 'offline';

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All Transactions' },
  { key: 'sent', label: 'Transfer Out' },
  { key: 'received', label: 'Income & Top Up' },
  { key: 'offline', label: 'Offline Bonds' },
];

export default function HistoryScreen() {
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalSent = MOCK_TRANSACTIONS.filter((t) => t.type === 'sent').reduce((acc, t) => acc + t.amount, 0);
  const totalReceived = MOCK_TRANSACTIONS.filter((t) => t.type === 'received' || t.type === 'topup').reduce((acc, t) => acc + t.amount, 0);

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    let matchesTab = true;
    if (activeFilter === 'sent') matchesTab = tx.type === 'sent';
    else if (activeFilter === 'received') matchesTab = tx.type === 'received' || tx.type === 'topup';
    else if (activeFilter === 'offline') matchesTab = tx.isOffline;

    const matchesSearch =
      searchQuery.trim() === '' ||
      tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <BankingHeader />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputWrapper, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.subtle }]}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search merchant, ID or recipient..."
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <ThemedText style={[styles.clearSearch, { color: theme.textSecondary }]}>✕</ThemedText>
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <Pressable
                  key={filter.key}
                  onPress={() => setActiveFilter(filter.key)}
                  style={({ pressed }) => [
                    styles.filterTab,
                    {
                      backgroundColor: isActive ? '#0F4A3C' : theme.card,
                      borderColor: isActive ? '#0F4A3C' : theme.border,
                      opacity: pressed ? 0.8 : 1,
                      ...Shadows.subtle,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.filterLabel,
                      { color: isActive ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {filter.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Transaction Feed */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: theme.borderLight }]} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <ThemedText style={styles.emptyIcon}>📋</ThemedText>
              <ThemedText style={[styles.emptyText, { color: theme.text }]}>
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
  container: { flex: 1 },
  safeArea: { flex: 1 },
  searchContainer: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Platform.OS === 'ios' ? Spacing.two + 2 : Spacing.one,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  searchIcon: {
    fontSize: FontSize.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
  },
  clearSearch: {
    fontSize: FontSize.xs,
    padding: Spacing.one,
  },
  filterContainer: {
    paddingVertical: Spacing.two + 2,
  },
  filterScroll: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  filterTab: {
    paddingHorizontal: Spacing.three + 2,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 120,
  },
  separator: {
    height: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
