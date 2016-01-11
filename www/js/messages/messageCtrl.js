(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('messageCtrl', messageCtrl);

  messageCtrl.$inject = ['messageSvc', 'userSvc', 'userDataSvc', 'loggingService', '$scope'];

  function messageCtrl(messageSvc, userSvc, userDataSvc, loggingService, $scope) {
    var vm = this;

    activate();
    vm.allMessagesArr = messageSvc.bindAllMessages(userDataSvc.uid);
    vm.allMessages = [];
    vm.removeGroup = removeGroup;
    
    vm.allMessagesArr.$watch(function(e) {
      if (e.event == "child_added") {
        messageSvc.getUserLastMessage(userDataSvc.uid, e.key).then(function(res) {
          userSvc.getUserInfo(e.key).then(function(u) {
            var m = res[0];
            m.groupId = e.key;
            m.profileImage = u.profileImage;
            m.photoInDatabase = u.photoInDatabase;
            m.name = u.name;
            console.log(m);
            vm.allMessages.push(m);
          })
        });
      }
    });

    function activate() {
      $scope.userBadges.messages = 0;
    }

    function reloadMessageGroups() {
      messageSvc.getAllMessageGroups(userDataSvc.uid).then(function(m) {
        vm.allMessages = m;
        console.log(m);
      })
    }

    function removeGroup(groupId) {
      messageSvc.deleteMessageGroup(groupId, userDataSvc.uid).then(function(res) {
        if (res) {
          loggingService.showSuccess("Gesprek verwijderd", "Dialog removed", "messageCtrl", false);
        }
      }, function(err) {

      });
    }
  }
})();
