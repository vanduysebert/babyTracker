(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('photoCtrl', photoCtrl);

  photoCtrl.$inject = ['postSvc', '$cordovaImagePicker', '$ionicLoading', '$state', '$q', 'photoSvc', 'Child', 'userDataSvc'];

  function photoCtrl(postSvc, $cordovaImagePicker, $ionicLoading, $state, $q, photoSvc, Child, userDataSvc) {
    var vm = this;
    vm.title = "";
    vm.photo = {
      src: "",
      sub: "",
      thumb: ""
    }
    vm.child = Child;
    vm.photosUrl = [];
    vm.addPhoto = addPhoto;
    vm.addAlbum = addAlbum;
    vm.photoOptions = {
      maximumImagesCount: 10,
      width: 800,
      height: 800,
      quality: 80
    };
    activate();

    function activate() {

    }

    function addPhoto() {
      $cordovaImagePicker.getPictures(vm.photoOptions)
        .then(function(results) {
          vm.photosUrl = results;

        }, function(error) {
          console.log(error);
          // error getting photos
        });
    }

    function addAlbum() {
      if(vm.photosUrl.length > 0) {
        $ionicLoading.show({
              template: '<ion-spinner icon="ripple"></ion-spinner>'
            });
        getBase64Pictures(vm.photosUrl).then(function(photoArr) {
          photoSvc.addAlbum(Child.$id, vm.title, photoArr).then(function(res) {
            postSvc.postAlbum(userDataSvc.uid, Child.$id, vm.title, photoArr.slice(0,3)).then(function(res) {

              $ionicLoading.hide();
              $state.go('child.posts');
            }, function(err) {
              $ionicLoading.hide();

            });
          }, function(err) {
            $ionicLoading.hide();

          });
        }, function(err) {
          $ionicLoading.hide();

        });
      }
    }

    function getBase64Pictures(pictures) {
      var deferred = $q.defer();
      var photoArr = [];
      for (var i = 0; i < pictures.length; i++) {
        var img = pictures[i];
        window.plugins.Base64.encodeFile(img, function(pic64) { // Encode URI to Base64 needed for contacts plugin
          var p = {
            src: pic64
          }
          photoArr.push(p);
          console.log("pictureAdded");
          deferred.resolve(photoArr);
        }, function(err) {
          deferred.reject(err);
        });
      }
      return deferred.promise;
    }



  }
})();
