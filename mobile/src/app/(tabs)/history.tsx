/**
 * OffPay History Screen — Cryptographic Transaction Ledger
 * Displays full transaction stream with search, stats summary, and filter tabs:
 * All, Sent, Received, Offline Bonds
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandHeader } from '@/components/BrandHeader';
import { TransactionItem } from '@/components/TransactionItem';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';
import { MOCK_TRANSACTIONS, type MockTransaction, formatNPR } from '@/constants/mock-data';

type FilterTab = 'all' | 'sent' | 'received' | 'offline';

const FILTERS: { key: FilterTab; label: string; icon: string }[] = [
  { key: 'all', label: 'All Ledger', icon: '☰' },
  { key: 'sent', label: 'Sent', icon: '↗' },
  { key: 'received', label: 'Received', icon: '↙' },
  { key: 'offline', label: 'Offline Bonds', icon: '⬡' },
];

export default function HistoryScreen() {
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Compute ledger analytics
  const totalSent = MOCK_TRANSACTIONS.filter((t) => t.type === 'sent').reduce((acc, t) => acc + t.amount, 0);
  const totalReceived = MOCK_TRANSACTIONS.filter((t) => t.type === 'received').reduce((acc, t) => acc + t.amount, 0);
  const offlineCount = MOCK_TRANSACTIONS.filter((t) => t.isOffline).length;

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    // Filter by tab
    let matchesTab = true;
    if (activeFilter === 'sent') matchesTab = tx.type === 'sent';
    else if (activeFilter === 'received') matchesTab = tx.type === 'received';
    else if (activeFilter === 'offline') matchesTab = tx.isOffline;

    // Filter by search query
    const matchesSearch =
      searchQuery.trim() === '' ||
      tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <BrandHeader showBondCount={false} />

        {/* Ledger Title & Subtitle */}
        <View style={styles.header}>
          <ThemedText style={[styles.title, { color: theme.text }]}>
            Transaction Ledger
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Decentralized online + offline cryptographic history
          </ThemedText>
        </View>

        {/* Stats Summary Bar */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Received</ThemedText>
            <ThemedText style={[styles.statValue, { color: theme.success }]}>+{formatNPR(totalReceived)}</ThemedText>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Sent</ThemedText>
            <ThemedText style={[styles.statValue, { color: theme.error }]}>-{formatNPR(totalSent)}</ThemedText>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Offline TXs</ThemedText>
            <ThemedText style={[styles.statValue, { color: theme.accent }]}>{offlineCount} Verified</ThemedText>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputWrapper, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
            <ThemedText style={[styles.searchIcon, { color: theme.textMuted }]}>🔍</ThemedText>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search counterparty, ID or bond..."
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <ThemedText style={[styles.clearSearch, { color: theme.textMuted }]}>✕</ThemedText>
              </Pressable>
            )}
          </View>
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
                  style={({ pressed }) => [
                    styles.filterTab,
                    {
                      backgroundColor: isActive ? theme.primary : theme.cardGlass,
                      borderColor: isActive ? theme.primary : theme.border,
                      opacity: pressed ? 0.8 : 1,
                      ...(isActive ? Shadows.glowGreen : {}),
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.filterLabel,
                      { color: isActive ? '#07090E' : theme.textSecondary },
                    ]}
                  >
                    {filter.icon} {filter.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Transactions FlatList */}
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
            <View style={[styles.emptyState, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
              <ThemedText style={[styles.emptyIcon]}>📭</ThemedText>
              <ThemedText style={[styles.emptyText, { color: theme.text }]}>
                No transactions found
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: theme.textMuted }]}>
                Transactions matching your search or filter will appear here.
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
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  statBox: {
    flex: 1,
    padding: Spacing.two + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.three,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Platform.OS === 'ios' ? Spacing.two + 2 : Spacing.one,
    borderRadius: BorderRadius.md,
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
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.3,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 120,
  },
  separator: {
    height: 1,
    marginHorizontal: Spacing.two,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.one,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  emptySubtext: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});
