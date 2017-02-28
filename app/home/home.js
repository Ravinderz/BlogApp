'use strict';

angular.module('myApp.home',['ngRoute','ui.bootstrap']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/home',{
		templateUrl: 'home/home_new.html',
		controller: 'homeCtrl'
	});
}]).
controller('homeCtrl',['$rootScope','$scope','$http',function($rootScope,$scope,$http,loginService){

	 $scope.posts = {};
	 $scope.recentPosts = {};
	 $rootScope.isLogged = false;
	 $rootScope.user = {};
	 
	 if(sessionStorage.getItem("user")){
		 $rootScope.isLogged = true;
		 $rootScope.user = angular.fromJson(sessionStorage.getItem("user"));
	 }

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
		
	 $http({
			method: "GET",
			url : "http://localhost:2017/api/v1.0/post/getRecentTenPost",
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
			$scope.recentPosts = response.data;
			console.log(response.data);
		});	
		
		

}]).controller('loginCtrl',['$scope','$http','$uibModal',function($scope,$http,$uibModal){

	$scope.open = function() {
	console.log("inside loginCtrl method");
    var modalInstanceVar = $uibModal.open({
      animation: true,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
	  scope: $scope,
	  resolve: {}
    });

    modalInstanceVar.result.then(function(e) {
     console.log("modal opened")
    });

  };



}]).controller('ModalInstanceCtrl',['$rootScope','$scope','$http','$uibModalInstance', function($rootScope,$scope,$http,$uibModalInstance) {



  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

   $scope.closeModal = function () {
    $uibModalInstance.close();
  };

  $scope.login = function(e){
		e.preventDefault();
		console.log("inside scope.login function");
		$http({
			method: "POST",
			url : "http://localhost:2017/api/v1.0/authenticate",
			data : angular.toJson($scope.user),
			header : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response){
			$rootScope.user = response.data.obj;
			console.log($rootScope.user);
			console.log(response);	
			$rootScope.isLogged = true;
			$rootScope.user.username = response.data.obj.firstName+" "+response.data.obj.lastName;
			sessionStorage.setItem("user",angular.toJson($rootScope.user));
			console.log($rootScope.user);
			$scope.resp = "login successfull";

			$uibModalInstance.close();
		});
	};
}]).controller('registerCtrl',['$scope','$http','$uibModal',function($scope,$http,$uibModal){

	var regModalInstanceVar= "";

	$scope.openRegisterModal = function() {
	console.log("inside loginCtrl method");
    regModalInstanceVar = $uibModal.open({
      animation: true,
      templateUrl: 'myRegisterModalContent.html',
      controller: 'RegisterModalInstanceCtrl',
	  scope: $scope,
	  resolve: {}
    });

    regModalInstanceVar.result.then(function(e) {
     console.log("modal opened")
    });

	console.log(regModalInstanceVar);

  };

  $scope.openLoginModal = function(){
	  regModalInstanceVar.close();
	  var loginModalInstance = $uibModal.open({
		  animation: true,
		templateUrl: 'myModalContent.html',
		controller: 'ModalInstanceCtrl'
	  })
  }
}]).controller('RegisterModalInstanceCtrl',['$rootScope','$scope','$http','$uibModalInstance', function($rootScope,$scope,$http,$uibModalInstance) {

  $scope.register = function(e){
		e.preventDefault();
		console.log("inside scope.register function");
		console.log(angular.toJson($scope.user));
		$http({
			method: "POST",
			url : "http://localhost:2017/api/v1.0/register",
			data : angular.toJson($scope.user),
			header : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response){
			$scope.message = "registration successfull";
			//$uibModalInstance.close();
		});
	};
}]).controller('logoutCtrl',['$rootScope','$scope',function($rootScope,$scope){

	$scope.logout = function(e){
		e.preventDefault();
		console.log("inside logout controller");
		$rootScope.user = {};
		$rootScope.isLogged = false;
	}

}]).controller('openPostCtrl',['$scope','$http','$location',function($scope,$http,$location){
	
	$scope.openPost = function(id){
		var postId = id;
		console.log("postid",postId);
		$location.path('/readpostbyid').search({pid:postId});
	}
	
}])
