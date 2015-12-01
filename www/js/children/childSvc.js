(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('childSvc', childSvc);

  childSvc.$inject = ['$q', 'config', '$firebaseObject', '$firebaseArray'];

  function childSvc($q, config, $firebaseObject, $firebaseArray) {
    var ref = new Firebase(config.dbUrls.base + "children");
    var children = $firebaseArray(ref);
    var factory = {
      all: children,
      getChild: getChild,
      addChild: addChild,
      updateChild: updateChild,
      addEmergencyNumber: addEmergencyNumber,
      getEmergencyNumbers: getEmergencyNumbers,
      bindEmergencyNumbers: bindEmergencyNumbers,
      removeEmergency: removeEmergency
    };

    return factory;

    function getChild(childID) {
      return $firebaseObject(ref.child(childID)).$loaded();
    }

    function getFollowers(childID) {
      return $firebaseArray(ref.child(childID).child('followers'));
    }

    function addChild(child) {
      return children.$add(child);
    }

    function updateChild(childID, child) {
      return child.$save();
    }

    function addEmergencyNumber(childId, contact) {
      var list = $firebaseArray(ref.child(childId).child("emergencyNumbers"));
      return list.$add(contact);
    }

    function getEmergencyNumbers(childId) {
      return $firebaseArray(ref.child(childId).child("emergencyNumbers")).$loaded();
    }

    function bindEmergencyNumbers(childId) {
      return $firebaseArray(ref.child(childId).child("emergencyNumbers"));

    }

    function removeEmergency(childId, index) {
      var deferred = $q.defer()
      var list = $firebaseArray(ref.child(childId).child("emergencyNumbers"));
      list.$loaded().then(function(li) {
        var item = li[index];
        deferred.resolve(li.$remove(item));
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;

    }

  }
})();
