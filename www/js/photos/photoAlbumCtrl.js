(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('albumCtrl', photoAlbumCtr);

  photoAlbumCtr.$inject = ['userDataSvc', 'config', '$ionicActionSheet', '$cordovaSocialSharing', 'photoSvc', '$stateParams', 'Child', '$ionicModal', '$scope'];

  function photoAlbumCtr(userDataSvc, config, $ionicActionSheet, $cordovaSocialSharing, photoSvc, $stateParams, Child, $ionicModal, $scope) {
    var vm = this;
    vm.albumTitle = "";
    vm.photos = photoSvc.getAlbumPhotos(Child.$id, $stateParams.albumId);
    activate();
    vm.showSlider = showSlider;
    vm.indexShow = 0;

    function activate() {
      photoSvc.getAlbumTitle(Child.$id, $stateParams.albumId).then(function(res) {
        vm.albumTitle = res.$value;
      });
    }

    function showSlider(index) {
      $ionicModal.fromTemplateUrl('templates/modals/pictureSlider.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.reaction = "";
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
      $scope.socialMediaShare = function(index) {
        console.log("test");
        var hideSheet = $ionicActionSheet.show({
          buttons: [{
            text: 'Facebook'
          }, {
            text: 'Twitter'
          }, {
            text: 'WhatsApp'
          }],
          titleText: 'Deel deze post',
          cancelText: 'Annuleer',
          cancel: function() {
            hideSheet();
          },
          buttonClicked: function(index) {
            var p = vm.photos[$scope.idx].src;
            var link = config.appLink;
            if (index == 0) {
              shareViaFacebook(vm.albumTitle, p, link);
            } else if (index == 1) {
              shareViaTwitter(vm.albumTitle + " #babytracker", p, link);
            } else if (index == 2) {
              shareViaWhatsApp(vm.albumTitle, p, link);
            }
          }
        });

      }
      $scope.slideHasChanged = function(index) {
        vm.indexShow = index;
      }

      $scope.addReaction = function(reac) {
        console.log("test");
        if (reac != "") {
          photoSvc.addReactionToPhoto(Child.$id, $stateParams.albumId, $scope.idx, reac, userDataSvc.uid).then(function(res) {
            $scope.reac = "";
            reac = "";
          })
        }
      }

      $scope.photos = vm.photos;
      $scope.idx = index;
    }

    function shareViaFacebook(message, image) {
      $cordovaSocialSharing
        .shareViaFacebook(message, image)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });
    }

    function shareViaTwitter(message, image) {
      $cordovaSocialSharing
        .shareViaTwitter(message, image)
        .then(function(result) {

        }, function(err) {
          // An error occurred. Show a message to the user
        });
    }

    function shareViaWhatsApp(message, image) {
      $cordovaSocialSharing
        .shareViaWhatsApp(message, image)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });
    }
  }
})();
