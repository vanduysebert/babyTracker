(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('roleSvc', roleSvc);

    roleSvc.$inject = ['$q', 'config', '$firebaseArray', '$firebaseObject'];

    function roleSvc($q, config, $firebaseArray, $firebaseObject) {
        var roleRef = new Firebase(config.dbUrls.base + "roles");
        var roles = $firebaseArray(roleRef);
        var service = {
            getAllRoles: getAllRoles,
            getRole: getRole,
            bindRole: bindRole
        };

        return service;

        function getAllRoles() {
            return roles.$loaded();
        }

        function getRole(role) {
            return $firebaseObject(roleRef.child(role)).$loaded();
        }

        function bindRole(role) {
            return $firebaseObject(roleRef.child(role));
        }
    }
})();
