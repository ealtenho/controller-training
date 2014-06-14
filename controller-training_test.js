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

    it('should patch the functions of Node.prototype', function() {
      var objectProperties = Object.getOwnPropertyNames(Node.prototype);
      var testProperty = objectProperties[0];
      var originalFunction = Node.prototype[testProperty];
      expect(Node.prototype[testProperty]).toBe(originalFunction);
      controllerTrainer.addManipulationListener();
      expect(Node.prototype[testProperty]).not.toBe(originalFunction);
      controllerTrainer.removeManipulationListener();
    });

    it('should patch the functions of Element.prototype to call the givenFunction param', function() {
      var testObj = {};
      testObj.testFunction = function(){};
      spyOn(testObj, 'testFunction');
      controllerTrainer.addManipulationListener(testObj.testFunction);
      expect(testObj.testFunction).not.toHaveBeenCalled();
      var element = document.createElement('a');
      element.getAttribute('NamedNodeMap');
      expect(testObj.testFunction).toHaveBeenCalled();
      controllerTrainer.removeManipulationListener();
    });


    it('should detect getting element.innerHTML', function() {
      var testObj = {};
      testObj.testFunction = function(){};
      spyOn(testObj, 'testFunction');
      controllerTrainer.addManipulationListener(testObj.testFunction);
      expect(testObj.testFunction).not.toHaveBeenCalled();
      var element = document.createElement('div');
      var inner = element.innerHTML;
      expect(testObj.testFunction).toHaveBeenCalled();
      controllerTrainer.removeManipulationListener();
    });


    it('should detect setting element.innerHTML', function() {
      var testObj = {};
      testObj.testFunction = function(){};
      spyOn(testObj, 'testFunction');
      controllerTrainer.addManipulationListener(testObj.testFunction);
      expect(testObj.testFunction).not.toHaveBeenCalled();
      var element = document.createElement('div');
      element.innerHTML = 'blank';
      expect(testObj.testFunction).toHaveBeenCalled();
      controllerTrainer.removeManipulationListener();
    });


    it('should detect getting element.parentElement', function() {
      var testObj = {};
      testObj.testFunction = function(){};
      spyOn(testObj, 'testFunction');
      controllerTrainer.addManipulationListener(testObj.testFunction);
      expect(testObj.testFunction).not.toHaveBeenCalled();
      var element = document.createElement('div');
      var parent = element.parentElement;
      expect(testObj.testFunction).toHaveBeenCalled();
      controllerTrainer.removeManipulationListener();
    });


    it('should detect calling element.addEventListener', function() {
      var testObj = {};
      testObj.testFunction = function(){};
      spyOn(testObj, 'testFunction');
      controllerTrainer.addManipulationListener(testObj.testFunction);
      expect(testObj.testFunction).not.toHaveBeenCalled();
      var element = document.createElement('div');
      var parent = element.addEventListener();
      expect(testObj.testFunction).toHaveBeenCalled();
      controllerTrainer.removeManipulationListener();
    });


    it('should detect calling element.remove', function() {
      var testObj = {};
      testObj.testFunction = function(){};
      spyOn(testObj, 'testFunction');
      controllerTrainer.addManipulationListener(testObj.testFunction);
      expect(testObj.testFunction).not.toHaveBeenCalled();
      var element = document.createElement('div');
      element.remove();
      expect(testObj.testFunction).toHaveBeenCalled();
      controllerTrainer.removeManipulationListener();
    });


    it('should detect calling element.insertBefore', function() {
      var parentElement = document.createElement('div');
      var referenceElement = document.createElement('div');
      parentElement.appendChild(referenceElement);
      var testObj = {};
      testObj.testFunction = function(){};
      spyOn(testObj, 'testFunction');
      controllerTrainer.addManipulationListener(testObj.testFunction);
      expect(testObj.testFunction).not.toHaveBeenCalled();
      var newElement = document.createElement('div');
      parentElement.insertBefore(newElement, referenceElement);
      expect(testObj.testFunction).toHaveBeenCalled();
      controllerTrainer.removeManipulationListener();
    });


    it('should detect calling element.appendChild', function() {
      var parentElement = document.createElement('div');
      var childElement = document.createElement('div');
      var testObj = {};
      testObj.testFunction = function(){};
      spyOn(testObj, 'testFunction');
      controllerTrainer.addManipulationListener(testObj.testFunction);
      expect(testObj.testFunction).not.toHaveBeenCalled();
      parentElement.appendChild(childElement);
      expect(testObj.testFunction).toHaveBeenCalled();
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