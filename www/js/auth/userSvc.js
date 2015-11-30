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
      updateUser: updateUser,
      all: users,
      hasChildren: hasChildren,
      getChildren: getChildren,
      getAuth: getAuth,
      getConnectedUsers: getConnectedUsers
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
            console.log("reject");
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

    function hasChildren(uid) {
      return $firebaseArray(usersRef.child(uid).child("children")).$loaded();
    }

    function getChildren(uid) {
      var deferred = $q.defer();
      var childArr = [];
      var arr = $firebaseArray(usersRef.child(uid).child("children"));
      arr.$loaded().then(function(x) {
        angular.forEach(x, function(child) {
          var ch = $firebaseObject(childrenRef.child(child.$id));
          ch.$loaded().then(function(c) {
            c.owner = child.owner;
            roleSvc.getRole(child.role).then(function(r){
                c.role = r;
                childArr.push(c);
                deferred.resolve(childArr);
            });
          })
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

    function getAuth() {
      var deferred = $q.defer();
      deferred.resolve(Auth.$getAuth());
      return deferred.promise;
    }

    function getConnectedUsers(uid) {
      //TODO: get all connected users to send messages to
    }
  }
})();
