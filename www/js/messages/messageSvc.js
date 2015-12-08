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
      getAllMessageGroups: getAllMessageGroups,
      getDialogs: getDialogs,
      bindAllUnreadMessages: bindAllUnreadMessages,
      getAllUnreadMessages: getAllUnreadMessages,
      bindReadMessages: bindReadMessages,
      getReadMessages: getReadMessages,
      addMessage: addMessage,
      deleteUnreadMessage: deleteUnreadMessage,
      deleteMessage: deleteMessage,
      deleteMessageGroup: deleteMessageGroup,
      markMessageAsRead: markMessageAsRead
    };

    return service;

    function bindAllMessages(uid) {
      return $firebaseArray(messRef.child(uid).child("messages"));
    }

    function getAllMessages(uid) {
      return $firebaseArray(messRef.child(uid).child("messages")).$loaded();
    }

    function getDialogs(groupId, uid, childId) {
      return $firebaseArray(messRef.child(uid).child("messages").child(groupId).child(childId));
    }


    function bindAllUnreadMessages(uid) {
      return $firebaseArray(messRef.child(uid).child("messages").child("unread"));
    }

    function getAllMessageGroups(uid) {
      var deferred = $q.defer();
      var mesGroups = [];
      var children = "";
      var messages = $firebaseArray(messRef.child(uid).child("messages")).$loaded();
      messages.then(function(mesArr) {
        if (mesArr.length > 0) {
          angular.forEach(mesArr, function(dialog) {
            var m = {
              groupId: dialog.$id,
              groupName: '',
              profileImage: '',
              photoInDatabase: '',
              lastMessage: '',
              lastMessageRead: '',
              lastMessageCreated: '',
              child: ''
            }
            userSvc.getUserProfile(dialog.$id).then(function(group) {
              m.groupName = group.firstName + " " + group.lastName;
              m.profileImage = group.profileImage;
              m.photoInDatabase = group.photoInDatabase;
              //TODO: bij prestatieproblemen kan deze optie worden weggelaten
              var dialogs = $firebaseArray(messRef.child(uid).child("messages").child(dialog.$id)).$loaded();
              dialogs.then(function(dial) {
                angular.forEach(dial, function(child) {
                  childSvc.getChild(child.$id).then(function(c) {
                    m.child = c.firstName + " " + c.lastName;
                    m.childId = child.$id;
                    messRef.child(uid).child("messages").child(dialog.$id).child(child.$id).orderByChild("dateCreated").limitToLast(1).once("value", function(data) {
                      data.forEach(function(obj) {
                        var mesObj = obj.val();
                        m.lastMessage = mesObj.message;
                        m.lastMessageRead = mesObj.read;
                        m.lastMessageCreated = mesObj.dateCreated;
                        mesGroups.push(m);
                        deferred.resolve(mesGroups);
                      });
                    }, function(err) {
                      deferred.reject(err);
                    })
                  }, function(err) {
                    deferred.reject(err);
                  });
                });
              }, function(err) {
                if (err) {
                  deferred.reject(err);
                }
              });

            }, function(err) {
              deferred.reject(err);
            });
          });
        } else {
          deferred.resolve(mesGroups);
        }
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    //TODO: Order by childId + include childId
    function getAllUnreadMessages(uid, groupId, count) {
      var deferred = $q.defer();
      console.log("count", count);
      var dialogs = $firebaseArray(messRef.child(uid).child("messages").child(groupId)).$loaded();
      dialogs.then(function(dial) {
        angular.forEach(dial, function(child) {
          messRef.child(uid).child("messages").child(groupId).child(child.$id).orderByChild("dateCreated").limitToLast(1).once("value", function(data) {
            data.forEach(function(obj) {
              var mesObj = obj.val();
              if (!mesObj.read) {
                count++;
                deferred.resolve(count);

              }
            });
          }, function(err) {
            deferred.reject(err);
          });
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
      var date = Firebase.ServerValue.TIMESTAMP;
      var mes = {
        message: mess,
        dateCreated: date,
        read: true,
        sent: true
      }
      var userFrom = $firebaseArray(messRef.child(uid).child("messages").child(groupId).child(childId)).$add(mes);
      userFrom.then(function(ref) {
        mes.read = false;
        mes.sent = false;
        return $firebaseArray(messRef.child(groupId).child("messages").child(uid).child(childId)).$add(mes);
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    function deleteUnreadMessage(uid, mes) {
      var list = $firebaseArray(messRef.child(uid).child("messages").child("unread"));
      return list.$remove(mes);
    }

    function deleteMessage(uid, groupId, childId, mes) {
      var deferred = $q.defer();

      messRef.child(uid).child("messages").child(groupId).child(childId).child(mes.$id).remove(function(err) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(true);
        }
      });
      return deferred.promise;
    }

    function markMessageAsRead(uid, groupId, childId) {
      var messageArr = $firebaseArray(messRef.child(uid).child("messages").child(groupId).child(childId)).$loaded();
      messageArr.then(function(messages) {
        angular.forEach(messages, function(mes) {
          if (!mes.read) {
            messRef.child(uid).child("messages").child(groupId).child(childId).child(mes.$id).update({
              read: true
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

  }
})();
