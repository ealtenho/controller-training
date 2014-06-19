describe('Controller error', function() {
  var $controller;
  beforeEach(module('controllerApp'));
  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));
  it('should throw an informative error about the controller manipulation', function() {
    var controllerMock = function() {
      var element = document.createElement('a');
      element.innerHTML = 'testValue';
    };
    expect(function() {
        var ctrl = $controller(controllerMock);
    }).toThrow();
  });


  it('should throw an overwritten error if customization is desired', function() {
    patchServices.listener = function() {
      throw new Error('My own error message.');
    }
    var controllerMock = function() {
      var element = document.createElement('a');
      element.innerHTML = 'testValue';
    }
    expect(function() {
      var ctrl = $controller(controllerMock);
    }).toThrow('My own error message.');
  });
});