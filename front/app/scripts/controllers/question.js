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

  if(window.questionIntervalId){
    window.clearInterval(window.questionIntervalId);
  }

  window.questionIntervalId = window.setInterval(function(){
    update('new');
  }, 60000);
}]);