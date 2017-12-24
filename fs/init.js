load('api_config.js');
load('api_gpio.js');
load('api_sys.js');
load('api_rpc.js');
load('api_pwm.js');
load('api_adc.js');
load('api_esp32_touchpad.js');

// Ensure mDNS is enabled
if (!Cfg.get('dns_sd.enable')) {
  Cfg.set({dns_sd:{enable:true}});
  
  print("Reset to active mDNS");
  
  Sys.reboot(100000);
}

// Touch RPC calls
RPC.addHandler('Touch.Enable', function(args) {
  if (typeof(args) === 'object' && typeof(args.enable) === 'boolean') {
    TouchPad.init();
    TouchPad.setVoltage(TouchPad.HVOLT_2V4, TouchPad.LVOLT_0V8, TouchPad.HVOLT_ATTEN_1V5);
  } else {
    TouchPad.deinit();
  }
    
  return {success:true};
});

RPC.addHandler('Touch.Read', function(args) {
  if (typeof(args) === 'object' && typeof(args.pin) === 'number') {
    let ts = TouchPad.GPIO[args.pin];
    
    if (ts === undefined) {
      return {error: -2, message: 'Invalid Pin: not touch-enabled'};
    } else {
      TouchPad.config(ts, 0);
      Sys.usleep(100000);
      
      return {pin:ts,value: TouchPad.read(ts)};
    }
  } else {
    return {error: -1, message: 'Bad request. Expected: {"pin": num}'};
  }
});

// ADC RPC calls
RPC.addHandler('ADC.Enable', function(args) {
  if (typeof(args) === 'object' && typeof(args.pin) === 'number') {
    return {success: ADC.enable(args.pin)};
  } else {
    return {error: -1, message: 'Bad request. Expected: {"pin": num}'};
  }
});

RPC.addHandler('ADC.Read', function(args) {
  if (typeof(args) === 'object' && typeof(args.pin) === 'number') {
    return {value: ADC.read(args.pin)};
  } else {
    return {error: -1, message: 'Bad request. Expected: {"pin": num}'};
  }
});

// PWM RPC call
RPC.addHandler('PWM.Set', function(args) {
  let frequency = 50;
  let duty = 0.5;
  
  if (typeof(args) === 'object' && typeof(args.pin) === 'number') {
    if (typeof(args.frequency) === 'number' && args.frequency > 0) {
      frequency = args.frequency;
    }
     if (typeof(args.duty) === 'number' && args.duty >= 0.0 && args.duty <= 1.0) {
      duty = args.duty;
    }
   return {success: PWM.set(args.pin,frequency,duty)};
  } else {
    return {error: -1, message: 'Bad request. Expected: {"pin": num[,"frequency":N,"duty":N]}'};
  }
});

RPC.addHandler('Servo.Set', function(args) {
  let frequency = 50;
  let dutyMin = 0.025;
  let dutyRange = 0.09;
  
  if (typeof(args) === 'object' && typeof(args.pin) === 'number' && typeof(args.angle) === 'number') {
    if (args.angle >= 0 && args.angle <= 180) {
      return {success: PWM.set(args.pin,frequency,dutyMin + dutyRange * (args.angle / 180.0))};
    }
  } else {
    return {error: -1, message: 'Bad request. Expected: {"pin": num,"angle":N}'};
  }
});

// Additional RPC call to switch between AP & STA
RPC.addHandler('Wifi.Enable', function(args) {
  if (typeof(args) === 'object' && typeof(args.enable) === 'boolean') {
    if (args.enable && typeof(args.ssid) === 'string' && typeof(args.pass) === 'string') {
      Cfg.set({
        wifi: {
          sta: {enable: true,ssid:args.ssid,pass:args.pass},
          ap: {enable: false}
        }
      });
    } else {
      Cfg.set({wifi: {sta: {enable: args.enable}, ap: {enable: !args.enable}}});
    }
    Sys.reboot(100000);
    
    return {enabled:Cfg.get('wifi.sta.enable')};
  } else {
    return {error: -1, message: 'Bad request. Expected: {"enable":Bool[,"ssid":"name","pass":"xxx"]}'};
  }
});

// Button is wired to GPIO pin 0
// When brought to 0, it resets WiFi to AP
GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
  Cfg.set({wifi: {sta: {enable: false}, ap: {enable: true}}});  // Enable WiFi AP mode, disable STA
  
  print("Reset to Access Point mode");
  
  Sys.reboot(100000);
}, null);
