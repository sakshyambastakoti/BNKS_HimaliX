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
import { SvgIcon } from '@/components/SvgIcons';
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
              <SvgIcon name="chevron-right" size={14} color={theme.primary} style={{ transform: [{ rotate: '180deg' }] }} />
              <ThemedText style={[styles.backText, { color: theme.primary }]}>
                Login
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
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border, ...Shadows.card }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                FULL LEGAL NAME
              </ThemedText>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Suman Sharma"
                placeholderTextColor={theme.textSecondary}
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
                placeholderTextColor={theme.textSecondary}
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
                placeholder="Create secure passphrase"
                placeholderTextColor={theme.textSecondary}
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
                placeholder="Re-enter passphrase"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry
                style={[styles.input, { backgroundColor: theme.cardElevated, color: theme.text, borderColor: theme.border }]}
              />
            </View>

            {/* Enclave Notice */}
            <View style={[styles.enclaveInfo, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
              <SvgIcon name="key" size={16} color={theme.primary} />
              <View style={styles.enclaveTextWrapper}>
                <ThemedText style={[styles.enclaveTitle, { color: theme.text }]}>
                  Hardware Enclave Binding
                </ThemedText>
                <ThemedText style={[styles.enclaveDesc, { color: theme.textSecondary }]}>
                  Private keys remain inside this device's secure enclave and are never transmitted over the network.
                </ThemedText>
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSignup}
              disabled={isGenerating}
              style={({ pressed }) => [
                styles.submitBtn,
                {
                  backgroundColor: theme.primaryDark,
                  opacity: pressed || isGenerating ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <ThemedText style={styles.submitBtnText}>
                {isGenerating ? 'Generating Enclave Keys...' : 'Generate Node & Open Vault'}
              </ThemedText>
            </Pressable>
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
    paddingBottom: Spacing.six,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.one,
  },
  backText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  titleSection: {
    marginBottom: Spacing.four,
    gap: Spacing.one,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
  },
  subtitle: {
    fontSize: FontSize.xs,
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.four,
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
  enclaveInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.three,
  },
  enclaveTextWrapper: {
    flex: 1,
    gap: 2,
  },
  enclaveTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  enclaveDesc: {
    fontSize: 10,
    lineHeight: 14,
  },
  submitBtn: {
    paddingVertical: Spacing.four,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
});
