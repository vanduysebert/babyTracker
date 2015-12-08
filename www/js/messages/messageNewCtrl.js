(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('messageNewCtrl', messageNewCtrl);

    messageNewCtrl.$inject = ['messageSvc', 'userSvc', '$stateParams', 'User', 'Child', 'userDataSvc', 'loggingService'];

    function messageNewCtrl(messageSvc, userSvc, $stateParams, User, Child, userDataSvc, loggingService) {
        var vm = this;
        vm.userToId = $stateParams.userTo;
        vm.userTo = User;
        vm.userFrom = ""
        vm.checkAvatar = checkAvatar;
        vm.child = Child;
        vm.setMessagesAsRead = setMessagesAsRead;
        vm.deleteMessage = deleteMessage;
        vm.message = "";
        vm.sendMessage = sendMessage;
        vm.messages = messageSvc.getDialogs(User.$id, userDataSvc.uid, Child.$id);
        activate();

        function activate() {
            userSvc.getUserProfile(userDataSvc.uid).then(function(usr) {
                vm.userFrom = usr;
            });
            setMessagesAsRead();
        }

        function sendMessage() {
            messageSvc.addMessage(userDataSvc.uid, User.$id, Child.$id, vm.message).then(function(res) {
                vm.message = "";
            })
        }

        function checkAvatar(mes) {
            if((!mes.sent && vm.userTo.profileImage != "") || (mes.sent && vm.userFrom.profileImage != "")) {
                return true;
            } else {
                return false;
            }
        }

        function setMessagesAsRead() {
            messageSvc.markMessageAsRead(userDataSvc.uid, User.$id, Child.$id);
        }

        function deleteMessage(mes, index) {
            messageSvc.deleteMessage(userDataSvc.uid, User.$id, Child.$id, mes).then(function(res) {
                vm.showDelete =false;
            })
        }
    }
})();
