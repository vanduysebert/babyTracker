(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('familyCtrl', familyCtrl);

  familyCtrl.$inject = ['$state', '$scope', 'Child', 'childFollowerSvc', 'userSvc', 'roleSvc', 'loggingService', '$ionicHistory', 'childSvc', '$ionicLoading', 'userDataSvc'];

  function familyCtrl($state, $scope, Child, childFollowerSvc, userSvc, roleSvc, loggingService, $ionicHistory, childSvc, $ionicLoading, userDataSvc) {
    var vm = this;
    vm.fromFollower = true;
    vm.child = Child;
    vm.setFollower = setFollower;
    vm.allFollowers = childFollowerSvc.bindFollowers(Child.$id);
    vm.getUserName = getUserName;
    vm.allRoles = [];
    $scope.role = 'mother';
    vm.member = "";
    vm.goBack = goBack;
    vm.addFamilyMember = addFamilyMember;

    activate();

    function activate() {
      initMember()
      roleSvc.getFamilyRoles().then(function(roleArr) {
        vm.allRoles = roleArr;
      }, function(err) {
        loggingService.showError("Roles not loaded", err, "familyCtrl", false);
      });
    }

    function setFollower(bool) {
      vm.fromFollower = bool;
      if (bool) {
        vm.member.name = "";
      } else {
        vm.member.userId = "";
      }
    }

    function getUserName(uid) {
      return userSvc.getFullName(uid);
    }

    function goBack() {
      $ionicHistory.goBack();
    }

    function addFamilyMember(form) {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
      if (vm.fromFollower) {
        vm.member.follower = true;
        vm.member.name = getUserName(userDataSvc.uid);
      } else {
        vm.member.follower = false;
        vm.member.userId = false;
      }
      if (form.$valid) {
        roleSvc.getRole(vm.member.role).then(function(r) {
          vm.member.roleName = r.nl;

          childSvc.addFamilyMember(Child.$id, vm.member).then(function(ref) {
            loggingService.showSuccess("Gezinslid toegevoegd", ref.key(), "familyCtrl", false);
            if (vm.member.follower) {
              var roleObj = {
                nl: r.nl,
                id: r.$id
              }
              userSvc.addFamily(userDataSvc.uid, Child.$id, roleObj).then(function(ref) {
                initMember();
                $state.go("child.profile", {
                  childId: Child.$id
                });
                $ionicLoading.hide();

              })
            } else {
              initMember();
              $state.go("child.profile", {
                childId: Child.$id
              });
              $ionicLoading.hide();
            }

          }, function(err) {
            initMember();
            loggingService.showError("Adding family member failed", err, "familyCtrl", false);
            goBack();
            $ionicLoading.hide();
          });
        }, function(err) {
          initMember();
          loggingService.showError("Adding family member failed", err, "familyCtrl", false);
          goBack();
          $ionicLoading.hide();
        });
      } else {
        initMember();
        $ionicLoading.hide();
        goBack();
      }

    }

    function initMember() {
      vm.member = {
        name: '',
        userId: '',
        role: '',
        work: '',
        phoneWork: '',
        extraInfo: ''
      };
    }
  }
})();
