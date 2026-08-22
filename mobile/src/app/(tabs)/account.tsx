/**
 * OffPay Account Screen — "All Accounts & Summary" (Matching Reference Screen 3)
 * Displays:
 * - Summary Header with dual overlapping card illustration
 * - Total Available Balance (NPR 30,000.00)
 * - "All Accounts" Card List (Primary Account, Saving Account, Offline Bond Vault)
 * - Prominent "Create Account / Load Bond" primary button
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BankingHeader } from '@/components/BankingHeader';
import { SvgIcon } from '@/components/SvgIcons';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';
import { formatNPR, MOCK_BONDS } from '@/constants/mock-data';

export default function AccountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, onlineBalance, offlineBalance, totalBalance } = useAppStore();

  const activeBondsCount = MOCK_BONDS.filter((b) => b.status === 'available').length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <BankingHeader />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card with Overlapping Visual Tiles (Matching Reference Screen 3) */}
          <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
            <ThemedText style={[styles.summaryHeaderTitle, { color: theme.text }]}>
              Summary
            </ThemedText>
            <ThemedText style={[styles.summaryTimestamp, { color: theme.textSecondary }]}>
              Last update: Today 10:00 Am
            </ThemedText>

            <View style={styles.summaryBody}>
              {/* Dual Overlapping Card Visual */}
              <View style={styles.overlapCardGraphic}>
                <View style={[styles.overlapTile, styles.overlapTileGreen, { backgroundColor: '#0F4A3C' }]} />
                <View style={[styles.overlapTile, styles.overlapTileCoral, { backgroundColor: '#FF5B5B' }]} />
              </View>

              {/* Total Available Balance */}
              <View style={styles.summaryBalanceGroup}>
                <ThemedText style={[styles.summaryBalanceLabel, { color: theme.textSecondary }]}>
                  Total Available Balance
                </ThemedText>
                <ThemedText style={[styles.summaryBalanceValue, { color: theme.text }]}>
                  {formatNPR(totalBalance)}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Section: "All Accounts" */}
          <View style={styles.accountsSection}>
            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
              All Accounts
            </ThemedText>

            {/* Account Card 1: Primary Account */}
            <View style={[styles.accountItemCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
              <View style={styles.accountCardLeft}>
                <ThemedText style={[styles.accountItemTitle, { color: theme.text }]}>
                  Account Name
                </ThemedText>
                <ThemedText style={[styles.accountItemNumber, { color: theme.textSecondary }]}>
                  1234-5678-90
                </ThemedText>
                <View style={[styles.primaryPill, { backgroundColor: '#E6F6EE' }]}>
                  <ThemedText style={[styles.primaryPillText, { color: '#00A859' }]}>Primary</ThemedText>
                </View>
              </View>

              <View style={styles.accountCardRight}>
                <View style={[styles.accountIconBox, { backgroundColor: '#E6F6EE' }]}>
                  <SvgIcon name="bank" size={18} color="#0F4A3C" />
                </View>
                <ThemedText style={[styles.accountBalanceLabel, { color: theme.textSecondary }]}>
                  Available Balance
                </ThemedText>
                <ThemedText style={[styles.accountBalanceValue, { color: theme.text }]}>
                  {formatNPR(onlineBalance)}
                </ThemedText>
              </View>
            </View>

            {/* Account Card 2: Saving Account */}
            <View style={[styles.accountItemCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
              <View style={styles.accountCardLeft}>
                <ThemedText style={[styles.accountItemTitle, { color: theme.text }]}>
                  Saving Account
                </ThemedText>
                <ThemedText style={[styles.accountItemNumber, { color: theme.textSecondary }]}>
                  1234-5678-90
                </ThemedText>
              </View>

              <View style={styles.accountCardRight}>
                <View style={[styles.accountIconBox, { backgroundColor: '#E0F2FE' }]}>
                  <SvgIcon name="accounts" size={18} color="#0284C7" />
                </View>
                <ThemedText style={[styles.accountBalanceLabel, { color: theme.textSecondary }]}>
                  Available Balance
                </ThemedText>
                <ThemedText style={[styles.accountBalanceValue, { color: theme.text }]}>
                  NPR 50.00
                </ThemedText>
              </View>
            </View>

            {/* Account Card 3: Offline Bond Vault */}
            <View style={[styles.accountItemCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
              <View style={styles.accountCardLeft}>
                <ThemedText style={[styles.accountItemTitle, { color: theme.text }]}>
                  Offline Bond Vault
                </ThemedText>
                <ThemedText style={[styles.accountItemNumber, { color: theme.textSecondary }]}>
                  {activeBondsCount} Signed Vouchers
                </ThemedText>
                <View style={[styles.primaryPill, { backgroundColor: '#FEF3C7' }]}>
                  <ThemedText style={[styles.primaryPillText, { color: '#D97706' }]}>Zero-Network</ThemedText>
                </View>
              </View>

              <View style={styles.accountCardRight}>
                <View style={[styles.accountIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <SvgIcon name="lock" size={18} color="#D97706" />
                </View>
                <ThemedText style={[styles.accountBalanceLabel, { color: theme.textSecondary }]}>
                  Offline Capacity
                </ThemedText>
                <ThemedText style={[styles.accountBalanceValue, { color: theme.accent }]}>
                  {formatNPR(offlineBalance)}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Prominent "Create Account / Load Bond" Button */}
          <Pressable
            onPress={() => Alert.alert('Create Account / Load Bond', 'Select bank account to link or allocate new offline bond vouchers.')}
            style={({ pressed }) => [
              styles.createAccountButton,
              {
                backgroundColor: theme.primaryDark,
                opacity: pressed ? 0.88 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <ThemedText style={styles.createAccountText}>
              Create Account
            </ThemedText>
          </Pressable>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
  },
  summaryCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    marginVertical: Spacing.two,
  },
  summaryHeaderTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.black,
    letterSpacing: -0.3,
  },
  summaryTimestamp: {
    fontSize: FontSize.xxs,
    marginTop: 2,
    marginBottom: Spacing.three,
  },
  summaryBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overlapCardGraphic: {
    width: 80,
    height: 50,
    position: 'relative',
  },
  overlapTile: {
    position: 'absolute',
    width: 44,
    height: 48,
    borderRadius: 8,
  },
  overlapTileGreen: {
    top: 0,
    left: 0,
  },
  overlapTileCoral: {
    top: 4,
    left: 24,
  },
  summaryBalanceGroup: {
    alignItems: 'flex-end',
  },
  summaryBalanceLabel: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.medium,
  },
  summaryBalanceValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
    marginTop: 2,
  },
  accountsSection: {
    marginVertical: Spacing.two,
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.black,
    letterSpacing: -0.3,
    paddingHorizontal: Spacing.one,
  },
  accountItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  accountCardLeft: {
    gap: 3,
    flex: 1,
  },
  accountItemTitle: {
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.bold,
  },
  accountItemNumber: {
    fontSize: FontSize.xxs + 1,
  },
  primaryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  primaryPillText: {
    fontSize: 10,
    fontWeight: FontWeight.extrabold,
  },
  accountCardRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  accountIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  accountBalanceLabel: {
    fontSize: 9,
    fontWeight: FontWeight.medium,
  },
  accountBalanceValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.black,
  },
  createAccountButton: {
    paddingVertical: Spacing.three + 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  createAccountText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
});
