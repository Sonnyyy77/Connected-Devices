#include <Arduino_LSM6DS3.h>
#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>

WiFiClient wifi;
MqttClient mqtt(wifi);

//WiFi network info: ssid and password
const char wifi_ssid[] = "sandbox370";
const char wifi_pass[] = "+s0a+s03!2gether?";
// const char wifi_ssid[] = "Verizon_HZWY66";
// const char wifi_pass[] = "obtuse9-aye-dub";

//MQTT broker info: url and port (1883 default for MQTT)
const char broker[] = "theyonetwork.cloud.shiftr.io";
const int port = 1883;

//if needed: broker authentication credentials
const char mqtt_user[] = "theyonetwork";
const char mqtt_pass[] = "ConnDevSP24";

//the topic this device will publish messages to
const char pubTopic[] = "DirectionDetector";

//will message
const char willTopic[] = "DirectionDetector/status";
const String willPayload = "offline";

float x, y, z;
int degreesX = 0;
int degreesY = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    WiFi.begin(wifi_ssid, wifi_pass);
    delay(1000);
  }
  Serial.println("\nWiFi connected!");

  //give your device any name, to use for identification
  mqtt.setId("Sonny's Arduino");

  //set mqtt credentials, if needed
  mqtt.setUsernamePassword(mqtt_user, mqtt_pass);

  // set a will message, used by the broker when the connection dies unexpectedly
  // you must know the size of the message beforehand, and it must be set before connecting
  bool willRetain = true;
  int willQos = 1;

  mqtt.beginWill(willTopic, willPayload.length(), willRetain, willQos);
  mqtt.print(willPayload);
  mqtt.endWill();

  if (!mqtt.connect(broker, port)) {
    //error codes
    //  -1: credentials rejected
    //  -2: can't connect to broker
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqtt.connectError());
    while (true) {}; //do nothing forever
  } else Serial.println("MQTT connected.");

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }

  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println(" Hz");

}

const int sendInterval = 1000;

void loop() {

  //****** 2.0
  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

  if(x > 0.1){
    x = 100*x;
    degreesX = map(x, 0, 97, 0, 90);
    // Serial.println("Tilting Up");
    mqtt.beginMessage(pubTopic);
    mqtt.print("A");
    mqtt.print(degreesX);
    // mqtt.println("  degrees");
    // Collision front
    mqtt.endMessage();
    delay(500);
  }

  if(x < -0.1){
    x = 100*x;
    degreesX = map(x, 0, -100, 0, 90);
    // Serial.println("Tilting Down");
    mqtt.beginMessage(pubTopic);
    mqtt.print("B");
    mqtt.print(degreesX);
    // mqtt.println("  degrees");
    // Collision back
    mqtt.endMessage();
    delay(500);
    }

  if(y > 0.1){
    y = 100*y;
    degreesY = map(y, 0, 97, 0, 90);
    // Serial.println("Tilting Left");
    mqtt.beginMessage(pubTopic);
    mqtt.print("C");
    mqtt.print(degreesY);
    // mqtt.println("  degrees");
    // Collision right
    mqtt.endMessage();
    delay(500);
    }

  if(y < -0.1){
    y = 100*y;
    degreesY = map(y, 0, -100, 0, 90);
    // Serial.println("Tilting Right");
    mqtt.beginMessage(pubTopic);
    mqtt.print("D");
    mqtt.print(degreesY);
    // mqtt.println("  degrees");
    //Collision left
    mqtt.endMessage();
    delay(500);
    }

  }

  //****** 1.0
  // // put your main code here, to run repeatedly:
  // if (IMU.gyroscopeAvailable()) {
  //   IMU.readGyroscope(x, y, z);
  // }
  // if (millis() % sendInterval < 10) {

  //   mqtt.beginMessage(pubTopic);

  //   if(y > plusThreshold){
  //     mqtt.print("1");
  //     // Collision front
  //   }

  //   if(y < minusThreshold){
  //     mqtt.print("2");
  //     // Collision back
  //   }

  //   if(x < minusThreshold){
  //     mqtt.print("3");
  //     // Collision right
  //   }

  //   if(x > plusThreshold){
  //     mqtt.print("4");
  //     //Collision left
  //   }

  //   mqtt.endMessage();
  //   delay(10);

  // }
  

}
