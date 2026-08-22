# 📚 OffPay (HimaliX) Documentation Portal

Welcome to the official documentation hub for **OffPay**, the offline, off-grid peer-to-peer digital payment system. This portal is organized into focused, modular documents for easy navigation.

---

## 🗺️ Documentation Directory

| Document | Description | Key Topics |
| :--- | :--- | :--- |
| [01. Architecture & Vision](file:///d:/BNKS_HimaliX/docs/01-architecture-and-vision.md) | High-level system architecture and concept | Problem statement, Digital Banknotes/Bonds paradigm, Dual-Balance model |
| [02. Cryptography & Security](file:///d:/BNKS_HimaliX/docs/02-cryptography-and-security.md) | Mathematical foundations and security | Ed25519 signing, SHA-256 digests, Nonces, SecureStore enclave, Threat modeling |
| [03. Offline QR Handshake](file:///d:/BNKS_HimaliX/docs/03-offline-qr-handshake.md) | The P2P zero-network transaction protocol | Two-way handshake sequence, `OFFPAY_REQUEST` & `OFFPAY_PAYMENT` JSON specs |
| [04. Database & Sync Engine](file:///d:/BNKS_HimaliX/docs/04-database-and-sync-engine.md) | Data persistence and ledger reconciliation | SQLite local schemas, PostgreSQL backend schemas, Single-party sync, Anti-double-spending |
| [05. Screen Catalog & Features](file:///d:/BNKS_HimaliX/docs/05-screen-catalog-and-features.md) | User interface and feature catalog | Screen walkthroughs (Home, Send, Receive, Scan QR, Logs, Settings, History) |
| [06. Developer & Run Guide](file:///d:/BNKS_HimaliX/docs/06-developer-setup-and-run-guide.md) | Setup, development, and execution | Prerequisites, Expo local execution, Testing on Android/iOS/Web, Troubleshooting |
| [07. Pitch Deck & FAQ](file:///d:/BNKS_HimaliX/docs/07-pitch-deck-and-hackathon-qa.md) | Presentation blueprint and hackathon Q&A | 3-minute pitch script, Slide walkthrough, Judge questions and defense answers |
| [08. Offline Hardware Terminal](file:///d:/BNKS_HimaliX/docs/08-offline-hardware-terminal.md) | Standalone RFID POS & MQTT terminal | ESP32/ESP8266 circuit wiring, LittleFS RAM cache, REST API, MQTT cloud sync |

---

## ⚡ Quick Links
- 🚀 **[Quick Start Guide](file:///d:/BNKS_HimaliX/docs/06-developer-setup-and-run-guide.md#2-quick-start-commands)**
- 🔒 **[Cryptographic Payloads](file:///d:/BNKS_HimaliX/docs/03-offline-qr-handshake.md#2-json-payload-specifications)**
- 🗄️ **[SQLite Table Schemas](file:///d:/BNKS_HimaliX/docs/04-database-and-sync-engine.md#1-frontend-sqlite-schema)**
- 🏆 **[Pitch Deck Script](file:///d:/BNKS_HimaliX/docs/07-pitch-deck-and-hackathon-qa.md#1-the-3-minute-pitch-script)**
