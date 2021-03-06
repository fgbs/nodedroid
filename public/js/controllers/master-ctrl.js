/**
 * Master Controller
 */

angular.module('App')
  .controller('MasterCtrl', ['$scope', '$cookieStore', '$socket', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $socket) {
  /**
   * Sidebar Toggle & Cookie Control
   */
  var mobileView = 992;

  $scope.getWidth = function() {
    return window.innerWidth;
  };

  $scope.$watch($scope.getWidth, function(newValue, oldValue) {
    if (newValue >= mobileView) {
      if (angular.isDefined($cookieStore.get('toggle'))) {
        $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
      } else {
        $scope.toggle = true;
      }
    } else {
      $scope.toggle = false;
    }
  });

  $scope.toggleSidebar = function() {
    $scope.toggle = !$scope.toggle;
    $cookieStore.put('toggle', $scope.toggle);
  };

  window.onresize = function() {
    $scope.$apply();
  };

  $scope.changeRoute = function(url, forceReload) {
    $scope = $scope || angular.element(document).scope();
    if(forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
      window.location = url;
    } else {
      $location.path(url);
      $scope.$apply();
    }
  };

  $socket.on('up', function (data) {
    $scope.$bus.publish(data.topic, data);
  });

  $scope.$bus.subscribe('device.action', function(data) {
    $socket.emit('down', data);
  });
};