// tourist_safety.ino
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <TinyGPSPlus.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <MAX30105.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "secrets.h"

// Sensor Objects
TinyGPSPlus gps;
Adafruit_MPU6050 mpu;
MAX30105 particleSensor;
OneWire oneWire(4); // DS18B20 on GPIO 4
DallasTemperature tempSensor(&oneWire);

// WiFi and MQTT
WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

// GPS Serial (adjust pins if needed)
HardwareSerial gpsSerial(1); // RX=16, TX=17

// MQTT Topics
const char* TELEMETRY_TOPIC = "tourist/telemetry";
const char* ALERT_TOPIC = "tourist/alerts";

// Fall Detection Variables
float lastAccelMagnitude = 0;
bool fallDetected = false;
unsigned long fallDetectionTime = 0;

// Timing
unsigned long lastPublish = 0;
const long publishInterval = 5000; // 5 seconds

void setup() {
  Serial.begin(115200);
  delay(2000);
  
  Serial.println("Tourist Safety Device Starting...");
  
  // Initialize WiFi
  setupWiFi();
  
  // Initialize Sensors
  setupSensors();
  
  // Initialize MQTT
  setupMQTT();
}

void loop() {
  // Reconnect if needed
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();
  
  // Read GPS
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }
  
  // Publish telemetry every 5 seconds
  if (millis() - lastPublish >= publishInterval) {
    readAndPublishSensors();
    lastPublish = millis();
  }
  
  delay(100);
}

void setupWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void setupSensors() {
  // GPS
  gpsSerial.begin(9600, SERIAL_8N1, 16, 17); // RX=16, TX=17
  Serial.println("GPS initialized");
  
  // MPU6050
  if (!mpu.begin()) {
    Serial.println("MPU6050 not found!");
    while (1) delay(10);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  Serial.println("MPU6050 initialized");
  
  // MAX30102
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 not found!");
    while (1) delay(10);
  }
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
  Serial.println("MAX30102 initialized");
  
  // DS18B20
  tempSensor.begin();
  Serial.println("DS18B20 initialized");
  
  Serial.println("All sensors ready!");
}

void setupMQTT() {
  // Configure WiFiClientSecure
  wifiClient.setCACert(ROOT_CA);
  wifiClient.setCertificate(DEVICE_CERT);
  wifiClient.setPrivateKey(PRIVATE_KEY);
  
  // Configure MQTT
  mqttClient.setServer(AWS_IOT_ENDPOINT, 8883);
  mqttClient.setBufferSize(1024);
  
  Serial.println("MQTT configured");
  reconnectMQTT();
}

void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Connecting to AWS IoT...");
    
    if (mqttClient.connect(DEVICE_ID)) {
      Serial.println("connected!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" retrying in 5 seconds");
      delay(5000);
    }
  }
}

void readAndPublishSensors() {
  // Read MPU6050
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  
  // Calculate acceleration magnitude for fall detection
  float accelMagnitude = sqrt(
    pow(a.acceleration.x, 2) + 
    pow(a.acceleration.y, 2) + 
    pow(a.acceleration.z, 2)
  );
  
  // Fall Detection Logic
  // Free fall: accel < 3 m/s², then impact: accel > 20 m/s²
  if (accelMagnitude < 3.0 && lastAccelMagnitude < 3.0) {
    // Possible free fall
    fallDetectionTime = millis();
  } else if (accelMagnitude > 20.0 && 
             (millis() - fallDetectionTime) < 1000) {
    // Impact after free fall = FALL DETECTED
    fallDetected = true;
    Serial.println("⚠️ FALL DETECTED!");
  } else {
    fallDetected = false;
  }
  lastAccelMagnitude = accelMagnitude;
  
  // Read MAX30102 (Heart Rate & SpO2)
  int32_t heartRate = 0;
  int32_t spo2 = 0;
  
  if (particleSensor.available()) {
    heartRate = particleSensor.getHeartRate();
    spo2 = particleSensor.getSpO2();
    particleSensor.nextSample();
  }
  
  // Read DS18B20 Temperature
  tempSensor.requestTemperatures();
  float bodyTemp = tempSensor.getTempCByIndex(0);
  
  // GPS Data
  float latitude = gps.location.isValid() ? gps.location.lat() : 0.0;
  float longitude = gps.location.isValid() ? gps.location.lng() : 0.0;
  float altitude = gps.altitude.isValid() ? gps.altitude.meters() : 0.0;
  
  // Create JSON payload
  StaticJsonDocument<512> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["timestamp"] = millis();
  doc["latitude"] = latitude;
  doc["longitude"] = longitude;
  doc["altitude"] = altitude;
  doc["heartRate"] = heartRate;
  doc["spo2"] = spo2;
  doc["temperature"] = bodyTemp;
  doc["accelX"] = a.acceleration.x;
  doc["accelY"] = a.acceleration.y;
  doc["accelZ"] = a.acceleration.z;
  doc["fallDetected"] = fallDetected;
  
  // Serialize and publish
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  
  if (mqttClient.publish(TELEMETRY_TOPIC, jsonBuffer)) {
    Serial.println("✓ Data published");
    Serial.println(jsonBuffer);
  } else {
    Serial.println("✗ Publish failed");
  }
}
