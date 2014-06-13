
var controllerTrainer = {
  addManipulationListener: function() {
    var objectProperties = Object.getOwnPropertyNames(Element.prototype);
    objectProperties.forEach(function(prop) {
      var original = Element.prototype[prop];
      if(typeof original === 'function') {
        Element.prototype[prop] = function () {
          controllerTrainer.handleManipulation();
          return original.apply(Element.prototype, arguments);
        };
      }
    });
  },

  handleManipulation: function() {
    return 'Manipulation Handled';
  }
};

