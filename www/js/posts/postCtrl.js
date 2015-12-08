(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('postCtrl', postCtrl);

  postCtrl.$inject = ['postSvc', 'Child', 'userDataSvc', '$scope', '$ionicModal', 'childFollowerSvc'];

  function postCtrl(postSvc, Child, userDataSvc, $scope, $ionicModal, childFollowerSvc) {
    var vm = this;
    vm.child = Child;
    vm.filter = {
      category: '',
      user: '',
      set: false
    }

    vm.resetFilter = resetFilter;

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
      }
    ];
    vm.showFilter = showFilter;
    vm.limit = 10;
    vm.followers = [];

    vm.showFeed = true;
    vm.posts = postSvc.bindPostsLimit(Child.$id, vm.limit);
    activate();

    function activate() {
      childFollowerSvc.getFollowersName(Child.$id).then(function(fol) {
        vm.followers = fol;
        console.log(fol);
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
        if($scope.filter.category != "" || $scope.filter.user != "") {
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
  }
})();
