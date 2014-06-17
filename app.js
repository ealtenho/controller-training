angular.module('controllerApp', []).
  config(function ($provide) {
    var collectProperties = function() {
        var objectProperties = {};
        var objectPropertyNames = Object.getOwnPropertyNames(Element.prototype);
        objectPropertyNames.forEach(function(prop) {
          try {
            objectProperties[prop] = Element.prototype[prop];
          }
          catch(e) {
            dump('Access ' + prop + ' on Element');
            dump(e);
          }
        });
      return objectProperties;
    };

    var collectPropertiesNode = function() {
        var objectProperties = {};
        var objectPropertyNames = Object.getOwnPropertyNames(Node.prototype);
        objectPropertyNames.forEach(function(prop) {
          try {
            objectProperties[prop] = Node.prototype[prop];
          }
          catch(e) {
            dump('Access ' + prop + ' on Node');
            dump(e);
          }
        });
        return objectProperties;
    };

    var collectPropertiesEventTarget = function() {
        var objectProperties = {};
        var objectPropertyNames = Object.getOwnPropertyNames(EventTarget.prototype);
        objectPropertyNames.forEach(function(prop) {
          try {
            objectProperties[prop] = EventTarget.prototype[prop];
          }
          catch(e) {
            dump('Access ' + prop + ' on EventTarget');
            dump(e);
          }
        });
        return objectProperties;
    };

    this.patchMaker = {
        savedProperties: {},
        saveProp: function(element, prop) {
          this.savedProperties[prop] = element[prop];
        },
        properties: ['innerHTML', 'parentElement'],
        patchProperties: function(element, listener) {
        this.properties.forEach(function(prop) {
              patchMaker.saveProp(element, prop);
              Object.defineProperty(element, prop, {
                configurable: true,
                get: function() {
                  listener();
                  return element.prop;
                },
                set: function(newValue) {
                  listener();
                  element.prop = newValue;
                }
              });
          });
        },
        unPatch: function(element) {
          this.properties.forEach(function(prop) {
          Object.defineProperty(element, prop, {
                configurable: true,
                get: function() {
                  return patchMaker.savedProperties[prop];
                },
                set: function(newValue) {
                  element.prop = newValue;
                }
              });
          });
        }
      };

      this.prototypePatcher = {
        originalProperties: collectProperties(),
        originalPropertiesNode: collectPropertiesNode(),
        originalPropertiesEventTarget: collectPropertiesEventTarget(),
        addManipulationListener: function(givenFunction) {
          var objectProperties = Object.getOwnPropertyNames(Element.prototype);
          objectProperties.forEach(function(prop) {
            try {
              var original = Element.prototype[prop];
              if(typeof original === 'function') {
                Element.prototype[prop] = function () {
                  givenFunction();
                  return original.apply(this, arguments);
                };
              }
            }
            catch(e){
              dump('Access ' + prop + ' on Element');
              dump(e);
            }

          });
          var nodeProperties = Object.getOwnPropertyNames(Node.prototype);
          nodeProperties.forEach(function(prop) {
            try {
            var originalNode = Node.prototype[prop];
              if(typeof originalNode === 'function') {
                Node.prototype[prop] = function () {
                  givenFunction();
                  return originalNode.apply(this, arguments);
                };
              }
            }
            catch(e) {
              dump('Access ' + prop + ' on Node');
              dump(e);
            }
          });
          var eventTargetProperties = Object.getOwnPropertyNames(EventTarget.prototype);
          eventTargetProperties.forEach(function(prop) {
            var originalEventTarget = EventTarget.prototype[prop];
            if(typeof originalEventTarget === 'function') {
              EventTarget.prototype[prop] = function () {
                givenFunction();
                return originalEventTarget.apply(this, arguments);
              };
            }
          });
        },
        removeManipulationListener: function() {
          var objectProperties = Object.getOwnPropertyNames(Element.prototype);
          objectProperties.forEach(function(prop) {
            try{
            var alteredElement = Element.prototype[prop];
              if(typeof alteredElement === 'function') {
                Element.prototype[prop] = prototypePatcher.originalProperties[prop];
             }
            }
            catch(e) {
              dump('Access ' + prop + ' on Element');
              dump(e);
            }
          });

          var objectPropertiesNode = Object.getOwnPropertyNames(Node.prototype);
          objectPropertiesNode.forEach(function(prop) {
          try{
            var alteredElementNode = Node.prototype[prop];
            if(typeof alteredElementNode === 'function') {
              Node.prototype[prop] = prototypePatcher.originalPropertiesNode[prop];
            }
          }
          catch(e) {
            dump('Access ' + prop + ' on Node');
            dump(e);
          }
          });

          var objectPropertiesEventTarget = Object.getOwnPropertyNames(EventTarget.prototype);
          objectPropertiesEventTarget.forEach(function(prop) {
            var alteredElementEventTarget = EventTarget.prototype[prop];
            if(typeof alteredElementEventTarget === 'function') {
              EventTarget.prototype[prop] = prototypePatcher.originalPropertiesEventTarget[prop];
            }
          });
        }
      }

    function patch () {

      var testFunction = function() {
        return 'DOM Manipulation detected';
      }
      prototypePatcher.addManipulationListener(testFunction);
    };

    $provide.decorator('$controller', function($delegate) {
      return function () {
        patch();
        var controller = $delegate.apply(this, arguments);
        prototypePatcher.removeManipulationListener();
        return controller;
      };
    });
  });