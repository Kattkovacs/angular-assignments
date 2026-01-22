

(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .factory('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective)
        .constant('ApiBasePath', 'https://coursera-jhu-default-rtdb.firebaseio.com/');

NarrowItDownController.$inject = ['MenuSearchService'];
        function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        var menuSearch = MenuSearchService(searchTerm);
        ctrl.items = menuSearch.getMenuItems(searchTerm);

        // ctrl.getMatchedMenuItems = function(searchTerm) {
        //     MenuSearchService.getMenuItems(searchTerm)
        //         .then(function(menuItems) {
        //            console.log(menuItems)
        //             ctrl.items = menuItems;
        //             console.log(ctrl.items)
        //         });
        // };
        ctrl.removeItem = function(index) {
            ctrl.items.splice(index, 1);
        };
    }

    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMenuItems = function(searchTerm) {
            return $http.get(ApiBasePath + 'menu_items.json')
                .then(function(response) {
                    return service.filterMenuItems(response.data, searchTerm);
                });
        };

       service.filterMenuItems = function(menuItems, searchTerm) {
    var foundItems = [];

    Object.keys(menuItems).forEach(function(key) {
      var found = [];
        var menuItemsArray = menuItems[key].menu_items;
        // console.log(menuItemsArray)
        if (menuItemsArray.length > 0) {
            found = menuItemsArray.filter(function(item) {
              return item.description && searchTerm && item.description.toLowerCase().includes(searchTerm.toLowerCase());
            });
          }
          if (found.length > 0) {  
              foundItems.push({menu_items: found});
          }
        });
    console.log(service.flattenMenuItems(foundItems));
    return service.flattenMenuItems(foundItems);
};

        service.flattenMenuItems = function(menuItems) {
          console.log(menuItems);
            return menuItems.reduce(function(prev, curr) {
                return prev.concat(curr.menu_items);
            }, []);
        };
    }

    function FoundItemsDirective() {
        var directive = {      
            scope: {
                items: '=',
                onRemove: '&',
            },
            templateUrl: 'foundItems.html',
            controller: NarrowItDownController,
            controllerAs: 'ctrl',
            bindToController: true
        };

        return directive;
    }
    // FoundItemsController.$inject = ['MenuSearchService'];

    // function FoundItemsController() {
    //     var ctrl = this;
    //      console.log(ctrl.items); 
    // }
})();