describe('controller application', function() {
  var $controller;
  beforeEach(module('controllerApp'));
  beforeEach(inject(function(_$controller_, _$timeout_) {
    $controller = _$controller_;
    $timeout = _$timeout_;
  }));
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


    it('should unpatch prototypes after execution', function() {
      spyOn(patchServices.prototypePatcher, 'removeManipulationListener');
      expect(patchServices.prototypePatcher.removeManipulationListener).not.toHaveBeenCalled();
      var controllerMock = function() {
        var element = document.createElement('a');
        element.innerHTML = 'testValue';
      };
      var ctrl = $controller(controllerMock);
      expect(patchServices.prototypePatcher.removeManipulationListener).toHaveBeenCalled();
    });


    it('should handle asynchronous DOM manipulations', function() {
      spyOn(patchServices, 'listener');
      expect(patchServices.listener).not.toHaveBeenCalled();
      var controllerMock = function() {
        $timeout(function() {
          var element = document.createElement('a');
          element.innerHTML = 'testValue';
        });
      };
      var ctrl = $controller(controllerMock);
      expect(patchServices.listener).toHaveBeenCalled();
    });
  });
});