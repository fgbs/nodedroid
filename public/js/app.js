'use strict';

angular.module('App', ['ui.bootstrap', 'ui.router', 'ngCookies', 'chart.js', 'io.service']);

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
        .state('proxy', {
          url: '/proxy',
          templateUrl: 'partials/proxy.html'
        })
        .state('term', {
          url: '/term',
          templateUrl: 'partials/term.html'
        });
    }
  ])
  .run(function (io) {
    io.init({
      ioServer: 'http://localhost:3000',
      apiServer: 'http://localhost:8080/api',
      ioEvent: 'io.response'
    });
  });