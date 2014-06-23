/**
* Decorates $controller with a patching function to
* throw an error if DOM APIs are manipulated from
* within an Angular controller
*/
angular.module('controllerTrainer', []).
  config(function ($provide) {
    $provide.decorator('$controller', function($delegate, $injector) {
      //Implemented within a zone from zone.js in order
      //to account for asynchronous controller manipulation
      var controllerZone = zone.fork({
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
      return function(ctrl, locals) {

        // patch methods on $scope
        if (locals) {
          if (locals.$scope) {
            Object.keys(locals.$scope).forEach(function (prop) {
              if (prop[0] !== '$' && typeof locals.$scope[prop] === 'function') {
                locals.$scope[prop] = controllerZone.bind(locals.$scope[prop]);
              }
            });
          }
          if (locals.$timeout) {

          }
        }

        // body of controller
        patchServices.addManipulationListener();
        var ctrlInstance = $delegate.apply(this, arguments);
        patchServices.removeManipulationListener();

        // controller.test
        Object.keys(ctrlInstance).forEach(function (prop) {
          if (prop[0] !== '$' && typeof ctrlInstance[prop] === 'function') {
            ctrlInstance[prop] = controllerZone.bind(ctrlInstance[prop]);
          }
        });

        return ctrlInstance;
      };
    });
  });
