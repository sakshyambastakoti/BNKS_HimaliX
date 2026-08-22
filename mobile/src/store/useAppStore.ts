/**
 * OffPay Application Store (Zustand)
 * Holds JWT, user profile, cached balances, and network status.
 * As specified in the BondPay documentation.
 */

import { create } from 'zustand';
import { MOCK_USER, MOCK_BALANCES, type MockUser } from '@/constants/mock-data';

type NetworkStatus = 'online' | 'offline' | 'wifi-only';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  jwt: string | null;
  user: MockUser | null;

  // Balances
  onlineBalance: number;
  offlineBalance: number;
  totalBalance: number;

  // Network
  networkStatus: NetworkStatus;

  // Actions
  setAuthenticated: (value: boolean) => void;
  setJwt: (jwt: string | null) => void;
  setUser: (user: MockUser | null) => void;
  setOnlineBalance: (amount: number) => void;
  setOfflineBalance: (amount: number) => void;
  setNetworkStatus: (status: NetworkStatus) => void;
  login: (user: MockUser, jwt: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initialize with mock data for development
  isAuthenticated: true,
  jwt: 'mock-jwt-token-dev',
  user: MOCK_USER,

  onlineBalance: MOCK_BALANCES.online,
  offlineBalance: MOCK_BALANCES.offline,
  totalBalance: MOCK_BALANCES.total,

  networkStatus: 'online',

  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setJwt: (jwt) => set({ jwt }),
  setUser: (user) => set({ user }),
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
  login: (user, jwt) =>
    set({
      isAuthenticated: true,
      user,
      jwt,
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      jwt: null,
      onlineBalance: 0,
      offlineBalance: 0,
      totalBalance: 0,
    }),
}));
