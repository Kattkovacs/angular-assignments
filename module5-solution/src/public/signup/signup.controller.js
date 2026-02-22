(function () {
'use strict';

angular.module('public')
  .controller('SignUpController', SignUpController);

SignUpController.$inject = ['UserService'];
function SignUpController(UserService) {
  var ctrl = this;

  ctrl.user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    favMenuNumber: ''
  };

  ctrl.menuItemError = null;   // "No such menu number exists"
  ctrl.savedMessage = false;   // show "Your information has been saved"
  ctrl.submitting = false;

  ctrl.submit = function (signupForm) {
    // Mark the form as submitted so all validation errors become visible
    signupForm.$setSubmitted();

    if (signupForm.$invalid) {
      return;
    }

    ctrl.submitting = true;
    ctrl.menuItemError = null;
    ctrl.savedMessage = false;

    UserService.findMenuItem(ctrl.user.favMenuNumber)
      .then(function (item) {
        ctrl.submitting = false;
        if (!item) {
          ctrl.menuItemError = 'No such menu number exists';
          return;
        }
        // Save everything including the resolved menu item
        UserService.saveUserInfo({
          firstName: ctrl.user.firstName,
          lastName: ctrl.user.lastName,
          email: ctrl.user.email,
          phone: ctrl.user.phone,
          favMenuNumber: ctrl.user.favMenuNumber,
          menuItem: item
        });
        ctrl.savedMessage = true;
      })
      .catch(function () {
        ctrl.submitting = false;
        ctrl.menuItemError = 'No such menu number exists';
      });
  };
}

})();
