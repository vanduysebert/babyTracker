(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('actionCtrl', actionCtrl);

    actionCtrl.$inject = ['actionSvc'];

    function actionCtrl(actionSvc) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
