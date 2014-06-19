ddescribe('patchServices', function() {
    describe('patchProperties()', function() {
      it('should patch target properties of created HTML objects', function() {
        var testProperty = 'innerHTML';
        var testingFunction = function() {
          return 'testing';
        };
        var element = document.createElement('a');
        expect(element[testProperty]).toBe('');
        patchServices.patchMaker.patchProperties(element, testingFunction);
        expect(element[testProperty]).not.toBe('');
      });

      it('should preserve the functionality of DOM APIS that are patched', function() {
        var testProperty = 'innerHTML';
        var testObject = {};
        testObject.testingFunction = function() {
          return 'testing';
        };
        var element = document.createElement('a');
        expect(element[testProperty]).toBe('');
        spyOn(testObject, 'testingFunction');
        patchServices.patchMaker.patchProperties(element, testObject.testingFunction);
        element[testProperty] = 'Testing Value';
        expect(element[testProperty]).toBe('Testing Value');
        testObject.testingFunction.reset();
        expect(testObject.testingFunction).not.toHaveBeenCalled();
        element[testProperty] = 'Another Value';
        expect(testObject.testingFunction).toHaveBeenCalled();
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

      it('should patch the prototype functions to call the listener param', function() {
        var testFunctionObject = {};
        testFunctionObject.testingFunction = function(){
            return 'DOM manipulation detected';
        }
        spyOn(testFunctionObject, 'testingFunction');
        expect(testFunctionObject.testingFunction).not.toHaveBeenCalled();
        patchServices.prototypePatcher.addManipulationListener(testFunctionObject.testingFunction);
        var element = document.createElement('a');
        element.getAttribute('NamedNodeMap');
        expect(testFunctionObject.testingFunction).toHaveBeenCalled();
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
    describe('detectCreation()', function() {
        it('should detect the creation of HTML elements and call appropriate patching', function() {
            patchServices.detectCreation(patchServices.listener);
            spyOn(patchServices.patchMaker, 'patchProperties');
            expect(patchServices.patchMaker.patchProperties).not.toHaveBeenCalled();
            var element = document.createElement('a');
            expect(patchServices.patchMaker.patchProperties).toHaveBeenCalled();
            patchServices.undetectCreation();
        });

        it('should patch those HTML elements with a listener', function() {
            var mockTestingObj = {};
            mockTestingObj.mockTest = function() {
                dump('Manipulation detected');
            }
            spyOn(mockTestingObj, 'mockTest');
            patchServices.detectCreation(mockTestingObj.mockTest);
            var element = document.createElement('a');
            expect(mockTestingObj.mockTest).not.toHaveBeenCalled();
            element.innerHTML = 'test';
            expect(mockTestingObj.mockTest).toHaveBeenCalled();
            patchServices.patchMaker.unPatch(element);
            patchServices.undetectCreation();
        });
    });
    describe('undetectCreation()', function() {
        it('should remove the patching of document.createElement', function() {
            var createElement = document['createElement'];
            patchServices.detectCreation(patchServices.listener);
            expect(createElement).not.toBe(document['createElement']);
            patchServices.undetectCreation();
            expect(createElement).toBe(document['createElement']);
        });
    });
  });