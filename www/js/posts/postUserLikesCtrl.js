(function() {
    'use strict';

    angular
        .module('babyTracker')
        .controller('postUserLikesCtrl', postUserLikesCtrl);

    postUserLikesCtrl.$inject = ['postSvc', '$stateParams', 'Child', 'userDataSvc'];

    function postUserLikesCtrl(postSvc, $stateParams, Child, userDataSvc) {
        var vm = this;
        vm.post = postSvc.getPost($stateParams.postId, Child.$id);
        vm.followers = postSvc.getLikes($stateParams.postId, Child.$id);
        vm.user = userDataSvc;
        activate();

        function activate() {

        }
    }
})();
