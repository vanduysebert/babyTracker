(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('appCtrl', appCtrl);

  appCtrl.$inject = ['$scope', 'userDataSvc', '$state', 'Auth', 'messageSvc', 'userSvc', 'userFollowerSvc'];

  function appCtrl($scope, userDataSvc, $state, Auth, messageSvc, userSvc, userFollowerSvc) {
    var vm = this;
    vm.loggedInUser = userDataSvc;
    vm.logout = logout;
    vm.userProfile = userProfile;
    $scope.userBadges = {
      messages: 0,
      requests: 0
    }
    vm.defaultImage = "img/logoSmallBT.png";
    activate();

    vm.requestsReceived = userFollowerSvc.bindRequests(userDataSvc.uid);

    vm.requestsReceived.$watch(function(e) {
      $scope.userBadges.requests = vm.requestsReceived.length;
    });



    function activate() {

    }

    function logout() {
      Auth.$unauth();
      $state.go('login');
    }

    function userProfile() {
      $state.go("app.userProfile");
    }
  }
})();
