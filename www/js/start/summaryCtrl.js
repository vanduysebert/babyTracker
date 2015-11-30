(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('summaryCtrl', summaryCtrl);

    summaryCtrl.$inject = ['Children', 'userDataSvc'];

    function summaryCtrl(Children, userDataSvc) {
        var vm = this;
        vm.children = Children;
        vm.user = userDataSvc;
        activate();

        function activate() {
            console.log(Children);
        }


    }
})();
