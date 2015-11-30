(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('searchCtrl', searchCtrl);

    searchCtrl.$inject = ['$scope'];

    function searchCtrl($scope) {
        var vm = this;
        activate();

        function activate() {

        }
    }
})();
