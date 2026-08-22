/**
 * OffPay Developer Logs Screen
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

  // Seed mock logs on first render
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
    <View style={[logStyles.entry, { borderLeftColor: levelColors[item.level] }]}>
      <View style={logStyles.header}>
        <View
          style={[
            logStyles.levelBadge,
            { backgroundColor: levelColors[item.level] + '20' },
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
      <View style={[styles.controls, { borderBottomColor: theme.border }]}>
        <View style={styles.controlLeft}>
          <ThemedText style={[styles.logCount, { color: theme.textSecondary }]}>
            {logs.length} entries
          </ThemedText>
        </View>
        <View style={styles.controlRight}>
          <Pressable
            onPress={() => addLog('INFO', 'Manual log entry test')}
            style={[styles.controlButton, { backgroundColor: theme.info + '20' }]}
          >
            <ThemedText style={[styles.controlButtonText, { color: theme.info }]}>
              + Add
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={clearLogs}
            style={[styles.controlButton, { backgroundColor: theme.error + '20' }]}
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
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon}>📋</ThemedText>
            <ThemedText style={[styles.emptyText, { color: theme.textMuted }]}>
              No log entries yet
            </ThemedText>
            <ThemedText style={[styles.emptyHint, { color: theme.textMuted }]}>
              Crypto and sync events will appear here
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
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderBottomWidth: 1,
  },
  controlLeft: {},
  controlRight: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  logCount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  controlButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: BorderRadius.sm,
  },
  controlButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  separator: {
    height: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  emptyHint: {
    fontSize: FontSize.sm,
  },
});

const logStyles = StyleSheet.create({
  entry: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderLeftWidth: 3,
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
    borderRadius: BorderRadius.sm,
  },
  levelText: {
    fontSize: 10,
    fontWeight: FontWeight.extrabold,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  message: {
    fontSize: FontSize.sm,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});
