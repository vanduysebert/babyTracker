(function() {
  'use strict';

  angular
    .module('babyTracker')
    .controller('sleepCtrl', sleepCtrl);

  sleepCtrl.$inject = ['postSvc', 'userDataSvc', 'Child', 'childSvc'];

  function sleepCtrl(postSvc, userDataSvc, Child, childSvc) {
    var vm = this;
    vm.sleepData = {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      remark: "",
      startDateTime: "",
      endDateTime: ""
    }

    vm.addSleep = addSleep;
    vm.error = "";
    vm.datetimeInput = true;
    activate();

    function activate() {
      vm.datetimeInput = checkInputType();

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
      console.log("1");
      if (vm.sleepData.startDateTime && vm.sleepData.endDateTime) {
        var start = moment(vm.sleepData.startDateTime);
        var end = moment(vm.sleepData.endDateTime);
        var data = {
          dateTimeStartString: vm.sleepData.startDateTime.getTime(),
          dateTimeEndString: vm.sleepData.endDateTime.getTime(),
          duration: end.diff(start),
          dayOfYear: start.dayOfYear(),
          month: start.month(),
          weekOfYear: start.week();
          remark: vm.sleepData.remark
        }
        if (start.isBefore(end)) {
          console.log("data");
          console.log(data);

          var title = Child.firstName + " was in dromenland!";
          childSvc.addSleepSession(Child.$id, data).then(function(res) {
            postSvc.postSleep(userDataSvc.uid, Child.$id, data, title).then(function(res) {

            }, function(err) {

            });
          }, function(err) {

          });
        } else {
          console.log("not before");
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
            console.log("data");
            console.log(data);
            var title = Child.firstName + " was in dromenland!";
            childSvc.postSleepSession(Child.$id, data).then(function(res) {
              postSvc.postSleep(userDataSvc.uid, Child.$id, data, title).then(function(res) {

              }, function(err) {

              });
            }, function(err) {

            });
          } else {
            vm.error = "Het tijdstip om te gaan slapen moet vroeger liggen dan het tijdstip om wakker te worden."
          }
        } else {
          console.log("error");
          vm.error = "Niet alle velden zijn ingevuld";
        }
      }
    }
  }
})();
