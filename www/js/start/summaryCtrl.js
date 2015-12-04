(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('summaryCtrl', summaryCtrl);

  summaryCtrl.$inject = ['Children', 'userDataSvc', 'childFollowerSvc', 'loggingService'];

  function summaryCtrl(Children, userDataSvc, childFollowerSvc, loggingService) {
    var vm = this;
    vm.children = Children;
    vm.user = userDataSvc;
    vm.removeFollower = removeFollower;
    activate();

    function activate() {
      console.log(Children);
    }

    function removeFollower(child, index) {
      console.log(child);
      childFollowerSvc.deleteFollower(child.$id, userDataSvc.uid).then(function(res) {
        var str = child.firstName + " " + child.lastName + " succesvol verwijderd";
        loggingService.showSuccess(str, "user defollowed", "followerCtrl", false);
        vm.children.splice(index, 1);
      }, function(err) {
        loggingService.showError("User removed failed", err, "followerCtrl", false);
      })
    }

  }
})();
