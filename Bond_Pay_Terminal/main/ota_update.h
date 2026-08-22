#ifndef OTA_UPDATE_H
#define OTA_UPDATE_H

#include <Arduino.h>
#ifdef ESP32
#include <WiFi.h>
#include <WebServer.h>
#include <Update.h>
#include <ArduinoOTA.h>
#else
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Updater.h>
#include <ArduinoOTA.h>
#endif
#include <LiquidCrystal_I2C.h>

// External hardware references
extern LiquidCrystal_I2C lcd;
#ifndef BUZZER
#define BUZZER 16
#endif
#ifndef LED
#define LED 15
#endif

// Forward declaration of server
#ifdef ESP32
extern WebServer server;
#else
extern ESP8266WebServer server;
#endif

// ══════════════════════════════════════════════════════════════════════
// ── ARDUINO OTA (WIRELESS IDE FLASHING) ──────────────────────────────
// ══════════════════════════════════════════════════════════════════════
inline void setupArduinoOTA() {
  // Hostname
  #ifdef ESP32
  String host = "OffPay-Terminal-" + String((uint32_t)ESP.getEfuseMac(), HEX);
  #else
  String host = "OffPay-Terminal-" + String(ESP.getChipId(), HEX);
  #endif
  ArduinoOTA.setHostname(host.c_str());
  ArduinoOTA.setPassword("offpay123");

  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "Firmware";
    } else { // U_FS / U_SPIFFS
      type = "Filesystem";
    }
    Serial.println("[OTA] Start updating " + type);
    lcd.clear();
    lcd.setCursor(0, 0); lcd.print("OTA Update...");
    lcd.setCursor(0, 1); lcd.print("Flashing 0%");
  });

  ArduinoOTA.onEnd([]() {
    Serial.println("\n[OTA] Update Complete. Rebooting...");
    lcd.clear();
    lcd.setCursor(0, 0); lcd.print("Update Success!");
    lcd.setCursor(0, 1); lcd.print("Rebooting...");
    
    // Success audio cue
    digitalWrite(BUZZER, HIGH);
    delay(150);
    digitalWrite(BUZZER, LOW);
    delay(100);
    digitalWrite(BUZZER, HIGH);
    delay(300);
    digitalWrite(BUZZER, LOW);
  });

  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    unsigned int percent = (progress / (total / 100));
    Serial.printf("[OTA] Progress: %u%%\r", percent);
    
    static unsigned int lastPercent = 999;
    if (percent != lastPercent && percent % 10 == 0) {
      lastPercent = percent;
      lcd.setCursor(9, 1);
      lcd.print(String(percent) + "%  ");
    }
  });

  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("[OTA] Error[%u]: ", error);
    String errStr = "Error";
    if (error == OTA_AUTH_ERROR) errStr = "Auth Failed";
    else if (error == OTA_BEGIN_ERROR) errStr = "Begin Failed";
    else if (error == OTA_CONNECT_ERROR) errStr = "Connect Failed";
    else if (error == OTA_RECEIVE_ERROR) errStr = "Receive Failed";
    else if (error == OTA_END_ERROR) errStr = "End Failed";
    
    Serial.println(errStr);
    lcd.clear();
    lcd.setCursor(0, 0); lcd.print("OTA Failed!");
    lcd.setCursor(0, 1); lcd.print(errStr);
    delay(3000);
  });

  ArduinoOTA.begin();
  Serial.println("[OTA] ArduinoOTA service listening on " + host);
}

