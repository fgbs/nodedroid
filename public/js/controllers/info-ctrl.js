/**
 * Info page controller
 */

angular.module('App')
  .controller('InfoCtrl', ['$scope', '$socket', InfoCtrl]);

function InfoCtrl($scope, $socket) {
  var lastCore = null;
  $scope.cpus = [];

  var core = {
    name: '',
    labels: [],
    series: [],
    data: [],
    options: {animation: false}
  };

  var addCore = function (data) {
    if (data['cpu'] == lastCore) {
      // append
      console.log('append');

    } else {
      // insert
      var labels = [];
      var series = [];
      var points = [];

      for (var key in data['metric']) {
        labels.push(data['time']);
        series.push(key);
        var point = [data['metric'][key]];
        points.push(point);
      }

      console.log({
        name: data['cpu'],
        labels: labels,
        series: series,
        data: points,
        options: {animation: false}
      });

      // $scope.cpus.push({
      //   name: data['cpu'],
      //   labels: labels,
      //   series: series,
      //   data: points,
      //   options: {animation: false}
      // })
      lastCore = data['cpu'];
    }
  }

  $socket.on('cpu', function (data) {
    //$scope.serverResponse = data;
    //console.log(data);
    addCore(data);
  });

};