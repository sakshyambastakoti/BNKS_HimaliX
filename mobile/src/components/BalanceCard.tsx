/**
 * BalanceCard — Exactly inspired by the Mobile Banking Reference Design
 * Features:
 * - Clean, pure white rounded banking card with soft shadow
 * - Account Name + Eye toggle (👁) + Account Number
 * - "Primary" mint badge
 * - Bank / Vault icon on right
 * - "Available Balance" label + bold balance ($2,749.00 / NPR 25,000.00)
 * - Horizontal carousel / tab toggle to view Offline Bond Vault & Virtual Card
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { OffPayLogo } from '@/components/OffPayLogo';
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
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  return (
    <View style={styles.container}>
      {/* Horizontal Carousel of Banking Cards */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        onScroll={(e) => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / 320);
          if (index !== activeCardIndex && index >= 0 && index <= 2) {
            setActiveCardIndex(index);
          }
        }}
        scrollEventThrottle={16}
      >
        {/* Card 1: Primary Online Account Card (Matching Reference Screen 1 & 2) */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.accountInfoLeft}>
              <View style={styles.nameRow}>
                <ThemedText style={[styles.accountName, { color: theme.text }]}>
                  Account Name
                </ThemedText>
                <Pressable onPress={() => setIsBalanceHidden(!isBalanceHidden)} style={styles.eyeBtn}>
                  <ThemedText style={[styles.eyeIcon, { color: theme.textSecondary }]}>
                    {isBalanceHidden ? '👁‍🗨' : '👁'}
                  </ThemedText>
                </Pressable>
              </View>
              <ThemedText style={[styles.accountNumber, { color: theme.textSecondary }]}>
                1234-5678-90
              </ThemedText>
              <View style={[styles.primaryPill, { backgroundColor: theme.successBg }]}>
                <ThemedText style={[styles.primaryPillText, { color: theme.primary }]}>
                  Primary
                </ThemedText>
              </View>
            </View>

            {/* Right: Bank Building Icon */}
            <View style={styles.accountInfoRight}>
              <View style={[styles.bankIconContainer, { backgroundColor: '#E6F6EE' }]}>
                <ThemedText style={[styles.bankIcon, { color: '#0F4A3C' }]}>🏛</ThemedText>
              </View>
              <View style={styles.balanceGroup}>
                <ThemedText style={[styles.availableLabel, { color: theme.textSecondary }]}>
                  Available Balance
                </ThemedText>
                <ThemedText style={[styles.balanceValue, { color: theme.text }]}>
                  {isBalanceHidden ? '••••••' : formatNPR(onlineBalance)}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Card 2: Offline Bond Vault Card (Matching Reference Screen 3 "Saving Account") */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.accountInfoLeft}>
              <View style={styles.nameRow}>
                <ThemedText style={[styles.accountName, { color: theme.text }]}>
                  Offline Bond Vault
                </ThemedText>
                <Pressable onPress={() => setIsBalanceHidden(!isBalanceHidden)} style={styles.eyeBtn}>
                  <ThemedText style={[styles.eyeIcon, { color: theme.textSecondary }]}>
                    {isBalanceHidden ? '👁‍🗨' : '👁'}
                  </ThemedText>
                </Pressable>
              </View>
              <ThemedText style={[styles.accountNumber, { color: theme.textSecondary }]}>
                VAULT-8842-01
              </ThemedText>
              <View style={[styles.primaryPill, { backgroundColor: '#FEF3C7' }]}>
                <ThemedText style={[styles.primaryPillText, { color: '#D97706' }]}>
                  Offline Mesh
                </ThemedText>
              </View>
            </View>

            {/* Right: Vault Safe Icon */}
            <View style={styles.accountInfoRight}>
              <View style={[styles.bankIconContainer, { backgroundColor: '#E0F2FE' }]}>
                <ThemedText style={[styles.bankIcon, { color: '#0284C7' }]}>🔒</ThemedText>
              </View>
              <View style={styles.balanceGroup}>
                <ThemedText style={[styles.availableLabel, { color: theme.textSecondary }]}>
                  Offline Capacity
                </ThemedText>
                <ThemedText style={[styles.balanceValue, { color: theme.accent }]}>
                  {isBalanceHidden ? '••••••' : formatNPR(offlineBalance)}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Card 3: Virtual World Card (Matching Reference Screen 4 "Cards") */}
        <View style={[styles.card, styles.debitCard, { backgroundColor: '#1A2234' }]}>
          <View style={styles.debitTopRow}>
            <ThemedText style={styles.debitWorldText}>world</ThemedText>
            <ThemedText style={styles.debitContactless}>)))</ThemedText>
          </View>

          <View style={styles.chipRow}>
            <View style={styles.emvChip}>
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
            </View>
            <OffPayLogo size="xs" variant="mark" glow />
          </View>

          <ThemedText style={styles.debitNumber}>
            5412  7512  3412  3456
          </ThemedText>

          <View style={styles.debitBottomRow}>
            <View>
              <ThemedText style={styles.debitExpiry}>12/28</ThemedText>
              <ThemedText style={styles.debitHolder}>OFFPAY NODE</ThemedText>
            </View>
            <View style={styles.masterCircles}>
              <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.mcCircle, { backgroundColor: '#F79E1B', marginLeft: -10 }]} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Pagination Indicator Dots */}
      <View style={styles.paginationRow}>
        <View style={[styles.dot, activeCardIndex === 0 && { backgroundColor: theme.primary, width: 18 }]} />
        <View style={[styles.dot, activeCardIndex === 1 && { backgroundColor: theme.primary, width: 18 }]} />
        <View style={[styles.dot, activeCardIndex === 2 && { backgroundColor: theme.primary, width: 18 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.two,
  },
  scrollContainer: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
  card: {
    width: 328,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    minHeight: 124,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfoLeft: {
    gap: 3,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  accountName: {
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.bold,
  },
  eyeBtn: {
    padding: 2,
  },
  eyeIcon: {
    fontSize: FontSize.xs,
  },
  accountNumber: {
    fontSize: FontSize.xxs + 1,
    fontWeight: FontWeight.medium,
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
  accountInfoRight: {
    alignItems: 'flex-end',
    gap: Spacing.one + 2,
  },
  bankIconContainer: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankIcon: {
    fontSize: FontSize.lg,
  },
  balanceGroup: {
    alignItems: 'flex-end',
  },
  availableLabel: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.medium,
  },
  balanceValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.black,
    letterSpacing: -0.5,
  },
  debitCard: {
    minHeight: 140,
    justifyContent: 'space-between',
    padding: Spacing.four,
  },
  debitTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debitWorldText: {
    color: '#F8FAFC',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  debitContactless: {
    color: '#94A3B8',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  emvChip: {
    width: 32,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 3,
  },
  chipLine: {
    height: 1,
    backgroundColor: '#AA820A',
  },
  debitNumber: {
    color: '#F8FAFC',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  debitBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  debitExpiry: {
    color: '#94A3B8',
    fontSize: 9,
  },
  debitHolder: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.8,
  },
  masterCircles: {
    flexDirection: 'row',
  },
  mcCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    opacity: 0.9,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.two + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
});
