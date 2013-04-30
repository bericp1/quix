'use strict';

angular.module('quixApp', ['ngCookies'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .when('/question', {
        templateUrl: 'views/question.html',
        controller: 'QuestionCtrl'
      })
      .when('/answer', {
        templateUrl: 'views/answer.html',
        controller: 'AnswerCtrl'
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
        (function () {})(scope);
        (function () {})(element);
        (function () {})(attrs);
        var cs = function(){
          $.get('/candystatus', {}, function(data){
            $(element.get(0)).find('span').text(data.status); //This is not OK too do in the model
          }, 'json');
        };
        window.setInterval(cs, 10000);
        cs();
      }
    };
  })
  .run(function($rootScope){

    $rootScope.$on('$routeChangeSuccess', function(){
      window.textFillUpdate();
    });

    $rootScope.$on('UpdateTextFill', function(){
      window.textFillUpdate();
    });

  });
