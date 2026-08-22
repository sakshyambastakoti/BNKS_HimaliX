# BondPay (OffPay) — React Native App: Phase 1 Implementation

Build the React Native Expo mobile app foundation for **BondPay/OffPay**, an offline-first, token-based digital payment system for Nepal. This plan covers **Phases 1–3** from your [stating.md](file:///d:/BNKS_HimaliX/stating.md): project setup, navigation, and a polished UI for all core screens.

## User Review Required

> [!IMPORTANT]
> **App Name**: Your logo says "OffPay" but your documentation references "BondPay." I will use **OffPay** as the user-facing brand and **BondPay** as the internal/system name. Please confirm.

> [!IMPORTANT]
> **Color Scheme**: Based on your logo, I'll use a **green gradient** palette (#00C853 → #76FF03) on a dark background theme. Let me know if you'd prefer different colors.

> [!IMPORTANT]
> **Expo Router vs React Navigation**: Expo now recommends file-based routing with `expo-router`. I'll use **Expo Router** (file-based) as it's the modern standard. Let me know if you prefer classic React Navigation instead.

## Open Questions

> [!NOTE]
> **Auth Flow**: Should the login/signup screens be functional (with mock data) or just visual placeholders at this stage?

> [!NOTE]
> **Currency**: The documentation references NPR (Nepali Rupees). I'll use `NPR` as the currency prefix and `रू` as the symbol throughout the UI.

---

## Proposed Changes

### Phase 1: Project Initialization

#### [NEW] `mobile/` — Expo App (created via `npx create-expo-app`)

- Initialize an Expo project inside `d:\BNKS_HimaliX\mobile\` using `create-expo-app`
- Install required dependencies:
  - `expo-router` (file-based navigation)
  - `expo-network` (connectivity detection)
  - `react-native-qrcode-svg` (QR generation — later phases)
  - `zustand` (state management)
  - `expo-status-bar`
  - `@expo/vector-icons`

---

### Phase 2: Navigation Structure

#### [NEW] `mobile/app/_layout.tsx`
Root layout with Expo Router, theme provider, and font loading (Inter/Outfit from Google Fonts).

#### [NEW] `mobile/app/(auth)/_layout.tsx`
Auth stack layout for login/signup flow.

#### [NEW] `mobile/app/(auth)/login.tsx`
Login screen with phone/email + password fields.

#### [NEW] `mobile/app/(auth)/signup.tsx`
Signup screen with full name, phone/email, password fields.

#### [NEW] `mobile/app/(tabs)/_layout.tsx`
Bottom tab navigator with 4 tabs: **Home**, **History**, **Account**, **Settings** — matching the documentation spec.

#### [NEW] `mobile/app/(tabs)/index.tsx` — Home Tab
The main dashboard screen.

#### [NEW] `mobile/app/(tabs)/history.tsx` — History Tab
Transaction history (online + offline merged view).

#### [NEW] `mobile/app/(tabs)/account.tsx` — Account Tab
User profile, UUID display, developer logs access.

#### [NEW] `mobile/app/(tabs)/settings.tsx` — Settings Tab
Theme toggle, developer mode, app version info.

#### [NEW] `mobile/app/send.tsx`
Send money screen (outside tabs — modal/stack).

#### [NEW] `mobile/app/receive.tsx`
Receive money screen (outside tabs — modal/stack).

#### [NEW] `mobile/app/scan-qr.tsx`
QR scanner screen placeholder.

#### [NEW] `mobile/app/payment-confirmation.tsx`
Payment confirmation screen.

#### [NEW] `mobile/app/logs.tsx`
Developer logs screen with color-coded traces.

---

### Phase 3: Core UI — Premium Design

#### [NEW] `mobile/src/components/BalanceCard.tsx`
Glassmorphic card showing Total / Online / Offline balances with animated counters.

#### [NEW] `mobile/src/components/NetworkStatusBadge.tsx`
Real-time network status indicator (🟢 Online / 🔴 Offline / 🟡 Wi-Fi only) using `expo-network`.

#### [NEW] `mobile/src/components/ActionButton.tsx`
Massive, gradient-filled Send/Receive buttons with press animations.

#### [NEW] `mobile/src/components/TransactionItem.tsx`
Individual transaction row component for history lists.

#### [NEW] `mobile/src/components/QuickActions.tsx`
Grid of quick action buttons: Top Up, Load Bond, Sync, Reverse Bond.

#### [NEW] `mobile/src/store/useAppStore.ts`
Zustand store holding: `user`, `jwt`, `onlineBalance`, `offlineBalance`, `networkStatus`, `isAuthenticated`.

#### [NEW] `mobile/src/store/useLogStore.ts`
Zustand store for developer logging: captures INFO/WARN/ERROR events from crypto and sync services.

#### [NEW] `mobile/src/constants/theme.ts`
Design system tokens: colors (green gradient palette), spacing, typography (Inter font), border radius, shadows.

#### [NEW] `mobile/src/constants/mock-data.ts`
Mock transaction data, mock user profile, mock balance data for UI development.

---

### Home Screen Layout (matching your documentation spec)

```
┌──────────────────────────────────┐
│ OffPay                      ⚙️   │
│                                  │
│ 🟢 Online                        │
│                                  │
│ ┌──────────────────────────────┐ │
│ │   Total Balance              │ │
│ │   NPR 5,000                  │ │
│ │                              │ │
│ │   Online        Offline      │ │
│ │   NPR 3,000     NPR 2,000   │ │
│ └──────────────────────────────┘ │
│                                  │
│  ┌─────────┐    ┌─────────────┐  │
│  │  SEND   │    │   RECEIVE   │  │
│  └─────────┘    └─────────────┘  │
│                                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌──────┐  │
│  │Top │ │Load│ │Sync│ │Reverse│  │
│  │Up  │ │Bond│ │    │ │Bond  │  │
│  └────┘ └────┘ └────┘ └──────┘  │
│                                  │
│  Recent Transactions             │
│  ├── Paid Ram Bahadur  -500     │
│  ├── Received from Sita +200   │
│  └── Synced transaction ✓      │
│                                  │
├──────────────────────────────────┤
│ 🏠 Home  📜 History  👤 Account  ⚙️│
└──────────────────────────────────┘
```

---

## Verification Plan

### Automated Tests
- `npx expo start --web` to verify the app renders correctly on web
- Navigate through all tabs and screens to verify routing works

### Manual Verification
- Test on Android device via Expo Go after project setup
- Verify all navigation transitions are smooth
- Confirm the dark theme + green gradient palette matches the OffPay branding
- Check network status badge updates when toggling airplane mode
