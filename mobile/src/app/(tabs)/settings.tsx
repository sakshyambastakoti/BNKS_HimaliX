/**
 * OffPay Settings Screen — System & Protocol Configuration
 * Theme options, biometric controls, peer mesh toggles, and developer diagnostic controls.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandHeader } from '@/components/BrandHeader';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const logout = useAppStore((s) => s.logout);

  const [devMode, setDevMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [meshDiscovery, setMeshDiscovery] = useState(true);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <BrandHeader showProfile={false} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title */}
          <View style={styles.header}>
            <ThemedText style={[styles.title, { color: theme.text }]}>
              System Settings
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              Protocol, cryptographic vault, and hardware preferences
            </ThemedText>
          </View>

          {/* Network & Offline Mesh */}
          <SettingsGroup title="Network & Offline Mesh" theme={theme}>
            <SettingsToggle
              icon="⟳"
              label="Auto-sync when online"
              description="Automatically settle offline bonds when network is restored"
              value={autoSync}
              onToggle={setAutoSync}
              theme={theme}
            />
            <SettingsDivider theme={theme} />
            <SettingsToggle
              icon="📡"
              label="Nearby Peer Mesh Discovery"
              description="Discover nearby OffPay receivers via Bluetooth & Wi-Fi Direct"
              value={meshDiscovery}
              onToggle={setMeshDiscovery}
              theme={theme}
            />
          </SettingsGroup>

          {/* Security & Cryptography */}
          <SettingsGroup title="Security & Hardware Enclave" theme={theme}>
            <SettingsToggle
              icon="🔒"
              label="Biometric Confirmation"
              description="Require FaceID / Fingerprint for signing payment vouchers"
              value={biometrics}
              onToggle={setBiometrics}
              theme={theme}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              icon="🔐"
              label="Inspect Public Key Certificate"
              theme={theme}
              onPress={() => Alert.alert('Certificate', 'Ed25519 Self-Signed Identity Certificate Active.')}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              icon="🔑"
              label="Regenerate Hardware Keys"
              theme={theme}
              destructive
              onPress={() => {
                Alert.alert(
                  'Regenerate Keys',
                  'This will rotate your cryptographic key pair in the Secure Enclave. Existing unspent bonds must be synced first.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Regenerate', style: 'destructive' },
                  ]
                );
              }}
            />
          </SettingsGroup>

          {/* Developer & Diagnostics */}
          <SettingsGroup title="Developer & Diagnostics" theme={theme}>
            <SettingsToggle
              icon="🔧"
              label="Developer Mode"
              description="Enable live telemetry & cryptographic console output"
              value={devMode}
              onToggle={setDevMode}
              theme={theme}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              icon="📋"
              label="Live Diagnostic Logs"
              theme={theme}
              onPress={() => router.push('/logs')}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              icon="🗑"
              label="Purge Local SQLite Cache"
              theme={theme}
              destructive
              onPress={() => {
                Alert.alert(
                  'Purge Local Cache',
                  'This will clear non-essential cached blocks. Bond records will be preserved.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Purge', style: 'destructive' },
                  ]
                );
              }}
            />
          </SettingsGroup>

          {/* About OffPay */}
          <SettingsGroup title="About OffPay" theme={theme}>
            <SettingsInfo icon="⚡" label="App Version" value="1.0.0 (HimaliX Build)" theme={theme} />
            <SettingsDivider theme={theme} />
            <SettingsInfo icon="🛡" label="Crypto Suite" value="Ed25519 • SHA-256 • BondPay v2" theme={theme} />
            <SettingsDivider theme={theme} />
            <SettingsInfo icon="🏛" label="Framework" value="Expo 54 • React Native" theme={theme} />
          </SettingsGroup>

          {/* Logout Button */}
          <Pressable
            onPress={() => {
              Alert.alert('Lock / Logout', 'Are you sure you want to lock the vault and logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout },
              ]);
            }}
            style={({ pressed }) => [
              styles.logoutButton,
              {
                backgroundColor: pressed ? theme.errorBg : theme.cardGlass,
                borderColor: theme.error + '50',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={[styles.logoutText, { color: theme.error }]}>
              Lock Vault & Logout
            </ThemedText>
          </Pressable>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function SettingsGroup({ title, children, theme }: { title: string; children: React.ReactNode; theme: any }) {
  return (
    <View style={groupStyles.container}>
      <ThemedText style={[groupStyles.title, { color: theme.textSecondary }]}>
        {title}
      </ThemedText>
      <View style={[groupStyles.card, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
        {children}
      </View>
    </View>
  );
}

function SettingsToggle({ icon, label, description, value, onToggle, theme }: any) {
  return (
    <View style={rowStyles.row}>
      <View style={[rowStyles.iconBubble, { backgroundColor: theme.primaryGlow }]}>
        <ThemedText style={rowStyles.icon}>{icon}</ThemedText>
      </View>
      <View style={rowStyles.textGroup}>
        <ThemedText style={[rowStyles.label, { color: theme.text }]}>{label}</ThemedText>
        {description && (
          <ThemedText style={[rowStyles.description, { color: theme.textMuted }]}>
            {description}
          </ThemedText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.border, true: theme.primary + '80' }}
        thumbColor={value ? theme.primary : theme.textMuted}
      />
    </View>
  );
}

function SettingsRow({ icon, label, theme, destructive, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        rowStyles.row,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[rowStyles.iconBubble, { backgroundColor: destructive ? theme.errorBg : theme.primaryGlow }]}>
        <ThemedText style={[rowStyles.icon, destructive && { color: theme.error }]}>{icon}</ThemedText>
      </View>
      <ThemedText style={[rowStyles.label, { color: destructive ? theme.error : theme.text, flex: 1 }]}>
        {label}
      </ThemedText>
      <ThemedText style={[rowStyles.chevron, { color: theme.textMuted }]}>›</ThemedText>
    </Pressable>
  );
}

function SettingsInfo({ icon, label, value, theme }: any) {
  return (
    <View style={rowStyles.row}>
      <View style={[rowStyles.iconBubble, { backgroundColor: theme.primaryGlow }]}>
        <ThemedText style={rowStyles.icon}>{icon}</ThemedText>
      </View>
      <ThemedText style={[rowStyles.label, { color: theme.text, flex: 1 }]}>{label}</ThemedText>
      <ThemedText style={[rowStyles.value, { color: theme.textSecondary }]}>{value}</ThemedText>
    </View>
  );
}

function SettingsDivider({ theme }: { theme: any }) {
  return <View style={[dividerStyles.line, { backgroundColor: theme.borderLight }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.four },
  header: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: Spacing.five,
    paddingVertical: Spacing.three + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});

const groupStyles = StyleSheet.create({
  container: { marginTop: Spacing.four },
  title: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
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
  textGroup: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  description: {
    fontSize: FontSize.xxs,
    lineHeight: 14,
  },
  value: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  chevron: {
    fontSize: FontSize.xl,
  },
});

const dividerStyles = StyleSheet.create({
  line: { height: 1, marginHorizontal: Spacing.three },
});
