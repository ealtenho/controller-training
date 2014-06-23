describe('Asynchronous controller execution detection', function(){
  var $controller, $rootScope;
  beforeEach(module('controllerTrainer'));
  beforeEach(module('$timeout'));
  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));
  beforeEach(function() {
    patchServices.listener = function() {
      console.log('For tests, just print this error.');
    }
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
          try{
          var ctrl = $controller(controllerMock);
          }
          catch(e){
            console.log('Caught an error making controller: ' + e);
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
  it('should unpatch elements after asynchronous execution', inject(function($rootScope) {
    var timeoutCompleted = false;
    var objectProperties = Object.getOwnPropertyNames(Element.prototype);
    var objectPropertiesNode = Object.getOwnPropertyNames(Node.prototype);
    var objectPropertiesEventTarget = Object.getOwnPropertyNames(EventTarget.prototype);
    var objectPropertiesDocument = Object.getOwnPropertyNames(Document.prototype);
    var testProperty = objectProperties[0];
    var originalFunction = Element.prototype[testProperty];
    var originalFunctionNode = Node.prototype[testProperty];
    var originalFunctionEventTarget = EventTarget.prototype[testProperty];
    var originalFunctionDocument = Document.prototype[testProperty];
    expect(Element.prototype[testProperty]).toBe(originalFunction);
    var elem = document.createElement('div');
    elem.setAttribute('id', 'testElement');
    document.body.appendChild(elem);
        runs(function() {
          spyOn(patchServices, 'listener');
          var controllerMock = function($timeout) {
              $timeout(function() {
                var element = document.getElementById('testElement');
                element.getAttribute('id');
                timeoutCompleted = true;
              }, 0);
            };
          try{
          var element = document.getElementById('testElement');
          element.getAttribute('id');
          var ctrl = $controller(controllerMock);
          }
          catch(e){
            console.log('Caught an error making controller: ' + e);
          }
          var element = document.getElementById('testElement');
          element.getAttribute('id');
        });

        waitsFor(function() {
          elem = document.getElementById('testElement');
          elem.getAttribute('id');
          return timeoutCompleted;
        }, 'controller execution', 100);

        runs(function() {
          elem.getAttribute('id');
          expect(Element.prototype[testProperty]).toBe(originalFunction);
          expect(Node.prototype[testProperty]).toBe(originalFunctionNode);
          expect(EventTarget.prototype[testProperty]).toBe(originalFunctionEventTarget);
          expect(Document.prototype[testProperty]).toBe(originalFunctionDocument);
          expect(patchServices.listener.callCount).toBe(2);
        });
  }));
  iit('should use zone.js to enter and exit at the right times', inject(function($rootScope) {
    var timeoutCompleted = false;
    runs(function() {
      var testZone = zone.fork(Zone.longStackTraceZone).fork({
        beforeTask: function() {
          console.log('before');
          patchServices.addManipulationListener();
        },
        afterTask: function() {
          console.log('after');
          patchServices.removeManipulationListener();
        }
      });
      var ctrlFunction = function() {
        var controllerMock = function($timeout) {
          $timeout(function() {
          //document.createElement('test');
          $scope.value = 'new value';
          timeoutCompleted = true;
          }, 0);
        };
        document.createElement('test1');
        var myScope = $rootScope.$new();
        var ctrl = $controller(controllerMock, {$scope: myScope});
        ctrl.testAttribute = 'testAttribute';
        console.log(ctrl.testAttribute);
        document.createElement('test2');
      };
      testZone.bind(ctrlFunction);
      document.createElement('test3');
      ctrlFunction();
      document.createElement('test4');
      ctrlFunction();
  });
    waitsFor(function() {
      document.createElement('test');
      return timeoutCompleted;
    }, 'controller execution', 100);
    runs(function() {
      document.createElement('test5');
    });
  }));
});
