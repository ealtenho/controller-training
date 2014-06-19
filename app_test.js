describe('controller application', function() {
  var $controller, $rootScope;
  beforeEach(module('controllerApp'));
  beforeEach(module('$timeout'));
  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
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
      spyOn(patchServices, 'unpatchOnePrototype');
      expect(patchServices.unpatchOnePrototype).not.toHaveBeenCalled();
      var controllerMock = function() {
        var element = document.createElement('a');
        element.innerHTML = 'testValue';
      };
      var ctrl = $controller(controllerMock);
      expect(patchServices.unpatchOnePrototype).toHaveBeenCalled();
    });


    it('should handle asynchronous DOM manipulations', inject(function($rootScope) {
      var timeoutCompleted = false;

      runs(function() {
        spyOn(patchServices, 'listener');
        expect(patchServices.listener).not.toHaveBeenCalled();
        var controllerMock = function($timeout) {
            $timeout(function() {
              var element = document.createElement('a');
              element.innerHTML = 'testValue';
              timeoutCompleted = true;
            }, 0);
          };
        var ctrl = $controller(controllerMock);
        $rootScope.$apply();
      });

      waitsFor(function() {
        return timeoutCompleted;
      }, 'controller execution', 100);

      runs(function() {
        expect(patchServices.listener).toHaveBeenCalled();
      });
    }));
  });
});