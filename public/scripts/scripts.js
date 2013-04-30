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

'use strict';

angular.module('quixApp')
.controller('AdminCtrl', ['$scope', function ($scope) {
  $scope.password = '';

  $scope.AddQuestionCtrl = ['$scope', function($scope){
    $scope.question = '';
    $scope.a = '';
    $scope.b = '';
    $scope.c = '';
    $scope.d = '';
    $scope.correct = '';
    $scope.status = 'Ready!';
    $scope.statusClass = 'text-info';
    $scope.enabled = true;

    $scope.add = function(){

      $scope.statusClass = 'text-info';
      $scope.enabled = false;
      $.get('/admin/addquestion', {
        password: $scope.password,
        question: $scope.question,
        a: $scope.a,
        b: $scope.b,
        c: $scope.c,
        d: $scope.d,
        correct: $scope.correct
      }, function(data){
        if(data.ok){
          $scope.statusClass = 'text-success';
          $scope.status = 'Add SUCCESS!';
          $scope.question = '';
          $scope.a = '';
          $scope.b = '';
          $scope.c = '';
          $scope.d = '';
          $scope.correct = '';
        }else{
          $scope.statusClass = 'text-error';
          $scope.status = 'Add FAILED: ' + data.err;
        }
        $scope.enabled = true;
        $scope.$apply();
      }, 'json');

    };
  }];

  $scope.CandyStatusCtrl = ['$scope', function($scope){

    $scope.newstatus = '';
    $scope.status = 'Ready!';
    $scope.statusClass = 'text-info';
    $scope.enabled = true;

    $scope.change = function(){

      $scope.enabled = false;
      $scope.status = 'Changing...';
      $scope.statusClass = 'text-info';

      $.get('/admin/changecandystatus', {
        password: $scope.password,
        status: $scope.newstatus
      }, function(data){
        if(data.ok){
          $scope.newstatus = '';
          $scope.status = 'Change SUCCESS!';
          $scope.statusClass = 'text-success';
        }else{
          $scope.status = 'Change FAILED: ' + data.err;
          $scope.statusClass = 'text-error';
          console.log(data.err);
        }
        $scope.enabled = true;
        $scope.$apply();
      }, 'json');

    };
  }];

  $scope.QuestionReenableCtrl = ['$scope', function($scope){

    $scope.status = 'Ready!';
    $scope.statusClass = 'text-info';
    $scope.enabled = true;

    $scope.reenable = function(){
      $scope.enabled = false;
      $scope.status = 'Re-Enableing...';
      $scope.statusClass = 'text-info';

      $.get('/admin/reenablequestions', {
        password: $scope.password
      }, function(data){
        if(data.ok){
          $scope.newstatus = '';
          $scope.status = 'Re-Enable SUCCESS!';
          $scope.statusClass = 'text-success';
        }else{
          $scope.status = 'Re-Enable FAILED: ' + data.err;
          $scope.statusClass = 'text-error';
          console.log(data.err);
        }
        $scope.enabled = true;
        $scope.$apply();
      }, 'json');
    };
  }];

  $scope.NextQuestionCtrl = ['$scope', function($scope){

    $scope.status = 'Ready!';
    $scope.statusClass = 'text-info';
    $scope.enabled = true;

    $scope.nextQuestion = function () {
      $scope.enabled = false;
      $scope.status = 'Setting up next question...';
      $scope.statusClass = 'text-info';

      $.get('/new_question',
      {},
      function(data){
        if(data.ok){
          $scope.status = 'SUCCESS!';
          $scope.statusClass = 'text-success';
        }else{
          $scope.status = 'FAILED: ' + data.err;
          $scope.statusClass = 'text-error';
          console.log(data.err);
        }
        $scope.enabled = true;
        $scope.$apply();
      }, 'json');
    };
  }];
}]);

'use strict';

angular.module('quixApp')
.controller('StartCtrl', ['$scope', '$location', function ($scope, $location) {

  (function () {})($scope);
  (function () {})($location);

  $scope.blockViewing = true;

  $scope.goTo = function(whereto){
    $location.path('/' + whereto);
  };

}]);

