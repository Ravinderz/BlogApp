'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.readpost',
  'textAngular',
  'myApp.writepost',
  'myApp.comingsoon',
  'myApp.editpost'
]).
config(['$routeProvider', function($routeProvider) {
	
	$routeProvider.when("/readpostbyid",{
		redirectTo: '/readpost'
	}).when("/writeNewPost",{
		redirectTo: '/writepost',
	}).when("/editpostbyid",{
		redirectTo: '/editpost',
	}).when("/yetToCome",{
		redirectTo: '/comingsoon',
	}).otherwise({
		redirectTo: '/home'
	});
}]);
