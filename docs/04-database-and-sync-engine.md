# 🗄️ Database Schemas & Reconciliation Sync Engine

> **Navigation**: [Docs Portal](file:///d:/BNKS_HimaliX/docs/README.md) | [03. QR Handshake](file:///d:/BNKS_HimaliX/docs/03-offline-qr-handshake.md) | **Next**: [05. Screen Catalog](file:///d:/BNKS_HimaliX/docs/05-screen-catalog-and-features.md)

---

## 1. Frontend SQLite Schema (Mobile Local Storage)

The client application maintains a local SQLite database that acts as an offline ledger.

```sql
-- Offline Bond Pocket Table
CREATE TABLE IF NOT EXISTS bonds (
    bond_id TEXT PRIMARY KEY,
    value INTEGER NOT NULL,
    owner_id TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    server_signature TEXT NOT NULL,
    status TEXT CHECK(status IN ('available', 'spent', 'pending_sync')) NOT NULL DEFAULT 'available'
);

-- Local Transaction Ledger
CREATE TABLE IF NOT EXISTS transactions (
    tx_id TEXT PRIMARY KEY,
    type TEXT CHECK(type IN ('sent', 'received', 'topup', 'bond_load', 'bond_reverse')) NOT NULL,
    amount INTEGER NOT NULL,
    counterparty TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT CHECK(status IN ('completed', 'pending', 'synced', 'failed')) NOT NULL,
    is_offline INTEGER NOT NULL DEFAULT 1,
    payload_json TEXT
);

-- Reconciliation Outbox Queue
CREATE TABLE IF NOT EXISTS sync_queue (
    queue_id TEXT PRIMARY KEY,
    tx_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    retry_count INTEGER DEFAULT 0
);
```

---

## 2. Backend PostgreSQL Schema (Central Banking Ledger)

```sql
-- User Profiles and Public Key Registry
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    public_key TEXT NOT NULL,
    online_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authoritative Central Bond Register
CREATE TABLE issued_bonds (
    bond_id VARCHAR(64) PRIMARY KEY,
    owner_id UUID REFERENCES users(user_id),
    value INTEGER NOT NULL,
    server_signature TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'spent', 'revoked')) DEFAULT 'active',
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Master Settlement Ledger
CREATE TABLE transactions (
    tx_id VARCHAR(64) PRIMARY KEY,
    sender_id UUID REFERENCES users(user_id),
    receiver_id UUID REFERENCES users(user_id),
    amount NUMERIC(12, 2) NOT NULL,
    is_offline BOOLEAN NOT NULL,
    sender_signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anti-Double Spending Redemptions
CREATE TABLE bond_redemptions (
    redemption_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bond_id VARCHAR(64) REFERENCES issued_bonds(bond_id),
    tx_id VARCHAR(64) REFERENCES transactions(tx_id),
    redeemed_by UUID REFERENCES users(user_id),
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_bond_redemption UNIQUE(bond_id)
);

-- Fraud Incident Audit Log
CREATE TABLE fraud_flags (
    flag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    flag_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) CHECK(severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Reconciliation & Single-Party Sync Algorithm

```
                             [INTERNET RESTORED]
                                      │
                                      ▼
                        POST /transactions/sync
                       (Uploads Pending Vouchers)
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [1. Value Integrity Check]            [2. Server Signature Check]
        Total Bond Values == tx.amount?        Server signed each bond?
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       [3. Sender Signature Check]
                       Ed25519_Verify(senderPublicKey)?
                                      │
                                      ▼
                       [4. Double-Spend Lookup]
                      Exists in bond_redemptions?
                         /                  \
                      [NO]                  [YES]
                       │                      │
                       ▼                      ▼
           [Commit Transaction]      [Flag Fraud Incident]
          • Credit receiver balance  • Log CRITICAL in fraud_flags
          • Invalidate bonds         • Reject duplicate redemption
          • Return 200 Settled       • Freeze sender account
```
