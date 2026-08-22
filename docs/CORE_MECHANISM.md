# 🧠 OffPay — Core Mechanism & Technical Architecture Documentation

> **Offline-First Cryptographic RFID Payment Terminal & Distributed Cloud Ledger**

---

## 📖 Table of Contents
1. [Core Mechanism in Simple Terms (The 1-Minute Pitch)](#1-core-mechanism-in-simple-terms)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Hardware Subsystem (The Edge Device)](#3-hardware-subsystem)
4. [Terminal Software Subsystem (The Web POS & Engine)](#4-terminal-software-subsystem)
5. [Communication Protocols (MQTT, Direct LAN & WebSockets)](#5-communication-protocols)
6. [Offline Transaction Life Cycle (Step-by-Step)](#6-offline-transaction-life-cycle)
7. [Cryptographic Security & Anti-Fraud Mechanism](#7-cryptographic-security--anti-fraud-mechanism)
8. [Supabase Cloud Database Replication Pipeline](#8-supabase-cloud-database-replication-pipeline)
9. [Summary Comparison: Offline vs Online Mode](#9-summary-comparison)

---

## 1. Core Mechanism in Simple Terms

Think of OffPay as an **"Offline Smart Cash Vault & Digital Terminal"**:

```
 ┌────────────────┐          RFID Tap          ┌───────────────────────────┐
 │   Customer     │ ─────────────────────────> │   ESP32 Hardware Terminal │
 │ RFID Smart Card│                            │  (RC522 + OLED + LittleFS)│
 └────────────────┘                            └─────────────┬─────────────┘
                                                             │
                                        MQTT Cloud / LAN HTTP│ (Real-Time Mesh)
                                                             ▼
                                               ┌───────────────────────────┐
                                               │   OffPay Web POS Terminal │
                                               │   (Live 3D UI & Ledger)   │
                                               └─────────────┬─────────────┘
                                                             │
                                            HTTPS / JS SDK   │ (Async Replication)
                                                             ▼
                                               ┌───────────────────────────┐
                                               │   Supabase Cloud DB       │
                                               │   (Central PostgreSQL)    │
                                               └───────────────────────────┘
```

1. **The Smart Card (Customer's Wallet)**:
   - Each customer carries an RFID/NFC card (or tag/token) with a unique cryptographic hardware identifier (`UID`).
   - The card's balance is securely tracked in local offline vaults.

2. **The Hardware Terminal (The Offline Edge Cashier)**:
   - Powered by an **ESP32 microcontroller** with an **RC522 RFID radio scanner**, **SSD1306 OLED display**, **piezo buzzer**, and onboard flash storage (**LittleFS**).
   - **Works 100% offline without internet, cellular data, or server dependency**.
   - When a cashier enters an amount (e.g. NPR 150) and the customer taps their card:
     - The reader scans the RFID chip in **under 15 milliseconds**.
     - Checks the card's vault balance stored in the ESP32's internal memory.
     - If balance $\ge$ amount: Deducts the amount, buzzes a pleasant chime, updates the OLED screen to *"PAYMENT APPROVED"*, and records an immutable cryptographic receipt into local flash storage.
     - If balance $<$ amount: Rejects payment instantly with *"INSUFFICIENT BALANCE"*, plays an error buzz, and logs a declined transaction without deducting any funds.

3. **The Web POS Terminal (The Management UI)**:
   - A single-file web dashboard running on any phone, tablet, laptop, or served directly from the ESP32's flash memory.
   - Mirrors all hardware taps, shows live 3D card physics, displays real-time radar payment progress, prints thermal receipts, and manages cardholder accounts.

4. **The Supabase Cloud Database (Central Cloud Backup)**:
   - When internet is available, transactions and card balances are automatically replicated to **Supabase (PostgreSQL Cloud)** so multi-station audit ledgers stay synchronized globally.

---

## 2. High-Level System Architecture

```mermaid
flowchart TD
    subgraph EdgeHardware ["ESP32 Edge Hardware (Offline Ready)"]
        RFID["RC522 RFID Radio Scanner (13.56 MHz)"] -->|SPI Bus| ESP32["ESP32 Core Microcontroller (240MHz Dual-Core)"]
        ESP32 -->|I2C Bus| OLED["0.96 inch SSD1306 OLED Screen"]
        ESP32 -->|PWM GPIO| BUZZ["Piezo Acoustic Buzzer"]
        ESP32 -->|VFS SPIFFS| FS["LittleFS Non-Volatile Flash Ledger"]
    end

    subgraph TransportLayer ["Hybrid Mesh Communication Layer"]
        ESP32 <-->|MQTT over WebSockets (WSS)| Broker["EMQX Cloud Broker (Port 8084)"]
        ESP32 <-->|Local Wi-Fi HTTP REST| WebLAN["Direct Subnet LAN (192.168.x.x)"]
    end

    subgraph ClientUI ["OffPay Web POS Terminal"]
        Broker <--> WebPOS["Web Terminal POS Interface (HTML5 / Vanilla CSS / JS)"]
        WebLAN <--> WebPOS
        WebPOS --> Audio["Web Audio API Synthesizer (Chimes & Tones)"]
        WebPOS --> Tilt["3D Card Gyro Physics & Real-Time Radar"]
    end

    subgraph CloudDatabase ["Central Cloud Ledger"]
        WebPOS -->|HTTPS / REST API| Supabase["Supabase Cloud Database (PostgreSQL)"]
        Supabase --> T_TXN["Table: transactions (Audit Logs)"]
        Supabase --> T_CARDS["Table: cards (Cardholder Vaults)"]
        Supabase --> T_STATIONS["Table: stations (Terminal Diagnostics)"]
    end
```

---

## 3. Hardware Subsystem (The Edge Device)

### Component Specifications:
| Component | Function | Interface / Protocol | Purpose |
| :--- | :--- | :--- | :--- |
| **ESP32 NodeMCU** | Core Processor | 240 MHz Dual Core, 520 KB SRAM | Executes offline business logic, stores ledger, manages Wi-Fi & MQTT |
| **MFRC522 / PN532** | RFID/NFC Transceiver | SPI Bus (MOSI, MISO, SCK, CS) | Reads ISO 14443A smart cards & tags at 13.56 MHz |
| **SSD1306 OLED** | Visual Display | I2C Bus (SDA, SCL) | Shows real-time prompts, amount, approval status, and card balances |
| **Piezo Buzzer** | Acoustic Feedback | GPIO PWM | Emits dual-tone approval melody or error decline alarm |
| **LittleFS Flash** | Local Storage | Virtual File System | Stores `/cards.json` and `/transactions.json` permanently across reboots |

### Hardware State Machine:
```
  [BOOT & INIT] 
        │ (Mount LittleFS, Init Wi-Fi & MQTT)
        ▼
   [STATE_IDLE] <─────────────────────────────┐
        │                                     │
        │ Received 'start_payment' (Amount)   │ Payment Cancel / Timeout
        ▼                                     │
 [STATE_WAIT_TAP] ────────────────────────────┘
        │
        │ Card Tapped on RC522 Reader
        ▼
 [STATE_READ_CARD] (Extract UID: e.g. "A3 F8 12 B9")
        │
        ▼
 [STATE_VALIDATE]
   ├── If Card Not Found ───────────> Beep Error -> Return to IDLE
   ├── If Balance < Amount ─────────> Beep Decline -> Log Declined Txn -> Return to IDLE
   └── If Balance >= Amount ────────> Proceed to SETTLE
        │
        ▼
  [STATE_SETTLE]
   ├── Deduct: new_balance = balance - amount
   ├── Append Txn: { id, timestamp, uid, amount, prevBal, remBal, status: "Success" }
   ├── Save to LittleFS flash (`/cards.json`, `/transactions.json`)
   ├── Trigger Visual OLED: "APPROVED - REM: NPR X.XX"
   ├── Trigger Audio Buzzer: Success Chord (800Hz -> 1200Hz)
   └── Dispatch MQTT/LAN Event to Web Terminal POS
        │
        ▼
   [STATE_IDLE]
```

---

## 4. Terminal Software Subsystem (The Web POS & Engine)

The OffPay Terminal software is built as an **ultra-responsive, zero-dependency, single-file web application**:

1. **Clean Swiss Monochrome Design**:
   - High-contrast pure white (`#ffffff`) or obsidian dark (`#09090b`) backgrounds.
   - Strict 0px sharp geometric hairlines with emerald green (`#10b981`) status accents.
   - Clean typographic hierarchy powered by Google Fonts (*Plus Jakarta Sans*, *JetBrains Mono*, *Share Tech Mono*).

2. **3D Interactive Holographic Smart Card**:
   - Utilizes CSS 3D perspective transformations (`perspective(1000px) rotateX(...) rotateY(...)`) dynamically updated on cursor mouse movement.
   - Dynamic holographic light sweep reflection layer that mimics genuine bank cards.
   - Authentic gold EMV microchip with etched circuits and radiating NFC radar pulse waves.

3. **Real-Time Payment Radar & Web Simulator**:
   - Pulsating radar waves indicating terminal active listening state.
   - Real-time 4-step cryptographic pipeline tracker.
   - Built-in **Web Tap Simulator** allowing instant testing in any web browser without physical hardware.

4. **Thermal POS Receipt Generator**:
   - Generates authentic digital tax invoices with store header, station name, transaction IDs, masked UIDs (`A3 F8 ** **`), balances, cryptographic auth hashes, SVG barcodes, and printable layouts.

5. **Web Audio API Sound Engine**:
   - Real-time synthesized acoustic tones (keypad click, NFC scan pulse, approval chords, error buzzers) without external `.mp3` dependencies.

---

## 5. Communication Protocols

OffPay operates over a **dual-redundant transport layer**:

### A. Cloud MQTT WebSockets (Multi-Device Anywhere Sync)
- **Protocol**: MQTT over Secure WebSockets (`wss://broker.emqx.io:8084/mqtt` or private broker).
- **Channels**: Each station uses an isolated channel topic (e.g. `offpay/op-station-01/#`).
- **Topic Hierarchy**:
  - `offpay/{channel}/commands` — Cashier payment start, card registration, cancel commands.
  - `offpay/{channel}/events` — Real-time transaction success/decline broadcast.
  - `offpay/{channel}/cards` — Card ledger state synchronization (Retained message).
  - `offpay/{channel}/presence` — Multi-device peer heartbeat and online roster.

### B. Direct Local Wi-Fi LAN HTTP REST (100% Offline Mode)
When the station is in an area with zero internet access, the ESP32 acts as a local HTTP web server:
- `GET /api/status` — Hardware telemetry, uptime, free RAM, operating mode.
- `POST /api/payment/start?amount=X` — Arm terminal for RFID tap.
- `GET /api/cards` — Retrieve cardholder vaults from LittleFS.
- `GET /api/transactions` — Retrieve offline transaction audit log.
- `POST /api/cards/add` — Enroll a new RFID smart card.

---

## 6. Offline Transaction Life Cycle

```
[1. CASHIER INPUT] ──> Cashier enters NPR 150.00 on Web POS or Keypad
                            │
[2. TERMINAL ARMED] ──> Web UI triggers Radar Pulse & displays NPR 150.00
                            │ ESP32 OLED displays: "TAP RFID CARD / NPR 150.00"
                            │
[3. CARD TAP] ────────> Customer holds RFID card to RC522 Reader (13.56 MHz)
                            │ Reader extracts UID: "A3 F8 12 B9" in < 15ms
                            │
[4. LOCAL VERIFY] ────> ESP32 / Web POS checks local ledger:
                            │ Found: "Sakshyam Bastakoti" | Vault: NPR 2,500.00
                            │ Verification: NPR 2,500.00 >= NPR 150.00  ──> [PASS]
                            │
[5. SETTLE & LOG] ────> Vault Balance Updated: NPR 2,500.00 - 150.00 = NPR 2,350.00
                            │ Transaction #103 appended to local ledger
                            │ Saved permanently to LittleFS / localStorage
                            │
[6. FEEDBACK] ────────> Hardware: OLED displays "APPROVED", Buzzer plays success chord
                            │ Web POS: Modal displays "Payment Approved", plays chime
                            │
[7. CLOUD SYNC] ──────> If Internet Present: Replicates to Supabase Cloud DB
                        If Offline: Stays buffered in local memory for 1-click batch upload
```

---

## 7. Cryptographic Security & Anti-Fraud Mechanism

1. **Hardware-Locked Card UID**:
   - Standard ISO 14443A anti-collision algorithms ensure only one card is read per scan window, preventing accidental double-charging.

2. **Strict Balance Deficit Rejection**:
   - Transactions where requested amount exceeds available vault balance are strictly rejected at the core firmware level. Funds are never deducted into negative balances.

3. **Cryptographic SHA-256 Auth Hashes**:
   - Each transaction generates a unique transaction signature:
     $$\text{AuthHash} = \text{SHA256}(\text{TxnID} \parallel \text{UID} \parallel \text{Amount} \parallel \text{PrevBal} \parallel \text{RemBal} \parallel \text{Timestamp})$$
   - Printed on thermal receipts to guarantee receipt authenticity and prevent counterfeit invoice fraud.

4. **Atomic Write Integrity**:
   - Database writes to LittleFS flash memory and browser `localStorage` are executed atomically with rollback safety to prevent ledger corruption during abrupt power loss.

---

## 8. Supabase Cloud Database Replication Pipeline

OffPay integrates directly with **Supabase (PostgreSQL Cloud)** for central persistence and multi-branch management:

```sql
-- Transactions Table Schema (Audit Ledger)
CREATE TABLE public.transactions (
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cards Table Schema (Cardholder Vaults)
CREATE TABLE public.cards (
    uid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Auto-Replication Hooks:
- Every approved or declined payment automatically triggers `syncTxnToSupabase(newTxn)` and `syncCardToSupabase(matchingCard)`.
- **"Push Local Ledger to Cloud"**: Batch uploads all locally buffered offline records using PostgreSQL `UPSERT` on conflict keys (`transaction_id` and `uid`), ensuring **0 duplicate rows** and **0 data loss**.
- **"Pull Remote Data from Cloud"**: Reconciles and pulls down remote transaction logs and card registrations created across other stations.

---

## 9. Summary Comparison: Offline vs Online Mode

| Feature | Offline Mode (Local Edge) | Online Mode (Cloud Synced) |
| :--- | :--- | :--- |
| **Card Tap & Payment** | Works 100% locally in $<$ 50ms | Works locally in $<$ 50ms |
| **Balance Deduction** | Settled in ESP32 Flash / LocalStore | Settled locally + Replicated to Supabase |
| **Internet Dependency** | 0% (No Wi-Fi / No Cellular Needed) | Only for multi-station cloud sync |
| **Data Persistence** | LittleFS Flash Memory & LocalStorage | Supabase PostgreSQL Cloud Database |
| **Receipt Generation** | Monospace POS Thermal Receipt + Barcode | Printable Receipt + Cloud Audit Verify |
| **Multi-Device Pairing** | Direct ESP32 Wi-Fi Subnet Access Point | Global MQTT WebSocket Cloud Mesh |

---

> **OffPay Architecture**: Maximum Resilience at the Edge $\times$ Complete Transparency in the Cloud.
