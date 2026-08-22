/**
 * OffPay Scan QR Screen — Futuristic Cyberpunk HUD Viewfinder
 * Includes laser line sweep animation, corner reticles, torch toggle, and dual test triggers.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';

export default function ScanQRScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [torchOn, setTorchOn] = useState(false);

  // Animated laser scan line
  const [scanAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 240,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanAnim]);

  return (
    <View style={styles.container}>
      {/* Top HUD Controls */}
      <View style={styles.topHUD}>
        <Pressable onPress={() => router.back()} style={styles.hudButton}>
          <ThemedText style={styles.hudButtonText}>✕ Close</ThemedText>
        </Pressable>

        <View style={styles.hudTitleBadge}>
          <ThemedText style={styles.hudTitleText}>⚡ OFFLINE MESH SCANNER</ThemedText>
        </View>

        <Pressable
          onPress={() => setTorchOn(!torchOn)}
          style={[styles.hudButton, torchOn && { backgroundColor: theme.warning + '30' }]}
        >
          <ThemedText style={[styles.hudButtonText, torchOn && { color: theme.warning }]}>
            {torchOn ? '🔦 ON' : '🔦 Torch'}
          </ThemedText>
        </Pressable>
      </View>

      {/* Center Viewfinder */}
      <View style={styles.viewfinder}>
        <View style={styles.frame}>
          {/* Neon Corner Brackets */}
          <View style={[styles.corner, styles.topLeft, { borderColor: theme.primary }]} />
          <View style={[styles.corner, styles.topRight, { borderColor: theme.primary }]} />
          <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.primary }]} />
          <View style={[styles.corner, styles.bottomRight, { borderColor: theme.primary }]} />

          {/* Animated Laser Scanning Line */}
          <Animated.View
            style={[
              styles.laserLine,
              {
                backgroundColor: theme.primary,
                transform: [{ translateY: scanAnim }],
                ...Shadows.glowGreen,
              },
            ]}
          />

          {/* Center Target Reticle */}
          <View style={styles.reticle}>
            <ThemedText style={[styles.reticleText, { color: theme.primary + '50' }]}>+</ThemedText>
          </View>
        </View>

        {/* Guidance Notice */}
        <View style={styles.instructions}>
          <ThemedText style={styles.instructionText}>
            Point camera at sender or receiver QR
          </ThemedText>
          <ThemedText style={styles.instructionSubtext}>
            Auto-detects Ed25519 signature payload & bond tokens
          </ThemedText>
        </View>
      </View>

      {/* Developer Testing Triggers */}
      <View style={[styles.testSection, { borderTopColor: '#1A2234' }]}>
        <ThemedText style={[styles.testLabel, { color: theme.textMuted }]}>
          SIMULATED QR SCANS (DEVELOPER MODE)
        </ThemedText>

        <View style={styles.testButtonsRow}>
          <Pressable
            onPress={() => router.push('/payment-confirmation')}
            style={({ pressed }) => [
              styles.testBtn,
              {
                backgroundColor: theme.primary,
                opacity: pressed ? 0.85 : 1,
                ...Shadows.glowGreen,
              },
            ]}
          >
            <ThemedText style={styles.testBtnText}>
              Simulate Valid Payment ›
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070B',
  },
  topHUD: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.three,
  },
  hudButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.full,
    backgroundColor: '#151C2C',
  },
  hudButtonText: {
    color: '#F8FAFC',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  hudTitleBadge: {
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  hudTitleText: {
    color: '#00E676',
    fontSize: 10,
    fontWeight: FontWeight.black,
    letterSpacing: 0.8,
  },
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  frame: {
    width: 270,
    height: 270,
    position: 'relative',
    marginBottom: Spacing.five,
    backgroundColor: 'rgba(15, 20, 32, 0.4)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderWidth: 3.5,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 16 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 16 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 16 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 16 },
  laserLine: {
    position: 'absolute',
    left: '5%',
    width: '90%',
    height: 2.5,
    borderRadius: 2,
  },
  reticle: {
    position: 'absolute',
    top: '40%',
    left: '42%',
  },
  reticleText: {
    fontSize: 40,
    fontWeight: FontWeight.regular,
  },
  instructions: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  instructionText: {
    color: '#F8FAFC',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  instructionSubtext: {
    color: '#94A3B8',
    fontSize: FontSize.xs,
  },
  testSection: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: Spacing.two,
  },
  testLabel: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1,
  },
  testButtonsRow: {
    width: '100%',
  },
  testBtn: {
    paddingVertical: Spacing.three + 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  testBtnText: {
    color: '#07090E',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
