angular.module('babyTracker', ['ionic', 'firebase', 'ngMessages', 'ngCordova', 'angularMoment', 'ngIOS9UIWebViewPatch'])

.run(function($ionicPlatform, $rootScope, $location, Auth, userSvc, amMoment) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    };

    $rootScope.$on('stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      if (error === "AUTH_REQUIRED") {
        $location.path('/login');
      }
      console.log("state", error);
    });

    amMoment.changeLocale('nl');
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/auth/login.html',
      controller: 'loginCtrl',
      controllerAs: 'login'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/auth/signup.html',
      controller: 'signupCtrl',
      controllerAs: 'signup'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'appCtrl',
      controllerAs: 'app',
      resolve: {
        authentication: authentication,
        userDataSvc: userDataSvc
      }
    })

  //Register page of new children
  .state('app.start', {
    url: '/start',
    views: {
      'menuContent': {
        templateUrl: 'templates/start/start.html',
        controller: 'startCtrl',
        controllerAs: 'start'
      }
    }
  })

  //userProfile
  .state('app.userProfile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/auth/userProfile.html',
        controller: 'userProfileCtrl',
        controllerAs: 'profile',
        resolve: {
          fullName: fullName,
          userProfile: userProfile
        }
      }
    }
  })

  //userProfile
  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })

  //Go to search view
  .state('app.search', {
    url: '/search/children',
    views: {
      'menuContent': {
        templateUrl: 'templates/search/searchChildren.html',
        controller: 'searchCtrl',
        controllerAs: 'search'
      }
    }
  })

  //Go to search view
  .state('app.searchusers', {
    url: '/search/users',
    views: {
      'menuContent': {
        templateUrl: 'templates/search/searchUsers.html',
        controller: 'searchUserCtrl',
        controllerAs: 'search'
      }
    }
  })

  //Go to search view
  .state('app.registerchild', {
    url: '/registerchild',
    views: {
      'menuContent': {
        templateUrl: 'templates/children/register.html',
        controller: 'registerCtrl',
        controllerAs: 'register'
      }
    }
  })

  //Go to search view
  .state('app.registerPhoto', {
    url: '/registerchild/:childId',
    views: {
      'menuContent': {
        templateUrl: 'templates/children/registerPhoto.html',
        controller: 'registerPhotoCtrl',
        controllerAs: 'photo',
        resolve: {
          Child: Child
        }
      }
    }
  })

  .state('app.summaryStart', {
    url: '/startSummary',
    views: {
      'menuContent': {
        templateUrl: 'templates/summaryStart.html',
        controller: 'summaryCtrl',
        controllerAs: 'sum',
        resolve: {
          Children: Children
        }
      }
    }
  })

  .state('app.requests', {
    url: '/requests',
    views: {
      'menuContent': {
        templateUrl: 'templates/users/requests.html',
        controller: 'requestCtrl',
        controllerAs: 'req',
      }
    }
  })

  .state('app.messages', {
    url: '/messages',
    views: {
      'menuContent': {
        templateUrl: 'templates/messages/messages.html',
        controller: 'messageCtrl',
        controllerAs: 'mes',
      }
    }
  })

  .state('app.messageDetail', {
    url: '/messages/:messageId',
    views: {
      'menuContent': {
        templateUrl: 'templates/messages/messageDetail.html',
        controller: 'messageDetailCtrl',
        controllerAs: 'mesDet',
      }
    }
  })

  .state('app.messageNew', {
    url: '/messages/new',
    views: {
      'menuContent': {
        templateUrl: 'templates/messages/messageNew.html',
        controller: 'messageNewCtrl',
        controllerAs: 'mesNew',
      }
    }
  })

  .state('child', {
    url: '/:childId',
    templateUrl: 'templates/children/child-abstract.html',
    abstract: true,
    controller: 'childCtrl',
    controllerAs: 'ch',
    resolve: {
      Child: Child,
      authentication: authentication,
      userDataSvc: userDataSvc
    }
  })

  //Main page of child
  .state('child.profile', {
    url: '/profile',
    views: {
      'childSection': {
        templateUrl: 'templates/children/profile.html',
        controller: 'childProfileCtrl',
        controllerAs: 'child'

      }
    }
  })

  //Main page of child
  .state('child.emergencyNumbers', {
    url: '/emergency',
    views: {
      'childSection': {
        templateUrl: 'templates/children/emergency.html',
        controller: 'emergencyCtrl',
        controllerAs: 'emergency',
        resolve: {
          Child: Child
        }
      }
    }
  })

  //Main page of child
  .state('child.family', {
    url: '/family',
    views: {
      'childSection': {
        templateUrl: 'templates/children/family.html',
        controller: 'familyCtrl',
        controllerAs: 'family'
      }
    }
  })

  //Go to search view
  .state('child.followers', {
    url: '/followers',
    views: {
      'childSection': {
        templateUrl: 'templates/followers/followers.html',
        controller: 'followerCtrl',
        controllerAs: 'follow',
      }
    }
  })

  //Go to search view
  .state('child.linkUser', {
    url: '/linkUser',
    views: {
      'childSection': {
        templateUrl: 'templates/followers/linkUser.html',
        controller: 'linkUserCtrl',
        controllerAs: 'link',
      }
    }
  })

  //Main page of child
  .state('child.posts', {
    url: '/posts',
    views: {
      'childSection': {
        templateUrl: 'templates/posts/posts.html'
      }
    }
  })

  //Main page of child
  .state('child.actions', {
      url: '/action',
      views: {
        'childSection': {
          templateUrl: 'templates/actions/action.html'
        }
      }
    })
    //Delete when ready
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    });

  authentication.$inject = ['Auth'];

  function authentication(Auth) {
    return Auth.$requireAuth();
  }

  userDataSvc.$inject = ['userSvc'];

  function userDataSvc(userSvc) {
    return userSvc.getLoggedInUser();
  }

  fullName.$inject = ['Auth', 'userSvc'];

  function fullName(Auth, userSvc) {
    var authData = Auth.$getAuth();
    return userSvc.getFullName(authData.uid);
  }

  userProfile.$inject = ['Auth', 'userSvc'];

  function userProfile(Auth, userSvc) {
    var authData = Auth.$getAuth();
    return userSvc.getUserProfile(authData.uid);
  }

  Child.$inject = ['$stateParams', 'childSvc']

  function Child($stateParams, childSvc) {
    return childSvc.getChild($stateParams.childId);
  }

  Children.$inject = ['Auth', 'userSvc']

  function Children(Auth, userSvc) {
    var authData = Auth.$getAuth();
    return userSvc.getChildren(authData.uid);
  }

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
