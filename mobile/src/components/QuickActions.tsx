/**
 * ServicesGrid (QuickActions) — Vector SVG Services Grid
 * 2x3 Grid of clean tiles with crisp SVG vector icons and pagination bar.
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { SvgIcon, type IconName } from '@/components/SvgIcons';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, Spacing, FontSize, FontWeight, Shadows } from '@/constants/theme';

export interface ServiceItem {
  id: string;
  iconName: IconName;
  label: string;
  badge?: string;
  onPress: () => void;
}

interface ServicesGridProps {
  services: ServiceItem[];
  onGridToggle?: () => void;
}

export function QuickActions({ services, onGridToggle }: ServicesGridProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Header: "Services" + Right Grid Icon */}
      <View style={styles.headerRow}>
        <ThemedText style={[styles.title, { color: theme.text }]}>
          Services
        </ThemedText>
        <Pressable onPress={onGridToggle} style={styles.gridToggleBtn}>
          <SvgIcon name="more" size={16} color={theme.textSecondary} />
        </Pressable>
      </View>

      {/* 2x3 Grid of Tiles */}
      <View style={styles.grid}>
        {services.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.tile,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }],
                ...Shadows.serviceTile,
              },
            ]}
          >
            {/* Minimalist Vector Icon Container */}
            <View style={[styles.iconContainer, { backgroundColor: theme.successBg }]}>
              <SvgIcon name={item.iconName} size={20} color={theme.primary} />
            </View>

            {/* Label */}
            <ThemedText style={[styles.label, { color: theme.text }]} numberOfLines={1}>
              {item.label}
            </ThemedText>

            {/* Optional Micro Badge */}
            {item.badge && (
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {/* Pagination Bar */}
      <View style={styles.paginationRow}>
        <View style={[styles.dot, styles.activeDot, { backgroundColor: theme.primary }]} />
        <View style={[styles.dot, styles.dash, { backgroundColor: '#CBD5E1' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two + 2,
    paddingHorizontal: Spacing.one,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.black,
    letterSpacing: -0.3,
  },
  gridToggleBtn: {
    padding: Spacing.one,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two + 2,
    justifyContent: 'space-between',
  },
  tile: {
    width: '31%',
    aspectRatio: 1.05,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    position: 'relative',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.three,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  activeDot: {
    width: 22,
  },
  dash: {
    width: 10,
  },
});
