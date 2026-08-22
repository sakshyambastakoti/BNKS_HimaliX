/**
 * NetworkStatusBadge — Real-time network status indicator with interactive mode switcher
 * Shows 🟢 Online / 🔴 Offline / 🟡 Wi-Fi Only
 * Tap to toggle mode for instant offline/online testing!
 */

import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export function NetworkStatusBadge() {
  const theme = useTheme();
  const { networkStatus, setNetworkStatus } = useAppStore();

  const config = {
    online: {
      color: theme.statusOnline,
      label: 'Online',
      icon: '●',
      next: 'offline' as const,
      subtext: '4G/5G',
    },
    offline: {
      color: theme.statusOffline,
      label: 'Offline',
      icon: '●',
      next: 'wifi-only' as const,
      subtext: 'Mesh Active',
    },
    'wifi-only': {
      color: theme.statusWifi,
      label: 'Wi-Fi',
      icon: '●',
      next: 'online' as const,
      subtext: 'Local LAN',
    },
  };

  const status = config[networkStatus];

  const handleToggle = () => {
    setNetworkStatus(status.next);
  };

  return (
    <Pressable
      onPress={handleToggle}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: status.color + '15',
          borderColor: status.color + '45',
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
          ...Platform.select({
            ios: {
              shadowColor: status.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
            },
            android: { elevation: 3 },
          }),
        },
      ]}
    >
      {/* Pulsing indicator light */}
      <View style={[styles.dotWrapper, { backgroundColor: status.color + '30' }]}>
        <ThemedText style={[styles.dot, { color: status.color }]}>
          {status.icon}
        </ThemedText>
      </View>

      <ThemedText style={[styles.label, { color: status.color }]}>
        {status.label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.one + 1,
  },
  dotWrapper: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    fontSize: 9,
    lineHeight: 12,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
