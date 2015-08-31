var Promise = require('bluebird');
var adb = require('adbkit');
var readline = require('readline');
var fs = require('fs');

var client = adb.createClient();



/*
client.trackDevices()
  .then(function(tracker) {
    tracker.on('add', function(device) {
      console.log('Device %s was plugged in', device.id)
      client.getFeatures(device.id)
        .then(function(features) {
          console.log(features);
        })
    })
    tracker.on('remove', function(device) {
      console.log('Device %s was unplugged', device.id)
    })
    tracker.on('end', function() {
      console.log('Tracking stopped')
    })
  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
  })
*/


/*
dumpsys


netstats
meminfo
diskstats
cpuinfo
battery

*/


var index = 0;

client.listDevices(function(err, devices) {
  devices.forEach(function(device) {
    client.framebuffer(device.id, "raw", function(err, info, fb_data) {
      if(err) {
        console.log("screencapture failed @", device.id, ":", err);
        return;
      }
      
      console.log(info);
      var pngname = device.id+"-"+index+'.png';
      index += 1;
      var stream = fs.createWriteStream(pngname);
      fb_data.pipe(stream);
    });
  });
});





/*
client.listDevices()
  .then(function(devices) {
    return Promise.filter(devices, function(device) {

      client.framebuffer(device.id, "raw", function(err, info, fb_data) {
        if(err) {
          console.log("screencapture failed @", device.id, ":", err);
          return;
        }
        console.log(info);
        console.log(fb_data);
        var pngname = device.id+'.raw';
        var stream = fs.createWriteStream(pngname);
        console.log(stream);
        //fb_data.pipe(stream);
      });

        // client.framebuffer(device.id, 'raw')
        //   .then(function(shot) {
        //     console.log(shot);
        // });
    });
  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
  })
*/


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