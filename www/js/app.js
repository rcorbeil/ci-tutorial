// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'RESTConnection', 'TKServicesModule', 'chart.js', 'SSFAlerts', 'pascalprecht.translate','tmh.dynamicLocale'])

.config(function(tmhDynamicLocaleProvider) {
 tmhDynamicLocaleProvider.localeLocationPattern("lib/angular-locale/angular-locale_{{locale}}.js");
})

.config(function($translateProvider) {
    $translateProvider
    //Load languages files from path
    .useStaticFilesLoader({
      prefix: 'languages/',
      suffix: '.json'
    })
    .preferredLanguage('en');
})

.config(function($translateProvider) {
$translateProvider
.registerAvailableLanguageKeys(['en', 'it','es'], {
   'en_*': 'en',
   'it_*': 'it',
   'es_MX': 'es'
 })
.preferredLanguage('en')
.determinePreferredLanguage();
})


.run(["$ionicPlatform", "$window", "$state", "$translate", 'tmhDynamicLocale' ,function($ionicPlatform, $window, $state, $translate, tmhDynamicLocale) {
  $ionicPlatform.ready(function() {
    // For testing languages, set spanish
    // $translate.use('es_us');
    
/*
if(typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function(language) {
            tmhDynamicLocale.set((language.value).split("-")[0]+"-us");
        }, null);
    }    
*/
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    if($window.localStorage["userID"]!==undefined)
    {
        $state.go("lobby");
    }
  });
}])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('landing', {
    url: '/',
    templateUrl: 'templates/landing.html',
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
  .state('lobby', {
    url: '/lobby',
    templateUrl: 'templates/lobby.html',
    controller: 'LobbyCtrl'
  })
  .state('test', {
    abstract: true,
    url: '/test',
    template: '<ion-nav-view></ion-nav-view>'
  })
  .state('test.detail', {
    url: '/question:testID',
    templateUrl: 'templates/question.html',
    controller: 'TestCtrl',
    resolve: {
      testInfo: function($stateParams, TKQuestionsService) {
        return TKQuestionsService.getQuestion($stateParams.testID);
      }
    }
  })
  .state('results', {
    url: '/results',
    templateUrl: 'templates/results.html',
    controller: 'ResultsCtrl'
})
  .state('history', {
    url: '/history',
    templateUrl: 'templates/history.html',
    controller: 'HistoryCtrl'
  });
})
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show');
        return config;
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide');
        return response;
      },
      requestError: function(reason) {
        $rootScope.$broadcast('loading:hide');
        return reason;
      },
      responseError: function(response) {
        $rootScope.$broadcast('loading:hide');
        if(response.status === 401 && (response.data.error.code === "INVALID_TOKEN" ||
        response.data.error.code === "AUTHORIZATION_REQUIRED")){
          $rootScope.$broadcast('request:auth');
        }
        return response;
      }
    };
  });
}])
.run(["$rootScope", "$ionicLoading", function($rootScope, $ionicLoading) {
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  });
}])
.run(["$rootScope", "$ionicHistory", "$state", "$window", function($rootScope, $ionicHistory, $state, $window) {
  $rootScope.$on('request:auth', function() {
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true
    });
    delete $window.localStorage['token'];
    delete $window.localStorage['userID'];
    $state.go('landing');
  });  
}]);


