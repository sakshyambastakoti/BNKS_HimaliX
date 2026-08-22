/**
 * OffPay Mobile API Service
 * Handles communication with the local PC backend server.
 */

import { Platform } from 'react-native';

// Default to localhost for web/iOS, and 10.0.2.2 for Android emulator
let defaultHost = 'http://localhost:3000/api';
if (Platform.OS === 'android') {
  defaultHost = 'http://10.0.2.2:3000/api';
}

class ApiService {
  private baseUrl: string = defaultHost;
  private token: string | null = null;

  public setBaseUrl(url: string) {
    this.baseUrl = url.endsWith('/api') ? url : `${url}/api`;
    console.log(`[API] Server Base URL set to: ${this.baseUrl}`);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      return data as T;
    } catch (err: any) {
      console.warn(`[API] Request failed for ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Health check
  public async checkHealth(): Promise<{ status: string; version: string; serverPublicKey: string }> {
    return this.request('/health');
  }

  // Auth
  public async signup(params: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    publicKey?: string;
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public async login(params: { identifier: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public async getMe() {
    return this.request('/auth/me');
  }

  // Wallet
  public async getBalance() {
    return this.request('/wallet/balance');
  }

  public async topup(amount: number) {
    return this.request('/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Bonds
  public async issueBonds(amount: number) {
    return this.request('/bonds/issue', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  public async reverseBonds(bondIds: string[]) {
    return this.request('/bonds/reverse', {
      method: 'POST',
      body: JSON.stringify({ bondIds }),
    });
  }

  // Sync
  public async syncTransactions(transactions: any[]) {
    return this.request('/transactions/sync', {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    });
  }
}

export const api = new ApiService();
