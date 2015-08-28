/**
 * Info page controller
 */

angular.module('App')
  .controller('InfoCtrl', ['$scope', '$socket', InfoCtrl]);

function InfoCtrl($scope, $socket) {

  $socket.on('cpu', function (data) {
    //$scope.serverResponse = data;
    console.log(data);
  });

  $scope.cpus = [{
    name: 'cpu0',
    labels: [
      "16:10:00", 
      "16:20:00", 
      "16:30:00", 
      "16:40:00", 
      "16:50:00", 
      "17:00:00", 
      "17:10:00"
      ],
    series: ['user', 'system', 'iowait'],
    data: [[65, 59, 80, 81, 56, 55, 40], [28, 48, 40, 19, 86, 27, 90]],
    options: {animation: false}
  },{
    name: 'cpu1',
    labels: [
      "16:10:00", 
      "16:20:00", 
      "16:30:00", 
      "16:40:00", 
      "16:50:00", 
      "17:00:00", 
      "17:10:00"
      ],
    series: ['user', 'system', 'iowait'],
    data: [[65, 59, 80, 81, 56, 55, 40], [28, 48, 40, 19, 86, 27, 90]],
    options: {animation: false}
  }];
};


