// Mongoose OS Playground JavaScript for the browser

var platform = '';
var host = '';
var touchpad_init = false;
var motor_init = false;

// Common call to RPC services on the board
function callRPCService(cmd, params, callback) {
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.response);
    }
  };
  
  xhttp.open('POST', 'rpc/' + cmd, true);
  xhttp.setRequestHeader('Cache-Control','no-cache');
  xhttp.setRequestHeader('Accept','application/json');
  xhttp.responseType = 'json';
  xhttp.send(JSON.stringify(params));
}

// Discover which platform we're using, to enable/disable features
function startup() {
  callRPCService('Config.Get',{}, function(response) {
    if (response !== undefined) {
      platform = response.device.platform;
      console.log('Platform is: ' + platform);
      
      if (platform === 'esp8266') {
        // Disable Touchpad
        var tElement = document.getElementById("Touchpad");
        
        tElement.innerHTML = '';
        tElement.style.backgroundColor = "transparent";
      } else if (platform === 'esp32') {
        // Disable D1 Motor Shield
        var bElement = document.getElementById("D1Motor");
        
        bElement.innerHTML = '';
        bElement.style.backgroundColor = "transparent";
      }
      
      var mac_id = (response.device.id.split("_"))[1];
      var dns_host = response.dns_sd.host_name;
      
      host = dns_host.replace('??????',mac_id) + '.local';
      document.getElementById("hostname").innerHTML = host;
    }
  });
}

// Read a value from GPIO
function gpioReadValue() {
  var pin = parseInt(document.getElementById("GPIO.pin").value);
  
  callRPCService('GPIO.Read',{pin:pin}, function(response) {
    if (response !== undefined) {
      if (response.error !== undefined) {
        alert(response.message);
      } else {
        document.getElementById("GPIO.value").value = response.value;
      }
    }
  });
}

// Write a value to GPIO
function gpioWriteValue() {
  var pin = parseInt(document.getElementById("GPIO.pin").value);
  var value = parseInt(document.getElementById("GPIO.value").value);
  
  callRPCService('GPIO.Write',{pin:pin, value:value}, function(response) {
      if (response !== undefined && response.error !== undefined) {
        alert(response.message);
      }
  });
}

// Read a value from ADC
function adcReadValue() {
  var pin = parseInt(document.getElementById("ADC.pin").value);
  
  callRPCService('ADC.Enable',{pin:pin}, function(response) {
    if (response === undefined) {
      return;
    }
    callRPCService('ADC.Read',{pin:pin}, function(response) {
      if (response !== undefined) {
        if (response.error !== undefined) {
          alert(response.message);
        } else {
          document.getElementById("ADC.value").value = response.value;
        }
      }
    });
  });
}

// Write a value to PWM
function pwmWriteValue() {
  var pin = parseInt(document.getElementById("PWM.pin").value);
  var value = parseInt(document.getElementById("PWM.value").value);
  
  callRPCService('PWM.Set',{pin:pin, frequency:100, duty:(value / 100.0)}, function(response) {
      if (response !== undefined && response.error !== undefined) {
        alert(response.message);
      }
  });
}

// Write an angle to servo
function servoWriteAngle() {
  var pin = parseInt(document.getElementById("Servo.pin").value);
  var angle = parseInt(document.getElementById("Servo.value").value);
  
  callRPCService('Servo.Set',{pin:pin, angle: angle}, function(response) {
      if (response !== undefined && response.error !== undefined) {
        alert(response.message);
      }
  });
}

// Read a value from Touchpad (if enabled)
function touchReadValue() {
  if (!touchpad_init) {
    callRPCService('Touch.Enable', {enable:true}, function(response) {
      if (response === undefined) {
        return;
      }
      touchpad_init = true;
      touchReadValue();
    });
  } else {
    var pin = parseInt(document.getElementById("Touch.pin").value);
    
    callRPCService('Touch.Read',{pin:pin}, function(response) {
      if (response !== undefined) {
        if (response.error !== undefined) {
          alert(response.message);
        } else {
          document.getElementById("Touch.value").value = response.value;
        }
      }
    });
  }
}

// Move the motor
function motorWriteSpeed() {
  var motor = parseInt(document.getElementById("D1Motor.motor").value);
  
  if (!motor_init) {
    callRPCService('D1Motor.Enable', {motor:motor, frequency: 1000}, function(response) {
      if (response === undefined) {
        return;
      }
      motor_init = true;
      motorWriteSpeed();
    });
  } else {
    var speed = parseInt(document.getElementById("D1Motor.speed").value);
    var dir = 2;
    
    if (speed < 0) {
      speed = -speed;
      dir = 1;
    } else if (speed === 0) {
      dir = 0;
    }
    callRPCService('D1Motor.Move',{motor:motor, dir:dir, speed: speed}, function(response) {
      if (response !== undefined && response.error !== undefined) {
        alert(response.message);
      }
    });
  }
}

// Reboots the microcontroller
function rebootDevice() {
  callRPCService('Sys.Reboot',{delay_ms:500}, function(response) {
      if (response !== undefined && response.error !== undefined) {
        alert(response.message);
      }
      touchpad_init = false;
      motor_init = false;
  });
}

