(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('entertainmentCtrl', entertainmentCtrl);

  entertainmentCtrl.$inject = ['postSvc', '$ionicActionSheet', "$cordovaCamera", "loggingService", 'userDataSvc', 'Child', '$state', '$ionicLoading'];

  function entertainmentCtrl(postSvc, $ionicActionSheet, $cordovaCamera, loggingService, userDataSvc, Child, $state, $ionicLoading) {
    var vm = this;

    vm.addPhoto = addPhoto;
    vm.addActivity = addActivity;
    activate();

    function activate() {
      initData();
    }

    function initData() {
      vm.title = "";
      vm.subject = "";
      vm.photoUrl = "";
    }

    function addPhoto() {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'Maak foto'
        }, {
          text: 'Kies foto'
        }],
        titleText: 'Foto toevoegen',
        cancelText: 'Annuleer',
        cancel: function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          if (index == 0) {
            var sourceType = Camera.PictureSourceType.CAMERA;
            setPhoto(sourceType);
          } else if (index == 1) {
            var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            setPhoto(sourceType);
          }
          return true;
        }
      });
    }

    function setPhoto(sourceType) {
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
        vm.photoUrl = imageData;
      }, function(error) {
        loggingService.showError("Upload picture failed", error, "upload picture", false);
      });
    }

    function addActivity(form) {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
      if(form.$valid) {
        postSvc.postActivity(userDataSvc.uid, Child.$id, vm.title, vm.subject, vm.photoUrl).then(function(res) {
          $state.go('child.posts');
          initData();
          $ionicLoading.hide();
        })
      } else {
        loggingService.showError("Ongeldige ingave.", "Invalid form", "entertainmentCtrl", false);
        $ionicLoading.hide();
      }
    }
  }
})();
