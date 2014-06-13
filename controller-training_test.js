describe('controller training', function() {
  describe('addManipulationListener()', function() {
    it('should patch the functions of Element.prototype', function() {
      var objectProperties = Object.getOwnPropertyNames(Element.prototype);
      var testProperty = objectProperties[0];
      var originalFunction = Element.prototype[testProperty];
      expect(Element.prototype[testProperty]).toBe(originalFunction);
      controllerTrainer.addManipulationListener();
      expect(Element.prototype[testProperty]).not.toBe(originalFunction);
    });
    it('should patch the functions of Element.prototype to call handleManipulation()', function() {
      spyOn(controllerTrainer, 'handleManipulation');
      controllerTrainer.addManipulationListener();
      expect(controllerTrainer.handleManipulation).not.toHaveBeenCalled();
      var element = document.createElement('a');
      element.getAttribute('NamedNodeMap');
      expect(controllerTrainer.handleManipulation).toHaveBeenCalled();
    });
  });
});