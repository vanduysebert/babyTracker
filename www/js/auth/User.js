(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('User', User);

  User.$inject = ['Ref', '$firebaseObject'];

  function User(Ref, $firebaseObject) {
    return function(uid) {
      return $firebaseObject(Ref.child('users').child(uid));
    }
  }
})();
