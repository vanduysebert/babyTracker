(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('userProfileCtrl', userProfileCtrl);

  userProfileCtrl.$inject = ['$scope', 'userDataSvc', '$ionicScrollDelegate', '$firebaseObject', 'userSvc', 'loggingService', '$cordovaCamera', '$ionicModal', 'fullName', 'userProfile', 'Auth', '$ionicLoading', '$location','$ionicActionSheet'];

  /**
   * Controller that handles the profile of the user
   */
  function userProfileCtrl($scope, userDataSvc, $ionicScrollDelegate, $firebaseObject, userSvc, loggingService, $cordovaCamera, $ionicModal, fullName, userProfile, Auth, $ionicLoading, $location, $ionicActionSheet) {
    var vm = this;
    //Variables
    vm.user = userProfile;
    vm.fullName = fullName;
    vm.isEdit = false;
    vm.birthDate = false;
    vm.authPassword = {
      isPassword: false,
      oldEmail: '',
      newEmail: '',
      oldPassword: '',
      newPassword: ''
    };


    vm.auth = "";

    //Functions
    vm.choosePhotoInput = choosePhotoInput;
    vm.editForm = editForm;

    vm.updateUser = updateUser;
    vm.updatePhotoUser = updatePhotoUser;
    vm.write = false;
    vm.writePhoto = false;
    vm.showNewMail = showNewMail;
    vm.showNewPassword = showNewPassword;
    activate();

    function activate() {
      //Get authentication-method
      userSvc.getAuth().then(function(authData) {
        vm.auth = authData;
        if (authData.provider === "password") {
          vm.authPassword.isPassword = true;
        }
      }, function(err) {
        loggingService.showError("Retrieving authData failed", err, "profileCtrl", false);
      });
      //Set default profileImage
      if (!vm.user.profileImage) {
        vm.user.profileImage = getDefaultProfileImage();
      }
      if(vm.user.birthDateTime) {
        vm.birthDate = new Date(vm.user.birthDateTime);
      }
    }

    function getDefaultProfileImage() {
      if (userDataSvc.gender === "male") {
        return "img/userProfileMan.png";
      } else {
        return "img/userProfileWoman.png";
      }
    }

    //Edit form
    function editForm(id) {
      vm.write = !vm.write;
      $location.hash(id);
      $ionicScrollDelegate.anchorScroll(true);
    }

    //Update user
    function updateUser(form) {
      console.log("test");
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
      if (form.$valid) {
        console.log("test");
        if (vm.birthDate) {
          vm.user.birthDateTime = vm.birthDate.getTime();
          vm.user.birthDateString = moment(vm.birthDate).format("DD-MM-YYYY");
        } else {
          vm.user.birthDateTime = false;
          vm.user.birthDateString = false;
        }
        console.log("test");
        console.log(vm.user);
        userSvc.updateUser(vm.auth.uid, vm.user).then(function(ref) {
          console.log("test");
          userSvc.getUserProfile(ref.key()).then(function(user) {
            console.log("test");
            vm.user = user;
            vm.write = false;
            $ionicLoading.hide();
          }, function(err) {
            loggingService.showError("Update user failed", err, "userProfile", false);
            $ionicLoading.hide();
          });
        }, function(err) {
          loggingService.showError("Update user failed", err, "userProfile", false);
          $ionicLoading.hide();
        });
      } else {
        $ionicLoading.hide();
      }
    }

    //Update profile picture
    function updatePhotoUser() {
      userSvc.updateUser(vm.auth.uid, vm.user).then(function(ref) {
        userSvc.getUserProfile(ref.key()).then(function(user) {
          vm.user = user;
          vm.writePhoto = false;
        }, function(err) {
          loggingService.showError("Update user failed", err, "userProfile", false);
        });
      }, function(err) {
        loggingService.showError("Update user failed", err, "userProfile", false);
      });
    }

    //Show actionsheet new photo
    function choosePhotoInput() {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'Maak foto'
        }, {
          text: 'Kies foto'
        }],
        titleText: 'Profielfoto wijzigen',
        cancelText: 'Annuleer',
        cancel: function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          if(index == 0) {
            var sourceType = Camera.PictureSourceType.CAMERA;
            uploadProfilePicture(sourceType);
          } else if(index == 1) {
            var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            uploadProfilePicture(sourceType);
          }
          return true;
        }
      });
    };

    //Upload picture
    function uploadProfilePicture(sourceType) {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      }
      $cordovaCamera.getPicture(options).then(function(imageData) {
        vm.profileImageSrc = "data:image/jpeg;base64," + imageData;
        vm.user.profileImage = imageData;
        vm.user.photoInDatabase = true;
        vm.writePhoto = true;
      }, function(error) {
        loggingService.showError("Upload picture failed", error, "upload picture", false);
      });
    }

    //change password authenticated user
    function showNewPassword() {
      $ionicModal.fromTemplateUrl('templates/modals/newPassword.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;

        $scope.modal.show();
      });

      $scope.user = {
        email: '',
        oldPassword: '',
        newPassword: ''
      };

      $scope.errMess = "";

      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });


      $scope.changePassword = function() {
        if ($scope.user.oldPassword != $scope.user.newPassword) {
          Auth.$changePassword({
            email: vm.auth.password.email,
            oldPassword: $scope.user.oldPassword,
            newPassword: $scope.user.newPassword
          }).then(function() {
            $scope.modal.hide();
            loggingService.showSuccess("Paswoord is aangepast", vm.auth, "userProfile", true);
          }).catch(function(err) {
            $scope.errMess = "Paswoord kon niet veranderd worden. " + err;
            loggingService.showError("Password change failed", err, "userProfile", true);
          });
        } else {
          loggingService.showError("Old password is the same as the new password", null, "userProfile", true);
          $scope.errMess = "Huidige paswoord is hetzelfde als het nieuwe paswoord.";
        }
      }
    }

    //Change authenticated emailadres user
    function showNewMail() {
      $ionicModal.fromTemplateUrl('templates/modals/newEmail.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

      $scope.user = {
        oldEmail: '',
        newEmail: '',
        password: ''
      };

      $scope.errMess = "";

      $scope.changeEmail = function() {
        if ($scope.user.oldEmail === vm.auth.password.email) {
          Auth.$changeEmail({
            oldEmail: $scope.user.oldEmail,
            newEmail: $scope.user.newEmail,
            password: $scope.user.password
          }).then(function() {
            $scope.modal.hide();
            loggingService.showSuccess("Email is aangepast", vm.auth, "userProfile", true);
          }).catch(function(err) {
            $scope.errMess = "Email kon niet veranderd worden. " + err;
            loggingService.showError("Email change failed", err, "userProfile", false);
          });
        } else {
          $scope.errMess = "Oud emailadres komt niet overeen met het huidige.";
          loggingService.showError("Email change failed", null, "userProfile", false);
        }
      }
    }
  }
})();
