# 💳 OffPay (HimaliX) - Offline Off-Grid Payment System

[![Expo](https://img.shields.io/badge/Expo-57.0-blue.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Cryptography](https://img.shields.io/badge/Crypto-Ed25519%20%2F%20SHA--256-green.svg)]()

> **OffPay** is a decentralized, offline-first digital payment mobile application engineered to enable cryptographically secure peer-to-peer (P2P) monetary transactions with **zero internet or cellular connectivity**.

---

## 📚 Complete Project Documentation

- 📘 **[OFFPAY_COMPLETE_SYSTEM_DOCUMENTATION.md](file:///d:/BNKS_HimaliX/OFFPAY_COMPLETE_SYSTEM_DOCUMENTATION.md)** — Exhaustive system architecture, cryptographic specifications, SQLite & PostgreSQL schemas, threat modeling, and hackathon pitch deck.
- 📄 **[FEATURES.md](file:///d:/BNKS_HimaliX/FEATURES.md)** — Detailed screen-by-screen breakdown and feature list.

---

## 🌟 Core Highlights

- **Dual-Balance Architecture**: Seamlessly manage an **Online Bank Vault** alongside an **Offline Secured Pocket**.
- **Cryptographically Signed Digital Bonds**: Banknote-style bearer tokens (NPR 100, 200, 500, 1000) verified offline with **Ed25519** digital signatures.
- **Two-Way Dynamic QR Handshake**: Zero-network payment transmission and signature verification in under 2 seconds.
- **Single-Party Cloud Reconciliation**: Only one counterparty needs to regain connectivity to settle transactions and invalidate spent bonds.
- **Hardware-Backed Key Protection**: Private keys stored inside device `SecureStore` (Android Keystore / iOS Keychain).
- **Interactive Network Simulator**: Built-in environment toggle (`Online`, `Offline`, `Wi-Fi Only`) for live testing and demonstrations.

---

## 🚀 How to Run the App

> [!IMPORTANT]
> **Working Directory**: The mobile application is located in the `mobile` subfolder. Always `cd mobile` before running commands!

### 1. Open Terminal & Navigate to `mobile`
```bash
cd d:\BNKS_HimaliX\mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Expo Development Server
```bash
npx expo start
```

---

## 📱 How to View on Devices

Once the server is running, the terminal will show a QR code and an interactive menu:

| Platform | Instructions |
| :--- | :--- |
| **Physical Phone (Android/iOS)** | Scan the QR code using the **Expo Go** app (Android) or **Camera App** (iOS).<br>*(Make sure phone and computer are on the same Wi-Fi)* |
| **Web Browser** | Press **`w`** in the terminal (opens `http://localhost:8081`). |
| **Android Emulator** | Press **`a`** in the terminal (requires Android Studio). |
| **iOS Simulator** | Press **`i`** in the terminal (macOS only). |

---

## 🛠️ Common Commands & Troubleshooting

```bash
# Clear Metro cache if experiencing build issues
npx expo start -c

# Run in tunnel mode if phone cannot connect over local Wi-Fi
npx expo start --tunnel

# Run directly on web
npm run web
```

---

## 📂 Repository Structure

```
BNKS_HimaliX/
├── OFFPAY_COMPLETE_SYSTEM_DOCUMENTATION.md  # Master system blueprint & crypto specs
├── FEATURES.md                              # Complete feature & screen catalog
├── README.md                                # Main project README & quickstart
└── mobile/                                  # React Native Expo Mobile Application
    ├── assets/                              # App icons, splash screens, and images
    ├── src/
    │   ├── app/                             # Expo Router file-based screens
    │   │   ├── (auth)/                      # Login & Signup screens
    │   │   ├── (tabs)/                      # Home, History, Account, Settings tabs
    │   │   ├── send.tsx                     # Send money (Online & Offline modes)
    │   │   ├── receive.tsx                  # Receive payment & QR code generator
    │   │   ├── scan-qr.tsx                  # Camera QR scanner
    │   │   ├── payment-confirmation.tsx     # Cryptographic verification receipt
    │   │   └── logs.tsx                     # Real-time developer audit logs
    │   ├── components/                      # Reusable UI components
    │   ├── constants/                       # Theme tokens & mock development data
    │   ├── hooks/                           # Theme & network state hooks
    │   └── store/                           # Zustand reactive state stores
    ├── app.json                             # Expo application configuration
    └── package.json                         # Node dependencies and scripts
```
