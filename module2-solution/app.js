(function () {
'use strict';

angular.module('ShoppingListCheckOff', [])
.controller('ToBuyController', ToBuyController)
.controller('AlreadyBoughtController', AlreadyBoughtController)
.service('ShoppingListCheckOffService', ShoppingListCheckOffService);

ToBuyController.$inject = ['ShoppingListCheckOffService'];
function ToBuyController(ShoppingListCheckOffService) {
  var toBuy = this;

  toBuy.items = ShoppingListCheckOffService.getToBuyItems();

  toBuy.buyItem = function (itemIndex) {
          ShoppingListCheckOffService.buyItem(itemIndex);
  };
  var error = new Error();
    toBuy.errorMessage = error.message;
}

AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
function AlreadyBoughtController(ShoppingListCheckOffService) {
  var alreadyBought = this;

  alreadyBought.items = ShoppingListCheckOffService.getAlreadyBoughtItems();
}    

function ShoppingListCheckOffService() {
  var service = this;

  var toBuyItems = [    
    {
      name: "Cookies",
      quantity: 10
    },
    {
      name: "Cookies",
      quantity: 10
    },
    {
      name: "Cookies",
      quantity: 10
    },
    {
      name: "Cookies",
      quantity: 10
    }
  ];
  
    var alreadyBoughtItems = [];
    service.buyItem = function (itemIndex) {
      alreadyBoughtItems.push(toBuyItems[itemIndex]);
      toBuyItems.splice(itemIndex, 1);
      

    };
    service.getToBuyItems = function () {
      return toBuyItems;
              };
    service.getAlreadyBoughtItems = function () {
      return alreadyBoughtItems;
    };
}



})();