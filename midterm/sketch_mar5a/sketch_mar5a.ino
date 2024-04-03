#include <WiFiNINA.h>
WiFiUDP udpClient;

const char server[] = "10.23.11.100";
const int port = 7777;
const int localPort = 5000;

const char WIFI_SSID[] = "sandbox370";
const char WIFI_PASS[] = "+s0a+s03!2gether?";
// const char WIFI_SSID[] = "Verizon_HZWY66";
// const char WIFI_PASS[] = "obtuse9-aye-dub";

// TCS230 or TCS3200 pins wiring to Arduino
#define S0 13
#define S1 12
#define S2 6
#define S3 7
#define sensorOut 5

// Stores frequency read by the photodiodes
int redFrequency = 0;
int greenFrequency = 0;
int blueFrequency = 0;

void setup() {
  // Setting the outputs
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  
  // Setting the sensorOut as an input
  pinMode(sensorOut, INPUT);
  
  // Setting frequency scaling to 20%
  digitalWrite(S0,HIGH);
  digitalWrite(S1,LOW);
  
  // Begins serial communication 
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Started");

  //retry connection until WiFi is connected successfully
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Attempting to connect to SSID: ");
    // Attempt connection to WPA/WPA2 network.
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    delay(1000);
  }
  Serial.println("connected!");
  udpClient.begin(localPort);
}

char messageBuffer[256];

void loop() {
  //retry connection until WiFi is connected successfully
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_BUILTIN, LOW);
    Serial.println("Attempting to connect to SSID: ");
    // Attempt connection to WPA/WPA2 network.
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    delay(1000);
  }

  digitalWrite(LED_BUILTIN, HIGH);

  // Setting RED (R) filtered photodiodes to be read
  digitalWrite(S2,LOW);
  digitalWrite(S3,LOW);
  
  // Reading the output frequency
  redFrequency = pulseIn(sensorOut, LOW);
  Serial.print(redFrequency);
  udpClient.beginPacket(server, port);
  udpClient.print(redFrequency);
  udpClient.print(",");
  
  // Setting GREEN (G) filtered photodiodes to be read
  digitalWrite(S2,HIGH);
  digitalWrite(S3,HIGH);
  
  // Reading the output frequency
  greenFrequency = pulseIn(sensorOut, LOW);
  Serial.print(greenFrequency);
  udpClient.print(greenFrequency);
  udpClient.print(",");

  // Setting BLUE (B) filtered photodiodes to be read
  digitalWrite(S2,LOW);
  digitalWrite(S3,HIGH);
  
  // Reading the output frequency
  blueFrequency = pulseIn(sensorOut, LOW);
  Serial.println(blueFrequency);
  udpClient.print(blueFrequency);
  udpClient.endPacket();
  delay(100);
}
