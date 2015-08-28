/**
 * Socket.IO service
 */

var module = angular.module('socket.io', []);

module.provider('$socket', function $socketProvider() {
  var ioUrl = '';
  var ioConfig = {};

  function setOption(name, value, type) {
    if (typeof value != type) {
        throw new TypeError("'"+ name +"' must be of type '"+ type + "'");
    }
    ioConfig[name] = value;
  };

  this.setResource = function setResource(value) {
    setOption('resource', value, 'string');
  };
  this.setConnectTimeout = function setConnectTimeout(value) {
    setOption('connect timeout', value, 'number');
  };
  this.setTryMultipleTransports = function setTryMultipleTransports(value) {
    setOption('try multiple transports', value, 'boolean');
  };
  this.setReconnect = function setReconnect(value) {
    setOption('reconnect', value, 'boolean');
  };
  this.setReconnectionDelay = function setReconnectionDelay(value) {
    setOption('reconnection delay', value, 'number');
  };
  this.setReconnectionLimit = function setReconnectionLimit(value) {
    setOption('reconnection limit', value, 'number');
  };
  this.setMaxReconnectionAttempts = function setMaxReconnectionAttempts(value) {
    setOption('max reconnection attempts', value, 'number');
  };
  this.setSyncDisconnectOnUnload = function setSyncDisconnectOnUnload(value) {
    setOption('sync disconnect on unload', value, 'boolean');
  };
  this.setAutoConnect = function setAutoConnect(value) {
    setOption('auto connect', value, 'boolean');
  };
  this.setFlashPolicyPort = function setFlashPolicyPort(value) {
    setOption('flash policy port', value, 'number')
  };
  this.setForceNewConnection = function setForceNewConnection(value) {
    setOption('force new connection', value, 'boolean');
  };
  this.setConnectionUrl = function setConnectionUrl(value){
    if ('string' !== typeof value) {
      throw new TypeError("setConnectionUrl error: value must be of type 'string'");
    }
    ioUrl = value;
  }

  this.$get = function $socketFactory($rootScope) {
    var socket = io(ioUrl, ioConfig);
    return {
      on: function on(event, callback) {
        socket.on(event, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      off: function off(event, callback) {
        if (typeof callback == 'function') {
          socket.removeListener(event, callback);
        } else {
          socket.removeAllListeners(event);
        }
      },
      emit: function emit(event, data, callback) {
        if (typeof callback == 'function') {
          socket.emit(event, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        } else {
          socket.emit(event, data);
        }
      }
    };
  };
});




// angular.module('io.service', []).
//   factory('io', function ($http) {
//     var socket,
//         apiServer,
//         ioEvent,
//         watches = {};
 
//     return {
//       init: function (conf) {
//         apiServer = conf.apiServer;
//         ioEvent = conf.ioEvent;
//         socket = io.connect(conf.ioServer);
//         socket.on(ioEvent, function (data) {
//           return watches.hasOwnProperty(data.item) ? watches[data.item](data) : null;
//         })
//       },
//       emit: function (arguments) {
//         return $http.get(apiServer + '/request', {params: arguments});
//       },
//       watch: function (item, closure) {
//         watches[item] = closure;
//       },
//       unWatch: function (item) {
//         delete watches[item];
//       }
//     };
//   });