(function() {
    'use strict';

    angular
        .module('babyTracker')
        .filter('searchByName', searchByName);

    function searchByName() {
        return function (query, collection) {
          var results = query ? collection.filter(createFilterFor(query)) : collection;
          return results;
        }

        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filerFn(entity) {
            var name = angular.lowercase(entity.name);
            return (name.indexOf(lowercaseQuery) >= 0);
          };
        }
    }
})();
