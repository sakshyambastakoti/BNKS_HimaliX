# 🚀 OffPay — Supabase Cloud Database & Ledger Integration Guide

This guide explains how to set up **Supabase (PostgreSQL Cloud)** to store, replicate, and query all **OffPay transaction logs**, **cardholder vaults**, and **multi-terminal audit ledgers** in real time.

---

## 📋 Table of Contents
1. [Overview & Architecture](#1-overview--architecture)
2. [Step 1: Create a Supabase Project](#step-1-create-a-supabase-project)
3. [Step 2: Run SQL Database Migration](#step-2-run-sql-database-migration)
4. [Step 3: Configure Row Level Security (RLS)](#step-3-configure-row-level-security-rls)
5. [Step 4: Enable Realtime Replication](#step-4-enable-realtime-replication)
6. [Step 5: Get Project URL & Public API Key](#step-5-get-project-url--public-api-key)
7. [Step 6: Connect Supabase in OffPay Terminal Web UI](#step-6-connect-supabase-in-offpay-terminal-web-ui)
8. [Step 7: Verification & Testing](#step-7-verification--testing)
9. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## 1. Overview & Architecture

OffPay uses a **hybrid edge-to-cloud architecture**:
- **Offline Edge**: Hardware RFID reader processes NFC card taps offline locally with LittleFS storage.
- **Local / MQTT Peer Sync**: Instant browser/peer sync over MQTT WebSocket topics.
- **Supabase Cloud Database**: Central cloud PostgreSQL database where all transactions, approved payments, declined balance alerts, and registered cards are replicated and backed up.

```
[ ESP32 Hardware Terminal ] ──(WiFi/MQTT)──> [ OffPay Web Terminal ]
                                                    │
                                                    ▼ (HTTPS / Supabase JS SDK)
                                      [ Supabase PostgreSQL Cloud ]
                                      ├── `transactions` (Ledger)
                                      ├── `cards` (Cardholder Vaults)
                                      └── `stations` (Terminal Nodes)
```

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **"New project"**.
3. Choose your organization and fill in project details:
   - **Name**: `OffPay-Terminal-DB` (or any name)
   - **Database Password**: Choose a strong password and save it.
   - **Region**: Choose the region closest to you (e.g. `Singapore`, `Mumbai`, etc.).
   - **Pricing Plan**: `Free`
4. Click **"Create new project"** and wait ~1 minute for database provisioning.

---

## Step 2: Run SQL Database Migration

1. In your Supabase Dashboard, click on the **SQL Editor** icon in the left navigation sidebar (or press `Ctrl+K` and type `SQL Editor`).
2. Click **"New query"**.
3. Copy and paste the complete SQL script below:

```sql
-- ══════════════════════════════════════════════════════════════════
-- OFFPAY TERMINAL DATABASE SCHEMA (POSTGRESQL)
-- ══════════════════════════════════════════════════════════════════

-- 1. Create Cards Table (Cardholder Vaults)
CREATE TABLE IF NOT EXISTS public.cards (
    uid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Transactions Table (Full Audit Ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT UNIQUE,
    timestamp TEXT NOT NULL,
    card_uid TEXT NOT NULL,
    cardholder_name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    prev_balance NUMERIC(12, 2) NOT NULL,
    remaining_balance NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL,
    station_name TEXT DEFAULT 'OffPay Station 1',
    synced BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Stations Table (Terminal Nodes)
CREATE TABLE IF NOT EXISTS public.stations (
    station_id TEXT PRIMARY KEY,
    station_name TEXT NOT NULL,
    status TEXT DEFAULT 'ONLINE',
    ip_address TEXT,
    last_ping TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Create Indexes for High-Speed Lookups
CREATE INDEX IF NOT EXISTS idx_txns_card_uid ON public.transactions (card_uid);
CREATE INDEX IF NOT EXISTS idx_txns_created_at ON public.transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_txns_status ON public.transactions (status);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards (user_id);

-- 5. Seed Initial Demo Cards (Optional)
INSERT INTO public.cards (uid, name, user_id, balance)
VALUES 
    ('A3 F8 12 B9', 'Sakshyam Bastakoti', 'USR-001', 2500.00),
    ('7C 90 4A E1', 'Zenith Kandel', 'USR-002', 1800.00),
    ('F1 4D 88 33', 'Aarav Sharma', 'USR-003', 950.00)
ON CONFLICT (uid) DO UPDATE 
SET balance = EXCLUDED.balance, name = EXCLUDED.name;
```

4. Click **"Run"** (or press `Ctrl+Enter`).
5. You should see `Success. No rows returned`.

---

## Step 3: Configure Row Level Security (RLS)

To allow the OffPay Web Terminal to insert and query transactions using the `anon` public key, run this in the **SQL Editor**:

```sql
-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;

-- Allow Public Anon Access to Insert and Read Transactions
CREATE POLICY "Allow public read transactions" ON public.transactions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert transactions" ON public.transactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update transactions" ON public.transactions
    FOR UPDATE USING (true);

-- Allow Public Anon Access to Read and Upsert Cards
CREATE POLICY "Allow public read cards" ON public.cards
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert cards" ON public.cards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update cards" ON public.cards
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete cards" ON public.cards
    FOR DELETE USING (true);
```

Click **"Run"**.

---

## Step 4: Enable Realtime Replication

To make Supabase broadcast live database changes to all connected apps and terminals:

1. In the Supabase Dashboard, go to **Database** -> **Replication** (or **Table Editor**).
2. Look for the `transactions` and `cards` tables.
3. Toggle **"Realtime"** to **ON** for both tables.
*(Alternatively, run in SQL Editor):*
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cards;
```

---

## Step 5: Get Project URL & Public API Key

1. In Supabase Dashboard, click the **Settings (gear icon)** at the bottom of the left sidebar.
2. Click on **"API"** under Project Settings.
3. Find the following two values:
   - **Project URL**: (e.g. `https://abcxyzopqrst.supabase.co`)
   - **Project API Keys**: Copy the **`anon` `public`** key (starts with `eyJhbGciOi...`).

---

## Step 6: Connect Supabase in OffPay Terminal Web UI

1. Open the **OffPay Terminal Web UI** (open `index.html` or `off-pay.html`).
2. Click the **"Settings"** tab at the top.
3. Scroll down to the **"Supabase PostgreSQL Cloud Ledger Database"** section.
4. Paste your **Supabase Project URL** and **Anon Public API Key**:
   - `Supabase Project URL`: `https://YOUR_PROJECT_ID.supabase.co`
   - `Supabase Anon Public API Key`: `eyJhbGciOiJIUzI1NiIsInR5c...`
   - Ensure **"Auto-Replicate Transactions & Cards"** is checked (`Enabled`).
5. Click **"Save & Connect Supabase"**.
6. The status badge will immediately turn green: **`Online (Supabase DB)`**!

---

## Step 7: Verification & Testing

### Test 1: Push Existing Offline Ledger
- In **Settings**, click **"Push Local Ledger to Cloud"**.
- A toast notification will confirm: `Synced X cards & Y transactions to Supabase!`.
- Go to your Supabase Dashboard -> **Table Editor** -> `transactions` to see all your records!

### Test 2: Process a New Payment
- Go to **Terminal Dashboard**.
- Enter an amount (e.g. `150`) and initiate payment.
- Tap a card or trigger payment.
- Go to Supabase `transactions` table — the new transaction is inserted automatically in real time!

### Test 3: Multi-Device Pull
- On another phone or browser, open the Terminal and click **"Pull Remote Data from Cloud"**.
- All cards and transaction history will be fetched from Supabase and populated into the UI instantly.

---

## Troubleshooting & FAQs

### Q: What if I get `new row violates row-level security policy`?
**A:** Run the RLS policy script from [Step 3](#step-3-configure-row-level-security-rls) in your Supabase SQL Editor.

### Q: Can I use Supabase with the Node.js backend?
**A:** Yes! In `server/.env`, you can add:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-or-anon-key
```
And query via `@supabase/supabase-js`.

### Q: What happens if the internet goes down?
**A:** OffPay continues processing transactions 100% offline locally using local storage and ESP32 flash memory. When internet returns, clicking **"Push Local Ledger to Cloud"** reconciles and uploads all buffered transactions with 0 data loss.
