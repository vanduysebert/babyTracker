(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('appCtrl', appCtrl);

  appCtrl.$inject = ['$ionicHistory', '$scope', 'userDataSvc', '$state', 'Auth', 'messageSvc', 'userSvc', 'userFollowerSvc', '$cordovaMedia'];

  function appCtrl($ionicHistory, $scope, userDataSvc, $state, Auth, messageSvc, userSvc, userFollowerSvc, $cordovaMedia) {
    var vm = this;
    vm.loggedInUser = userDataSvc;
    vm.logout = logout;
    var src = "audio/dingaling.mp3";
    var bass = $cordovaMedia.newMedia(src);
    vm.userProfile = userProfile;
    $scope.userBadges = {
      messages: 0,
      requests: 0
    }
    vm.defaultImage = "img/logoSmallBT.png";
    activate();

    vm.messagesUser = messageSvc.bindAllMessages(userDataSvc.uid);
    vm.requestsReceived = userFollowerSvc.bindRequests(userDataSvc.uid);

    vm.requestsReceived.$watch(function(e) {
      $scope.userBadges.requests = vm.requestsReceived.length;
    });

    vm.messagesUser.$watch(function(e) {
      console.log(e);
      if (e.event == "child_added" || e.event == "child_changed") {
        bass.play();
        messageSvc.getAllUnreadMessages(userDataSvc.uid, e.key).then(function(count) {
          $scope.userBadges.messages = count.length;
        });
      }

    });



    function activate() {

    }

    function logout() {
      $ionicHistory.clearCache().then(function(res) {
        $ionicHistory.clearHistory();
        Auth.$unauth();
        $state.go('login');
      }, function(err) {
        Auth.$unauth();
        $state.go('login');
      });
    }

    function userProfile() {
      $state.go("app.userProfile");
    }
  }
})();
