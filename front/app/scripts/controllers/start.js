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
