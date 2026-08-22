/**
 * OffPay Settings Screen
 * Theme toggle, developer mode, app info, and account actions.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const logout = useAppStore((s) => s.logout);
  const [devMode, setDevMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

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
              Settings
            </ThemedText>
          </View>

          {/* General */}
          <SettingsGroup title="General" theme={theme}>
            <SettingsToggle
              icon="🔔"
              label="Notifications"
              value={notifications}
              onToggle={setNotifications}
              theme={theme}
            />
            <SettingsDivider theme={theme} />
            <SettingsToggle
              icon="⟳"
              label="Auto-sync when online"
              value={autoSync}
              onToggle={setAutoSync}
              theme={theme}
            />
          </SettingsGroup>

          {/* Developer */}
          <SettingsGroup title="Developer" theme={theme}>
            <SettingsToggle
              icon="🔧"
              label="Developer Mode"
              value={devMode}
              onToggle={setDevMode}
              theme={theme}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              icon="📋"
              label="View Logs"
              theme={theme}
              onPress={() => {}}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              icon="🗑"
              label="Clear Local Database"
              theme={theme}
              destructive
              onPress={() => {
                Alert.alert(
                  'Clear Database',
                  'This will delete all local bonds and transaction history. Are you sure?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear', style: 'destructive' },
                  ]
                );
              }}
            />
          </SettingsGroup>

          {/* Security */}
          <SettingsGroup title="Security" theme={theme}>
            <SettingsRow
              icon="🔐"
              label="Export Public Key"
              theme={theme}
              onPress={() => {}}
            />
            <SettingsDivider theme={theme} />
            <SettingsRow
              icon="🔑"
              label="Regenerate Key Pair"
              theme={theme}
              destructive
              onPress={() => {
                Alert.alert(
                  'Regenerate Keys',
                  'This will create new Ed25519 keys. Your existing bonds will become invalid. Continue?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Regenerate', style: 'destructive' },
                  ]
                );
              }}
            />
          </SettingsGroup>

          {/* About */}
          <SettingsGroup title="About" theme={theme}>
            <SettingsInfo icon="📱" label="Version" value="1.0.0" theme={theme} />
            <SettingsDivider theme={theme} />
            <SettingsInfo icon="🏗" label="SDK" value="Expo 57" theme={theme} />
            <SettingsDivider theme={theme} />
            <SettingsInfo icon="🔒" label="Crypto" value="Ed25519 / SHA-256" theme={theme} />
          </SettingsGroup>

          {/* Logout */}
          <Pressable
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout },
              ]);
            }}
            style={({ pressed }) => [
              styles.logoutButton,
              {
                backgroundColor: pressed ? theme.error + '30' : theme.error + '15',
                borderColor: theme.error + '40',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={[styles.logoutText, { color: theme.error }]}>
              Logout
            </ThemedText>
          </Pressable>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Sub-components
function SettingsGroup({ title, children, theme }: { title: string; children: React.ReactNode; theme: any }) {
  return (
    <View style={groupStyles.container}>
      <ThemedText style={[groupStyles.title, { color: theme.textSecondary }]}>
        {title}
      </ThemedText>
      <View style={[groupStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {children}
      </View>
    </View>
  );
}

function SettingsToggle({ icon, label, value, onToggle, theme }: any) {
  return (
    <View style={rowStyles.row}>
      <ThemedText style={rowStyles.icon}>{icon}</ThemedText>
      <ThemedText style={[rowStyles.label, { color: theme.text }]}>{label}</ThemedText>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.border, true: theme.primary + '60' }}
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
      <ThemedText style={rowStyles.icon}>{icon}</ThemedText>
      <ThemedText style={[rowStyles.label, { color: destructive ? theme.error : theme.text }]}>
        {label}
      </ThemedText>
      <ThemedText style={[rowStyles.chevron, { color: theme.textMuted }]}>›</ThemedText>
    </Pressable>
  );
}

function SettingsInfo({ icon, label, value, theme }: any) {
  return (
    <View style={rowStyles.row}>
      <ThemedText style={rowStyles.icon}>{icon}</ThemedText>
      <ThemedText style={[rowStyles.label, { color: theme.text }]}>{label}</ThemedText>
      <ThemedText style={[rowStyles.value, { color: theme.textMuted }]}>{value}</ThemedText>
    </View>
  );
}

function SettingsDivider({ theme }: { theme: any }) {
  return <View style={[dividerStyles.line, { backgroundColor: theme.border }]} />;
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
  logoutButton: {
    marginTop: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});

const groupStyles = StyleSheet.create({
  container: { marginTop: Spacing.four },
  title: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
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
  icon: { fontSize: FontSize.lg },
  label: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  value: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  chevron: {
    fontSize: FontSize.xxl,
  },
});

const dividerStyles = StyleSheet.create({
  line: { height: 1, marginHorizontal: Spacing.three },
});
