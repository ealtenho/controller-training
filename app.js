
angular.module('controllerApp', []).
  config(function ($provide) {
    $provide.decorator('$controller', function($delegate) {
      dump('controller');
      var controllerZone = zone.fork({
        beforeTask: function() {
          dump('before');
          patchServices.addManipulationListener(patchServices.listener);
        },
        afterTask: function() {
          dump('after');
          patchServices.removeManipulationListener();
        }
      });
      return controllerZone.bind($delegate);
    });
  });
