(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', '$scope', 'userDataSvc', 'loggingService', 'childSvc', 'childFollowerSvc', 'roleSvc', 'measurementSvc', '$q', '$ionicPopup'];

  function registerCtrl($state, $scope, userDataSvc, loggingService, childSvc, childFollowerSvc, roleSvc, measurementSvc, $q, $ionicPopup) {
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
      birthHeadWidth: '',
      gender: 'male',
      address: '',
      postalCode: '',
      city: '',
      unseenRequests: 0
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
    }

    function registerChild(form) {
      if (form.$valid) {
        vm.child.administrator = userDataSvc.uid;
        if (vm.birthDate) {
          vm.child.birthDateTime = vm.birthDate.getTime();
          vm.child.birthDateString = moment(vm.birthDate).format("DD-MM-YYYY");
        }
        if (vm.child.gender === 'male') {
          vm.child.profileImage = 'img/babyProfileBoy.png';
        } else {
          vm.child.profileImage = 'img/babyProfileGirl.png';
        }
        if (vm.child.birthWeight && vm.child.birthLength && vm.child.birthHeadWidth) {
          childSvc.addChild(vm.child).then(function(ref) {
            loggingService.showSuccess("Nieuw kind geregistreerd.", ref.key(), "registerChild", true);
            vm.childId = ref.key();
            childFollowerSvc.addFollower(vm.childId, userDataSvc.uid, vm.linkRelationship, true).then(function(childId) {
              loggingService.showSuccess("User linked with child", childId, vm.mod, false);
              addMeasurements(vm.childId).then(function(re) {
                $state.go("app.registerPhoto", {
                  childId: vm.childId
                });
              }, function(err) {
                loggingService.showError("Er is een fout gebeurd bij het opslaan van de metingen van het kind. Probeer deze later opnieuw in te geven.", err, vm.mod, true);
                $state.go("app.registerPhoto", {
                  childId: vm.childId
                });
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
          var confirmPopup = $ionicPopup.confirm({
            title: 'Geen metingen genoteerd',
            template: 'Je hebt geen gewicht, lengte en/of hoofdomtrek ingegeven. Hierdoor kan deze data niet worden bijgehouden en vergeleken worden met de groeicurves.',
            cancelText: 'Ik wil deze wel invullen',
            cancelType: 'button-assertive',
            okText: 'Geen probleem, ik kan deze ook later invullen',
            okType: 'button-balanced'
          });

          confirmPopup.then(function(res) {
            if (res) {
              childSvc.addChild(vm.child).then(function(ref) {
                loggingService.showSuccess("Nieuw kind geregistreerd.", ref.key(), "registerChild", false);
                vm.childId = ref.key();
                childFollowerSvc.addFollower(vm.childId, userDataSvc.uid, vm.linkRelationship, true).then(function(childId) {
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
            }
          });
        }

      } else {
        loggingService.showError("form invalid", form, vm.mod, false);
      }
    }

    function addMeasurements(id) {
      var deferred = $q.defer();
      measurementSvc.addHeight(id, vm.child.birthLength, vm.birthDate.getTime()).then(function(res) {
        measurementSvc.addWeight(id, vm.child.birthWeight, vm.birthDate.getTime()).then(function(re) {
          measurementSvc.addHeadWidth(id, vm.child.birthHeadWidth, vm.birthDate.getTime()).then(function(r) {
            deferred.resolve(true);
          }, function(err) {
            deffered.reject(err);
          })
        }, function(err) {
          deffered.reject(err);
        })
      }, function(err) {
        deffered.reject(err);
      })
      return deferred.promise;
    }




  }
})();
