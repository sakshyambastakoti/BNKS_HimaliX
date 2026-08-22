/**
 * OffPay QR Scanner Screen — HUD Cyber Reticle Viewfinder
 * Reads Offline Bond Payment Tokens and Receiver Handshake QRs via Camera.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { SvgIcon } from '@/components/SvgIcons';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';

export default function ScanQRScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [torch, setTorch] = useState(false);
  const [scanLineAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Laser sweep animation loop
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 240,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top HUD Controls */}
      <View style={styles.topHUD}>
        <Pressable onPress={() => router.back()} style={styles.hudButton}>
          <SvgIcon name="close" size={16} color="#FFFFFF" />
        </Pressable>

        <View style={styles.hudTitleBadge}>
          <ThemedText style={styles.hudTitleText}>
            SCANNER ACTIVE
          </ThemedText>
        </View>

        <Pressable onPress={() => setTorch(!torch)} style={styles.hudButton}>
          <SvgIcon name="torch" size={16} color={torch ? '#76FF03' : '#FFFFFF'} />
        </Pressable>
      </View>

      {/* Cyber Reticle Viewfinder */}
      <View style={styles.viewfinder}>
        <View style={styles.frame}>
          {/* Neon Corner Brackets */}
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />

          {/* Animated Laser Sweep Line */}
          <Animated.View
            style={[
              styles.laserLine,
              {
                transform: [{ translateY: scanLineAnim }],
              },
            ]}
          />

          {/* Center Aim Crosshair */}
          <View style={styles.reticle}>
            <SvgIcon name="scan-pay" size={32} color="rgba(0, 230, 118, 0.4)" />
          </View>
        </View>

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
        <ThemedText style={[styles.testLabel, { color: '#94A3B8' }]}>
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#151C2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudTitleBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
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
    width: 28,
    height: 28,
    borderColor: '#00E676',
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  laserLine: {
    width: '100%',
    height: 2.5,
    backgroundColor: '#00E676',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  reticle: {
    position: 'absolute',
    top: '44%',
    left: '44%',
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
    padding: Spacing.four,
    borderTopWidth: 1,
    gap: Spacing.two,
    backgroundColor: '#0A0E17',
  },
  testLabel: {
    fontSize: 10,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.8,
  },
  testButtonsRow: {
    flexDirection: 'row',
  },
  testBtn: {
    flex: 1,
    paddingVertical: Spacing.three + 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testBtnText: {
    color: '#07090E',
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.black,
    letterSpacing: 0.5,
  },
});
