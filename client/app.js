'use strict';

/* Create and configure application */
var angular = require('angular');

angular.module('cardinal', [
  require('angular-ui-router'),
  require('angular-resource')
])

.service('DataService', require('./shared/data.service.js'))

.directive('cnClickSelect', require('./shared/cn-click-select.directive.js'))

.component('games', require('./routes/games/games.component.js'))
.component('card', require('./components/card/card.component.js'))

.config([
  '$locationProvider', '$stateProvider', '$urlRouterProvider', Config
])

.run([
  '$rootScope', '$state', Run
]);

function Config ($locationProvider, $stateProvider, $urlRouterProvider) {

  $locationProvider.html5Mode(true);

  // Set routes
  $stateProvider
    .state({
      name: 'games',
      url: '/games',
      template: '<games container="column #top @stretch"></games>'
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

    $urlRouterProvider.otherwise('/games');
}

// App initialization stuff here
function Run ($rootScope, $state) {
  var authenticated = false;

  // // Check for Authentication prior to each route call
  // $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
  //   if (toState.name === 'login') {
  //     return;
  //   }
  //
  //   if (!AuthService.isAuthenticated) {
  //     event.preventDefault()
  //     toParams.state = toState.name;
  //     $state.go('login', { reroute: toParams } )
  //   }
  // });
}


/* Global utilities */

function setDefault (object, key, value) {
  if (object[key] === undefined) {
    object[key] = value;
  }
  return object[key];
}

window.setDefault = setDefault;
