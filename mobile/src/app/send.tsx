/**
 * OffPay Send Screen
 * Handles both online and offline sending.
 * - Online: Input receiver ID + amount → submit
 * - Offline: Scan receiver's Request QR → select bonds → sign → generate Payment QR
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NetworkStatusBadge } from '@/components/NetworkStatusBadge';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { formatNPR, MOCK_BONDS } from '@/constants/mock-data';

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
              {isOffline ? 'Offline — Bond payment via QR' : 'Online — Direct transfer'}
            </ThemedText>
          </View>

          {/* Scan QR option (offline mode) */}
          {isOffline && (
            <Pressable
              onPress={() => router.push('/scan-qr')}
              style={[
                styles.scanButton,
                {
                  backgroundColor: theme.primary + '15',
                  borderColor: theme.primary + '40',
                },
              ]}
            >
              <ThemedText style={[styles.scanIcon]}>📷</ThemedText>
              <View style={styles.scanTextContainer}>
                <ThemedText style={[styles.scanTitle, { color: theme.primary }]}>
                  Scan Request QR
                </ThemedText>
                <ThemedText style={[styles.scanSubtitle, { color: theme.textSecondary }]}>
                  Scan the receiver's payment request QR code
                </ThemedText>
              </View>
              <ThemedText style={[styles.scanChevron, { color: theme.primary }]}>›</ThemedText>
            </Pressable>
          )}

          {/* Manual entry section */}
          <View style={styles.formSection}>
            <ThemedText style={[styles.formLabel, { color: theme.textSecondary }]}>
              {isOffline ? 'OR ENTER MANUALLY' : 'TRANSFER DETAILS'}
            </ThemedText>

            {/* Receiver ID */}
            {!isOffline && (
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Receiver ID
                </ThemedText>
                <TextInput
                  value={receiverId}
                  onChangeText={setReceiverId}
                  placeholder="Enter receiver's UUID"
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

            {/* Amount */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Amount (NPR)
              </ThemedText>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                style={[
                  styles.amountInput,
                  {
                    backgroundColor: theme.cardElevated,
                    color: theme.text,
                    borderColor: parsedAmount > availableBalance ? theme.error : theme.border,
                  },
                ]}
              />
              <ThemedText style={[styles.balanceHint, { color: theme.textMuted }]}>
                Available: {formatNPR(availableBalance)} ({isOffline ? 'Offline bonds' : 'Online balance'})
              </ThemedText>
            </View>

            {/* Bond selection preview (offline mode) */}
            {isOffline && parsedAmount > 0 && (
              <View style={[styles.bondPreview, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <ThemedText style={[styles.bondPreviewTitle, { color: theme.textSecondary }]}>
                  BONDS TO USE
                </ThemedText>
                {MOCK_BONDS.filter((b) => b.status === 'available')
                  .slice(0, 3)
                  .map((bond) => (
                    <View key={bond.bondId} style={styles.bondRow}>
                      <ThemedText style={[styles.bondId, { color: theme.textMuted }]}>
                        {bond.bondId}
                      </ThemedText>
                      <ThemedText style={[styles.bondValue, { color: theme.accent }]}>
                        NPR {bond.value}
                      </ThemedText>
                    </View>
                  ))}
              </View>
            )}
          </View>

          {/* Send button */}
          <Pressable
            onPress={() => {
              if (isValid) {
                router.push('/payment-confirmation');
              }
            }}
            disabled={!isValid}
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor: isValid ? theme.primary : theme.border,
                opacity: pressed && isValid ? 0.85 : 1,
                transform: [{ scale: pressed && isValid ? 0.98 : 1 }],
              },
            ]}
          >
            <ThemedText style={[styles.sendButtonText, { color: isValid ? '#0A0A0F' : theme.textMuted }]}>
              {isOffline ? 'Generate Payment QR' : 'Send Money'}
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
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
  modeSection: {
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  modeText: {
    fontSize: FontSize.sm,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  scanIcon: { fontSize: 28 },
  scanTextContainer: { flex: 1 },
  scanTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  scanSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  scanChevron: {
    fontSize: FontSize.xxl,
  },
  formSection: {
    gap: Spacing.four,
  },
  formLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  inputGroup: {
    gap: Spacing.two,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  input: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: FontSize.md,
  },
  amountInput: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    textAlign: 'center',
  },
  balanceHint: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  bondPreview: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  bondPreviewTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  bondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bondId: {
    fontSize: FontSize.sm,
    fontFamily: 'monospace',
  },
  bondValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  sendButton: {
    marginTop: Spacing.five,
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
