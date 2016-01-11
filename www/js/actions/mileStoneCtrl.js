(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('mileStoneCtrl', mileStoneCtrl);

    mileStoneCtrl.$inject = ['actionSvc', 'milestoneSvc', 'Child', 'postSvc', 'userDataSvc', 'loggingService', '$ionicScrollDelegate'];

    function mileStoneCtrl(actionSvc, milestoneSvc, Child, postSvc, userDataSvc, loggingService, $ionicScrollDelegate) {

        var vm = this;
        vm.resizeWindow = resizeWindow;
        vm.showSenses6 = false;
        vm.showSocial6 = false;
        vm.showFood6 = false;

        vm.showSenses9 = false;
        vm.showSocial9 = false;
        vm.showFood9 = false;

        vm.showSenses12 = false;
        vm.showSocial12 = false;
        vm.showFood12 = false;

        vm.showSenses18 = false;
        vm.showSocial18 = false;
        vm.showFood18 = false;

        vm.allMilestones6 = milestoneSvc.bindAllMilestones6();
        vm.allMilestones9 = milestoneSvc.bindAllMilestones9();
        vm.allMilestones12 = milestoneSvc.bindAllMilestones12();
        vm.allMilestones18 = milestoneSvc.bindAllMilestones18();

        vm.sensesMilestones6 = milestoneSvc.bindSensesMilestones6();
        vm.sensesMilestones9 = milestoneSvc.bindSensesMilestones9();
        vm.sensesMilestones12 = milestoneSvc.bindSensesMilestones12();
        vm.sensesMilestones18 = milestoneSvc.bindSensesMilestones18();

        vm.socialMilestones6 = milestoneSvc.bindSocialMilestones6();
        vm.socialMilestones9 = milestoneSvc.bindSocialMilestones9();
        vm.socialMilestones12 = milestoneSvc.bindSocialMilestones12();
        vm.socialMilestones18 = milestoneSvc.bindSocialMilestones18();

        vm.foodMilestones6 = milestoneSvc.bindFoodMilestones6();
        vm.foodMilestones9 = milestoneSvc.bindFoodMilestones9();
        vm.foodMilestones12 = milestoneSvc.bindFoodMilestones12();
        vm.foodMilestones18 = milestoneSvc.bindFoodMilestones18();

        vm.setSenses6 = setSenses6;
        vm.setSenses9 = setSenses9;
        vm.setSenses12 = setSenses12;
        vm.setSenses18 = setSenses18;

        vm.setSocial6 = setSocial6;
        vm.setSocial9 = setSocial9;
        vm.setSocial12 = setSocial12;
        vm.setSocial18 = setSocial18;

        vm.setFood6 = setFood6;
        vm.setFood9 = setFood9;
        vm.setFood12 = setFood12;
        vm.setFood18 = setFood18;

        vm.child = Child;

        vm.changeStone = changeStone;


        activate();

        function activate() {
            vm.showSenses1 = false;
            milestoneSvc.getSensesMilestones6().then(function(arr) {
                console.log(arr);
            })
        }

        function resizeWindow() {
            $ionicScrollDelegate.resize();
        }

        function setAllShowFalse() {
            vm.showSenses6 = false;
            vm.showSocial6 = false;
            vm.showFood6 = false;

            vm.showSenses9 = false;
            vm.showSocial9 = false;
            vm.showFood9 = false;

            vm.showSenses12 = false;
            vm.showSocial12 = false;
            vm.showFood12 = false;

            vm.showSenses18 = false;
            vm.showSocial18 = false;
            vm.showFood18 = false;
        }

        function setSenses6() {
            vm.showSocial6 = false;
            vm.showFood6 = false;
            vm.showSenses6 = !vm.showSenses6;
        }

        function setFood6() {
            vm.showSocial6 = false;
            vm.showFood6 = !vm.showFood6;
            vm.showSenses6 = false;
        }

        function setSocial6() {
            vm.showSocial6 = !vm.showSocial6;
            vm.showFood6 = false;
            vm.showSenses6 = false;
        }

        function setSenses9() {
            vm.showSocial9 = false;
            vm.showFood9 = false;
            vm.showSenses9 = !vm.showSenses9;
        }

        function setFood9() {
            vm.showSocial9 = false;
            vm.showFood9 = !vm.showFood9;
            vm.showSenses9 = false;
        }

        function setSocial9() {
            vm.showSocial9 = !vm.showSocial9;
            vm.showFood9 = false;
            vm.showSenses9 = false;
        }

        function setSenses12() {
            vm.showSocial12 = false;
            vm.showFood12 = false;
            vm.showSenses12 = !vm.showSenses12;
        }

        function setFood12() {
            vm.showSocial12 = false;
            vm.showFood12 = !vm.showFood12;
            vm.showSenses12 = false;
        }

        function setSocial12() {
            vm.showSocial12 = !vm.showSocial12;
            vm.showFood12 = false;
            vm.showSenses12 = false;
        }

        function setSenses18() {
            vm.showSocial18 = false;
            vm.showFood18 = false;
            vm.showSenses18 = !vm.showSenses18;
        }

        function setFood18() {
            vm.showSocial18 = false;
            vm.showFood18 = !vm.showFood18;
            vm.showSenses18 = false;
        }

        function setSocial18() {
            vm.showSocial18 = !vm.showSocial18;
            vm.showFood18 = false;
            vm.showSenses18 = false;
        }

        function changeStone(stone, arr) {
            var mess = stone.nl;
            var title = Child.firstName + " heeft een mijlpaal bereikt!"

            if(stone.children[vm.child.$id].val) {
                postSvc.postMilestone(userDataSvc.uid, Child.$id, mess, title).then(function(r) {
                    loggingService.showSuccess("Mijlpaal toegevoegd aan tijdlijn", "milestone added", "mileStoneCtrl", false);
                    stone.postId = r.key();
                    stone.children[vm.child.$id].dateCreated = Firebase.ServerValue.TIMESTAMP;

                    console.log("stone", stone);
                    arr.$save(stone).then(function(res) {
                        console.log(res);
                    }, function(err) {
                        loggingService.showError("update milestone failed", err, "mileStoneCtrl", false);
                    });
                }, function(err) {
                    loggingService.showError("Milestone added to timeline failed", err, "mileStoneCtrl", false);

                })
            } else {
                stone.children[vm.child.$id].dateCreated = false;
                arr.$save(stone).then(function(res) {

                }, function(err) {
                    loggingService.showError("update milestone failed", err, "mileStoneCtrl", false);
                });
            }


        }
    }
})();
