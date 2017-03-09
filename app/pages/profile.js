'use strict';

angular.module('myApp.profile',['ngRoute','ui.bootstrap']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/profile',{
		templateUrl: 'pages/profile.html',
		controller: 'profileCtrl'
	});
}]).controller('profileCtrl',['$rootScope','$scope','$http','$location',function($rootScope,$scope,$http,$location){
		
		var addr = $location.absUrl().split('/');
		$rootScope.datenow = Date.now();
		$rootScope.webAddr = addr[0]+"//"+addr[1]+addr[2];
		$rootScope.user = {};
		$scope.posts = {};
		$scope.status = '  ';

	 if(sessionStorage.getItem("user")){
		 $rootScope.user = angular.fromJson(sessionStorage.getItem("user"));
	 }

	 $http({
			method: "GET",
			url : $rootScope.webAddr+"/api/v1.0/post/getPostsByUser/"+$rootScope.user._id,
			headers:{
				'Content-Type':'application/json',
				'x-access-token': $rootScope.user.token
			}
		}).then(function(response){
			$scope.posts = response.data;
			console.log(response.data);
		});

	$scope.editPost = function(id){
		var postId = id;
		console.log("postid",postId);
		$location.path('/editpostbyid').search({pid:postId});
	}	

}]).controller('logoutCtrl',['$rootScope','$scope',function($rootScope,$scope){

	$scope.logout = function(e){
		e.preventDefault();
		console.log("inside logout controller");
		sessionStorage.removeItem("user");
		$rootScope.user = {};
		$rootScope.isLogged = false;
	}
}]);