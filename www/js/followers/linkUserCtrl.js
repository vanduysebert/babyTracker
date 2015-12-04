(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('linkUserCtrl', linkUserCtrl);

  linkUserCtrl.$inject = ['$q','loggingService','roleSvc', '$scope', 'Child', 'childSvc', 'childFollowerSvc', 'userSvc', '$filter', '$ionicPopup', '$ionicLoading'];

  function linkUserCtrl($q,loggingService, roleSvc, $scope, Child, childSvc, childFollowerSvc, userSvc, $filter, $ionicPopup, $ionicLoading) {
    var vm = this;
    vm.search = "";
    vm.usersFound = [];
    vm.allUsers = [];
    vm.searchUsers = usersFound;
    vm.invited = false;
    vm.userToInvite = {};
    vm.inviteUser = inviteUser;
    vm.acceptInvite = acceptInvite;
    vm.allRoles = roleSvc.bindAllRoles;
    vm.unInviteUser = unInviteUser;
    vm.relatedUsers = [];
    activate();

    function activate() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
      initPage().then(function() {
        $ionicLoading.hide();
      })
    }

    function initPage() {
      var deferred = $q.defer();
      userSvc.getUnfollowedUsersFullName(Child.$id).then(function(res) {
        vm.allUsers = res;
        console.log(res);
        deferred.resolve("Loaded");
      }, function(err) {
        deferred.reject(err);
      });
      userSvc.getFollowerRelatedUsersFullName(Child.$id).then(function(res) {
        vm.relatedUsers = res;
        console.log(res);
        deferred.resolve("loaded");
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function usersFound() {
      if (vm.search) {
        vm.usersFound = $filter('searchByName')(vm.search, vm.allUsers);
      } else {
        vm.usersFound = [];
      }
    }

    function acceptInvite(uid) {

    }

    function inviteUser(usr) {
      $scope.role = {};
      $scope.allRoles= vm.allRoles;
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
        if(res) {
          childFollowerSvc.addFollowerRequestChild(Child.$id, usr.id, res).then(function(res) {
            usr.isInvited = true;
            loggingService.showSuccess("Verzoek verstuurd", "Request sent", "linkUser", false);
          }, function(err) {
            loggingService.showError("Verzoek kon niet worden voltooid", err, "linkUser", false);
          })
        } else {
          loggingService.showError("Geen relatie geselecteerd", "No role selected", "linkUser", false);
        }

      });

    }
    function unInviteUser(usr) {
      childFollowerSvc.unInviteUserChild(Child.$id, usr.id).then(function(res) {
        usr.isInvited = false;
      }, function(err) {

      })
    }
  }
})();
