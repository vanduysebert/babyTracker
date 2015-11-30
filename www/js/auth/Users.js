(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('Users', Users );

    Users.$inject = ['$firebaseArray', 'Ref'];

    function Users ($firebaseArray, Ref) {
        return $firebaseArray(Ref.child('users'));
    }
})();
