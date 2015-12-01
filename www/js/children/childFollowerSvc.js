(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('childFollowerSvc', childFollowerSvc);

  childFollowerSvc.$inject = ['$q', 'config', '$firebaseObject', '$firebaseArray', 'loggingService', 'childSvc', 'roleSvc'];

  function childFollowerSvc($q, config, $firebaseObject, $firebaseArray, loggingService, childSvc, roleSvc) {
    var childRef = new Firebase(config.dbUrls.base + "children");
    var usersRef = new Firebase(config.dbUrls.base + "users");
    var service = {
      getFollowers: getFollowers,
      addFollower: addFollower,
      deleteFollower: deleteFollower,
      hasFollower: hasFollower,
      bindFollowers: bindFollowers
    };

    return service;

    function getFollowers(childId) {
      var deferred = $q.defer();
      var followArr = [];
      if (childId) {
        var followers = $firebaseArray(childRef.child(childId).child("followers"));
        followers.$loaded().then(function() {
            angular.forEach(followers, function(fol) {
              var user = $firebaseObject(usersRef.child(fol.$id));
              user.$loaded().then(function() {
                var role = $firebaseObject(usersRef.child(fol.$id).child("children").child(childId));
                role.$loaded().then(function() {
                  roleSvc.getRole(role.role).then(function(r) {
                    user.role = r;
                    followArr.push(user);
                    deferred.resolve(followArr);
                  })
                });
              });
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
    }

    function addFollower(childId, uid, role) {
      var deferred = $q.defer();
      if (childId && uid) {
        childRef.child(childId).child("followers").child(uid).set(true, function(err) {
          if (!err) {
            usersRef.child(uid).child("children").child(childId).set({
              role: role,
              owner: true
            }, function(err) {
              if (err) {
                deferred.reject(err);
              } else {

                deferred.resolve(childId);
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
      var userChildren = $firebaseArray(usersRef.child(uid).child("children"));
      var childFollowers = $firebaseArray(childRef.child(childId).child("followers"));
      userChildren.$remove(childId).then(function(ref) {
        return childFollowers.$remove(uid);
      });
    }

    function hasFollower(uid, child) {
      var deferred = $q.defer();
      var ref = child.$ref();
      ref.once("value", function(data) {
        if(data.child("followers").child(uid).exists()) {
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
  }
})();
