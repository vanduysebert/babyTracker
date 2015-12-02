(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('emergencyCtrl', emergencyCtrl);

  emergencyCtrl.$inject = ['$scope', 'Child', 'userDataSvc', 'childSvc', 'roleSvc', 'childFollowerSvc', '$ionicModal', 'userSvc', 'loggingService', 'config'];

  function emergencyCtrl($scope, Child, userDataSvc, childSvc, roleSvc, childFollowerSvc, $ionicModal, userSvc, loggingService, config) {
    var vm = this;
    vm.child = Child;
    vm.checkAdmin = checkAdmin;
    vm.emergencyNumbers = childSvc.bindEmergencyNumbers(Child.$id);
    vm.addEmergency = addEmergency;
    vm.removeEmergency = removeEmergency;
    vm.allFollowers = childFollowerSvc.bindFollowers(Child.$id);
    vm.allRoles = [];
    vm.emergencyNumbersHard = config.emergencyNumbers;
    vm.getRole = getRole;
    activate();

    function activate() {
      roleSvc.getAllRoles().then(function(roles) {
        vm.allRoles = roles;
      });
    }

    function checkAdmin() {
      if (Child.administrator === userDataSvc.uid) {
        return true;
      } else {
        return false;
      }
    }

    function addEmergency() {
      $ionicModal.fromTemplateUrl('templates/modals/newEmergency.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });

      $scope.child = vm.child;
      $scope.allRoles = vm.allRoles;
      $scope.allFollowers = vm.allFollowers;
      $scope.contact = {
        name: "",
        userId: "",
        phone: "",
        role: "mother"
      }
      $scope.fromFollower = true;
      $scope.errMess = "";

      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      $scope.getUserName = function(uid) {
        return userSvc.getFullName(uid);
      };


      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

      $scope.addEmergencyNumber = function() {
        roleSvc.getRole($scope.contact.role).then(function(r) {
          $scope.contact.roleName = r.nl;
          if ($scope.contact.userId) {
            $scope.contact.name = userSvc.getFullName($scope.contact.userId);
            userSvc.getUserProfile($scope.contact.userId).then(function(user) {
              $scope.contact.profileImage = user.profileImage;
              $scope.contact.photoInDatabase = user.photoInDatabase;
              childSvc.addEmergencyNumber($scope.child.$id, $scope.contact).then(function(ref) {
                loggingService.showSuccess("Noodnummer toegevoegd", "phonenumber added", "emergencyNumbers", false);
                $scope.modal.hide();
              }, function(err) {
                loggingService.showError("Adding phonenumber failed", err, "emergencyNumbers", false);
              });
            });

          } else {
            childSvc.addEmergencyNumber(Child.$id, $scope.contact).then(function(ref) {
              loggingService.showSuccess("Noodnummer toegevoegd", "phonenumber added", "emergencyNumbers", false);
              $scope.modal.hide();
            }, function(err) {
              $scope.modal.hide();
              loggingService.showError("Adding phonenumber failed", err, "emergencyNumbers", false);
            });
          }
        });
      }
    }

    function removeEmergency(index) {
      childSvc.removeEmergency(Child.$id, index).then(function(ref) {
        loggingService.showSuccess("Emergency removed", ref.key(), "emergencyNumbers", false);
      }, function(err) {
        loggingService.showError("Removing emergency number failed", err, "emergencyNumbers", false);
      });
    }

    function getRole(role) {
      return roleSvc.bindRole(role);
    }

  }
})();
