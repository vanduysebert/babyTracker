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
      childRef: ref,
      userFamilyMembersRef: userFamilyMembersRef,
      all: children,
      getChild: getChild,
      addChild: addChild,
      updateChild: updateChild,
      addEmergencyNumber: addEmergencyNumber,
      getEmergencyNumbers: getEmergencyNumbers,
      bindEmergencyNumbers: bindEmergencyNumbers,
      removeEmergency: removeEmergency,
      addFamilyMember: addFamilyMember,
      getStaticFamilyMembers: getStaticFamilyMembers,
      getUserFamilyMembers: getUserFamilyMembers,
      bindFamilyMembers: bindFamilyMembers,
      getFamilyMembers: getFamilyMembers,
      removeUserFamilyMember: removeUserFamilyMember,
      removeStaticFamilyMember: removeStaticFamilyMember,
      bindPets: bindPets,
      addPet: addPet,
      removePet: removePet,
      bindAllergics: bindAllergics,
      addAllergic: addAllergic,
      removeAllergic: removeAllergic,
      bindHealthIssues: bindHealthIssues,
      addHealthIssue: addHealthIssue,
      removeHealthIssue: removeHealthIssue,
      bindDrugs: bindDrugs,
      addDrug: addDrug,
      removeDrug: removeDrug
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

    function addFamilyMember(childId, member) {
      var list = "";
      if(member.follower) {
        list = $firebaseArray(ref.child(childId).child("familyMembers").child("followers"));
      } else {
        list = $firebaseArray(ref.child(childId).child("familyMembers").child("staticMembers"));
      }
      return list.$add(member);
    }

    function getStaticFamilyMembers(childId) {
      return $firebaseArray(ref.child(childId).child("familyMembers").child("staticMembers")).$loaded();
    }

    function bindFamilyMembers(childId) {
      return $firebaseArray(ref.child(childId).child("familyMembers"));
    }

    function getFamilyMembers(childId) {
      return $firebaseArray(ref.child(childId).child("familyMembers")).$loaded();

    }

    function getUserFamilyMembers(childId) {
      return $firebaseArray(ref.child(childId).child("familyMembers").child("followers")).$loaded();
    }

    function removeUserFamilyMember (childId, index) {
      var deferred = $q.defer()
      var list = $firebaseArray(ref.child(childId).child("familyMembers").child("followers"));
      list.$loaded().then(function(li) {
        var item = li[index];
        deferred.resolve(li.$remove(item));
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function removeStaticFamilyMember (childId, index) {
      var deferred = $q.defer()
      var list = $firebaseArray(ref.child(childId).child("familyMembers").child("staticMembers"));
      list.$loaded().then(function(li) {
        var item = li[index];
        deferred.resolve(li.$remove(item));
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function userFamilyMembersRef(childId) {
      return ref.child(childId).child("familyMembers").child("followers");
    }

    function bindPets(childId) {
      return $firebaseArray(ref.child(childId).child("pets"));
    }

    function addPet(childId, pet) {
      return $firebaseArray(ref.child(childId).child("pets")).$add(pet);
    }

    function removePet(childId, pet) {
      ref.child(childId).child("pets").child(pet.$id).remove();
    }

    function bindAllergics(childId) {
      return $firebaseArray(ref.child(childId).child("health").child("allergics"));
    }

    function addAllergic(childId, all) {
      return $firebaseArray(ref.child(childId).child("health").child("allergics")).$add(all);
    }

    function removeAllergic(childId, allId) {
      ref.child(childId).child("health").child("allergics").child(allId).remove();

    }

    function bindHealthIssues(childId) {
      return $firebaseArray(ref.child(childId).child("health").child("issues"));
    }

    function addHealthIssue(childId, all) {
      return $firebaseArray(ref.child(childId).child("health").child("issues")).$add(all);
    }

    function removeHealthIssue(childId, allId) {
      ref.child(childId).child("health").child("issues").child(allId).remove();

    }

    function bindDrugs(childId) {
      return $firebaseArray(ref.child(childId).child("health").child("drugs"));
    }

    function addDrug(childId, all) {
      return $firebaseArray(ref.child(childId).child("health").child("drugs")).$add(all);
    }

    function removeDrug(childId, allId) {
      ref.child(childId).child("health").child("drugs").child(allId).remove();

    }
  }
})();
