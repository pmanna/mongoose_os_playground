load('api_esp32_touchpad.js');

// Touch RPC calls
RPC.addHandler('Touch.Enable', function(args) {
  if (typeof(args) === 'object' && typeof(args.enable) === 'boolean') {
  	if (args.enable) {
      TouchPad.init();
      TouchPad.setVoltage(TouchPad.HVOLT_2V4, TouchPad.LVOLT_0V8, TouchPad.HVOLT_ATTEN_1V5);
    } else {
      TouchPad.deinit();
    }
    
  	return {enable:args.enable};
  } else {
    return {error: -1, message: 'Bad request. Expected: {"enable": Bool}'};
  }
});

RPC.addHandler('Touch.Read', function(args) {
  if (typeof(args) === 'object' && typeof(args.pin) === 'number') {
    let ts = TouchPad.GPIO[args.pin];
    
    if (ts === undefined) {
      return {error: -2, message: 'Invalid Pin: not touch-enabled'};
    } else {
      TouchPad.config(ts, 0);
      Sys.usleep(100000);
      
      return {touch_pin:ts,value: TouchPad.read(ts)};
    }
  } else {
    return {error: -1, message: 'Bad request. Expected: {"pin": num}'};
  }
});
