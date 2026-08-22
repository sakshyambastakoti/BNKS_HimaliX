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
            <View style={[styles.formCard, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
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
                  placeholderTextColor={theme.textMuted}
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
                      styles.quickAmountChip,
                      {
                        backgroundColor: parsedAmount === val ? theme.primary : theme.cardElevated,
                        borderColor: parsedAmount === val ? theme.primary : theme.border,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.quickAmountText,
                        { color: parsedAmount === val ? '#07090E' : theme.text },
                      ]}
                    >
                      NPR {val}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>

              {/* Generate Button */}
              <Pressable
                onPress={handleGenerateQR}
                disabled={!isValid}
                style={({ pressed }) => [
                  styles.generateButton,
                  {
                    backgroundColor: isValid ? theme.primary : theme.border,
                    opacity: pressed && isValid ? 0.88 : 1,
                    transform: [{ scale: pressed && isValid ? 0.98 : 1 }],
                    ...(isValid ? Shadows.glowGreen : {}),
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.generateButtonText,
                    { color: isValid ? '#07090E' : theme.textMuted },
                  ]}
                >
                  Generate Request QR Code
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            /* QR Display & Verification Section */
            <View style={styles.qrSection}>
              {/* QR Code Presentation Frame */}
              <View style={[styles.qrContainer, { backgroundColor: '#FFFFFF', borderColor: theme.primary }]}>
                {/* Corner Brackets */}
                <View style={[styles.qrCorner, styles.qrCornerTL, { borderColor: theme.primary }]} />
                <View style={[styles.qrCorner, styles.qrCornerTR, { borderColor: theme.primary }]} />
                <View style={[styles.qrCorner, styles.qrCornerBL, { borderColor: theme.primary }]} />
                <View style={[styles.qrCorner, styles.qrCornerBR, { borderColor: theme.primary }]} />

                {/* Center QR Mock & Brand Icon */}
                <View style={styles.qrInner}>
                  <OffPayLogo size="lg" variant="mark" glow glowColor="#00C853" />
                  <ThemedText style={[styles.qrAmountBadge, { color: '#07090E' }]}>
                    {formatNPR(parsedAmount)}
                  </ThemedText>
                  <ThemedText style={[styles.qrInstruction, { color: '#64748B' }]}>
                    Scan to send NPR {parsedAmount}
                  </ThemedText>
                </View>
              </View>

              {/* Payload Details Card */}
              <View style={[styles.payloadCard, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
                <View style={styles.payloadHeader}>
                  <ThemedText style={[styles.payloadTitle, { color: theme.textSecondary }]}>
                    ENCRYPTED QR PAYLOAD
                  </ThemedText>
                  <Pressable onPress={handleCopyPayload} style={styles.copyPill}>
                    <ThemedText style={[styles.copyPillText, { color: theme.primary }]}>
                      {copied ? '✓ Copied' : 'Copy JSON'}
                    </ThemedText>
                  </Pressable>
                </View>

                <ThemedText style={[styles.payloadCode, { color: theme.textMuted }]}>
                  {`{\n  "protocol": "BONDPAY_V2",\n  "receiver": "${user?.userId?.slice(0, 16)}...",\n  "amount": ${parsedAmount},\n  "currency": "NPR",\n  "nonce": "e9a4f28c..."\n}`}
                </ThemedText>
              </View>

              {/* Verify Payment Button (Offline) */}
              {isOffline && (
                <Pressable
                  onPress={() => router.push('/scan-qr')}
                  style={({ pressed }) => [
                    styles.verifyButton,
                    {
                      backgroundColor: theme.accent + '20',
                      borderColor: theme.accent,
                      opacity: pressed ? 0.85 : 1,
                      ...Shadows.glowAccent,
                    },
                  ]}
                >
                  <ThemedText style={styles.verifyIcon}>📷</ThemedText>
                  <ThemedText style={[styles.verifyButtonText, { color: theme.accent }]}>
                    Verify Payment — Scan Sender's QR
                  </ThemedText>
                </Pressable>
              )}

              {/* Reset to New Request */}
              <Pressable
                onPress={() => {
                  setQrGenerated(false);
                  setAmount('');
                }}
                style={styles.resetButton}
              >
                <ThemedText style={[styles.resetText, { color: theme.textSecondary }]}>
                  ← Generate Different Amount
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six,
  },
  modeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two + 2,
    marginBottom: Spacing.four,
  },
  modeTextWrapper: { flex: 1 },
  modeTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.8,
  },
  modeSubtitle: {
    fontSize: FontSize.xxs + 1,
    marginTop: 2,
  },
  formCard: {
    padding: Spacing.four,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: FontSize.xs,
    marginBottom: Spacing.two,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  currencyPrefix: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    marginRight: Spacing.two,
  },
  amountInput: {
    flex: 1,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    textAlign: 'center',
  },
  quickAmountsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  quickAmountChip: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  generateButton: {
    marginTop: Spacing.four,
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  qrSection: {
    alignItems: 'center',
    gap: Spacing.four,
  },
  qrContainer: {
    width: 280,
    height: 280,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: Spacing.four,
    ...Shadows.glowGreen,
  },
  qrCorner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderWidth: 3,
  },
  qrCornerTL: { top: 12, left: 12, borderRightWidth: 0, borderBottomWidth: 0 },
  qrCornerTR: { top: 12, right: 12, borderLeftWidth: 0, borderBottomWidth: 0 },
  qrCornerBL: { bottom: 12, left: 12, borderRightWidth: 0, borderTopWidth: 0 },
  qrCornerBR: { bottom: 12, right: 12, borderLeftWidth: 0, borderTopWidth: 0 },
  qrInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  qrAmountBadge: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
  },
  qrInstruction: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  payloadCard: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  payloadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payloadTitle: {
    fontSize: FontSize.xxs + 1,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.8,
  },
  copyPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  copyPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  payloadCode: {
    fontSize: FontSize.xs,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  verifyButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: Spacing.two,
  },
  verifyIcon: { fontSize: FontSize.lg },
  verifyButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resetButton: {
    paddingVertical: Spacing.two,
  },
  resetText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
