(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('messageNewCtrl', messageNewCtrl);

    messageNewCtrl.$inject = ['messageSvc'];

    function messageNewCtrl(messageSvc) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
