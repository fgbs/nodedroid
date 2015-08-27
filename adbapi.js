var Promise = require('bluebird');
var adb = require('adbkit');
var readline = require('readline');


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
 */
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