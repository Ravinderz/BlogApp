'use strict';

angular.module('myApp.home',['ngRoute']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/home',{
		templateUrl: 'home/home.html',
		controller: 'authCtrl'
	});
}]).
controller('authCtrl',['$scope',function($scope){
	
	 $scope.user = {};
	
	$scope.login = function(e){
		e.preventDefault();
		console.log("inside scope.login function");
		var username = $scope.user.email;
		var pword = $scope.user.password;
		console.log(username);
			console.log(pword);
		
		if(username === 'admin' && pword === 'admin'){
			console.log(username);
			console.log(pword);
			$scope.resp = "login successfull";
		}
	}
	
}]);