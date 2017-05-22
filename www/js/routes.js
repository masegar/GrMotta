angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('ingreso', {
    url: '/loginpage',
    templateUrl: 'templates/ingreso.html',
    controller: 'ingresoCtrl'
  })

  .state('menDeAplicaciones', {
    url: '/page3',
    templateUrl: 'templates/menDeAplicaciones.html',
    controller: 'menDeAplicacionesCtrl'
  })

  .state('RdenesDeProducciN', {
    url: '/page4',
    templateUrl: 'templates/RdenesDeProducciN.html',
    controller: 'RdenesDeProducciNCtrl'
  })

  .state('listarTodos', {
    url: '/page6',
    templateUrl: 'templates/listarTodos.html',
    controller: 'listarTodosCtrl'
  })

  .state('fullordenes', {
    url: '/page7',
    templateUrl: 'templates/fullordenes.html',
    controller: 'fullordenesCtrl'
  })  

$urlRouterProvider.otherwise('/loginpage')

  

});