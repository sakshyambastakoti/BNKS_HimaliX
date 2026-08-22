# 🚀 OffPay — Hackathon Development Plan & Roadmap

This document outlines the step-by-step execution roadmap for developing the **OffPay** prototype during the hackathon. The plan is organized chronologically into 5 practical phases, prioritizing a working end-to-end demo first, followed by edge-case polish.

---

## ⏱️ Timeline Overview (12-Hour Sprint)

```
┌─────────────────┬─────────────────┬──────────────────┬──────────────────┬─────────────────┐
│ Phase 1 (0-2h)  │ Phase 2 (2-4.5h)│ Phase 3 (4.5-7h) │ Phase 4 (7-10h)  │ Phase 5 (10-12h)│
│ Core & Crypto   │ Backend & MySQL │ React Native App │ Offline QR Flow  │ Testing & Demo  │
└─────────────────┴─────────────────┴──────────────────┴──────────────────┴─────────────────┘
```

---

## 📦 Phase 1: Cryptographic Primitives & Shared Contracts (Hours 0 – 2)

**Goal:** Establish deterministic cryptographic signing and shared data models so backend and frontend seamlessly communicate.

### Tasks:
1. **Shared Types & Interfaces (`shared/types.ts`)**:
   - `User`, `Bond`, `BondSecurityToken`, `TransactionPacket`, `SyncPayload`.
2. **Canonical JSON Serialization (`shared/canonical.ts`)**:
   - Integrate `canonicalize` / `fast-json-stable-stringify` to guarantee identical byte output regardless of object key order.
3. **Ed25519 Crypto Utilities (`shared/crypto.ts`)**:
   - Keypair generation (`generateKeyPair()`).
   - Signing (`signPayload(payload, privateKey)`).
   - Verification (`verifySignature(payload, signature, publicKey)`).
   - Server Security Token generator and validator.

---

## 🗄️ Phase 2: Backend API & MySQL Database (Hours 2 – 4.5)

**Goal:** Build a lightweight Node.js API that manages users, issues signed bonds, and handles atomic transaction syncing with MySQL row locking.

### Tasks:
1. **Database Initialization (`backend/src/db/schema.sql`)**:
   - Create tables in MySQL: `users`, `bonds`, `bond_transfer_log`, `transactions`.
2. **Environment & Server Setup (`backend/src/server.ts`)**:
   - Fastify / Express with TypeScript.
   - Load `SERVER_PRIVATE_KEY` and `SERVER_PUBLIC_KEY` from `.env`.
3. **Core API Endpoints**:
   - `POST /api/auth/register`: Accepts name, email, phone, password, and device-generated `publicKey`.
   - `POST /api/auth/login`: Authenticates user and returns JWT + user profile.
   - `POST /api/wallet/recharge`: Mock endpoint to top up `online_balance` (in paisa).
   - `POST /api/bonds/issue`:
     - Deducts requested amount from user's `online_balance`.
     - Breaks amount into optimal denominations (e.g. 500, 100, 50, 20, 10, 5).
     - Signs each token with `SERVER_PRIVATE_KEY`.
     - Inserts bonds into MySQL and returns signed bond array to client.
   - `POST /api/sync`:
     - Wraps sync logic in `START TRANSACTION; SELECT ... FOR UPDATE;`.
     - Verifies incoming `sequence == current_sequence + 1`, nonce uniqueness, and Alice's signature.
     - Logs attempt in `bond_transfer_log` (`accepted = true/false`).
     - Credits receiver's balance, marks bond spent, and commits transaction.

---

## 📱 Phase 3: Mobile App Shell & Local Storage (Hours 4.5 – 7)

**Goal:** Build the React Native (Expo) app shell with secure key storage, local SQLite tables, and online wallet operations.

### Tasks:
1. **Expo Project Setup**:
   - Initialize Expo with TypeScript (`expo-camera`, `expo-secure-store`, `expo-sqlite`).
2. **Hardware Key Management**:
   - On first app launch, check if an Ed25519 keypair exists in `expo-secure-store`.
   - If not, generate new keypair and persist private key in **Android Keystore / iOS Keychain**.
3. **Local SQLite Database Setup (`mobile/src/db/`)**:
   - Initialize local tables: `main`, `bonds`, `transactions`, `usermap`.
