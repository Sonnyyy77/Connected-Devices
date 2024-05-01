#include <Arduino_LSM6DS3.h>
#include <WiFiNINA.h>
#include "config.h"

WiFiUDP udpClient;
// WiFiSSLClient client;

float x, y, z;
int mappedX, mappedY;
int degreesX = 0;
int degreesY = 0;

const char server[] = "192.168.1.167"; //local IP address of receiver device goes here
const int port = 7777; //desired port # goes here. Make sure the receiver is listening on the same port!

//the port OTHER devices should use when sending to this one
const int localPort = 5000;

void setup() {
  Serial.begin(9600);
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

float remapToMinusPItoPI(float value) {
    return map(value, -90, 90, -PI, PI);
}

void loop() {
  float x, y, z;

  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    x = 100*x;
    y = 100*y;
    // mappedX = map(x, -180, 180, -90, 90);
    // mappedY = map(y, -180, 180, -90, 90);

    float remappedX = remapToMinusPItoPI(x);
    float remappedY = remapToMinusPItoPI(y);

    udpClient.beginPacket(server, port);
    // udpClient.write((uint8_t*)&remappedX, sizeof(remappedX));
    // udpClient.write((uint8_t*)&remappedY, sizeof(remappedY));
    // udpClient.print("X");
    udpClient.print(remappedX);
    // udpClient.print("Y");
    udpClient.print(remappedY);
    udpClient.endPacket();
    
  //   udpClient.beginPacket(server, port);
  //   if(x > 0.1){
  //   x = 100*x;
  //   degreesX = map(x, 0, 97, 0, 90);
  //   // udpClient.beginPacket(server, port);
  //   udpClient.print("A");
  //   udpClient.println(degreesX);
  //   // udpClient.println(" degrees");
  //   // udpClient.endPacket();
  //   }
  // if(x < -0.1){
  //   x = 100*x;
  //   degreesX = map(x, 0, -100, 0, -90);
  //   // Serial.print("Tilting down ");
  //   // Serial.print(degreesX);
  //   // Serial.println("  degrees");
  //   // udpClient.beginPacket(server, port);
  //   udpClient.print("B");
  //   udpClient.println(degreesX);
  //   // udpClient.println(" degrees");
  //   // udpClient.endPacket();
  //   }
  // if(y > 0.1){
  //   y = 100*y;
  //   degreesY = map(y, 0, 100, 0, 90);
  //   // Serial.print("Tilting left ");
  //   // Serial.print(degreesY);
  //   // Serial.println("  degrees");
  //   // udpClient.beginPacket(server, port);
  //   udpClient.print("C");
  //   udpClient.println(degreesY);
  //   // udpClient.println(" degrees");
  //   // udpClient.endPacket();
  //   }
  // if(y < -0.1){
  //   y = 100*y;
  //   degreesY = map(y, 0, -100, 0, -90);
  //   // Serial.print("Tilting right ");
  //   // Serial.print(degreesY);
  //   // Serial.println("  degrees");
  //   // udpClient.beginPacket(server, port);
  //   udpClient.print("D");
  //   udpClient.println(degreesY);
  //   // udpClient.println(" degrees");
  //   // udpClient.endPacket();
  //   }
  //   // Serial.println("Send");
  //   udpClient.endPacket();
    delay(500);

  }
}