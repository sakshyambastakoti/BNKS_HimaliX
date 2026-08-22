/**
 * NetworkStatusBadge — Real-time network status indicator
 * Shows 🟢 Online / 🔴 Offline / 🟡 Wi-Fi Only
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export function NetworkStatusBadge() {
  const theme = useTheme();
  const networkStatus = useAppStore((s) => s.networkStatus);

  const config = {
    online: {
      color: theme.statusOnline,
      label: 'Online',
      icon: '●',
    },
    offline: {
      color: theme.statusOffline,
      label: 'Offline',
      icon: '●',
    },
    'wifi-only': {
      color: theme.statusWifi,
      label: 'Wi-Fi Only',
      icon: '●',
    },
  };

  const status = config[networkStatus];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: status.color + '18',
          borderColor: status.color + '40',
        },
      ]}
    >
      <ThemedText style={[styles.dot, { color: status.color }]}>
        {status.icon}
      </ThemedText>
      <ThemedText style={[styles.label, { color: status.color }]}>
        {status.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.one + 2,
  },
  dot: {
    fontSize: 10,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
