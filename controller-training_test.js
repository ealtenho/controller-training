describe('controller training', function() {
  describe('addManipulationListener()', function() {
    it('should patch the functions of Element.prototype', function() {
      var objectProperties = Object.getOwnPropertyNames(Element.prototype);
      var testProperty = objectProperties[0];
      var originalFunction = Element.prototype[testProperty];
      expect(Element.prototype[testProperty]).toBe(originalFunction);
      controllerTrainer.addManipulationListener();
      expect(Element.prototype[testProperty]).not.toBe(originalFunction);
      controllerTrainer.removeManipulationListener();
    });


    it('should patch the functions of Element.prototype to call handleManipulation()', function() {
      spyOn(controllerTrainer, 'handleManipulation');
      controllerTrainer.addManipulationListener();
      expect(controllerTrainer.handleManipulation).not.toHaveBeenCalled();
      var element = document.createElement('a');
      element.getAttribute('NamedNodeMap');
      expect(controllerTrainer.handleManipulation).toHaveBeenCalled();
      controllerTrainer.removeManipulationListener();
    });
  });
  describe('collectProperties()', function() {
    it('should collect the unpatched properties of Element.prototype', function() {
      var objectPropertyNames = Object.getOwnPropertyNames(Element.prototype);
      var collectedProperties = collectProperties();
      expect(collectedProperties[objectPropertyNames[0]]).toBe(Element.prototype[objectPropertyNames[0]]);
    });
  });
  describe('removeManipulationListener()', function() {
    it('should remove the patch from functions on Element.prototype', function() {
      var objectProperties = Object.getOwnPropertyNames(Element.prototype);
      var testProperty = objectProperties[0];
      var originalFunction = Element.prototype[testProperty];
      expect(Element.prototype[testProperty]).toBe(originalFunction);
      controllerTrainer.addManipulationListener();
      expect(Element.prototype[testProperty]).not.toBe(originalFunction);
      controllerTrainer.removeManipulationListener();
      expect(Element.prototype[testProperty]).toBe(originalFunction);
    });
  });
});