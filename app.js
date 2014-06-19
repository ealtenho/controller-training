angular.module('sampleApp', ['ngRoute', 'controllerTrainer']).
      config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/training', {
          controller: 'SampleAppController',
          controllerAs: 'sampleAppCtrl',
          templateUrl: 'sampleApp.html'
        }).
        otherwise({redirectTo: '/training'});
  }]);