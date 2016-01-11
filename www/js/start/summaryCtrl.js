(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('summaryCtrl', summaryCtrl);

  summaryCtrl.$inject = ['Children', 'userDataSvc', 'childFollowerSvc', 'loggingService', '$scope', 'userSvc', '$ionicPopup'];

  /**
   * Controller that handles the child-summary view
   */
  function summaryCtrl(Children, userDataSvc, childFollowerSvc, loggingService, $scope, userSvc, $ionicPopup) {
    var vm = this;
    //Variables
    vm.children = Children;
    vm.user = userDataSvc;

    //Functions
    vm.doRefresh = doRefresh;
    vm.removeFollower = removeFollower;

    function removeFollower(child, index) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Verwijder kind',
        template: 'Ben je zeker dat je ' + child.firstName + ' wil verwijderen?',
        cancelText: 'Annuleer',
        cancelType: 'button-positive',
        okText: 'Verwijder',
        okType: 'button-assertive'
      });
      confirmPopup.then(function(res) {
        if (res) {
          childFollowerSvc.deleteFollower(child.$id, userDataSvc.uid).then(function(res) {
            var str = child.firstName + " " + child.lastName + " succesvol verwijderd";
            loggingService.showSuccess(str, "user defollowed", "followerCtrl", true);
            vm.children.splice(index, 1);
          }, function(err) {
            loggingService.showError("User removed failed", err, "followerCtrl", false);
          });
        }
      });
    }

    function doRefresh() {
      userSvc.getChildren(userDataSvc.uid).then(function(childArr) {
        vm.children = childArr;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  }
})();
