(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('childProfileCtrl', childProfileCtrl);

  childProfileCtrl.$inject = ['$state', '$scope', 'Child', 'userDataSvc', 'childSvc', 'childFollowerSvc', '$ionicSlideBoxDelegate'];

  function childProfileCtrl($state, $scope, Child, userDataSvc, childSvc, childFollowerSvc, $ionicSlideBoxDelegate) {
    var vm = this;
    vm.child = Child;
    vm.checkAdmin = checkAdmin;
    vm.updateChild = updateChild;
    vm.birthDate = "";
    vm.getSlideIndex = getSlideIndex;
    vm.write = false;
    vm.goToSlide = goToSlide;
    vm.goToEmergency = goToEmergency;
    vm.hasFollower = false;
    vm.choosePhotoInput = choosePhotoInput;
    activate();

    function activate() {
      childFollowerSvc.hasFollower(userDataSvc.uid, vm.child).then(function(check) {
        vm.hasFollower = check;
      }, function(err){
        loggingService.showError("Checking follower failed", err, "childProfile", false);
      });
      if (vm.child.birthDateTime) {
        vm.birthDate = new Date(vm.child.birthDateTime);
      }
      console.log(Child);
    }

    function checkAdmin() {
      if (userDataSvc.uid === Child.administrator) {
        return true;
      } else {
        return false;
      }
    }
    function checkFollower() {
      return vm.hasFollower;
    }

    function updateChild(form) {
      if (form.$valid) {
        if (vm.birthDate) {
          vm.child.birthDateTime = vm.birthDate.getTime();
          vm.child.birthDateString = moment(vm.birthDate).format("DD-MM-YYYY");
        }
        childSvc.updateChild(vm.child.$id, vm.child).then(function(ref) {
          vm.write = false;
        }, function(err) {
          vm.write = false;
          loggingService.showError("Aanpassing mislukt.", "Edit child failed" + err, "updateUserProfile", true);
        });
      } else {
        vm.write = false;
        loggingService.showError("Ongeldig formulier", "Invalid form", "updateUserProfile", true);
      }
    }

    function choosePhotoInput(form) {

    }

    function goToSlide(index) {
      $ionicSlideBoxDelegate.slide(index);
    }

    function getSlideIndex() {
      return $ionicSlideBoxDelegate.currentIndex();
    }
    function goToEmergency() {
      $state.go('child.emergencyNumbers');
    }
  }
})();
