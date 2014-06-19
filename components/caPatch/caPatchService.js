var patchServices = {};

patchServices.collectPrototypeProperties = function(type) {
  var objectProperties = {};
  var objectPropertyNames = Object.getOwnPropertyNames(type.prototype);
  objectPropertyNames.forEach(function(prop) {
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

patchServices.originalProperties = {
  'Element': patchServices.collectPrototypeProperties(Element),
  'Node': patchServices.collectPrototypeProperties(Node),
  'EventTarget': patchServices.collectPrototypeProperties(EventTarget),
  'DocumentCreate': document['createElement']
}

patchServices.patchOnePrototype = function(type, listener) {
  patchServices.listener = listener;
  var objectProperties = Object.getOwnPropertyNames(type.prototype);
  objectProperties.forEach(function(prop) {
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
}

patchServices.unpatchOnePrototype = function(type, typeName) {
  var objectProperties = Object.getOwnPropertyNames(type.prototype);
  objectProperties.forEach(function(prop) {
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
}

patchServices.patchElementsOnCreation = function(listener) {
  var unpatched = patchServices.originalProperties['DocumentCreate'];
  document['createElement'] = function(param) {
    return patchServices.patchElementProperties(unpatched.apply(this,arguments), listener);
  }
};

patchServices.propertiesToPatch = ['innerHTML', 'parentElement'];

patchServices.savedProperties = {};
patchServices.patchedElements = new Array;

patchServices.saveProp = function(element, prop) {
  patchServices.savedProperties[prop] = element[prop];
}

patchServices.patchElementProperties = function(element, listener) {
  patchServices.propertiesToPatch.forEach(function(prop) {
      patchServices.saveProp(element, prop);
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
  patchServices.patchedElements.push(element);
  return element;
};

patchServices.unpatchCreatedElements = function() {
  document['createElement'] = patchServices.originalProperties['DocumentCreate'];
  patchServices.patchedElements.forEach(function(elem) {
    patchServices.unpatchElementProperties(elem);
  });
};

patchServices.unpatchElementProperties = function(element) {
  patchServices.propertiesToPatch.forEach(function(prop) {
  Object.defineProperty(element, prop, {
        configurable: true,
        get: function() {
          return patchServices.savedProperties[prop];
        },
        set: function(newValue) {
          element.prop = newValue;
        }
      });
  });
};

patchServices.addManipulationListener = function(listener) {
  patchServices.patchOnePrototype(Element, listener);
  patchServices.patchOnePrototype(Node, listener);
  patchServices.patchOnePrototype(EventTarget, listener);
  patchServices.patchElementsOnCreation(listener);
}

patchServices.removeManipulationListener = function() {
  patchServices.unpatchOnePrototype(Element, 'Element');
  patchServices.unpatchOnePrototype(Node, 'Node');
  patchServices.unpatchOnePrototype(EventTarget, 'EventTarget');
  patchServices.unpatchCreatedElements();
}

patchServices.defaultError = 'Angular best practices are to manipulate the DOM in the view. ' +
'Remove DOM manipulation from the controller. ' +
'Thrown because of manipulating property:';


patchServices.listener = function(property) {
 e = new Error(patchServices.defaultError + ' ' + property);
 e += '\n' + e.stack.split('\n')[3];
 throw e;
};

