describe('patch services', function() {
    describe('patchProperties()', function() {
      it('should patch target properties of created HTML objects', function() {
        var testProperty = 'innerHTML';
        var testProperty2 = 'parentElement';
        var testingFunction = function() {
          return 'testing';
        };
        var element = document.createElement('a');
        expect(element[testProperty]).toBe('');
        patchServices.patchMaker.patchProperties(element, testingFunction);
        expect(element[testProperty]).not.toBe('');
      });
    });
    describe('unPatch()', function() {
      it('should unpatch target properties patched on HTML objects', function() {
        var testProperty = 'innerHTML';
        var testProperty2 = 'parentElement';
        var testingFunction = function() {
          return 'testing';
        };
        var element = document.createElement('a');
        expect(element[testProperty]).toBe('');
        patchServices.patchMaker.patchProperties(element, testingFunction);
        expect(element[testProperty]).not.toBe('');
        patchServices.patchMaker.unPatch(element);
        expect(element[testProperty]).toBe('');
      });
    });

    describe('addManipulationListener()', function() {
      it('should patch the functions of Element.prototype', function() {
        var objectProperties = Object.getOwnPropertyNames(Element.prototype);
        var testProperty = objectProperties[0];
        var originalFunction = Element.prototype[testProperty];
        expect(Element.prototype[testProperty]).toBe(originalFunction);
        patchServices.prototypePatcher.addManipulationListener();
        expect(Element.prototype[testProperty]).not.toBe(originalFunction);
        patchServices.prototypePatcher.removeManipulationListener();
      });

      it('should patch the functions of Node.prototype', function() {
        var objectProperties = Object.getOwnPropertyNames(Node.prototype);
        var testProperty = objectProperties[0];
        var originalFunction = Node.prototype[testProperty];
        expect(Node.prototype[testProperty]).toBe(originalFunction);
        patchServices.prototypePatcher.addManipulationListener();
        expect(Node.prototype[testProperty]).not.toBe(originalFunction);
        patchServices.prototypePatcher.removeManipulationListener();
      });

      it('should patch the functions of EventTarget.prototype', function() {
        var objectProperties = Object.getOwnPropertyNames(EventTarget.prototype);
        var testProperty = objectProperties[0];
        var originalFunction = EventTarget.prototype[testProperty];
        expect(EventTarget.prototype[testProperty]).toBe(originalFunction);
        patchServices.prototypePatcher.addManipulationListener();
        expect(EventTarget.prototype[testProperty]).not.toBe(originalFunction);
        patchServices.prototypePatcher.removeManipulationListener();
      });


      it('should detect getting element.innerHTML', function() {
        var testObj2 = {};
        testObj2.testFunction = function(){};
        spyOn(testObj2, 'testFunction');
        expect(testObj2.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        patchServices.patchMaker.patchProperties(element, testObj2.testFunction);
        var inner = element['innerHTML'];
        expect(testObj2.testFunction).toHaveBeenCalled();
        patchServices.prototypePatcher.removeManipulationListener();
      });


      it('should detect setting element.innerHTML', function() {
        var testObj3 = {};
        testObj3.testFunction = function(){};
        spyOn(testObj3, 'testFunction');
        expect(testObj3.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        patchServices.patchMaker.patchProperties(element, testObj3.testFunction);
        element.innerHTML = 'blank';
        expect(testObj3.testFunction).toHaveBeenCalled();
        patchServices.prototypePatcher.removeManipulationListener();
      });


      it('should detect getting element.parentElement', function() {
        var testObj4 = {};
        testObj4.testFunction = function(){};
        spyOn(testObj4, 'testFunction');
        expect(testObj4.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        patchServices.patchMaker.patchProperties(element, testObj4.testFunction);
        var parent = element.parentElement;
        expect(testObj4.testFunction).toHaveBeenCalled();
        patchServices.prototypePatcher.removeManipulationListener();
      });


      it('should detect calling element.addEventListener', function() {
        var testObj5 = {};
        testObj5.testFunction = function(){};
        spyOn(testObj5, 'testFunction');
        patchServices.prototypePatcher.addManipulationListener(testObj5.testFunction);
        expect(testObj5.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        var parent = element.addEventListener('click', function(e){});
        expect(testObj5.testFunction).toHaveBeenCalled();
        patchServices.prototypePatcher.removeManipulationListener();
      });


      it('should detect calling element.remove', function() {
        var testObj6 = {};
        testObj6.testFunction = function(){};
        spyOn(testObj6, 'testFunction');
        patchServices.prototypePatcher.addManipulationListener(testObj6.testFunction);
        expect(testObj6.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        element.remove();
        expect(testObj6.testFunction).toHaveBeenCalled();
        patchServices.prototypePatcher.removeManipulationListener();
      });


      it('should detect calling element.insertBefore', function() {
        var parentElement = document.createElement('div');
        var referenceElement = document.createElement('div');
        parentElement.appendChild(referenceElement);
        var testObj7 = {};
        testObj7.testFunction = function(){};
        spyOn(testObj7, 'testFunction');
        patchServices.prototypePatcher.addManipulationListener(testObj7.testFunction);
        expect(testObj7.testFunction).not.toHaveBeenCalled();
        var newElement = document.createElement('div');
        parentElement.insertBefore(newElement, referenceElement);
        expect(testObj7.testFunction).toHaveBeenCalled();
        patchServices.prototypePatcher.removeManipulationListener();
      });


      it('should detect calling element.appendChild', function() {
        var parentElement = document.createElement('div');
        var childElement = document.createElement('div');
        var testObj8 = {};
        testObj8.testFunction = function(){
          return 'test function';
        };
        spyOn(testObj8, 'testFunction');
        patchServices.prototypePatcher.addManipulationListener(testObj8.testFunction);
        expect(testObj8.testFunction).not.toHaveBeenCalled();
        parentElement.appendChild(childElement);
        expect(testObj8.testFunction).toHaveBeenCalled();
        patchServices.prototypePatcher.removeManipulationListener();
      });
    });
    describe('collectProperties()', function() {
      it('should collect the unpatched properties of Element.prototype', function() {
        var objectPropertyNames = Object.getOwnPropertyNames(Element.prototype);
        expect(patchServices.prototypePatcher.originalProperties[objectPropertyNames[0]]).toBe(Element.prototype[objectPropertyNames[0]]);
      });
    });
    describe('removeManipulationListener()', function() {
      it('should remove the patch from functions on Element.prototype', function() {
        var mockObject = {};
        mockObject.testFunction = function(){};
        var objectProperties = Object.getOwnPropertyNames(Element.prototype);
        var testProperty = objectProperties[0];
        var originalFunction = Element.prototype[testProperty];
        expect(Element.prototype[testProperty]).toBe(originalFunction);
        patchServices.prototypePatcher.addManipulationListener(mockObject.testFunction);
        expect(Element.prototype[testProperty]).not.toBe(originalFunction);
        patchServices.prototypePatcher.removeManipulationListener();
        expect(Element.prototype[testProperty]).toBe(originalFunction);
      });

      it('should remove the patch from functions on Node.prototype', function() {
        var mockObject2 = {};
        mockObject2.testFunction = function(){};
        var objectProperties = Object.getOwnPropertyNames(Node.prototype);
        var testProperty = objectProperties[0];
        var originalFunction = Node.prototype[testProperty];
        expect(Node.prototype[testProperty]).toBe(originalFunction);
        patchServices.prototypePatcher.addManipulationListener(mockObject2.testFunction);
        expect(Node.prototype[testProperty]).not.toBe(originalFunction);
        patchServices.prototypePatcher.removeManipulationListener();
        expect(Node.prototype[testProperty]).toBe(originalFunction);
      });

      it('should remove the patch from functions on EventTarget.prototype', function() {
        var mockObject3 = {};
        mockObject3.testFunction = function(){};
        var objectProperties = Object.getOwnPropertyNames(EventTarget.prototype);
        var testProperty = objectProperties[0];
        var originalFunction = EventTarget.prototype[testProperty];
        expect(EventTarget.prototype[testProperty]).toBe(originalFunction);
        patchServices.prototypePatcher.addManipulationListener(mockObject3.testFunction);
        expect(EventTarget.prototype[testProperty]).not.toBe(originalFunction);
        patchServices.prototypePatcher.removeManipulationListener();
        expect(EventTarget.prototype[testProperty]).toBe(originalFunction);
      });
    });
  });