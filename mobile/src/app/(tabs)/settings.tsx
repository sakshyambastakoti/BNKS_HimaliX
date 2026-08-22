/**
 * OffPay Settings Screen — System & Protocol Configuration
 * Theme switcher (Light/Dark/System), biometric controls, peer mesh toggles, and developer diagnostic controls.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BankingHeader } from '@/components/BankingHeader';
import { SvgIcon, type IconName } from '@/components/SvgIcons';
import { useTheme, useThemeMode } from '@/hooks/use-theme';
import { useAppStore, type ThemeMode } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const { themeMode, setThemeMode, isDark } = useThemeMode();
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
        <BankingHeader />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Appearance & Theme Setting Card */}
          <View style={styles.groupContainer}>
            <ThemedText style={[styles.groupTitle, { color: theme.textSecondary }]}>
              APPEARANCE & THEME
            </ThemedText>
            <View style={[styles.groupCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
              <View style={styles.themeSelectorRow}>
                {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
                  const isSelected = themeMode === mode;
                  const label = mode === 'light' ? 'Light (White)' : mode === 'dark' ? 'Dark (Obsidian)' : 'System';
                  const icon: IconName = mode === 'light' ? 'sun' : mode === 'dark' ? 'moon' : 'more';

                  return (
                    <Pressable
                      key={mode}
                      onPress={() => setThemeMode(mode)}
                      style={({ pressed }) => [
                        styles.themeModePill,
                        {
                          backgroundColor: isSelected ? theme.primary : theme.cardElevated,
                          borderColor: isSelected ? theme.primary : theme.border,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <SvgIcon name={icon} size={15} color={isSelected ? '#FFFFFF' : theme.textSecondary} />
                      <ThemedText
                        style={[
                          styles.themeModeLabel,
                          { color: isSelected ? '#FFFFFF' : theme.text },
                        ]}
                      >
                        {label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Network & Offline Mesh */}
          <SettingsGroup title="NETWORK & OFFLINE MESH" theme={theme}>
            <SettingsToggle
              iconName="sync"
              label="Auto-sync when online"
              description="Automatically settle offline bonds when network is restored"
              value={autoSync}
              onToggle={setAutoSync}
              theme={theme}
            />
            <SettingsDivider theme={theme} />
            <SettingsToggle
              iconName="wifi"
              label="Nearby Peer Mesh Discovery"
              description="Discover nearby OffPay receivers via Bluetooth & Wi-Fi Direct"
              value={meshDiscovery}
              onToggle={setMeshDiscovery}
              theme={theme}
            />
          </SettingsGroup>

          {/* Security & Cryptography */}
          <SettingsGroup title="SECURITY & HARDWARE ENCLAVE" theme={theme}>
            <SettingsToggle
              iconName="shield"
              label="Biometric Confirmation"
              description="Require FaceID / Fingerprint for signing payment vouchers"
              value={biometrics}
              onToggle={setBiometrics}
              theme={theme}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              iconName="key"
              label="Inspect Public Key Certificate"
              theme={theme}
              onPress={() => Alert.alert('Certificate', 'Ed25519 Self-Signed Identity Certificate Active.')}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              iconName="trash"
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

          {/* Notifications */}
          <SettingsGroup title="NOTIFICATIONS" theme={theme}>
            <SettingsToggle
              iconName="bell"
              label="Push Notifications"
              description="Alerts for incoming offline vouchers and settlement proofs"
              value={notifications}
              onToggle={setNotifications}
              theme={theme}
            />
          </SettingsGroup>

          {/* Developer Tools */}
          <SettingsGroup title="DEVELOPER & TELEMETRY" theme={theme}>
            <SettingsToggle
              iconName="more"
              label="Developer Mode"
              description="Enable diagnostic traces and raw voucher inspection"
              value={devMode}
              onToggle={setDevMode}
              theme={theme}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              iconName="more"
              label="View Live Telemetry Logs"
              theme={theme}
              onPress={() => router.push('/logs')}
            />
          </SettingsGroup>

          {/* Logout */}
          <View style={styles.logoutSection}>
            <Pressable
              onPress={() => {
                Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => {
                      logout();
                      router.replace('/(auth)/login');
                    },
                  },
                ]);
              }}
              style={({ pressed }) => [
                styles.logoutButton,
                {
                  backgroundColor: theme.errorBg,
                  borderColor: theme.error + '40',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <SvgIcon name="close" size={16} color={theme.error} />
              <ThemedText style={[styles.logoutText, { color: theme.error }]}>
                Sign Out of Node
              </ThemedText>
            </Pressable>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function SettingsGroup({
  title,
  theme,
  children,
}: {
  title: string;
  theme: any;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.groupContainer}>
      <ThemedText style={[styles.groupTitle, { color: theme.textSecondary }]}>
        {title}
      </ThemedText>
      <View style={[styles.groupCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
        {children}
      </View>
    </View>
  );
}

function SettingsToggle({
  iconName,
  label,
  description,
  value,
  onToggle,
  theme,
}: {
  iconName: IconName;
  label: string;
  description: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  theme: any;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={[styles.iconBox, { backgroundColor: theme.successBg }]}>
        <SvgIcon name={iconName} size={18} color={theme.primary} />
      </View>
      <View style={styles.toggleContent}>
        <ThemedText style={[styles.toggleLabel, { color: theme.text }]}>{label}</ThemedText>
        <ThemedText style={[styles.toggleDescription, { color: theme.textSecondary }]}>
          {description}
        </ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function SettingsRow({
  iconName,
  label,
  theme,
  destructive,
  onPress,
}: {
  iconName: IconName;
  label: string;
  theme: any;
  destructive?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionRow,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: destructive ? theme.errorBg : theme.successBg }]}>
        <SvgIcon name={iconName} size={18} color={destructive ? theme.error : theme.primary} />
      </View>
      <ThemedText
        style={[
          styles.actionLabel,
          { color: destructive ? theme.error : theme.text },
        ]}
      >
        {label}
      </ThemedText>
      <SvgIcon name="chevron-right" size={14} color={theme.textSecondary} />
    </Pressable>
  );
}

function SettingsDivider({ theme }: { theme: any }) {
  return <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
  },
  groupContainer: {
    marginVertical: Spacing.two,
  },
  groupTitle: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.black,
    letterSpacing: 0.8,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  groupCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeSelectorRow: {
    flexDirection: 'row',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  themeModePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.two + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  themeModeLabel: {
    fontSize: FontSize.xxs + 1,
    fontWeight: FontWeight.bold,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleContent: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  toggleDescription: {
    fontSize: FontSize.xxs + 1,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  actionLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.four,
  },
  logoutSection: {
    marginVertical: Spacing.four,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
  },
});
