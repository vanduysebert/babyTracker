(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('messageNewCtrl', messageNewCtrl);

  messageNewCtrl.$inject = ['$ionicHistory','messageSvc', 'userSvc', '$stateParams', 'User', 'Child', 'userDataSvc', 'loggingService', '$scope', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup', '$cordovaMedia'];

  function messageNewCtrl($ionicHistory, messageSvc, userSvc, $stateParams, User, Child, userDataSvc, loggingService, $scope, $ionicScrollDelegate, $ionicLoading, $ionicPopup, $cordovaMedia) {
    var vm = this;
    vm.userToId = $stateParams.userTo;

    var src = "audio/bongo.mp3";
    var bongo = $cordovaMedia.newMedia(src);
    vm.userTo = User;
    vm.userFrom = "";
    vm.count = 0;
    vm.checkAvatar = checkAvatar;
    vm.child = Child;
    vm.setOlderDate = setOlderDate;
    vm.setMessagesAsRead = setMessagesAsRead;
    vm.deleteMessage = deleteMessage;
    $scope.newMessage = "";
    vm.sendMessage = sendMessage;
    vm.oneDay = 86400000 / 2;
    vm.timeShown = new Date().getTime();
    vm.messages = messageSvc.getDialogs(User.$id, userDataSvc.uid, vm.timeShown);
    vm.isSending = false;
    activate();

    vm.messages.$watch(function(e) {
      console.log(e);
      if (e.event == "child_added") {
        console.log("test");
        setMessagesAsRead();
      }
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      // Code you want executed every time view is opened
      console.log("verlaten");
      $ionicHistory.clearCache();
    })


    function activate() {
      userSvc.getUserProfile(userDataSvc.uid).then(function(usr) {
        vm.userFrom = usr;
      });
      messageSvc.getUserLastMessage(userDataSvc.uid, User.$id).then(function(mess) {
        console.log(mess);
        if(mess.length > 0) {
          vm.timeShown = mess[0].dateCreated - vm.oneDay;
          vm.messages = messageSvc.getDialogs(User.$id, userDataSvc.uid, vm.timeShown);
        }

        $ionicScrollDelegate.scrollBottom(true);
      })
      setMessagesAsRead();
    }

    function sendMessage() {
      vm.isSending = true;
      var mess = $scope.newMessage;
      messageSvc.addMessage(userDataSvc.uid, User.$id, Child.$id, mess).then(function(res) {
        $scope.newMessage = "";
        bongo.play();
        vm.isSending = false;
        $ionicScrollDelegate.scrollBottom(true);
      }, function(err) {
        vm.isSending = false;
      });
    }

    function setOlderDate() {
      vm.timeShown -= vm.oneDay;
      var mesA = messageSvc.getDialogs(User.$id, userDataSvc.uid, vm.timeShown);
      mesA.$loaded().then(function(m) {
        console.log(vm.count);
        if (vm.messages.length === m.length && vm.count < 4) {
          vm.count++;
          setOlderDate();
          $scope.$broadcast('scroll.refreshComplete');
        } else if (vm.messages.length === m.length && vm.count > 3) {

          vm.messages = messageSvc.getAllDialogs(User.$id, userDataSvc.uid);
          vm.count = 0;
          $scope.$broadcast('scroll.refreshComplete');
        } else {
          vm.messages = messageSvc.getDialogs(User.$id, userDataSvc.uid, vm.timeShown);
          vm.count = 0;
          $scope.$broadcast('scroll.refreshComplete');
        }
      })

    }

    function checkAvatar(mes) {
      if ((!mes.sent && vm.userTo.profileImage != "") || (mes.sent && vm.userFrom.profileImage != "")) {
        return true;
      } else {
        return false;
      }
    }

    function setMessagesAsRead() {
      messageSvc.markMessageAsRead(userDataSvc.uid, User.$id);
    }

    function deleteMessage(mes, index) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Bericht verwijderen?',
        template: 'Ben je zeker dat je dit bericht wilt verwijderen?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          $ionicLoading.show({
            template: '<ion-spinner icon="ripple"></ion-spinner>'
          });
          messageSvc.deleteMessage(userDataSvc.uid, User.$id, mes).then(function(res) {
            vm.showDelete = false;
            $ionicLoading.hide();
          }, function(err) {

          });
        }
      });
    }
  }
})();
