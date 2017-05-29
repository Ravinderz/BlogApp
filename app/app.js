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
  'myApp.trending',
  'myApp.topten'
]).
config(['$routeProvider', function($routeProvider) {
	
	$routeProvider.when("/",{
		redirectTo: '/home'
	}).otherwise({
		redirectTo: '/home'
	});
}]);
