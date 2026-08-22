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
import { SvgIcon } from '@/components/SvgIcons';
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
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
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
                placeholderTextColor={theme.textSecondary}
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
                placeholderTextColor={theme.textSecondary}
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
                  backgroundColor: theme.primaryDark,
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <ThemedText style={styles.loginButtonText}>
                Unlock Node Vault
              </ThemedText>
            </Pressable>

            {/* Biometric Trigger */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.biometricButton,
                {
                  backgroundColor: theme.cardElevated,
                  borderColor: theme.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <SvgIcon name="shield" size={16} color={theme.primary} />
              <ThemedText style={[styles.biometricText, { color: theme.text }]}>
                Quick Biometric Key Unlock
              </ThemedText>
            </Pressable>
          </View>

          {/* Signup Link */}
          <View style={styles.signupPrompt}>
            <ThemedText style={[styles.promptText, { color: theme.textSecondary }]}>
              Don't have an OffPay node keypair?
            </ThemedText>
            <Pressable onPress={() => router.push('/(auth)/signup')}>
              <ThemedText style={[styles.signupLink, { color: theme.primary }]}>
                Generate New Keys
              </ThemedText>
            </Pressable>
          </View>

          {/* Trust Seal */}
          <View style={[styles.trustSeal, { borderColor: theme.border }]}>
            <SvgIcon name="lock" size={14} color={theme.primary} />
            <ThemedText style={[styles.trustText, { color: theme.textSecondary }]}>
              Secured by Ed25519 Cryptography & Secure Enclave
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
    padding: Spacing.four,
    justifyContent: 'center',
    minHeight: '100%',
    paddingBottom: Spacing.six,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.five,
    marginTop: Spacing.four,
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  formTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  formSubtitle: {
    fontSize: FontSize.xs,
    marginTop: -4,
  },
  inputGroup: {
    gap: Spacing.one + 2,
  },
  inputLabel: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    fontSize: FontSize.sm,
  },
  loginButton: {
    paddingVertical: Spacing.four,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two,
  },
  biometricText: {
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.bold,
  },
  signupPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.five,
  },
  promptText: {
    fontSize: FontSize.xs,
  },
  signupLink: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  trustSeal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginTop: Spacing.five,
  },
  trustText: {
    fontSize: 10,
    fontWeight: FontWeight.medium,
  },
});
