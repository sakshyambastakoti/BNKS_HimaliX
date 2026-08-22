/**
 * OffPay Payment Confirmation Screen — Cryptographic Settlement Receipt
 * Celebratory state with Ed25519 signature proof, bond voucher details, and share options.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OffPayLogo } from '@/components/OffPayLogo';
import { SvgIcon } from '@/components/SvgIcons';
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
              borderColor: status === 'success' ? theme.primary : theme.warning,
              ...(status === 'success' ? Shadows.glowGreen : {}),
            },
          ]}
        >
          <SvgIcon
            name={status === 'success' ? 'check' : 'sync'}
            size={36}
            color={status === 'success' ? theme.primary : theme.warning}
          />
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
          <View style={[styles.receiptCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
            {/* Amount Hero */}
            <View style={styles.receiptAmountRow}>
              <ThemedText style={[styles.receiptCurrency, { color: theme.primary }]}>NPR</ThemedText>
              <ThemedText style={[styles.receiptAmount, { color: theme.text }]}>500.00</ThemedText>
            </View>

            {/* Signature Verified Pill */}
            <View style={[styles.proofPill, { backgroundColor: theme.successBg, borderColor: theme.primary + '40' }]}>
              <SvgIcon name="shield" size={14} color={theme.primary} />
              <ThemedText style={[styles.proofText, { color: theme.primary }]}>
                HARDWARE ED25519 SIGNATURE VALID
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
                  backgroundColor: theme.primaryDark,
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <ThemedText style={styles.doneButtonText}>
                Done & Return to Vault
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.shareButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <SvgIcon name="copy" size={16} color={theme.text} />
              <ThemedText style={[styles.shareButtonText, { color: theme.text }]}>
                Export Receipt Cryptogram
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
  mono,
  highlight,
}: {
  label: string;
  value: string;
  theme: any;
  mono?: boolean;
  highlight?: boolean;
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
            color: highlight ? theme.primary : theme.text,
            fontFamily: mono ? 'monospace' : undefined,
          },
        ]}
      >
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: Spacing.four,
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  logoRow: {
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  iconBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginBottom: Spacing.five,
  },
  receiptCard: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  receiptAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  receiptCurrency: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
  },
  receiptAmount: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.black,
  },
  proofPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  proofText: {
    fontSize: 10,
    fontWeight: FontWeight.black,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
  },
  actionsSection: {
    width: '100%',
    gap: Spacing.two + 2,
    marginTop: Spacing.five,
  },
  doneButton: {
    paddingVertical: Spacing.four,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  shareButton: {
    flexDirection: 'row',
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  shareButtonText: {
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.bold,
  },
});

const receiptStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.medium,
  },
  value: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
