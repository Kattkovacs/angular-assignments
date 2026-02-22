(function () {
'use strict';

angular.module('common')
  .service('UserService', UserService);

UserService.$inject = ['$http', '$q'];
function UserService($http, $q) {
  var service = this;

  // Stored registration data
  service.userInfo = null;

  /**
   * Save the user's registration information (including resolved menuItem).
   */
  service.saveUserInfo = function (info) {
    service.userInfo = info;
  };

  /**
   * Retrieve saved registration info, or null if not yet registered.
   */
  service.getUserInfo = function () {
    return service.userInfo;
  };

  /**
   * Look up a menu item by its short_name (e.g. "L1").
   * The short_name is composed of a letter prefix (category) and a number (index).
   * Returns a promise that resolves to the menu item object, or null if not found.
   *
   * API endpoint pattern:
   *   https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/{CATEGORY}/menu_items/{INDEX}.json
   */
  service.findMenuItem = function (shortName) {
    // Parse short_name: letters = category, digits = 1-based number
    // Firebase stores menu items in a 0-based array, so L1 → index 0
    var match = shortName.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) {
      return $q.when(null);
    }
    var category = match[1].toUpperCase();
    var index = parseInt(match[2], 10) - 1;  // convert 1-based to 0-based

    if (index < 0) {
      return $q.when(null);
    }

    var url = 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/' +
              category + '/menu_items/' + index + '.json';

    return $http.get(url).then(function (response) {
      return response.data || null;
    });
  };
}

})();
