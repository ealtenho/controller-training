var patchServices = {};

/**
* Helper method to collect all properties of a given prototype.
* When patching is removed, all prototype properties
* are set back to these original values
**/
patchServices.collectPrototypeProperties = function(type) {
  if(type ==  undefined || type.prototype == undefined) {
    throw new Error('collectPrototypeProperties() needs a .prototype to collect properties from. ' +
      type + '.prototype is undefined.');
  }
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
* If no listener function is provided, the default listener is used.
*/
patchServices.patchOnePrototype = function(type, listener) {
  patchServices.setListener(listener);
  if(type ==  undefined || type.prototype == undefined) {
    throw new Error('collectPrototypeProperties() needs a .prototype to collect properties from. ' +
      type + '.prototype is undefined.');
  }
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
  if(typeName == undefined) {
    throw new Error('typeName must be the name used to save prototype properties. Got: ' + typeName);
  }
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
      //dump('Access ' + prop + ' on ' + typeName);
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
patchServices.savedElements = {};

/**
* Function to save properties that will be patched
* Each element has an object associating with it the patched properties
**/
patchServices.save = function(element, index) {
  elementProperties = {};
  patchServices.propertiesToPatch.forEach(function(prop) {
    elementProperties[prop] = element[prop];
  });
  patchServices.savedElements[index] = elementProperties;
};


/**
* Helper function to patch specified properties of a given
* element to call the listener function on getting or setting
**/
patchServices.patchElementProperties = function(element, listener) {
  patchServices.setListener(listener);
  patchServices.propertiesToPatch.forEach(function(prop) {
      Object.defineProperty(element, prop, {
        configurable: true,
        get: function() {
          patchServices.listener(prop);
          return element.prop;
        },
        set: function(newValue) {
          patchServices.listener(prop);
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
  patchServices.setListener(listener);
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
    var originalElement = patchServices.savedElements[i];
    patchServices.unpatchElementProperties(elements[i], originalElement);
  }
};

/**
* Controls the patching process by patching all necessary
* prototypes as well as triggering the patching of individual
* HTML elements.
**/
patchServices.addManipulationListener = function(listener) {
  patchServices.setListener(listener);
  patchServices.patchExistingElements();
  patchServices.patchOnePrototype(Element);
  patchServices.patchOnePrototype(Node);
  patchServices.patchOnePrototype(EventTarget);
  patchServices.patchOnePrototype(Document);
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
* Set the listener function to a custom value
* if the provided listener is not undefined and
* is a function. If the parameter does not meet these
* standards, leave patchServices.listener as the default error
* throwing function.
*/
patchServices.setListener = function(listener) {
  if(listener != undefined) {
    if(typeof listener === 'function') {
      patchServices.listener = listener;
    }
    else {
      throw new Error('listener must be a function, got: ' + typeof listener);
    }
  }
};

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

