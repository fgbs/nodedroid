var Promise = require('bluebird');
var adb = require('adbkit');
var readline = require('readline');
var fs = require('fs');
var sys = require('sys');
var procs = require('child_process');

function AdbApi(options) {
  if (!(this instanceof AdbApi)) {
    return new AdbApi(options);
  }

  var _this = this;
  _this.opts = options || {};
  _this.client = adb.createClient();
  _this.device_connected = false;
  _this.device_id = null;


  return {
    startScreen: _this.startScreen,
    startNetwork: _this.startNetwork,
    trackDevices: function (bus) {
      _this.client.trackDevices()
        .then(function(tracker) {
          tracker.on('add', function(device) {
            console.log('Device %s was plugged in', device.id)
            _this.device_connected = true;
            _this.device_id = device.id
            _this.startNetwork();
            _this.startScreen();

            bus.post({
              channel: 'device',
              topic: 'device.status',
              data: {
                connected: true,
                mode: 'info', 
                title: 'INFO',
                msg: 'Device was plugged in'
              }
            });
          })
          tracker.on('remove', function(device) {
            console.log('Device %s was unplugged', device.id)
            _this.device_connected = false;
            _this.device_id = null;

            bus.post({
              channel: 'device',
              topic: 'device.status',
              data: {
                connected: false,
                mode: 'danger',
                title: 'ERROR',
                msg: 'Device was unplugged'
              }
            });
          })
          tracker.on('end', function() {
            console.log('Tracking stopped')
          })
        })
        .catch(function(err) {
          console.error('Something went wrong:', err.stack)
        })
    }
  }
};

AdbApi.prototype.startNetwork = function() {
  console.log('Starting network');
  var _this = this;

  procs.exec('', function(error, stdout, stderr) {
    console.log('stdout', stdout);
    console.log('stderr', stderr);
    console.log('error', error);
  });

  this.client.waitForDevice(this.device_id)
    .then(function(device) {
        _this.client.shell(device, 'su -c "ip route add default via 10.0.0.1"')
          .then(adb.util.readAll)
            .then(function(output) {
              console.log('[%s] %s', device, output.toString().trim())
            })

        _this.client.shell(device, 'su -c ndc resolver setnetdns ppp0 "" 8.8.8.8 8.8.8.4')
          .then(adb.util.readAll)
            .then(function(output) {
              console.log('[%s] %s', device, output.toString().trim())
            })
    })
    .catch(function(err) {
      console.error('Something went wrong:', err.stack)
    });
};

AdbApi.prototype.startScreen = function() {
  console.log('Starting screen');
  //console.log(this.client);
  // _this.client.shell(device.id, 'LD_LIBRARY_PATH=/data/local/tmp/minicap-devel /data/local/tmp/minicap-devel/minicap -P 1280x800@800x600/0')
  //    .then(adb.util.readAll)
  //      .then(function(output) {
  //        console.log('[%s] %s', device.id, output.toString().trim())
  //      })

  //console.log(this.client);
  // _this.client.forward(device.id, 'tcp:1717', 'localabstract:minicap')
  //   .then(function() {
  //     console.log('Setup minicap on "%s"', device.id)
  //   })
};

// AdbApi.prototype.startServices = function() {
//   startNetwork();
//   startScreen();
// };

// AdbApi.prototype.trackDevices = function(socket) {
//   this.client.trackDevices()
//     .then(function(tracker) {
//       tracker.on('add', function(device) {
//         console.log('Device %s was plugged in', device.id)
//         this.device_connected = true;
//         this.device_id = device.id
//         AdbApi.prototype.startNetwork();

//         socket.emit('up', {
//           channel: 'device',
//           topic: 'device.status',
//           data: {
//             connected: true,
//             mode: 'info', 
//             title: 'INFO',
//             msg: 'Device was plugged in'
//           }
//         });
//       })
//       tracker.on('remove', function(device) {
//         console.log('Device %s was unplugged', device.id)
//         this.device_connected = false;
//         this.device_id = null;

