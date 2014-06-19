describe('Asynchronous controller execution detection', function(){
  var $controller, $rootScope;
  beforeEach(module('controllerApp'));
  beforeEach(module('$timeout'));
  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));
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
          try{
          var ctrl = $controller(controllerMock);
          }
          catch(e){

          }
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
