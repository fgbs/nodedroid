/**
 * Alerts Controller
 */

angular
  .module('App')
  .controller('AlertsCtrl', ['$scope', '$socket', '$modal', AlertsCtrl]);

function AlertsCtrl($scope, $socket, $modal) {
  $scope.data = {};

  var open = function() {
    $scope.modalInstance = $modal.open({
      templateUrl: 'partials/alert.html',
      controller: ModalInstanceCtrl,
      backdrop: 'static',
      keyboard: false,
      backdropClick: false,
      size: 'lg',
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });

    $scope.modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
        //alert( $scope.selected);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

  var close = function() {
    $scope.modalInstance.close($scope.data);
    $scope.data = {};
  };

  $scope.$bus.subscribe(
    'device.status',
    function(data) {
      console.log('it worked', data);
      if (!data.data.connected) {
        $scope.data = data.data;
        open();
      } else {
        close();
        var message = {
          channel: 'device',
          topic: 'device.action',
          data: {
            command: 'start'
          }
        };
        $scope.$bus.publish(message.topic, message);
      }
    }
  );
};

var ModalInstanceCtrl = function ($scope, $modalInstance, data) {
  $scope.data = data;
  $scope.close = function(/*result*/){
    $modalInstance.close($scope.data);
  };
};