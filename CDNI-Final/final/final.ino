#include <Arduino_LSM6DS3.h>
#include <WiFiNINA.h>
#include "config.h"

#define BUTTON_PIN1 7
#define BUTTON_PIN2 8

WiFiUDP udpClient;
// WiFiSSLClient client;

float x, y, z;
int mappedX, mappedY;
int degreesX = 0;
int degreesY = 0;
// const int button1Pin = 2;
// const int button2Pin = 4;

const char server[] = "192.168.1.167"; //local IP address of receiver device goes here
const int port = 7777; //desired port # goes here. Make sure the receiver is listening on the same port!

//the port OTHER devices should use when sending to this one
const int localPort = 5000;

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN1, INPUT);
  pinMode(BUTTON_PIN2, INPUT);
  while (!Serial);
  Serial.println("Started");

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");

    while (1);
  }

  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println(" Hz");

  //retry connection until WiFi is connected successfully
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Attempting to connect to SSID: ");
    // Attempt connection to WPA/WPA2 network.
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    delay(500);
  }
  Serial.println("connected!");

  udpClient.begin(localPort);
}

char messageBuffer[256];

void loop() {
  float x, y, z;

  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    x = 100*x;
    y = 100*y;

    float remappedX = map(x, -100, 100, -90, 90);
    float remappedY = map(y, -100, 100, -90, 90);

    int button1State = digitalRead(BUTTON_PIN1);
    int button2State = digitalRead(BUTTON_PIN2);

    udpClient.beginPacket(server, port);
    udpClient.print(remappedX);
    udpClient.print(",");
    udpClient.print(remappedY);
    udpClient.print(",");
    udpClient.print(button1State);
    udpClient.print(",");
    udpClient.print(button2State);
    udpClient.endPacket();

    delay(100);

  }
}