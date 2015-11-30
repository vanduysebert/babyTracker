(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('registerPhotoCtrl', registerPhotoCtrl);

  registerPhotoCtrl.$inject = ['$scope', 'Child', '$state', '$ionicHistory', '$cordovaCamera', '$ionicModal', 'childSvc', 'loggingService'];

  function registerPhotoCtrl($scope, Child, $state, $ionicHistory, $cordovaCamera, $ionicModal, childSvc, loggingService) {
    var vm = this;
    vm.child = Child;
    vm.genderChild = "";
    vm.newPhoto = false;
    vm.choosePhotoInput = choosePhotoInput;
    activate();

    function activate() {
      $ionicHistory.clearHistory();
      console.log(Child);
      if (vm.child.gender === "male") {
        vm.genderChild = "zijn";
      } else {
        vm.genderChild = "haar";
      }
    }

    function goToProfile() {
      $state.go("child.profile", {
        childId: vm.child.$id
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
        vm.child.profileImage = imageData;
        vm.child.photoInDatabase = true;
        childSvc.updateChild(vm.child.$id, vm.child).then(function(ref) {
          loggingService.showSuccess("Picture saved to database", ref.key(), vm.mod, false);
        }, function(err) {
          loggingService.showError("Error saving picture", error, "savePicture", false);
          vm.errorMessage = "Foto uploaden mislukt. Probeer het opnieuw of contacteer de beheerder.";
        });
        vm.newPhoto = true;
      }, function(error) {
        loggingService.showError("Upload picture failed", error, "upload picture", false);
      });
    }


  }
})();
