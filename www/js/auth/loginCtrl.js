(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$scope', '$state', 'Auth', '$ionicLoading', 'config', 'userSvc', 'loggingService'];

  /**
   * Controller that handles the login
   */
  function loginCtrl($scope, $state, Auth, $ionicLoading, config, userSvc, loggingService) {
    var vm = this;

    //variables
    vm.mod = 'login';

    vm.user = {
      email: '',
      password: ''
    };
    vm.failMessage = '';
    vm.loginFailed = false;
    vm.loggedIn = false;
    vm.loggedInUser = "";

    //Login-functions
    vm.loginMail = loginMail;
    vm.facebookLogin = facebookLogin;
    vm.googleLogin = googleLogin;

    //registeren
    vm.signup = signup;

    //Logout
    vm.logout = logout;

    // Firebase Auth-watcher that fires when authentication
    Auth.$onAuth(function(authData) {
      console.log(authData);
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
      if (authData) {
        loggingService.showSuccess('User found in authentication-database', authData, vm.mod, false);
        if (authData.provider === "facebook") {
          findFacebookUser(authData);
        } else if (authData.provider === "google") {
          findGoogleUser(authData);
        }

        //Check if user is in database
        userSvc.hasChildren(authData.uid).then(function(childrenArr) {
          //If no children registered, go to start-page
          if (childrenArr.length < 1) {
            $state.go('app.start');
          }
          //If more then one child registered, go to summary-page
          else if (childrenArr.length > 1) {
            $state.go('app.summaryStart');
          }
          // Else go to timeline of child
          else {
            $state.go('child.posts', {
              childId: childrenArr[0]
            })
          }
        }, function(err) {
          loggingService.showError("Could not get children of user", err, vm.mod, false);
        });
        vm.loggedIn = true;
        $ionicLoading.hide();
      } else {
        vm.loggedIn = false;
        vm.failMessage = "Gebruiker niet gevonden in de database";
        $ionicLoading.hide();
      }
    });

    function findFacebookUser(authData) {
      var ref = new Firebase(config.dbUrls.auth + "/" + authData.auth.uid);
      ref.once("value", function(data) {
        //Check if user is already in firebase-database
        if (!data.exists()) {
          //Add user to database
          var user = userSvc.usersRef.child(authData.uid);
          user.set({
            firstName: authData.facebook.cachedUserProfile.first_name,
            lastName: authData.facebook.cachedUserProfile.last_name,
            gender: authData.facebook.cachedUserProfile.gender,
            profileImage: authData.facebook.profileImageURL,
            follows: false
          });
          userSvc.getLoggedInUser().then(function(data) {
            vm.loggedInUser = data;
          }, function(err) {
            loggingService.showError("Could not get userinfo:", err, vm.mod, false);
          });
        }
      }, function(errorObject) {
        loggingService.showError("Could not get userinfo:", errorObject.code, vm.mod, true);
      });
    }

    function findGoogleUser(authData) {
      var ref = new Firebase(config.dbUrls.auth + "/" + authData.auth.uid);
      ref.once("value", function(data) {

        if (!data.exists()) {
          var user = userSvc.usersRef.child(authData.uid);
          user.set({
            firstName: authData.google.cachedUserProfile.given_name,
            lastName: authData.google.cachedUserProfile.family_name,
            gender: authData.google.cachedUserProfile.gender,
            profileImage: authData.google.profileImageURL,
            follows: false
          });
          userSvc.getLoggedInUser().then(function(data) {
            vm.loggedInUser = data;
          }, function(err) {
            loggingService.showError("Could not get userinfo:", err, vm.mod, false);
          });
        }
      }, function(errorObject) {
        loggingService.showError("Could not get userinfo:", errorObject.code, vm.mod, false);
      });
    }

    function logout() {
      Auth.$unauth();
    }

    function signup() {
      $state.go('signup');
    }

    function loginMail(form) {
      vm.loginFailed = false;
      vm.failMessage = '';
      if (form.$valid) {
        $ionicLoading.show({
          template: '<ion-spinner icon="ripple"></ion-spinner>'
        });

        //Authenticate with email
        Auth.$authWithPassword({
          email: vm.user.email,
          password: vm.user.password
        }).then(function(authData) {
          loggingService.showSuccess("User logged in", authData, vm.mod, false);
          $ionicLoading.hide();
        }).catch(function(error) {
          $ionicLoading.hide();
          vm.loginFailed = true;
          loggingService.showError("Authentication failed", error, "login", false);
          if (error.code === "DISCONNECTED") {
            vm.failMessage = "U bent niet verbonden met het internet. Probeer opnieuw als de verbinding is hersteld.";
          } else if (error.code === "INVALID_CREDENTIALS") {
            vm.failMessage = "De opgegeven authenticatie gegevens zijn ongeldig. Probeer het opnieuw, indien het probleem zich blijft voortdoen, raadpleeg dan de beheerder.";
          } else if (error.code === "INVALID_EMAIL") {
            vm.failMessage = "Ongeldig emailadres opgegeven.";
          } else if (error.code === "INVALID_PASSWORD") {
            vm.failMessage = "Foutief paswoord.";
          } else if (error.code === "NETWORK_ERROR") {
            vm.failMessage = "Er heeft zich een netwerkfout voorgedaan. Probeer het opnieuw of raadpleeg de beheerder als het probleem zich blijft voortdoen";
          } else if (error.code === "MAX_RETRIES") {
            vm.failMessage = "U heeft het maximaal aantal pogingen overschreden. Raadpleeg de beheerder.";
          } else if (error.code === "USER_DOES_NOT_EXIST" || error.code === "INVALID_USER") {
            vm.failMessage = "De opgegeven gebruiker bestaat niet. Gelieve u eerst te registeren.";
          } else {
            vm.failMessage = "Er is een fout opgetreden. Probeer het opnieuw of raadpleeg de beheerder als het probleem zich blijft voordoen.";
          }
        });
      } else {
        vm.loginFailed = true;
        vm.failMessage = "Het formulier is ongeldig. Voer uw gegevens opnieuw in en probeer het nogmaals.";
      }
    }

    function facebookLogin() {
      socialLogin("facebook")
    }

    function googleLogin() {
      socialLogin("google");
    }


    function socialLogin(authMethod) {
      //Authenticate with social login
      Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
        loggingService.showSuccess("Social login succeeded", authData, vm.mod, false);
      }).catch(function(error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
          Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
            // User successfully logged in. We can log to the console
            // since we’re using a popup here
            loggingService.showSuccess("Social login succeeded", authData, vm.mod, false);
          });
        } else {
          // Another error occurred
          loggingService.showSuccess("Social login failed", error, vm.mod, true);
        }
      });
    }
  }
})();
