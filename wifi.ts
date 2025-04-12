namespace WiFiIoT {
    let flag = true;
    //let httpReturnArray: string[] = []
    let httpReturnString: string = ""
    let http_error_code = ""
    let OLED_FLAG = false;
    let OLED_row_count = 0;
    let temp_cmd = ""
    let lan_cmd = ""
    let wan_cmd = ""
    let wan_cmd_value = ""
    let wifi_cmd = ""
    let Lan_connected = false
    let Wan_connected = false
    let Wifi_remote = false
    let Wifi_connected = "0"
    let IP = false
    let Error = false
    let myChannel = ""
    let version = ""
    let device_id = ""
    let wifi_tried_num = 0
    let ip = ""
    let array_keys: Array<string> = []
    let array_values: Array<string> = []

    let connecting_flag = false
    let disconnect_error_code = ""
    let thingspeak_error = ""
	let blynk_error = ""
    let NTP_Receive: (Year: number, Month: number, Day: number, Hour: number, Minute: number, Second: number) => void = null;
    let Wifi_Remote_Conn: (channel: string, WifiMessage: string) => void = null;
    let Wifi_Remote_Conn_value: (channel: string, WifiMessage: string, Value: number) => void = null;
    let Wifi_Conn: (IP: string, ID: string) => void = null;
    let Wifi_DisConn: (Error: string) => void = null;
    let LAN_Remote_Conn: (LAN_Command: string) => void = null;
    let WAN_Control_Conn: (Device_ID: string, Error_code: string) => void = null;
    let WAN_Remote_Conn: (WAN_Command: string) => void = null;
    let WAN_Remote_Conn_value: (WAN_Command: string, Value: number) => void;
    let Thingspeak_conn: (Status: string, Error_code: string) => void = null;
	let Blynk_conn: (Status: string, Error_code: string) => void = null;
    let BlynkRead_conn: (Status: string, Error_code: string) => void = null;
    let IFTTT_conn: (Status: string, Error_code: string) => void = null;
    let Wifi_Remote_create: (channel: string, Error_code: string) => void = null;
    let Wifi_sender: (status: string, Error_code: string) => void = null;
    let HTTP_received: (Error_code: string, Data: string) => void = null;
    let HTTP_receive_end = true;
    let OTA_recevied: (PercentageValue:string) => void = null;
    let OTA_Finished: ()=>void=null;
    let OTA_Failed: (Message: string) => void = null;
    export enum httpMethod {
        //% block="GET"
        GET,
        //% block="POST"
        POST






    }
    export enum mode {
        //% block="WEB"
        Web,
        //% block="APP"
        App,
        //% block="IFTTT"
        ifttt,
        //% block="ALL"
        all
    }
    export enum ESP_SERVO_PORT {
        //% block="S1"
        S1,
        //% block="S2"
        S2,
        //% block="S3"
        S3
    }
    export enum ESP_360_SERVO_DIR {
        //% block="Clockwise"
        clockwise,
        //% block="Antilockwise"
        anticlockwise
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
        City_of_Brussels = "1",
        //% block="Dubai (UTC+4)"
        Dubai = "4",
        //% block="Frankfurt (UTC+1)"
        Frankfurt = "1",
        //% block="Jakarta (UTC+7)"
        Jakarta = "7",
        //% block="Johannesburg (UTC+2)"
        Johannesburg = "2",
        //% block="Kuala Lumpur (UTC+8)"
        Kuala_Lumpur = "8",
        //% block="London (UTC+0)"
        London = "0",
        //% block="Los Angeles (UTC-8)"
        Los_Angeles = "-8",
        //% block="Madrid (UTC+1)"
        Madrid = "1",
        //% block="Mexico City (UTC-6)"
        Mexico_City = "-6",
        //% block="Milano (UTC+1)"
        Milano = "1",
        //% block="Moscow (UTC+3)"
        Moscow = "3",
        //% block="Mumbai (UTC+5:30)"
        Mumbai = "5.5",
        //% block="Paris (UTC+1)"
        Paris = "1",
        //% block="São Paulo (UTC-3)"
        Sao_Paulo = "-3",
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
     * @param tx_pin describe parameter here, eg: SerialPin.P16
     * @param rx_pin describe parameter here, eg: SerialPin.P8
     */

    //%blockId=wifi_ext_board_initialize_wifi
    //%block="Initialize IoT:bit TX %tx_pin RX %rx_pin"
    //% weight=140

    export function initializeWifi(tx_pin: SerialPin, rx_pin: SerialPin): void {
        serial.redirect(tx_pin, rx_pin, BaudRate.BaudRate115200);
        serial.setTxBufferSize(128)
        serial.setRxBufferSize(128)

        //add  1s for UART ready to support Micro:bit V2
        basic.pause(1000)
        ///////////////////////////////////////////////////










        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            temp_cmd = serial.readLine()
            //OLED.writeStringNewLine(temp_cmd)
            let tempDeleteFirstCharacter = ""

            if (temp_cmd.charAt(0).compare("W") == 0) { //start with W
                let space_pos = temp_cmd.indexOf(" ")
                let label = temp_cmd.substr(1, space_pos - 1)
                if (label == "0") { //W0 - Initialize
                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    version = response[1]
                    device_id = response[2]
                    /*
                    if(OLED_FLAG==true&&connecting_flag==false){
                    OLED.clear()
                    OLED.writeStringNewLine("Initialize OK")
                    OLED.writeStringNewLine("Smarthon IoT:Bit")
                    OLED.writeStringNewLine("Version:"+version)
                    }
                    */
                }
                else if (label == "1") { //W1 - Connect WIFI
                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (response[1] == "0") {

                        Wifi_connected = "0"
                        //Wifi_DisConn()
                        if (response[2] != null) {

                            if (OLED_FLAG == true) {
                                connecting_flag = false
                                //OLED.newLine()
                                //OLED.writeStringNewLine("Timeout")
                            }
                        }
                    }
                    else if (response[1] == "1") {
                        Wifi_connected = "1"
                        if (OLED_FLAG == true && connecting_flag == false) {
                            connecting_flag = true
                            //OLED.writeString("Connecting.")
                        } else if (OLED_FLAG == true && connecting_flag == true) {
                            //OLED.writeString(".")
                        }

                    }
                    else if (response[1] == "2") {
                        Wifi_connected = "2"
                        if (response[2] != null) {
                            ip = response[2]
                            //Wifi_Conn()



                            if (OLED_FLAG == true) {
                                connecting_flag = false
                                //OLED.newLine()

                                //OLED.writeStringNewLine("IP:"+ip)
                            }

                            startWebServer_WAN()
                            basic.pause(500)
                            if (Wifi_Conn && Wifi_connected == "2") Wifi_Conn(ip, device_id)


                        }


                    }
                    else if (response[1] == "3") {
                        Wifi_connected = "3"
                        if (response[2] != null) {

                            disconnect_error_code = response[2]
                            if (Wifi_DisConn && Wifi_connected == "3") Wifi_DisConn(disconnect_error_code)
                            if (OLED_FLAG == true && connecting_flag == false) {
                                //OLED.writeStringNewLine("error:"+disconnect_error_code)
                            }

                        }
                    }
                }
                else if (label == "2") { //W2 Thingspeak
                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (Thingspeak_conn != null && response[1] == "0") {
                        if (OLED_FLAG == true) {
                            //OLED.writeStringNewLine("Thingspeak uploaded")
                        }
                        Thingspeak_conn("OK", "0")
                    }
                    else if (response[1] == "1") {
                        if (Thingspeak_conn != null && response[2] != null) {
                            thingspeak_error = response[2]
                            Thingspeak_conn("FAIL", thingspeak_error)
                        }
                        if (OLED_FLAG == true) {
                            //OLED.writeStringNewLine("Thingspeak upload")
                            //OLED.writeStringNewLine("fail code:"+thingspeak_error)
                        }
                    }
                }
                else if (label == "3") { //W3 IFTTT
                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (IFTTT_conn != null && response[1] == "0") {
                        IFTTT_conn("OK", "0")
                    }
                    else if (response[1] == "1") {
                        if (IFTTT_conn != null && response[2] != null) {
                            IFTTT_conn("FAIL", response[2])
                        }
                    }
                }
                else if (label == "4") { //W4 WAN
                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (response[1] == "0") {    //WAN start listen
                        if (WAN_Control_Conn != null) {
                            //WAN_Control_Conn(response[2],"0")    //return the channel ID
                        }
                    }
                    else if (response[1] == "1") {
                        if (WAN_Control_Conn != null) {
                            //WAN_Control_Conn(response[2],response[3])    //return the error code
                        }
                    }
                    else if (response[1] == "2") {//return message  


                        if (response[2].includes("$")) {       //with value
                            let pos = response[2].indexOf("$")
                            if (WAN_Remote_Conn_value != null) {
                                WAN_Remote_Conn_value(response[2].substr(0, pos), parseInt(response[2].substr(pos + 1, response[2].length)))
                            }
                        }
                        else {           //without value
                            if (WAN_Remote_Conn != null) {
                                WAN_Remote_Conn(response[2])
                            }

                        }
                    }
                }
                else if (label == "5") {  //W5 WIFI control
                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (response[1] == "0") {    //WIFI control start listen
                        if (Wifi_Remote_create != null && response[2] != null) {
                            Wifi_Remote_create(response[2], "0")
                        }
                    } else if (response[1] == "1") { //WIFI control listen fail
                        if (Wifi_Remote_create != null && response[2] != null && response[3] != null) { //W5 1 ID ERROR
                            Wifi_Remote_create(response[2], response[3])
                        }
                    } else if (response[1] == "2") { //WIFI control get Message
                        if (response[3].includes("$")) {       //with value
                            let pos = response[3].indexOf("$")
                            if (Wifi_Remote_Conn_value != null) {
                                Wifi_Remote_Conn_value(response[2], response[3].substr(0, pos), parseInt(response[3].substr(pos + 1, response[3].length)))
                            }
                        }
                        else {           //without value
                            if (Wifi_Remote_Conn != null) {
                                Wifi_Remote_Conn(response[2], response[3])
                            }
                        }
                    }
                }
                else if (label == "6") {//WiFi Sender

                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (Wifi_sender != null && response[1] == "0") {
                        Wifi_sender("OK", "0")
                    } else if (Wifi_sender != null && response[1] == "1") {
                        Wifi_sender("Fail", response[2])
                    }
                }
                else if (label == "7") {//NTP

                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (NTP_Receive != null && response[3] != null) {
                        NTP_Receive(parseInt(response[1]), parseInt(response[2]), parseInt(response[3]), parseInt(response[4]), parseInt(response[5]), parseInt(response[6]))
                    }
                }
                else if (label == "8") {//HTTP
                    //get the string include end_Indicator and msg char, e.g "0|a" "1|e"
                    let msg = temp_cmd.slice(temp_cmd.indexOf(" ") + 1, temp_cmd.length)
                    //split the end_Indicator and msg char
                    let response = msg.split('|')
                    if (HTTP_received != null && response[1] != null) { //skip if not use
                        if (response[0] == "2") {
                            http_error_code = response[1]
                        }
                        if (response[0] == "0") { //not the end of msg
                            if (HTTP_receive_end == true) { //if is start of msg, reset the msg string
                                httpReturnString = ""; //reset msg string
                            }
                            HTTP_receive_end = false; // not the end of receive msg
                            httpReturnString = httpReturnString + response[1] //build the msg string
                        }
                        if (response[0] == "1") {   // it is the end of msg
                            httpReturnString = httpReturnString + response[1] //build the msg string
                            HTTP_receive_end = true;    //indicate it is end
                            HTTP_received(http_error_code, httpReturnString) //call the handler to return the msg
                        }


                    }

                }
				else if (label == "9"){     //OTA
                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (OTA_recevied != null && response[1] == "1") {
                        OTA_recevied(response[2])
                    } else if (OTA_Finished != null && response[1] == "2") {
                        OTA_Finished()
                    }else if (OTA_Failed != null && response[1] == "3")
                    {
                        OTA_Failed(response[2])
                    }
                }
				
                else if (label == "10") { //W10 Blynk
                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (Blynk_conn != null && response[1] == "0") {
                        if (OLED_FLAG == true) {
                            //OLED.writeStringNewLine("Blynk uploaded")
                        }
                        Blynk_conn("OK", "0")
                    }
                    else if (response[1] == "1") {
                        if (Blynk_conn != null && response[2] != null) {
                            blynk_error = response[2]
                            Blynk_conn("FAIL", blynk_error)
                        }
                        if (OLED_FLAG == true) {
                            //OLED.writeStringNewLine("Blynk_error")
                            //OLED.writeStringNewLine("fail code:"+blynk_error)
                        }
                    }
                }	
                else if (label == "11") { //read Blynk
                    let response = temp_cmd.slice(1, temp_cmd.length).split(' ')
                    if (BlynkRead_conn != null && response[1] == "0") {
                        if (OLED_FLAG == true) {
                            //OLED.writeStringNewLine("Blynk read uploaded")
                        }
                        BlynkRead_conn("OK", "0")
                    }
                    else if (response[1] == "1") {
                        if (BlynkRead_conn != null && response[2] != null) {
                            blynk_error = response[2]
                            BlynkRead_conn("FAIL", blynk_error)
                        }
                        if (OLED_FLAG == true) {
                            //OLED.writeStringNewLine("Blynk_read_error")
                            //OLED.writeStringNewLine("fail code:"+blynk_error)
                        }
                    }

                }
					

            }
        })
        basic.pause(500)
        serial.writeLine("(AT+W0)")
        basic.pause(2000)
    }

    // -------------- 2. WiFi ----------------
    //% blockId=wifi_ext_board_set_wifi
    //% block="Set WiFi to ssid %ssid| pwd %pwd"   
    //% weight=135
    export function setWifi(ssid: string, pwd: string): void {
        serial.writeLine("(AT+wifi?ssid=" + ssid + "&pwd=" + pwd + ")");
        if (OLED_FLAG == true && connecting_flag == false) {
            //OLED.clear()
            //OLED.writeStringNewLine("WIFI Connecting...")
            //OLED.writeStringNewLine("SSID:"+ssid)
            //OLED.writeStringNewLine("PWD:"+pwd)
        }
    }


    //% blockId=wifi_ext_board_on_wifi_connect
    //% block="On WiFi connected"   
    //% weight=133
    //% draggableParameters=reporter
    export function on_wifi_connect(handler: (IP_Address: string, Device_ID: string) => void): void {
        Wifi_Conn = handler;


    }


    //% blockId=wifi_ext_board_on_wifi_disconnect
    //% block="On WiFi disconnected"   
    //% weight=132
    //% draggableParameters=reporter
    export function on_wifi_disconnect(handler: (Error_code: string) => void): void {
        Wifi_DisConn = handler;


    }

    //% blockId=wifi_ext_board_is_wifi_connect
    //% block="WiFi connected?"   
    //% weight=131
    export function is_wifi_connect(): boolean {
        if (Wifi_connected == "2")
            return true
        else return false


    }
    // -------------- 3. Cloud ----------------
    //%subcategory="IoT Services"
    //% blockId=wifi_ext_board_set_thingspeak
    //% block="Send Thingspeak key* %key|field1 value%field1||field2 value%field2|field3 value%field3|field4 value%field4|field5 value%field5|field6 value%field6|field7 value%field7|field8 value%field8"
    //% weight=130 group="Thingspeak"
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

    //%subcategory="IoT Services"
    //%blockId=Thingspeak_connect
    //%block="On Thingspeak Uploaded"
    //% weight=129 group="Thingspeak"
    //% draggableParameters=reporter
    //% blockGap=7
    export function on_thingspeak_conn(handler: (Status: string, Error_code: string) => void): void {
        Thingspeak_conn = handler;
    }


    //%subcategory="IoT Services"
    //% blockId=wifi_ext_board_set_ifttt
    //% block="Send IFTTT key* %key|event_name* %event||value1 %value1|value2 %value2|value3 %value3"
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

    //%subcategory="IoT Services"
    //%blockId=IFTTT_connect
    //%block="On IFTTT Uploaded"
    //% weight=124	 group="IFTTT"
    //% draggableParameters=reporter
    //% blockGap=7
    export function on_IFTTT_conn(handler: (Status: string, Error_code: string) => void): void {
        IFTTT_conn = handler;
    }
	
	//%subcategory="IoT Services"
    //% blockId=wifi_ext_board_set_blynk
    //% block="Send Blynk token* %key|V0 value%V0||V1 value%V1|V2 value%V2|V3 value%V3|V4 value%V4|V5 value%V5|V6 value%V6|V7 value%V7|"
    //% weight=123 group="Blynk"
    //% expandableArgumentMode="enabled"
    export function sendBlynk(key: string, v0: number = null, v1: number = null, v2: number = null, v3: number = null, v4: number = null, v5: number = null, v6: number = null, v7: number = null): void {
        let command = "(AT+blynk?key=";
        if (key == "") { return }
        else { command = command + key }
		if (v0 != null) { command = command + "&v0=" + v0 }
        if (v1 != null) { command = command + "&v1=" + v1 }
        if (v2 != null) { command = command + "&v2=" + v2 }
        if (v3 != null) { command = command + "&v3=" + v3 }
        if (v4 != null) { command = command + "&v4=" + v4 }
        if (v5 != null) { command = command + "&v5=" + v5 }
        if (v6 != null) { command = command + "&v6=" + v6 }
        if (v7 != null) { command = command + "&v7=" + v7 }

        command = command + ")"
        serial.writeLine(command);
    }
	//%subcategory="IoT Services"
    //%blockId=Blynk_connect
    //%block="On Blynk Uploaded"
    //% weight=122 group="Blynk"
    //% draggableParameters=reporter
    //% blockGap=7
    export function on_blynk_conn(handler: (Status: string, Error_code: string) => void): void {
        Blynk_conn = handler;
    }
	
    //%subcategory="IoT Services"
    //% blockId=read_blynk
    //% block="read Blynk token* %key|V0 value%V0||V1 value%V1|V2 value%V2|V3 value%V3|V4 value%V4|V5 value%V5|V6 value%V6|V7 value%V7|"
    //% weight=121 group="Blynk"
    //% expandableArgumentMode="enabled"
    export function readBlynk(key: string, v0: number = null, v1: number = null, v2: number = null, v3: number = null, v4: number = null, v5: number = null, v6: number = null, v7: number = null): void {
        let command = "(AT+blynk?key=";
        if (key == "") { return }
        else { command = command + key }
		if (v0 != null) { command = command + "&v0=" + v0 }
        if (v1 != null) { command = command + "&v1=" + v1 }
        if (v2 != null) { command = command + "&v2=" + v2 }
        if (v3 != null) { command = command + "&v3=" + v3 }
        if (v4 != null) { command = command + "&v4=" + v4 }
        if (v5 != null) { command = command + "&v5=" + v5 }
        if (v6 != null) { command = command + "&v6=" + v6 }
        if (v7 != null) { command = command + "&v7=" + v7 }

        command = command + ")"
        serial.writeLine(command);
    }

    //%subcategory="IoT Services"
    //%blockId=readBlynk_connect
    //%block="On Blynk Readed"
    //% weight=120 group="Blynk"
    //% draggableParameters=reporter
    //% blockGap=7
    export function on_readblynk(handler: (Status: string, Error_code: string) => void): void {
        BlynkRead_conn = handler;
    }

    // -------------- 4. Others ----------------


    /**
     * Use IoT:bit to send the HTTP request, input the URL of your API.
     * The Body content only available for POST method.
     * The POST Body Content-Type was "application/json",
     * DO NOT include "&" symbol in the JSON content.
     * 
     */
    //%subcategory="IoT Services"
    //%blockId=wifi_ext_board_generic_http
    //% block="Send HTTP Request |Method %method|URL:%url|Body:%body"
    //% weight=115	 group="HTTP" 
    //% inlineInputMode=external
    export function sendGenericHttp(method: httpMethod, url: string, body: string): void {
        //httpReturnArray = []
        let temp = ""
        switch (method) {
            case httpMethod.GET:
                temp = "GET"
                break
            case httpMethod.POST:
                temp = "POST"
                break






        }
        serial.writeLine("(AT+http?method=" + temp + "&url=" + url + "&header=" + "&body=" + body + ")");
    }

    /**
     * After sending the HTTP request, the response will be return to this handler, you may access the http stauts code and the return body.
     */

    //%subcategory="IoT Services"
    //% blockId="wifi_ext_board_http_receive" 
    //% block="On HTTP received"	 group="HTTP"
    //% weight=108 draggableParameters=reporter
    //% blockGap=20

    export function on_HTTP_recevid(handler: (HTTP_Status_Code: string, Data: string) => void): void {
        HTTP_received = handler;
    }

    /**
     * This function can extract the value of specific key from a JSON format String.
     * Fill in the Key field that you are searching from json_object, then put the source into the Source placeholder(e.g HTTP return Data).
     * It will search the key from Source string and return the corresponding value.
     * When using at the mulit-level JSON, you need to use this function several time to extract the value one by one level.
     * @param target Key that looking for
     * @param source Source string that to be extract from
     */
    //%subcategory="IoT Services"
    //% blockId="JSON_extractor"
    //%block="Get value of Key %target from JSON String %source"
    //% weight=107 group="HTTP"
    export function get_value(target: string, source: string): string {

        //clear the keys & values array
        array_keys = []
        array_values = []
        //prase the JSON String to Object
        let json_object = JSON.parse(source)
        //Get the count of keys for the For-Loop to run
        let total_keys = Object.keys(json_object).length
        // Start work on each keys
        for (let i = 0; i < total_keys; i++) {
            //Push each key from JSON Object to keys array
            array_keys.push(Object.keys(json_object)[i])
            // Check the corresponding value of the key from Object, 
            // if it is string or number type, push it to value array as normal
            if ((typeof (json_object[array_keys[array_keys.length - 1]]) == "string") || (typeof (json_object[array_keys[array_keys.length - 1]]) == "number")) {
                //push the string or number value to array
                array_values.push(json_object[array_keys[array_keys.length - 1]])

            }
            // if the value is a Object type, mostly is next level JSON object
            else if (typeof (json_object[array_keys[array_keys.length - 1]]) == "object") {
                //Use stringify to convert it back to string, allow to return the stringify object to user,
                //User can perform JSON prase function again later, while the source can set as this return string
                array_values.push(JSON.stringify(json_object[array_keys[array_keys.length - 1]]))

            }
        }
        //After input all the data, search the target's key index
        let target_index = array_keys.indexOf(target)
        //Return the value of that key
        return array_values[target_index]


    }





    //%subcategory="IoT Services"
    //% blockId="wifi_ext_board_generic_http_array_return" 

    //% block="HTTP response (string array)"
    //% weight=110	 group="HTTP"
    //% blockGap=7
    //% blockHidden=true
    export function getGenericHttpReturn(): Array<string> {
        return [""];
    }
    //%subcategory="IoT Services"
    //% blockId="wifi_ext_board_generic_http_return" 
    //% block="HTTP response (string)"
    //% weight=110	 group="HTTP"
    //% blockGap=7
    //% blockHidden=true
    export function getHttpReturn(): string {
        return httpReturnString;

    }
    /** 
    Select the city in the list to get the locale Time 
    */
    //%subcategory="IoT Services"
    //% blockId=wifi_ext_board_Call_NTP_city
    //% block="Get NTP Current Time at city %city"   
    //% weight=109
    //% group="Current Time"
    export function getNTP(city: CityList): void {
        //serial.writeLine(city);
        serial.writeLine("(AT+ntp?zone=" + city + ")");
    }
    /** 
   Input the UTC time zone number to get the locale time. 
   You ONLY need to fill in the SIGN and NUMBER part.
   For example, when your time zone is UTC+8, you just need to fill "+8".
   If your location using contain minutes time zone, e.g. +3:30, please convert the minutes to decimal number with base 60. 
   Example case1, "-3:30" convert to "-3.5", since 30min/60min=0.5.
   Example case2, "+5:45" convert to "+5.75", since 45min/60min=0.75
   @param zone is the string contain SIGN and NUMBER, eg: "+0"
   */
    //%subcategory="IoT Services"
    //% blockId=wifi_ext_board_Call_NTP_number
    //% block="Get NTP Current Time at Time Zone UTC%zone"   
    //% weight=109
    //% group="Current Time"
    export function getNTP_number(zone: string): void {


        serial.writeLine("(AT+ntp?zone=" + zone + ")");
    }

    //%subcategory="IoT Services"
    //% blockId="wifi_ext_board_receive_ntp" 
    //% block="On NTP received"	 group="Current Time"
    //% weight=108 draggableParameters=reporter
    //% blockGap=7


    export function on_NTP_Received(handler: (Year: number, Month: number, Day: number, Hour: number, Minute: number, Second: number) => void): void {
        NTP_Receive = handler;
    }



    // -------------- 5. LAN/WAN Repmote ----------------





    //%subcategory=Control
    //%blockId=wifi_ext_board_start_server_WAN
    //%block="Start WiFi remote control (WAN)"
    //% weight=80  group="Start the control"
    //% blockHidden=true
    export function startWebServer_WAN(): void {
        flag = true
        serial.writeLine("(AT+pubnub)")
        Wan_connected = true


    }
    //%subcategory=Control
    //%blockId=wifi_ext_board_get_id
    //%block="Device ID"
    //% weight=80
    export function getDeviceID(): string {
        return device_id
    }
    //%subcategory=Control
    //%blockId=wifi_ext_board_on_WAN_connected
    //%block="On WAN control Connected" 
    //% weight=75 group="Start the control"
    //% blockHidden=true
    //% blockGap=7	draggableParameters=reporter

    export function on_WAN_Control_Connected(handler: (Device_ID: string, Error_code: string) => void): void {
        WAN_Control_Conn = handler;
    }




    //%subcategory=Control
    //%blockId=wifi_ext_board_on_WAN_connect
    //%block="On WiFi received" 
    //% weight=70 group="Get controlled"
    //% draggableParameters=reporter
    export function on_WAN_remote(handler: (WAN_Command: string) => void): void {
        WAN_Remote_Conn = handler;
    }
    //%subcategory=Control
    //%blockId=wifi_ext_board_on_WAN_connect_value
    //%block="On WiFi received" 
    //% weight=65 group="Get controlled"
    //% blockGap=7	draggableParameters=reporter
    export function on_WAN_remote_value(handler: (WAN_Command: string, Value: number) => void): void {
        WAN_Remote_Conn_value = handler;
    }



    // -------------- 7. Wifi Channel ----------------
    //%subcategory=Channel
    //%blockId=wifi_listen_channel
    //%block="WiFi Receiver join channel %channel"
    //% weight=20 group="Receiver"
    export function wifi_listen_channel(channel: string): void {
        Wifi_remote = true
        myChannel = channel
        serial.writeLine("(AT+pubnubreceiver?channel=" + myChannel + ")")
    }
    //%subcategory=Channel
    //%blockId=wifi_ext_board_on_wifi_receieved
    //%block="On WiFi Receiver received"
    //% weight=18 group="Receiver"
    //% draggableParameters=reporter
    export function on_wifi_received(handler: (Channel: string, receivedMessage: string) => void): void {
        Wifi_Remote_Conn = handler;
    }
    //%subcategory=Channel
    //%blockId=wifi_ext_board_on_wifi_receieved_value
    //%block="On WiFi Receiver received"
    //% weight=17 draggableParameters=reporter group="Receiver"
    export function on_wifi_received_value(handler: (Channel: string, receivedMessage: string, Value: number) => void): void {
        Wifi_Remote_Conn_value = handler;
    }

    //%subcategory=Channel
    //%blockId=wifi_send_message
    //%block="WiFi Sender send channel %channel message %message"
    //% weight=15
    //% group="Sender"
    export function wifi_send_message(Channel: string, message: string): void {
        myChannel = Channel
        serial.writeLine("(AT+pubnubsender?channel=" + myChannel + "&message=" + message + ")")
    }

    //%subcategory=Channel
    //%blockId=wifi_send_message_value
    //%block="WiFi Sender send channel %channel message %message value %value"
    //% weight=14
    //% group="Sender"
    export function wifi_send_message_value(channel: string, message: string, value: number): void {
        myChannel = channel
        serial.writeLine("(AT+pubnubsender?channel=" + myChannel + "&message=" + message + "&value=" + value + ")");
    }

    //%subcategory=Channel
    //%blockId=wifi_ext_board_on_wifi_sent
    //%block="On Wifi message sent"
    //% weight=13 draggableParameters=reporter group="Advanced"

    export function on_wifi_sender_sent(handler: (Status: string, Error_code: string) => void): void {
        Wifi_sender = handler;
    }




    //%subcategory=Channel
    //%blockId=wifi_ext_board_on_wifi_channel_create
    //%block="On WiFi channel joined" group="Receiver"
    //% weight=19 draggableParameters=reporter group="Advanced"


    export function on_wifi_create_channel(handler: (Channel: string, Error_code: string) => void): void {
        Wifi_Remote_create = handler;
    }


    // -------------- 8.ESP Control ----------------
    //%subcategory=ESP Servo
    //%blockId=ESP_Servo_180
    //%block="Turn ESP 180° |Servo1 to %deg1 ° ||Servo2 to %deg2 ° |Servo3 to %deg3 °|"
    //% expandableArgumentMode="enabled"
    //% weight=36
    //% deg1.min=0 deg1.max=180
    //% deg2.min=0 deg2.max=180
    //% deg3.min=0 deg3.max=180
    //% group="Servo"
    export function ESP_Servo_180(deg1: number = null, deg2: number = null, deg3: number = null): void {
        let cmd = "(AT+servo_180?";
        if (deg1 != null) { cmd = cmd + "degree1=" + deg1.toString() + "&" }
        if (deg2 != null) { cmd = cmd + "degree2=" + deg2.toString() + "&" }
        if (deg3 != null) { cmd = cmd + "degree3=" + deg3.toString() + "&" }
        cmd = cmd + ")"

        serial.writeLine(cmd)
    }
    //%subcategory=ESP Servo
    //%blockId=ESP_Servo_360
    //%block="Turn ESP 360° Servo|Servo1 in %dir1 with speed %speed1||Servo2 in %dir2 with speed %speed2|Servo3 in %dir3 with speed %speed3|"
    //% weight=35
    //% speed1.min=0 speed1.max=100
    //% speed2.min=0 speed2.max=100
    //% speed3.min=0 speed3.max=100
    //% expandableArgumentMode="enabled" group="Servo"
    //% blockGap=7	


    export function ESP_Servo_360(dir1: ESP_360_SERVO_DIR = 0, speed1: number = null, dir2: ESP_360_SERVO_DIR = 0, speed2: number = null, dir3: ESP_360_SERVO_DIR = 0, speed3: number = null,): void {
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

    //%subcategory=ESP
    //%blockId=wifi_ext_board_version
    //%block="firmware version"
    //% weight=50
    //% group="Configuration" 
    export function sendVersion(): string {
        return version
    }

    //%subcategory=ESP
    //%blockId=wifi_ext_board_at
    //%block="Send AT command %command"
    //% weight=25 group="Configuration" 
    export function sendAT(command: string): void {
        serial.writeLine(command);
        flag = false
    }

    //%subcategory=ESP
    //%blockId=wifi_ext_board_OTA_Latest
    //%block="Update Firmware to Latest Version"
    //% weight=40 group="Configuration" 
    export function OTA_Latest(): void {
        serial.writeLine("(AT+ota?ver=latest)");
    }

    //%subcategory=ESP
    //%blockId=wifi_ext_board_OTA_version
    //%block="Update Firmware to Version %version"
    //% weight=35 group="Configuration" blockHidden=true
    export function OTA_Version(version: string): void {
        serial.writeLine("(AT+ota?ver="+version+")");
    }

    //%subcategory=ESP
    //%blockId=wifi_ext_board_OTA_progress
    //%block="OTA Progress"
    //% weight=27 draggableParameters=reporter group="Configuration"

    export function on_OTA_progressing(handler: (PercentageValue: string) => void): void {
        OTA_recevied = handler;
    }
    //%subcategory=ESP
    //%blockId=wifi_ext_board_OTA_finish
    //%block="On OTA Update Finished"
    //% weight=29 draggableParameters=reporter group="Configuration"

    export function on_OTA_Finish(handler: () => void): void {
        OTA_Finished = handler;
    }
    //%subcategory=ESP
    //%blockId=wifi_ext_board_OTA_fail
    //%block="On OTA Update Failed"
    //% weight=28 draggableParameters=reporter group="Configuration"

    export function on_OTA_Failed(handler: (Message:string) => void): void {
        OTA_Failed = handler;
    }
}