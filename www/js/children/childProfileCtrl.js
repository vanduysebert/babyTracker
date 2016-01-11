(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('childProfileCtrl', childProfileCtrl);

  childProfileCtrl.$inject = ['$state', '$scope', 'Child', 'userDataSvc', 'childSvc', 'childFollowerSvc', '$ionicSlideBoxDelegate', '$ionicModal', 'roleSvc', 'loggingService', 'userSvc', '$ionicLoading', "$cordovaCamera", '$ionicActionSheet', '$timeout', '$ionicPopup', 'userFollowerSvc'];

  function childProfileCtrl($state, $scope, Child, userDataSvc, childSvc, childFollowerSvc, $ionicSlideBoxDelegate, $ionicModal, roleSvc, loggingService, userSvc, $ionicLoading, $cordovaCamera, $ionicActionSheet, $timeout, $ionicPopup, userFollowerSvc) {
    var vm = this;
    vm.child = Child;
    vm.checkAdmin = checkAdmin;
    vm.updateChild = updateChild;
    vm.birthDate = "";
    vm.getSlideIndex = getSlideIndex;
    vm.write = false;
    vm.goToSlide = goToSlide;
    vm.goToEmergency = goToEmergency;
    vm.hasFollower = false;

    vm.inviteChild = inviteChild;
    vm.unInviteChild = unInviteChild;
    vm.requestSend = false;

    vm.showGeneral = true;

    vm.showAll = true;
    vm.showFamily = true;
    vm.showAddress = true;
    vm.showPets = true;
    vm.showAllergic = true;
    vm.showHealthIssue = true;
    vm.showDrug = true;
    vm.setShowAll = setShowAll;

    vm.allFamilyMembers = childSvc.bindFamilyMembers(Child.$id);
    vm.staticFamilyMembers = [];
    vm.userFamilyMembers = [];
    vm.removeUserFamilyMember = removeUserFamilyMember;
    vm.removeStaticFamilyMember = removeStaticFamilyMember;
    vm.userFamilyMembersRef = childSvc.userFamilyMembersRef(Child.$id);

    vm.addPet = addPet;
    vm.pets = childSvc.bindPets(Child.$id);
    vm.removePet = removePet;
    vm.newPet = false;

    vm.addAllergic = addAllergic;
    vm.allergics = childSvc.bindAllergics(Child.$id);
    vm.removeAllergic = removeAllergic;
    vm.newAllergic = false;

    vm.foodAllergics = childSvc.bindFoodAllergics(Child.$id);
    vm.removeFoodAllergic = removeFoodAllergic;

    vm.addHealthIssue = addHealthIssue;
    vm.healthIssues = childSvc.bindHealthIssues(Child.$id);
    vm.removeHealthIssue = removeHealthIssue;
    vm.newHealthIssue = false;

    vm.addDrug = addDrug;
    vm.drugs = childSvc.bindDrugs(Child.$id);
    vm.removeDrug = removeDrug;
    vm.newDrug = false;

    vm.choosePhotoInput = choosePhotoInput;
    vm.allRoles = roleSvc.bindAllRoles;
    activate();

    function activate() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });

      childSvc.getStaticFamilyMembers(Child.$id).then(function(arr) {
        vm.staticFamilyMembers = arr;
      });

      userFollowerSvc.isInvited(Child.$id, userDataSvc.uid).then(function(res) {
        console.log(res);
        if(res) {
          console.log(res);
          vm.requestSend = true;
        } else {
          vm.requestSend = false;
        }
      });

      childFollowerSvc.hasFollower(userDataSvc.uid, vm.child).then(function(check) {

        vm.hasFollower = check;
      }, function(err) {
        loggingService.showError("Checking follower failed", err, "childProfile", false);
      });
      if (vm.child.birthDateTime) {
        vm.birthDate = new Date(vm.child.birthDateTime);
      }
      $ionicLoading.hide();
    }

    vm.userFamilyMembersRef.on('child_added', function(newMember, oldMemberKey) {
      var fam = newMember.val();
      userSvc.getUserProfile(fam.userId).then(function(u) {
        fam.profileImage = u.profileImage;
        fam.photoInDatabase = u.photoInDatabase;
        vm.userFamilyMembers.push(fam);
      }, function(err) {
        loggingService.showError("Loading userprofile failed", err, "childProfile", false);
      });
    });

    function checkAdmin() {
      if (userDataSvc.uid === Child.administrator) {
        return true;
      } else {
        return false;
      }
    }

    function checkFollower() {
      return vm.hasFollower;
    }

    function updateChild(form) {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
      if (form.$valid) {
        if (vm.birthDate) {
          vm.child.birthDateTime = vm.birthDate.getTime();
          vm.child.birthDateString = moment(vm.birthDate).format("DD-MM-YYYY");
        }
        childSvc.updateChild(vm.child.$id, vm.child).then(function(ref) {
          vm.write = false;
          form.$setPristine();
          $ionicLoading.hide();
        }, function(err) {
          $ionicLoading.hide();
          vm.write = false;
          loggingService.showError("Aanpassing mislukt.", "Edit child failed" + err, "updateUserProfile", true);
        });
      } else {
        vm.write = false;
        loggingService.showError("Ongeldig formulier", "Invalid form", "updateUserProfile", true);
        $ionicLoading.hide();
      }
    }

    function choosePhotoInput() {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'Maak foto'
        }, {
          text: 'Kies foto'
        }],
        titleText: 'Profielfoto wijzigen',
        cancelText: 'Annuleer',
        cancel: function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          if(index == 0) {
            var sourceType = Camera.PictureSourceType.CAMERA;
            uploadProfilePicture(sourceType);
          } else if(index == 1) {
            var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            uploadProfilePicture(sourceType);
          }
          return true;
        }
      });
    };

    function uploadProfilePicture(sourceType) {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      }
      $cordovaCamera.getPicture(options).then(function(imageData) {
        vm.child.profileImage = imageData;
        vm.child.photoInDatabase = true;
        childSvc.updateChild(vm.child.$id, vm.child).then(function(ref) {
          loggingService.showSuccess("Picture saved to database", ref.key(), vm.mod, false);
        }, function(err) {
          loggingService.showError("Error saving picture", error, "savePicture", false);
          vm.errorMessage = "Foto uploaden mislukt. Probeer het opnieuw of contacteer de beheerder.";
        });
      }, function(error) {
        loggingService.showError("Upload picture failed", error, "upload picture", false);
      });
    }


    function goToSlide(index) {
      $ionicSlideBoxDelegate.slide(index);
    }

    function getSlideIndex() {
      return $ionicSlideBoxDelegate.currentIndex();
    }

    function goToEmergency() {
      $state.go('child.emergencyNumbers');
    }

    function removeUserFamilyMember(index) {
      childSvc.removeUserFamilyMember(Child.$id, index).then(function(ref) {
        userSvc.removeFamily(userDataSvc.uid, Child.$id);
        loggingService.showSuccess("Member removed", null, "childProfile", false);
        initUserFamilyMembers();
      });
    }

    function removeStaticFamilyMember(index) {
      childSvc.removeStaticFamilyMember(Child.$id, index).then(function(ref) {
        loggingService.showSuccess("Member removed", null, "childProfile", false);
      });
    }

    function initUserFamilyMembers() {
      vm.userFamilyMembers = [];
      childSvc.getUserFamilyMembers(Child.$id).then(function(arr) {
        angular.forEach(arr, function(fam) {
          userSvc.getUserProfile(fam.userId).then(function(u) {
            fam.profileImage = u.profileImage;
            fam.photoInDatabase = u.photoInDatabase;
            vm.userFamilyMembers.push(fam);
          }, function(err) {
            vm.userFamilyMembers.push(fam);
          });
        });
      });
    }

    function addPet(form) {
      if (form.$valid) {
        childSvc.addPet(Child.$id, vm.pet).then(function(ref) {
          initPet();
          vm.newPet = false;
          loggingService.showSuccess("Huisdier toegevoegd", ref.key(), "childProfile", false);
        })
      }

    }

    function removePet(pet) {
      childSvc.removePet(Child.$id, pet);
    }

    function initAllergic() {
      vm.allergic = {
        name: ""
      }
    }

    function initPet() {
      vm.pet = {
        type: '',
        name: ''
      }
    }

    function initHealthIssue() {
      vm.healthIssue = {
        name: '',
        desc: ''
      }
    }

    function initDrug() {
      vm.drug = {
        name: '',
        periodic: '',
        desc: ''
      }
    }

    function addAllergic(form) {
      if (form.$valid) {
        childSvc.addAllergic(Child.$id, vm.allergic).then(function(ref) {
          initAllergic();
          vm.newAllergic = false;
          loggingService.showSuccess("Allergie toegevoegd", ref.key(), "childProfile", false);
        });
      }

    }

    function removeAllergic(allId) {
      childSvc.removeAllergic(Child.$id, allId);
    }

    function addHealthIssue(form) {
      if (form.$valid) {
        childSvc.addHealthIssue(Child.$id, vm.healthIssue).then(function(ref) {
          initHealthIssue();
          vm.newHealthIssue = false;
          loggingService.showSuccess("Probleem toegevoegd", ref.key(), "childProfile", false);
        })
      }
    }

    function removeHealthIssue(issueId) {
      childSvc.removeHealthIssue(Child.$id, issueId);
    }

    function removeFoodAllergic(allId) {
      childSvc.deleteFoodAllergic(Child.$id, allId);
    }

    function addDrug(form) {
      if (form.$valid) {
        childSvc.addDrug(Child.$id, vm.drug).then(function(ref) {
          initDrug();
          vm.newDrug = false;
          loggingService.showSuccess("Medicijn toegevoegd", ref.key(), "childProfile", false);
        })
      }

    }

    function removeDrug(issueId) {
      childSvc.removeDrug(Child.$id, issueId);
    }

    function setShowAll() {
      if (vm.showAll) {
        vm.showFamily = true;
        vm.showAddress = true;
        vm.showPets = true;
        vm.showAllergic = true;
        vm.showHealthIssue = true;
        vm.showDrug = true;
      } else {
        vm.showFamily = false;
        vm.showAddress = false;
        vm.showPets = false;
        vm.showAllergic = false;
        vm.showHealthIssue = false;
        vm.showDrug = false;
      }
    }

    function inviteChild() {
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
          userFollowerSvc.addUserInvite(userDataSvc.uid,vm.child.$id, res).then(function(result) {
            vm.requestSend = true;
            loggingService.showSuccess("Verzoek verstuurd", "Request sent", "linkUser", true);
          }, function(err) {
            loggingService.showError("Verzoek kon niet worden voltooid", err, "linkUser", true);
          });
        } else {
          loggingService.showError("Geen relatie geselecteerd", "No role selected", "linkUser", false);
        }

      });
    }

    function unInviteChild() {
      var id = vm.child.$id;
      userFollowerSvc.unInviteChild(userDataSvc.uid, id).then(function(res) {
        vm.requestSend = false;
      }, function(err) {

      });
    }

  }
})();
