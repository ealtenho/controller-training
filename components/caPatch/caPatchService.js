var patchServices = {};

patchServices.collectPrototypeProperties = function(type) {
  var objectProperties = {};
  var objectPropertyNames = Object.getOwnPropertyNames(type.prototype);
  objectPropertyNames.forEach(function(prop) {
    try {
      objectProperties[prop] = type.prototype[prop];
    }
    catch(e) {
      dump('Access ' + prop + ' on ' + type.name);
      dump(e);
    }
  });
  return objectProperties;
};

patchServices.originalCreateElement = document['createElement'];

patchServices.detectCreation = function(listener) {
var original = document['createElement'];
document['createElement'] = function(param) {
  return patchServices.patchMaker.patchProperties(original.apply(this,arguments), listener);
}
};

patchServices.undetectCreation = function() {
document['createElement'] = patchServices.originalCreateElement;
};

patchServices.patchMaker = {
  savedProperties: {},
  saveProp: function(element, prop) {
    this.savedProperties[prop] = element[prop];
  },
  properties: ['innerHTML', 'parentElement'],
  patchProperties: function(element, listener) {
    this.properties.forEach(function(prop) {
        patchServices.patchMaker.saveProp(element, prop);
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
    return element;
  },
  unPatch: function(element) {
    this.properties.forEach(function(prop) {
    Object.defineProperty(element, prop, {
          configurable: true,
          get: function() {
            return patchServices.patchMaker.savedProperties[prop];
          },
          set: function(newValue) {
            element.prop = newValue;
          }
        });
    });
  }
}

patchServices.prototypePatcher = {
  originalProperties: {
    'Element': patchServices.collectPrototypeProperties(Element),
    'Node': patchServices.collectPrototypeProperties(Node),
    'EventTarget': patchServices.collectPrototypeProperties(EventTarget)
  },
  patchOnePrototype: function(type, listener) {
    var objectProperties = Object.getOwnPropertyNames(type.prototype);
    objectProperties.forEach(function(prop) {
      try {
        var original = type.prototype[prop];
        if(typeof original === 'function') {
          type.prototype[prop] = function () {
            listener();
              return original.apply(this, arguments);
          };
        }
      }
      catch(e){
        dump('Access ' + prop + ' on ' + type.name);
        dump(e);
      }
    });
  },
  addManipulationListener: function(listener) {
    patchServices.prototypePatcher.patchOnePrototype(Element, listener);
    patchServices.prototypePatcher.patchOnePrototype(Node, listener);
    patchServices.prototypePatcher.patchOnePrototype(EventTarget, listener);
  },
  removeManipulationListener: function() {
    var objectProperties = Object.getOwnPropertyNames(Element.prototype);
    objectProperties.forEach(function(prop) {
      try{
      var alteredElement = Element.prototype[prop];
        if(typeof alteredElement === 'function') {
          Element.prototype[prop] = patchServices.prototypePatcher.originalProperties['Element'][prop];
       }
      }
      catch(e) {
        dump('Access ' + prop + ' on Element');
        dump(e);
      }
    });

    var objectPropertiesNode = Object.getOwnPropertyNames(Node.prototype);
    objectPropertiesNode.forEach(function(prop) {
    try{
      var alteredElementNode = Node.prototype[prop];
      if(typeof alteredElementNode === 'function') {
        Node.prototype[prop] = patchServices.prototypePatcher.originalProperties['Node'][prop];
      }
    }
    catch(e) {
      dump('Access ' + prop + ' on Node');
      dump(e);
    }
    });

    var objectPropertiesEventTarget = Object.getOwnPropertyNames(EventTarget.prototype);
    objectPropertiesEventTarget.forEach(function(prop) {
      var alteredElementEventTarget = EventTarget.prototype[prop];
      if(typeof alteredElementEventTarget === 'function') {
        EventTarget.prototype[prop] = patchServices.prototypePatcher.originalProperties['EventTarget'][prop];
      }
    });
  }
};

patchServices.listener = function() {
  return 'DOM Manipulation detected';
};

