'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.readpost',
  'myApp.writepost'
]).
config(['$routeProvider', function($routeProvider) {
	
	$routeProvider.when("/readpostbyid",{
		redirectTo: '/readpost'
	}).when("/writeNewPost",{
		redirectTo: '/writepost',
	}).otherwise({
		redirectTo: '/home'
	});
}]);
