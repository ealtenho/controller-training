angular.module('sampleApp').
  controller('SampleAppController', ['$timeout', '$scope', function($timeout, $scope) {

    /**
    * 1. DOM manipulation method of changing button
    */
    // var btn = document.getElementById('trainingWheels');
    // btn.onclick = function() {
    //   btn.innerHTML = 'Training wheels off!';
    // }

    /**
    * 1. Angular method of changing button
    */
    this.clicked = false;

    /**
    * 2. DOM manipulation method of adding dynamic elements
    */
    this.bicycles = ['Google bike', 'Mountain Bike', 'Conference Bike'];

    // var bikeDiv = document.getElementById('bicycles');
    // for(var i = 0; i < this.bicycles.length; i++)
    // {
    //     var newDiv = document.createElement('div');
    //     newDiv.innerHTML = this.bicycles[i];
    //     bikeDiv.appendChild(newDiv);
    // }


    /**
    * 3. DOM manipulation method (using JQuery) of removing elements
    * Also demonstrates catching asynchronous actions
    */
    // $timeout(function() {
    //     $('#remove').remove();
    // }, 3000);

    $scope.removeTime = false;
    /**
    * 3. Angular method for removal
    */
      $timeout(function() {
        console.log('Running');
        $scope.removeTime = true;
      }, 3000);
  }]);