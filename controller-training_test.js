describe('controller training', function() {
  describe('addManipulationListener()', function() {
    it('should patch the functions of Element.prototype', function() {
      var objectProperties = Object.getOwnPropertyNames(Element.prototype);
      var testProperty = objectProperties[0];
      var originalFunction = Element.prototype[testProperty];
      expect(Element.prototype[testProperty]).toBe(originalFunction);
      addManipulationListener();
      expect(Element.prototype[testProperty]).not.toBe(originalFunction);
    });
  });

});