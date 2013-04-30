'use strict';

angular.module('quixApp')
.controller('AdminCtrl', ['$scope', function ($scope) {
  $scope.password = '';

  $scope.AddQuestionCtrl = function($scope){
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
  };

  $scope.CandyStatusCtrl = function($scope){

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
  };

  $scope.QuestionReenableCtrl = function($scope){

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
  };
}]);