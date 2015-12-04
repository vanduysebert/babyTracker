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
      bindAllRoles: roles,
      getAllRoles: getAllRoles,
      getRole: getRole,
      bindRole: bindRole,
      getFamilyRoles: getFamilyRoles
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

    function getFamilyRoles() {
      var deferred = $q.defer();
      var r = [];
      roles.$ref().orderByChild('nl').once("value", function(dataSnapshot) {
        if (dataSnapshot.exists()) {
          dataSnapshot.forEach(function(data) {
            var role = data.val();
            if(role.relationship == 'family') {
              role.id = data.key();
              r.push(role);
              deferred.resolve(r);
            }
          })

        } else {
          deferred.reject("Not found");
        }

      });
      return deferred.promise;

    }
  }
})();
