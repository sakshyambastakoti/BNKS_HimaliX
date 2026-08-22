/**
 * OffPay Account Screen
 * Displays user profile, UUID, public key, and account actions.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function AccountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAppStore((s) => s.user);

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '??';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={[styles.title, { color: theme.text }]}>
              Account
            </ThemedText>
          </View>

          {/* Avatar + Name */}
          <View style={styles.profileSection}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <ThemedText style={styles.avatarText}>{initials}</ThemedText>
            </View>
            <ThemedText style={[styles.name, { color: theme.text }]}>
              {user?.fullName ?? 'Unknown User'}
            </ThemedText>
            <ThemedText style={[styles.phone, { color: theme.textSecondary }]}>
              {user?.phone ?? '—'}
            </ThemedText>
          </View>

          {/* Info Cards */}
          <View style={styles.cardsSection}>
            <InfoCard
              label="User ID"
              value={user?.userId ?? '—'}
              icon="🔑"
              theme={theme}
              copyable
            />
            <InfoCard
              label="Email"
              value={user?.email ?? '—'}
              icon="✉"
              theme={theme}
            />
            <InfoCard
              label="Public Key"
              value={user?.publicKey ?? '—'}
              icon="🔐"
              theme={theme}
              copyable
              truncate
            />
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              Developer Tools
            </ThemedText>
            <ActionRow
              icon="📋"
              label="Developer Logs"
              subtitle="View crypto & sync events"
              theme={theme}
              onPress={() => router.push('/logs')}
            />
            <ActionRow
              icon="⬡"
              label="Local Bonds"
              subtitle="View offline bond wallet"
              theme={theme}
              onPress={() => {}}
            />
            <ActionRow
              icon="🗄"
              label="SQLite Database"
              subtitle="Inspect local ledger"
              theme={theme}
              onPress={() => {}}
            />
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function InfoCard({
  label,
  value,
  icon,
  theme,
  copyable,
  truncate,
}: {
  label: string;
  value: string;
  icon: string;
  theme: any;
  copyable?: boolean;
  truncate?: boolean;
}) {
  return (
    <View
      style={[
        infoStyles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={infoStyles.cardHeader}>
        <ThemedText style={infoStyles.cardIcon}>{icon}</ThemedText>
        <ThemedText style={[infoStyles.cardLabel, { color: theme.textSecondary }]}>
          {label}
        </ThemedText>
      </View>
      <ThemedText
        style={[
          infoStyles.cardValue,
          { color: theme.text, fontFamily: 'monospace' },
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
          backgroundColor: pressed ? theme.backgroundSelected : theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText style={actionStyles.icon}>{icon}</ThemedText>
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
  header: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  avatarText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: '#0A0A0F',
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.one,
  },
  phone: {
    fontSize: FontSize.md,
  },
  cardsSection: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  actionsSection: {
    marginTop: Spacing.five,
    gap: Spacing.two,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
});

const infoStyles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  cardIcon: { fontSize: FontSize.md },
  cardLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardValue: {
    fontSize: FontSize.sm,
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
  icon: { fontSize: FontSize.xl },
  textContainer: { flex: 1 },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  chevron: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.regular,
  },
});
