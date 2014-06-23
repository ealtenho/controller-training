describe('controller training application', function() {
  var $controller, $rootScope;
  beforeEach(module('controllerTrainer'));
  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));
  beforeEach(function() {
    patchServices.listener = function() {
      console.log('Harmless Error');
    };
  });
  describe('controller decorating', function() {
    it('should maintain normal controller logic', function() {
      var controllerMock = function() {
        var element = document.createElement('a');
        element.innerHTML = 'testValue';
      };
      var ctrl = $controller(controllerMock);
      expect(ctrl).toBeDefined();
    });


    it('should call logic to patch prototypes', function() {
      spyOn(patchServices, 'listener');
      expect(patchServices.listener).not.toHaveBeenCalled();
      var controllerMock = function() {
        var element = document.createElement('a');
        element.getAttribute('NamedNodeMap');
      };
      var ctrl = $controller(controllerMock);
      expect(patchServices.listener).toHaveBeenCalled();
    });


    it('should call logic to patch created elements', function() {
      spyOn(patchServices, 'listener');
      expect(patchServices.listener).not.toHaveBeenCalled();
      var controllerMock = function() {
        var element = document.createElement('a');
        element.innerHTML = 'test';
      };
      var ctrl = $controller(controllerMock);
      expect(patchServices.listener).toHaveBeenCalled();
    });


    it('should unpatch prototypes after execution', function() {
      spyOn(patchServices, 'unpatchOnePrototype');
      expect(patchServices.unpatchOnePrototype).not.toHaveBeenCalled();
      var controllerMock = function() {
        var element = document.createElement('a');
        element.innerHTML = 'testValue';
      };
      var ctrl = $controller(controllerMock);
      expect(patchServices.unpatchOnePrototype).toHaveBeenCalled();
    });


    it('should patch methods on the controller instance', function() {
      spyOn(patchServices, 'listener');
      expect(patchServices.listener).not.toHaveBeenCalled();
      var controllerMock = function() {
        this.someMethod = function () {
          var element = document.createElement('a');
          element.innerHTML = 'testValue';
        };
      };
      var ctrl = $controller(controllerMock);
      ctrl.someMethod();
      expect(patchServices.listener).toHaveBeenCalled();
    });
  });
});