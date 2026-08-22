/**
 * OffPay Application Store (Zustand)
 * Holds JWT, user profile, cached balances, network status, and theme mode (light/dark/system).
 * Interacts with the local PC backend server when online.
 */

import { create } from 'zustand';
import { MOCK_USER, MOCK_BALANCES, type MockUser } from '@/constants/mock-data';
import { api } from '@/services/api';

type NetworkStatus = 'online' | 'offline' | 'wifi-only';
export type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  jwt: string | null;
  user: MockUser | null;
  serverUrl: string;

  // Balances
  onlineBalance: number;
  offlineBalance: number;
  totalBalance: number;

  // Network & Theme
  networkStatus: NetworkStatus;
  themeMode: ThemeMode;

  // Actions
  setAuthenticated: (value: boolean) => void;
  setJwt: (jwt: string | null) => void;
  setUser: (user: MockUser | null) => void;
  setServerUrl: (url: string) => void;
  setOnlineBalance: (amount: number) => void;
  setOfflineBalance: (amount: number) => void;
  setNetworkStatus: (status: NetworkStatus) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  login: (user: MockUser, jwt: string) => void;
  logout: () => void;
  fetchLiveBalance: () => Promise<void>;
  topupLive: (amount: number) => Promise<void>;
  issueBondsLive: (amount: number) => Promise<any>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initialize with mock data for development
  isAuthenticated: true,
  jwt: 'mock-jwt-token-dev',
  user: MOCK_USER,
  serverUrl: 'http://localhost:3000',

  onlineBalance: MOCK_BALANCES.online,
  offlineBalance: MOCK_BALANCES.offline,
  totalBalance: MOCK_BALANCES.total,

  networkStatus: 'online',
  themeMode: 'light', // Default to clean modern white banking theme

  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setJwt: (jwt) => {
    api.setToken(jwt);
    set({ jwt });
  },
  setUser: (user) => set({ user }),
  setServerUrl: (url) => {
    api.setBaseUrl(url);
    set({ serverUrl: url });
  },
  setOnlineBalance: (amount) =>
    set((state) => ({
      onlineBalance: amount,
      totalBalance: amount + state.offlineBalance,
    })),
  setOfflineBalance: (amount) =>
    set((state) => ({
      offlineBalance: amount,
      totalBalance: state.onlineBalance + amount,
    })),
  setNetworkStatus: (status) => set({ networkStatus: status }),
  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleTheme: () =>
    set((state) => ({
      themeMode: state.themeMode === 'dark' ? 'light' : 'dark',
    })),
  login: (user, jwt) => {
    api.setToken(jwt);
    set({
      isAuthenticated: true,
      user,
      jwt,
    });
  },
  logout: () => {
    api.setToken(null);
    set({
      isAuthenticated: false,
      user: null,
      jwt: null,
      onlineBalance: 0,
      offlineBalance: 0,
      totalBalance: 0,
    });
  },

  // Live Backend Operations (when online)
  fetchLiveBalance: async () => {
    try {
      const data = await api.getBalance();
      set((state) => ({
        onlineBalance: data.onlineBalance,
        offlineBalance: data.offlineBalance,
        totalBalance: data.totalBalance,
      }));
    } catch (err) {
      console.warn('Could not fetch live balance from server, using cached local balance.');
    }
  },

  topupLive: async (amount: number) => {
    try {
      const res = await api.topup(amount);
      set((state) => ({
        onlineBalance: res.newOnlineBalance,
        totalBalance: res.newOnlineBalance + state.offlineBalance,
      }));
    } catch (err: any) {
      get().setOnlineBalance(get().onlineBalance + amount);
    }
  },

  issueBondsLive: async (amount: number) => {
    try {
      const res = await api.issueBonds(amount);
      set((state) => ({
        onlineBalance: res.newOnlineBalance,
        offlineBalance: state.offlineBalance + amount,
        totalBalance: res.newOnlineBalance + state.offlineBalance + amount,
      }));
      return res.bonds;
    } catch (err) {
      get().setOnlineBalance(Math.max(0, get().onlineBalance - amount));
      get().setOfflineBalance(get().offlineBalance + amount);
      return [];
    }
  },
}));
