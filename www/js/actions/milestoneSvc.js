(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('milestoneSvc', milestoneSvc);

    milestoneSvc.$inject = ['$q', 'config', '$firebaseArray'];

    function milestoneSvc($q, config, $firebaseArray) {
        var mileRef = new Firebase(config.dbUrls.base + "milestones");

        var service = {
            getAllMilestones6: getAllMilestones6,
            getAllMilestones9: getAllMilestones9,
            getAllMilestones12: getAllMilestones12,
            getAllMilestones18: getAllMilestones18,
            bindAllMilestones6: bindAllMilestones6,
            bindAllMilestones9: bindAllMilestones9,
            bindAllMilestones12: bindAllMilestones12,
            bindAllMilestones18: bindAllMilestones18,

            getSensesMilestones6: getSensesMilestones6,
            getSensesMilestones9: getSensesMilestones9,
            getSensesMilestones12: getSensesMilestones12,
            getSensesMilestones18: getSensesMilestones18,
            bindSensesMilestones6: bindSensesMilestones6,
            bindSensesMilestones9: bindSensesMilestones9,
            bindSensesMilestones12: bindSensesMilestones12,
            bindSensesMilestones18: bindSensesMilestones18,

            getSocialMilestones6: getSocialMilestones6,
            getSocialMilestones9: getSocialMilestones9,
            getSocialMilestones12: getSocialMilestones12,
            getSocialMilestones18: getSocialMilestones18,
            bindSocialMilestones6: bindSocialMilestones6,
            bindSocialMilestones9: bindSocialMilestones9,
            bindSocialMilestones12: bindSocialMilestones12,
            bindSocialMilestones18: bindSocialMilestones18,

            getFoodMilestones6: getFoodMilestones6,
            getFoodMilestones9: getFoodMilestones9,
            getFoodMilestones12: getFoodMilestones12,
            getFoodMilestones18: getFoodMilestones18,
            bindFoodMilestones6: bindFoodMilestones6,
            bindFoodMilestones9: bindFoodMilestones9,
            bindFoodMilestones12: bindFoodMilestones12,
            bindFoodMilestones18: bindFoodMilestones18
        };

        return service;

        function getAllMilestones6() {
            return $firebaseArray(mileRef.child("upTo6Months")).$loaded();
        }

        function getAllMilestones9() {
            return $firebaseArray(mileRef.child("upTo9Months")).$loaded();
        }

        function getAllMilestones12() {
            return $firebaseArray(mileRef.child("upTo12Months")).$loaded();
        }

        function getAllMilestones18() {
            return $firebaseArray(mileRef.child("upTo18Months")).$loaded();
        }

        function bindAllMilestones6() {
            return $firebaseArray(mileRef.child("upTo6Months"));
        }

        function bindAllMilestones9() {
            return $firebaseArray(mileRef.child("upTo9Months"));
        }

        function bindAllMilestones12() {
            return $firebaseArray(mileRef.child("upTo12Months"));
        }

        function bindAllMilestones18() {
            return $firebaseArray(mileRef.child("upTo18Months"));
        }

        function getSensesMilestones6() {
            return $firebaseArray(mileRef.child("upTo6Months").child("Senses")).$loaded();
        }

        function getSensesMilestones9() {
            return $firebaseArray(mileRef.child("upTo9Months").child("Senses")).$loaded();
        }

        function getSensesMilestones12() {
            return $firebaseArray(mileRef.child("upTo12Months").child("Senses")).$loaded();
        }

        function getSensesMilestones18() {
            return $firebaseArray(mileRef.child("upTo18Months").child("Senses")).$loaded();
        }

        function bindSensesMilestones6() {
            return $firebaseArray(mileRef.child("upTo6Months").child("Senses"));
        }

        function bindSensesMilestones9() {
            return $firebaseArray(mileRef.child("upTo9Months").child("Senses"));
        }

        function bindSensesMilestones12() {
            return $firebaseArray(mileRef.child("upTo12Months").child("Senses"));
        }

        function bindSensesMilestones18() {
            return $firebaseArray(mileRef.child("upTo18Months").child("Senses"));
        }

        function getSocialMilestones6() {
            return $firebaseArray(mileRef.child("upTo6Months").child("social")).$loaded();
        }

        function getSocialMilestones9() {
            return $firebaseArray(mileRef.child("upTo9Months").child("social")).$loaded();
        }

        function getSocialMilestones12() {
            return $firebaseArray(mileRef.child("upTo12Months").child("social")).$loaded();
        }

        function getSocialMilestones18() {
            return $firebaseArray(mileRef.child("upTo18Months").child("social")).$loaded();
        }

        function bindSocialMilestones6() {
            return $firebaseArray(mileRef.child("upTo6Months").child("social"));
        }

        function bindSocialMilestones9() {
            return $firebaseArray(mileRef.child("upTo9Months").child("social"));
        }

        function bindSocialMilestones12() {
            return $firebaseArray(mileRef.child("upTo12Months").child("social"));
        }

        function bindSocialMilestones18() {
            return $firebaseArray(mileRef.child("upTo18Months").child("social"));
        }

        function getFoodMilestones6() {
            return $firebaseArray(mileRef.child("upTo6Months").child("food")).$loaded();
        }

        function getFoodMilestones9() {
            return $firebaseArray(mileRef.child("upTo9Months").child("food")).$loaded();
        }

        function getFoodMilestones12() {
            return $firebaseArray(mileRef.child("upTo12Months").child("food")).$loaded();
        }

        function getFoodMilestones18() {
            return $firebaseArray(mileRef.child("upTo18Months").child("food")).$loaded();
        }

        function bindFoodMilestones6() {
            return $firebaseArray(mileRef.child("upTo6Months").child("food"));
        }

        function bindFoodMilestones9() {
            return $firebaseArray(mileRef.child("upTo9Months").child("food"));
        }

        function bindFoodMilestones12() {
            return $firebaseArray(mileRef.child("upTo12Months").child("food"));
        }

        function bindFoodMilestones18() {
            return $firebaseArray(mileRef.child("upTo18Months").child("food"));
        }

    }
})();
