/**
 * OffPay Developer Logs Screen — Live Cryptographic & Node Telemetry
 * Color-coded log viewer (INFO/WARN/ERROR) for debugging
 * crypto operations, signature verification, and sync events.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useLogStore, type LogEntry } from '@/store/useLogStore';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { MOCK_LOG_ENTRIES } from '@/constants/mock-data';

export default function LogsScreen() {
  const theme = useTheme();
  const { logs, addLog, clearLogs } = useLogStore();

  // Seed mock logs on first render if empty
  useEffect(() => {
    if (logs.length === 0) {
      MOCK_LOG_ENTRIES.forEach((entry) => {
        addLog(entry.level, entry.message);
      });
    }
  }, []);

  const levelColors = {
    INFO: theme.info,
    WARN: theme.warning,
    ERROR: theme.error,
  };

  const renderLogEntry = ({ item }: { item: LogEntry }) => (
    <View style={[logStyles.entry, { backgroundColor: theme.cardGlass, borderLeftColor: levelColors[item.level] }]}>
      <View style={logStyles.header}>
        <View
          style={[
            logStyles.levelBadge,
            { backgroundColor: levelColors[item.level] + '20', borderColor: levelColors[item.level] + '40' },
          ]}
        >
          <ThemedText
            style={[logStyles.levelText, { color: levelColors[item.level] }]}
          >
            {item.level}
          </ThemedText>
        </View>
        <ThemedText style={[logStyles.timestamp, { color: theme.textMuted }]}>
          {item.timestamp}
        </ThemedText>
      </View>
      <ThemedText style={[logStyles.message, { color: theme.text }]}>
        {item.message}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Controls */}
      <View style={[styles.controls, { borderBottomColor: theme.border, backgroundColor: theme.cardGlass }]}>
        <View style={styles.controlLeft}>
          <ThemedText style={[styles.logCount, { color: theme.textSecondary }]}>
            {logs.length} live telemetry entries
          </ThemedText>
        </View>
        <View style={styles.controlRight}>
          <Pressable
            onPress={() => addLog('INFO', `[MANUAL_PROBE] Pinged local validator at ${new Date().toLocaleTimeString()}`)}
            style={({ pressed }) => [
              styles.controlButton,
              { backgroundColor: theme.primaryGlow, borderColor: theme.primary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ThemedText style={[styles.controlButtonText, { color: theme.primary }]}>
              + Probe
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={clearLogs}
            style={({ pressed }) => [
              styles.controlButton,
              { backgroundColor: theme.errorBg, borderColor: theme.error + '40', opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ThemedText style={[styles.controlButtonText, { color: theme.error }]}>
              Clear
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Log list */}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderLogEntry}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.two }} />}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: theme.cardGlass, borderColor: theme.border }]}>
            <ThemedText style={styles.emptyIcon}>📋</ThemedText>
            <ThemedText style={[styles.emptyText, { color: theme.text }]}>
              No log traces recorded
            </ThemedText>
            <ThemedText style={[styles.emptyHint, { color: theme.textMuted }]}>
              Ed25519 cryptography and peer sync events will stream here live.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  controlLeft: {},
  controlRight: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  logCount: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  controlButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  controlButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
  },
  listContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  emptyHint: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});

const logStyles = StyleSheet.create({
  entry: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3.5,
    gap: Spacing.one + 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  levelBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  levelText: {
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  message: {
    fontSize: FontSize.xs + 1,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
