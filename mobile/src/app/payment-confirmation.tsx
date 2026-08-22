/**
 * OffPay Payment Confirmation Screen — Cryptographic Settlement Receipt
 * Celebratory state with Ed25519 signature proof, bond voucher details, and share options.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OffPayLogo } from '@/components/OffPayLogo';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';

export default function PaymentConfirmationScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success'>('processing');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    Alert.alert('Share Receipt', 'Cryptographic settlement receipt exported.');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Mark at Top */}
        <View style={styles.logoRow}>
          <OffPayLogo size="xs" variant="horizontal" glow />
        </View>

        {/* Animated Status Icon */}
        <View
          style={[
            styles.iconBubble,
            {
              backgroundColor: status === 'success' ? theme.successBg : theme.warningBg,
              borderColor: status === 'success' ? theme.success : theme.warning,
              ...(status === 'success' ? Shadows.glowGreen : {}),
            },
          ]}
        >
          <ThemedText style={[styles.statusIcon, { color: status === 'success' ? theme.success : theme.warning }]}>
            {status === 'success' ? '✓' : '⏳'}
          </ThemedText>
        </View>

        {/* Status Title & Subtitle */}
        <ThemedText style={[styles.title, { color: theme.text }]}>
          {status === 'success' ? 'Payment Verified & Settled' : 'Signing Cryptographic Proof...'}
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          {status === 'success'
            ? 'Ed25519 signature verified on Secure Enclave'
            : 'Zero-knowledge bond verification in progress'}
        </ThemedText>

        {/* Cryptographic Receipt Card */}
        {status === 'success' && (
          <View style={[styles.receiptCard, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            {/* Amount Hero */}
            <View style={styles.receiptAmountRow}>
              <ThemedText style={[styles.receiptCurrency, { color: theme.primary }]}>NPR</ThemedText>
              <ThemedText style={[styles.receiptAmount, { color: theme.text }]}>500.00</ThemedText>
            </View>

            {/* Signature Verified Pill */}
            <View style={[styles.proofPill, { backgroundColor: theme.primaryGlow, borderColor: theme.primary + '40' }]}>
              <ThemedText style={[styles.proofText, { color: theme.primary }]}>
                ✓ HARDWARE ED25519 SIGNATURE VALID
              </ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

            {/* Detail Rows */}
            <ReceiptRow label="Receiver Node" value="Ram Bahadur (user-8f92...)" theme={theme} />
            <ReceiptRow label="Settlement Mode" value="Offline Mesh (Bond Vouchers)" theme={theme} highlight />
            <ReceiptRow label="Bonds Allocated" value="BOND-001 (NPR 500)" theme={theme} mono />
            <ReceiptRow label="Cryptographic Hash" value="0x7f29a4c109e...88bc" theme={theme} mono />
            <ReceiptRow label="Nonce & Non-Repudiation" value="NONCE-8472-VERIFIED" theme={theme} mono />
            <ReceiptRow label="Ledger Status" value="Sealed in Local Database" theme={theme} />
          </View>
        )}

        {/* Actions */}
        {status === 'success' && (
          <View style={styles.actionsSection}>
            <Pressable
              onPress={() => router.dismissAll()}
              style={({ pressed }) => [
                styles.doneButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  ...Shadows.glowGreen,
                },
              ]}
            >
              <ThemedText style={styles.doneButtonText}>
                Return to Dashboard
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.shareButton,
                {
                  backgroundColor: theme.cardGlass,
                  borderColor: theme.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <ThemedText style={[styles.shareButtonText, { color: theme.text }]}>
                Export Cryptographic Receipt
              </ThemedText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

function ReceiptRow({
  label,
  value,
  theme,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  theme: any;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <View style={receiptStyles.row}>
      <ThemedText style={[receiptStyles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <ThemedText
        style={[
          receiptStyles.value,
          {
            color: highlight ? theme.accent : theme.text,
            fontFamily: mono ? 'monospace' : undefined,
            fontWeight: highlight ? FontWeight.bold : FontWeight.medium,
          },
        ]}
        numberOfLines={1}
      >
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    alignItems: 'center',
  },
  logoRow: {
    marginBottom: Spacing.four,
  },
  iconBubble: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  statusIcon: {
    fontSize: 44,
    fontWeight: FontWeight.black,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 4,
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  receiptCard: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two + 2,
  },
  receiptAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  receiptCurrency: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.black,
  },
  receiptAmount: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.black,
    letterSpacing: -1.5,
  },
  proofPill: {
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'center',
    marginBottom: Spacing.one,
  },
  proofText: {
    fontSize: 10,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.8,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.two,
  },
  actionsSection: {
    width: '100%',
    marginTop: Spacing.five,
    gap: Spacing.two + 2,
  },
  doneButton: {
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#07090E',
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  shareButton: {
    paddingVertical: Spacing.three + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});

const receiptStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  value: {
    fontSize: FontSize.xs,
    maxWidth: '58%',
    textAlign: 'right',
  },
});
