(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('searchUserCtrl', searchUserCtrl);

    searchUserCtrl.$inject = ['$scope', '$ionicHistory'];

    function searchUserCtrl($scope, $ionicHistory) {
        var vm = this;
        vm.findUser = findUser;
        vm.searchField = '';
        vm.goBack = goBack;
        activate();

        function activate() {

        }

        function findUser() {

        }

        function goBack() {
        
            $ionicHistory.goBack();
        }
    }
})();
