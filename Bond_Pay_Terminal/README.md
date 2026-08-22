# 📟 OffPay Terminal: Offline RFID Hardware System

> The official offline merchant terminal for the **OffPay (HimaliX)** digital payment ecosystem.

---

## ⚡ Quick Start

### 1. Run the Web Management Interface
Double-click [`start_ui_server.bat`](file:///d:/BNKS_HimaliX/Bond_Pay_Terminal/start_ui_server.bat) or open [`off-pay.html`](file:///d:/BNKS_HimaliX/Bond_Pay_Terminal/off-pay.html) directly in any modern web browser.

### 2. Multi-Device Cloud Sync
1. Open [`off-pay.html`](file:///d:/BNKS_HimaliX/Bond_Pay_Terminal/off-pay.html).
2. Click **Pair** in the top header.
3. Scan the generated **QR Code** on your mobile phone or copy the direct pairing link.
4. Payments, card updates, and live balance deductions will synchronize instantaneously over MQTT.

---

## 📁 Directory Structure

```
Bond_Pay_Terminal/
├── off-pay.html          # Single-file Web Management Interface (MQTT + LAN)
├── start_ui_server.bat   # 1-Click local HTTP server launcher
├── README.md             # This document
└── main/                 # Embedded Arduino firmware
    ├── main.ino          # Setup, main loop, GPIO and RFID polling
    ├── mqtt_sync.h       # Cloud MQTT client & topic synchronization
    ├── storage.h         # LittleFS flash storage & RAM cache
    ├── payment.h         # Balance deduction & transaction logger
    ├── rfid.h            # MFRC522 SPI RFID reader logic
    └── web.h             # REST API CORS utilities
```

---

## 🔌 Hardware Wiring (ESP8266 NodeMCU)

| Component | Component Pin | NodeMCU Pin |
| :--- | :--- | :--- |
| **MFRC522 RFID** | 3.3V / GND | 3.3V / GND |
| | SDA (SS) | D4 (GPIO2) |
| | SCK / MOSI / MISO | D5 (GPIO14) / D7 (GPIO13) / D6 (GPIO12) |
| **1602 I2C LCD** | VCC / GND | Vin (5V) / GND |
| | SDA / SCL | D2 (GPIO4) / D1 (GPIO5) |
| **Feedback** | Active Buzzer | D0 (GPIO16) |
| | Status LED | D8 (GPIO15) |
| | Reset Button | D3 (GPIO0) |

---

## 📖 Complete Technical Documentation
For full architectural specs, cryptographic validation, and circuit diagrams, see:
- [📘 Full Hardware Terminal Documentation](file:///d:/BNKS_HimaliX/docs/08-offline-hardware-terminal.md)
- [📚 Main OffPay Documentation Hub](file:///d:/BNKS_HimaliX/docs/README.md)
