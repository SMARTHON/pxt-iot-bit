/**
 * Sensors blocks
 *  IoT orientated expansion module for Micro:bit.
 */
//% weight=101 color=#333300  icon="\uf1eb" block="IoT:bit"
namespace smarthonIoTBit {
    let flag = true;
    //let httpReturnArray: string[] = []
    let httpReturnString: string = ""
    let httpErrorCode = ""
    let oledFlag = false;
    let oledRowCount = 0;
    let tempCmd = ""
    let lanCmd = ""
    let wanCmd = ""
    let wanCmdValue = ""
    let wifiCmd = ""
    let lanConnected = false
    let wanConnected = false
    let wifiRemote = false
    let wifiConnected = "0"
    let ipFlag = false
    let errorFlag = false
    let myChannel = ""
    let version = ""
    let deviceId = ""
    let wifiTriedNum = 0
    let ip = ""
    let arrayKeys: Array<string> = []
    let arrayValues: Array<string> = []

    let connectingFlag = false
    let disconnectErrorCode = ""
    let thingspeakError = ""
    let ntpReceive: (year: number, month: number, day: number, hour: number, minute: number, second: number) => void = null;
    let wifiRemoteConn: (channel: string, wifiMessage: string) => void = null;
    let wifiRemoteConnValue: (channel: string, wifiMessage: string, value: number) => void = null;
    let wifiConn: (ip: string, id: string) => void = null;
    let wifiDisConn: (error: string) => void = null;
    let lanRemoteConn: (lanCommand: string) => void = null;
    let wanControlConn: (deviceId: string, errorCode: string) => void = null;
    let wanRemoteConn: (wanCommand: string) => void = null;
    let wanRemoteConnValue: (wanCommand: string, value: number) => void;
    let thingspeakConn: (status: string, errorCode: string) => void = null;
    let iftttConn: (status: string, errorCode: string) => void = null;
    let wifiRemoteCreate: (channel: string, errorCode: string) => void = null;
    let wifiSender: (status: string, errorCode: string) => void = null;
    let httpReceived: (errorCode: string, data: string) => void = null;
    let httpReceiveEnd = true;
    let otaReceived: (percentageValue: string) => void = null;
    let otaFinished: () => void = null;
    let otaFailed: (message: string) => void = null;

    export enum HttpMethod {
        //% block="GET"
        GET,
        //% block="POST"
        POST
    }

    export enum Esp360ServoDir {
        //% block="clockwise"
        Clockwise,
        //% block="anti-clockwise"
        Anticlockwise
    }

    export enum CityList {
        //% block="HongKong (UTC+8)"
        HongKong = "8",
        //% block="Amsterdam (UTC+1)"
        Amsterdam = "1",
        //% block="Bangkok (UTC+7)"
        Bangkok = "7",
        //% block="Beijing (UTC+8)"
        Beijing = "8",
        //% block="Chicago (UTC-6)"
        Chicago = "-6",
        //% block="City of Brussels (UTC+1)"
        CityOfBrussels = "1",
        //% block="Dubai (UTC+4)"
        Dubai = "4",
        //% block="Frankfurt (UTC+1)"
        Frankfurt = "1",
        //% block="Jakarta (UTC+7)"
        Jakarta = "7",
        //% block="Johannesburg (UTC+2)"
        Johannesburg = "2",
        //% block="Kuala Lumpur (UTC+8)"
        KualaLumpur = "8",
        //% block="London (UTC+0)"
        London = "0",
        //% block="Los Angeles (UTC-8)"
        LosAngeles = "-8",
        //% block="Madrid (UTC+1)"
        Madrid = "1",
        //% block="Mexico City (UTC-6)"
        MexicoCity = "-6",
        //% block="Milano (UTC+1)"
        Milano = "1",
        //% block="Moscow (UTC+3)"
        Moscow = "3",
        //% block="Mumbai (UTC+5:30)"
        Mumbai = "5.5",
        //% block="Paris (UTC+1)"
        Paris = "1",
        //% block="São Paulo (UTC-3)"
        SaoPaulo = "-3",
        //% block="Seoul (UTC+9)"
        Seoul = "9",
        //% block="Shanghai (UTC+8)"
        Shanghai = "8",
        //% block="Singapore (UTC+8)"
        Singapore = "8",
        //% block="Sydney (UTC+10)"
        Sydney = "10",
        //% block="Taipei (UTC+8)"
        Taipei = "8",
        //% block="Tokyo (UTC+9)"
        Tokyo = "9",
        //% block="Toronto (UTC-5)"
        Toronto = "-5",
        //% block="Warsaw (UTC+1)"
        Warsaw = "1",
    }

