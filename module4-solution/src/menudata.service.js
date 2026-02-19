(function () {
'use strict';

angular.module('data')
.service('MenuDataService', MenuDataService);


MenuDataService.$inject = ['$q', '$http']
function MenuDataService($q, $http) {
  var service = this;
    service.getAllCategories = function () {
        return $http({
        method: "GET",
        url: "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json"
      }).then(function (result) {
        var categories = [];
        for (var key in result.data) {
          categories.push(result.data[key]);
        }
        console.log(categories);
        return categories;
      });
    }

    service.getItemsForCategory = function (categoryShortName) {
     return $http({
        method: "GET",
        url: `https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/${categoryShortName}.json`
      }).then(function (result) {
        return result.data.menu_items || [];
      });
    }
}
})();
