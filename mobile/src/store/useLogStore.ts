/**
 * OffPay Developer Log Store (Zustand)
 * Captures INFO/WARN/ERROR events from crypto and sync services.
 * Renders in the Logs screen for debugging the offline handshake.
 */

import { create } from 'zustand';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: string;
}

interface LogState {
  logs: LogEntry[];
  addLog: (level: LogLevel, message: string) => void;
  clearLogs: () => void;
}

let logCounter = 0;

export const useLogStore = create<LogState>((set) => ({
  logs: [],

  addLog: (level, message) => {
    logCounter += 1;
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, '0')}`;

    const entry: LogEntry = {
      id: `log-${logCounter}`,
      level,
      message,
      timestamp,
    };

    set((state) => ({
      logs: [entry, ...state.logs].slice(0, 200), // Keep max 200 entries
    }));
  },

  clearLogs: () => set({ logs: [] }),
}));
