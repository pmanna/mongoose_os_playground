load('api_config.js');
load('api_gpio.js');
load('api_sys.js');
load('api_rpc.js');
load('api_pwm.js');
load('api_adc.js');
load('api_esp32_touchpad.js');

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
