/**
 * Info page controller
 */

angular.module('App')
  .controller('InfoCtrl', ['$scope', '$socket', InfoCtrl]);

function InfoCtrl($scope, $socket) {
  var colors = d3.scale.category10();
  var lastCore = null;
  $scope.cpus = [];

  var addCore = function (data) {
    if (data['cpu'] == lastCore) {
      // append
      for (var cpu=0; cpu < $scope.cpus.length; cpu++) {
        if ($scope.cpus[cpu]['label'] == data['cpu']) {
          var point = {
            x: data['time']
          }
          for (var key in data['metric']) {
            point[key] = data['metric'][key];
          }
          $scope.cpus[cpu]['data'].push(point);
          console.log($scope.cpus[cpu]);
        }
      }
    } else {
      // insert
      var points = [];
      var series = [];

      var point = {
        x: data['time']
      }
      for (var key in data['metric']) {
        point[key] = data['metric'][key];
        series.push({
          axis: 'y',
          type: 'line',
          y: key,
          label: key,
          color: colors(Math.floor(Math.random() * (10 - 1 + 1) + 1))
        })
      }
      points.push(point);

      $scope.cpus.push({
        label: data['cpu'],
        dataType: 'timed',
        data: points,
        options: {
          axes: {
            x: {key: 'x', type: 'date'},
            y: {type: 'linear'}
          },
          series: series,
          tooltip: {mode: 'scrubber', formatter: function(x, y, series) {
            return moment(x).fromNow() + ' : ' + y;
          }}
        }
      });
      lastCore = data['cpu'];
    }
  }

  $socket.on('cpu', function (data) {
    //$scope.serverResponse = data;
    //console.log(data);
    addCore(data);
  });

};