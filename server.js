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
var bus = require('simplebus').createBus(1000);

/**
 * ADB Magic
 */
var Promise = require('bluebird');
var adb = require('adbkit');
var readline = require('readline');
var client = adb.createClient();

var adbapi = require('./modules/adbapi.js');
var adb = adbapi();

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


/**
 * start tracking device
 */
adb.trackDevices(bus);


/**
 * Start Express server.
 */
if (!module.parent) {
  http_server = app.listen(app.get('port'));
  listener = io.listen(http_server);
  console.log("Express server listening on port %d", app.get('port'));
}

listener.sockets.on('connection', function(socket) {
  // messages from UI
  socket.on('down', function(data) {
    bus.post(data);
  });

  // messages to UI
  bus.subscribe(null, function(msg) {
    socket.emit('up', msg);
  })

  return socket.on('disconnect', function() {});
});