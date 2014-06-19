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
      var controllerZone = zone.fork({
        beforeTask: function() {
          //Patches prototypes and individual HTML elements
          //that represent the DOM APIs
          //Uses patchServices.listener as the parameter of the
          //function to be called when manipulation is detected.
          //Default patchServices.listener throws an error, but
          //patchServices.listener can be set to any function.
          patchServices.addManipulationListener(patchServices.listener);
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
