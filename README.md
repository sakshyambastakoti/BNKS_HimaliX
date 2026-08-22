# OffPay (HimaliX) - Offline Off-Grid Payment System 💳⚡

**OffPay** is an offline, off-grid peer-to-peer digital payment mobile application that allows users to perform secure digital transactions without requiring an active internet connection. It utilizes cryptographically signed offline vouchers, dynamic QR handshakes, and a dual-balance architecture (Online Vault + Offline Pocket) with automatic ledger reconciliation once connectivity is restored.

---

## 📱 Features

- **Dual-Balance Architecture**: Split balances between your **Online Bank Vault** and **Offline Secured Pocket**.
- **Offline P2P Transactions**: Create and verify cryptographically signed transaction vouchers with zero network dependency.
- **Dynamic QR Code Exchange**: Seamlessly send and receive offline payment tokens via QR code generation and camera scanning.
- **Network Simulation & Resilience**: Built-in network state switcher (Online, Offline, Wi-Fi Only) to test off-grid resilience in real-time.
- **Developer Debug Logs**: Live cryptographic handshake and sync audit trail logs for transparency and debugging.
- **Transaction History**: Comprehensive ledger tracking both online bank settlements and pending offline peer vouchers.

---

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18.x or v20.x recommended): [Download Node.js](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- **Expo Go App** (Optional, for running on a physical Android or iOS device):
  - [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [Apple App Store (iOS)](https://apps.apple.com/app/expo-go/id982105205)

---

## 🚀 Quick Start Guide

### 1. Open the project in your terminal
```bash
cd mobile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the Expo development server
```bash
npx expo start
```
*(or `npm start`)*

---

## 🖥️ How to Run on Different Devices

Once the development server is running, you will see an interactive menu and a QR code in your terminal.

### 📱 Option A: On a Physical Mobile Device (Recommended)
1. Ensure your computer and phone are connected to the **same Wi-Fi network**.
2. Open the **Expo Go** app on your phone:
   - **Android**: Tap **"Scan QR code"** and scan the QR code displayed in your terminal.
   - **iOS**: Open the default **Camera app**, point it at the QR code, and tap the notification link to open in Expo Go.

> 💡 **Tip for Network Issues**: If your phone cannot reach your computer over local Wi-Fi, run the server in tunnel mode:
> ```bash
> npx expo start --tunnel
> ```

---

### 🌐 Option B: In a Web Browser
Press **`w`** in the running terminal, or run:
```bash
npm run web
```
This will bundle the app for web and open it at `http://localhost:8081`.

---

### 🤖 Option C: On an Android Emulator
1. Start an Android Virtual Device (AVD) from Android Studio.
2. Press **`a`** in the terminal, or run:
```bash
npm run android
```

---

### 🍏 Option D: On an iOS Simulator (macOS only)
Press **`i`** in the terminal, or run:
```bash
npm run ios
```

---

## 📖 User Guide: How to Use the App

### 1. 🔑 Login & Authentication
- Launch the app. You can tap **Sign In** directly (pre-filled with dev credentials) or create a new account via the **Sign Up** link.

### 2. 🏠 Dashboard & Dual Balances
- **Online Balance**: Funds stored in your central banking vault.
- **Offline Balance**: Allocated secure funds available for offline peer-to-peer spending.
- **Network Badge**: Shows current connection status (`Online`, `Offline`, or `Wi-Fi Only`).

### 3. 💸 Sending Offline Payments
1. Tap **Send** on the home screen.
2. Enter the recipient's User ID or phone number and the amount.
3. Choose the payment source (**Offline Balance** or **Online Balance**).
4. Review the details and tap **Confirm & Generate Voucher**.
5. A signed payment voucher / QR code is generated for the recipient to scan.

### 4. 📥 Receiving Payments
1. Tap **Receive** on the home screen.
2. Enter the requested amount.
3. Show the dynamic receive QR code to the sender.

### 5. 📷 Scanning Payment QR Codes
1. Tap **Scan QR** from the dashboard or quick action bar.
2. Align the camera with the sender's or receiver's QR voucher.
3. The app validates the cryptographic signature and directs you to the **Payment Confirmation** screen.

### 6. 📜 Transaction History
- Navigate to the **History** tab to see all completed and queued transactions, along with their sync statuses (Synced vs. Pending Mesh Sync).

### 7. ⚙️ Settings & Simulation Tools
- Navigate to the **Settings** tab to:
  - Toggle network state (`Online` / `Offline` / `Wi-Fi Only`) to test offline behavior.
  - Adjust security settings and key backups.
  - Clear local offline vouchers or trigger manual reconciliation.

### 8. 🔍 Developer Debug Logs
- Navigate to **Logs** (or tap the debug icon in the top header) to view real-time cryptographic handshakes, signature verifications, and background sync events.

---

## 📂 Project Architecture

```
BNKS_HimaliX/
├── mobile/
│   ├── assets/              # App icons, splash screens, images
│   ├── src/
│   │   ├── app/             # Expo Router file-based pages
│   │   │   ├── (auth)/      # Login & Signup screens
│   │   │   ├── (tabs)/      # Home, History, Account, Settings tabs
│   │   │   ├── logs.tsx     # Developer audit logs
│   │   │   ├── payment-confirmation.tsx
│   │   │   ├── receive.tsx  # Receive payment & QR display
│   │   │   ├── scan-qr.tsx  # Camera QR scanner
│   │   │   └── send.tsx     # Send payment & voucher generation
│   │   ├── components/      # UI components (ThemedView, BalanceCard, etc.)
│   │   ├── constants/       # Mock data, theme tokens, typography
│   │   ├── hooks/           # Theme and color scheme hooks
│   │   └── store/           # Zustand state management (App & Log stores)
│   ├── app.json             # Expo configuration
│   └── package.json         # Node dependencies and scripts
└── README.md                # Project documentation
```

---

## 🛠️ Common Troubleshooting

- **Clear Metro bundler cache**:
  ```bash
  npx expo start -c
  ```
- **Port already in use**:
  ```bash
  npx expo start --port 8082
  ```
- **Module not found / Dependency errors**:
  ```bash
  cd mobile
  npm install
  npx expo start -c
  ```
