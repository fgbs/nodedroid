/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var path = require('path');
var io = require('socket.io');
var moment = require('moment');
var exec = require('child_process').exec
var favicon = require('serve-favicon');


/**
 * ADB Magic
 */
var Promise = require('bluebird');
var adb = require('adbkit');
var readline = require('readline');
var client = adb.createClient();

var adbapi = require('./adbapi.js');

var _this = this;

/**
 * Create Express server.
 */
var app = module.exports = express();


/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.locals.pretty = false;


/**
 * routes
 */
app.get('/', function(req, res){
  res.redirect('/index.html');
});


/**
 * 404 Error Handler.
 */
app.use(function(req, res) {
  res.status(404);
  res.render('404', {title: 'Error 404 - Page Not Found'});
});


/**
 * 500 Error Handler.
 */
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));


//console.log(adbapi);

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
        point = {
          cpu: key,
          time: new Date(), //moment().format(),
          metric: {
            'user': proc[key]['user'],
            'system': proc[key]['system'],
            'iowait': proc[key]['iowait']
          }
        }
        console.log(point)
        socket.emit('cpu', point);
      }
    })
  });
};

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


/**
 * Start Express server.
 */
if (!module.parent) {
  http_server = app.listen(app.get('port'));
  listener = io.listen(http_server);
  console.log("Express server listening on port %d", app.get('port'));
}

listener.sockets.on('connection', function(socket) {
  _this.getCpus(socket);
  return socket.on('disconnect', function() {});
});

//setInterval(getFramebuffer, 1000);