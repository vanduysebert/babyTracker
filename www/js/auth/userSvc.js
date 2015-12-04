(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('userSvc', userSvc);

  userSvc.$inject = ['Auth', 'config', '$q', '$firebaseArray', '$firebaseObject', 'loggingService', 'roleSvc'];

  function userSvc(Auth, config, $q, $firebaseArray, $firebaseObject, loggingService, roleSvc) {
    var usersRef = new Firebase(config.dbUrls.base + 'users');
    var childrenRef = new Firebase(config.dbUrls.base + 'children');
    var users = $firebaseArray(usersRef);
    var factory = {
      usersRef: usersRef,
      getLoggedInUser: getLoggedInUser,
      getUserProfile: getUserProfile,
      getFullName: getFullName,
      getFullNamePromise: getFullNamePromise,
      updateUser: updateUser,
      all: users,
      getAllUsersFullName: getAllUsersFullName,
      getFollowerRelatedUsersFullName: getFollowerRelatedUsersFullName,
      hasChildren: hasChildren,
      getChildren: getChildren,
      getAuth: getAuth,
      getConnectedUsers: getConnectedUsers,
      addFamily: addFamily,
      removeFamily: removeFamily
    }

    return factory;

    function getLoggedInUser() {
      var deferred = $q.defer();
      var loggedInUser = {
        uid: '',
        email: '',
        profileImage: '',
        firstName: '',
        lastName: '',
        gender: '',
        follows: ''
      }
      var user = Auth.$getAuth();
      if (user) {
        loggedInUser.uid = user.auth.uid;
        if (user.provider === "password") {
          loggedInUser.email = user.password.email;
          loggedInUser.profileImage = user.password.profileImageURL;
        } else if (user.provider === "facebook") {
          loggedInUser.profileImage = user.facebook.profileImageURL;
          loggedInUser.gender = user.facebook.gender;

        } else if (user.provider === "google") {
          loggedInUser.profileImage = user.google.profileImageURL;
          loggedInUser.gender = user.google.gender;
        }
        var ref = new Firebase(config.dbUrls.auth + "/" + user.uid);

        ref.once("value", function(data) {
          if (data.exists()) {
            var p = data.val();
            if (p.firstName) {
              loggedInUser.firstName = p.firstName;
            }
            if (p.lastName) {
              loggedInUser.lastName = p.lastName;
            }
            if (p.gender) {
              loggedInUser.gender = p.gender;
            }
            loggedInUser.follows = p.follows;
            deferred.resolve(loggedInUser);
          } else {
            deferred.reject("AUTH_REQUIRED");
          }

        }, function(errorObject) {
          deferred.reject(errorObject);
          loggingService.showError("Could not get userinfo:", errorObject.code, "Login", true);
        });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    }

    function getAllUsersFullName() {
      var fnArr = [];
      users.$loaded().then(function(usr) {
        console.log(usr);
        angular.forEach(usr, function(u) {
          var user = {
            name: "",
            id: "",
            profileImage: "",
            photoInDatabase: ""
          };
          user.name = getFullName(u.$id);
          user.id = u.$id;
          user.profileImage = u.profileImage;
          user.photoInDatabase = u.photoInDatabase;
          fnArr.push(user);
        });
      })
      return fnArr;
    }



    function hasChildren(uid) {
      var chilArr = []
      var deferred = $q.defer();
      var children = $firebaseArray(usersRef.child(uid).child("children")).$loaded();
      children.then(function(childArr) {
        if (childArr) {
          angular.forEach(childArr, function(child) {
            if (child.$id != "requests") {
              chilArr.push(child.$id);
              deferred.resolve(chilArr);
            }
          });
        }
        deferred.resolve(chilArr);
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    function getChildren(uid) {
      var deferred = $q.defer();
      var childArr = [];
      var arr = $firebaseArray(usersRef.child(uid).child("children"));
      arr.$loaded().then(function(x) {
        angular.forEach(x, function(child) {
          if (child.$id != "requests") {
            console.log("child", child);
            var ch = $firebaseObject(childrenRef.child(child.$id));
            ch.$loaded().then(function(c) {
              c.owner = child.owner;
              roleSvc.getRole(child.role).then(function(r) {
                c.role = r;
                childArr.push(c);
                deferred.resolve(childArr);
              });
            })
          }
        });
      });

      return deferred.promise;
    }

    function updateUser(uid, user) {
      return user.$save();
    }

    function getUserProfile(uid) {
      return $firebaseObject(usersRef.child(uid)).$loaded();
    }

    function getFullName(uid) {
      return users.$getRecord(uid).firstName + ' ' + users.$getRecord(uid).lastName;
    }

    function getFullNamePromise(uid) {
      var deferred = $q.defer();
      deferred.resolve(users.$getRecord(uid).firstName + ' ' + users.$getRecord(uid).lastName);
      return deferred.promise;
    }

    function getAuth() {
      var deferred = $q.defer();
      deferred.resolve(Auth.$getAuth());
      return deferred.promise;
    }

    function getConnectedUsers(uid) {
      //TODO: get all connected users to send messages to
    }

    function addFamily(uid, childId, r) {
      var deferred = $q.defer();
      usersRef.child(uid).child("family").child(childId).set({
        role: r
      }, function(err) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(true);
        }
      });
      return deferred.promise;
    }

    function removeFamily(uid, childId) {
      usersRef.child(uid).child("family").child(childId).remove();
    }

    function getFollowerRelatedUsersFullName(childId) {
      var deferred = $q.defer();
      var folArr = [];
      var followers = $firebaseArray(childrenRef.child(childId).child("followers"));
      followers.$loaded().then(function(fol) {
        //console.log(followers);
        angular.forEach(fol, function(f) {
          var children = $firebaseArray(usersRef.child(f.$id).child("children"));
          children.$loaded().then(function(children) {
            //console.log(children);
            angular.forEach(children, function(child) {
              if (child.$id != childId) {
                var folChild = $firebaseArray(childrenRef.child(child.$id).child("followers"));
                folChild.$loaded().then(function(folChildArr) {
                  //console.log(folChildArr);
                  angular.forEach(folChildArr, function(u) {
                    if (u.$id != f.$id) {
                      var v = {};
                      v.fullName = getFullName(u.$id);
                      v.id = u.$id;
                      v.profileImage = u.profileImage;
                      v.photoInDatabase = u.photoInDatabase;
                      folArr.push(v);
                      deferred.resolve(folArr);
                    }
                    deferred.resolve(folArr);
                  })
                }, function(err) {
                  deferred.reject(err);
                });
              }
            });
          }, function(err) {
            deferred.reject(err);
          });
        });
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  }
})();
