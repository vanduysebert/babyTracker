(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('postReactionCtrl', postReactionCtrl);

    postReactionCtrl.$inject = ['postSvc', '$stateParams', 'Child', 'userDataSvc'];

    function postReactionCtrl(postSvc, $stateParams, Child, userDataSvc) {
        var vm = this;
        vm.post = postSvc.getPost($stateParams.postId, Child.$id);
        vm.reaction = "";
        vm.reactions = postSvc.bindReactions(vm.post, Child.$id);
        vm.postReaction = postReaction;
        activate();

        function activate() {
            postSvc.getReactions(vm.post, Child.$id).then(function(res) {
                console.log(res);
            })
        }

        function postReaction() {
            postSvc.addReaction(vm.post, userDataSvc.uid, vm.reaction, Child.$id).then(function(res) {
                vm.reaction = "";
            });
        }
    }
})();
