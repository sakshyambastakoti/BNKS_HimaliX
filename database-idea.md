This file contains the database architecture and cryptographic specifications for OffPay.

### System Architecture Overview
- **Backend API**: Node.js (TypeScript with Fastify / Express) running on VPS
- **Server Database**: MySQL (InnoDB Engine) with strict ACID transactions and row-level locking
- **Client App**: React Native (Expo) with local SQLite database and Hardware Keystore (`expo-secure-store`)

All table and field names below are standard definitions for development.

===================================================================================

## 1. Online MySQL Database Schema (Server)

### table name: `users`
- `id`: unique auto-increment id (BIGINT PRIMARY KEY)
- `uuid`: standard UUID string (UNIQUE, INDEXED)
- `name`: string (VARCHAR 100)
- `email`: string (VARCHAR 191 UNIQUE)
- `phone_number`: string (VARCHAR 20 UNIQUE)
- `password_hash`: bcrypt/argon2 hash of the user's password
- `public_key`: base64 / hex string of user's Ed25519 public key.
  > **Note**: The server *never* stores or receives the user's private key. The private key stays isolated inside the user's physical device hardware keystore.
- `logged_in_at_device_id`: string (device unique identifier)
- `last_sync_at`: timestamp (NULLable)
- `online_balance`: BIGINT (stored in smallest currency unit, **paisa**, avoiding float rounding errors)

---

### table name: `bonds`
- `id`: unique bond identifier string (UUID / CUID, PRIMARY KEY)
- `issuer_uuid`: UUID of the user who requested/issued the bond
- `owner_uuid`: UUID of current owner (updated upon accepted sync)
- `issued_at`: timestamp
- `expiry_date`: timestamp (authoritative server-determined expiry)
- `amount`: BIGINT (in paisa)
- `security_token`: Ed25519 signature string produced by the server's private key signing the core bond parameters (`id`, `issuer_uuid`, `amount`, `issued_at`, `expiry_date`)
- `sequence`: INT (starts at 0 when issued, increments by +1 on each verified transfer)
- `status`: ENUM (`active`, `spent`, `expired_pending_claim`, `expired_paid_out`, `disputed`)

---

### table name: `bond_transfer_log`
Every offline transfer claim submitted during sync is appended here immutably.
- `id`: unique log id (BIGINT AUTO_INCREMENT PRIMARY KEY)
- `bond_id`: string (foreign key reference to `bonds.id`)
- `from_uuid`: UUID of claiming sender
- `to_uuid`: UUID of claiming receiver
- `sequence`: INT (the sequence number this transfer claims to advance from)
- `transaction_id`: string (device-generated UUID)
- `submitted_by_uuid`: UUID of user whose device sent the sync
- `submitted_at`: timestamp
- `accepted`: BOOLEAN (Only the first valid claim for a given `bond_id` + `sequence` is set to `true`. Duplicate/conflicting claims are recorded as `false` with their cryptographic signatures intact as dispute proof).

---

### table name: `transactions`
- `id`: unique transaction UUID (PRIMARY KEY)
- `nonce`: string (cryptographic random hex nonce generated per transaction to block replay attacks)
- `sender_uuid`: UUID
- `receiver_uuid`: UUID
- `happened_at`: timestamp (reported device timestamp for UI display)
- `involved_bond_ids`: JSON array of bond IDs transferred
- `synced_at`: timestamp (server clock when sync completed)
- `synced_by_uuid`: UUID of the user who initiated the sync
- `sync_success`: BOOLEAN
- `fail_reason`: TEXT (NULLable)

---

### `system_creds` (Environment Configuration)
- `SERVER_PUBLIC_KEY`: Ed25519 public key (shared with client apps / baked into client config)
- `SERVER_PRIVATE_KEY`: Ed25519 private key (stored exclusively in `.env` or system environment on the Node.js server, never stored in a database table).

===================================================================================

## 2. Offline Local Database Schema (Client SQLite & Hardware Keystore)

### Key Storage Separation:
- **Private Key**: The user's Ed25519 private key is **NEVER** stored in SQLite. It is generated on-device and stored inside the **Android Keystore / iOS Keychain via `expo-secure-store`**.
- **SQLite Database**: Encrypted local database (or application-sandboxed SQLite) for relational data and metadata.

---

