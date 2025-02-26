#include <WiFiNINA.h>

WiFiClient client;

const char server[] = "10.23.10.78"; //local IP address of receiver device goes here
const int portNum = 7070; //desired port # goes here. Make sure the receiver is listening on the same port!

//be sure to remove WiFi network details before uploading this code!
const char WIFI_SSID[] = "sandbox370"; //WiFi network name goes here //"Verizon_HZWY66"
const char WIFI_PASS[] = " "; //WiFi password goes here //"obtuse9-aye-dub"

const int trigPin = 9;
const int echoPin = 10;

void setup() {
  // set the modes for the trigger pin and echo pin:
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
  //retry connection until WiFi is connected successfully
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    // Attempt connection to WPA/WPA2 network.
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    delay(3000);
  }
  Serial.println("connected!");
}

void loop() {
 //connect to client if disconnected, or send TCP message if conected
  if (!client.connected()) {
    Serial.println("connecting");
    client.connect(server, portNum);
    delay(1000);
    return;
  } else {
    // take the trigger pin low to start a pulse:
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    // listen for a pulse on the echo pin:
    long duration = pulseIn(echoPin, HIGH);
    int distance = (duration * 0.0343) / 2;
    Serial.print("Distance: ");
    Serial.println(distance);
    delay(200);

    //sending message to node
    Serial.print("sending TCP message");
    client.println(distance);
    delay(200);
    }
}