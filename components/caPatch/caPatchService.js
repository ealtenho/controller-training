var patchServices = {};

/**
* Helper method to collect all properties of a given prototype.
* When patching is removed, all prototype properties
* are set back to these original values
**/
patchServices.collectPrototypeProperties = function(type) {
  var objectProperties = {};
  var objectPropertyNames = Object.getOwnPropertyNames(type.prototype);
  objectPropertyNames.forEach(function(prop) {
    //Access of some prototype values may throw an error
    try {
      objectProperties[prop] = type.prototype[prop];
    }
    catch(e) {
      //dump('Access ' + prop + ' on ' + type.name);
      //dump(e);
    }
  });
  return objectProperties;
};

/**
* Object to preserve all the original properties
* that will be restored after patching.
**/
patchServices.originalProperties = {
  'Element': patchServices.collectPrototypeProperties(Element),
  'Node': patchServices.collectPrototypeProperties(Node),
  'EventTarget': patchServices.collectPrototypeProperties(EventTarget),
  'Document': patchServices.collectPrototypeProperties(Document),
  'DocumentCreate': document['createElement']
};

/**
* Helper function for patching one prototype.
* Patches the given type with the addition of a
* call to listener, a function passed as a parameter.
*/
patchServices.patchOnePrototype = function(type, listener) {
  patchServices.listener = listener;
  var objectProperties = Object.getOwnPropertyNames(type.prototype);
  objectProperties.forEach(function(prop) {
    //Access of some prototype values may throw an error
    try {
      var original = type.prototype[prop];
      if(typeof original === 'function') {
        type.prototype[prop] = function () {
            patchServices.listener(prop);
            return original.apply(this, arguments);
        };
      }
    }
    catch(e){
      //dump('Access ' + prop + ' on ' + type.name);
      //dump(e);
    }
  });
};

/**
* Helper function to unpatch one prototype.
* Sets all properties of the given type back to the
* original values that were collected.
**/
patchServices.unpatchOnePrototype = function(type, typeName) {
  var objectProperties = Object.getOwnPropertyNames(type.prototype);
  objectProperties.forEach(function(prop) {
    //Access of some prototype values may throw an error
    try{
    var alteredElement = type.prototype[prop];
      if(typeof alteredElement === 'function') {
        type.prototype[prop] = patchServices.originalProperties[typeName][prop];
      }
    }
    catch(e) {
      //dump('Access ' + prop + ' on ' + type.name);
      //dump(e);
    }
  });
};


/**
* List of DOM API properties to patch on individual elements.
* These are properties not covered by patching of the prototypes
* and must therefore be patched on the elements themselves.
**/
patchServices.propertiesToPatch = ['innerHTML', 'parentElement'];


/**
* Object to hold original version of patched elements
*/
patchServices.savedExisting = {};

/**
* Function to save properties that will be patched
* Each element has an object associating with it the patched properties
**/
patchServices.save = function(element, index) {
  elementProperties = {};
  patchServices.propertiesToPatch.forEach(function(prop) {
    elementProperties[prop] = element[prop];
  });
  patchServices.savedExisting[index] = elementProperties;
};


/**
* Helper function to patch specified properties of a given
* element to call the listener function on getting or setting
**/
patchServices.patchElementProperties = function(element, listener) {
  patchServices.propertiesToPatch.forEach(function(prop) {
      Object.defineProperty(element, prop, {
        configurable: true,
        get: function() {
          listener(prop);
          return element.prop;
        },
        set: function(newValue) {
          listener(prop);
          element.prop = newValue;
        }
      });
  });
  return element;
};

/**
* Helper function to unpatch all properties of a given element
*/
patchServices.unpatchElementProperties = function(element, originalElement) {
  patchServices.propertiesToPatch.forEach(function(prop) {
  Object.defineProperty(element, prop, {
        configurable: true,
        get: function() {
          return originalElement[prop];
        },
        set: function(newValue) {
          element.prop = newValue;
        }
      });
  });
};

/**
* While patching prototypes patches many of the DOM APIs,
* some properties exist only on the elements themselves. This
* function retrieves all the current elements on the page and
* patches them to call the given listener function if manipulated.
*/
patchServices.patchExistingElements = function(listener) {
  elements = document.getElementsByTagName('*');
  for(var i = 0; i < elements.length; i++) {
    patchServices.save(elements[i], i);
    patchServices.patchElementProperties(elements[i], listener);
  }
};

/**
* Unpatches all the elements on the page that were patched.
*/
patchServices.unpatchExistingElements = function() {
  elements = document.getElementsByTagName('*');
  for(var i = 0; i < elements.length; i++) {
    var originalElement = patchServices.savedExisting[i];
    patchServices.unpatchElementProperties(elements[i], originalElement);
  }
};

/**
* Controls the patching process by patching all necessary
* prototypes as well as triggering the patching of individual
* HTML elements.
**/
patchServices.addManipulationListener = function(listener) {
  patchServices.patchExistingElements(listener);
  patchServices.patchOnePrototype(Element, listener);
  patchServices.patchOnePrototype(Node, listener);
  patchServices.patchOnePrototype(EventTarget, listener);
  patchServices.patchOnePrototype(Document, listener);
};

/**
* Controls the unpatching process by unpatching the
* prototypes as well as disabling the patching of individual
* HTML elements and returning those patched elements to their
* original state.
**/
patchServices.removeManipulationListener = function() {
  patchServices.unpatchOnePrototype(Element, 'Element');
  patchServices.unpatchOnePrototype(Node, 'Node');
  patchServices.unpatchOnePrototype(EventTarget, 'EventTarget');
  patchServices.unpatchOnePrototype(Document, 'Document');
  patchServices.unpatchExistingElements();
};

/**
* Default formatting of error to be thrown on DOM API manipulation from
* a controller.
*/
patchServices.defaultError = 'Angular best practices are to manipulate the DOM in the view. ' +
'Remove DOM manipulation from the controller. ' +
'Thrown because of manipulating property:';

/**
* Error function thrown on detection of DOM manipulation.
* May be overriden to throw custom error function if desired.
*/
patchServices.listener = function(property) {
 e = new Error(patchServices.defaultError + ' ' + property);
 //Find the relevant stack trace identification
 //The first two lines of stack trace refer to the error being thrown
 //As listener inside of this file
 e += '\n' + e.stack.split('\n')[3];
 throw e;
};

