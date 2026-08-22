# ⚡ OffPay (Semi-Offgrid Digital Cash)

OffPay is a peer-to-peer semi-offgrid payment system that enables transactions without internet access using **Ed25519 Cryptographic Bonds**, **Hardware-backed Keystores**, and **Animated QR Slideshows**.

---

## 🏗️ Project Architecture

```
bondpay-simple/
├── shared/            # Canonical JSON serializer, Ed25519 primitives & shared contracts
├── backend/           # Node.js API + MySQL InnoDB with row-locking (SELECT ... FOR UPDATE)
├── mobile/            # React Native Expo App (Hardware Keystore + SQLite + QR Slideshow)
├── idea-main.md       # Project core concept and workflow documentation
├── database-idea.md   # Complete database schema and security specifications
└── development-plan.md# 5-phase hackathon roadmap
```

---

## 🚀 Quick Start Guide

### 1. Prerequisite
- **Node.js**: v18+ (verified on v22.14.0)
- **MySQL**: (e.g. XAMPP MySQL running on `localhost:3306`)

---

### 2. Run Backend API
```bash
cd backend
npm install
npm run dev
```
- API Server runs at `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`

---

### 3. Run Mobile App (Expo)
```bash
cd mobile
npm install
npx expo start
```
- Scan QR code with the **Expo Go** app on your physical Android / iOS phone.
- Or press `a` for Android Emulator / `i` for iOS Simulator / `w` for Web preview.

---

## 🛡️ Security Features Implemented
1. **Hardware-Backed Private Key Storage**: The user's Ed25519 private key is generated on-device and stored in the Android Keystore / iOS Keychain via `expo-secure-store`.
2. **Canonical JSON Serialization (RFC 8785)**: Deterministic byte serialization before hashing and signing guarantees signature validity across devices.
3. **Database Concurrency Locking (`SELECT ... FOR UPDATE`)**: Synchronizations run in serialized MySQL transactions to completely prevent race conditions.
4. **Monotonic Sequence & Nonce Verification**: Every bond sequence increases by +1 on transfer; duplicate attempts are permanently flagged in `bond_transfer_log`.
