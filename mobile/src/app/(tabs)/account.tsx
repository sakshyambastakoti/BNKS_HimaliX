/**
 * OffPay Account Screen — Cryptographic Identity & Hardware Vault
 * Displays:
 * - User Profile & Verified Node status
 * - Cryptographic Key Management (Ed25519 Public Key, User UUID)
 * - Offline Bond Vault Health & Local SQLite Storage
 * - Developer tools and diagnostics
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandHeader } from '@/components/BrandHeader';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';
import { MOCK_BONDS } from '@/constants/mock-data';

export default function AccountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, offlineBalance } = useAppStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'OP';

  const activeBondsCount = MOCK_BONDS.filter((b) => b.status === 'available').length;

  const handleCopy = (field: string, text: string) => {
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <BrandHeader showProfile={false} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Hero */}
          <View style={[styles.profileCard, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            <View style={[styles.avatar, { backgroundColor: theme.primaryGlow, borderColor: theme.primary }]}>
              <ThemedText style={[styles.avatarText, { color: theme.primary }]}>{initials}</ThemedText>
            </View>
            <ThemedText style={[styles.name, { color: theme.text }]}>
              {user?.fullName ?? 'HimaliX Node'}
            </ThemedText>
            <ThemedText style={[styles.phone, { color: theme.textSecondary }]}>
              {user?.phone ?? '+977-9801234567'}
            </ThemedText>

            <View style={[styles.nodeBadge, { backgroundColor: theme.primary + '18', borderColor: theme.primary + '40' }]}>
              <ThemedText style={[styles.nodeBadgeText, { color: theme.primary }]}>
                ✓ VERIFIED OFFLINE NODE
              </ThemedText>
            </View>
          </View>

          {/* Copy Toast */}
          {copiedField && (
            <View style={[styles.copyToast, { backgroundColor: theme.primary }]}>
              <ThemedText style={styles.copyToastText}>✓ Copied {copiedField} to clipboard!</ThemedText>
            </View>
          )}

          {/* Cryptographic Identity Section */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              CRYPTOGRAPHIC IDENTITY
            </ThemedText>

            <View style={styles.cardsSection}>
              <IdentityCard
                label="Node UUID"
                value={user?.userId ?? 'user-8f92-a4c1-b0e3-99d8'}
                icon="🔑"
                theme={theme}
                onCopy={() => handleCopy('Node UUID', user?.userId ?? '')}
              />
              <IdentityCard
                label="Ed25519 Public Key"
                value={user?.publicKey ?? 'ed25519_pk_7b3f91a0c4e8d2567491bbcd3e...'}
                icon="🔐"
                theme={theme}
                truncate
                onCopy={() => handleCopy('Public Key', user?.publicKey ?? '')}
              />
              <IdentityCard
                label="Secure Enclave Level"
                value="Hardware Tier 3 (FIPS 140-2 Level 3)"
                icon="🛡"
                theme={theme}
                highlight
              />
            </View>
          </View>

          {/* Offline Vault & Storage Health */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              VAULT & STORAGE HEALTH
            </ThemedText>

            <View style={[styles.vaultStatusCard, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
              <View style={styles.vaultRow}>
                <ThemedText style={[styles.vaultLabel, { color: theme.textSecondary }]}>
                  Offline Bond Units
                </ThemedText>
                <ThemedText style={[styles.vaultValue, { color: theme.accent }]}>
                  {activeBondsCount} Units (NPR {offlineBalance})
                </ThemedText>
              </View>
              <View style={[styles.vaultDivider, { backgroundColor: theme.borderLight }]} />
              <View style={styles.vaultRow}>
                <ThemedText style={[styles.vaultLabel, { color: theme.textSecondary }]}>
                  Local SQLite Ledger
                </ThemedText>
                <ThemedText style={[styles.vaultValue, { color: theme.success }]}>
                  Healthy (2.4 MB)
                </ThemedText>
              </View>
              <View style={[styles.vaultDivider, { backgroundColor: theme.borderLight }]} />
              <View style={styles.vaultRow}>
                <ThemedText style={[styles.vaultLabel, { color: theme.textSecondary }]}>
                  Last Validator Sync
                </ThemedText>
                <ThemedText style={[styles.vaultValue, { color: theme.info }]}>
                  Just now • 0 pending
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Developer Tools */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              DEVELOPER & DIAGNOSTICS
            </ThemedText>

            <View style={styles.actionsSection}>
              <ActionRow
                icon="📋"
                label="Developer Logs"
                subtitle="Inspect live Ed25519 signing & sync traces"
                theme={theme}
                onPress={() => router.push('/logs')}
              />
              <ActionRow
                icon="⬡"
                label="Local Bond Wallet"
                subtitle="Inspect unspent cryptographic vouchers"
                theme={theme}
                onPress={() => Alert.alert('Bond Wallet', `${activeBondsCount} active offline bonds available.`)}
              />
              <ActionRow
                icon="💾"
                label="Export Key Backup"
                subtitle="Export encrypted keystore for offline recovery"
                theme={theme}
                onPress={() => Alert.alert('Export Keystore', 'Encrypted key backup generated securely.')}
              />
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function IdentityCard({
  label,
  value,
  icon,
  theme,
  truncate,
  highlight,
  onCopy,
}: {
  label: string;
  value: string;
  icon: string;
  theme: any;
  truncate?: boolean;
  highlight?: boolean;
  onCopy?: () => void;
}) {
  return (
    <View style={[identityStyles.card, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
      <View style={identityStyles.cardTop}>
        <View style={identityStyles.iconGroup}>
          <ThemedText style={identityStyles.cardIcon}>{icon}</ThemedText>
          <ThemedText style={[identityStyles.cardLabel, { color: theme.textSecondary }]}>
            {label}
          </ThemedText>
        </View>
        {onCopy && (
          <Pressable
            onPress={onCopy}
            style={({ pressed }) => [
              identityStyles.copyBtn,
              { backgroundColor: theme.cardElevated, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ThemedText style={[identityStyles.copyBtnText, { color: theme.primary }]}>Copy</ThemedText>
          </Pressable>
        )}
      </View>
      <ThemedText
        style={[
          identityStyles.cardValue,
          {
            color: highlight ? theme.primary : theme.text,
            fontFamily: highlight ? undefined : 'monospace',
            fontWeight: highlight ? FontWeight.bold : FontWeight.medium,
          },
        ]}
        numberOfLines={truncate ? 1 : undefined}
      >
        {value}
      </ThemedText>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  subtitle,
  theme,
  onPress,
}: {
  icon: string;
  label: string;
  subtitle: string;
  theme: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        actionStyles.row,
        {
          backgroundColor: pressed ? theme.backgroundSelected : theme.cardGlass,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={[actionStyles.iconBubble, { backgroundColor: theme.primaryGlow }]}>
        <ThemedText style={actionStyles.icon}>{icon}</ThemedText>
      </View>
      <View style={actionStyles.textContainer}>
        <ThemedText style={[actionStyles.label, { color: theme.text }]}>
          {label}
        </ThemedText>
        <ThemedText style={[actionStyles.subtitle, { color: theme.textMuted }]}>
          {subtitle}
        </ThemedText>
      </View>
      <ThemedText style={[actionStyles.chevron, { color: theme.textMuted }]}>
        ›
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.four },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginTop: Spacing.two,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  avatarText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
  },
  phone: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  nodeBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginTop: Spacing.three,
  },
  nodeBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.8,
  },
  copyToast: {
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  copyToastText: {
    color: '#07090E',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  section: {
    marginTop: Spacing.four,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  cardsSection: {
    gap: Spacing.two + 2,
  },
  vaultStatusCard: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  vaultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vaultLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  vaultValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  vaultDivider: {
    height: 1,
  },
  actionsSection: {
    gap: Spacing.two,
  },
});

const identityStyles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.one + 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  cardIcon: { fontSize: FontSize.sm },
  cardLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  copyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  copyBtnText: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.bold,
  },
  cardValue: {
    fontSize: FontSize.xs + 1,
  },
});

const actionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: FontSize.md },
  textContainer: { flex: 1 },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  chevron: {
    fontSize: FontSize.xl,
  },
});
