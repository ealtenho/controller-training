describe('controller application', function() {
  var $controller, $timeout, $rootScope;
  beforeEach(module('controllerApp'));
  beforeEach(inject(function(_$controller_, _$timeout_, _$rootScope_) {
    $controller = _$controller_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
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
      spyOn(patchServices.prototypePatcher, 'removeManipulationListener');
      expect(patchServices.prototypePatcher.removeManipulationListener).not.toHaveBeenCalled();
      var controllerMock = function() {
        var element = document.createElement('a');
        element.innerHTML = 'testValue';
      };
      var ctrl = $controller(controllerMock);
      expect(patchServices.prototypePatcher.removeManipulationListener).toHaveBeenCalled();
    });


    iit('should handle asynchronous DOM manipulations', inject(function($rootScope) {
      spyOn(patchServices, 'listener');
      expect(patchServices.listener).not.toHaveBeenCalled();
      var controllerMock = function() {
        $timeout(function() {
          dump('hi');
          var element = document.createElement('a');
          element.innerHTML = 'testValue';
        });
      };
      var ctrl = $controller(controllerMock);
      $timeout.flush();
      $rootScope.$apply();

      expect(patchServices.listener).toHaveBeenCalled();
    }));
  });
});