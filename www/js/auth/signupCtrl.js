(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('signupCtrl', signupCtrl);

  signupCtrl.$inject = ['$scope', 'Auth', '$state', '$ionicLoading', 'config', 'loggingService'];

  /**
   * Handles the registration of a new user
   */
  function signupCtrl($scope, Auth, $state, $ionicLoading, config, loggingService) {
    var vm = this;
    vm.userSvc = new Firebase(config.dbUrls.auth);
    vm.user = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      gender: 'male',
      profileImage: ''
    };

    vm.signupFail = false;
    vm.failMessage = '';

    vm.createUser = createUser;

    // Register new user
    function createUser(form) {
      if (form.$valid) {
        $ionicLoading.show( {
          template: '<ion-spinner icon="ripple"></ion-spinner>'
        });
        vm.signupFail = false;
        Auth.$createUser({
          email: vm.user.email,
          password: vm.user.password
        }).then(function(userData) {
          var user = vm.userSvc.child(userData.uid);
          user.set({
            firstName: vm.user.firstName,
            lastName: vm.user.lastName,
            email: vm.user.email,
            gender: vm.user.gender,
            profileImage: '',
            follows: false
          });
          return Auth.$authWithPassword({
            email: vm.user.email,
            password: vm.user.password
          });
        }).then(function(authData) {
          loggingService.showSuccess('User logged in as:', authData, 'signup', false);
          $ionicLoading.hide();
          $state.go('app.start')
        }).catch(function(error) {
          vm.signupFail = true;
          $ionicLoading.hide();
          if(error.code === "DISCONNECTED") {
            vm.failMessage = "U bent niet verbonden met het internet. Probeer opnieuw als de verbinding is hersteld.";
          } else if(error.code === "EMAIL_TAKEN") {
            vm.failMessage = "Email is reeds in gebruik.";
          } else if(error.code === "INVALID_EMAIL") {
            vm.failMessage = "Ongeldig emailadres opgegeven.";
          } else if (error.code === "INVALID_PASSWORD") {
            vm.failMessage = "Ongeldig paswoord.";
          } else if (error.code === "NETWORK_ERROR") {
            vm.failMessage = "Er heeft zich een netwerkfout voorgedaan. Probeer het opnieuw of raadpleeg de beheerder als het probleem zich blijft voortdoen";
          } else {
            vm.failMessage = "Er is een fout opgetreden. Probeer het opnieuw of raadpleeg de beheerder als het probleem zich blijft voordoen.";
          }
          loggingService.showError("Error signup user", error, "signup", true);
        });
      }
    }
  }
})();
