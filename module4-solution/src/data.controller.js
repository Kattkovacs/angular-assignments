(function () {
'use strict';

angular.module('data')
.controller('DataController', DataController);


// MainShoppingListController.$inject = ['ShoppingListService'];
// function MainShoppingListController(ShoppingListService) {
DataController.$inject = ['items'];
function DataController(items) {
  var $ctrl = this;
  $ctrl.items = items;
}

})();