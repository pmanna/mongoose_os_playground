// Wemos D1 Mini Motor Shield library
load('api_i2c.js');

let D1Motor = {
  MOTOR_A: 0,
  MOTOR_B: 1,
  
  SHORT_BRAKE: 0,
  CCW: 1,
  CW: 2,
  STOP: 3,
  
  // TODO: Standby is not enabled at the moment
  
  // ## **`D1Motor.create(addr, motor, freq)`**
  // Create an initialized object with the given I2C address, motor and frequency
  // Return value: empty object on error, motor object to use later if successful
  create: function(addr, motor, freq) {
    let bus = I2C.get();
    
    // D1 Mini Motor Shield has specific pins for I2C
    // Should be enabled in mos.yml, in case it couldn't, uncomment this
    // Cfg.set({i2c:{sda_gpio:4,scl_gpio:5}});
    
    let result  = {};
    
    if (addr >= 0x2D && addr <= 0x30) {
      result.address  = addr;
    } else {
      return {};
    }
    
    result.motor = motor;
    result.frequency = freq;
    
    let bytes = '';
    
    bytes += chr((freq >> 24) & 0x0f);
    bytes += chr((freq >> 16) & 0xff);
    bytes += chr((freq >> 8) & 0xff);
    bytes += chr(freq & 0xff);
    
    if (I2C.write(bus, result.address, bytes, bytes.length, true)) {
      Sys.usleep(100000);
      
      return result;
    } else {
      return {};
    }
  },

  // ## **`D1Motor.move(handle, dir, val)`**
  // Moves defined motor in given direction & speed
  // The handle passed in should be the same returned by D1Motor.create()
  // Return value: none.
  move: function(handle, dir, speed) {
    let bus = I2C.get();
    let pwm = speed * 100;
    
    if (pwm < 0) {
      pwm = 0;
    } else if (pwm > 10000) {
      pwm = 10000;
    }
    if (handle.address === undefined || handle.motor === undefined ) {
      return;
    }
    
    let bytes = '';
    
    bytes += chr((handle.motor & 0xff) | 0x10);
    bytes += chr(dir & 0xff);
    bytes += chr((pwm >> 8) & 0xff);
    bytes += chr(pwm & 0xff);
    
    if (I2C.write(bus, handle.address, bytes, bytes.length, true)) {
      Sys.usleep(100000);
      return true;
    } else {
      return false;
    }
  },

  // ## **`D1Motor.stop(handle)`**
  // Stops defined motor
  // Return value: none.
  stop: function(handle) {
    this.move(handle,this.STOP,0);
  }
};
