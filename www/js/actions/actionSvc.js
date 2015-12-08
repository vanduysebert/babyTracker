(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('actionSvc', actionSvc);

    actionSvc.$inject = ['$q'];

    function actionSvc($q) {
        var service = {
            postMilestone: postMilestone
        };

        return service;

        function postMilestone(uid, mess, childId) {

        }
    }
})();
