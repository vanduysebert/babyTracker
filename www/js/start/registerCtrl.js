(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', '$scope', 'userDataSvc', 'loggingService', 'childSvc', 'childFollowerSvc', 'roleSvc'];

  function registerCtrl($state, $scope, userDataSvc, loggingService, childSvc, childFollowerSvc, roleSvc) {
    /**
     * Variables
     */
    var vm = this;
    vm.mod = "register child";
    vm.defaultPicture = 'img/babyProfileBoy.png';
    vm.child = {
      firstName: '',
      lastName: '',
      birthDateString: '',
      birthDateTime: '',
      birthPlace: '',
      birthLength: '',
      birthWeight: '',
      gender: 'male',
      address: '',
      postalCode: '',
      city: ''
    };

    vm.birthDate = "";
    vm.errorMessage = '';
    vm.allRoles = [];
    vm.linkRelationship = "";

    /**
     * Step 1
     */
    vm.registerChild = registerChild;
    vm.childId = "";

    /**
     * Step 2
     */
    /*vm.newPhoto = false;
    vm.savePicture64 = null;
    vm.uploadProfilePicture = uploadProfilePicture;
    vm.choosePhotoInput = choosePhotoInput;
    vm.saveToDatabase = saveToDatabase;*/

    /**
     * Step 3
     */
    /*vm.searchInput = '';
    vm.usersFound = [];
    vm.usersLinked = childFollowerSvc.getFollowers(vm.childId);
    vm.isSearching = false;
    vm.findUser = findUser;
    vm.searchUserLinks = searchUserLinks;
    vm.isLinking = false;
    vm.linkUser = linkUser;*/

    activate();

    function activate() {
      if (userDataSvc.gender === 'male') {
        vm.linkRelationship = 'father';
      } else {
        vm.linkRelationship = 'mother';
      }
      roleSvc.getAllRoles().then(function(roles) {
        vm.allRoles = roles;
      });
      /*childFollowerSvc.getFollowers(vm.childId).then(function(arr) {
        vm.usersLinked = arr;
        console.log(vm.usersLinked);
        vm.registered = true;
      });*/
    }

    function registerChild(form) {
      if (form.$valid) {
        vm.child.administrator = userDataSvc.uid;
        console.log(vm.birthDate);
        if (vm.birthDate) {
          vm.child.birthDateTime = vm.birthDate.getTime();
          vm.child.birthDateString = moment(vm.birthDate).format("DD-MM-YYYY");
        }
        if (vm.child.gender === 'male') {
          vm.child.profileImage = 'img/babyProfileBoy.png';
        } else {
          vm.child.profileImage = 'img/babyProfileGirl.png';
        }
        childSvc.addChild(vm.child).then(function(ref) {
          loggingService.showSuccess("Nieuw kind geregistreerd.", ref.key(), "registerChild", false);
          vm.childId = ref.key();
          childFollowerSvc.addFollower(vm.childId, userDataSvc.uid, vm.linkRelationship).then(function(childId) {
            loggingService.showSuccess("User linked with child", childId, vm.mod, false);
            $state.go("app.registerPhoto", {
              childId: vm.childId
            });
          }, function(err) {
            loggingService.showError("User linked failed", err, vm.mod, false);
            vm.errorMessage = "Registratie is niet gelukt. Gebruiker niet kunnen linken met het kind. Probeer het opnieuw of contacteer de beheerder.";
          });

        }, function(err) {
          loggingService.showError("Register child failed", err, vm.mod, false);
          vm.errorMessage = "Registratie is niet gelukt. Probeer het opnieuw of contacteer de beheerder.";
        });
      } else {
        loggingService.showError("form invalid", form, vm.mod, false);
      }
    }





  }
})();
