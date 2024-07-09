# Smarthon-iotbit
A MakeCode extension for Smarthon IoT:bit

## About Smarthon IoT:bit
Smarthon IoT:bit enables micro:bit to connect Wi-Fi and allows users to record sensor data on cloud platforms like IFTTT and ThingSpeak. Besides, the great feature is supporting WAN control.<BR>The users can connect up to 12 sensors and actuators. Let's upgrade your micro:bit and ready for the IoT world!<P>
You may check the product information by https://www.smarthon.cc/product-page/iot-bit-iot-expansion-board-for-micro-bit <p>
You may check the Read the Docs about Smarthon IoT:bit here:
https://smarthon-docs-en.readthedocs.io/en/latest/IoTbit/index.html

## Function Tutorial 

### 1. Initialize the Smarthon IoT:bit
Configurate the connection between IoT:bit and Micro:bit via Serial protocol<P>
Default setting for Connection pins on IoT:bit is P16(TX) and P8(RX)<P>
                                                                       
```block
WiFiIoT.initializeWifi(SerialPin.P16, SerialPin.P8)
```
### 2. Connect to Wifi Station
Connect to the specific Wifi Station by SSID and Password<P>
In example,<BR>
SSID:Smarthon<BR>
Password:12345678<BR>
```block
WiFiIoT.setWifi("Smarthon", "12345678")
```

### 3. Upload data to Thingspeak
Upload the value data to the specific Thingspeak channel.<P>
Required to input vaild channel API key. Allow sending up to 8 value field at the same time.<P>
In example,<BR>
channel API key: abcdefg<BR>
field1 value:100<BR>
field2 value:0<BR>
```block
WiFiIoT.sendThingspeak(
"abcdefg",
100,
0
)
```

### 4. Upload IFTTT Request 
Summit a request to IFTTT Webhooks Service.<P>
Required to input vaild API key provided by webhooks. <P>
In example,<BR>
API key: abcdefg<BR>
event:email<BR>
value:10<BR>

```block
WiFiIoT.sendIFTTT(
"abcdefg",
"email",
10
)
```

### 5. WiFi WAN Control
The IoT:bit can recevied command via internet<BR>
Before control the IoT:bit, you need an ID to identify the IoT:bit on the internet.<P>
Use the getDeviceID to show the ID<BR>
```block
basic.showString(WiFiIoT.getDeviceID())
```
You are required to set up the callback function to get the command message when the the command was received.<BR>
The WAN_Command variable can be access and use to make decision.<BR>

```block
WiFiIoT.on_WAN_remote(function (WAN_Command) {
	
})
```

### 6. Channel communication
Connect to a specifc channel to prepare for listen other user's message<P>
  
```block
WiFiIoT.wifi_listen_channel("abc")
```

To listen the message, you are required to set up this callback block to get the variable<P>
  
```block
WiFiIoT.on_wifi_received(function (Channel, receivedMessage) {
})
```

Sending the message to other user in the specific channel<P>
  
```block
WiFiIoT.wifi_send_message("abc", "hi")
```


### 7. NTP time
Get the NTP time from the internet<P>
  
```block
WiFiIoT.getNTP(WiFiIoT.CityList.HongKong)
```

To make use of the time, you are required to set up this callback block to get the variable <P>
  
```block
WiFiIoT.on_NTP_Received(function (Year, Month, Day, Hour, Minute, Second) {
})
```



## License

MIT

## Supported targets

* for PXT/calliope
* for PXT/microbit

(The metadata above is needed for package search.)
