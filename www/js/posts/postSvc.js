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
      postFood: postFood,
      postSleep: postSleep,
      getAllPosts: getAllPosts,
      bindAllPosts: bindAllPosts,
      bindPostsLimit: bindPostsLimit,
      getPostsLimit: getPostsLimit,
      likePost: likePost,
      unLikePost: unLikePost,
      addReaction: addReaction,
      bindReactions: bindReactions,
      getReactions: getReactions,
      deleteReaction: deleteReaction,
      getReactionCount: getReactionCount,
      deletePost: deletePost,
      getLikes: getLikes,
      getPost: getPost
    };

    return service;

    function postMilestone(uid, childId, mess, title) {
      var deferred = $q.defer();
      userSvc.getUserProfile(uid).then(function(usr) {
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

    function postFood(food, childId, uid) {
      var deferred = $q.defer();
      userSvc.getUserProfile(uid).then(function(usr) {
        var ingredients = "";
        var i = 1;
        angular.forEach(food.ingredients, function(ingr) {
          if(food.ingredients.length == i) {
            ingredients += ingr.nl;
          } else {
            ingredients += ingr.nl + ", "
          }
          i++;
        });

        var post = {
          category: {
            name: "food",
            color: "energized",
            icon: "img/iconFood.png"
          },
          uid: uid,
          userName: usr.firstName + " " + usr.lastName,
          profileImage: usr.profileImage,
          photoInDatabase: usr.photoInDatabase,
          dateCreated: Firebase.ServerValue.TIMESTAMP,
          titel: food.category.nl,
          ingredients: ingredients,
          amount: food.amount,
          mood: food.emo,
          remark: food.remark ? food.remark : ""
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

    function postSleep(uid, childId, sleepData, title) {
      var deferred = $q.defer();
      userSvc.getUserProfile(uid).then(function(usr) {
        var post = {
          category: {
            name: "sleep",
            color: "positive",
            icon: "img/iconSleep.png"
          },
          uid: uid,
          userName: usr.firstName + " " + usr.lastName,
          profileImage: usr.profileImage,
          photoInDatabase: usr.photoInDatabase,
          dateCreated: Firebase.ServerValue.TIMESTAMP,
          titel: title,
          timeData: sleepData,
          remark: sleepData.remark ? sleepData.remark : ""
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
      var ref = postRef.child(childId).orderByChild('dateCreated').limitToLast(lim);
      return $firebaseArray(ref);
    }

    function getPostsLimit(childId, lim) {
      var ref = postRef.child(childId).orderByChild('dateCreated').limitToLast(lim);
      return $firebaseArray(ref).$loaded();
    }

    function likePost(post, uid, userName, childId) {
      var deferred = $q.defer();

      var list = $firebaseArray(postRef.child(childId).child(post.$id).child("likes"));
      list.$add({
        uid: uid,
        userName: userName
      }).then(function(ref) {
        var count = list.$indexFor(ref.key()) + 1;
        console.log(count);
        postRef.child(childId).child(post.$id).child("likeCount").set({count: count}, function(err){
          if(!err) {
            deferred.resolve(count);
          } else {
            deferred.reject(err);
          }
        });
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getLikes(postId, childId) {
      return $firebaseArray(postRef.child(childId).child(postId).child("likes"));
    }

    function unLikePost(post, likeId, childId) {
      var deferred = $q.defer();
      postRef.child(childId).child(post.$id).child("likes").child(likeId).remove(function(err) {
        if(!err) {
          var c = post.likeCount.count - 1;
          postRef.child(childId).child(post.$id).child("likeCount").set({count: c}, function(err){
            if(!err) {
              deferred.resolve(c);
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

    function bindReactions(post, childId) {
      var ref = postRef.child(childId).orderByChild('parentId').equalTo(post.$id);
      return $firebaseArray(ref);
    }

    function getReactions(post, childId) {
      var ref = postRef.child(childId).orderByChild('parentId').equalTo(post.$id);
      return $firebaseArray(ref).$loaded();
    }

    function addReaction (post, uid, mess, childId) {
      console.log(post);
      var deferred = $q.defer();
      userSvc.getUserProfile(uid).then(function(usr) {
        var reaction = {
          uid: uid,
          userName: usr.firstName + " " + usr.lastName,
          profileImage: usr.profileImage,
          photoInDatabase: usr.photoInDatabase,
          dateCreated: Firebase.ServerValue.TIMESTAMP,
          message: mess,
          parentId: post.$id
        }
        var ref = postRef.child(childId).push(reaction, function(err) {
          if (!err) {
            getReactions(post, childId).then(function(res) {
              var count = res.length;
              postRef.child(childId).child(post.$id).update({reactionCount: count}, function(err){
                if(!err) {
                  deferred.resolve(ref);
                } else {
                  deferred.reject(err);
                }
              })
            }, function(err) {
              deferred.reject(err);
            })
          } else {
            deferred.reject(err);
          }
        })
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function deleteReaction(reaction, childId) {

    }

    function deletePost(post, childId) {

    }

    function getPost(postId, childId) {
      return $firebaseObject(postRef.child(childId).child(postId));
    }

    function getReactionCount(postId, childId) {
      var count = 0;
      var deferred = $q.defer();
      var postArr = $firebaseArray(postRef.child(childId)).$loaded();
      postArr.then(function(posts) {
        angular.forEach(posts, function(post) {
          if(post.parentId === postId) {
            count++;
            deferred.resolve(count);
          }
        })
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  }
})();
