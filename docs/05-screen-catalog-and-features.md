# 📱 Mobile Screen Catalog & UI Components

> **Navigation**: [Docs Portal](file:///d:/BNKS_HimaliX/docs/README.md) | [04. Database & Sync](file:///d:/BNKS_HimaliX/docs/04-database-and-sync-engine.md) | **Next**: [06. Developer Guide](file:///d:/BNKS_HimaliX/docs/06-developer-setup-and-run-guide.md)

---

## 1. Route Map & Component Hierarchy

```
mobile/src/app/
├── (auth)/
│   ├── login.tsx            → Credentials input, JWT initialization, quick dev login
│   └── signup.tsx           → Registration, Ed25519 keypair generation, public key upload
├── (tabs)/
│   ├── index.tsx            → Dashboard: Balance card, Quick actions, Recent ledger
│   ├── history.tsx          → Complete transaction list with sync badges (synced/pending)
│   ├── account.tsx          → Profile, User ID, Public key copy, Developer shortcuts
│   └── settings.tsx         → Network state simulator, DB purge, Key regenerator
├── send.tsx                 → Online transfer vs. Offline bond allocation & QR generator
├── receive.tsx              → Payment request creator & dynamic receive QR renderer
├── scan-qr.tsx              → Camera scanner with targeting HUD & payload parser
├── payment-confirmation.tsx → Cryptographic verification receipt & bond breakdown
└── logs.tsx                 → Real-time developer audit log stream (INFO/WARN/ERROR)
```

---

## 2. Screen Breakdown & User Experience

### 2.1 Dashboard (`/(tabs)/index.tsx`)
* **Header**: Brand logo + live network badge (`🟢 Online`, `🔴 Offline`, `🟡 Wi-Fi Only`).
* **Balance Card**: Interactive glassmorphic card displaying **Total Balance**, **Online Vault**, and **Offline Pocket**.
* **Action Buttons**: Massive gradient buttons for **Send (↗)** and **Receive (↙)**.
* **Quick Grid**: Shortcuts for `⊕ Top Up`, `⬡ Load Bond`, `⟳ Sync`, `↩ Reverse Bond`.
* **Recent Activity**: Last 5 transactions with live status indicators.

---

### 2.2 Send Screen (`/send.tsx`)
* **Dynamic Mode Detection**:
  - In **Online Mode**: Standard receiver ID / phone transfer debited from Online Vault.
  - In **Offline Mode**: Prompts user to scan receiver's Request QR or enter amount to allocate offline bonds.
* **Bond Selector**: Automatically combines denominations (e.g. NPR 500 = `BOND-001 [200] + BOND-002 [200] + BOND-003 [100]`).
* **Payment QR Generator**: Hashes payload with SHA-256 and signs with user's private key.

---

### 2.3 Receive Screen (`/receive.tsx`)
* **Request Mode**: User inputs amount (e.g., NPR 500) to generate a dynamic `OFFPAY_REQUEST` QR code.
* **Offline Handshake Button**: Prominent **"Verify Payment — Scan Sender's QR"** button to scan the sender's payment confirmation voucher.

---

### 2.4 Payment Confirmation (`/payment-confirmation.tsx`)
* **Visual States**: Animated status icons (`⏳ Processing...` → `✓ Payment Successful!`).
* **Receipt Breakdown**: Transaction ID, Amount, Recipient, Bond IDs used, and Sync status.
* **Signature Badge**: Prominent confirmation badge: `✓ Ed25519 signature verified`.

---

### 2.5 Settings & Environment Simulator (`/(tabs)/settings.tsx`)
* **Network Simulator**: Easily switch between `Online`, `Offline`, and `Wi-Fi Only` to test off-grid resilience during demos.
* **Security Tools**: Export Public Key, Regenerate Keypair, Clear Local Database.

---

### 2.6 Developer Logs (`/logs.tsx`)
* Color-coded event stream for cryptographic signing, verification, and sync errors:
  - `[INFO]` (Blue): Key loaded, signature verified, SQLite written.
  - `[WARN]` (Yellow): Offline mode active, sync deferred.
  - `[ERROR]` (Red): Signature mismatch, network timeout.
