/**
 * OffPay Signup Screen
 * Full name, phone/email, password registration with key generation.
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

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
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
          {/* Header */}
          <View style={styles.headerSection}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ThemedText style={[styles.backText, { color: theme.primary }]}>
                ← Back
              </ThemedText>
            </Pressable>
            <ThemedText style={[styles.title, { color: theme.text }]}>
              Create Account
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              Your Ed25519 key pair will be generated automatically
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Full Name
              </ThemedText>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={theme.textMuted}
                style={[styles.input, { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Phone Number
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
                Password
              </ThemedText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                style={[styles.input, { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border }]}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Confirm Password
              </ThemedText>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                style={[styles.input, { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border }]}
              />
            </View>

            {/* Signup button */}
            <Pressable
              onPress={handleSignup}
              style={({ pressed }) => [
                styles.signupButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <ThemedText style={styles.signupButtonText}>
                Create Account
              </ThemedText>
            </Pressable>
          </View>

          {/* Key generation info */}
          <View style={[styles.keyInfo, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}>
            <ThemedText style={[styles.keyInfoTitle, { color: theme.primary }]}>
              🔑 What happens next?
            </ThemedText>
            <ThemedText style={[styles.keyInfoText, { color: theme.textSecondary }]}>
              An Ed25519 cryptographic key pair will be generated on your device. The private key is stored in the Secure Enclave — it never leaves your phone. Your public key is registered with the server for transaction verification.
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
    marginBottom: Spacing.five,
  },
  backButton: {
    marginBottom: Spacing.three,
  },
  backText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: Spacing.two,
  },
  formSection: {
    gap: Spacing.four,
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
  signupButton: {
    paddingVertical: Spacing.three + 4,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  signupButtonText: {
    color: '#0A0A0F',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  keyInfo: {
    marginTop: Spacing.five,
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  keyInfoTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  keyInfoText: {
    fontSize: FontSize.xs,
    lineHeight: 20,
  },
});
