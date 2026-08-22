# 📖 OffPay (HimaliX) - Complete Features & System Specification

> **OffPay** is an offline, off-grid peer-to-peer (P2P) digital payment mobile application engineered to enable secure financial transactions without an active internet or cellular connection.

---

## 📑 Table of Contents
1. [Core Architecture & Philosophy](#1-core-architecture--philosophy)
2. [Dual-Balance Management System](#2-dual-balance-management-system)
3. [Cryptographic Security & Handshake Model](#3-cryptographic-security--handshake-model)
4. [Authentication & Identity Management](#4-authentication--identity-management)
5. [Main Dashboard & Balance Card](#5-main-dashboard--balance-card)
6. [Send Payment System (Online & Offline)](#6-send-payment-system-online--offline)
7. [Receive Payment & Dynamic QR Generation](#7-receive-payment--dynamic-qr-generation)
8. [Camera QR Scanner Engine](#8-camera-qr-scanner-engine)
9. [Payment Verification & Confirmation](#9-payment-verification--confirmation)
10. [Transaction History & Ledger Management](#10-transaction-history--ledger-management)
11. [Developer Audit Logs & Monitoring](#11-developer-audit-logs--monitoring)
12. [Network Simulation & Developer Settings](#12-network-simulation--developer-settings)
13. [Data Storage & Synchronization Strategy](#13-data-storage--synchronization-strategy)
14. [Screen Directory & Navigation Routes](#14-screen-directory--navigation-routes)

---

## 1. Core Architecture & Philosophy

OffPay resolves the fundamental challenge of digital payments in disaster zones, rural areas, or network outages: **How to guarantee solvency and prevent double-spending without a real-time central server?**

* **Cryptographic Vouchers (Bonds)**: Users convert online funds into cryptographically signed bearer tokens (Bonds) before going offline.
* **Off-Grid P2P Transfer**: Transactions between two offline devices are executed via a two-way dynamic QR handshake signed with Ed25519 private keys.
* **Delayed Reconciliation**: When either counterparty regains network access, the signed offline transaction chain is submitted to the central ledger for final settlement.

---

## 2. Dual-Balance Management System

The app introduces a distinct separation between central bank-backed funds and offline-spendable assets:

| Balance Type | Storage Location | Accessibility | Description |
| :--- | :--- | :--- | :--- |
| **Online Vault** | Central Banking Server | Online Only | Liquid bank account balance. Used for standard online transfers, card deposits, and loading offline bonds. |
| **Offline Pocket** | Encrypted Local Vault | 100% Offline | Discrete, cryptographically signed bond tokens (e.g. NPR 100, 200, 500, 1000) stored securely on the device. |
| **Total Balance** | Calculated (`Online + Offline`) | Always Visible | Combined net worth across both vault and local offline pockets. |

### Balance Lifecycle:
1. **Load Bond (Online → Offline)**: User locks NPR from their Online Vault to generate signed offline bonds saved in the local database.
2. **Offline Spend (P2P)**: Offline bonds are transferred to a recipient through signed QR exchanges.
3. **Reverse Bond (Offline → Online)**: Unspent offline bonds can be deposited back into the Online Vault when connected to the internet.

---

## 3. Cryptographic Security & Handshake Model

OffPay implements military-grade public-key cryptography to prevent tampering, forging, and double-spending:

* **Ed25519 Keypairs**: High-speed, tamper-proof Edwards-curve Digital Signature Algorithm for transaction signing and verification.
* **SHA-256 Hashing**: Generates unique cryptographic digests for each transaction payload (`amount + senderId + receiverId + nonce + bondIds + timestamp`).
* **Cryptographic Nonces**: Unique one-time tokens generated per transaction to strictly eliminate replay attacks.
* **Hardware SecureStore**: Private keys are stored in encrypted hardware-backed storage (iOS Keychain / Android Keystore).
* **Double-Spending Prevention**: Local SQLite ledger invalidates transferred bond IDs instantly upon signing, preventing reuse in subsequent offline transfers.

---

## 4. Authentication & Identity Management

* **User Registration & Key Generation**:
  - Full Name, Phone Number, Email, and Password registration.
  - Generates the user's Ed25519 Public/Private keypair upon registration.
  - Automatically exports the public key to the central registry.
* **JWT Session Persistence**:
  - Secure token storage for authenticated API requests when online.
* **Quick Dev Mode**:
  - Pre-seeded developer mock profile (`Aarav Sharma`, `+977-9841234567`) for rapid testing and review.

---

## 5. Main Dashboard & Balance Card

* **Dynamic Header**:
  - OffPay branding.
  - Live **Network Status Badge** (`🟢 Online`, `🔴 Offline`, `🟡 Wi-Fi Only`).
* **Interactive Balance Card**:
  - Real-time Total Balance display in Nepali Rupees (`NPR`).
  - Breakdown meters for Online Balance vs. Offline Bond Pocket.
* **Quick Action Buttons**:
  - Prominent **Send (↗)** and **Receive (↙)** primary actions.
* **Action Grid**:
  - `⊕ Top Up`: Add funds from external bank/card to the online vault.
  - `⬡ Load Bond`: Convert online funds into offline vouchers.
  - `⟳ Sync`: Manually trigger ledger reconciliation with the server.
  - `↩ Reverse`: Convert offline bonds back into liquid online balance.
* **Recent Activity Feed**:
  - Quick-glance list of recent transactions with real-time sync indicators.

---

## 6. Send Payment System (Online & Offline)

The send screen automatically adapts its user interface and underlying logic based on current connectivity:

### A. Online Mode (Direct Transfer)
* Input receiver ID / phone number and amount.
* Directly debits the Online Vault with instant server confirmation.

### B. Offline Mode (Bond Voucher Generation)
* **Scan Request QR**: Directly reads the receiver's requested amount and public ID.
* **Smart Bond Allocation**: Automatically selects the optimal combination of available offline bonds (e.g., NPR 500 = `BOND-001 [200] + BOND-002 [200] + BOND-003 [100]`).
* **Voucher Signing**: Computes the SHA-256 hash and signs the payload with the sender's Ed25519 private key.
* **Payment QR Generation**: Displays the signed payload as a dynamic QR code for the receiver to scan.

---

## 7. Receive Payment & Dynamic QR Generation

* **Payment Request Creator**:
  - Receiver enters the exact amount to receive (e.g., `NPR 500`).
* **Payload Generation**:
  - Packages `receiverId`, `amount`, `currency`, and `nonce` into a standard JSON payload.
* **Dynamic QR Code**:
  - Renders the payment request for the sender to scan.
* **Verification Trigger**:
  - In offline mode, includes a direct **"Verify Payment — Scan Sender's QR"** action to complete the two-way handshake.

---

## 8. Camera QR Scanner Engine

* High-speed QR code camera scanner.
* **Visual Viewfinder**: Real-time bounding box and targeting reticle.
* **Instant Decoupling**:
  - Automatically parses `BONDPAY_REQUEST` (incoming bill) vs. `BONDPAY_VOUCHER` (signed incoming payment).
  - Routes directly to payment confirmation upon successful scan.

---

## 9. Payment Verification & Confirmation

* **Visual Transaction States**:
  - `⏳ Processing...`: Verifying cryptographic signatures.
  - `✓ Payment Successful!`: Verified and committed to local ledger.
  - `✗ Payment Failed`: Signature invalid or bond already spent.
* **Transaction Breakdown Receipt**:
  - Exact Amount (`NPR`).
  - Counterparty Name & ID.
  - Transaction Type (`Online Direct` vs. `Offline Bond`).
  - Reconciliation Status (`Pending Sync` vs. `Synced`).
  - Unique Transaction ID (`tx-XXXXX`).
  - Utilized Bond IDs (`BOND-001`, `BOND-003`).
* **Cryptographic Verification Badge**:
  - Explicit confirmation: `✓ Ed25519 signature verified`.

---

## 10. Transaction History & Ledger Management

* Filterable chronological list of all transactions:
  - **Sent Transactions** (Debit 🔴).
  - **Received Transactions** (Credit 🟢).
  - **Top-Ups & Bank Deposits**.
  - **Bond Load / Reverse Operations**.
* **Sync Status Indicators**:
  - `synced`: Confirmed on both local device and central banking server.
  - `pending`: Stored in local offline SQLite database; awaiting internet connection to synchronize.
  - `completed`: Successfully finalized transaction.

---

## 11. Developer Audit Logs & Monitoring

* **Real-time Event Stream**:
  - Captures every cryptographic, storage, and networking event.
* **Color-Coded Severity Levels**:
  - `[INFO]`: Keypair loading, hash computations, valid signatures, SQLite writes.
  - `[WARN]`: Offline mode activated, synchronization deferred.
  - `[ERROR]`: Network unreachable, signature mismatches, double-spend attempts.
* **Log Management**:
  - Timestamped to the millisecond (`HH:MM:SS.mmm`).
  - Add manual test logs or clear log cache.

---

## 12. Network Simulation & Developer Settings

* **Network Switcher**:
  - Toggle between **Online**, **Offline**, and **Wi-Fi Only** states to test off-grid resilience without altering device system settings.
* **Auto-Sync Toggle**:
  - Configure automatic ledger synchronization upon detecting network connection.
* **Database Tools**:
  - **Clear Local Database**: Purge cached transactions and test fresh states.
* **Cryptographic Key Management**:
  - **Export Public Key**: Copy user public key for peer sharing.
  - **Regenerate Keypair**: Create a new Ed25519 keypair.
* **System Metadata**:
  - App Version (`1.0.0`), Framework (`Expo 57`), Cryptography Engine (`Ed25519 / SHA-256`).

---

## 13. Data Storage & Synchronization Strategy

```
┌────────────────────────────────────────────────────────┐
│                      OffPay Client                     │
├───────────────────┬───────────────────┬────────────────┤
│   Zustand Store   │   SQLite Ledger   │  SecureStore   │
│   (Live State)    │ (Offline Storage) │(Keypair Vault) │
│                   │                   │                │
│ • User Profile    │ • Transactions    │ • Private Key  │
│ • Cached Balances │ • Available Bonds │ • Public Key   │
│ • Network Status  │ • Received Vouchers│ • JWT Token   │
│ • Live Event Logs │ • Sync Queue      │                │
└─────────┬─────────┴─────────┬─────────┴────────────────┘
          │                   │
          ▼                   ▼ (When Online)
┌────────────────────────────────────────────────────────┐
│             Central Bank Settlement Server             │
│   • Ledger Reconciliation  • Double-Spend Verification │
└────────────────────────────────────────────────────────┘
```

---

## 14. Screen Directory & Navigation Routes

| Route | File Path | Purpose |
| :--- | :--- | :--- |
| `/(auth)/login` | [`src/app/(auth)/login.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/(auth)/login.tsx) | User login screen with dev shortcuts |
| `/(auth)/signup` | [`src/app/(auth)/signup.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/(auth)/signup.tsx) | User registration & key generation |
| `/(tabs)/` | [`src/app/(tabs)/index.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/(tabs)/index.tsx) | Main home dashboard & dual balances |
| `/(tabs)/history` | [`src/app/(tabs)/history.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/(tabs)/history.tsx) | Transaction history & ledger |
| `/(tabs)/account` | [`src/app/(tabs)/account.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/(tabs)/account.tsx) | User profile & developer tools |
| `/(tabs)/settings` | [`src/app/(tabs)/settings.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/(tabs)/settings.tsx) | App settings & network switcher |
| `/send` | [`src/app/send.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/send.tsx) | Send money (Online & Offline modes) |
| `/receive` | [`src/app/receive.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/receive.tsx) | Receive money & request QR creator |
| `/scan-qr` | [`src/app/scan-qr.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/scan-qr.tsx) | Camera QR code scanner |
| `/payment-confirmation` | [`src/app/payment-confirmation.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/payment-confirmation.tsx) | Transaction confirmation & signature receipt |
| `/logs` | [`src/app/logs.tsx`](file:///d:/BNKS_HimaliX/mobile/src/app/logs.tsx) | Developer audit log stream |
