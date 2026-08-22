#ifndef WEB_UI_DATA_H
#define WEB_UI_DATA_H

#include <Arduino.h>

// ══════════════════════════════════════════════════════════════════════
// ── EMBEDDED PROGMEM WEB UI FALLBACK ─────────────────────────────────
// This page is served if LittleFS /index.html has not yet been uploaded
// ══════════════════════════════════════════════════════════════════════
const char EMBEDDED_UI_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OffPay Terminal — Embedded Web UI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
    <style>
        :root {
            --bg: #ffffff; --surface: #fafafa; --border: #e0e0e0;
            --text: #000000; --text-muted: #666666;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: var(--bg); color: var(--text); padding: 24px;
            display: flex; justify-content: center; align-items: center; min-height: 100vh;
        }
        .container {
            max-width: 520px; width: 100%; border: 1px solid var(--border);
            border-radius: 12px; padding: 32px; background: var(--surface);
            box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .logo { font-size: 1.3rem; font-weight: 900; letter-spacing: -0.5px; }
        .badge { background: #000; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 4px 8px; border-radius: 4px; }
        .card-stat { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .stat-box { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 16px; text-align: center; }
        .stat-val { font-size: 1.4rem; font-weight: 800; margin-top: 4px; }
        .stat-lbl { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }
        .btn {
            background: #000; color: #fff; border: none; border-radius: 6px;
            padding: 12px; width: 100%; font-weight: 700; font-size: 0.9rem;
            cursor: pointer; transition: opacity 0.2s; margin-top: 8px;
        }
        .btn:hover { opacity: 0.85; }
        .btn-outline { background: transparent; color: #000; border: 1px solid var(--border); }
        .btn-outline:hover { background: #eee; }
        .nav-links { display: flex; gap: 8px; margin-top: 16px; }
        .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; margin-right: 6px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">OffPay <span style="font-weight:400;font-size:1rem;color:var(--text-muted);">Terminal</span></div>
            <span class="badge"><span class="status-dot"></span>ONLINE</span>
        </div>

        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">
            Hardware terminal is active and serving local JSON APIs & MQTT Synchronization.
        </p>

        <div class="card-stat">
            <div class="stat-box">
                <div class="stat-lbl">Terminal Mode</div>
                <div class="stat-val" id="t-mode">READY</div>
            </div>
            <div class="stat-box">
                <div class="stat-lbl">Free Heap</div>
                <div class="stat-val" id="t-heap">-- KB</div>
            </div>
        </div>

        <div style="background:#fff; border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:20px;">
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:6px;">Device IP: <strong id="t-ip" style="color:#000;">--</strong></div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Uptime: <strong id="t-uptime" style="color:#000;">--</strong></div>
        </div>

        <button class="btn" onclick="triggerPayment()">⚡ Test Payment (NPR 100)</button>
        
        <div class="nav-links">
            <button class="btn btn-outline" onclick="window.location.href='/api/status'">Status API</button>
            <button class="btn btn-outline" onclick="window.location.href='/api/cards'">Cards API</button>
            <button class="btn btn-outline" onclick="window.location.href='/update'">OTA Update</button>
        </div>
    </div>

    <script>
        function loadStatus() {
            fetch('/api/status').then(r => r.json()).then(d => {
                document.getElementById('t-mode').innerText = d.mode || 'READY';
                document.getElementById('t-heap').innerText = Math.round(d.freeHeap / 1024) + ' KB';
                document.getElementById('t-ip').innerText = d.ip || window.location.hostname;
                const m = Math.floor(d.uptime / 60000);
                document.getElementById('t-uptime').innerText = m + ' min';
            }).catch(()=>{});
        }
        loadStatus();
        setInterval(loadStatus, 2000);

        function triggerPayment() {
            fetch('/api/payment/start?amount=100', {method:'POST'}).then(()=>{
                alert('Payment mode activated! Tap RFID card on terminal.');
            });
        }
    </script>
</body>
</html>
)rawliteral";

#endif
