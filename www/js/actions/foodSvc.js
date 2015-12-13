(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('foodSvc', foodSvc);

    foodSvc.$inject = ['$firebaseArray', 'config'];

    function foodSvc($firebaseArray, config) {
        var foodRef = new Firebase(config.dbUrls.base + "foods");
        var service = {
            getIngredients: getIngredients,
            bindIngredients: bindIngredients
        };

        return service;

        function getIngredients(category, months) {
            return $firebaseArray(foodRef.child(category).child(months)).$loaded();
        }

        function bindIngredients(cat, time) {
            return $firebaseArray(foodRef.child(cat).child(time));
        }
    }
})();
