# A simple Playground app

## Overview

This app exposes more functionality to the RPC features of Mongoose OS.

It's compatible exclusively with the ESP32 dev boards (Wemos LOLIN32, mostly).
A ESP8266 version is available [here](https://github.com/pmanna/mongoose_os_playground8266).

It's supposed to work with a yet unnamed mobile app, similar to [Blynk](http://www.blynk.cc), but for local, direct communication.

The app has been developed as a support for the [CoderDojo](https://coderdojo.com) Ninjas' projects at Croke Park, Dublin.

## Extensions

The app provides the following extensions to the standard [Mongoose OS RPC Calls](https://mongoose-os.com/docs/book/rpc.html)

### ADC
#### ADC.Enable
Enables the passed pin for ADC input

**Call:**

```json
 {"pin": num}
```

**Returns:**

```json
 {"success": true/false}
```
#### ADC.Read
Reads the input for the passed pin as ADC value

**Call:**

```json
 {"pin": num}
```

**Returns:**

```json
 {"value": <pin level (0-1023)>}
```

### PWM
#### PWM.Set
Sets the passed pin for PWM output, with optional frequency (default 50 Hz) and duty cycle (0.0 - 1.0, default 0.5 - square wave)

**Call:**

```json
 {"pin": num[,"frequency":N,"duty":N]}
```

**Returns:**

```json
 {"success": true/false}
```

### Servo
#### Servo.Set
Rotate the servo motor (tested on typical SG90) on the passed pin by the specified angle (0-180)

**Call:**

```json
 {"pin": num,"angle":N}
```

**Returns:**

```json
 {"success": true/false}
```

### TouchPad
#### Touch.Enable
Enables/Disables the TouchPad interface of ESP32.

**Call:**

```json
 {"enable": Bool}
```

**Returns:**

```json
 {"enabled": true/false}
```

#### Touch.Read
Reads the touch value from the given GPIO pin. The value is unfiltered.

**Call:**

```json
 {"pin": num}
```

**Returns:**

```json
 {"touch_pin": <ID of the Touch pin>, "value": <raw value of touch>}
```

### WiFi
#### Wifi.Enable
Switches the WiFi connection from AP (default) to STA, optionally setting SSID and password, or back to AP from STA.

**Call:**

```json
 {"enable":Bool[,"ssid":"name","pass":"xxx"]}
```

**Returns:**

```json
 {"enabled": true/false}
```

## Extras

The app enables the mDNS capability: this to ease future remote access without the need to know the actual IP address of the microcontroller board. It also uses GPIO 0 as a WiFi reset: when briefly taken to 0, network connection is reset to Access Point.

## How to install this app

- Install and start [mos tool](https://mongoose-os.com/software.html)
- Follow instructions in [Mongoose OS Docs](https://mongoose-os.com/docs/book/build.html)
