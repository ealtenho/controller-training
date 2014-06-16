patchProperties = function() {

};

collectProperties = function() {
    var objectProperties = {};
    var objectPropertyNames = Object.getOwnPropertyNames(Element.prototype);
    objectPropertyNames.forEach(function(prop) {
      objectProperties[prop] = Element.prototype[prop];
    });
    return objectProperties;
};

collectPropertiesNode = function() {
    var objectProperties = {};
    var objectPropertyNames = Object.getOwnPropertyNames(Node.prototype);
    objectPropertyNames.forEach(function(prop) {
      objectProperties[prop] = Node.prototype[prop];
    });
    return objectProperties;
};

collectPropertiesEventTarget = function() {
    var objectProperties = {};
    var objectPropertyNames = Object.getOwnPropertyNames(EventTarget.prototype);
    objectPropertyNames.forEach(function(prop) {
      objectProperties[prop] = EventTarget.prototype[prop];
    });
    return objectProperties;
};

var originalProperties = collectProperties();
var originalPropertiesNode = collectPropertiesNode();
var originalPropertiesEventTarget = collectPropertiesEventTarget();

var controllerTrainer = {
  addManipulationListener: function(givenFunction) {
    var objectProperties = Object.getOwnPropertyNames(Element.prototype);
    objectProperties.forEach(function(prop) {
      var original = Element.prototype[prop];
      if(typeof original === 'function') {
        Element.prototype[prop] = function () {
          givenFunction();
          return original.apply(this, arguments);
        };
      }
    });
    var nodeProperties = Object.getOwnPropertyNames(Node.prototype);
    nodeProperties.forEach(function(prop) {
      var originalNode = Node.prototype[prop];
      if(typeof originalNode === 'function') {
        Node.prototype[prop] = function () {
          givenFunction();
          return originalNode.apply(this, arguments);
        };
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
  handleManipulation: function() {
    return 'Manipulation Handled';
  },
  removeManipulationListener: function() {
    var objectProperties = Object.getOwnPropertyNames(Element.prototype);
    objectProperties.forEach(function(prop) {
      var alteredElement = Element.prototype[prop];
      if(typeof alteredElement === 'function') {
        Element.prototype[prop] = originalProperties[prop];
      }
    });

    var objectPropertiesNode = Object.getOwnPropertyNames(Node.prototype);
    objectPropertiesNode.forEach(function(prop) {
      var alteredElementNode = Node.prototype[prop];
      if(typeof alteredElementNode === 'function') {
        Node.prototype[prop] = originalPropertiesNode[prop];
      }
    });

    var objectPropertiesEventTarget = Object.getOwnPropertyNames(EventTarget.prototype);
    objectPropertiesEventTarget.forEach(function(prop) {
      var alteredElementEventTarget = EventTarget.prototype[prop];
      if(typeof alteredElementEventTarget === 'function') {
        EventTarget.prototype[prop] = originalPropertiesEventTarget[prop];
      }
    });
  }
};

