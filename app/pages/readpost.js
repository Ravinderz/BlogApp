'use strict';

angular.module('myApp.readpost',['ngRoute','ui.bootstrap']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/readpost',{
		templateUrl: 'pages/readpost.html'
		
	});
}]).controller('readPostCtrl',['$scope','$http','$location','$timeout',function($scope,$http,$location,$timeout){
	
		$scope.readpost = {};
		var postId = $location.search().pid;
		console.log("postid in readpost",postId);
		
		$http({
			method: "POST",
			url : "http://localhost:2017/api/v1.0/post/findPostById/"+postId,
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
			$scope.readpost = response.data.doc[0];
			console.log(response.data.doc[0]);
		});
		
		$scope.likePost = function(id){
		
		$http({
			method: "POST",
			url : "http://localhost:2017/api/v1.0/post/likePost/"+id,
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
           $scope.readpost = response.data.doc;
			console.log(response.data.doc);		
		});

	}
	
}]);