# define PAYMENT_OK_LED  13
# define PAYMENT_NOT_OK_LED  12
# define SERVO_PORT 9

# define ETHERNET_ENABLED true

#include <Servo.h>
#include <Ethernet.h>
#include <YalerEthernetServer.h>

Servo vm;
int pos = 0; 
bool isPaymentDone = false;
YalerEthernetServer server("try.yaler.io", 80, "gsiot-egp6-3b0j");

// mac address of the shield
byte mac[] = { 0x90, 0xa2, 0xda, 0x0d, 0xd5, 0x2c };

void ethernetSetup(){
  Serial.begin(9600);
  Serial.println("Acquiring IP address...");
  if (Ethernet.begin(mac) == 0) {
    Serial.println("DHCP failed.");
  } else {
    Serial.println(Ethernet.localIP());
    server.begin();
  }
}
void setup() {
  pinMode(PAYMENT_OK_LED,OUTPUT);
  pinMode(PAYMENT_NOT_OK_LED,OUTPUT);
#if ETHERNET_ENABLED
  ethernetSetup();
#endif
  vm.attach(SERVO_PORT);
}
void paymentDone(){
  digitalWrite(PAYMENT_OK_LED, HIGH);
  digitalWrite(PAYMENT_NOT_OK_LED, LOW);
  for (pos = 0; pos <= 180; pos += 1) {
    vm.write(pos);             
    delay(15);                       
  }
  for (pos = 180; pos >= 0; pos -= 1) { 
    vm.write(pos);              
    delay(15);                       
  }
  
}

void loop() {
#if ETHERNET_ENABLED
  waitForMessage();
#endif
}

void waitForMessage(){
    EthernetClient client = server.available();
    if (client && client.connected()) {
      client.find("\r\n\r\n"); // Consume incoming request
      //sendResponse(client);
      delay(1); // Give the Web browser time to receive the data
      client.stop();
      paymentDone();
    }  
}

void sendResponse(EthernetClient client) {
  client.print("HTTP/1.1 200 OK\r\n");
  client.print("Connection: close\r\n");
  client.print("Content-Length: 5\r\n");
  client.print("\r\n");
  client.print("AMK");
} 
