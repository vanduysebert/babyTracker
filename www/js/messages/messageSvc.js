(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('messageSvc', messageSvc);

  messageSvc.$inject = ['$firebaseArray', '$firebaseObject', 'config', '$q', 'userSvc', 'childSvc'];

  function messageSvc($firebaseArray, $firebaseObject, config, $q, userSvc, childSvc) {
    var messRef = new Firebase(config.dbUrls.base + "users");

    var service = {
      bindAllMessages: bindAllMessages,
      getAllMessages: getAllMessages,
      /*getAllMessageGroups: getAllMessageGroups,*/
      getDialogs: getDialogs,
      getAllDialogs: getAllDialogs,
      bindAllUnreadMessages: bindAllUnreadMessages,
      getAllUnreadMessages: getAllUnreadMessages,
      bindReadMessages: bindReadMessages,
      getReadMessages: getReadMessages,
      addMessage: addMessage,
      deleteUnreadMessage: deleteUnreadMessage,
      deleteMessage: deleteMessage,
      deleteMessageGroup: deleteMessageGroup,
      markMessageAsRead: markMessageAsRead,
      getUserLastMessage: getUserLastMessage,
      getLastMessageTime: getLastMessageTime
    };

    return service;

    function bindAllMessages(uid) {
      return $firebaseArray(messRef.child(uid).child("messages"));
    }

    function getAllMessages(uid) {
      return $firebaseArray(messRef.child(uid).child("messages")).$loaded();
    }

    function getDialogs(groupId, uid, date) {
      var ref = messRef.child(uid).child("messages").child(groupId).orderByChild('dateCreated').startAt(date);
      return $firebaseArray(ref);
    }

    function getAllDialogs(groupId, uid) {
      return $firebaseArray(messRef.child(uid).child("messages").child(groupId));
    }


    function bindAllUnreadMessages(uid) {
      return $firebaseArray(messRef.child(uid).child("messages").child("unread"));
    }

    //TODO: Order by childId + include childId
    function getAllUnreadMessages(uid, groupId) {
      var arr = [];
      var deferred = $q.defer();
      var dialogs = $firebaseArray(messRef.child(uid).child("messages").child(groupId)).$loaded();
      dialogs.then(function(dial) {
        angular.forEach(dial, function(mess) {
          if (!mess.read) {
            arr.push(mess.$id);
            deferred.resolve(arr);
          }
        });
      }, function(err) {
        if (err) {
          deferred.reject(err);
        }
      });


      return deferred.promise;
    }

    function bindReadMessages(uid) {
      return $firebaseArray(messRef.child(uid).child("messages").child("read"));
    }

    function getReadMessages(uid) {
      return $firebaseArray(messRef.child(uid).child("messages").child("read")).$loaded();
    }

    function addMessage(uid, groupId, childId, mess) {
      var deferred = $q.defer();
      if (mess != "") {
        childSvc.getChild(childId).then(function(c) {
          var date = Firebase.ServerValue.TIMESTAMP;
          var mes = {
            message: mess,
            dateCreated: date,
            read: true,
            bothRead: false,
            sent: true,
            subject: childId,
            child: c.firstName + ' ' + c.lastName
          }
          var userFrom = $firebaseArray(messRef.child(uid).child("messages").child(groupId)).$add(mes);
          userFrom.then(function(ref) {
            mes.read = false;
            mes.sent = false;
            var userTo = $firebaseArray(messRef.child(groupId).child("messages").child(uid)).$add(mes);
            userTo.then(function(res) {
              deferred.resolve(res);
            }, function(err) {
              deferred.reject(err);
            });
          }, function(err) {
            deferred.reject(err);
          })
        }, function(err) {
          deferred.reject(err);
        });
      } else {
        deferred.reject("No message");
      }

      return deferred.promise;
    }

    function deleteUnreadMessage(uid, mes) {
      var list = $firebaseArray(messRef.child(uid).child("messages").child("unread"));
      return list.$remove(mes);
    }

    function deleteMessage(uid, groupId, mes) {
      var deferred = $q.defer();

      messRef.child(uid).child("messages").child(groupId).child(mes.$id).remove(function(err) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(true);
        }
      });
      return deferred.promise;
    }

    function markMessageAsRead(uid, groupId) {
      var messageArr = $firebaseArray(messRef.child(uid).child("messages").child(groupId)).$loaded();
      messageArr.then(function(messages) {
        angular.forEach(messages, function(mes) {
          if (!mes.read && !mes.sent && !mes.bothRead) {
            var mref = messRef.child(uid).child("messages").child(groupId).child(mes.$id);
            mref.update({
              read: true,
              bothRead: true
            });
          }
        });
      });
      var messageArrSender = $firebaseArray(messRef.child(groupId).child("messages").child(uid)).$loaded();
      messageArrSender.then(function(messages) {
        angular.forEach(messages, function(mes) {
          if (mes.read && mes.sent && !mes.bothRead) {
            var bothRef = messRef.child(groupId).child("messages").child(uid).child(mes.$id);
            bothRef.update({
              bothRead: true
            });
          }
        });
      });
    }

    function deleteMessageGroup(groupId, uid) {
      var deferred = $q.defer();
      messRef.child(uid).child("messages").child(groupId).remove(function(err) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(true);
        }
      });
      return deferred.promise;
    }

    function getUserLastMessage(uid, mesUserId) {
      var filtered = messRef.child(uid).child("messages").child(mesUserId).orderByChild("dateCreated").limitToLast(1);
      return $firebaseArray(filtered).$loaded();
    }

    function getLastMessageTime(uid, groupId) {
      var filtered = messRef.child(uid).child("messages").child(groupId).orderByChild("dateCreated").limitToLast(1);
      return $firebaseArray(filtered);
    }

  }
})();
