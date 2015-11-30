(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('startCtrl', startCtrl);

    startCtrl.$inject = ['$scope', '$state', 'userSvc', 'userDataSvc', 'loggingService'];

    function startCtrl($scope, $state, userSvc, userDataSvc, loggingService) {
        var vm = this;
        vm.followsChildren = true;
        vm.search = '';
        vm.goSearch = goSearch;
        vm.clearSearch = clearSearch;
        activate();

        function activate() {
            userSvc.hasChildren(userDataSvc.uid).then(function(childrenArr) {
                if(childrenArr.length == 0) {
                    vm.followsChildren = false;
                }
            }, function(err) {
                loggingService.showError("Could not get children", err, "start", false);
            })
        }

        function goSearch() {
            $state.go('app.search');
        }

        function clearSearch() {
            vm.search = '';
        }
    }
})();
