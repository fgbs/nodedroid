'use strict';

angular.module('App', [
  'ui.bootstrap', 'ui.router', 'ngCookies', 
  'socket.io', 'nvd3ChartDirectives', 
  'ngTable']);

/**
 * Route configuration for the RDash module.
 */
angular.module('App')
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      // For unmatched routes
      $urlRouterProvider.otherwise('/');

      // Application routes
      $stateProvider
        .state('index', {
          url: '/',
          templateUrl: 'partials/info.html'
        })
        .state('screen', {
          url: '/screen',
          templateUrl: 'partials/screen.html'
        })
        .state('package', {
          url: '/package',
          templateUrl: 'partials/package.html'
        })
        .state('term', {
          url: '/term',
          templateUrl: 'partials/term.html'
        });
    }
  ])
  .config(function ($socketProvider) {
    $socketProvider.setConnectionUrl('http://localhost:3000');
  })
  .config(function ($provide) {
    $provide.decorator('$rootScope', function ($delegate) {
        var rootScope = $delegate;

        Object.defineProperty(rootScope.constructor.prototype, '$bus', {
            get: function get() {
                var _this = this;

                return {
                    publish: function publish(msg, data) {
                        data = data || {};
                        // emit goes to parents, broadcast goes down to children
                        // since rootScope has no parents, this is the least noisy approach
                        // however, with the caveat mentioned below
                        rootScope.$emit(msg, data);
                    },
                    subscribe: function subscribe(msg, func) {
                        // ignore the event.  Just want the data
                        var unbind = rootScope.$on(msg, function (event, data) {
                            return func(data);
                        });
                        // being able to enforce unbinding here is why decorating rootscope
                        // is preferred over DI of an explicit bus service
                        _this.$on('$destroy', unbind);
                    }
                };
            }
        });

        Object.defineProperty(rootScope.constructor.prototype, '$smartWatch', {
            get: function get() {
                var _this2 = this;

                return function (expression, handler) {
                    return _this2.$watch(expression, function (newValue, oldValue) {
                        if (oldValue !== newValue) handler();
                    }, true);
                };
            }
        });

        return rootScope;
    });
  });