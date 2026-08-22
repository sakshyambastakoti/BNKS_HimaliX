#ifndef MQTT_SYNC_H
#define MQTT_SYNC_H

#include <Arduino.h>
#ifdef ESP32
#include <WiFi.h>
#else
#include <ESP8266WiFi.h>
#endif
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "storage.h"
#include "payment.h"

// ══════════════════════════════════════════════════════════════════════
// ── MQTT CONFIGURATION ───────────────────────────────────────────────
// Change MQTT_CHANNEL to match your Web UI pairing channel ID
// ══════════════════════════════════════════════════════════════════════
#ifndef MQTT_BROKER
#define MQTT_BROKER   "broker.emqx.io"    // Public high-speed MQTT broker
#endif
#ifndef MQTT_PORT
#define MQTT_PORT     1883                // Standard TCP MQTT port
#endif
#ifndef MQTT_CHANNEL
#define MQTT_CHANNEL  "op-station-01"     // Channel ID (synced with Web UI)
#endif

// Forward declarations from main.ino
extern StationMode currentMode;
extern float activeAmount;
extern String activeRegName;
extern String activeRegUserId;
extern float activeRegBalance;
extern bool readyDisplayed;
extern String deviceIP;
extern struct LastEvent lastEvent;
extern int pendingSyncCount;

// Instances
inline WiFiClient espClient;
inline PubSubClient mqttClient(espClient);

// Reconnection timer
inline unsigned long lastMqttReconnectAttempt = 0;
inline unsigned long lastStatusPublishTime = 0;

// Topic generators
inline String getTopicStatus() { return String("offpay/") + MQTT_CHANNEL + "/status"; }
inline String getTopicEvents() { return String("offpay/") + MQTT_CHANNEL + "/events"; }
inline String getTopicCards()  { return String("offpay/") + MQTT_CHANNEL + "/cards"; }
inline String getTopicTxns()   { return String("offpay/") + MQTT_CHANNEL + "/txns"; }
inline String getTopicCmd()    { return String("offpay/") + MQTT_CHANNEL + "/cmd"; }
inline String getTopicPresence(){ return String("offpay/") + MQTT_CHANNEL + "/presence"; }

// ── Publish Device Status ────────────────────────────────────────────
inline void mqttPublishStatus() {
  if (!mqttClient.connected()) return;

  ALLOCATE_JSON_DOCUMENT(doc, 512);
  doc["mode"] = currentMode == MODE_READY ? "READY" : (currentMode == MODE_PAYMENT ? "PAYMENT" : "ADD_CARD");
  doc["activeAmount"] = activeAmount;
  doc["activeUserId"] = activeRegUserId;
  doc["freeHeap"] = ESP.getFreeHeap();
  doc["uptime"] = millis();
  doc["pendingSyncCount"] = pendingSyncCount;
  doc["ip"] = deviceIP;
  doc["channel"] = MQTT_CHANNEL;
  doc["deviceType"] = "hardware_terminal";

  JsonObject evt = CREATE_NESTED_OBJECT(doc, "lastEvent");
  evt["processed"] = lastEvent.processed;
  evt["status"] = lastEvent.status;
  evt["uid"] = lastEvent.uid;
  evt["name"] = lastEvent.name;
  evt["amount"] = lastEvent.amount;
  evt["prevBal"] = lastEvent.prevBal;
  evt["remBal"] = lastEvent.remBal;
  evt["message"] = lastEvent.message;

  String output;
  serializeJson(doc, output);
  mqttClient.publish(getTopicStatus().c_str(), output.c_str(), true); // Retained status
}

// ── Publish Event (Card Tap / Payment Result) ────────────────────────
inline void mqttPublishEvent(const String &status, const String &uid, const String &name, float amount, float prevBal, float remBal, const String &message) {
  if (!mqttClient.connected()) return;

  ALLOCATE_JSON_DOCUMENT(doc, 512);
  doc["status"] = status;
  doc["uid"] = uid;
  doc["name"] = name;
  doc["amount"] = amount;
  doc["prevBal"] = prevBal;
  doc["remBal"] = remBal;
  doc["message"] = message;
  doc["timestamp"] = formatEpochTime(getEpochTime());
  doc["processed"] = false;

  String output;
  serializeJson(doc, output);
  mqttClient.publish(getTopicEvents().c_str(), output.c_str(), false);
}

