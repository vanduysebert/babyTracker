(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('Auth', Auth);

  Auth.$inject = ['$firebaseAuth', 'config'];

  function Auth($firebaseAuth, config) {
    var usersRef = new Firebase(config.dbUrls.auth);
    return $firebaseAuth(usersRef);
  }
})();
