(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('Ref', Ref);

    Ref.$inject = ['config'];

    function Ref(config) {
        return new Firebase(config.dbUrls.base);
    }
})();
