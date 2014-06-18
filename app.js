
angular.module('controllerApp', []).
  config(function ($provide) {
    $provide.decorator('$controller', function($delegate) {
      dump('controller');
      var controllerZone = zone.fork({
        beforeTask: function() {
          dump('before');
          patchServices.prototypePatcher.addManipulationListener(patchServices.listener);
          patchServices.detectCreation(patchServices.listener);
        },
        afterTask: function() {
          dump('after');
          patchServices.prototypePatcher.removeManipulationListener(patchServices.listener);
          patchServices.undetectCreation();
        }
      });
      return controllerZone.bind($delegate);
    });
  });
