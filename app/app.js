'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.readpost'
]).
config(['$routeProvider', function($routeProvider) {
	
	$routeProvider.when("/readpostbyid",{
		redirectTo: '/readpost'
	}).otherwise({
		redirectTo: '/home'
	});
}]);
