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
          patchServices.listener();
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

patchServices.unPatchOnePrototype = function(type, typeName) {
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
  var original = document['createElement'];
  document['createElement'] = function(param) {
    return patchServices.patchElementProperties(original.apply(this,arguments), listener);
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
          listener();
          return element.prop;
        },
        set: function(newValue) {
          listener();
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
  patchServices.patchElementsOnCreation(listener);
  patchServices.patchOnePrototype(Element, listener);
  patchServices.patchOnePrototype(Node, listener);
  patchServices.patchOnePrototype(EventTarget, listener);
}

patchServices.removeManipulationListener = function() {
  patchServices.unpatchCreatedElements();
  patchServices.unPatchOnePrototype(Element, 'Element');
  patchServices.unPatchOnePrototype(Node, 'Node');
  patchServices.unPatchOnePrototype(EventTarget, 'EventTarget');
}

patchServices.listener = function() {
  return 'DOM Manipulation detected';
};

