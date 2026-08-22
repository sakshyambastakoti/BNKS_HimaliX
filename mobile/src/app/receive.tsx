/**
 * OffPay Receive Screen
 * Generates a payment request QR code for the receiver.
 * Includes amount input and a prominent "Verify Payment" button for offline flows.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NetworkStatusBadge } from '@/components/NetworkStatusBadge';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function ReceiveScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { networkStatus, user } = useAppStore();
  const [amount, setAmount] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);

  const isOffline = networkStatus === 'offline';
  const parsedAmount = parseInt(amount) || 0;
  const isValid = parsedAmount > 0;

  const handleGenerateQR = () => {
    if (isValid) {
      setQrGenerated(true);
    }
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
          {/* Mode indicator */}
          <View style={styles.modeSection}>
            <NetworkStatusBadge />
            <ThemedText style={[styles.modeText, { color: theme.textSecondary }]}>
              {isOffline ? 'Offline — QR handshake' : 'Online — Direct receive'}
            </ThemedText>
          </View>

          {!qrGenerated ? (
            <>
              {/* Amount input */}
              <View style={styles.amountSection}>
                <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
                  ENTER AMOUNT TO RECEIVE
                </ThemedText>
                <View style={[styles.amountContainer, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
                  <ThemedText style={[styles.currencyPrefix, { color: theme.textMuted }]}>
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
              </View>

              {/* Generate QR button */}
              <Pressable
                onPress={handleGenerateQR}
                disabled={!isValid}
                style={({ pressed }) => [
                  styles.generateButton,
                  {
                    backgroundColor: isValid ? theme.primary : theme.border,
                    opacity: pressed && isValid ? 0.85 : 1,
                    transform: [{ scale: pressed && isValid ? 0.98 : 1 }],
                  },
                ]}
              >
                <ThemedText
                  style={[styles.generateButtonText, { color: isValid ? '#0A0A0F' : theme.textMuted }]}
                >
                  Generate Request QR
                </ThemedText>
              </Pressable>
            </>
          ) : (
            <>
              {/* QR Code Display */}
              <View style={styles.qrSection}>
                <View style={[styles.qrContainer, { backgroundColor: '#FFFFFF', borderColor: theme.primary + '40' }]}>
                  {/* Placeholder for QR code - will use react-native-qrcode-svg later */}
                  <View style={styles.qrPlaceholder}>
                    <ThemedText style={styles.qrPlaceholderIcon}>📱</ThemedText>
                    <ThemedText style={[styles.qrPlaceholderText, { color: '#333' }]}>
                      Request QR Code
                    </ThemedText>
                    <ThemedText style={[styles.qrAmount, { color: '#00C853' }]}>
                      NPR {parsedAmount.toLocaleString()}
                    </ThemedText>
                  </View>
                </View>

                <View style={[styles.payloadPreview, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <ThemedText style={[styles.payloadLabel, { color: theme.textSecondary }]}>
                    QR PAYLOAD
                  </ThemedText>
                  <ThemedText style={[styles.payloadText, { color: theme.textMuted }]}>
                    {`{\n  "type": "BONDPAY_REQUEST",\n  "receiverId": "${user?.userId?.slice(0, 12)}...",\n  "amount": ${parsedAmount},\n  "nonce": "a3f7b2..."\n}`}
                  </ThemedText>
                </View>
              </View>

              {/* Verify Payment button (offline) */}
              {isOffline && (
                <Pressable
                  onPress={() => router.push('/scan-qr')}
                  style={({ pressed }) => [
                    styles.verifyButton,
                    {
                      backgroundColor: theme.accent + '20',
                      borderColor: theme.accent,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <ThemedText style={[styles.verifyIcon]}>📷</ThemedText>
                  <ThemedText style={[styles.verifyButtonText, { color: theme.accent }]}>
                    Verify Payment — Scan Sender's QR
                  </ThemedText>
                </Pressable>
              )}

              {/* Reset */}
              <Pressable
                onPress={() => {
                  setQrGenerated(false);
                  setAmount('');
                }}
                style={styles.resetButton}
              >
                <ThemedText style={[styles.resetText, { color: theme.textSecondary }]}>
                  ← New Request
                </ThemedText>
              </Pressable>
            </>
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
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
  modeSection: {
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  modeText: {
    fontSize: FontSize.sm,
  },
  amountSection: {
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    width: '100%',
  },
  currencyPrefix: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginRight: Spacing.two,
  },
  amountInput: {
    flex: 1,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    textAlign: 'center',
  },
  generateButton: {
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  qrSection: {
    alignItems: 'center',
    gap: Spacing.four,
  },
  qrContainer: {
    width: 260,
    height: 260,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  qrPlaceholder: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  qrPlaceholderIcon: {
    fontSize: 48,
  },
  qrPlaceholderText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  qrAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
  },
  payloadPreview: {
    width: '100%',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  payloadLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  payloadText: {
    fontSize: FontSize.xs,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  verifyIcon: { fontSize: 20 },
  verifyButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  resetButton: {
    alignItems: 'center',
    marginTop: Spacing.four,
    paddingVertical: Spacing.three,
  },
  resetText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
});