//         socket.emit('up', {
//           channel: 'device',
//           topic: 'device.status',
//           data: {
//             connected: false,
//             mode: 'danger',
//             title: 'ERROR',
//             msg: 'Device was unplugged'
//           }
//         });

//         //return
//       })
//       tracker.on('end', function() {
//         console.log('Tracking stopped')
//       })
//     })
//     .catch(function(err) {
//       console.error('Something went wrong:', err.stack)
//     })
// };





module.exports = AdbApi;




//console.log(adbapi);
/*
// get cpu stats
getProcStat = function(callback) {
  client.listDevices()
    .then(function(devices) {
      return Promise.filter(devices, function(device) {
          client.openProcStat(device.id)
              .then(function(procs) {
                return callback(procs);
              })
      })
    })
    .catch(function(err) {
      console.error('Something went wrong:', err.stack)
    });
};


this.getCpus = function (socket) {
  return getProcStat(function(result) {
    result.on('load', function (proc) {
      for (var key in proc) {
        var time = moment().unix();
        var point = {
          cpu: key,
          metric: [{
            'key': 'user',
            'time': time,
            'value': proc[key]['user']
          },{
            'key': 'system',
            'time': time,
            'value': proc[key]['system']
          },{
            'key': 'iowait',
            'time': time,
            'value': proc[key]['iowait']
          }]
        }
        console.log(point)
        socket.emit('cpu', point);
      }
    })
  });
};
*/













/*
dumpsys


netstats
meminfo
diskstats
cpuinfo
battery

*/

/*
var index = 0;

client.listDevices(function(err, devices) {
  devices.forEach(function(device) {
    client.framebuffer(device.id, "raw", function(err, fb_data) {
      if(err) {
        console.log("screencapture failed @", device.id, ":", err);
        return;
      }
      
      fb_data.on('drain', function(data) {
        console.log(data);
      });
      

      //var pngname = device.id+"-"+index+'.png';
      //index += 1;
      //var stream = fs.createWriteStream(pngname);
      //fb_data.pipe(stream);
    });
  });
});
*/

/*
getFramebuffer = function (callback) {
  client.listDevices()
    .then(function(devices) {
      return Promise.filter(devices, function(device) {
        client.framebuffer(device.id, "raw")
          .then(function(fb_data) {
            //console.log(fb_data);
            return callback(fb_data);
          });
          //var pngname = device.id+'.raw';
          //var stream = fs.createWriteStream(pngname);
          //console.log(stream);
          //fb_data.pipe(stream);
        });
    })
    .catch(function(err) {
      console.error('Something went wrong:', err.stack)
    })
}

getScreenshot = function () {
  return getFramebuffer(function(result) {
    result.on('read', function(data) {
      console.log(data);
    });
  });
};


getScreenshot();


/*
client.listDevices()
  .then(function(devices) {
    return Promise.filter(devices, function(device) {
        client.openProcStat(device.id)
            .then(function(procs) {
                //console.log(procs);
                procs.on('load', function(st) {
                    console.log(st)
                })
            })
    })
  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
  })
*/


/**
 * GET /api
 * List of API examples.
 *
exports.getApi = function(req, res) {
  client.listDevices()
    .then(function(devices) {
      return Promise.filter(devices, function(device) {
        return client.getFeatures(device.id)
          .then(function(features) {
            return features
          })
      })
    })
    .then(function(supportedDevices) {
      return supportedDevices;
    })
    .catch(function(err) {
      return { message: 'Something went wrong: ' }
    })
};

exports.getProcStats = function(req, res) {

};
*/

/*
getFramebuffer = function(callback) {
  client.listDevices()
    .then(function(devices) {
      return Promise.filter(devices, function(device) {
        client.framebuffer(device.id, 'jpg')
          .then(function(frame) {
            console.log(frame);
            return callback(frame)
          })
      })
    })
    .catch(function(err) {
      console.error('Something went wrong:', err.stack)
    });
};


this.getScreenshot = function (frame) {
  return getFramebuffer(function(result) {
    console.log(result);
  });
};

var mjpeg;

mjpeg = exec('',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
*/