smarthonIoTBit.on_wifi_connect(function (IP_Address, Device_ID) {
    basic.showString(Device_ID)
})
smarthonIoTBit.on_IFTTT_conn(function (Status, Error_code) {
    basic.showIcon(IconNames.Happy)
})
input.onButtonPressed(Button.A, function () {
    if (smarthonIoTBit.is_wifi_connect()) {
        smarthonIoTBit.sendThingspeak(
        "CQZ89FEYBJ9CAQ9M",
        1
        )
    }
})
smarthonIoTBit.smarthon_iot_bit_on_NTP_Received(function (Year, Month, Day, Hour, Minute, Second) {
    basic.showString("" + Year + "," + Month + "," + Day + "|" + Hour + ":" + Minute + ":" + Second)
})
smarthonIoTBit.smarthon_iot_bit_on_WAN_remote(function (WAN_Command) {
    basic.showString(WAN_Command)
})
smarthonIoTBit.smarthon_iot_bit_on_thingspeak_conn(function (Status, Error_code) {
    basic.showIcon(IconNames.Yes)
})
input.onButtonPressed(Button.AB, function () {
    smarthonIoTBit.smarthon_iot_bit_getNTP(smarthonIoTBit.CityList.HongKong)
})
input.onButtonPressed(Button.B, function () {
    if (smarthonIoTBit.smarthon_iot_bit_is_wifi_connect()) {
        smarthonIoTBit.smarthon_iot_bit_sendIFTTT(
        "cEiZt5Okq11jhgIRlYm6pF",
        "hi"
        )
    }
})
smarthonIoTBit.smarthon_iot_bit_initializeWifi(SerialPin.P16, SerialPin.P8)
smarthonIoTBit.smarthon_iot_bit_setWifi("smarthon", "12345678")
