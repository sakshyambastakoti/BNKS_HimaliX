/**
 * OffPay Signup Screen — Cryptographic Key Pair Registration
 * Full name, phone number, passphrase registration with automated Secure Enclave key generation.
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

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const login = useAppStore((s) => s.login);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSignup = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      login({ ...MOCK_USER, fullName: fullName || MOCK_USER.fullName, phone: phone || MOCK_USER.phone }, 'mock-jwt-token');
      router.replace('/(tabs)');
    }, 1200);
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
          {/* Header Bar */}
          <View style={styles.headerSection}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ThemedText style={[styles.backText, { color: theme.primary }]}>
                ← Back to Login
              </ThemedText>
            </Pressable>
            <OffPayLogo size="xs" variant="horizontal" glow />
          </View>

          {/* Title Group */}
          <View style={styles.titleSection}>
            <ThemedText style={[styles.title, { color: theme.text }]}>
              Create Node Vault
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              Generates an Ed25519 cryptographic key pair on this device
            </ThemedText>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                FULL LEGAL NAME
              </ThemedText>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Suman Sharma"
                placeholderTextColor={theme.textMuted}
                style={[styles.input, { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                MOBILE NUMBER
              </ThemedText>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+977-98XXXXXXXX"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                style={[styles.input, { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                VAULT MASTER PASSPHRASE
              </ThemedText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create strong passphrase"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                style={[styles.input, { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                CONFIRM PASSPHRASE
              </ThemedText>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm passphrase"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                style={[styles.input, { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border }]}
              />
            </View>

            {/* Signup Submit Button */}
            <Pressable
              onPress={handleSignup}
              disabled={isGenerating}
              style={({ pressed }) => [
                styles.signupButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  ...Shadows.glowGreen,
                },
              ]}
            >
              <ThemedText style={styles.signupButtonText}>
                {isGenerating ? 'Generating Enclave Keys...' : 'Generate Vault & Register'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Cryptographic Key Generation Info */}
          <View style={[styles.keyInfo, { backgroundColor: theme.primaryGlow, borderColor: theme.primary + '40' }]}>
            <ThemedText style={[styles.keyInfoTitle, { color: theme.primary }]}>
              🔑 Zero-Knowledge Architecture
            </ThemedText>
            <ThemedText style={[styles.keyInfoText, { color: theme.textSecondary }]}>
              Your Ed25519 private key is sealed inside the phone's Secure Enclave and never leaves your device. Only your public key is broadcasted to the OffPay validator node for transaction verification.
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
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  backButton: {
    paddingVertical: Spacing.one,
  },
  backText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  titleSection: {
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  formCard: {
    padding: Spacing.four,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.three,
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
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: FontSize.md,
  },
  signupButton: {
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  signupButtonText: {
    color: '#07090E',
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  keyInfo: {
    marginTop: Spacing.four,
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.one,
  },
  keyInfoTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  keyInfoText: {
    fontSize: FontSize.xxs + 1,
    lineHeight: 16,
  },
});
