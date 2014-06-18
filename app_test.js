describe('controller application', function() {
  var $controller, $rootScope, $timeout;
  beforeEach(module('controllerApp'));
  beforeEach(module('$timeout'));
  beforeEach(inject(function(_$controller_, _$rootScope_, _$timeout_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
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


    it('should handle asynchronous DOM manipulations', inject(function($rootScope) {
      dump($timeout);
      spyOn(patchServices, 'listener');
      expect(patchServices.listener).not.toHaveBeenCalled();
      runs(function() {
        var controllerMock = function() {
            $timeout(function() {
              dump('Running');
              var element = document.createElement('a');
              element.innerHTML = 'testValue';
            }, 250);
          };
        var ctrl = $controller(controllerMock);
      });
      $rootScope.$apply();
      waitsFor(function() {

      }, 'controller execution', 1000);


      expect(patchServices.listener).toHaveBeenCalled();
    }));
  });
});