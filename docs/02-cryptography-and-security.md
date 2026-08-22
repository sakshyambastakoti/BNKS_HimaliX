# 🔐 Cryptography & Security Specifications

> **Navigation**: [Docs Portal](file:///d:/BNKS_HimaliX/docs/README.md) | [01. Architecture](file:///d:/BNKS_HimaliX/docs/01-architecture-and-vision.md) | **Next**: [03. Offline QR Handshake](file:///d:/BNKS_HimaliX/docs/03-offline-qr-handshake.md)

---

## 1. Cryptographic Primitive Selection

OffPay relies on a zero-trust cryptographic verification system designed to operate fully offline.

| Primitive | Standard | Key/Signature Size | Rationale |
| :--- | :--- | :--- | :--- |
| **Digital Signatures** | **Ed25519** (Edwards-curve DSA) | Public Key: 32 bytes (64 hex)<br>Signature: 64 bytes (128 hex) | High verification throughput, small signature size optimized for QR code transmission, immune to timing attacks. |
| **Digest Hashing** | **SHA-256** | 32 bytes (64 hex) | Industry standard collision-resistant hashing for payload digests. |
| **Entropy & Nonce** | **CSPRNG** | 16 bytes (32 hex) | Guarantees uniqueness for every transaction to strictly prevent replay attacks. |
| **Key Storage** | **Hardware Enclave** | N/A | Keys protected by `expo-secure-store` (Android Keystore / iOS Keychain). |

---

## 2. Mathematical Signature Formulations

### 2.1 Server Bond Issuance Signature
When the server mints an offline bond, it creates an unforgeable digital watermark:

$$\text{BondPayload} = \text{bondId} \parallel \text{value} \parallel \text{ownerId} \parallel \text{issuedAt} \parallel \text{expiresAt} \parallel \text{"OFFPAY\_SERVER"}$$
$$\text{Digest}_{\text{bond}} = \text{SHA-256}(\text{BondPayload})$$
$$\sigma_{\text{server}} = \text{Ed25519\_Sign}(\text{PrivateKey}_{\text{server}}, \text{Digest}_{\text{bond}})$$

Offline receivers can verify this signature using the embedded public key of the OffPay Central Server:
$$\text{Ed25519\_Verify}(\text{PublicKey}_{\text{server}}, \text{Digest}_{\text{bond}}, \sigma_{\text{server}}) \stackrel{?}{=} \text{TRUE}$$

### 2.2 Sender Transaction Signature
When Alice transfers bonds to Bob offline:

$$\text{TxPayload} = \text{txId} \parallel \text{bondIds} \parallel \text{senderId} \parallel \text{receiverId} \parallel \text{totalAmount} \parallel \text{timestamp} \parallel \text{nonce}$$
$$\text{Digest}_{\text{tx}} = \text{SHA-256}(\text{TxPayload})$$
$$\sigma_{\text{sender}} = \text{Ed25519\_Sign}(\text{PrivateKey}_{\text{sender}}, \text{Digest}_{\text{tx}})$$

Bob's device calculates the same SHA-256 digest and verifies:
$$\text{Ed25519\_Verify}(\text{PublicKey}_{\text{sender}}, \text{Digest}_{\text{tx}}, \sigma_{\text{sender}}) \stackrel{?}{=} \text{TRUE}$$

---

## 3. Threat Matrix & Defense Mechanisms

```
┌────────────────────────┬─────────────────────────┬────────────────────────────────────────────────────────┐
│ Threat Vector          │ Attack Description      │ OffPay Cryptographic Mitigation                       │
├────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────┤
│ Counterfeit Bonds      │ Forging fake bond tokens│ Server Ed25519 signature verified offline by receiver  │
│ Replay Attacks         │ Rescanning a spent QR   │ Nonces + timestamps stored; SQLite duplicate rejection │
│ Double-Spending        │ Spending 1 bond twice   │ Instant local lock + backend bond_redemptions check   │
│ APK Tampering          │ Bypassing local balance │ Receiver verifies cryptographic signature independently│
│ Key Theft via Malware  │ Extracting private keys │ Keys protected inside Hardware Keystore/Keychain       │
└────────────────────────┴─────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 4. Key Storage Security Architecture

```
┌────────────────────────────────────────────────────────┐
│                     USER DEVICE                        │
├─────────────────────────┬──────────────────────────────┤
│   Application Layer     │   Secure Enclave Layer       │
│   (React Native)        │   (Android Keystore/Keychain)│
│                         │                              │
│ • UI & Navigation       │ ┌──────────────────────────┐ │
│ • QR Scanner & Builder  │ │ Ed25519 Private Key      │ │
│ • Local SQLite Database │ │ (Hardware Encrypted)     │ │
│                         │ └────────────┬─────────────┘ │
│                         │              │ Sign Only     │
│                         │              ▼               │
│ • SHA-256 Digest ───────┼────────► [Sign Payload]      │
│                         │              │ 64B Signature │
│ • Render Payment QR ◄───┼──────────────┘               │
└─────────────────────────┴──────────────────────────────┘
```
