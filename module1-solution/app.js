(function () {
'use strict';

angular.module('LunchCheck', [])
.controller('LunchCheckController', LunchCheckController);

function LunchCheckController($scope, $filter) {
  LunchCheckController.$inject = ['$scope', '$filter'];
  $scope.numberOfItems = 0;
    $scope.listOfDishes = [];
    $scope.textColor = 'black';

  $scope.checkListValue = function () {
    $scope.numberOfItems = $scope.listOfDishes.split(',').filter(function(item) {;
        return item.trim().length > 0;
  }).length;
  };

  $scope.sayMessage = function () {
    if ($scope.numberOfItems === 0) {
      return "Please enter ingredients first";
    } else if ($scope.numberOfItems <= 3) {
      $scope.textColor = 'green';
      return "Enjoy!";
    } else {
      $scope.textColor = 'red';
      return "Too much!";
    }
  };


}

})();