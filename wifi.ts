namespace WiFiIoT {
    let flag = true;
    let httpReturnArray: string[] = []
    let temp_cmd = ""
    let lan_cmd = ""
    let wan_cmd = ""
	let wifi_cmd = ""
    let Lan_connected = false
    let Wan_connected = false
	let Wifi_remote = false
	let Wifi_connected = false
	let myChannel = ""
	
	type EvtAct =(WiFiMessage:string) => void;
    let Wifi_Remote_Conn: EvtAct = null;
	let Wifi_Conn: () => void = null;
	let LAN_Remote_Conn: (LAN_Command:string) => void = null;
	let WAN_Remote_Conn: (WAN_Command:string) => void = null;
  
	

    export enum httpMethod {
        //% block="GET"
        GET,
        //% block="POST"
        POST,
        //% block="PUT"
        PUT,
        //% block="DELETE"
        DELETE
    }


    // -------------- 1. Initialization ----------------
    //%blockId=wifi_ext_board_initialize_wifi
    //%block="Initialize Wifi Extension Board and OLED"
    //% weight=140
    //% blockGap=7	
    export function initializeWifi(): void {
        serial.redirect(SerialPin.P16, SerialPin.P8, BaudRate.BaudRate115200);
		serial.setTxBufferSize(64)
		serial.setRxBufferSize(64)
        OLED.init(64, 128)

        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            temp_cmd = serial.readLine()
            //OLED.showStringWithNewLine(temp_cmd)
            let tempDeleteFirstCharacter = ""

            if (temp_cmd.charAt(0).compare("#") == 0) {
                tempDeleteFirstCharacter = temp_cmd.substr(1, 20)
                httpReturnArray.push(tempDeleteFirstCharacter)
            } else if (temp_cmd.charAt(0).compare("*") == 0) {

                // For digital, pwm, servo
                let mode = temp_cmd.substr(1, 1)
                let intensity = 0
                let pin = 0

                if (mode == "0") {	//digital
                    pin = parseInt(temp_cmd.substr(3, 2))
                    intensity = parseInt(temp_cmd.substr(2, 1))

                    pins.digitalWritePin(pin, intensity)

                } else if (mode == "1") { //pwm
                    pin = parseInt(temp_cmd.substr(5, 2))
                    intensity = pins.map(parseInt(temp_cmd.substr(2, 3)), 100, 900, 0, 1023)

                    pins.analogWritePin(pin, intensity)

                } else if (mode == "2") { //servo
                    pin = parseInt(temp_cmd.substr(5, 2))
                    intensity = pins.map(parseInt(temp_cmd.substr(2, 3)), 100, 900, 0, 180)

                    pins.servoWritePin(pin, intensity)

                }

            } else if (temp_cmd.charAt(0).compare("$") == 0) {
                let no = parseInt(temp_cmd.substr(1, 1))
                //let string_word = temp_cmd.substr(2, 20)

            } else if (Lan_connected && temp_cmd.charAt(0).compare(",") == 0) {
                lan_cmd = temp_cmd.substr(1, 20)
                if (LAN_Remote_Conn) LAN_Remote_Conn(lan_cmd)
            } else if (Wan_connected && temp_cmd.charAt(0).compare(":") == 0) {
                wan_cmd = temp_cmd.substr(1, 20)
                if (WAN_Remote_Conn) WAN_Remote_Conn(wan_cmd)
            } else if (Wifi_remote && temp_cmd.charAt(0).compare(":") == 0) {
                wifi_cmd = temp_cmd.substr(1, 20)
                if (Wifi_Remote_Conn) Wifi_Remote_Conn(wifi_cmd)
            } else {
				if (temp_cmd.substr(0, 11) == "HTTP client")
					temp_cmd = "Keep listen"
				OLED.showStringWithNewLine(temp_cmd.substr(0,20))
            }

        })

        basic.pause(5000);
    }

    // -------------- 2. WiFi ----------------
    //% blockId=wifi_ext_board_set_wifi
    //% block="Set wifi to ssid %ssid| pwd %pwd"   
    //% weight=135
	//% blockGap=7	
    export function setWifi(ssid: string, pwd: string): void {
        serial.writeLine("(AT+wifi?ssid=" + ssid + "&pwd=" + pwd + ")");
    }
	
    //% blockId=wifi_ext_board_on_wifi_connect
    //% block="On WiFi connected"   
    //% weight=133
	//% blockGap=7	
    export function on_wifi_connect(handler: () => void): void {
        Wifi_Conn = handler;
    
    }

	//% blockId=wifi_ext_board_is_wifi_connect
    //% block="WiFi connected?"   
    //% weight=131
	//% blockGap=7	
    export function is_wifi_connect(): boolean {
        return Wifi_connected
		
    }
    // -------------- 3. Cloud ----------------
    //% blockId=wifi_ext_board_set_thingspeak
    //% block="Send Thingspeak key* %key|field1 %field1|field2 %field2|field3 %field3"
    //% weight=130
    //% blockGap=7	
    export function sendThingspeak(key: string, field1: number, field2: number, field3: number): void {
        serial.writeLine("(AT+thingspeak?key=" + key + "&field1=" + field1 + "&field2=" + field2 + "&field3=" + field3 + ")");
    }


    //% blockId=wifi_ext_board_set_ifttt
    //% block="Send IFTTT key* %key|event_name* %event|value1 %value1|value2 %value2|value3 %value3"
    //% weight=125
    //% blockGap=7		
    export function sendIFTTT(key: string, eventname: string, value1: number, value2: number, value3: number): void {
        serial.writeLine("(AT+ifttt?key=" + key + "&event=" + eventname + "&value1=" + value1 + "&value2=" + value2 + "&value3=" + value3 + ")");
    }

	// -------------- 4. Others ----------------


    //%blockId=wifi_ext_board_generic_http
    //% block="Send generic HTTP method %method| http://%url| header %header| body %body"
    //% weight=115
    //% blockGap=7	
    export function sendGenericHttp(method: httpMethod, url: string, header: string, body: string): void {
        httpReturnArray = []
        let temp = ""
        switch (method) {
            case httpMethod.GET:
                temp = "GET"
                break
            case httpMethod.POST:
                temp = "POST"
                break
            case httpMethod.PUT:
                temp = "PUT"
                break
            case httpMethod.DELETE:
                temp = "DELETE"
                break
        }
        serial.writeLine("(AT+http?method=" + temp + "&url=" + url + "&header=" + header + "&body=" + body + ")");
    }

    
    //% blockId="wifi_ext_board_generic_http_return" 
    //% block="HTTP response (string array)"
    //% weight=110
    export function getGenericHttpReturn(): Array<string> {
        return httpReturnArray;
    }


	

	// -------------- 5. LAN/WAN Repmote ----------------
    //%subcategory=Control
	//%blockId=wifi_ext_board_start_server_LAN
    //%block="Start WiFi remote control (LAN)"
    //% weight=85
    //% blockGap=7		
    export function startWebServer_LAN(): void {
        flag = true
        serial.writeLine("(AT+startWebServer)")
        Lan_connected = true
        while (flag) {

            serial.writeLine("(AT+write_sensor_data?p0=" + pins.analogReadPin(AnalogPin.P0) + "&p1=" + pins.analogReadPin(AnalogPin.P1) + "&p2=" + pins.analogReadPin(AnalogPin.P2) + ")")
            basic.pause(500)
            if (!flag)
                break;
        }

    }
	
	//%subcategory=Control
    //%blockId=wifi_ext_board_start_server_WAN
    //%block="Start WiFi remote control (WAN)"
    //% weight=80
    //% blockGap=7		
    export function startWebServer_WAN(): void {
        flag = true
        serial.writeLine("(AT+pubnub)")
        Wan_connected = true
        
    }

	//%subcategory=Control
    //%blockId=wifi_ext_board_on_LAN_connect
    //%block="On LAN command received"
    //% weight=75
	//% blockGap=7	draggableParameters=reporter
    export function on_LAN_remote(handler: (LAN_Command:string) => void): void {
        LAN_Remote_Conn = handler;
    }

	//%subcategory=Control
    //%blockId=wifi_ext_board_on_WAN_connect
    //%block="On WAN command received"
    //% weight=70
	//% blockGap=7	draggableParameters=reporter
    export function on_WAN_remote(handler: (WAN_Command:string) => void): void {
        WAN_Remote_Conn = handler;
    }

	

   

    // -------------- 6. General ----------------		

    //%subcategory=Control
    //%blockId=wifi_ext_board_version
    //%block="Get firmware version"
    //% weight=30
    //% blockGap=7	
    export function sendVersion(): void {
        serial.writeLine("(AT+version)");
    }

    //%subcategory=Control
    //%blockId=wifi_ext_board_at
    //%block="Send AT command %command"
    //% weight=25
    export function sendAT(command: string): void {
        serial.writeLine(command);
        flag = false
    }
	
// -------------- 7. Wifi Channel ----------------
    //%subcategory=Channel
    //%blockId=wifi_listen_channel
    //%block="WiFi start listening in channel %channel"
    //% weight=20
    //% blockGap=7
    export function wifi_listen_channel(channel: string): void {
        Wifi_remote = true
		myChannel = channel
        serial.writeLine("(AT+pubnubreceiver?channel=" + myChannel + ")")
    }

    //%subcategory=Channel
    //%blockId=wifi_send_message
    //%block="WiFi send message %message in channel %channel"
    //% weight=15
    //% blockGap=7
    export function wifi_send_message(message: string, channel: string): void {
        myChannel = channel
		serial.writeLine("(AT+pubnubsender?channel=" + myChannel + "&message=" + message + ")")
    }

    //%subcategory=Channel
    //%blockId=wifi_ext_board_on_wifi_receieved
    //%block="On WiFi received"
    //% weight=10
    //% blockGap=7	draggableParameters=reporter
    export function on_wifi_received(handler: (WiFiMessage: string) => void): void {
        Wifi_Remote_Conn = handler;
    }


}

