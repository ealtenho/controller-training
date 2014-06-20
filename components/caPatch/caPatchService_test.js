describe('patchServices', function() {
    beforeEach(function() {
        patchServices.listener = function() {
          console.log('Harmless Error');
        }
    });
    describe('collectPrototypeProperties()', function() {
      it('should collect the unpatched properties of prototypes', function() {
        var objectPropertyNames = Object.getOwnPropertyNames(Element.prototype);
        var originalProperties = patchServices.collectPrototypeProperties(Element);
        expect(originalProperties[objectPropertyNames[0]]).toBe(Element.prototype[objectPropertyNames[0]]);
      });


      it('should throw if type.prototype is undefined', function() {
        expect(function() {
            patchServices.collectPrototypeProperties(document.body);
        }).toThrow('collectPrototypeProperties() needs a .prototype to collect properties from. [object HTMLBodyElement].prototype is undefined.');
      });
    });
    describe('patchExistingElements()', function() {
        it('should save versions of the original DOM elements', function() {
          spyOn(patchServices, 'save');
          var elements = document.getElementsByTagName('*');
          var length = elements.length;
          expect(patchServices.save).not.toHaveBeenCalled();
          patchServices.patchExistingElements();
          expect(patchServices.save).toHaveBeenCalledWith(elements[length - 1], length - 1);
          patchServices.unpatchExistingElements();
        });


        it('should patch existing elements in the DOM', function() {
            var testElement = document.createElement('div');
            testElement.setAttribute('id', 'test');
            document.body.appendChild(testElement);
            var testProperty = 'innerHTML';
            expect(testElement[testProperty]).toBe('');
            expect(document.getElementById('test')[testProperty]).toBe('');
            patchServices.patchExistingElements(patchServices.listener);
            expect(testElement[testProperty]).not.toBe('')
            expect(document.getElementById('test')[testProperty]).not.toBe('');
            patchServices.unpatchExistingElements();
        });
    });
    describe('patchProperties()', function() {
      it('should patch target properties of created HTML objects', function() {
        var testProperty = 'innerHTML';
        var testingFunction = function() {
          return 'testing';
        };
        var element = document.createElement('a');
        expect(element[testProperty]).toBe('');
        patchServices.patchElementProperties(element, testingFunction);
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
        patchServices.patchElementProperties(element, testObject.testingFunction);
        element[testProperty] = 'Testing Value';
        expect(element[testProperty]).toBe('Testing Value');
        testObject.testingFunction.reset();
        expect(testObject.testingFunction).not.toHaveBeenCalled();
        element[testProperty] = 'Another Value';
        expect(testObject.testingFunction).toHaveBeenCalled();
      });
    });
    describe('unpatchExistingElements()', function() {
        it('should patch existing elements to protect from manipulation', function() {
            var testProperty = 'innerHTML';
            var testElement = document.createElement('div');
            testElement[testProperty] = 'testing html';
            testElement.setAttribute('id', 'testNew');
            var testElement2 = document.createElement('div');
            testElement2[testProperty] = 'different html';
            testElement2.setAttribute('id', 'test2');
            document.body.appendChild(testElement);
            document.body.appendChild(testElement2);
            expect(testElement[testProperty]).toBe('testing html');
            expect(document.getElementById('testNew')[testProperty]).toBe('testing html');
            patchServices.patchExistingElements(patchServices.listener);
            expect(testElement[testProperty]).not.toBe('testing html');
            expect(document.getElementById('testNew')[testProperty]).not.toBe('testing html');
            patchServices.unpatchExistingElements();
            expect(document.getElementById('testNew')[testProperty]).toBe('testing html');
            expect(document.getElementById('test2')[testProperty]).toBe('different html');
        });
    });
    describe('unpatchElementProperties()', function() {
      it('should unpatch target properties patched on HTML objects', function() {
        var testProperty = 'innerHTML';
        var testingFunction = function() {
          return 'testing';
        };
        var element = document.createElement('a');
        expect(element[testProperty]).toBe('');
        patchServices.patchElementProperties(element, testingFunction);
        expect(element[testProperty]).not.toBe('');
        var originalElementProperties = {
            'innerHTML': '',
            'parentElement': ''
        }
        patchServices.unpatchElementProperties(element, originalElementProperties);
        expect(element[testProperty]).toBe('');
      });
    });
    describe('patchOnePrototype()', function() {
        it('should patch all properties of a given object .prototype', function() {
          var objectProperties = Object.getOwnPropertyNames(Element.prototype);
          var testProperty = objectProperties[0];
          var originalFunction = Element.prototype[testProperty];
          expect(Element.prototype[testProperty]).toBe(originalFunction);
          patchServices.patchOnePrototype(Element);
          expect(Element.prototype[testProperty]).not.toBe(originalFunction);
          patchServices.unpatchOnePrototype(Element, 'Element');
        });


        it('should patch all properties of a given object .prototype with a specified function',
          function() {
            var objectProperties = Object.getOwnPropertyNames(Element.prototype);
            var testProperty = objectProperties[0];
            var testObject = {};
            testObject.exampleFunction = function() {};
            spyOn(testObject, 'exampleFunction');
            var originalFunction = Element.prototype[testProperty];
            expect(Element.prototype[testProperty]).toBe(originalFunction);
            patchServices.patchOnePrototype(Element, testObject.exampleFunction);
            var elem = document.createElement('div');
            elem.setAttribute('id', 'test');
            expect(Element.prototype[testProperty]).not.toBe(originalFunction);
            expect(testObject.exampleFunction).toHaveBeenCalled();
            patchServices.unpatchOnePrototype(Element, 'Element');
        });


        it('should patch .prototype with a default listener if none is provided', function() {
          var objectProperties = Object.getOwnPropertyNames(Element.prototype);
          var testProperty = objectProperties[0];
          spyOn(patchServices, 'listener');
          var originalFunction = Element.prototype[testProperty];
          expect(Element.prototype[testProperty]).toBe(originalFunction);
          patchServices.patchOnePrototype(Element);
          var elem = document.createElement('div');
          elem.setAttribute('id', 'test');
          expect(Element.prototype[testProperty]).not.toBe(originalFunction);
          expect(patchServices.listener).toHaveBeenCalled();
          patchServices.unpatchOnePrototype(Element, 'Element');
        });
    });
    describe('addManipulationListener()', function() {
      it('should patch existing DOM elements', function() {
        spyOn(patchServices, 'patchExistingElements');
        expect(patchServices.patchExistingElements).not.toHaveBeenCalled();
        patchServices.addManipulationListener(patchServices.listener);
        expect(patchServices.patchExistingElements).toHaveBeenCalled();
        patchServices.removeManipulationListener();
      });


      it('should patch the functions of Element.prototype', function() {
        spyOn(patchServices, 'patchOnePrototype');
        expect(patchServices.patchOnePrototype).not.toHaveBeenCalled();
        patchServices.addManipulationListener(patchServices.listener);
        expect(patchServices.patchOnePrototype).toHaveBeenCalledWith(Element);
        patchServices.removeManipulationListener();
      });


      it('should patch the functions of Node.prototype', function() {
        spyOn(patchServices, 'patchOnePrototype');
        expect(patchServices.patchOnePrototype).not.toHaveBeenCalled();
        patchServices.addManipulationListener(patchServices.listener);
        expect(patchServices.patchOnePrototype).toHaveBeenCalledWith(Node);
        patchServices.removeManipulationListener();
      });


      it('should patch the functions of EventTarget.prototype', function() {
        spyOn(patchServices, 'patchOnePrototype');
        expect(patchServices.patchOnePrototype).not.toHaveBeenCalled();
        patchServices.addManipulationListener(patchServices.listener);
        expect(patchServices.patchOnePrototype).toHaveBeenCalledWith(EventTarget);
        patchServices.removeManipulationListener();
      });


      it('should patch the functions of Document.prototype', function() {
       spyOn(patchServices, 'patchOnePrototype');
        expect(patchServices.patchOnePrototype).not.toHaveBeenCalled();
        patchServices.addManipulationListener(patchServices.listener);
        expect(patchServices.patchOnePrototype).toHaveBeenCalledWith(Document);
        patchServices.removeManipulationListener();
      });


      it('should patch the prototype functions to call the listener param', function() {
        var testFunctionObject = {};
        testFunctionObject.testingFunction = function(){
            return 'DOM manipulation detected';
        }
        spyOn(testFunctionObject, 'testingFunction');
        expect(testFunctionObject.testingFunction).not.toHaveBeenCalled();
        patchServices.addManipulationListener(testFunctionObject.testingFunction);
        var element = document.createElement('a');
        element.getAttribute('NamedNodeMap');
        expect(testFunctionObject.testingFunction).toHaveBeenCalled();
        patchServices.removeManipulationListener();
      });


      it('should detect getting element.innerHTML', function() {
        var testObj2 = {};
        testObj2.testFunction = function(){};
        spyOn(testObj2, 'testFunction');
        expect(testObj2.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        patchServices.patchElementProperties(element, testObj2.testFunction);
        var inner = element['innerHTML'];
        expect(testObj2.testFunction).toHaveBeenCalled();
        patchServices.removeManipulationListener();
      });


      it('should detect setting element.innerHTML', function() {
        var testObj3 = {};
        testObj3.testFunction = function(){};
        spyOn(testObj3, 'testFunction');
        expect(testObj3.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        patchServices.patchElementProperties(element, testObj3.testFunction);
        element.innerHTML = 'blank';
        expect(testObj3.testFunction).toHaveBeenCalled();
        patchServices.removeManipulationListener();
      });


      it('should detect getting element.parentElement', function() {
        var testObj4 = {};
        testObj4.testFunction = function(){};
        spyOn(testObj4, 'testFunction');
        expect(testObj4.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        patchServices.patchElementProperties(element, testObj4.testFunction);
        var parent = element.parentElement;
        expect(testObj4.testFunction).toHaveBeenCalled();
        patchServices.removeManipulationListener();
      });


      it('should detect calling element.addEventListener', function() {
        var testObj5 = {};
        testObj5.testFunction = function(){};
        spyOn(testObj5, 'testFunction');
        patchServices.addManipulationListener(testObj5.testFunction);
        expect(testObj5.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        var parent = element.addEventListener('click', function(e){});
        expect(testObj5.testFunction).toHaveBeenCalled();
        patchServices.removeManipulationListener();
      });


      it('should detect calling element.remove', function() {
        var testObj6 = {};
        testObj6.testFunction = function(){};
        spyOn(testObj6, 'testFunction');
        patchServices.addManipulationListener(testObj6.testFunction);
        expect(testObj6.testFunction).not.toHaveBeenCalled();
        var element = document.createElement('div');
        element.remove();
        expect(testObj6.testFunction).toHaveBeenCalled();
        patchServices.removeManipulationListener();
      });


      it('should detect calling element.insertBefore', function() {
        var parentElement = document.createElement('div');
        var referenceElement = document.createElement('div');
        parentElement.appendChild(referenceElement);
        var testObj7 = {};
        testObj7.testFunction = function(){};
        spyOn(testObj7, 'testFunction');
        patchServices.addManipulationListener(testObj7.testFunction);
        expect(testObj7.testFunction).not.toHaveBeenCalled();
        var newElement = document.createElement('div');
        parentElement.insertBefore(newElement, referenceElement);
        expect(testObj7.testFunction).toHaveBeenCalled();
        patchServices.removeManipulationListener();
      });


      it('should detect calling element.appendChild', function() {
        var parentElement = document.createElement('div');
        var childElement = document.createElement('div');
        var testObj8 = {};
        testObj8.testFunction = function(){
          return 'test function';
        };
        spyOn(testObj8, 'testFunction');
        patchServices.addManipulationListener(testObj8.testFunction);
        expect(testObj8.testFunction).not.toHaveBeenCalled();
        parentElement.appendChild(childElement);
        expect(testObj8.testFunction).toHaveBeenCalled();
        patchServices.removeManipulationListener();
      });
    });
    describe('unpatchOnePrototype()', function() {
      it('should unpatch the .prototype properties of the given parameter', function() {
        var mockObject = {};
        mockObject.testFunction = function(){};
        var objectProperties = Object.getOwnPropertyNames(Element.prototype);
        var testProperty = objectProperties[0];
        var originalFunction = Element.prototype[testProperty];
        expect(Element.prototype[testProperty]).toBe(originalFunction);
        patchServices.patchOnePrototype(Element, mockObject.testFunction);
        expect(Element.prototype[testProperty]).not.toBe(originalFunction);
        patchServices.unpatchOnePrototype(Element, 'Element');
        expect(Element.prototype[testProperty]).toBe(originalFunction);
      });


      it('should throw if not given the name parameter used to find the original values',
        function() {
          expect(function() {
            patchServices.unpatchOnePrototype(Element);
          }).toThrow('typeName must be the name used to save prototype properties. Got: undefined');
        });
    });
    describe('removeManipulationListener()', function() {
      it('should remove the patch from functions on Element.prototype', function() {
        spyOn(patchServices, 'unpatchOnePrototype');
        expect(patchServices.unpatchOnePrototype).not.toHaveBeenCalled();
        patchServices.removeManipulationListener();
        expect(patchServices.unpatchOnePrototype).toHaveBeenCalledWith(Element, 'Element');
      });


      it('should remove the patch from functions on Node.prototype', function() {
        spyOn(patchServices, 'unpatchOnePrototype');
        expect(patchServices.unpatchOnePrototype).not.toHaveBeenCalled();
        patchServices.removeManipulationListener();
        expect(patchServices.unpatchOnePrototype).toHaveBeenCalledWith(Node, 'Node');
      });


      it('should remove the patch from functions on EventTarget.prototype', function() {
        spyOn(patchServices, 'unpatchOnePrototype');
        expect(patchServices.unpatchOnePrototype).not.toHaveBeenCalled();
        patchServices.removeManipulationListener();
        expect(patchServices.unpatchOnePrototype).toHaveBeenCalledWith(EventTarget, 'EventTarget');
      });


      it('should remove the patch from functions on Document.prototype', function() {
        spyOn(patchServices, 'unpatchOnePrototype');
        expect(patchServices.unpatchOnePrototype).not.toHaveBeenCalled();
        patchServices.removeManipulationListener();
        expect(patchServices.unpatchOnePrototype).toHaveBeenCalledWith(Document, 'Document');
      });


      it('should remove the patch from all DOM elements', function() {
        spyOn(patchServices, 'unpatchExistingElements');
        expect(patchServices.unpatchExistingElements).not.toHaveBeenCalled();
        patchServices.removeManipulationListener();
        expect(patchServices.unpatchExistingElements).toHaveBeenCalled();
      });
    });
    describe('setListener()', function() {
      it('should set the listener function to a parameter', function() {
        var newListener = function () {
          return 'This is a new listener for controller manipulations.';
        }
        expect(patchServices.listener).not.toBe(newListener);
        patchServices.setListener(newListener);
        expect(patchServices.listener).toBe(newListener);
      });


      it('should throw if provided an invalid parameter', function() {
        expect(function() {
          patchServices.setListener('This is a listener');
        }).toThrow('listener must be a function, got: string');
      });


      it('should default to the current listener if no parameter is provided', function() {
        var originalListener = patchServices.listener;
        patchServices.setListener();
        expect(originalListener).toBe(patchServices.listener);
      });
    });
  });