/**
 * Widget Directive
 */

angular
    .module('App')
    .directive('rdWidget', rdWidget);

function rdWidget() {
    var directive = {
        transclude: true,
        template: '<div class="widget" ng-transclude></div>',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
        /* */
    }
};


/**
 * Widget Header Directive
 */

angular
    .module('App')
    .directive('rdWidgetHeader', rdWidgetTitle);

function rdWidgetTitle() {
    var directive = {
        requires: '^rdWidget',
        scope: {
            title: '@',
            icon: '@'
        },
        transclude: true,
        template: '<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',
        restrict: 'E'
    };
    return directive;
};


/**
 * Widget Body Directive
 */

angular
    .module('App')
    .directive('rdWidgetBody', rdWidgetBody);

function rdWidgetBody() {
    var directive = {
        requires: '^rdWidget',
        scope: {
            loading: '@?',
            classes: '@?'
        },
        transclude: true,
        template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
        restrict: 'E'
    };
    return directive;
};


/**
 * Widget Footer Directive
 */

angular
    .module('App')
    .directive('rdWidgetFooter', rdWidgetFooter);

function rdWidgetFooter() {
    var directive = {
        requires: '^rdWidget',
        transclude: true,
        template: '<div class="widget-footer" ng-transclude></div>',
        restrict: 'E'
    };
    return directive;
};