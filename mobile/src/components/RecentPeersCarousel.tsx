/**
 * RecentPeersCarousel — Matches the "Recent" section from the Reference Image
 * Horizontal stream of recipient avatar bubbles, names, and account numbers.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight } from '@/constants/theme';

export interface RecentContact {
  id: string;
  name: string;
  accountNumber: string;
  initials: string;
  bgColor: string;
  textColor: string;
}

const DEFAULT_RECENT: RecentContact[] = [
  { id: '1', name: 'Jam Vana', accountNumber: '1234-0987-123', initials: 'JV', bgColor: '#FEF3C7', textColor: '#D97706' },
  { id: '2', name: 'Smart Mart', accountNumber: '098-123-456', initials: 'SM', bgColor: '#E6F6EE', textColor: '#00A859' },
  { id: '3', name: 'Sovannaphum', accountNumber: '123-123-456', initials: 'SV', bgColor: '#FCE7F3', textColor: '#DB2777' },
  { id: '4', name: 'Kavre Node', accountNumber: '098-123-789', initials: 'KN', bgColor: '#E0F2FE', textColor: '#0284C7' },
];

export function RecentPeersCarousel({ contacts = DEFAULT_RECENT }: { contacts?: RecentContact[] }) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.title, { color: theme.text }]}>
        Recent
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {contacts.map((contact) => (
          <Pressable
            key={contact.id}
            onPress={() => router.push('/send')}
            style={({ pressed }) => [
              styles.contactItem,
              { opacity: pressed ? 0.75 : 1, transform: [{ scale: pressed ? 0.94 : 1 }] },
            ]}
          >
            {/* Circular Avatar Bubble */}
            <View style={[styles.avatarBubble, { backgroundColor: contact.bgColor }]}>
              <ThemedText style={[styles.avatarInitials, { color: contact.textColor }]}>
                {contact.initials}
              </ThemedText>
            </View>

            {/* Name */}
            <ThemedText style={[styles.contactName, { color: theme.text }]} numberOfLines={1}>
              {contact.name}
            </ThemedText>

            {/* Phone/Account Number */}
            <ThemedText style={[styles.contactNumber, { color: theme.textSecondary }]} numberOfLines={1}>
              {contact.accountNumber}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.two,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.black,
    letterSpacing: -0.3,
    marginBottom: Spacing.two + 2,
    paddingHorizontal: Spacing.one,
  },
  scrollContent: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
  contactItem: {
    alignItems: 'center',
    width: 78,
    gap: 3,
  },
  avatarBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  avatarInitials: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
  },
  contactName: {
    fontSize: FontSize.xxs + 1,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  contactNumber: {
    fontSize: 9,
    textAlign: 'center',
  },
});
