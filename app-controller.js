angular.module('sampleApp').
  controller('SampleAppController', function() {
    var btn = document.getElementById('trainingWheels');
    btn.onclick = function() {
      btn.innerHTML = 'Training wheels off!';
      //var elm = document.createElement('a');
      //document.add(elm);
    }

    var newDiv = document.createElement('div');
    newDiv.innerHTML = 'Training wheels off!';

    btn.remove();
  });