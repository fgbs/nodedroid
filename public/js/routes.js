'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
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
]);