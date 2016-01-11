(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('sleepCtrl', sleepCtrl);

  sleepCtrl.$inject = ['postSvc', 'userDataSvc', 'Child', 'childSvc', '$state', '$ionicLoading'];

  function sleepCtrl(postSvc, userDataSvc, Child, childSvc, $state, $ionicLoading) {
    var vm = this;

    vm.addSleep = addSleep;
    vm.error = "";
    vm.datetimeInput = true;
    activate();

    function activate() {
      vm.datetimeInput = checkInputType();
      initData();
    }

    function initData() {
      vm.sleepData = {
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        remark: "",
        startDateTime: "",
        endDateTime: ""
      }
    }

    function checkInputType() {
      try {
        var input = document.createElement("input");
        input.type = "datetime-local";

        if (input.type === "datetime-local") {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }

    function addSleep() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple"></ion-spinner>'
      });
      if (vm.sleepData.startDateTime && vm.sleepData.endDateTime) {
        var start = moment(vm.sleepData.startDateTime);
        var end = moment(vm.sleepData.endDateTime);
        var data = {
          dateTimeStartString: vm.sleepData.startDateTime.getTime(),
          dateTimeEndString: vm.sleepData.endDateTime.getTime(),
          duration: end.diff(start),
          dayOfYear: start.dayOfYear(),
          month: start.month(),
          weekOfYear: start.week(),
          remark: vm.sleepData.remark
        }
        console.log(start);
        console.log(end);
        console.log(data);
        if (start.isBefore(end)) {
          var title = Child.firstName + " was in dromenland!";
          childSvc.addSleepSession(Child.$id, data).then(function(res) {
            postSvc.postSleep(userDataSvc.uid, Child.$id, data, title).then(function(res) {
              initData();
              $state.go('child.posts');
              $ionicLoading.hide();
            }, function(err) {
              $ionicLoading.hide();
            });
          }, function(err) {
            $ionicLoading.hide();
          });
        } else {
          $ionicLoading.hide();
          vm.error = "Het tijdstip om te gaan slapen moet vroeger liggen dan het tijdstip om wakker te worden."
        }

      } else {
        console.log("not datetime-local");
        if (vm.sleepData.startDate && vm.sleepData.startTime && vm.sleepData.endDate && vm.sleepData.endTime) {
          var start = moment(vm.sleepData.startDateTime);
          var end = moment(vm.sleepData.endDateTime);
          var data = {
            timeStart: moment(vm.sleepData.startTime).format("HH:mm:ss"),
            dateStart: moment(vm.sleepData.startDateTime).format("YYYY/MM/DD"),
            timeEnd: moment(vm.sleepData.endDateTime).format("HH:mm:ss"),
            dateEnd: moment(vm.sleepData.endDateTime).format("YYYY/MM/DD"),
            timeDifference: start.diff(end)
          }
          if (start.isBefore(end)) {
            var title = Child.firstName + " was in dromenland!";
            childSvc.postSleepSession(Child.$id, data).then(function(res) {
              postSvc.postSleep(userDataSvc.uid, Child.$id, data, title).then(function(res) {
                initData();
                $state.go('child.posts');
                $ionicLoading.hide();
              }, function(err) {
                $ionicLoading.hide();

              });
            }, function(err) {
              $ionicLoading.hide();

            });
          } else {
            vm.error = "Het tijdstip om te gaan slapen moet vroeger liggen dan het tijdstip om wakker te worden."
            $ionicLoading.hide();

          }
        } else {
          vm.error = "Niet alle velden zijn ingevuld";
          $ionicLoading.hide();
        }
      }
    }
  }
})();
