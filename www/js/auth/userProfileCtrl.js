(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('userProfileCtrl', userProfileCtrl);

  userProfileCtrl.$inject = ['$scope', 'userDataSvc', '$ionicScrollDelegate', '$firebaseObject', 'userSvc', 'loggingService', '$cordovaCamera', '$ionicModal', 'fullName', 'userProfile', 'Auth'];

  function userProfileCtrl($scope, userDataSvc, $ionicScrollDelegate, $firebaseObject, userSvc, loggingService, $cordovaCamera, $ionicModal, fullName, userProfile, Auth) {
    var vm = this;
    vm.user = userProfile;
    vm.fullName = fullName;
    vm.editForm = editForm;
    vm.authPassword = {
      isPassword: false,
      oldEmail: '',
      newEmail: '',
      oldPassword: '',
      newPassword: ''
    };
    vm.birthDate = new Date(vm.user.birthDateTime);
    vm.auth = "";
    vm.choosePhotoInput = choosePhotoInput;

    vm.updateUser = updateUser;
    vm.updatePhotoUser = updatePhotoUser;
    vm.write = false;
    vm.writePhoto = false;
    vm.showNewMail = showNewMail;
    vm.showNewPassword = showNewPassword;
    activate();

    function activate() {
      userSvc.getAuth().then(function(authData) {
        vm.auth = authData;
        if (authData.provider === "password") {
          vm.authPassword.isPassword = true;
        }
      }, function(err) {
        loggingService.showError("Retrieving authData failed", err, "profileCtrl", false);
      });
      if(!vm.user.profileImage) {
        vm.user.profileImage = getDefaultProfileImage();
      }
    }

    function getDefaultProfileImage() {
      if (userDataSvc.gender === "male") {
        return "img/userProfileMan.png";
      } else {
        return "img/userProfileWoman.png";
      }
    }

    function editForm(id) {
      vm.write = true;
      $ionicScrollDelegate.anchorScroll(id);
    }

    function updateUser(form) {
      if (form.$valid) {
        if(vm.birthDate) {
          vm.user.birthDateTime = vm.birthDate.getTime();
          vm.user.birthDateString = moment(vm.birthDate).format("DD-MM-YYYY");
        }
        userSvc.updateUser(vm.auth.uid, vm.user).then(function(ref) {
          userSvc.getUserProfile(ref.key()).then(function(user) {
            vm.user = user;
            vm.write = false;
          }, function(err) {
            loggingService.showError("Update user failed", err, "userProfile", false);
          });
        }, function(err) {
          loggingService.showError("Update user failed", err, "userProfile", false);
        });
      }
    }

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

    function choosePhotoInput() {
      $ionicModal.fromTemplateUrl('templates/modals/cameraChoice.html', {
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

      $scope.useNewPhoto = function() {
        var sourceType = Camera.PictureSourceType.CAMERA;
        uploadProfilePicture(sourceType);
        $scope.modal.hide();
      }

      $scope.usePhotoFromLibrary = function() {
        var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        uploadProfilePicture(sourceType);
        $scope.modal.hide();
      }
    };

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
