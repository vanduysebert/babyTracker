(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('childCtrl', childCtrl);

  childCtrl.$inject = ['$scope', '$ionicSideMenuDelegate', 'Child', 'childFollowerSvc', 'userDataSvc', 'childSvc'];

  function childCtrl($scope, $ionicSideMenuDelegate, Child, childFollowerSvc, userDataSvc, childSvc) {
    var vm = this;
    vm.toggleLeft = toggleLeft;
    vm.child = Child;
    vm.unseenRequestsRef = null;
    $scope.checkAdmin = checkAdmin;
    $scope.badges = {
      followRequests: 0
    }

    vm.requestsReceived = childFollowerSvc.getChildRequestedUsers(Child.$id);

    vm.requestsReceived.$watch(function(e) {
      if(userDataSvc.uid === Child.administrator) {
        $scope.badges.followRequests = vm.requestsReceived.length;
      } else {
        $scope.badges.followRequests = 0;
      }
    });

    activate();

    function activate() {

    }

    function toggleLeft() {
      $ionicSideMenuDelegate.toggleLeft();
    }

    function checkAdmin() {
      if (userDataSvc.uid === Child.administrator) {
        return true;
      } else {
        return false;
      }
    }
  }
})();
