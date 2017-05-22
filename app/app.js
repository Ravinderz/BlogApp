'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.readpost',
  'textAngular',
  'myApp.writepost',
  'myApp.comingsoon',
  'myApp.editpost',
  'myApp.validateuser',
  'myApp.profile',
  'myApp.trending'
]).
config(['$routeProvider', function($routeProvider) {
	
	$routeProvider.when("/readpostbyid",{
		redirectTo: '/readpost'
	}).when("/writeNewPost",{
		redirectTo: '/writepost',
	}).when("/editpostbyid",{
		redirectTo: '/editpost',
	}).when("/validate",{
		redirectTo: '/validateuser',
	}).when("/userprofile",{
		redirectTo: '/profile',
	}).when("/yetToCome",{
		redirectTo: '/comingsoon',
	}).when("/trending",{
		redirectTo: '/trendingposts',
	}).otherwise({
		redirectTo: '/home'
	});
}]);
