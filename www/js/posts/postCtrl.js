(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('postCtrl', postCtrl);

  postCtrl.$inject = ['config', '$cordovaSocialSharing', '$ionicActionSheet', 'postSvc', 'Child', 'userDataSvc', '$scope', '$ionicModal', 'childFollowerSvc', '$timeout', "$ionicLoading", "$state"];

  function postCtrl(config, $cordovaSocialSharing, $ionicActionSheet, postSvc, Child, userDataSvc, $scope, $ionicModal, childFollowerSvc, $timeout, $ionicLoading, $state) {
    var vm = this;
    vm.child = Child;
    vm.user = userDataSvc;

    vm.filter = {
      category: '',
      user: '',
      set: false
    }

    vm.showSocialShare = showSocialShare;
    vm.showHeart = false;
    vm.newPost = newPost;
    vm.checkLiked = checkLiked;
    vm.resetFilter = resetFilter;
    vm.likePost = likePost;
    vm.unlikePost = unlikePost;
    vm.showLikes = showLikes;
    vm.loadMoreData = loadMoreData;
    vm.moreDataCanBeLoaded = moreDataCanBeLoaded;
    vm.count = 0;
    vm.getReactionCount = getReactionCount;

    vm.categories = [{
      name: "food",
      nl: "Eten & drinken"
    }, {
      name: "sleep",
      nl: 'Slaap'
    }, {
      name: "entertainment",
      nl: "Ontspanning"
    }, {
      name: "diaper",
      nl: "Luiers"
    }, {
      name: "milestone",
      nl: "Mijlpaal"
    }, {
      name: "photo",
      nl: "Foto"
    }];
    vm.showFilter = showFilter;
    vm.limit = 20;
    vm.followers = [];
    vm.posts = [];
    vm.showFeed = true;

    activate();

    function activate() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
      postSvc.getPostsLimit(Child.$id, vm.limit).then(function(res) {
        console.log(res);
        vm.posts = res;
        $ionicLoading.hide();
        childFollowerSvc.getFollowersName(Child.$id).then(function(fol) {
          console.log(fol);
          vm.followers = fol;
        }, function(err) {
          console.log(err);
          $ionicLoading.hide();

        });
      }, function(err) {
        console.log(err);
        $ionicLoading.hide();

      });

      postSvc.getNumberOfPosts(Child.$id).then(function(count) {
        vm.count = count;
      })
    }

    function newPost() {
      $state.go('child.actions');
    }

    function showSocialShare(post) {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'Facebook'
        }, {
          text: 'Twitter'
        }, {
          text: 'WhatsApp'
        }],
        titleText: 'Deel deze post',
        cancelText: 'Annuleer',
        cancel: function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          var p = post.photo ? "data:image/jpeg;base64," + post.photo : post.category.icon;
          var link = config.appLink;
          if (index == 0) {
            shareViaFacebook(post.titel, p, link);
          } else if (index == 1) {
            shareViaTwitter(post.titel + " #babytracker", p, link);
          } else if (index == 2) {
            shareViaWhatsApp(post.titel, p, link);
          }
        }
      });
    }

    function shareViaFacebook(message, image) {
      $cordovaSocialSharing
          .shareViaFacebook(message, image)
          .then(function(result) {
            // Success!
          }, function(err) {
            // An error occurred. Show a message to the user
          });
    }

    function shareViaTwitter(message, image) {
      $cordovaSocialSharing
        .shareViaTwitter(message, image)
        .then(function(result) {

        }, function(err) {
          // An error occurred. Show a message to the user
        });
    }

    function shareViaWhatsApp(message, image) {
      $cordovaSocialSharing
          .shareViaWhatsApp(message, image)
          .then(function(result) {
            // Success!
          }, function(err) {
            // An error occurred. Show a message to the user
          });
    }

    function showFilter() {
      $ionicModal.fromTemplateUrl('templates/modals/postFilter.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });

      $scope.filter = vm.filter;
      $scope.showCategory = true;
      $scope.showUser = true;
      $scope.categories = vm.categories;
      $scope.users = vm.followers;
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

      $scope.saveFilter = function() {
        if ($scope.filter.category != "" || $scope.filter.user != "") {
          vm.filter.set = true;
        }
        if (moreDataCanBeLoaded) {
          $ionicLoading.show({
            template: '<ion-spinner icon="ripple"></ion-spinner>'
          });
          postSvc.getAllPosts(Child.$id).then(function(posts) {
            vm.posts = posts;
            $scope.filter = vm.filter;
            $scope.modal.hide();
            $ionicLoading.hide();
          }, function(err) {
            $scope.filter = vm.filter;
            $scope.modal.hide();
            $ionicLoading.hide();

          });
        }

      }

      $scope.resetFilter = function() {
        vm.filter = {
          category: '',
          user: '',
          set: false
        }
        $scope.filter = vm.filter;
      }

    }

    function resetFilter() {
      vm.filter = {
        category: '',
        user: '',
        set: false
      }
    }

    function likePost(post) {
      if (!checkLiked(post)) {
        postSvc.likePost(post, userDataSvc.uid, userDataSvc.firstName + " " + userDataSvc.lastName, Child.$id).then(function(res) {
          if (post.category.name != "photo") {
            post.showHeart = true;
            $timeout(function() {
              post.showHeart = false;
            }, 1000);
          }

        })
      }
    }

    function checkLiked(post) {
      var l = false;
      angular.forEach(post.likes, function(like) {
        if (like.uid === userDataSvc.uid) {
          l = true;
        }
      });
      return l;
    }

    function unlikePost(post) {
      var likes = postSvc.getLikes(post.$id, Child.$id);
      likes.$loaded().then(function(likeArr) {
        angular.forEach(likeArr, function(like) {
          if (like.uid === userDataSvc.uid) {
            postSvc.unLikePost(post, like.$id, Child.$id);
          }
        })
      })

    }

    function showLikes(mes) {
      if (!mes.showLikes) {
        var likes = postSvc.getLikes(mes.$id, Child.$id);
        likes.$loaded().then(function(arr) {
          console.log(arr);
          mes.likeString = arr;
          mes.showLikes = true;
        });
      } else {
        mes.showLikes = false;
        mes.likeString = [];
      }
    }

    function getReactionCount(post) {
      postSvc.getReactionCount(post.$id, Child.$id).then(function(res) {
        return res;
      }, function(err) {
        return 0;
      })
    }

    function loadMoreData() {
      var l = vm.posts[vm.posts.length - 1];
      console.log(l);
      if (l) {
        var dateLast = l.dateCreated;
        console.log(dateLast);
        vm.limit += 5;
        postSvc.loadMorePosts(dateLast, Child.$id, vm.limit).then(function(res) {
          console.log(res);
          vm.posts = res;
        })
      }
    }

    function moreDataCanBeLoaded() {
      if (vm.count > vm.posts.length + 1) {
        console.log(true);
        return true;
      } else {
        return false;
      }
    }
  }
})();
