(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('measurementSvc', measurementSvc);

    measurementSvc.$inject = ['$firebaseObject', '$firebaseArray', 'config'];

    function measurementSvc($firebaseObject, $firebaseArray, config) {
        var childRef = new Firebase(config.dbUrls.base + "children");
        var service = {
            addWeight: addWeight,
            deleteWeight: deleteWeight,
            updateWeight: updateWeight,
            getWeights: getWeights,
            getWeightsByDateSpan: getWeightsByDateSpan,

            addHeight: addHeight,
            deleteHeight: deleteHeight,
            updateHeight: updateHeight,

            addHeadWidth: addHeadWidth,
            deleteHeadWidth: deleteHeadWidth,
            updateHeadWidth: updateHeadWidth
        };

        return service;

        function addWeight(childId, weight, date) {
            var weightObj = {
                dateCreated: date ? date : Firebase.ServerValue.TIMESTAMP,
                weight: weight
            }
            return $firebaseArray(childRef.child(childId).child("measurements").child("weights")).$add(weightObj);
        }

        function deleteWeight (childId, weightId) {
            childRef.child(childId).child("measurements").child("weights").child(weightId).remove();
        }

        function updateWeight(childId, weight) {
            return weight.$save();
        }

        function getWeights(childId) {
            return $firebaseArray(childRef.child(childId).child("measurements").child("weights")).$loaded();
        }

        function getWeightsByDateSpan(childId, dateStart, dateEnd) {
            var ref = childRef.child(childId).child("measurements").child("weights").orderByChild('dateCreated').startAt(dateStart).endAt(dateEnd);
            return $firebaseArray(ref).$loaded();
        }

        function addHeight(childId, height, date) {
            console.log(childId);
            console.log(height);
            console.log(date);
            var heightObj = {
                dateCreated: date ? date :Firebase.ServerValue.TIMESTAMP,
                height: height
            }
            return $firebaseArray(childRef.child(childId).child("measurements").child("heights")).$add(heightObj);
        }

        function deleteHeight (childId, HeightId) {

        }

        function updateHeight(childId, HeightId) {

        }

        function addHeadWidth(childId, headWidth, date) {
            var headWidthObj = {
                dateCreated: date ? date : Firebase.ServerValue.TIMESTAMP,
                headWidth: headWidth
            }
            return $firebaseArray(childRef.child(childId).child("measurements").child("headWidths")).$add(headWidthObj);
        }

        function deleteHeadWidth (childId, HeadWidthId) {

        }

        function updateHeadWidth(childId, HeadWidthId) {

        }

    }
})();
