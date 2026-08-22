/**
 * BrandHeader Component
 * High-end top navigation bar with OffPay logo, interactive NetworkStatusBadge,
 * offline bond counter badge, and quick profile trigger.
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { OffPayLogo } from '@/components/OffPayLogo';
import { NetworkStatusBadge } from '@/components/NetworkStatusBadge';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { MOCK_BONDS } from '@/constants/mock-data';

interface BrandHeaderProps {
  showNetworkBadge?: boolean;
  showBondCount?: boolean;
  showProfile?: boolean;
}

export function BrandHeader({
  showNetworkBadge = true,
  showBondCount = true,
  showProfile = true,
}: BrandHeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAppStore();

  const availableBondsCount = MOCK_BONDS.filter((b) => b.status === 'available').length;
  const userInitial = user?.fullName ? user.fullName[0].toUpperCase() : 'U';

  return (
    <View style={styles.container}>
      {/* Brand Logo */}
      <Pressable onPress={() => router.push('/(tabs)')} style={styles.logoTouch}>
        <OffPayLogo size="sm" variant="horizontal" glow />
      </Pressable>

      {/* Right Actions & Status */}
      <View style={styles.rightActions}>
        {showBondCount && (
          <Pressable
            onPress={() => router.push('/(tabs)/account')}
            style={({ pressed }) => [
              styles.bondBadge,
              {
                backgroundColor: theme.cardElevated,
                borderColor: theme.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <ThemedText style={[styles.bondIcon, { color: theme.accent }]}>⬡</ThemedText>
            <ThemedText style={[styles.bondCount, { color: theme.textSecondary }]}>
              {availableBondsCount} <ThemedText style={{ fontSize: 10, color: theme.textMuted }}>Bonds</ThemedText>
            </ThemedText>
          </Pressable>
        )}

        {showNetworkBadge && <NetworkStatusBadge />}

        {showProfile && (
          <Pressable
            onPress={() => router.push('/(tabs)/account')}
            style={({ pressed }) => [
              styles.avatarButton,
              {
                backgroundColor: theme.primaryGlow,
                borderColor: theme.primary,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
          >
            <ThemedText style={[styles.avatarText, { color: theme.primary }]}>
              {userInitial}
            </ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  logoTouch: {
    paddingVertical: Spacing.half,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  bondBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.one,
  },
  bondIcon: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  bondCount: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
