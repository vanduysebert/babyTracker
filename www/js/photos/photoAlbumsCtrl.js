(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('albumsCtrl', albumsCtrl);

  albumsCtrl.$inject = ['photoSvc', 'Child', '$ionicLoading'];

  function albumsCtrl(photoSvc, Child, $ionicLoading) {
    var vm = this;
    vm.photoAlbums = [];
    var i = 0;


    activate();

    function activate() {
      $ionicLoading.show({
            template: '<ion-spinner icon="ripple"></ion-spinner>'
          });
      photoSvc.getAlbums(Child.$id).then(function(res) {
        vm.photoAlbums = res;
        $ionicLoading.hide();
      }, function(err) {
        $ionicLoading.hide();

      })
    }
  }
})();
