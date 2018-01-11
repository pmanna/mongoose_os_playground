# A simple Playground app

## Overview

This app exposes more functionality to the RPC features of Mongoose OS.

It's compatible exclusively with the ESP32 dev boards (Wemos LOLIN32, mostly) and ESP8266 dev boards (Wemos D1 Mini, mostly).

The app has been developed as a support for the [CoderDojo](https://coderdojo.com) Ninjas' projects at Croke Park, Dublin.

At this time, experiments can be conducted via browser: a web page is presented with various options to play with some relevant RPC calls.

The application is eventually supposed to work with a yet unnamed mobile app, similar to [Blynk](http://www.blynk.cc), but for local, direct communication.

## Usage

- Install and start [mos tool](https://mongoose-os.com/software.html)
- Follow instructions in [Mongoose OS Docs](https://mongoose-os.com/docs/book/build.html)
- Point a browser to the board address, and start experimenting!

## Extensions

The app provides the following extensions to the standard [Mongoose OS RPC Calls](https://mongoose-os.com/docs/book/rpc.html)

### ADC
#### ADC.Enable
Enables the passed pin for ADC input

**Call:**

```
 {"pin": num}
```

**Returns:**

```
 {"enable": true/false}
```
#### ADC.Read
Reads the input for the passed pin as ADC value

**Call:**

```
 {"pin": num}
```

**Returns:**

```
 {"value": <pin level (0-1023 or 0-4095)>}
```

### PWM
#### PWM.Set
Sets the passed pin for PWM output, with optional frequency (default 50 Hz) and duty cycle (0.0 - 1.0, default 0.5 - square wave)

**Call:**

```
 {"pin": num[,"frequency":N,"duty":N]}
```

**Returns:**

```
 {"success": true/false}
```

### Servo
#### Servo.Set
Rotate the servo motor (tested on typical SG90) on the passed pin by the specified angle (0-180)

**Call:**

```
 {"pin": num,"angle":N}
```

**Returns:**

```
 {"success": true/false}
```

### TouchPad (ESP32 only)
#### Touch.Enable
Enables/Disables the TouchPad interface of ESP32.

**Call:**

```
 {"enable": Bool}
```

**Returns:**

```
 {"enable": true/false}
```

#### Touch.Read
Reads the touch value from the given GPIO pin. The value is unfiltered.

**Call:**

```
 {"pin": num}
```

**Returns:**

```
 {"touch_pin": <ID of the Touch pin>, "value": <raw value of touch>}
```

### Wemos D1 mini Motor Shield (ESP8266 only)
#### D1Motor.Enable
Enables the passed I2C address, default is 48 (a.k.a. 0x30), and initializes it with the given frequency (typically 1000 Hz).

**Call:**

```
 {["address": n1,]"motor": 0-1,"frequency": n2}
```

**Returns:**

The initialized motor object to use in subsequent calls or
``` {} ```
if unsuccessful.

#### D1Motor.Move
Writes to the given I2C address (that should match the one passed to D1Motor.Enable, default to 0x30), the motor (0-1), direction (0 - Brake, 1 - CCW, 2 - CW, 3 - Stop) and speed (0-100)

**Call:**

```
 {["address": n1,]"motor": 0-1,"dir": 0-3,"speed": 0-100}
```

**Returns:**

```
 {"success": true/false}
```

### WiFi
#### Wifi.Enable
Switches the WiFi connection from AP (default) to STA, optionally setting SSID and password, or back to AP from STA.

**Call:**

```
 {"enable":Bool[,"ssid":"name","pass":"xxx"]}
```

**Returns:**

```
 {"enable": true/false}
```

## Extras

The app enables the mDNS capability: this to ease future remote access without the need to know the actual IP address of the microcontroller board. It also uses GPIO 0 as a WiFi reset: when briefly taken to 0, network connection is reset to Access Point.

## Other

The CoderDojo logo is used according to [their terms](http://kata.coderdojo.com/wiki/CoderDojo_Logos_and_Brand_Guidelines)

## NOTE

The D1Motor code tries to talk with a Wemos D1 Motor Shield: unfortunately, this piece of hardware comes with a buggy firmware, so the application _won't_ work with it out of the box.

Luckily, someone has taken care of this: a nice project at [Hackaday.io](https://hackaday.io/project/18439-motor-shield-reprogramming) has released an updated firmware that solves the issue!  
Its installation requires a USB-TTL converter, like [this](https://www.amazon.co.uk/Conversion-adapter-TOOGOO-FT232RL-Red/dp/B00YMIIOWW/ref=sr_1_1), and a bit of tinkering, but it's otherwise easily doable.
