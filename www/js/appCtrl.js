(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('appCtrl', appCtrl);

    appCtrl.$inject = ['$scope', 'userDataSvc', '$state', 'Auth'];

    function appCtrl($scope, userDataSvc, $state, Auth) {
        var vm = this;
        vm.loggedInUser = userDataSvc;
        vm.logout = logout;
        vm.userProfile = userProfile;
        vm.defaultImage = "img/logoSmallBT.png";
        activate();

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
