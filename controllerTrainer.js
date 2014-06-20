/**
* Decorates $controller with a patching function to
* throw an error if DOM APIs are manipulated from
* within an Angular controller
*/
angular.module('controllerTrainer', []).
  config(function ($provide) {
    $provide.decorator('$controller', function($delegate) {
      //Implemented within a zone from zone.js in order
      //to account for asynchronous controller manipulation
      var controllerZone = zone.fork(Zone.longStackTraceZone).fork({
        beforeTask: function() {
          //Patches prototypes and individual HTML elements
          //that represent the DOM APIs.
          //Takes an optional parameter of a function to use as the
          //error indicator. Without the parameter patchServices.listener() is
          //used as the default patching function.
          patchServices.addManipulationListener();
        },
        afterTask: function() {
          //Removes the patching of prototypes and
          //individual HTML elements
          patchServices.removeManipulationListener();
        }
      });
      return controllerZone.bind($delegate);
    });
  });
