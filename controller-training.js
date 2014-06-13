addManipulationListener = function() {
  var objectProperties = Object.getOwnPropertyNames(Element.prototype);
  objectProperties.forEach(function(prop) {
    var original = Element.prototype[prop];
    if(typeof original === 'function') {
      Element.prototype[prop] = function () {
        console.log('DOM Manipulation');
        return original.apply(this, arguments);
      };
    }
  });
}


