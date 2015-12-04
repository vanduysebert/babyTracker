(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('childFollowerSvc', childFollowerSvc);

  childFollowerSvc.$inject = ['userSvc', '$q', 'config', '$firebaseObject', '$firebaseArray', 'loggingService', 'childSvc', 'roleSvc'];

  function childFollowerSvc(userSvc, $q, config, $firebaseObject, $firebaseArray, loggingService, childSvc, roleSvc) {
    var childRef = new Firebase(config.dbUrls.base + "children");
    var usersRef = new Firebase(config.dbUrls.base + "users");
    var service = {
      getFollower: getFollower,
      addFollower: addFollower,
      deleteFollower: deleteFollower,
      hasFollower: hasFollower,
      bindFollowers: bindFollowers,
      getChildInvitedUsers: getChildInvitedUsers,
      getChildInvitedUser: getChildInvitedUser,
      addFollowerRequestChild: addFollowerRequestChild,
      unInviteUserChild: unInviteUserChild,

      getChildRequestedUsers: getChildRequestedUsers,
      getChildRequestedUser: getChildRequestedUser,
      getUserRequestedUsers: getUserRequestedUsers,
      getUserInvitedUsers: getUserInvitedUsers,

      getUnfollowedUsersFullName: getUnfollowedUsersFullName,

      acceptRequest: acceptRequest
    };

    return service;

    /*function getFollowers(childId) {
      var deferred = $q.defer();
      var followArr = [];
      if (childId) {
        var followers = $firebaseArray(childRef.child(childId).child("followers"));
        followers.$loaded().then(function() {
            angular.forEach(followers, function(fol) {
              if(fol.$id != "requests") {
              var user = $firebaseObject(usersRef.child(fol.$id));
              user.$loaded().then(function() {
                var role = $firebaseObject(usersRef.child(fol.$id).child("children").child(childId));
                role.$loaded().then(function(ro) {
                  roleSvc.getRole(role.role).then(function(r) {
                    user.role = r;
                    followArr.push(user);
                    deferred.resolve(followArr);
                  })
                });
              });
            }
            });
          })
          .catch(function(err) {
            deferred.reject(err);
            loggingService.showError("Error with reading records", err, "childFollowerSvc", false);
          });
      } else {
        deferred.resolve(followArr);
      }
      return deferred.promise;
    }*/

    function addFollower(childId, uid, role, owner) {
      var deferred = $q.defer();
      if (childId && uid) {
        childRef.child(childId).child("followers").child(uid).set({
          role: role,
          owner: owner
        }, function(err) {
          if (!err) {
            usersRef.child(uid).child("children").child(childId).set({
              role: role,
              owner: owner
            }, function(err) {
              if (err) {
                deferred.reject(err);
              } else {
                deferred.resolve(true);
              }
            });
          } else {
            deferred.reject(err);
          }
        });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    }

    function deleteFollower(childId, uid) {
      var deferred = $q.defer();
      var userChildren = usersRef.child(uid).child("children").child(childId);
      var childFollowers = childRef.child(childId).child("followers").child(uid);
      userChildren.remove(function(err) {
        if (!err) {
          childFollowers.remove(function(error) {
            if (!error) {
              deferred.resolve("Deleted");
            } else {
              deferred.reject(error)
            }
          })
        } else {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    }

    function getUnfollowedUsersFullName(childId) {
      var deferred = $q.defer();
      var users = $firebaseArray(usersRef);
      users.$loaded().then(function(usr) {
        var fnArr = [];
        angular.forEach(usr, function(u) {
          usersRef.child(u.$id).child("children").child(childId).once('value', function(data) {
            if (!data.exists()) {
              usersRef.child(u.$id).child("children").child("requests").child("sent").child(childId).once('value', function(req) {
                if (!req.exists()) {
                  usersRef.child(u.$id).child("children").child("requests").child("received").child(childId).once('value', function(rec) {
                    if (!rec.exists()) {
                      u.name = userSvc.getFullName(u.$id);
                      fnArr.push(u);
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

    function hasFollower(uid, child) {
      var deferred = $q.defer();
      var ref = child.$ref();
      ref.once("value", function(data) {
        if (data.child("followers").child(uid).exists()) {
          deferred.resolve(true);
        } else {
          deferred.resolve(false);
        }
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function bindFollowers(childId) {
      return $firebaseArray(childRef.child(childId).child("followers"));
    }

    //Child invite User
    function getChildInvitedUsers(childId) {
      return $firebaseArray(childRef.child(childId).child("followers").child("requests").child("sent"));
    }

    function getChildInvitedUser(childId, uid) {
      return $firebaseObject(childRef.child(childId).child("followers").child("requests").child("sent").child(uid)).$loaded();
    }

    function addFollowerRequestChild(childId, uid, role) {
      var deferred = $q.defer();
      childRef.child(childId).child("followers").child("requests").child("sent").child(uid).set({
        role: role
      }, function(err) {
        if (!err) {
          usersRef.child(uid).child("children").child("requests").child("received").child(childId).set({
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

    function unInviteUserChild(childId, uid) {
      var deferred = $q.defer();
      childRef.child(childId).child("followers").child("requests").child("sent").child(uid).remove(function(err) {
        if (!err) {
          usersRef.child(uid).child("children").child("requests").child("received").child(childId).remove(function(err) {
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

    function getChildRequestedUsers(childId) {
      return $firebaseArray(childRef.child(childId).child("followers").child("requests").child("received"));
    }

    function getChildRequestedUser(childId, uid) {
      return $firebaseObject(childRef.child(childId).child("followers").child("requests").child("received").child(uid)).$loaded();
    }

    function getUserRequestedUsers(uid) {
      return $firebaseArray(childRef.child(uid).child("children").child("requests").child("received"));
    }

    function getUserInvitedUsers(uid) {
      return $firebaseArray(childRef.child(uid).child("children").child("requests").child("sent"));
    }

    function getFollower(childId, uid) {
      return $firebaseObject(childRef.child(childId).child("followers").child(uid)).$loaded();
    }

    function acceptRequest(uid, childId, role) {
      var deferred = $q.defer();
      childRef.child(childId).child("followers").child("requests").child("received").child(uid).remove(function(err) {
        if (!err) {
          usersRef.child(uid).child("children").child("requests").child("sent").child(childId).remove(function(err) {
            if (!err) {
              addFollower(childId, uid, role, false).then(function() {
                deferred.resolve(true);
              }, function(err) {
                deferred.reject(err);
              });
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
  }
})();
