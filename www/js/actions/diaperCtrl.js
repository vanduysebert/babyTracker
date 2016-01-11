(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('diaperCtrl', diaperCtrl);

  diaperCtrl.$inject = ['postSvc', 'userDataSvc', 'Child', '$state', '$ionicLoading'];

  function diaperCtrl(postSvc, userDataSvc, Child, $state, $ionicLoading) {
    var vm = this;

    vm.addDiaper = addDiaper;
    activate();

    function activate() {
      initData();
    }

    function initData() {
        vm.diaper = "";
        vm.remark = "";
    }

    function addDiaper() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
      var title = Child.firstName + " had een ";
      var mess = vm.remark;
      if (vm.diaper === 'wet') {
        title += "natte luier";
      } else if (vm.diaper === 'dirty') {
        title += "vuile luier";
      } else if (vm.diaper === 'both') {
        title += "natte en vuile luier";
      }
      postSvc.postDiaper(userDataSvc.uid, Child.$id, title, mess).then(function(res) {
        vm.diaper = "";
        vm.remark = "";
        $ionicLoading.hide();
        initData();
        $state.go('child.posts');
      }, function(err) {
          $ionicLoading.hide();
      });
    }
  }
})();