// ══════════════════════════════════════════════════════════════════════
// ── WEB BROWSER OTA PORTAL (/update) ─────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
const char WEB_OTA_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OffPay Terminal — Firmware OTA Update</title>
    <style>
        :root {
            --bg: #ffffff;
            --surface: #fafafa;
            --border: #e0e0e0;
            --text: #000000;
            --text-muted: #666666;
            --accent: #000000;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
        }
        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 32px;
            max-width: 460px;
            width: 100%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }
        .logo-mark {
            width: 36px;
            height: 36px;
            background: #000;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 800;
            font-size: 1.1rem;
        }
        h1 {
            font-size: 1.25rem;
            margin: 0;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        p {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-top: 4px;
            margin-bottom: 24px;
            line-height: 1.4;
        }
        .info-box {
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 24px;
            font-size: 0.8rem;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
        }
        .info-row:last-child {
            margin-bottom: 0;
        }
        .info-label { color: var(--text-muted); }
        .info-val { font-weight: 600; font-family: monospace; }
        .upload-area {
            border: 2px dashed var(--border);
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            margin-bottom: 20px;
            cursor: pointer;
            background: #fff;
            transition: all 0.2s ease;
        }
        .upload-area:hover {
            border-color: #000;
        }
        input[type="file"] {
            display: none;
        }
        .file-label {
            font-size: 0.85rem;
            font-weight: 600;
            display: block;
            cursor: pointer;
        }
        .file-sub {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 4px;
        }
        .btn {
            background: var(--accent);
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 12px;
            width: 100%;
            font-size: 0.9rem;
            font-weight: 700;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
        .progress-bar-container {
            height: 6px;
            background: var(--border);
            border-radius: 3px;
            margin-top: 16px;
            overflow: hidden;
            display: none;
        }
        .progress-bar {
            height: 100%;
            background: #000;
            width: 0%;
            transition: width 0.1s linear;
        }
        .status-msg {
            font-size: 0.8rem;
            font-weight: 600;
            text-align: center;
            margin-top: 12px;
            display: none;
        }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 20px;
            font-size: 0.8rem;
            color: var(--text-muted);
            text-decoration: none;
        }
        .back-link:hover { text-decoration: underline; color: #000; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <div class="logo-mark">⚡</div>
            <div>
                <h1>OffPay Over-The-Air Update</h1>
                <div style="font-size:0.75rem; color:var(--text-muted);">Hardware Terminal Firmware Portal</div>
            </div>
        </div>
        <p>Select a pre-compiled <code>.bin</code> firmware binary to update your terminal wirelessly over Wi-Fi.</p>

        <div class="info-box">
            <div class="info-row"><span class="info-label">Device Type</span><span class="info-val" id="d-type">OffPay ESP Node</span></div>
            <div class="info-row"><span class="info-label">Firmware Version</span><span class="info-val">v2.0 (OTA Enabled)</span></div>
            <div class="info-row"><span class="info-label">Free Heap</span><span class="info-val" id="d-heap">Loading...</span></div>
        </div>

        <form id="upload-form" method="POST" action="/update" enctype="multipart/form-data">
            <div class="upload-area" onclick="document.getElementById('file-input').click()">
                <label class="file-label" id="chosen-file-text">📁 Click to choose firmware .bin</label>
                <div class="file-sub">or drag and drop binary file here</div>
                <input type="file" id="file-input" name="update" accept=".bin" onchange="onFileSelected(this)">
            </div>

            <button type="button" class="btn" id="upload-btn" onclick="submitOTA()" disabled>Flash Firmware</button>

            <div class="progress-bar-container" id="prog-wrap">
                <div class="progress-bar" id="prog-bar"></div>
            </div>
            <div class="status-msg" id="status-text">Uploading...</div>
        </form>

        <a href="/" class="back-link">← Return to OffPay Terminal Dashboard</a>
    </div>

    <script>
        fetch('/api/status').then(r => r.json()).then(d => {
            document.getElementById('d-heap').innerText = Math.round(d.freeHeap / 1024) + ' KB';
        }).catch(()=>{});

        function onFileSelected(input) {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                document.getElementById('chosen-file-text').innerText = 'Selected: ' + file.name;
                document.getElementById('upload-btn').disabled = false;
            }
        }

        function submitOTA() {
            const fileInput = document.getElementById('file-input');
            if (!fileInput.files.length) return;

            const btn = document.getElementById('upload-btn');
            const progWrap = document.getElementById('prog-wrap');
            const progBar = document.getElementById('prog-bar');
            const statusText = document.getElementById('status-text');

            btn.disabled = true;
            btn.innerText = 'Flashing...';
            progWrap.style.display = 'block';
            statusText.style.display = 'block';
            statusText.innerText = 'Sending binary payload to ESP...';

            const formData = new FormData();
            formData.append('update', fileInput.files[0]);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/update', true);

            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    progBar.style.width = percent + '%';
                    statusText.innerText = 'Uploading: ' + percent + '%';
                }
            };

            xhr.onload = function() {
                if (xhr.status === 200) {
                    progBar.style.width = '100%';
                    statusText.innerText = '✅ Update Succeeded! Rebooting terminal in 3 seconds...';
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 4000);
                } else {
                    statusText.innerText = '❌ Update Failed: ' + xhr.responseText;
                    btn.disabled = false;
                    btn.innerText = 'Retry Flash';
                }
            };

            xhr.onerror = function() {
                statusText.innerText = '❌ Network Error during OTA transmission';
                btn.disabled = false;
                btn.innerText = 'Retry Flash';
            };

            xhr.send(formData);
        }
    </script>
</body>
</html>
)rawliteral";

inline void setupWebOTARoutes() {
  // Web OTA Page
  server.on("/update", HTTP_GET, []() {
    server.send_P(200, "text/html", WEB_OTA_HTML);
  });

  // Web OTA Upload Handler
  server.on("/update", HTTP_POST, []() {
    server.sendHeader("Connection", "close");
    server.send(Update.hasError() ? 500 : 200, "text/plain", Update.hasError() ? "FAIL" : "OK");
    if (!Update.hasError()) {
      delay(500);
      ESP.restart();
    }
  }, []() {
    HTTPUpload& upload = server.upload();
    if (upload.status == UPLOAD_FILE_START) {
      Serial.printf("[Web OTA] Update: %s\n", upload.filename.c_str());
      lcd.clear();
      lcd.setCursor(0, 0); lcd.print("Web OTA Upload..");
      lcd.setCursor(0, 1); lcd.print("Receiving BIN");
      
      #ifdef ESP32
      if (!Update.begin(UPDATE_SIZE_UNKNOWN)) {
        Update.printError(Serial);
      }
      #else
      uint32_t maxSketchSpace = (ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000;
      if (!Update.begin(maxSketchSpace)) {
        Update.printError(Serial);
      }
      #endif
    } else if (upload.status == UPLOAD_FILE_WRITE) {
      if (Update.write(upload.buf, upload.currentSize) != upload.currentSize) {
        Update.printError(Serial);
      }
    } else if (upload.status == UPLOAD_FILE_END) {
      if (Update.end(true)) {
        Serial.printf("[Web OTA] Success: %u bytes\n", upload.totalSize);
        lcd.clear();
        lcd.setCursor(0, 0); lcd.print("Flash Complete!");
        lcd.setCursor(0, 1); lcd.print("Rebooting...");
      } else {
        Update.printError(Serial);
      }
    }
  });
}

inline void setupOTA() {
  setupArduinoOTA();
  setupWebOTARoutes();
}

inline void handleOTA() {
  ArduinoOTA.handle();
}

#endif
