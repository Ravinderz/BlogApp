'use strict';

angular.module('myApp.validateuser',['ngRoute','ui.bootstrap']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/validateuser',{
		templateUrl: 'pages/validateuser.html'
	});
}]).controller('validateuserCtrl',['$rootScope','$scope','$http','$location',function($rootScope,$scope,$http,$location){
		
		var addr = $location.absUrl().split('/');
		$rootScope.datenow = Date.now();
		$rootScope.webAddr = addr[0]+"//"+addr[1]+addr[2];
		$rootScope.user = {};
		$scope.loggedUser = {};

	 if(sessionStorage.getItem("user")){
		 $rootScope.isLogged = true;
		 $rootScope.user = angular.fromJson(sessionStorage.getItem("user"));
	 }

	var useremail = $location.search().email;
	console.log("postid in validateuser",postId);
	var tk = $location.search().tk;
	console.log("postid in validateuser",tk);

		 $scope.loggedUser.email = useremail;
		 $scope.loggedUser.validateToken = tk; 
		$http({
			method: "POST",
			url : $rootScope.webAddr+"/api/v1.0/validateuser",
			data : angular.toJson($scope.loggedUser),
			headers : {
				'Content-Type' : 'application/json',
				'x-access-token': token
			}
		}).then(function(response){
			console.log(response.data);
		});
		
	
}]);