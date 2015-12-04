(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('messageDetailCtrl', messageDetailCtrl);

    messageDetailCtrl.$inject = ['messageSvc'];

    function messageDetailCtrl(messageSvc) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
