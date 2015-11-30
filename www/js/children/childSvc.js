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
      updateChild: updateChild
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

  }
})();