'use strict';

angular.module('quixApp')
.controller('QuestionCtrl', ['$scope', function ($scope) {

  $scope.currentQuestionId    = -1;
  $scope.currentQuestionText  = 'Loading next question...';
  $scope.answerTextA = '';
  $scope.answerTextB = '';
  $scope.answerTextC = '';
  $scope.answerTextD = '';
  $scope.loading = true;



  var update = function(m){
    var method = m || 'current';
    $.get(
      '/' + method + '_question',
      {},
      function (data) {
        if(data.ok){
          $scope.currentQuestionId = data.id;
          $scope.currentQuestionText = data.question;
          $scope.answerTextA = data.answers.A;
          $scope.answerTextB = data.answers.B;
          $scope.answerTextC = data.answers.C;
          $scope.answerTextD = data.answers.D;
          $scope.correct = data.answers.correct;
          $scope.loading = false;
        }else{
          $scope.currentQuestionId = -1;
          $scope.currentQuestionText = 'Something went wrong.';
          if(data.humanErr){
            $scope.currentQuestionText = data.humanErr;
          }
          $scope.answerTextA = '';
          $scope.answerTextB = '';
          $scope.answerTextC = '';
          $scope.answerTextD = '';
          $scope.correct = '';
          $scope.loading = false;
          console.log(data.err);
        }
        $scope.$apply();
      }
    );
  };

  update();

  var duration = 50;
  if (Modernizr.touch){
    duration = 2000;
  }
  window.setInterval(function () {
    window.textFillUpdate();
  }, duration);


  window.setInterval(function () {
    update();
  }, 5000);
}]);
'use strict';

angular.module('quixApp')
.controller('AnswerCtrl', ['$scope', '$cookieStore', '$window', function ($scope, $cookieStore, $window) {

  (function () {})($scope);

  $scope.ok = true;
  $scope.status = 'Loading...';
  $scope.questionId = -1;
  $scope.correct = '';

  $scope.state = 'loading';

  $scope.update = function(callback){
    $.get('/current_question',
      {},
      function(data){
        if(data.ok){
          $scope.ok = true;
          $scope.questionId = data.id;
          $scope.correct = data.answers.correct;
        }else{
          $scope.ok = false;
          $scope.questionId = -1;
          $scope.correct = '';
          $scope.status = '<br><h2>Something went wrong. Try refreshing.</h2>';
          if(data.humanErr){
            $scope.status = '<h2>' + data.humanErr + '</h2><button class="btn btn-blk" onclick="window.location.reload();">Refresh</button>';
          }
          $scope.state = 'loading';
        }
        $scope.$apply();
        callback();
      }
    );
  };

  $scope.update(function () {

    if($scope.ok){
      if($cookieStore.get('hasPlayed') && (parseInt($cookieStore.get('hasPlayed'), 10) === parseInt($scope.questionId, 10))){
        $scope.state = 'loading';
        $scope.status = '<h2>Wait until the next question.</h2><button class="btn btn-blk" onclick="window.location.reload();">Refresh</button>';
      }else{
        $scope.$apply(function(){
          $cookieStore.remove('hasPlayed');
        });
        $scope.state = 'answers';
      }
      $scope.$apply();
    }

  });

  $scope.check = function (answer) {
    $scope.state = 'loading';
    $scope.update(function () {
      if($scope.ok){
        if($scope.correct.toLowerCase() === answer.toLowerCase()){
          $scope.state = 'winner';
          window.setTimeout(function () {
            $scope.$apply(function () {
              $scope.refresh();
            });
          }, 60000);
        }else{
          $scope.state = 'loser';
        }
        $scope.$apply(function(){
          $cookieStore.put('hasPlayed', parseInt($scope.questionId, 10));
        });
        $scope.$apply();
      }
    });
  };

  $scope.refresh = function(){
    $window.location.reload();
  };

}]);

'use strict';

window.textFillUpdate = function(max){
  var nMax = max || 86;
  $('.textfill').each(function (i,e) {
    $(e).textfill({maxFontPixels: nMax});
  });
};