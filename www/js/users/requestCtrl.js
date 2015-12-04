(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('requestCtrl', requestCtrl);

  requestCtrl.$inject = ['loggingService', '$ionicPopup', '$filter', '$scope', 'childFollowerSvc', 'userFollowerSvc', 'userDataSvc', 'childSvc', 'roleSvc'];

  function requestCtrl(loggingService, $ionicPopup, $filter, $scope, childFollowerSvc, userFollowerSvc, userDataSvc, childSvc, roleSvc) {
    var vm = this;
    vm.allRoles = roleSvc.bindAllRoles;

    vm.allRequestsArr = userFollowerSvc.bindRequests(userDataSvc.uid);
    vm.requests = [];
    vm.allInvitesArr = userFollowerSvc.bindInvites(userDataSvc.uid);
    vm.invites = [];

    vm.allChildren = [];
    vm.childrenFound = [];

    vm.searchChildren = searchChildren;
    vm.search = "";

    vm.acceptRequest = acceptRequest;
    vm.rejectRequest = rejectRequest;

    vm.inviteChild = inviteChild;
    vm.unInviteChild = unInviteChild;
    activate();

    vm.allRequestsArr.$watch(function(e) {
      console.log(e);
      var childObj = {};
      if (e.event == "child_added") {
        childFollowerSvc.getChildInvitedUser(e.key, userDataSvc.uid).then(function(child) {
          childSvc.getChild(e.key).then(function(c) {
            childObj.id = c.$id;
            childObj.profileImage = c.profileImage;
            childObj.photoInDatabase = c.photoInDatabase;
            childObj.name = c.firstName + " " + c.lastName;
            childObj.role = roleSvc.bindRole(child.role);
            vm.requests.push(childObj);
          });
        });
      }
    });

    vm.allInvitesArr.$watch(function(e) {
      console.log(e);
      var childObj = {};
      if (e.event == "child_added") {
        userFollowerSvc.getInvitedChild(e.key, userDataSvc.uid).then(function(child) {
          childSvc.getChild(e.key).then(function(c) {
            childObj.id = c.$id;
            childObj.profileImage = c.profileImage;
            childObj.photoInDatabase = c.photoInDatabase;
            childObj.name = c.firstName + " " + c.lastName;
            childObj.role = roleSvc.bindRole(child.role);
            vm.invites.push(childObj);
          });
        });
      }
    });

    function activate() {
      $scope.userBadges.requests = 0;
      userFollowerSvc.getUnfollowedChildrenFullName(userDataSvc.uid).then(function(res) {
        vm.allChildren = res;
      }, function(err) {
      });
    }

    function acceptRequest(child, index) {
      userFollowerSvc.acceptRequest(userDataSvc.uid, child.id, child.role.$id).then(function(res) {
        if (res) {
          vm.requests.splice(index, 1);
        }
      }, function(err) {

      });
    }

    function searchChildren() {
      if (vm.search && vm.allChildren.length > 0) {
        vm.childrenFound = $filter('searchByName')(vm.search, vm.allChildren);
      } else {
        vm.childrenFound = [];
      }
    }

    function inviteChild(child, index) {
      $scope.role = {};
      $scope.allRoles = vm.allRoles;
      var rolePopup = $ionicPopup.show({
        templateUrl: "templates/popups/rolePopup.html",
        title: 'Selecteer relatie tot het kind',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Bewaar</b>',
          type: 'button-balanced',
          onTap: function(e) {
            if (!$scope.role) {
              e.preventDefault();
            } else {
              return $scope.role.id;
            }
          }
        }]
      });
      rolePopup.then(function(res) {
        if (res) {
          userFollowerSvc.addUserInvite(userDataSvc.uid,child.$id, res).then(function(result) {
            child.isInvited = true;
            child.name = child.firstName + " " + child.lastName;
            loggingService.showSuccess("Verzoek verstuurd", "Request sent", "linkUser", false);
          }, function(err) {
            loggingService.showError("Verzoek kon niet worden voltooid", err, "linkUser", false);
          });
        } else {
          loggingService.showError("Geen relatie geselecteerd", "No role selected", "linkUser", false);
        }

      });
    }

    function getAllChildren() {
      userFollowerSvc.getUnfollowedChildrenFullName(userDataSvc.uid).then(function(resArr) {
        vm.allChildren = resArr;
      }, function(err) {
        console.log(err);
      });
    }

    function unInviteChild(child, index) {
      var id = child.id ? child.id : child.$id;
      console.log(child);
      userFollowerSvc.unInviteChild(userDataSvc.uid, id).then(function(res) {
        vm.invites.splice(index, 1);
        childSvc.lowerUnseenRequest(id);
        userFollowerSvc.getUnfollowedChildrenFullName(userDataSvc.uid).then(function(res) {
          vm.allChildren = res;
        }, function(err) {
          console.log(err);
        });
      }, function(err) {

      })
    }

    function rejectRequest(child, index) {
      userFollowerSvc.removeRequest(userDataSvc.uid, child.id).then(function(res) {
        vm.requests.splice(index, 1);
      })
    }
  }
})();
