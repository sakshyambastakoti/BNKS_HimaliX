import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || './data/offpay.db';
const absoluteDbPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);

// Ensure data directory exists
const dataDir = path.dirname(absoluteDbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const sqliteDb = new sqlite3.Database(absoluteDbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`📦 Connected to local SQLite database at: ${absoluteDbPath}`);
  }
});

// Promise wrapper utilities for SQLite
export const db = {
  get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      sqliteDb.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  },

  all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve((rows || []) as T[]);
      });
    });
  },

  run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },

  async exec(sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
      sqliteDb.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
};

/**
 * Initializes database tables
 */
export async function initDatabase(): Promise<void> {
  console.log('🔄 Running database schema initialization...');

  const schema = `
    -- Server Keypair Persistence
    CREATE TABLE IF NOT EXISTS server_keys (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      public_key TEXT NOT NULL,
      private_key TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    -- Registered User Accounts
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      public_key TEXT NOT NULL,
      online_balance REAL NOT NULL DEFAULT 3000.0,
      created_at TEXT NOT NULL
    );

    -- Authoritative Bond Issuance Record
    CREATE TABLE IF NOT EXISTS issued_bonds (
      bond_id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      value INTEGER NOT NULL,
      server_signature TEXT NOT NULL,
      status TEXT CHECK (status IN ('active', 'spent', 'revoked')) DEFAULT 'active',
      issued_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users(user_id)
    );

    -- Master Central Transactions Ledger
    CREATE TABLE IF NOT EXISTS transactions (
      tx_id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      amount REAL NOT NULL,
      is_offline INTEGER NOT NULL DEFAULT 0,
      sender_signature TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (sender_id) REFERENCES users(user_id),
      FOREIGN KEY (receiver_id) REFERENCES users(user_id)
    );

    -- Anti-Double Spending Redemption Table
    CREATE TABLE IF NOT EXISTS bond_redemptions (
      redemption_id TEXT PRIMARY KEY,
      bond_id TEXT NOT NULL UNIQUE,
      tx_id TEXT NOT NULL,
      redeemed_by TEXT NOT NULL,
      redeemed_at TEXT NOT NULL,
      FOREIGN KEY (bond_id) REFERENCES issued_bonds(bond_id),
      FOREIGN KEY (tx_id) REFERENCES transactions(tx_id),
      FOREIGN KEY (redeemed_by) REFERENCES users(user_id)
    );

    -- Fraud Incident & Double-Spend Audit Log
    CREATE TABLE IF NOT EXISTS fraud_flags (
      flag_id TEXT PRIMARY KEY,
      user_id TEXT,
      flag_type TEXT NOT NULL,
      severity TEXT CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `;

  await db.exec(schema);
  console.log('✅ Database schema initialized successfully.');
}
