(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('messageCtrl', messageCtrl);

    messageCtrl.$inject = ['messageSvc', 'userSvc', 'userDataSvc', 'loggingService'];

    function messageCtrl(messageSvc, userSvc, userDataSvc, loggingService) {
        var vm = this;

        activate();
        vm.allMessagesArr = messageSvc.bindAllMessages(userDataSvc.uid);
        vm.allMessages = [];
        vm.removeGroup = removeGroup;

        vm.allMessagesArr.$watch(function(e) {
            reloadMessageGroups();
        })

        function activate() {
            reloadMessageGroups();

        }

        function reloadMessageGroups() {
            messageSvc.getAllMessageGroups(userDataSvc.uid).then(function(m){
                vm.allMessages = m;
                console.log(m);
            })
        }

        function removeGroup(groupId) {
            messageSvc.deleteMessageGroup(groupId, userDataSvc.uid).then(function(res){
                if (res) {
                    loggingService.showSuccess("Gesprek verwijderd", "Dialog removed", "messageCtrl", false);
                }
            }, function(err) {

            });
        }
    }
})();
