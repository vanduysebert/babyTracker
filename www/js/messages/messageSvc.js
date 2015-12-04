(function() {
    'use strict';

    angular
        .module('babyTracker')
        .factory('messageSvc', messageSvc);

    messageSvc.$inject = ['$firebaseArray', '$firebaseObject', 'config'];

    function messageSvc($firebaseArray, $firebaseObject, config) {
        var messRef = new Firebase(config.dbUrls.base + "users");

        var service = {
            bindAllMessages: bindAllMessages,
            getAllMessages: getAllMessages,
            bindAllUnreadMessages: bindAllUnreadMessages,
            getAllUnreadMessages: getAllUnreadMessages,
            bindReadMessages: bindReadMessages,
            getReadMessages: getReadMessages,
            addMessage: addMessage,
            deleteUnreadMessage: deleteUnreadMessage,
            deleteReadMessage: deleteReadMessage,
            markMessageAsRead: markMessageAsRead
        };

        return service;

        function bindAllMessages(uid) {
            return $firebaseArray(messRef.child(uid).child("messages"));
        }

        function getAllMessages(uid) {
            return $firebaseArray(messRef.child(uid).child("messages")).$loaded();
        }

        function bindAllUnreadMessages(uid) {
            return $firebaseArray(messRef.child(uid).child("messages").child("unread"));
        }

        //TODO: Order by childId + include childId
        function getAllUnreadMessages(uid) {
            return $firebaseArray(messRef.child(uid).child("messages").child("unread")).$loaded();
        }

        function bindReadMessages(uid) {
            return $firebaseArray(messRef.child(uid).child("messages").child("read"));
        }

        function getReadMessages(uid) {
            return $firebaseArray(messRef.child(uid).child("messages").child("read")).$loaded();
        }

        function addMessage(uid, mess) {
            var m = $firebaseArray(messRef.child(uid).child("messages").child("unread"));
            m.$add(mess);
        }

        function deleteUnreadMessage(uid, mes) {
            var list = $firebaseArray(messRef.child(uid).child("messages").child("unread"));
            return list.$remove(mes);
        }

        function deleteReadMessage(uid, mes) {
            var list = $firebaseArray(messRef.child(uid).child("messages").child("read"));
            return list.$remove(mes);
        }

        function markMessageAsRead(uid, mes) {
            var list = $firebaseArray(messRef.child(uid).child("messages").child("unread"));
            list.$remove(mes).then(function(ref) {
                var m = $firebaseArray(messRef.child(uid).child("messages").child("read"));
                m.$add(mes);
            });
        }

    }
})();
