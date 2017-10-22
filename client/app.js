'use strict';

/* Create and configure application */
var angular = require('../node_modules/angular');

angular.module('cardinal', [
  require('../node_modules/angular-animate'),
  require('../node_modules/angular-aria'),
  require('../node_modules/angular-material'),
  require('../node_modules/angular-resource'),
  require('../node_modules/angular-ui-router')
])

// .service('DataService', require('./services/data.js'))
// .directive('cnClickSelect', require('./services/cn-click-select.js'))

.service('Auth', require('./services/auth.js'))

.component('selectRobot', require('./components/selectRobot/selectRobot.js'))

.component('login', require('./pages/login/login.js'))
.component('command', require('./pages/command/command.js'))

.config([
  '$locationProvider', '$stateProvider', '$urlRouterProvider', Config
])

.run([
  '$rootScope', '$state', 'Auth', Run
]);

function Config ($locationProvider, $stateProvider, $urlRouterProvider) {
  // function to check the authentication //
  var Auth = ["$q", "Auth", function ($q, Auth) {
    if (Auth.isAuthenticated) {
      return $q.when(Auth.session);
    } else {
      return $q.reject({ authenticated: false });
    }
  }];

  $locationProvider.html5Mode(true);

  // Set routes
  $stateProvider
    .state({
      name: 'login',
      url: '/login',
      template: '<login></login>'
    })
    .state({
      name: 'command',
      url: '/command',
      template: '<command container="column #top @stretch"></command>',
      resolve: {
          auth: Auth
      }
    });
    // .state({
    //   name: 'template',
    //   url: '/templates/:templateId',
    //   template: `
    //     <template_
    //       data="$resolve.data"
    //       container="row #left @stretch" flex>
    //     </template_>`,
    //   resolve: {
    //     data: function (DataService, $q, $stateParams) {
    //       let cards = DataService('cards')
    //         .query({ templateId: $stateParams.templateId })
    //         .$promise;

    //       let template = DataService('templates')
    //         .get({ id: $stateParams.templateId })
    //         .$promise;

    //       return $q.all({ cards: cards, template: template });
    //     }
    //   }
    // });

    $urlRouterProvider.otherwise('/login');
}

// App initialization stuff here
function Run ($rootScope, $state, Auth) {
  var authenticated = false;

  // // Check for Authentication prior to each route call
  // $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
  //   if (toState.name === 'login') {
  //     return;
  //   }

  //   if (!Auth.isAuthenticated) {
  //     event.preventDefault()
  //     toParams.state = toState.name;
  //     $state.go('login', { reroute: toParams } )
  //   }
  // });

  $rootScope.$on('$stateChangeError', function (_event, _toState, _toParams, _fromState, _fromParams, _error) {
    $state.go('login', { reroute: _toParams });
})
}


/* Global utilities */

function setDefault (object, key, value) {
  if (object[key] === undefined) {
    object[key] = value;
  }
  return object[key];
}

window.setDefault = setDefault;
