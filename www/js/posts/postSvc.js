(function() {
  'use strict';

  angular
    .module('babyTracker')
    .factory('postSvc', postSvc);

  postSvc.$inject = ['$firebaseArray', 'config', '$q', '$firebaseObject', 'userSvc', '$firebase'];

  function postSvc($firebaseArray, config, $q, $firebaseObject, userSvc, $firebase) {
    var postRef = new Firebase(config.dbUrls.base + "posts");
    var service = {
      postMilestone: postMilestone,
      getAllPosts: getAllPosts,
      bindAllPosts: bindAllPosts,
      bindPostsLimit: bindPostsLimit,
      getPostsLimit: getPostsLimit
    };

    return service;

    function postMilestone(uid, childId, mess, title) {
      var deferred = $q.defer();
      userSvc.getUserProfile(uid).then(function(usr) {
        console.log(usr);
        var post = {
          category: {
            name: "milestone",
            color: "royal",
            icon: "img/iconMilestone.png"
          },
          uid: uid,
          userName: usr.firstName + " " + usr.lastName,
          profileImage: usr.profileImage,
          photoInDatabase: usr.photoInDatabase,
          dateCreated: Firebase.ServerValue.TIMESTAMP,
          message: mess,
          titel: title
        }
        var ref = postRef.child(childId).push(post, function(err) {
          if (!err) {
            deferred.resolve(ref);
          } else {
            deferred.reject(err);
          }
        })
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getAllPosts(childId) {
      return $firebaseArray(postRef.child(childId)).$loaded();
    }

    function bindAllPosts(childId) {
      return $firebaseArray(postRef.child(childId));
    }

    function bindPostsLimit(childId, lim) {
      var ref = postRef.child(childId).limitToFirst(lim);
      return $firebaseArray(ref);
    }

    function getPostsLimit(childId, lim) {
      var ref = postRef.child(childId).limitToFirst(lim);
      return $firebaseArray(ref).$loaded();
    }

  }
})();