    // -------------- 1. Initialization ----------------
    /**
     * Init the iotbit
     * @param txPin describe parameter here, eg: SerialPin.P16
     * @param rxPin describe parameter here, eg: SerialPin.P8
     */

    //%blockId=smarthon_iot_bit_initialize_wifi
    //%block="initialize IoT:bit TX %txPin RX %rxPin"
    //% weight=140

    export function initializeWifi(txPin: SerialPin, rxPin: SerialPin): void {
        serial.redirect(txPin, rxPin, BaudRate.BaudRate115200);
        serial.setTxBufferSize(128)
        serial.setRxBufferSize(128)

        //add  1s for UART ready to support Micro:bit V2
        basic.pause(1000)
        ///////////////////////////////////////////////////

        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            tempCmd = serial.readLine()
            //OLED.writeStringNewLine(tempCmd)
            let tempDeleteFirstCharacter = ""

            if (tempCmd.charAt(0).compare("W") == 0) { //start with W
                let spacePos = tempCmd.indexOf(" ")
                let label = tempCmd.substr(1, spacePos - 1)
                if (label == "0") { //W0 - Initialize
                    let response = tempCmd.slice(1, tempCmd.length).split(' ')
                    version = response[1]
                    deviceId = response[2]
                    /*
                    if(oledFlag==true&&connectingFlag==false){
                    OLED.clear()
                    OLED.writeStringNewLine("Initialize OK")
                    OLED.writeStringNewLine("Smarthon IoT:Bit")
                    OLED.writeStringNewLine("Version:"+version)
                    }
                    */
                }
                else if (label == "1") { //W1 - Connect WIFI
                    let response = tempCmd.slice(1, tempCmd.length).split(' ')
                    if (response[1] == "0") {

                        wifiConnected = "0"
                        //wifiDisConn()
                        if (response[2] != null) {

                            if (oledFlag == true) {
                                connectingFlag = false
                                //OLED.newLine()
                                //OLED.writeStringNewLine("Timeout")
                            }
                        }
                    }
                    else if (response[1] == "1") {
                        wifiConnected = "1"
                        if (oledFlag == true && connectingFlag == false) {
                            connectingFlag = true
                            //OLED.writeString("Connecting.")
                        } else if (oledFlag == true && connectingFlag == true) {
                            //OLED.writeString(".")
                        }

                    }
                    else if (response[1] == "2") {
                        wifiConnected = "2"
                        if (response[2] != null) {
                            ip = response[2]
                            //wifiConn()

                            if (oledFlag == true) {
                                connectingFlag = false
                                //OLED.newLine()

                                //OLED.writeStringNewLine("IP:"+ip)
                            }

                            startWebServerWan()
                            basic.pause(500)
                            if (wifiConn && wifiConnected == "2") wifiConn(ip, deviceId)
                        }
                    }
                    else if (response[1] == "3") {
                        wifiConnected = "3"
                        if (response[2] != null) {

                            disconnectErrorCode = response[2]
                            if (wifiDisConn && wifiConnected == "3") wifiDisConn(disconnectErrorCode)
                            if (oledFlag == true && connectingFlag == false) {
                                //OLED.writeStringNewLine("error:"+disconnectErrorCode)
                            }
                        }
                    }
                }
                else if (label == "2") { //W2 Thingspeak
                    let response = tempCmd.slice(1, tempCmd.length).split(' ')
                    if (thingspeakConn != null && response[1] == "0") {
                        if (oledFlag == true) {
                            //OLED.writeStringNewLine("Thingspeak uploaded")
                        }
                        thingspeakConn("OK", "0")
                    }
                    else if (response[1] == "1") {
                        if (thingspeakConn != null && response[2] != null) {
                            thingspeakError = response[2]
                            thingspeakConn("FAIL", thingspeakError)
                        }
                        if (oledFlag == true) {
                            //OLED.writeStringNewLine("Thingspeak upload")
                            //OLED.writeStringNewLine("fail code:"+thingspeakError)
                        }
                    }
                }
                else if (label == "3") { //W3 IFTTT
                    let response = tempCmd.slice(1, tempCmd.length).split(' ')
                    if (iftttConn != null && response[1] == "0") {
                        iftttConn("OK", "0")
                    }
                    else if (response[1] == "1") {
                        if (iftttConn != null && response[2] != null) {
                            iftttConn("FAIL", response[2])
                        }
                    }
                }
                else if (label == "4") { //W4 WAN
                    let response = tempCmd.slice(1, tempCmd.length).split(' ')
                    if (response[1] == "0") {    //WAN start listen
                        if (wanControlConn != null) {
                            //wanControlConn(response[2],"0")    //return the channel ID
                        }
                    }
                    else if (response[1] == "1") {
                        if (wanControlConn != null) {
                            //wanControlConn(response[2],response[3])    //return the error code
                        }
                    }
                    else if (response[1] == "2") {//return message  

                        if (response[2].includes("$")) {       //with value
                            let pos = response[2].indexOf("$")
                            if (wanRemoteConnValue != null) {
                                wanRemoteConnValue(response[2].substr(0, pos), parseInt(response[2].substr(pos + 1, response[2].length)))
                            }
                        }
                        else {           //without value
                            if (wanRemoteConn != null) {
                                wanRemoteConn(response[2])
                            }
                        }
                    }
                }
                else if (label == "5") {  //W5 WIFI control
                    let response = tempCmd.slice(1, tempCmd.length).split(' ')
                    if (response[1] == "0") {    //WIFI control start listen
                        if (wifiRemoteCreate != null && response[2] != null) {
                            wifiRemoteCreate(response[2], "0")
                        }
                    } else if (response[1] == "1") { //WIFI control listen fail
                        if (wifiRemoteCreate != null && response[2] != null && response[3] != null) { //W5 1 ID ERROR
                            wifiRemoteCreate(response[2], response[3])
                        }
                    } else if (response[1] == "2") { //WIFI control get Message
                        if (response[3].includes("$")) {       //with value
                            let pos = response[3].indexOf("$")
                            if (wifiRemoteConnValue != null) {
                                wifiRemoteConnValue(response[2], response[3].substr(0, pos), parseInt(response[3].substr(pos + 1, response[3].length)))
                            }
                        }
                        else {           //without value
                            if (wifiRemoteConn != null) {
                                wifiRemoteConn(response[2], response[3])
                            }
                        }
                    }
                }
                else if (label == "6") {//WiFi Sender

                    let response = tempCmd.slice(1, tempCmd.length).split(' ')
                    if (wifiSender != null && response[1] == "0") {
                        wifiSender("OK", "0")
                    } else if (wifiSender != null && response[1] == "1") {
                        wifiSender("Fail", response[2])
                    }
                }
                else if (label == "7") {//NTP

                    let response = tempCmd.slice(1, tempCmd.length).split(' ')
                    if (ntpReceive != null && response[3] != null) {
                        ntpReceive(parseInt(response[1]), parseInt(response[2]), parseInt(response[3]), parseInt(response[4]), parseInt(response[5]), parseInt(response[6]))
                    }
                }
                else if (label == "8") {//HTTP
                    //get the string include end_Indicator and msg char, e.g "0|a" "1|e"
                    let msg = tempCmd.slice(tempCmd.indexOf(" ") + 1, tempCmd.length)
                    //split the end_Indicator and msg char
                    let response = msg.split('|')
                    if (httpReceived != null && response[1] != null) { //skip if not use
                        if (response[0] == "2") {
                            httpErrorCode = response[1]
                        }
                        if (response[0] == "0") { //not the end of msg
                            if (httpReceiveEnd == true) { //if is start of msg, reset the msg string
                                httpReturnString = ""; //reset msg string
                            }
                            httpReceiveEnd = false; // not the end of receive msg
                            httpReturnString = httpReturnString + response[1] //build the msg string
                        }
                        if (response[0] == "1") {   // it is the end of msg
                            httpReturnString = httpReturnString + response[1] //build the msg string
                            httpReceiveEnd = true;    //indicate it is end
                            httpReceived(httpErrorCode, httpReturnString) //call the handler to return the msg
                        }
                    }
                }
                else if (label == "9") {     //OTA
                    let response = tempCmd.slice(1, tempCmd.length).split(' ')
                    if (otaReceived != null && response[1] == "1") {
                        otaReceived(response[2])
                    } else if (otaFinished != null && response[1] == "2") {
                        otaFinished()
                    } else if (otaFailed != null && response[1] == "3") {
                        otaFailed(response[2])
                    }
                }
            }
        })
        basic.pause(500)
        serial.writeLine("(AT+W0)")
        basic.pause(2000)
    }

    // -------------- 2. WiFi ----------------
    /**
     * Set wifi with ssid and pwd
     * @param ssid describe parameter here,
     * @param pwd describe parameter here,
     */

    //% blockId=smarthon_iot_bit_set_wifi
    //% block="set WiFi to ssid %ssid| pwd %pwd"   
    //% weight=135
    export function setWifi(ssid: string, pwd: string): void {
        serial.writeLine("(AT+wifi?ssid=" + ssid + "&pwd=" + pwd + ")");
        if (oledFlag == true && connectingFlag == false) {
            //OLED.clear()
            //OLED.writeStringNewLine("WIFI Connecting...")
            //OLED.writeStringNewLine("SSID:"+ssid)
            //OLED.writeStringNewLine("PWD:"+pwd)
        }
    }

    /**
     * On wifi connected
     * @param handler Wifi connected callback
     * @param ipAddress IP Address;
     * @param deviceId device ID; 
     */

    //% blockId=smarthon_iot_bit_on_wifi_connect
    //% block="on WiFi connected"   
    //% weight=133
    //% draggableParameters=reporter
    export function onWifiConnect(handler: (ipAddress: string, deviceId: string) => void): void {
        wifiConn = handler;
    }

    /**
     * On wifi disconnected
     * @param handler Wifi disconnected callback
     * @param errorCode error code;
     */

    //% blockId=smarthon_iot_bit_on_wifi_disconnect
    //% block="on WiFi disconnected"   
    //% weight=132
    //% draggableParameters=reporter
    export function onWifiDisconnect(handler: (errorCode: string) => void): void {
        wifiDisConn = handler;
    }

    /**
     * Is the wifi connected
     */

    //% blockId=smarthon_iot_bit_is_wifi_connect
    //% block="WiFi connected?"   
    //% weight=131
    export function isWifiConnect(): boolean {
        if (wifiConnected == "2")
            return true
        else return false
    }

    // -------------- 3. Cloud ----------------
    //%subcategory="IoT Services"

    /**
     * Send ThingSpeak key
     * @param key ThingSpeak key;
     * @param field1 value of field1;
     * @param field2 value of field2;
     * @param field3 value of field3;
     * @param field4 value of field4;
     * @param field5 value of field5;
     * @param field6 value of field6;
     * @param field7 value of field7;
     * @param field8 value of field8;
     */

    //% blockId=smarthon_iot_bit_set_thingspeak
    //% block="send ThingSpeak key* %key|field1 value%field1||field2 value%field2|field3 value%field3|field4 value%field4|field5 value%field5|field6 value%field6|field7 value%field7|field8 value%field8"
    //% weight=130 group="ThingSpeak"
    //% expandableArgumentMode="enabled"
    export function sendThingspeak(key: string, field1: number = null, field2: number = null, field3: number = null, field4: number = null, field5: number = null, field6: number = null, field7: number = null, field8: number = null): void {
        let command = "(AT+thingspeak?key=";
        if (key == "") { return }
        else { command = command + key }
        if (field1 != null) { command = command + "&field1=" + field1 }
        if (field2 != null) { command = command + "&field2=" + field2 }
        if (field3 != null) { command = command + "&field3=" + field3 }
        if (field4 != null) { command = command + "&field4=" + field4 }
        if (field5 != null) { command = command + "&field5=" + field5 }
        if (field6 != null) { command = command + "&field6=" + field6 }
        if (field7 != null) { command = command + "&field7=" + field7 }
        if (field8 != null) { command = command + "&field8=" + field8 }
        command = command + ")"
        serial.writeLine(command);
    }

    /**
     * Check ThingSpeak status
     * @param handler ThingSpeak uploaded callback
     * @param status connecting status;
     * @param errorCode error code;
     */

    //%subcategory="IoT Services"
    //%connectBlockId=smarthon_iot_bit_Thingspeak_connect
    //%block="on ThingSpeak uploaded"
    //% weight=129 group="ThingSpeak"
    //% draggableParameters=reporter
    //% blockGap=7
    export function onThingspeakConn(handler: (status: string, errorCode: string) => void): void {
        thingspeakConn = handler;
    }

    /**
     * Send IFTTT key
     * @param key IFTTT key;
     * @param eventname name of event;
     * @param value1 value of the event; 
     * @param value2 value of the event; 
     * @param value3 value of the event; 
     */

    //%subcategory="IoT Services"
    //% blockId=smarthon_iot_bit_set_ifttt
    //% block="send IFTTT key* %key|event_name* %event||value1 %value1|value2 %value2|value3 %value3"
    //% weight=125
    //% group="IFTTT"
    //% expandableArgumentMode="enabled"    
    export function sendIFTTT(key: string, eventname: string, value1: number = null, value2: number = null, value3: number = null): void {
        if (value1 != null && value2 != null && value3 != null) {
            serial.writeLine("(AT+ifttt?key=" + key + "&event=" + eventname + "&value1=" + value1 + "&value2=" + value2 + "&value3=" + value3 + ")");
        }
        else if (value3 == null && value2 != null && value1 != null) {
            serial.writeLine("(AT+ifttt?key=" + key + "&event=" + eventname + "&value1=" + value1 + "&value2=" + value2 + ")");
        }
        else if (value3 == null && value2 == null && value1 != null) {
            serial.writeLine("(AT+ifttt?key=" + key + "&event=" + eventname + "&value1=" + value1 + ")");
        }
        else if (value3 == null && value2 == null && value1 == null) {
            serial.writeLine("(AT+ifttt?key=" + key + "&event=" + eventname + ")");
        }
    }

    /**
     * Check IFTTT status
     * @param handler IFTTT uploaded callback
     * @param status connecting status;
     * @param errorCode error code;
     */

    //%subcategory="IoT Services"
    //%blockId=smarthon_iot_bit_IFTTT_connect
    //%block="on IFTTT uploaded"
    //% weight=124     group="IFTTT"
    //% draggableParameters=reporter
    //% blockGap=7
    export function onIFTTTConn(handler: (status: string, errorCode: string) => void): void {
        iftttConn = handler;
    }

    // -------------- 4. Others ----------------


    /**
     * Use IoT:bit to send the HTTP request
     * @param method HTTPmethod;
     * @param url website link;
     * @param body string in body;
     */

    //%subcategory="IoT Services"
    //%blockId=smarthon_iot_bit_generic_http
    //% block="send HTTP request |method %method|url:%url|body:%body"
    //% weight=115     group="HTTP" 
    //% inlineInputMode=external
    export function sendGenericHttp(method: HttpMethod, url: string, body: string): void {
        //httpReturnArray = []
        let temp = ""
        switch (method) {
            case HttpMethod.GET:
                temp = "GET"
                break
            case HttpMethod.POST:
                temp = "POST"
                break
        }
        serial.writeLine("(AT+http?method=" + temp + "&url=" + url + "&header=" + "&body=" + body + ")");
    }

    /**
     * Check HTTP status
     * @param handler HTTP uploaded callback
     * @param httpStatusCode connecting status;
     * @param data data received;
     */

    //%subcategory="IoT Services"
    //% blockId=smarthon_iot_bit_http_receive
    //% block="on HTTP received"     group="HTTP"
    //% weight=108 draggableParameters=reporter
    //% blockGap=20

    export function onHTTPRecevid(handler: (httpStatusCode: string, data: string) => void): void {
        httpReceived = handler;
    }

    /**
     * This function can extract the value of specific key from a JSON format String
     * @param target Key that looking for
     * @param source Source string that to be extract from
     */
    //%subcategory="IoT Services"
    //%jsonBlockId="smarthon_iot_bit_JSON_extractor"
    //%block="get value of key %target from | JSON string %source"
    //% weight=107 group="HTTP"
    export function getValue(target: string, source: string): string {

        //clear the keys & values array
        arrayKeys = []
        arrayValues = []
        //prase the JSON String to Object
        let jsonObject = JSON.parse(source)
        //Get the count of keys for the For-Loop to run
        let totalKeys = Object.keys(jsonObject).length
        //when target or source is empty, return empty string
        if (!target || !source) {
            return "N/A"
        }
        // Start work on each keys
        for (let i = 0; i < totalKeys; i++) {
            //Push each key from JSON Object to keys array
            arrayKeys.push(Object.keys(jsonObject)[i])
            // Check the corresponding value of the key from Object, 
            // if it is string or number type, push it to value array as normal
            if ((typeof (jsonObject[arrayKeys[arrayKeys.length - 1]]) == "string") || (typeof (jsonObject[arrayKeys[arrayKeys.length - 1]]) == "number")) {
                //push the string or number value to array
                arrayValues.push(jsonObject[arrayKeys[arrayKeys.length - 1]])

            }
            // if the value is a Object type, mostly is next level JSON object
            else if (typeof (jsonObject[arrayKeys[arrayKeys.length - 1]]) == "object") {
                //Use stringify to convert it back to string, allow to return the stringify object to user,
                //User can perform JSON prase function again later, while the source can set as this return string
                arrayValues.push(JSON.stringify(jsonObject[arrayKeys[arrayKeys.length - 1]]))

            }
        }
        //After input all the data, search the target's key index
        let targetIndex = arrayKeys.indexOf(target)
        // targetIndex will return -1 when It can not find the target
        if (targetIndex == -1)
            return "N/A"
        //Return the value of that key
        return arrayValues[targetIndex]
    }

    /**
     * Return generic http string
     */

    //%subcategory="IoT Services"
    //% blockId="smarthon_iot_bit_generic_http_return" 
    //% block="HTTP response (string)"
    //% weight=110     group="HTTP"
    //% blockGap=7
    //% blockHidden=true
    export function getHttpReturn(): string {
        return httpReturnString;
    }

    /** 
    * Select the city in the list to get the locale Time 
     * @param city name of the city; eg:Hong Kong
    */
    //%subcategory="IoT Services"
    //% blockId=smarthon_iot_bit_Call_NTP_city
    //% block="get NTP current time at city %city"   
    //% weight=109
    //% group="Current Time"
    export function getNTP(city: CityList): void {
        //serial.writeLine(city);
        serial.writeLine("(AT+ntp?zone=" + city + ")");
    }

    /** 
    Input the UTC time zone number to get the locale time. 
    @param zone is the string contain SIGN and NUMBER, eg: "+0"
    */
    //%subcategory="IoT Services"
    //% blockId=smarthon_iot_bit_Call_NTP_number
    //% block="get NTP current time at time zone UTC%zone"   
    //% weight=109
    //% group="Current Time"
    export function getNTPNumber(zone: string): void {
        serial.writeLine("(AT+ntp?zone=" + zone + ")");
    }

    /** 
    * Receive NTP message.
    * @param year is the number of year,
    * @param month is the number of month,
    * @param day is the number of day,
    * @param hour is the number of hour,
    * @param minute is the number of minute,
    * @param second is the number of second,
    */
    //%subcategory="IoT Services"
    //% blockId="smarthon_iot_bit_receive_ntp" 
    //% block="on NTP received"     group="Current Time"
    //% weight=108 draggableParameters=reporter
    //% blockGap=7

    export function onNTPReceived(handler: (year: number, month: number, day: number, hour: number, minute: number, second: number) => void): void {
        ntpReceive = handler;
    }

    // -------------- 5. LAN/WAN Repmote ----------------

    /** 
    Start the webserver
    */

    //%subcategory=Control
    //%blockId=smarthon_iot_bit_start_server_WAN
    //%block="start WiFi remote control (WAN)"
    //% weight=80  group="Start the control"
    //% blockHidden=true
    export function startWebServerWan(): void {
        flag = true
        serial.writeLine("(AT+pubnub)")
        wanConnected = true
    }

    /** 
    Get device id
    */
    //%subcategory=Control
    //%blockId=smarthon_iot_bit_get_id
    //%block="device ID"
    //% weight=80
    export function getDeviceId(): string {
        return deviceId
    }

    /**
     * Check WAN command status
     * @param handler WAN command uploaded callback
     * @param deviceId device ID 
     * @param errorCode code of error
     */

    //%subcategory=Control
    //%blockId=smarthon_iot_bit_on_WAN_connected
    //%block="on WAN control connected" 
    //% weight=75 group="Start the control"
    //% blockHidden=true
    //% blockGap=7    draggableParameters=reporter

    export function onWANControlConnected(handler: (deviceId: string, errorCode: string) => void): void {
        wanControlConn = handler;
    }

    /**
     * Receive WAN command status
     * @param handler WAN command received callback
     * @param wanCommand WAN command
     */

    //%subcategory=Control
    //%blockId=smarthon_iot_bit_on_WAN_connect
    //%block="on WiFi received" 
    //% weight=70 group="Get controlled"
    //% draggableParameters=reporter
    export function onWANRemote(handler: (wanCommand: string) => void): void {
        wanRemoteConn = handler;
    }

    /**
     * Receive WAN command and value status
     * @param handler WAN command received callback
     * @param wanCommand WAN command
     * @param value value of the command
     */

    //%subcategory=Control
    //%blockId=smarthon_iot_bit_on_WAN_connect_value
    //%block="on WiFi received" 
    //% weight=65 group="Get controlled"
    //% blockGap=7    draggableParameters=reporter
    export function onWANRemoteValue(handler: (wanCommand: string, value: number) => void): void {
        wanRemoteConnValue = handler;
    }

    // -------------- 7. Wifi Channel ----------------

    /**
     * Join channel after received WiFi
     * @param channel channel name,
     */

    //%subcategory=Channel
    //%blockId=smarthon_iot_bit_wifi_listen_channel
    //%block="WiFi receiver join channel %channel"
    //% weight=20 group="Receiver"
    export function wifiListenChannel(channel: string): void {
        wifiRemote = true
        myChannel = channel
        serial.writeLine("(AT+pubnubreceiver?channel=" + myChannel + ")")
    }

    /**
     * Check received message and channel status
     * @param handler Channel received callback
     * @param channel channel name;
     * @param receivedMessage message received;
     */

    //%subcategory=Channel
    //%blockId=smarthon_iot_bit_on_wifi_receieved
    //%block="on WiFi receiver received"
    //% weight=18 group="Receiver"
    //% draggableParameters=reporter
    export function onWifiReceived(handler: (channel: string, receivedMessage: string) => void): void {
        wifiRemoteConn = handler;
    }

    /**
     * Check received message, value and channel status
     * @param handler Channel received callback
     * @param channel channel name;
     * @param receivedMessage message received;
     * @param value value received;
     */

    //%subcategory=Channel
    //%blockId=smarthon_iot_bit_on_wifi_receieved_value
    //%block="on WiFi receiver received"
    //% weight=17 draggableParameters=reporter group="Receiver"
    export function onWifiReceivedValue(handler: (channel: string, receivedMessage: string, value: number) => void): void {
        wifiRemoteConnValue = handler;
    }

    /**
     * Message sender send message after wifi connected
     * @param channel channel name;
     * @param message message to send;
     */

    //%subcategory=Channel
    //%blockId=smarthon_iot_bit_wifi_send_message
    //%block="WiFi sender send channel %channel message %message"
    //% weight=15
    //% group="Sender"
    export function wifiSendMessage(channel: string, message: string): void {
        myChannel = channel
        serial.writeLine("(AT+pubnubsender?channel=" + myChannel + "&message=" + message + ")")
    }

    /**
     * Message sender send message and value after wifi connected
     * @param channel channel name;
     * @param message message to send;
     * @param value value to send;
     */

    //%subcategory=Channel
    //%blockId=smarthon_iot_bit_wifi_send_message_value
    //%block="WiFi sender send channel %channel message %message value %value"
    //% weight=14
    //% group="Sender"
    export function wifiSendMessageValue(channel: string, message: string, value: number): void {
        myChannel = channel
        serial.writeLine("(AT+pubnubsender?channel=" + myChannel + "&message=" + message + "&value=" + value + ")");
    }

    /**
     * Check sent message status
     * @param handler channel sent callback;
     * @param status message status;
     * @param errorCode error code;
     */

    //%subcategory=Channel
    //%blockId=smarthon_iot_bit_on_wifi_sent
    //%block="on Wifi message sent"
    //% weight=13 draggableParameters=reporter group="Advanced"

    export function onWifiSenderSent(handler: (status: string, errorCode: string) => void): void {
        wifiSender = handler;
    }

    /**
     * Check channel create status
     * @param handler channel create callback;
     * @param channel created channel name;
     * @param errorCode error code;
     */

    //%subcategory=Channel
    //%blockId=smarthon_iot_bit_on_wifi_channel_create
    //%block="on WiFi channel joined" group="Receiver"
    //% weight=19 draggableParameters=reporter group="Advanced"

    export function onWifiCreateChannel(handler: (channel: string, errorCode: string) => void): void {
        wifiRemoteCreate = handler;
    }

    // -------------- 8.ESP Control ----------------

    /**
     * Control 180 degree servo
     * @param deg1 degree for the first servo;
     * @param deg2 degree for the second servo;
     * @param deg3 degree for the third servo;
     */

    //%subcategory=ESP Servo
    //%blockId=smarthon_iot_bit_ESP_Servo_180
    //%block="turn ESP 180° |servo1 to %deg1 ° ||servo2 to %deg2 ° |servo3 to %deg3 °|"
    //% expandableArgumentMode="enabled"
    //% weight=36
    //% deg1.min=0 deg1.max=180
    //% deg2.min=0 deg2.max=180
    //% deg3.min=0 deg3.max=180
    //% group="Servo"
    export function ESPServo180(deg1: number = null, deg2: number = null, deg3: number = null): void {
        let cmd = "(AT+servo_180?";
        if (deg1 != null) { cmd = cmd + "degree1=" + deg1.toString() + "&" }
        if (deg2 != null) { cmd = cmd + "degree2=" + deg2.toString() + "&" }
        if (deg3 != null) { cmd = cmd + "degree3=" + deg3.toString() + "&" }
        cmd = cmd + ")"

        serial.writeLine(cmd)
    }

    /**
     * Control 360 degree servo
     * @param dir1 direction for the first servo;
     * @param speed1 turning speed for the first servo;
     * @param dir2 direction for the Second servo;
     * @param speed2 turning speed for the second servo;
     * @param dir3 direction for the three servo;
     * @param speed3 turning speed for the three servo;
     */

    //%subcategory=ESP Servo
    //%blockId=smarthon_iot_bit_ESP_Servo_360
    //%block="turn ESP 360° servo|servo1 in %dir1 with speed %speed1||servo2 in %dir2 with speed %speed2|servo3 in %dir3 with speed %speed3|"
    //% weight=35
    //% speed1.min=0 speed1.max=100
    //% speed2.min=0 speed2.max=100
    //% speed3.min=0 speed3.max=100
    //% expandableArgumentMode="enabled" group="Servo"
    //% blockGap=7    

    export function ESPServo360(dir1: Esp360ServoDir = 0, speed1: number = null, dir2: Esp360ServoDir = 0, speed2: number = null, dir3: Esp360ServoDir = 0, speed3: number = null,): void {
        let cmd = "(AT+servo_360?";
        if (speed1 != null) {
            let direction1;
            if (dir1 == 0) { direction1 = "clockwise"; }
            if (dir1 == 1) { direction1 = "anticlockwise" }
            cmd = cmd + "direction1=" + direction1 + "&speed1=" + speed1.toString() + "&";
        }
        if (speed2 != null) {
            let direction2;
            if (dir2 == 0) { direction2 = "clockwise"; }
            if (dir2 == 1) { direction2 = "anticlockwise" }
            cmd = cmd + "direction2=" + direction2 + "&speed2=" + speed2.toString() + "&";
        }
        if (speed1 != null) {
            let direction3;
            if (dir3 == 0) { direction3 = "clockwise"; }
            if (dir3 == 1) { direction3 = "anticlockwise" }
            cmd = cmd + "direction3=" + direction3 + "&speed3=" + speed3.toString() + "&";
        }
        cmd = cmd + ")";

        serial.writeLine(cmd)
    }

    // -------------- 6. General ----------------        

    /**
     * Get firmware version
     */

    //%subcategory=ESP
    //%blockId=smarthon_iot_bit_version
    //%block="firmware version"
    //% weight=50
    //% group="Configuration" 
    export function sendVersion(): string {
        return version
    }

    /**
     * Send AT command
     * @param command command name;
     */

    //%subcategory=ESP
    //%blockId=smarthon_iot_bit_at
    //%block="send AT command %command"
    //% weight=25 group="Configuration" 
    export function sendAT(command: string): void {
        serial.writeLine(command);
        flag = false
    }

    /**
     * Update Firmware to Latest Version
     */

    //%subcategory=ESP
    //%blockId=smarthon_iot_bit_OTA_Latest
    //%block="update firmware to latest version"
    //% weight=40 group="Configuration" 
    export function OTALatest(): void {
        serial.writeLine("(AT+ota?ver=latest)");
    }

    /**
     * Update Firmware to another version
     * @param version version name;
     */

    //%subcategory=ESP
    //%blockId=smarthon_iot_bit_OTA_version
    //%block="update firmware to version %version"
    //% weight=35 group="Configuration" blockHidden=true
    export function OTAVersion(version: string): void {
        serial.writeLine("(AT+ota?ver=" + version + ")");
    }

    /**
     * Check OTA Porgress
     * @param percentageValue OTA progress in percentage;
     */

    //%subcategory=ESP
    //%blockId=smarthon_iot_bit_OTA_progress
    //%block="OTA progress"
    //% weight=27 draggableParameters=reporter group="Configuration"

    export function onOTAProgressing(handler: (percentageValue: string) => void): void {
        otaReceived = handler;
    }

    /**
     * When OTA Updated finished 
     * @param handler OTA finished callback;
     */

    //%subcategory=ESP
    //%blockId=smarthon_iot_bit_OTA_finish
    //%block="on OTA update finished"
    //% weight=29 draggableParameters=reporter group="Configuration"

    export function onOTAFinish(handler: () => void): void {
        otaFinished = handler;
    }

    //%subcategory=ESP
    //%blockId=smarthon_iot_bit_OTA_fail
    //%block="on OTA update failed"
    //% weight=28 draggableParameters=reporter group="Configuration"

    /**
     * When OTA Updated failed
     * @param handler OTA finished callback;
     * @param message error messsage;
     */

    export function onOTAFailed(handler: (message: string) => void): void {
        otaFailed = handler;
    }
}