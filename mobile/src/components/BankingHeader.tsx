/**
 * BankingHeader Component — Exactly matching the Reference Mobile Banking Header
 * Features:
 * - Circular User Avatar on Left
 * - Greeting ("Morning, [Name]!") + Live Date/Time Subtitle
 * - Red Accent Square QR Scanner Button (回)
 * - Network Status Badge & Notification Bell with dot
 */

import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { NetworkStatusBadge } from '@/components/NetworkStatusBadge';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';

export function BankingHeader() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAppStore();

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Lyden';
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'L';

  return (
    <View style={styles.container}>
      {/* Left: Avatar + Greeting */}
      <Pressable onPress={() => router.push('/(tabs)/account')} style={styles.userSection}>
        <View style={[styles.avatar, { backgroundColor: theme.primaryGlow, borderColor: theme.primary }]}>
          <ThemedText style={[styles.avatarText, { color: theme.primary }]}>{initials}</ThemedText>
        </View>
        <View style={styles.greetingGroup}>
          <ThemedText style={[styles.greeting, { color: theme.text }]}>
            Morning, {firstName}!
          </ThemedText>
          <ThemedText style={[styles.dateText, { color: theme.textSecondary }]}>
            22 Aug 2026 • 10:00 Am
          </ThemedText>
        </View>
      </Pressable>

      {/* Right: Red Scan Button + Network Badge + Notification */}
      <View style={styles.rightActions}>
        {/* Red Square QR Scanner Button (Matching Reference) */}
        <Pressable
          onPress={() => router.push('/scan-qr')}
          style={({ pressed }) => [
            styles.redScanButton,
            {
              backgroundColor: '#FF5B5B',
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
        >
          <ThemedText style={styles.redScanIcon}>⚲</ThemedText>
        </Pressable>

        {/* Network Status Badge */}
        <NetworkStatusBadge />

        {/* Notification Bell */}
        <Pressable
          onPress={() => router.push('/logs')}
          style={({ pressed }) => [
            styles.bellButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <ThemedText style={[styles.bellIcon, { color: theme.textSecondary }]}>🔔</ThemedText>
          <View style={styles.unreadDot} />
        </Pressable>
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.black,
  },
  greetingGroup: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: FontSize.xxs + 1,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  redScanButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redScanIcon: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.black,
  },
  bellButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: FontSize.sm,
  },
  unreadDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5B5B',
  },
});
