/**
 * Mock data for OffPay development
 * Used to populate UI screens before integrating real SQLite and backend data.
 */

export interface MockTransaction {
  id: string;
  type: 'sent' | 'received' | 'topup' | 'bond_load' | 'bond_reverse' | 'sync';
  amount: number;
  counterparty: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed' | 'synced';
  isOffline: boolean;
}

export interface MockBond {
  bondId: string;
  value: number;
  status: 'available' | 'spent' | 'received_pending_sync';
}

export interface MockUser {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  publicKey: string;
}

export const MOCK_USER: MockUser = {
  userId: 'usr-a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  fullName: 'Aarav Sharma',
  phone: '+977-9841234567',
  email: 'aarav@offpay.np',
  publicKey: '302a300506032b6570032100d7a8f0c1e2b3a4d5e6f7...truncated',
};

export const MOCK_BALANCES = {
  online: 3000,
  offline: 2000,
  total: 5000,
};

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: 'tx-001',
    type: 'sent',
    amount: 500,
    counterparty: 'Ram Bahadur',
    timestamp: '2026-08-22T09:30:00+05:45',
    status: 'completed',
    isOffline: true,
  },
  {
    id: 'tx-002',
    type: 'received',
    amount: 200,
    counterparty: 'Sita Devi',
    timestamp: '2026-08-22T08:15:00+05:45',
    status: 'pending',
    isOffline: true,
  },
  {
    id: 'tx-003',
    type: 'topup',
    amount: 1000,
    counterparty: 'Bank Transfer',
    timestamp: '2026-08-21T14:00:00+05:45',
    status: 'completed',
    isOffline: false,
  },
  {
    id: 'tx-004',
    type: 'sent',
    amount: 350,
    counterparty: 'Krishna Tea House',
    timestamp: '2026-08-21T10:45:00+05:45',
    status: 'synced',
    isOffline: true,
  },
  {
    id: 'tx-005',
    type: 'received',
    amount: 1500,
    counterparty: 'Binod Gurung',
    timestamp: '2026-08-20T16:30:00+05:45',
    status: 'completed',
    isOffline: false,
  },
  {
    id: 'tx-006',
    type: 'bond_load',
    amount: 2000,
    counterparty: 'Bond Load',
    timestamp: '2026-08-20T12:00:00+05:45',
    status: 'completed',
    isOffline: false,
  },
  {
    id: 'tx-007',
    type: 'sent',
    amount: 75,
    counterparty: 'Safa Tempo',
    timestamp: '2026-08-19T08:30:00+05:45',
    status: 'synced',
    isOffline: true,
  },
  {
    id: 'tx-008',
    type: 'received',
    amount: 800,
    counterparty: 'Anita Thapa',
    timestamp: '2026-08-18T17:00:00+05:45',
    status: 'completed',
    isOffline: true,
  },
];

export const MOCK_BONDS: MockBond[] = [
  { bondId: 'BOND-001', value: 1000, status: 'available' },
  { bondId: 'BOND-002', value: 500, status: 'available' },
  { bondId: 'BOND-003', value: 200, status: 'available' },
  { bondId: 'BOND-004', value: 200, status: 'available' },
  { bondId: 'BOND-005', value: 100, status: 'available' },
];

export const MOCK_LOG_ENTRIES = [
  { id: '1', level: 'INFO' as const, message: 'CryptoService initialized', timestamp: '10:30:01.234' },
  { id: '2', level: 'INFO' as const, message: 'Ed25519 keypair loaded from SecureStore', timestamp: '10:30:01.456' },
  { id: '3', level: 'INFO' as const, message: 'SQLite database opened successfully', timestamp: '10:30:01.789' },
  { id: '4', level: 'WARN' as const, message: 'Network status: OFFLINE — sync deferred', timestamp: '10:30:02.123' },
  { id: '5', level: 'INFO' as const, message: 'Bond verification: BOND-001 ✓ valid server signature', timestamp: '10:31:15.456' },
  { id: '6', level: 'INFO' as const, message: 'Transaction tx-001: SHA-256 hash computed', timestamp: '10:31:15.789' },
  { id: '7', level: 'INFO' as const, message: 'Transaction tx-001: Ed25519 signature generated (64 bytes)', timestamp: '10:31:16.012' },
  { id: '8', level: 'ERROR' as const, message: 'Sync attempt failed: ERR_NETWORK_UNREACHABLE', timestamp: '10:32:00.345' },
  { id: '9', level: 'INFO' as const, message: 'Receiver verification: sender signature VALID', timestamp: '10:33:45.678' },
  { id: '10', level: 'INFO' as const, message: 'Transaction recorded in local SQLite ledger', timestamp: '10:33:45.901' },
];

export function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString('en-NP')}`;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-NP', { month: 'short', day: 'numeric' });
}
