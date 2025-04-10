// tests go here; this will not be compiled when this package is used as a library

/* 
Test procedure:
1. Once the micro:bit is connected to WiFi, it will show your device id.
2. When the micro:bit received a WAN_command, it will display the command received.
3. Press micro:bit button A. A tick icon should be displayed and value 1 should be sent to ThingSpeak.
4. Press micro:bit button B. A happy face should be displayed and the command "hi" should be sent to IFTTT.
5. Press micro:bit button A+B. A string showing the current time at Hong Kong should be displayed.
*/

// Connect to wifi.
// Show device id if connected. 
wiFiIoT.on_wifi_connect(function (IP_Address, Device_ID) {
    basic.showString(Device_ID)
})

// Connect to IFTTT.
// Show happy face if connected. 
wiFiIoT.on_IFTTT_conn(function (Status, Error_code) {
    basic.showIcon(IconNames.Happy)
})

// Send value to IFTTT.
// When button A is pressed and wifi is connected, send 1 to the IFTTT. 
input.onButtonPressed(Button.A, function () {
    if (wiFiIoT.is_wifi_connect()) {
        wiFiIoT.sendThingspeak(
        "CQZ89FEYBJ9CAQ9M",
        1
        )
    }
})

// Connect to NTP.
// Show current year, month, day, hour, minute, second. 
wiFiIoT.on_NTP_Received(function (Year, Month, Day, Hour, Minute, Second) {
    basic.showString("" + Year + "," + Month + "," + Day + "|" + Hour + ":" + Minute + ":" + Second)
})

// Receive WAN command.
// Show WAN commmand if connected. 
wiFiIoT.on_WAN_remote(function (WAN_Command) {
    basic.showString(WAN_Command)
})

// Connect to ThingSpeak.
// Show tick icon when it is connected to ThingSpeak.
wiFiIoT.on_thingspeak_conn(function (Status, Error_code) {
    basic.showIcon(IconNames.Yes)
})

// When button A+B is pressed.
// Get NTP timezone of Hong Kong.
input.onButtonPressed(Button.AB, function () {
    wiFiIoT.getNTP(wiFiIoT.CityList.HongKong)
})

// When button B is pressed.
// Send IFTTT "hi".
input.onButtonPressed(Button.B, function () {
    if (wiFiIoT.is_wifi_connect()) {
        wiFiIoT.sendIFTTT(
        "cEiZt5Okq11jhgIRlYm6pF",
        "hi"
        )
    }
})

// Initialize wifi.
wiFiIoT.initializeWifi(SerialPin.P16, SerialPin.P8)
wiFiIoT.setWifi("smarthon", "12345678")
