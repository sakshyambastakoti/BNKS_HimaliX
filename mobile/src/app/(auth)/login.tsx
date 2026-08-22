/**
 * OffPay Login Screen — High-Tech Neo-Banking Authentication
 * Features:
 * - Large glowing official OffPay brand hero
 * - Glassmorphic floating input fields with focus highlight
 * - Biometric unlock trigger
 * - Hardware Secure Enclave trust badge
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OffPayLogo } from '@/components/OffPayLogo';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/useAppStore';
import { MOCK_USER } from '@/constants/mock-data';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '@/constants/theme';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const login = useAppStore((s) => s.login);

  const [phone, setPhone] = useState('+977-9801234567');
  const [password, setPassword] = useState('••••••••••••');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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
          {/* Hero Brand Logo */}
          <View style={styles.logoSection}>
            <OffPayLogo size="hero" variant="stacked" glow showTagline />
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            <ThemedText style={[styles.formTitle, { color: theme.text }]}>
              Unlock Offline Vault
            </ThemedText>
            <ThemedText style={[styles.formSubtitle, { color: theme.textSecondary }]}>
              Enter credentials or use hardware biometric key
            </ThemedText>

            {/* Phone/Email Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                PHONE OR NODE ID
              </ThemedText>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setIsPhoneFocused(true)}
                onBlur={() => setIsPhoneFocused(false)}
                placeholder="+977-98XXXXXXXX"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.cardElevated,
                    color: theme.text,
                    borderColor: isPhoneFocused ? theme.primary : theme.border,
                  },
                ]}
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                VAULT PASSPHRASE
              </ThemedText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="Enter passphrase"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.cardElevated,
                    color: theme.text,
                    borderColor: isPasswordFocused ? theme.primary : theme.border,
                  },
                ]}
              />
            </View>

            {/* Primary Login Button */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  ...Shadows.glowGreen,
                },
              ]}
            >
              <ThemedText style={styles.loginButtonText}>
                Authenticate Vault
              </ThemedText>
            </Pressable>

            {/* Biometric Quick Unlock */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.bioButton,
                {
                  backgroundColor: theme.cardElevated,
                  borderColor: theme.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <ThemedText style={[styles.bioIcon]}>🔐</ThemedText>
              <ThemedText style={[styles.bioText, { color: theme.text }]}>
                Quick Biometric Key Unlock
              </ThemedText>
            </Pressable>

            {/* Signup Link */}
            <View style={styles.signupRow}>
              <ThemedText style={[styles.signupText, { color: theme.textSecondary }]}>
                New to OffPay?{' '}
              </ThemedText>
              <Pressable onPress={() => router.push('/(auth)/signup')}>
                <ThemedText style={[styles.signupLink, { color: theme.primary }]}>
                  Generate Node Keys
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {/* Security Note */}
          <View style={[styles.securityNote, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            <ThemedText style={styles.securityIcon}>🛡</ThemedText>
            <ThemedText style={[styles.securityText, { color: theme.textMuted }]}>
              Ed25519 private keys are permanently isolated inside your phone's hardware Secure Enclave.
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
    marginBottom: Spacing.five,
  },
  formCard: {
    padding: Spacing.four,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.three,
  },
  formTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: FontSize.xs,
    marginBottom: Spacing.two,
  },
  inputGroup: {
    gap: Spacing.one,
  },
  inputLabel: {
    fontSize: FontSize.xxs + 1,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1,
  },
  input: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: FontSize.md,
  },
  loginButton: {
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  loginButtonText: {
    color: '#07090E',
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two,
  },
  bioIcon: {
    fontSize: FontSize.md,
  },
  bioText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  signupText: {
    fontSize: FontSize.sm,
  },
  signupLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.four,
  },
  securityIcon: { fontSize: FontSize.md },
  securityText: {
    flex: 1,
    fontSize: FontSize.xxs + 1,
    lineHeight: 16,
  },
});
