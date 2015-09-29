/**
 * Info page controller
 */

angular
  .module('App')
  .controller('InfoCtrl', ['$scope', '$socket', InfoCtrl]);

function InfoCtrl($scope, $socket) {
  var colors = d3.scale.category10();
  var lastCore = null;
  $scope.cpus = [];

  var addCore = function (data) {
    if (data['cpu'] == lastCore) {
      // append
      var points = [];

      for (var key in data['metric']) {
        //console.log(data['metric'][key]);
        var point = {}
        var value = []

        value.push([
          data['metric'][key]['time'], 
          data['metric'][key]['value']
        ]);
        
        point[data['metric'][key]['key']] = value

        console.log(point);
        points.push(point);
      }

      for (var cpu = 0; cpu < $scope.cpus.length; cpu++) {
        if ($scope.cpus[cpu]['label'] == lastCore) {
          var dat = $scope.cpus[cpu]['data'];
          console.log(lastCore + ': ');
          for (var D in dat) {
            for (var P in dat[D]) {
              //console.log(points);
              //console.log(dat[D][P]);
            }
          }
        }
      }
      //console.log(points);

    } else {
      // insert
      var points = [];

      for (var key in data['metric']) {
        //console.log(data['metric'][key]);
        var point = {
          'key': data['metric'][key]['key'],
          'values': []
        }
        point['values'].push([
          data['metric'][key]['time'], 
          data['metric'][key]['value']
        ])
        points.push(point);
      }

      $scope.cpus.push({
        label: data['cpu'],
        data: points
      });

      /*
      for (var key in data['metric']) {
        var point = {
          'key': key,
          'values': []
        };
        point['values'].push([data['metric']['time'], data['metric'][key]])
        points.push(point);
      }

      console.log(points);

      $scope.cpus.push({
        label: data['cpu'],
        data: points
      });
      */

      lastCore = data['cpu'];
      console.log(lastCore);
    }
  }

  $socket.on('cpu', function (data) {
    addCore(data);
  });

};