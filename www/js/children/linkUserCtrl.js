(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('linkUserCtrl', linkUserCtrl);

    linkUserCtrl.$inject = ['$scope', 'Child', 'childSvc', 'childFollowerSvc'];

    function linkUserCtrl($scope, Child, childSvc, childFollowerSvc) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
