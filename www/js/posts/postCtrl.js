(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('postCtrl', postCtrl);

  postCtrl.$inject = ['postSvc', 'Child', 'userDataSvc', '$scope', '$ionicModal', 'childFollowerSvc', '$timeout', "$ionicLoading"];

  function postCtrl(postSvc, Child, userDataSvc, $scope, $ionicModal, childFollowerSvc, $timeout, $ionicLoading) {
    var vm = this;
    vm.child = Child;
    vm.user = userDataSvc;

    vm.filter = {
      category: '',
      user: '',
      set: false
    }

    vm.showHeart = false;
    vm.checkLiked = checkLiked;
    vm.resetFilter = resetFilter;
    vm.likePost = likePost;
    vm.unlikePost = unlikePost;
    vm.showLikes = showLikes;

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
    vm.limit = 10;
    vm.followers = [];

    vm.showFeed = true;

    activate();

    function activate() {
      $ionicLoading.show({
            template: '<ion-spinner icon="ripple"></ion-spinner>'
          });
      postSvc.getPostsLimit(Child.$id, vm.limit).then(function(res) {
        vm.posts = res;
        childFollowerSvc.getFollowersName(Child.$id).then(function(fol) {
          vm.followers = fol;
          $ionicLoading.hide();
        });
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
        $scope.filter = vm.filter;
        $scope.modal.hide();
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
          post.showHeart = true;
          $timeout(function() {
            post.showHeart = false;
          }, 1000);
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
      postSvc.getReactionCount(post.$id, Child.$id).then(function(res){
        return res;
      }, function(err) {
        return 0;
      })

    }
  }
})();