// ── Publish Cards Database ───────────────────────────────────────────
inline void mqttPublishCards() {
  if (!mqttClient.connected()) return;
  mqttClient.publish(getTopicCards().c_str(), cachedCardsJson.c_str(), true);
}

// ── Publish Transactions Database ────────────────────────────────────
inline void mqttPublishTransactions() {
  if (!mqttClient.connected()) return;
  mqttClient.publish(getTopicTxns().c_str(), cachedTransactionsJson.c_str(), true);
}

// ── Handle Incoming MQTT Commands ────────────────────────────────────
inline void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  String topicStr = String(topic);
  Serial.println("[MQTT] Received on " + topicStr + ": " + message);

  // 1. Direct Cards Array Synchronization
  if (topicStr.endsWith("/cards") && message.startsWith("[")) {
    ALLOCATE_JSON_DOCUMENT(cardsDoc, 4096);
    DeserializationError err = deserializeJson(cardsDoc, message);
    if (!err && cardsDoc.is<JsonArray>()) {
      std::vector<Card> newCards;
      JsonArray arr = cardsDoc.as<JsonArray>();
      for (JsonObject obj : arr) {
        Card c;
        c.uid = obj["uid"] | "";
        c.name = obj["name"] | "Cardholder";
        c.userId = obj["userId"] | "USR";
        c.balance = obj["balance"] | 0.0f;
        if (c.uid.length() > 0) {
          newCards.push_back(c);
        }
      }
      saveCards(newCards);
      Serial.println("[MQTT] Direct Cards Sync: " + String(newCards.size()) + " cards updated in LittleFS!");
      mqttPublishStatus();
    }
    return;
  }

  // 2. Command Processing
  ALLOCATE_JSON_DOCUMENT(doc, 1024);
  DeserializationError err = deserializeJson(doc, message);
  if (err) {
    Serial.println("[MQTT] JSON parse error: " + String(err.c_str()));
    return;
  }

  String action = doc["action"] | (doc["cmd"] | "");

  if (action == "start_payment") {
    float amt = doc["amount"] | 0.0f;
    if (amt > 0) {
      activeAmount = amt;
      currentMode = MODE_PAYMENT;
      readyDisplayed = false;
      Serial.println("[MQTT] Remote payment started: NPR " + String(amt));
      mqttPublishStatus();
    }
  } else if (action == "cancel" || action == "cancel_payment" || action == "cancel_card") {
    currentMode = MODE_READY;
    readyDisplayed = false;
    Serial.println("[MQTT] Remote action cancelled");
    mqttPublishStatus();
  } else if (action == "add_card") {
    String uid = doc["uid"] | "";
    activeRegName = doc["name"] | "";
    activeRegUserId = doc["userId"] | "";
    activeRegBalance = doc["balance"] | 1000.0f;

    if (uid.length() > 0) {
      std::vector<Card> cards;
      loadCards(cards);
      int idx = findCardIndex(cards, uid);
      if (idx != -1) {
        cards[idx].name = activeRegName;
        cards[idx].userId = activeRegUserId;
        cards[idx].balance = activeRegBalance;
      } else {
        Card nc;
        nc.uid = uid;
        nc.name = activeRegName;
        nc.userId = activeRegUserId;
        nc.balance = activeRegBalance;
        cards.push_back(nc);
      }
      saveCards(cards);
      Serial.println("[MQTT] Remote card saved to LittleFS: " + activeRegName + " (" + uid + ")");
      mqttPublishCards();
      mqttPublishStatus();
    } else {
      currentMode = MODE_ADD_CARD;
      readyDisplayed = false;
      Serial.println("[MQTT] Remote card enrollment mode: " + activeRegName);
      mqttPublishStatus();
    }
  } else if (action == "update_balance") {
    String uid = doc["uid"] | "";
    float bal = doc["balance"] | 0.0f;
    std::vector<Card> cards;
    if (loadCards(cards)) {
      int idx = findCardIndex(cards, uid);
      if (idx != -1) {
        cards[idx].balance = bal;
        saveCards(cards);
        Serial.println("[MQTT] Balance updated for UID: " + uid + " -> " + String(bal));
        mqttPublishCards();
        mqttPublishStatus();
      }
    }
  } else if (action == "delete_card") {
    String uid = doc["uid"] | "";
    std::vector<Card> cards;
    if (loadCards(cards)) {
      int idx = findCardIndex(cards, uid);
      if (idx != -1) {
        cards.erase(cards.begin() + idx);
        saveCards(cards);
        Serial.println("[MQTT] Card deleted from LittleFS UID: " + uid);
        mqttPublishCards();
        mqttPublishStatus();
      }
    }
  } else if (action == "clear_cards" || action == "delete_all_cards") {
    std::vector<Card> emptyCards;
    saveCards(emptyCards);
    Serial.println("[MQTT] ALL Cards cleared from LittleFS!");
    mqttPublishCards();
    mqttPublishStatus();
  } else if (action == "clear_transactions" || action == "clear_ledger") {
    std::vector<Transaction> emptyTxns;
    saveTransactions(emptyTxns);
    Serial.println("[MQTT] ALL Transactions cleared from LittleFS!");
    mqttPublishTransactions();
    mqttPublishStatus();
  } else if (action == "request_sync") {
    Serial.println("[MQTT] Sync requested");
    mqttPublishStatus();
    mqttPublishCards();
    mqttPublishTransactions();
  } else if (action == "sync_time") {
    uint32_t epoch = doc["epoch"] | 0;
    if (epoch > 0) {
      timeSyncEpoch = epoch;
      timeSyncMillis = millis();
      Serial.println("[MQTT] Time synced from cloud");
    }
  }
}

