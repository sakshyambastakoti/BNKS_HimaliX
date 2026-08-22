# 💳 OffPay (HimaliX) - Offline Off-Grid Payment System

[![Expo](https://img.shields.io/badge/Expo-57.0-blue.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Cryptography](https://img.shields.io/badge/Crypto-Ed25519%20%2F%20SHA--256-green.svg)]()

> **OffPay** is an offline, off-grid peer-to-peer (P2P) digital payment mobile application engineered to enable cryptographically secure monetary transactions with **zero internet or cellular connectivity**.

---

## 🗺️ Documentation Portal

All documentation has been organized into dedicated modules in the [`docs/`](file:///d:/BNKS_HimaliX/docs/README.md) directory:

```
docs/
├── README.md                          # Master Documentation Portal Index
├── 01-architecture-and-vision.md      # Problem statement & Dual-Balance Token model
├── 02-cryptography-and-security.md    # Ed25519 signatures, SHA-256 digests & Threat matrix
├── 03-offline-qr-handshake.md         # Two-way dynamic QR protocol & JSON payloads
├── 04-database-and-sync-engine.md     # SQLite & PostgreSQL schemas & Single-party sync
├── 05-screen-catalog-and-features.md  # Screen-by-screen UX walkthrough & components
├── 06-developer-setup-and-run-guide.md# Quickstart commands & troubleshooting
└── 07-pitch-deck-and-hackathon-qa.md  # 3-minute pitch script, slide blueprint & Judge Q&A
```

| Section | Link | Summary |
| :--- | :--- | :--- |
| **1. Architecture & Concept** | [01-architecture-and-vision.md](file:///d:/BNKS_HimaliX/docs/01-architecture-and-vision.md) | The Digital Banknotes paradigm, Dual-Balance model, system flow. |
| **2. Cryptography & Security** | [02-cryptography-and-security.md](file:///d:/BNKS_HimaliX/docs/02-cryptography-and-security.md) | Ed25519 signing, SHA-256 hashing, Nonces, and Hardware SecureStore. |
| **3. Offline QR Handshake** | [03-offline-qr-handshake.md](file:///d:/BNKS_HimaliX/docs/03-offline-qr-handshake.md) | The 2-way dynamic QR handshake and payload formats. |
| **4. Database & Sync Engine** | [04-database-and-sync-engine.md](file:///d:/BNKS_HimaliX/docs/04-database-and-sync-engine.md) | SQLite & PostgreSQL schemas, single-party sync & fraud engine. |
| **5. Screen Catalog & Features** | [05-screen-catalog-and-features.md](file:///d:/BNKS_HimaliX/docs/05-screen-catalog-and-features.md) | Catalog of all app screens (Dashboard, Send, Receive, Logs, Settings). |
| **6. Developer & Run Guide** | [06-developer-setup-and-run-guide.md](file:///d:/BNKS_HimaliX/docs/06-developer-setup-and-run-guide.md) | Commands to run on Physical Device, Web Browser, or Emulator. |
| **7. Pitch Deck & Hackathon Q&A** | [07-pitch-deck-and-hackathon-qa.md](file:///d:/BNKS_HimaliX/docs/07-pitch-deck-and-hackathon-qa.md) | 3-minute pitch script, 5-slide deck, and answers to tough judge questions. |

---

## 🚀 Quick Start: How to Run the App

> [!IMPORTANT]
> **Working Directory**: The mobile app is located in the `mobile` subfolder. Always `cd mobile` before running commands!

```powershell
# 1. Enter the mobile directory
cd d:\BNKS_HimaliX\mobile

# 2. Install dependencies
npm install

# 3. Start Expo development server
npx expo start
```

### 📱 Testing Platforms

- **Physical Phone**: Scan the terminal QR code with **Expo Go** (Android) or **Camera** (iOS). *(Ensure phone & computer share the same Wi-Fi)*
- **Web Browser**: Press **`w`** in the terminal (opens `http://localhost:8081`).
- **Android Emulator**: Press **`a`** in the terminal.
- **iOS Simulator**: Press **`i`** in the terminal.

---

## 📂 Project Architecture

```
BNKS_HimaliX/
├── docs/                                    # Modular system documentation
├── mobile/                                  # React Native Expo Mobile App
│   ├── assets/                              # App icons, splash screens, images
│   ├── src/
│   │   ├── app/                             # Expo Router file-based screens
│   │   │   ├── (auth)/                      # Login & Signup screens
│   │   │   ├── (tabs)/                      # Home, History, Account, Settings tabs
│   │   │   ├── send.tsx                     # Send money (Online & Offline modes)
│   │   │   ├── receive.tsx                  # Receive payment & QR code generator
│   │   │   ├── scan-qr.tsx                  # Camera QR scanner
│   │   │   ├── payment-confirmation.tsx     # Cryptographic verification receipt
│   │   │   └── logs.tsx                     # Real-time developer audit logs
│   │   ├── components/                      # BalanceCard, ActionButton, Badges
│   │   ├── constants/                       # Theme tokens & mock development data
│   │   ├── hooks/                           # Theme & network state hooks
│   │   └── store/                           # Zustand reactive state stores
│   ├── app.json                             # Expo application configuration
│   └── package.json                         # Node dependencies and scripts
├── OFFPAY_COMPLETE_SYSTEM_DOCUMENTATION.md  # Complete single-file reference document
└── README.md                                # Master documentation portal
```
