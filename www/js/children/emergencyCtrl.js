(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('emergencyCtrl', emergencyCtrl);

    emergencyCtrl.$inject = ['Child'];

    function emergencyCtrl(Child) {
        var vm = this;

        activate();

        function activate() {
          
        }

    }
})();
