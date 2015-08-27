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


/**
 * Load controllers.
 */
var apiController = require('./adbapi');


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
 * Router
 */
var router = express.Router();

router.get('/', function(req, res) {
  apiController.getApi(req, res);
});





/**
 * routes
 */
app.get('/', function(req, res){
  res.redirect('/index.html');
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
//app.get('/api', apiController.getApi);





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
app.use(errorHandler());


/**
 * Start Express server.
 */

var io = require('socket.io').listen(app.listen(app.get('port')));

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: 'welcome to the chat' });
  socket.on('send', function (data) {
    io.sockets.emit('message', data);
  });
});

//app.listen(app.get('port'), function() {
//  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
//});
