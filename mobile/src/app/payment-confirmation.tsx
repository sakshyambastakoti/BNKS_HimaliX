/**
 * OffPay Payment Confirmation Screen
 * Shows transaction summary and success/failure state.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function PaymentConfirmationScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

  // Simulate payment processing
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const statusConfig = {
    processing: { icon: '⏳', title: 'Processing...', color: theme.warning },
    success: { icon: '✓', title: 'Payment Successful!', color: theme.success },
    failed: { icon: '✗', title: 'Payment Failed', color: theme.error },
  };

  const current = statusConfig[status];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Status icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: current.color + '18', borderColor: current.color + '40' },
          ]}
        >
          <ThemedText style={[styles.statusIcon, { color: current.color }]}>
            {current.icon}
          </ThemedText>
        </View>

        {/* Title */}
        <ThemedText style={[styles.title, { color: current.color }]}>
          {current.title}
        </ThemedText>

        {/* Transaction details */}
        {status === 'success' && (
          <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <DetailRow label="Amount" value="NPR 500" theme={theme} highlight />
            <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
            <DetailRow label="To" value="Ram Bahadur" theme={theme} />
            <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
            <DetailRow label="Type" value="Offline (Bond)" theme={theme} />
            <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
            <DetailRow label="Status" value="Pending Sync" theme={theme} />
            <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
            <DetailRow label="TX ID" value="tx-a3f7b2..." theme={theme} mono />
            <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
            <DetailRow label="Bonds Used" value="BOND-001, BOND-003" theme={theme} mono />
          </View>
        )}

        {/* Signature badge */}
        {status === 'success' && (
          <View style={[styles.signatureBadge, { backgroundColor: theme.success + '15', borderColor: theme.success + '30' }]}>
            <ThemedText style={[styles.signatureText, { color: theme.success }]}>
              ✓ Ed25519 signature verified
            </ThemedText>
          </View>
        )}
      </View>

      {/* Bottom action */}
      {status !== 'processing' && (
        <View style={styles.bottomActions}>
          <Pressable
            onPress={() => router.dismissAll()}
            style={({ pressed }) => [
              styles.doneButton,
              {
                backgroundColor: theme.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <ThemedText style={styles.doneButtonText}>
              Done
            </ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

function DetailRow({
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
    <View style={detailStyles.row}>
      <ThemedText style={[detailStyles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <ThemedText
        style={[
          detailStyles.value,
          {
            color: highlight ? theme.primary : theme.text,
            fontWeight: highlight ? FontWeight.extrabold : FontWeight.medium,
            fontFamily: mono ? 'monospace' : undefined,
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 48,
    fontWeight: FontWeight.bold,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
  },
  detailsCard: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
  },
  detailDivider: {
    height: 1,
    marginVertical: Spacing.two,
  },
  signatureBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  signatureText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  bottomActions: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
  },
  doneButton: {
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#0A0A0F',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  value: {
    fontSize: FontSize.sm,
    maxWidth: '60%',
    textAlign: 'right',
  },
});
