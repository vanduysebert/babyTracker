(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('Auth', Auth);

  Auth.$inject = ['$firebaseAuth', 'config'];

  /**
   * Get the current logged on user
   */
  function Auth($firebaseAuth, config) {
    var usersRef = new Firebase(config.dbUrls.auth);
    return $firebaseAuth(usersRef);
  }
})();