### table name: `main` (User Profile & Balances)
- `uuid`: user's UUID
- `name`: string
- `email`: string
- `phone`: string
- `online_balance`: BIGINT (cached copy of last known server balance in paisa)
- `last_server_sync`: timestamp
- `net_offline_spendable_balance`: BIGINT
- `net_offline_unspendable_balance`: BIGINT
- `public_key`: user's Ed25519 public key string
- `server_public_key`: read-only trusted server public key string (verified against hardcoded pin)

---

### table name: `bonds`
- `id`: unique bond identifier (matches server `bonds.id`)
- `sequence`: INT (current sequence number known locally)
- `type`: ENUM (`spendable`, `sent_pending_sync`, `received_pending_sync`)
- `amount`: BIGINT (paisa)
- `server_security_token`: string (server-signed token)
- `sender_signed_packet`: TEXT (Ed25519 signature & transfer metadata)
- `local_expiry_hint`: timestamp (for UI countdown warnings)

---

### table name: `transactions`
- `id`: unique transaction UUID
- `nonce`: string (unique per txn; duplicate nonces rejected on arrival)
- `sender_uuid`: UUID
- `receiver_uuid`: UUID
- `done_at`: timestamp
- `associated_bonds`: JSON string of bond IDs
- `last_synced_at`: timestamp (NULLable)
- `synced_by_uuid`: UUID
- `sync_success`: BOOLEAN
- `failure_reason`: TEXT (NULLable)

---

### table name: `usermap` (Known Contacts)
- `id`: integer PRIMARY KEY AUTOINCREMENT
- `uuid`: UUID of contact
- `name`: string
- `phone`: string
- `public_key`: Ed25519 public key of contact

===================================================================================

## 3. Core Security & Cryptographic Specifications

### A. Hardware-Backed Private Key Storage
- Upon app setup, an Ed25519 key pair is generated natively on the mobile device.
- The **Private Key** is saved directly into hardware-backed secure storage via `expo-secure-store` (`Keychain` on iOS, `KeyStore` on Android).
- Only the **Public Key** is stored in the local SQLite `main` table and uploaded to the server during user registration.

### B. Canonical JSON Serialization before Signing (RFC 8785)
- Standard `JSON.stringify()` does not guarantee deterministic key ordering across different platforms (e.g. `{"amount":100,"id":"abc"}` vs `{"id":"abc","amount":100}`), which would cause valid cryptographic signatures to fail verification.
- Both the Node.js backend and the React Native app use **Canonical JSON (`canonicalize` / `fast-json-stable-stringify`)** to guarantee consistent UTF-8 byte serialization prior to hashing and Ed25519 signing.

### C. Database Concurrency Locking (`SELECT ... FOR UPDATE`)
- When a sync request is received, the Node.js server executes the verification inside an atomic MySQL transaction with row-level locks:
  ```sql
  START TRANSACTION;

  -- 1. Lock the bond row to prevent simultaneous race conditions
  SELECT id, owner_uuid, sequence, status FROM bonds WHERE id = ? FOR UPDATE;

  -- 2. Validate sequence continuity (incoming seq == current seq + 1)
  -- 3. Check for nonce uniqueness in transactions table
  -- 4. Verify Ed25519 signatures (server token and sender signature)

  -- 5. Insert audit entry into bond_transfer_log
  INSERT INTO bond_transfer_log (bond_id, from_uuid, to_uuid, sequence, transaction_id, submitted_by_uuid, submitted_at, accepted)
  VALUES (?, ?, ?, ?, ?, ?, NOW(), TRUE);

  -- 6. Update bond state and credit receiver's online_balance
  UPDATE bonds SET owner_uuid = ?, sequence = ?, status = 'spent' WHERE id = ?;
  UPDATE users SET online_balance = online_balance + ? WHERE uuid = ?;

  COMMIT;
  ```
- If a duplicate sync or replay attempt arrives simultaneously, it is held by the row-lock until the first transaction commits, and will subsequently be rejected and logged as `accepted = FALSE`.

### D. Offline QR Data Transmission Protocol
- Transaction payloads containing Ed25519 signatures and bond payloads are serialized into compact Canonical JSON packets.
- For payloads exceeding single QR capacity, the sender app fragments the payload into sequenced chunks (or Fountain / BC-UR codes) displayed as an animated QR slideshow:
  - Header: `{ "txnId": "...", "chunk": i, "total": N, "data": "..." }`
- The receiving app scans the frames continuously, displays a progress counter (`i/N`), and reassembles the payload once all chunks are captured before performing signature validation.