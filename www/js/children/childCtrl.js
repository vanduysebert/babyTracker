(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('childCtrl', childCtrl);

    childCtrl.$inject = ['$scope', '$ionicSideMenuDelegate', 'Child'];

    function childCtrl($scope, $ionicSideMenuDelegate, Child) {
        var vm = this;
        vm.toggleLeft = toggleLeft;
        vm.child = Child;
        activate();

        function activate() {

        }

        function toggleLeft() {
            $ionicSideMenuDelegate.toggleLeft();
        }
    }
})();
