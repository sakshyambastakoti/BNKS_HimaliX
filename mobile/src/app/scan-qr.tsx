/**
 * OffPay Scan QR Screen
 * Camera scanner placeholder for reading Request QR and Payment QR codes.
 * Will integrate expo-camera in a later phase.
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function ScanQRScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      {/* Camera viewfinder placeholder */}
      <View style={styles.viewfinder}>
        {/* Scanning frame */}
        <View style={styles.frame}>
          <View style={[styles.corner, styles.topLeft, { borderColor: theme.primary }]} />
          <View style={[styles.corner, styles.topRight, { borderColor: theme.primary }]} />
          <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.primary }]} />
          <View style={[styles.corner, styles.bottomRight, { borderColor: theme.primary }]} />

          {/* Scan line animation placeholder */}
          <View style={[styles.scanLine, { backgroundColor: theme.primary + '60' }]} />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <ThemedText style={styles.instructionText}>
            Point your camera at the QR code
          </ThemedText>
          <ThemedText style={styles.instructionSubtext}>
            Align the QR code within the frame
          </ThemedText>
        </View>
      </View>

      {/* Mock scan button (for development) */}
      <View style={styles.mockSection}>
        <ThemedText style={[styles.mockLabel, { color: theme.textMuted }]}>
          📷 Camera will be integrated with expo-camera
        </ThemedText>
        <Pressable
          onPress={() => {
            // Simulate a successful scan
            router.push('/payment-confirmation');
          }}
          style={({ pressed }) => [
            styles.mockButton,
            {
              backgroundColor: theme.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <ThemedText style={styles.mockButtonText}>
            Simulate Scan →
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  frame: {
    width: 260,
    height: 260,
    position: 'relative',
    marginBottom: Spacing.five,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    width: '90%',
    height: 2,
    top: '50%',
    left: '5%',
    borderRadius: 1,
  },
  instructions: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  instructionText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  instructionSubtext: {
    color: '#ffffff80',
    fontSize: FontSize.sm,
  },
  mockSection: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    alignItems: 'center',
    gap: Spacing.three,
  },
  mockLabel: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  mockButton: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: BorderRadius.lg,
  },
  mockButtonText: {
    color: '#0A0A0F',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
