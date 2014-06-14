collectProperties = function() {
    var objectProperties = {};
    var objectPropertyNames = Object.getOwnPropertyNames(Element.prototype);
    objectPropertyNames.forEach(function(prop) {
      objectProperties[prop] = Element.prototype[prop];
    });
    return objectProperties;
};

var originalProperties = collectProperties();

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
  }
};

