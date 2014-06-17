// Karma configuration
// Generated on %DATE%

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app.js',
      'app_test.js'
    ],
    exclude: [
    ],
    preprocessors: {
    },
    browsers: ['Chrome']
  });
};