4. **Online Wallet Screens**:
   - **Auth Screen**: Login & Register (sends local public key to server).
   - **Dashboard Screen**:
     - Displays *Online Balance*, *Spendable Offline Bonds*, and *Pending Sync Balance*.
     - Quick "Top-up Balance" button.
     - "Issue Offline Bonds" modal (requests bonds from backend and stores in local SQLite).

---

## 🔄 Phase 4: Offline P2P Transfer & QR Slideshow (Hours 7 – 10)

**Goal:** Implement the complete offline payment cycle between Alice (Sender) and Bob (Receiver) without internet.

### Tasks:
1. **Step 1: Bob’s Payment Request QR (`mobile/src/screens/ReceiveScreen.tsx`)**:
   - Bob enters amount (e.g. Rs 250) and clicks *Request Money*.
   - App displays QR containing Bob's: `uuid`, `name`, `phone`, `publicKey`, `amountRequested`.
2. **Step 2: Alice’s Scanner & Token Matching (`mobile/src/screens/SendScreen.tsx`)**:
   - Alice scans Bob's Request QR.
   - App inspects local `bonds` table to check for exact token combination matching the requested amount.
   - Displays confirmation screen with Bob's details and selected bond notes.
3. **Step 3: Transfer Signing & QR Slideshow**:
   - Alice confirms: app increments sequence (`+1`), re-assigns bond owner to Bob's UUID, marks local bond as `sent_pending_sync`.
   - Signs transaction packet with Alice's hardware-stored private key.
   - Splits payload into numbered chunks: `{ id, chunkIndex, totalChunks, data }`.
   - Displays animated QR slideshow cycling at ~4-6 frames/sec.
4. **Step 4: Bob’s Multi-Frame QR Scanner**:
   - Bob switches to *Scan Receipt* mode.
   - Continuous scanner reads frames, tracks progress bar (`y / x chunks collected`), and reconstructs the full packet.
   - Validates Alice’s signature and server’s security token offline.
   - Saves bonds as `received_pending_sync` in Bob's SQLite database.

---

## 🧪 Phase 5: Online Sync, Double-Spend Demo & Polish (Hours 10 – 12)

**Goal:** Connect to the backend to reconcile offline bonds, prove double-spend resilience, and polish the demo presentation.

### Tasks:
1. **One-Tap Sync Execution**:
   - Tap "Sync with Server" on either Alice or Bob's phone.
   - Submits pending transactions to `POST /api/sync`.
   - Server processes and returns success: Bob's online balance is credited, Alice's local pending bonds are cleared.
2. **Double-Spend Hackathon Demo Proof**:
   - Prepare a live demonstration where Alice tries to send the same bond to a third party (Charlie).
   - Show how the server accepts Bob's sync first and flags Charlie's attempt in `bond_transfer_log` with `accepted = false`.
3. **UI / Presentation Polish**:
   - Clean color-coded bond denomination cards (Rs 500, 100, 50, etc.).
   - Visual badges for offline vs online status.
   - Clear feedback toasts on successful QR capture and signature verification.

---

## 🛠️ Step-by-Step Implementation Sequence Checklist

- [ ] **Step 1:** Create `shared/` folder with types, canonical JSON serializer, and Ed25519 crypto helpers.
- [ ] **Step 2:** Create MySQL migration script (`schema.sql`) and run it on MySQL / VPS.
- [ ] **Step 3:** Build Node.js backend (`/auth`, `/bonds/issue`, `/sync` with `FOR UPDATE` transaction locks).
- [ ] **Step 4:** Initialize Expo app with `expo-secure-store`, `expo-sqlite`, and `expo-camera`.
- [ ] **Step 5:** Build on-device key generation and local SQLite repositories.
- [ ] **Step 6:** Build Dashboard with Bond Issuance (online phase).
- [ ] **Step 7:** Build Bob's Receive QR and Alice's Scan & Denomination Picker.
- [ ] **Step 8:** Build Alice's Animated QR Slideshow generator.
- [ ] **Step 9:** Build Bob's Continuous Scanner & Chunk Assembler.
- [ ] **Step 10:** Build One-Tap Sync & Reconcile flow.
- [ ] **Step 11:** Test end-to-end with 2 phones / emulators.
