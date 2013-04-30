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
