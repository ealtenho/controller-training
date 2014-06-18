angular.module('controllerApp', []).
  config(function ($provide) {

    $provide.decorator('$controller', function($delegate) {
      return function () {
        patchServices.prototypePatcher.addManipulationListener(patchServices.listener);
        var controller = $delegate.apply(this, arguments);
        patchServices.prototypePatcher.removeManipulationListener();
        return controller;
      };
    });
  });