#include <ArduinoHttpClient.h>
#include <Arduino_LSM6DS3.h>
#include <WiFiNINA.h>
#include "arduino_secrets.h"

///////please enter your sensitive data in the Secret tab/arduino_secrets.h
/////// WiFi Settings ///////
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

char serverAddress[] = "147.182.142.189";  //server IP address
int port = 1880; //use HTTP default port 80, or use 1880 for node-red

float x, y, z;
String message;

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);
int status = WL_IDLE_STATUS;

void setup() {
  Serial.begin(9600);

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");

    while (1);
  }

  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println(" Hz");

  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);                   

    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);
    delay(1000);
  }

  Serial.println("WiFi connected.");

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void loop() {
  Serial.println("making POST request");

    if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);
    
    if(x > 0.1){
      message = "TURNING DOWN";
    }
  if(x < -0.1){
    message = "TURNING UP";
    }
  if(y > 0.1){
    message = "TURNING LEFT";
    }
  if(y < -0.1){
    message = "TURNING RIGHT";
    }
    
    delay(100);
  }

  //if sending raw text:
 String contentType = "text/plain";
//  String postData = "hello from Arduino"; //to send a string, or
//  String postData = String(millis()); //to send a number
 String postData = message;
 delay(300);

  //if sending a formatted JSON object (useful for updating multiple values)
  // String contentType = "application/json"; //if sending a formatted JSON object
  // String postData = "{\"deviceID\": 1, \"value\": VALUE}"; //use single-quotes inside a JSON object literal
  // postData.replace("VALUE", String(millis())); //replace millis() with your own sensor data
  
  char endpoint[] = "/data?deviceID=SonnysArduino";
  client.post(endpoint, contentType, postData); //use client.put() to make a put request

  // read the status code and body of the response
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);
}