// ── Reconnect MQTT ───────────────────────────────────────────────────
inline bool mqttReconnect() {
  if (WiFi.status() != WL_CONNECTED) return false;

  String clientId = "OffPay-Terminal-";
  #ifdef ESP32
  clientId += String((uint32_t)ESP.getEfuseMac(), HEX);
  #else
  clientId += String(ESP.getChipId(), HEX);
  #endif

  Serial.println("[MQTT] Attempting connection to " + String(MQTT_BROKER) + ":" + String(MQTT_PORT) + " as " + clientId);

  // Will topic for presence
  String willTopic = getTopicPresence();
  String willMsg = "{\"client\":\"" + clientId + "\",\"status\":\"offline\"}";

  if (mqttClient.connect(clientId.c_str(), willTopic.c_str(), 1, false, willMsg.c_str())) {
    Serial.println("[MQTT] Connected successfully!");

    // Announce online
    String onlineMsg = "{\"client\":\"" + clientId + "\",\"device\":\"hardware\",\"status\":\"online\"}";
    mqttClient.publish(willTopic.c_str(), onlineMsg.c_str(), false);

    // Subscribe to commands and cards topics
    mqttClient.subscribe(getTopicCmd().c_str(), 1);
    mqttClient.subscribe((String("offpay/") + MQTT_CHANNEL + "/commands").c_str(), 1);
    mqttClient.subscribe(getTopicCards().c_str(), 1);
    Serial.println("[MQTT] Subscribed to commands and cards channels for " + String(MQTT_CHANNEL));

    // Publish initial state
    mqttPublishStatus();
    mqttPublishCards();
    mqttPublishTransactions();
    return true;
  } else {
    Serial.print("[MQTT] Connection failed, rc=");
    Serial.println(mqttClient.state());
    return false;
  }
}

// ── Setup MQTT ───────────────────────────────────────────────────────
inline void setupMQTT() {
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  mqttClient.setBufferSize(2048); // Support larger JSON payloads for cards/txns
}

// ── Loop Handler (call in main loop) ─────────────────────────────────
inline void handleMQTT() {
  if (WiFi.status() != WL_CONNECTED) return;

  if (!mqttClient.connected()) {
    unsigned long now = millis();
    if (now - lastMqttReconnectAttempt > 5000) {
      lastMqttReconnectAttempt = now;
      if (mqttReconnect()) {
        lastMqttReconnectAttempt = 0;
      }
    }
  } else {
    mqttClient.loop();

    // Periodic status publish every 10 seconds
    unsigned long now = millis();
    if (now - lastStatusPublishTime > 10000) {
      lastStatusPublishTime = now;
      mqttPublishStatus();
    }
  }
}

#endif
