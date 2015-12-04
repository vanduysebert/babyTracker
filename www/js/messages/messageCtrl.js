(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('messageCtrl', messageCtrl);

    messageCtrl.$inject = ['messageSvc'];

    function messageCtrl(messageSvc) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
