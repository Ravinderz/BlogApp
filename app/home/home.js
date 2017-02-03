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
	
	$scope.login = function(event){
		var user = $scope.user.email;
		var pword = $scope.user.password;
		console.log(user);
			console.log(password);
		
		if(user === 'admin' && pword === 'admin'){
			console.log(user);
			console.log(password);
			$scope.resp = "login successfull";
		}
	}
	
}]);