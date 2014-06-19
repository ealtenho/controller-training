angular.module('$timeout', []).
  config(function ($provide) {

    'use strict';

    $provide.decorator('$timeout', function($delegate) {
      return function (fn, time) {
        return setTimeout(fn, time || 0);
      };
    });
  });
