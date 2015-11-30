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
    url: '/start',
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

  //Go to search view
  .state('app.linkUser', {
    url: '/linkUsers/:childId',
    views: {
      'menuContent': {
        templateUrl: 'templates/children/linkUser.html',
        controller: 'linkUserCtrl',
        controllerAs: 'link',
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
        controllerAs: 'emergency'

      }
    }
  })

  //Main page of child
  .state('child.posts', {
    url: '/posts',
    views: {
      'childSection': {
        templateUrl: 'templates/children/posts.html'
      }
    }
  })

  //Main page of child
  .state('child.action', {
      url: '/action',
      views: {
        'menuContent': {
          templateUrl: 'templates/children/action.html'
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
