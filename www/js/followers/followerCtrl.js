(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('followerCtrl', followerCtrl);

  followerCtrl.$inject = ['childSvc', 'Child', 'childFollowerSvc','userDataSvc', 'userSvc', 'loggingService', '$ionicPopup', '$scope', 'roleSvc', '$filter'];

  function followerCtrl(childSvc, Child, childFollowerSvc,userDataSvc, userSvc, loggingService, $ionicPopup, $scope, roleSvc, $filter) {
    var vm = this;
    vm.child = Child;
    vm.checkAdmin = checkAdmin;
    vm.search = "";

    vm.usersFound = [];
    vm.allUsers = [];
    vm.invitedUsers = [];
    vm.requestedUsers = [];
    vm.followers = [];
    vm.folowersArr = childFollowerSvc.bindFollowers(Child.$id);
    vm.invitedUsersArr = childFollowerSvc.getChildInvitedUsers(Child.$id);
    vm.requestedUsersArr = childFollowerSvc.getChildRequestedUsers(Child.$id);
    vm.searchUsers = usersFound;
    vm.userToInvite = {};
    vm.inviteUser = inviteUser;
    vm.acceptInvite = acceptInvite;
    vm.allRoles = roleSvc.bindAllRoles;
    vm.unInviteUser = unInviteUser;
    vm.notOwn = notOwn;
    vm.removeFollower = removeFollower;
    activate();

    //Watchers
    vm.folowersArr.$watch(function(e) {
      if(e.event == "child_added") {
        if(e.key != "requests") {
          childFollowerSvc.getFollower(Child.$id, e.key).then(function(usr) {
            userSvc.getUserProfile(e.key).then(function(u) {
              u.role = roleSvc.bindRole(usr.role);
              u.name = userSvc.getFullName(u.$id);
              vm.followers.push(u);
            });
          });
        }
      }
    });

    vm.invitedUsersArr.$watch(function(e) {
      var usrObj = {};
      if(e.event == "child_added") {
        console.log("user added");
        childFollowerSvc.getChildInvitedUser(Child.$id, e.key).then(function(usr) {
          userSvc.getUserProfile(e.key).then(function(u) {
            usrObj.id = u.$id;
            usrObj.profileImage = u.profileImage;
            usrObj.photoInDatabase = u.photoInDatabase;
            userSvc.getFullNamePromise(u.$id).then(function(fullName) {
              usrObj.name = fullName;
              roleSvc.getRole(usr.role).then(function(roleObj) {
                usrObj.role = roleObj;
                vm.invitedUsers.push(usrObj);
              });
            });
          });
        });
      }
    });

    vm.requestedUsersArr.$watch(function(e) {
      var usrObj = {};
      if(e.event == "child_added") {
        childFollowerSvc.getChildRequestedUser(Child.$id, e.key).then(function(usr) {
          userSvc.getUserProfile(e.key).then(function(u) {
            console.log(u);
            usrObj.id = u.$id;
            usrObj.profileImage = u.profileImage;
            usrObj.photoInDatabase = u.photoInDatabase;
            userSvc.getFullNamePromise(u.$id).then(function(fullName) {
              usrObj.name = fullName;
              roleSvc.getRole(usr.role).then(function(roleObj) {
                usrObj.role = roleObj;
                console.log(usrObj);
                vm.requestedUsers.push(usrObj);
              });
            });
          });
        });
      }
    });

    function activate() {
      $scope.badges.followRequests = 0;
      childFollowerSvc.getUnfollowedUsersFullName(Child.$id).then(function(res) {
        vm.allUsers = res;
      }, function(err) {
      });
    }

    function checkAdmin() {
      if (userDataSvc.uid === Child.administrator) {
        return true;
      } else {
        return false;
      }
    }

    function usersFound() {
      if (vm.search && vm.allUsers.length > 0) {
        vm.usersFound = $filter('searchByName')(vm.search, vm.allUsers);
      } else {
        vm.usersFound = [];
      }
    }

    function inviteUser(usr, index) {
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
          childFollowerSvc.addFollowerRequestChild(Child.$id, usr.$id, res).then(function(res) {
            usr.isInvited = true;
            childFollowerSvc.getUnfollowedUsersFullName(Child.$id).then(function(res) {
              vm.allUsers = res;

            }, function(err) {
            });
            loggingService.showSuccess("Verzoek verstuurd", "Request sent", "linkUser", false);
          }, function(err) {
            loggingService.showError("Verzoek kon niet worden voltooid", err, "linkUser", false);
          })
        } else {
          loggingService.showError("Geen relatie geselecteerd", "No role selected", "linkUser", false);
        }

      });
    }

    function unInviteUser(usr, index) {
      childFollowerSvc.unInviteUserChild(Child.$id, usr.id).then(function(res) {
        vm.invitedUsers.splice(index, 1);
        childFollowerSvc.getUnfollowedUsersFullName(Child.$id).then(function(res) {
          vm.allUsers = res;
        }, function(err) {
        });
      }, function(err) {

      })
    }

    function acceptInvite(user, index) {
      childFollowerSvc.acceptRequest(user.id, Child.$id, user.role.$id).then(function() {
          vm.requestedUsers.splice(index, 1);
      }, function(err) {

      });
    }

    function notOwn(usr) {
      if(usr.$id === userDataSvc.uid) {
        return false;
      } else {
        return true;
      }
    }

    function removeFollower(usr, index) {
      childFollowerSvc.deleteFollower(Child.$id, usr.$id).then(function(res) {
        var str = usr.firstName + " " + usr.lastName + " succesvol verwijderd";
        loggingService.showSuccess(str, "user defollowed", "followerCtrl", false);
        vm.followers.splice(index, 1);
      }, function(err) {
        loggingService.showError("User removed failed", err, "followerCtrl", false);
      })
    }
  }
})();
