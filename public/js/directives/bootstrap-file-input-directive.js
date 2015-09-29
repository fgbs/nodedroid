/**
 * Bootstrap File Input directive wrapper.
 */
angular
  .module('App')
  .directive('btFileInput', btFileInput);

function btFileInput() {
  return {
    restrict: 'AEC',
    replace: true,
    link: function (scope, element, attrs) {
      element.fileinput(attrs);
    }
  }
};