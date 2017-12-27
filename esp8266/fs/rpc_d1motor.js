load('d1motor.js');

// D1 Mini Motor RPC calls
RPC.addHandler('D1Motor.Enable', function(args) {
  if (typeof(args) === 'object' &&
    typeof(args.motor) === 'number' && typeof(args.frequency) === 'number') {
    let address = 0x30;
    
    if (typeof(args.address) === 'number') {
      address = args.address;
    }
    return D1Motor.create(address, args.motor, args.frequency);
  } else {
    return {error: -1, message: 'Bad request. Expected: {["address": n1,]"motor": 0-1,"frequency": n2}'};
  }
});

RPC.addHandler('D1Motor.Move', function(args) {
  if (typeof(args) === 'object' && typeof(args.speed) === 'number' &&
    typeof(args.motor) === 'number' && typeof(args.dir) === 'number') {
    let address = 0x30;
    
    if (typeof(args.address) === 'number') {
      address = args.address;
    }
    let handle = {address:address,motor:args.motor};
    
    return {success: D1Motor.move(handle,args.dir,args.speed)};
  } else {
    return {error: -1, message: 'Bad request. Expected: {["address": n1,]"motor": 0-1,"dir": 0-3,"speed": 0-100}'};
  }
});
