/**
 * OffPay Login Screen
 * Phone/email + password login with OffPay branding.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { MOCK_USER } from '@/constants/mock-data';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login(MOCK_USER, 'mock-jwt-token');
    router.replace('/(tabs)');
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
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoRow}>
              <ThemedText style={[styles.logoOff, { color: theme.primary }]}>Off</ThemedText>
              <ThemedText style={[styles.logoPay, { color: theme.text }]}>Pay</ThemedText>
            </View>
            <ThemedText style={[styles.tagline, { color: theme.textSecondary }]}>
              Offline-first digital payments
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <ThemedText style={[styles.formTitle, { color: theme.text }]}>
              Welcome back
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Phone or Email
              </ThemedText>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+977-98XXXXXXXX"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                style={[
                  styles.input,
                  { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border },
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Password
              </ThemedText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                style={[
                  styles.input,
                  { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border },
                ]}
              />
            </View>

            {/* Login button */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <ThemedText style={styles.loginButtonText}>
                Login
              </ThemedText>
            </Pressable>

            {/* Signup link */}
            <View style={styles.signupRow}>
              <ThemedText style={[styles.signupText, { color: theme.textSecondary }]}>
                Don't have an account?{' '}
              </ThemedText>
              <Pressable onPress={() => router.push('/(auth)/signup')}>
                <ThemedText style={[styles.signupLink, { color: theme.primary }]}>
                  Sign Up
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {/* Security note */}
          <View style={[styles.securityNote, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText style={[styles.securityIcon]}>🔐</ThemedText>
            <ThemedText style={[styles.securityText, { color: theme.textMuted }]}>
              Your private key is stored in the device's Secure Enclave and never leaves your phone.
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoOff: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -1,
  },
  logoPay: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: FontSize.sm,
    marginTop: Spacing.two,
    letterSpacing: 0.5,
  },
  formSection: {
    gap: Spacing.four,
  },
  formTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.two,
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
  loginButton: {
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  loginButtonText: {
    color: '#0A0A0F',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  signupText: {
    fontSize: FontSize.md,
  },
  signupLink: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.five,
  },
  securityIcon: { fontSize: 18 },
  securityText: {
    flex: 1,
    fontSize: FontSize.xs,
    lineHeight: 18,
  },
});
