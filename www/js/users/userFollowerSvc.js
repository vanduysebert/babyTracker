(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('userFollowerSvc', userFollowerSvc);

  userFollowerSvc.$inject = ['$firebaseObject', '$firebaseArray', 'config', 'childFollowerSvc', '$q', 'childSvc'];

  function userFollowerSvc($firebaseObject, $firebaseArray, config, childFollowerSvc, $q, childSvc) {
    var usersRef = new Firebase(config.dbUrls.base + "users");
    var childRef = new Firebase(config.dbUrls.base + "children");

    var service = {
      bindRequests: bindRequests,
      getInvitedChild: getInvitedChild,
      acceptRequest: acceptRequest,
      removeRequest: removeRequest,
      bindInvites: bindInvites,
      unInviteChild: unInviteChild,
      addUserInvite: addUserInvite,
      getUnfollowedChildrenFullName: getUnfollowedChildrenFullName
    };

    return service;

    function bindRequests(uid) {
      return $firebaseArray(usersRef.child(uid).child("children").child("requests").child("received"));
    }

    /*function getRequests(uid) {
        var arr = $firebaseArray(usersRef.child(uid).child("children").child("requests").child("received")).$loaded();
        arr.then(function(req) {
            angular.forEach(req, function(child) {

            })
        })
    }*/

    function acceptRequest(uid, childId, role) {
      var deferred = $q.defer();
      childFollowerSvc.unInviteUserChild(childId, uid).then(function(ref) {
        childFollowerSvc.addFollower(childId, uid, role, false).then(function() {
          deferred.resolve(true);
        }, function(err) {
          deferred.reject(err);
        });
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function removeRequest(uid, childId) {
      return childFollowerSvc.unInviteUserChild(childId, uid);
    }

    function bindInvites(uid, childId) {
      return $firebaseArray(usersRef.child(uid).child("children").child("requests").child("sent"));
    }



    function unInviteChild(uid, childId) {
      var deferred = $q.defer();
      childRef.child(childId).child("followers").child("requests").child("received").child(uid).remove(function(err) {
        if (!err) {
          usersRef.child(uid).child("children").child("requests").child("sent").child(childId).remove(function(err) {
            if (!err) {
              deferred.resolve(true);
            } else {
              deferred.reject(err);
            }
          });
        } else {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    }

    function addUserInvite(uid, childId, role) {
      var deferred = $q.defer();
      childRef.child(childId).child("followers").child("requests").child("received").child(uid).set({
        role: role
      }, function(err) {
        if (!err) {
          usersRef.child(uid).child("children").child("requests").child("sent").child(childId).set({
            owner: false,
            role: role
          }, function(err) {
            if (!err) {
              deferred.resolve("Request added");
            } else {
              childRef.child("childId").child("followers").child("requests").child("sent").child(uid).remove();
              deferred.reject("err");
            }
          })
        } else {
          deferred.reject(err);
        }
      });

      return deferred.promise;
    }

    function getInvitedChild(childId, uid) {
      return $firebaseObject(usersRef.child(uid).child("children").child("requests").child("sent").child(childId)).$loaded();
    }

    function getUnfollowedChildrenFullName(uid) {
      var deferred = $q.defer();
      var fnArr = [];
      var children = $firebaseArray(childRef);
      children.$loaded().then(function(cld) {
        console.log("arr1", fnArr);
        angular.forEach(cld, function(c) {
          childRef.child(c.$id).child("followers").child(uid).once('value', function(data) {
            if (!data.exists()) {

              childRef.child(c.$id).child("followers").child("requests").child("sent").child(uid).once('value', function(req) {
                if (!req.exists()) {
                  childRef.child(c.$id).child("followers").child("requests").child("received").child(uid).once('value', function(rec) {
                    if (!rec.exists()) {
                      c.name = c.firstName + " " + c.lastName;
                      console.log("arr2", fnArr);
                      fnArr.push(c);
                      console.log("arr3", fnArr);
                      deferred.resolve(fnArr);
                    }
                  });
                }
              });
            }
          });
        });
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  }
})();
