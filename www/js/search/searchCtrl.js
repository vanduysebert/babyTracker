(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('searchCtrl', searchCtrl);

  searchCtrl.$inject = ['$scope', 'userFollowerSvc', 'userDataSvc', '$filter'];

  function searchCtrl($scope, userFollowerSvc, userDataSvc, $filter) {
    var vm = this;
    vm.searchChildren = searchChildren;
    vm.allChildren = [];
    vm.search = "";
    vm.childrenFound = [];
    activate();

    function activate() {
      userFollowerSvc.getUnfollowedChildrenFullName(userDataSvc.uid).then(function(res) {
        vm.allChildren = res;
      }, function(err) {});
    }

    function searchChildren() {
      if (vm.search && vm.allChildren.length > 0) {
        vm.childrenFound = $filter('searchByName')(vm.search, vm.allChildren);
      } else {
        vm.childrenFound = [];
      }
    }


  }
})();
