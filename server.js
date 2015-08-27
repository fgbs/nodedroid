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


/**
 * ADB Magic
 */
var Promise = require('bluebird');
var adb = require('adbkit');
var readline = require('readline');
var client = adb.createClient();


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




// get cpu stats
getProcStat = function(callback) {
  client.listDevices()
    .then(function(devices) {
      return Promise.filter(devices, function(device) {
          client.openProcStat(device.id)
              .then(function(procs) {
                return callback(procs);
                  //console.log(procs);
                  //procs.on('load', function(st) {
                  //    console.log(st)
                  //})
              })
      })
    })
    .catch(function(err) {
      console.error('Something went wrong:', err.stack)
    });
};

this.getCpus = function () {
  return getProcStat(function(result) {
    var item, _i, _len;
    for (_i = 0, _len = result.length; _i < _len; _i++) {
      item = result[_i];
      if (typeof io !== "undefined" && io !== null) {
        io.sockets.emit('chart', {
          chartData: item
        });
      }
    }
  });
};





/**
 * Start Express server.
 */
if (!module.parent) {
  http_server = app.listen(app.get('port'));
  listener = io.listen(http_server);
  console.log("Express server listening on port %d", app.get('port'));
}

listener.sockets.on('connection', function(socket) {

  getProcStat();

  return socket.on('disconnect', function() {});
});

