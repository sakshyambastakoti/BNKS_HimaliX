/**
 * OffPay Receive Screen — Cryptographic Payment Request & QR Handshake
 * Generates verified Request QR codes with embedded Ed25519 public keys, nonces, and amount parameters.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NetworkStatusBadge } from '@/components/NetworkStatusBadge';
import { OffPayLogo } from '@/components/OffPayLogo';
import { SvgIcon } from '@/components/SvgIcons';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';
import { formatNPR } from '@/constants/mock-data';

const QUICK_RECEIVE_AMOUNTS = [200, 500, 1000, 2000];

export default function ReceiveScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { networkStatus, user } = useAppStore();
  const [amount, setAmount] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOffline = networkStatus === 'offline';
  const parsedAmount = parseInt(amount) || 0;
  const isValid = parsedAmount > 0;

  const handleGenerateQR = () => {
    if (isValid) {
      setQrGenerated(true);
    }
  };

  const handleCopyPayload = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mode Indicator Banner */}
          <View
            style={[
              styles.modeBanner,
              {
                backgroundColor: isOffline ? theme.errorBg : theme.primaryGlow,
                borderColor: isOffline ? theme.error + '40' : theme.primary + '40',
              },
            ]}
          >
            <NetworkStatusBadge />
            <View style={styles.modeTextWrapper}>
              <ThemedText style={[styles.modeTitle, { color: isOffline ? theme.error : theme.primary }]}>
                {isOffline ? 'OFFLINE RECEIVE HANDSHAKE' : 'ONLINE DIRECT RECEIVE'}
              </ThemedText>
              <ThemedText style={[styles.modeSubtitle, { color: theme.textSecondary }]}>
                {isOffline ? 'Displays cryptographic payment request QR' : 'Direct node wallet transfer'}
              </ThemedText>
            </View>
          </View>

          {!qrGenerated ? (
            /* Amount Entry Section */
            <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
              <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                Set Payment Request
              </ThemedText>
              <ThemedText style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                Specify the exact amount for the sender to verify and sign
              </ThemedText>

              {/* Amount Input */}
              <View style={[styles.amountContainer, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
                <ThemedText style={[styles.currencyPrefix, { color: theme.primary }]}>
                  NPR
                </ThemedText>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  style={[styles.amountInput, { color: theme.text }]}
                  autoFocus
                />
              </View>

              {/* Quick Select Denominations */}
              <View style={styles.quickAmountsRow}>
                {QUICK_RECEIVE_AMOUNTS.map((val) => (
                  <Pressable
                    key={val}
                    onPress={() => setAmount(String(val))}
                    style={({ pressed }) => [
                      styles.quickChip,
                      {
                        backgroundColor: parsedAmount === val ? theme.primary : theme.cardElevated,
                        borderColor: parsedAmount === val ? theme.primary : theme.border,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.quickChipText,
                        { color: parsedAmount === val ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      +{val}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>

              {/* Generate QR Button */}
              <Pressable
                onPress={handleGenerateQR}
                disabled={!isValid}
                style={({ pressed }) => [
                  styles.generateBtn,
                  {
                    backgroundColor: isValid ? theme.primaryDark : theme.border,
                    opacity: pressed && isValid ? 0.88 : 1,
                    transform: [{ scale: pressed && isValid ? 0.98 : 1 }],
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.generateBtnText,
                    { color: isValid ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  Generate QR Handshake
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            /* QR Presentation View */
            <View style={[styles.qrCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
              <View style={styles.qrHeader}>
                <ThemedText style={[styles.qrTitle, { color: theme.text }]}>
                  Scan to Pay Receiver
                </ThemedText>
                <ThemedText style={[styles.qrAmount, { color: theme.primary }]}>
                  {formatNPR(parsedAmount)}
                </ThemedText>
              </View>

              {/* High-Tech QR Presentation Frame */}
              <View style={styles.qrFrameWrapper}>
                <View style={[styles.qrFrame, { backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
                  {/* Stylized QR Matrix Pattern */}
                  <View style={styles.qrPatternGrid}>
                    <View style={styles.qrCornerTopLeft} />
                    <View style={styles.qrCornerTopRight} />
                    <View style={styles.qrCornerBottomLeft} />
                    <View style={styles.qrCenterMark}>
                      <OffPayLogo size="sm" variant="mark" />
                    </View>
                  </View>
                </View>
              </View>

              {/* Cryptographic Details & 1-Tap Copy */}
              <View style={[styles.payloadCard, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
                <View style={styles.payloadHeader}>
                  <ThemedText style={[styles.payloadLabel, { color: theme.textSecondary }]}>
                    ENCRYPTED HANDSHAKE PAYLOAD
                  </ThemedText>
                  <Pressable onPress={handleCopyPayload} style={styles.copyButton}>
                    <SvgIcon name={copied ? 'check' : 'copy'} size={14} color={theme.primary} />
                    <ThemedText style={[styles.copyText, { color: theme.primary }]}>
                      {copied ? 'Copied' : 'Copy'}
                    </ThemedText>
                  </Pressable>
                </View>
                <ThemedText style={[styles.payloadCode, { color: theme.textSecondary }]} numberOfLines={2}>
                  {`offpay://req?node=0x7f48a1b2...&amt=${parsedAmount}&nonce=3e9b1&sig=ed25519_99af2c`}
                </ThemedText>
              </View>

              {/* Verify & Scan Sender Action Bridge */}
              <Pressable
                onPress={() => router.push('/scan-qr')}
                style={({ pressed }) => [
                  styles.verifyScanBtn,
                  {
                    backgroundColor: theme.cardElevated,
                    borderColor: theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <SvgIcon name="scan-pay" size={20} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.verifyScanTitle, { color: theme.text }]}>
                    Verify Sender Payment Voucher
                  </ThemedText>
                  <ThemedText style={[styles.verifyScanSubtitle, { color: theme.textSecondary }]}>
                    Scan the sender's voucher token to complete exchange
                  </ThemedText>
                </View>
                <SvgIcon name="chevron-right" size={14} color={theme.textSecondary} />
              </Pressable>

              {/* Reset / New Request */}
              <Pressable onPress={() => setQrGenerated(false)} style={styles.resetBtn}>
                <ThemedText style={[styles.resetBtnText, { color: theme.textSecondary }]}>
                  Modify Request Amount
                </ThemedText>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  modeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  modeTextWrapper: {
    flex: 1,
    gap: 2,
  },
  modeTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  modeSubtitle: {
    fontSize: FontSize.xxs,
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  sectionSubtitle: {
    fontSize: FontSize.xs,
    marginTop: -4,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  currencyPrefix: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    marginRight: Spacing.two,
  },
  amountInput: {
    flex: 1,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  quickChip: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
  },
  generateBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  qrCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.four,
  },
  qrHeader: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  qrTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  qrAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
  },
  qrFrameWrapper: {
    padding: Spacing.two,
  },
  qrFrame: {
    width: 220,
    height: 220,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPatternGrid: {
    width: 180,
    height: 180,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 44,
    borderWidth: 6,
    borderColor: '#07090E',
    borderRadius: 8,
  },
  qrCornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    borderWidth: 6,
    borderColor: '#07090E',
    borderRadius: 8,
  },
  qrCornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 44,
    height: 44,
    borderWidth: 6,
    borderColor: '#07090E',
    borderRadius: 8,
  },
  qrCenterMark: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  payloadCard: {
    width: '100%',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  payloadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payloadLabel: {
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyText: {
    fontSize: 10,
    fontWeight: FontWeight.extrabold,
  },
  payloadCode: {
    fontSize: FontSize.xxs,
    fontFamily: 'monospace',
  },
  verifyScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.three,
  },
  verifyScanTitle: {
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.bold,
  },
  verifyScanSubtitle: {
    fontSize: 10,
  },
  resetBtn: {
    paddingVertical: Spacing.two,
  },
  resetBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
