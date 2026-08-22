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
import { SvgIcon } from '@/components/SvgIcons';
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
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  opacity: pressed ? 0.85 : 1,
                  ...Shadows.card,
                },
              ]}
            >
              <View style={[styles.scanIconBubble, { backgroundColor: theme.primaryGlow }]}>
                <SvgIcon name="scan-pay" size={20} color={theme.primary} />
              </View>
              <View style={styles.scanDetails}>
                <ThemedText style={[styles.scanTitle, { color: theme.text }]}>
                  Scan Receiver's Request QR
                </ThemedText>
                <ThemedText style={[styles.scanSubtitle, { color: theme.textSecondary }]}>
                  Auto-fills receiver key and requested amount
                </ThemedText>
              </View>
              <SvgIcon name="chevron-right" size={14} color={theme.primary} />
            </Pressable>
          )}

          {/* Transfer Form Card */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
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
                  placeholderTextColor={theme.textSecondary}
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
                <ThemedText style={[styles.balanceHint, { color: theme.textSecondary }]}>
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
                  placeholderTextColor={theme.textSecondary}
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
                        { color: parsedAmount === val ? '#FFFFFF' : theme.text },
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
                      backgroundColor: theme.successBg,
                      borderColor: theme.primary,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <ThemedText style={[styles.quickAmountText, { color: theme.primary }]}>
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
                  <View style={styles.signedBadge}>
                    <SvgIcon name="check" size={12} color="#00A859" />
                    <ThemedText style={[styles.bondAllocStatus, { color: theme.primary }]}>
                      Signed by Enclave
                    </ThemedText>
                  </View>
                </View>
                {MOCK_BONDS.filter((b) => b.status === 'available')
                  .slice(0, 2)
                  .map((bond) => (
                    <View key={bond.bondId} style={styles.bondAllocRow}>
                      <ThemedText style={[styles.bondAllocId, { color: theme.textSecondary }]}>
                        {bond.bondId} • SHA-256
                      </ThemedText>
                      <ThemedText style={[styles.bondAllocVal, { color: theme.primary }]}>
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
                backgroundColor: isValid ? theme.primaryDark : theme.border,
                opacity: pressed && isValid ? 0.88 : 1,
                transform: [{ scale: pressed && isValid ? 0.98 : 1 }],
              },
            ]}
          >
            <ThemedText
              style={[
                styles.submitButtonText,
                { color: isValid ? '#FFFFFF' : theme.textSecondary },
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
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  scanIconBubble: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanDetails: {
    flex: 1,
    gap: 2,
  },
  scanTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  scanSubtitle: {
    fontSize: FontSize.xxs,
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  inputGroup: {
    gap: Spacing.two,
  },
  inputLabel: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    fontSize: FontSize.sm,
  },
  amountLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceHint: {
    fontSize: FontSize.xxs,
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
    marginTop: Spacing.one,
  },
  quickAmountChip: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAmountText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
  },
  bondAllocationBox: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  bondAllocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bondAllocTitle: {
    fontSize: 10,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  signedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bondAllocStatus: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
  bondAllocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bondAllocId: {
    fontSize: FontSize.xxs,
    fontFamily: 'monospace',
  },
  bondAllocVal: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  submitButton: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
});
