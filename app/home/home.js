'use strict';

angular.module('myApp.home',['ngRoute']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/home',{
		templateUrl: 'home/home_new.html',
		controller: 'homeCtrl'
	});
}]).
controller('homeCtrl',['$scope','$http',function($scope,$http){
	
	 $scope.posts = {};
	 
	 $http({
			method: "GET",
			url : "http://localhost:2017/api/v1.0/post/getAllPosts",
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
			$scope.posts = response.data;
			console.log(response.data);
		});
	
		
	$scope.login = function(e){
		e.preventDefault();
		console.log("inside scope.login function");
		var email = $scope.user.email;
		var password = $scope.user.password;
		console.log($scope.user);
		$http({
			method: "POST",
			url : "http://localhost:2017/api/v1.0/authenticate",
			data : angular.toJson($scope.user),
			header : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response){
			$scope.resp = "login successfull";
			$scope.user.email = "";
			$scope.user.password = "";
		});
	}
	
}]);