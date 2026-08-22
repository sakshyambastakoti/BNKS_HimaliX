/**
 * OffPay Send Screen — Dual-Engine Online / Offline Transfer
 * Handles both:
 * - Online: Direct validator settlement with receiver ID + amount
 * - Offline: Bond voucher allocation, Ed25519 signing & payment QR generation
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NetworkStatusBadge } from '@/components/NetworkStatusBadge';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';
import { formatNPR, MOCK_BONDS } from '@/constants/mock-data';

const QUICK_AMOUNTS = [100, 500, 1000, 2500];

export default function SendScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { networkStatus, offlineBalance, onlineBalance } = useAppStore();
  const [amount, setAmount] = useState('');
  const [receiverId, setReceiverId] = useState('');

  const isOffline = networkStatus === 'offline';
  const availableBalance = isOffline ? offlineBalance : onlineBalance;
  const parsedAmount = parseInt(amount) || 0;
  const isValid = parsedAmount > 0 && parsedAmount <= availableBalance;

  const handleMax = () => {
    setAmount(String(availableBalance));
  };

  const handleQuickSelect = (val: number) => {
    setAmount(String(val));
  };

  const handleProceed = () => {
    if (isValid) {
      router.push('/payment-confirmation');
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
                {isOffline ? 'OFFLINE BOND PAYMENT ENGINE' : 'ONLINE DIRECT TRANSFER'}
              </ThemedText>
              <ThemedText style={[styles.modeSubtitle, { color: theme.textSecondary }]}>
                {isOffline ? 'Zero-network handshake via signed QR tokens' : 'Instant on-chain settlement'}
              </ThemedText>
            </View>
          </View>

          {/* Offline Scanner Shortcut */}
          {isOffline && (
            <Pressable
              onPress={() => router.push('/scan-qr')}
              style={({ pressed }) => [
                styles.scanCard,
                {
                  backgroundColor: theme.cardGlass,
                  borderColor: theme.accent,
                  opacity: pressed ? 0.85 : 1,
                  ...Shadows.glowAccent,
                },
              ]}
            >
              <View style={[styles.scanIconBubble, { backgroundColor: theme.accent + '20' }]}>
                <ThemedText style={[styles.scanIcon, { color: theme.accent }]}>📷</ThemedText>
              </View>
              <View style={styles.scanDetails}>
                <ThemedText style={[styles.scanTitle, { color: theme.text }]}>
                  Scan Receiver's Request QR
                </ThemedText>
                <ThemedText style={[styles.scanSubtitle, { color: theme.textMuted }]}>
                  Auto-fills receiver key and requested amount
                </ThemedText>
              </View>
              <ThemedText style={[styles.scanChevron, { color: theme.accent }]}>›</ThemedText>
            </Pressable>
          )}

          {/* Transfer Form Card */}
          <View style={[styles.formCard, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            {/* Receiver Field (Online Mode) */}
            {!isOffline && (
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  RECEIVER NODE ADDRESS / PHONE
                </ThemedText>
                <TextInput
                  value={receiverId}
                  onChangeText={setReceiverId}
                  placeholder="Enter receiver public key or +977-..."
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.cardElevated,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                />
              </View>
            )}

            {/* Amount Section */}
            <View style={styles.inputGroup}>
              <View style={styles.amountLabelRow}>
                <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  AMOUNT (NPR)
                </ThemedText>
                <ThemedText style={[styles.balanceHint, { color: theme.textMuted }]}>
                  Available: <ThemedText style={{ color: theme.primary, fontWeight: FontWeight.bold }}>{formatNPR(availableBalance)}</ThemedText>
                </ThemedText>
              </View>

              <View style={[styles.amountContainer, { backgroundColor: theme.cardElevated, borderColor: parsedAmount > availableBalance ? theme.error : theme.border }]}>
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

              {/* Quick Denominations */}
              <View style={styles.quickAmountsRow}>
                {QUICK_AMOUNTS.map((val) => (
                  <Pressable
                    key={val}
                    onPress={() => handleQuickSelect(val)}
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
                      +{val}
                    </ThemedText>
                  </Pressable>
                ))}
                <Pressable
                  onPress={handleMax}
                  style={({ pressed }) => [
                    styles.quickAmountChip,
                    {
                      backgroundColor: theme.accent + '20',
                      borderColor: theme.accent,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <ThemedText style={[styles.quickAmountText, { color: theme.accent }]}>
                    MAX
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Offline Bond Allocation Preview */}
            {isOffline && parsedAmount > 0 && (
              <View style={[styles.bondAllocationBox, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
                <View style={styles.bondAllocHeader}>
                  <ThemedText style={[styles.bondAllocTitle, { color: theme.textSecondary }]}>
                    ALLOCATED OFFLINE BONDS
                  </ThemedText>
                  <ThemedText style={[styles.bondAllocStatus, { color: theme.accent }]}>
                    ✓ Signed by Secure Enclave
                  </ThemedText>
                </View>
                {MOCK_BONDS.filter((b) => b.status === 'available')
                  .slice(0, 2)
                  .map((bond) => (
                    <View key={bond.bondId} style={styles.bondAllocRow}>
                      <ThemedText style={[styles.bondAllocId, { color: theme.textMuted }]}>
                        {bond.bondId} • SHA-256
                      </ThemedText>
                      <ThemedText style={[styles.bondAllocVal, { color: theme.accent }]}>
                        NPR {bond.value}
                      </ThemedText>
                    </View>
                  ))}
              </View>
            )}
          </View>

          {/* Submit Action Button */}
          <Pressable
            onPress={handleProceed}
            disabled={!isValid}
            style={({ pressed }) => [
              styles.submitButton,
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
                styles.submitButtonText,
                { color: isValid ? '#07090E' : theme.textMuted },
              ]}
            >
              {isOffline ? 'Sign & Generate Payment QR' : 'Send Instant Transfer'}
            </ThemedText>
          </Pressable>
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
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  scanIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: { fontSize: FontSize.xl },
  scanDetails: { flex: 1 },
  scanTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  scanSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  scanChevron: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  formCard: {
    padding: Spacing.four,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.four,
  },
  inputGroup: {
    gap: Spacing.one + 2,
  },
  amountLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: FontSize.xxs + 1,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1,
  },
  balanceHint: {
    fontSize: FontSize.xs,
  },
  input: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: FontSize.md,
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
  bondAllocationBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two,
  },
  bondAllocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bondAllocTitle: {
    fontSize: FontSize.xxs + 1,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.8,
  },
  bondAllocStatus: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.bold,
  },
  bondAllocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bondAllocId: {
    fontSize: FontSize.xs,
    fontFamily: 'monospace',
  },
  bondAllocVal: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  submitButton: {
    marginTop: Spacing.five,
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
