(function () {
'use strict';

angular.module('public')
  .controller('MyInfoController', MyInfoController);

MyInfoController.$inject = ['UserService'];
function MyInfoController(UserService) {
  var ctrl = this;

  ctrl.userInfo = UserService.getUserInfo();

  // Extract the category letter(s) from a short_name like "L1" → "L"
  ctrl.getCategory = function (shortName) {
    if (!shortName) { return ''; }
    var match = shortName.match(/^([A-Za-z]+)/);
    return match ? match[1].toUpperCase() : '';
  };
}

})();
