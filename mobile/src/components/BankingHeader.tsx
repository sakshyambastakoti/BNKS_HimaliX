/**
 * BankingHeader Component — Vector SVG & Light/Dark Mode Switcher
 * Features:
 * - User Avatar on Left + "Morning, [Name]!" + Live Date/Time
 * - Interactive Light / Dark Mode Toggle Button (SVG Sun/Moon)
 * - Red Square QR Scanner Button (SVG Scan-Pay)
 * - Network Status Badge & Notification Bell (SVG Bell with badge)
 */

import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { NetworkStatusBadge } from '@/components/NetworkStatusBadge';
import { SvgIcon } from '@/components/SvgIcons';
import { useTheme, useThemeMode } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';

export function BankingHeader() {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeMode();
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

      {/* Right: Red Scan Button + Theme Toggle + Network Badge + Notification */}
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
          <SvgIcon name="scan-pay" size={16} color="#FFFFFF" />
        </Pressable>

        {/* Dynamic Light / Dark Mode Toggle Button */}
        <Pressable
          onPress={toggleTheme}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <SvgIcon name={isDark ? 'sun' : 'moon'} size={16} color={isDark ? '#F59E0B' : '#0F4A3C'} />
        </Pressable>

        {/* Network Status Badge */}
        <NetworkStatusBadge />

        {/* Notification Bell */}
        <Pressable
          onPress={() => router.push('/logs')}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <SvgIcon name="bell" size={16} color={theme.textSecondary} />
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
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
