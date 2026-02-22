(function () {
'use strict';

angular.module('public')
  .directive('validateMenuItem', validateMenuItem);

/**
 * Attribute directive that adds an async validator to an ngModel field.
 * Fires on blur (via ng-model-options updateOn:'blur' on the input) and
 * validates whether the typed short_name exists in the Firebase menu data.
 *
 * Usage:
 *   <input ng-model="..." validate-menu-item
 *          ng-model-options="{ updateOn: 'blur' }">
 *
 * Sets $error.menuItem = true when the item is not found.
 */
validateMenuItem.$inject = ['UserService', '$q'];
function validateMenuItem(UserService, $q) {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {

      ngModel.$asyncValidators.menuItem = function (modelValue, viewValue) {
        var value = modelValue || viewValue;

        // Empty value: not this directive's job (use `required` for that)
        if (!value || value.trim() === '') {
          return $q.when(true);
        }

        // Wrong format: let ng-pattern handle it; skip the HTTP call
        if (!/^[A-Za-z]+\d+$/.test(value.trim())) {
          return $q.when(true);
        }

        return UserService.findMenuItem(value.trim())
          .then(function (item) {
            if (item) {
              return item;             // resolved → valid
            }
            return $q.reject();        // rejected → $error.menuItem = true
          });
      };
    }
  };
}

})();
