'use strict';

angular.module('quixApp', ['ngResource'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
      .when('/admin', { //NEW PAGE (NON AGULAR)?????
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl' //Needs to be created
      })
      .otherwise({
        redirectTo: '/start'
      });
  }])
  .directive('candystatus', function () {
    return {
      restrict: 'C',
      replace: true,
      scope: {
        'status': '@'
      },
      templateUrl: 'views/components/candystatus.html',
      link: function (scope, element, attrs) {
        //Add functionality to load status from server
        (function(){})(scope);
        (function(){})(element);
        (function(){})(attrs);
        /*$.get("/");*/
      }
    };
  });
