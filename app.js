
angular.module('controllerApp', []).
  config(function ($provide) {
    $provide.decorator('$controller', function($delegate) {
      var controllerZone = zone.fork({
        beforeTask: function() {
          patchServices.addManipulationListener(patchServices.listener);
        },
        afterTask: function() {
          patchServices.removeManipulationListener();
        }
      });
      return controllerZone.bind($delegate);
    });
  });
