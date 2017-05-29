'use strict';

angular.module('myApp.home',['ngRoute','ui.bootstrap']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/home',{
		templateUrl: 'home/home.html',
		controller: 'homeCtrl'
	});
}]).
controller('homeCtrl',['$rootScope','$scope','$http','$location',function($rootScope,$scope,$http,$location,loginService){

	var addr = $location.absUrl().split('/');
	

	 $scope.posts = {};
	 $scope.recentPosts = {};
	 $scope.trendingPosts = {};
	 $rootScope.webAddr = addr[0]+"//"+addr[1]+addr[2];
	 $rootScope.isLogged = false;
	 $rootScope.user = {};
	 
	 console.log($rootScope.webAddr);
	 
	 if(sessionStorage.getItem("user")){
		 $rootScope.isLogged = true;
		 $rootScope.user = angular.fromJson(sessionStorage.getItem("user"));
	 }

	 $http({
			method: "GET",
			url : $rootScope.webAddr+"/api/v1.0/post/getAllPosts",
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
			$scope.posts = response.data;
			console.log(response.data);
		});
		
	 $http({
			method: "GET",
			url : $rootScope.webAddr+"/api/v1.0/post/getRecentTenPost",
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
			$scope.recentPosts = response.data;
			console.log(response.data);
		});	

	$http({
			method: "GET",
			url : $rootScope.webAddr+"/api/v1.0/post/getTopTenTrendingPosts",
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
			$scope.trendingPosts = response.data;
			console.log(response.data);
		});		
		
		

}]).controller('openPostCtrl',['$scope','$http','$location',function($scope,$http,$location){
	
	$scope.openPost = function(id){
		var postId = id;
		console.log("postid",postId);
		$location.path('/readpost').search({pid:postId});
	}
	
}])
