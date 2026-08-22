# 🛠️ Developer Setup & Execution Guide

> **Navigation**: [Docs Portal](file:///d:/BNKS_HimaliX/docs/README.md) | [05. Screen Catalog](file:///d:/BNKS_HimaliX/docs/05-screen-catalog-and-features.md) | **Next**: [07. Pitch Deck & FAQ](file:///d:/BNKS_HimaliX/docs/07-pitch-deck-and-hackathon-qa.md)

---

## 1. Prerequisites

Before running the application, make sure your development environment includes:
* **Node.js** (v18.x or v20.x recommended): [Download Node.js](https://nodejs.org/)
* **npm** (bundled with Node.js)
* **Mobile Testing Device / Emulator**:
  - **Physical Phone**: Install **Expo Go** from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) or [App Store](https://apps.apple.com/app/expo-go/id982105205).
  - **Web Browser**: Chrome / Edge / Safari.
  - **Android Studio**: Android Virtual Device (AVD).

---

## 2. Quick Start Commands

> [!IMPORTANT]
> **Working Directory**: Always `cd` into the `mobile` folder before running package commands!

```powershell
# 1. Navigate to the mobile subfolder
cd d:\BNKS_HimaliX\mobile

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npx expo start
```

---

## 3. Platform Execution Options

| Target Platform | Command / Key | Instructions |
| :--- | :--- | :--- |
| **Physical Phone (Android/iOS)** | **Scan Terminal QR** | Open **Expo Go** (Android) or **Camera** (iOS) and point at the QR code in the terminal. Ensure computer and phone are on the same Wi-Fi. |
| **Web Browser** | Press **`w`** | Opens the app in your browser at `http://localhost:8081`. |
| **Android Emulator** | Press **`a`** | Starts the app on your active Android Virtual Device. |
| **iOS Simulator** | Press **`i`** | Launches macOS iOS Simulator (macOS only). |

---

## 4. Useful Development Commands

```powershell
# Start Expo with cleared Metro cache
npx expo start -c

# Start in tunnel mode (for corporate Wi-Fi or firewalls)
npx expo start --tunnel

# Run on a custom port
npx expo start --port 8082

# Run directly on web
npm run web
```

---

## 5. Troubleshooting Common Issues

### Issue 1: `ConfigError: The expected package.json path does not exist`
* **Cause**: You ran `npx expo start` in the root folder `d:\BNKS_HimaliX` instead of `d:\BNKS_HimaliX\mobile`.
* **Fix**: Run `cd mobile` first, then run `npx expo start`.

### Issue 2: Phone Cannot Connect to Development Server
* **Cause**: Wi-Fi isolation on local router or firewall blocking port 8081.
* **Fix**: Run `npx expo start --tunnel`.

### Issue 3: Stale Cache or Bundling Errors
* **Fix**: Run `npx expo start -c` to clear the bundler cache.
