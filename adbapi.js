(function() {
  var Promise = require('bluebird');
  var adb = require('adbkit');
  var readline = require('readline');
  var fs = require('fs');

  AdbApi = (function() {
    function AdbApi(options) {
      var opts = options || {};
      var client = adb.createClient();
    };

    AdbApi.connect = function(options) {
      
      return 
    };

    return AdbApi;

  })();

  module.exports = AdbApi;

}).call(this);


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