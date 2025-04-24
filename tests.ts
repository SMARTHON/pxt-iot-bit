WiFiIoT.on_wifi_connect(function (IP_Address, Device_ID) {
    basic.showString(Device_ID)
})
WiFiIoT.on_IFTTT_conn(function (Status, Error_code) {
    basic.showIcon(IconNames.Happy)
})
input.onButtonPressed(Button.A, function () {
    if (WiFiIoT.is_wifi_connect()) {
        WiFiIoT.sendThingspeak(
        "CQZ89FEYBJ9CAQ9M",
        1
        )
    }
})
WiFiIoT.on_NTP_Received(function (Year, Month, Day, Hour, Minute, Second) {
    basic.showString("" + Year + "," + Month + "," + Day + "|" + Hour + ":" + Minute + ":" + Second)
})
WiFiIoT.on_WAN_remote(function (WAN_Command) {
    basic.showString(WAN_Command)
})
WiFiIoT.on_thingspeak_conn(function (Status, Error_code) {
    basic.showIcon(IconNames.Yes)
})
input.onButtonPressed(Button.AB, function () {
    WiFiIoT.getNTP(WiFiIoT.CityList.HongKong)
})
input.onButtonPressed(Button.B, function () {
    if (WiFiIoT.is_wifi_connect()) {
        WiFiIoT.sendIFTTT(
        "cEiZt5Okq11jhgIRlYm6pF",
        "hi"
        )
    }
})
WiFiIoT.initializeWifi(SerialPin.P16, SerialPin.P8)
WiFiIoT.setWifi("smarthon", "12345678")
