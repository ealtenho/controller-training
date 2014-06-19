// Karma configuration
// Generated on %DATE%

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'node_modules/zone.js/zone.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'components/caPatch/error_test.js',
      'timeout.js',
      'components/caPatch/caPatchService.js',
      'components/caPatch/caPatchService_test.js',
      'async_test.js',
      'controllerTrainer.js',
      'controllerTrainer_test.js'
    ],
    exclude: [
    ],
    preprocessors: {
    },
    browsers: ['Chrome']
  });
};