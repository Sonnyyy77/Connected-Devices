const int trigPin = 9;
const int echoPin = 10;

void setup() {
  // set the modes for the trigger pin and echo pin:
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
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
}