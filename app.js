angular.module('controllerApp', []).
  config(function ($provide) {
    this.listener = {
      testFunction: function() {
        return 'DOM Manipulation detected';
      }
    }

    $provide.decorator('$controller', function($delegate) {
      return function () {
        patchServices.prototypePatcher.addManipulationListener(listener.testFunction);
        var controller = $delegate.apply(this, arguments);
        patchServices.prototypePatcher.removeManipulationListener();
        return controller;
      };
    });
  });