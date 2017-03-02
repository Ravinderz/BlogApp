'use strict';

angular.module('myApp.writepost',['ngRoute','ui.bootstrap']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/writepost',{
		templateUrl: 'pages/writepost.html'
	});
}]).controller('writePostCtrl',['$rootScope','$scope','$http','$location',function($rootScope,$scope,$http,$location){
	
		$scope.writepost = {};
		$rootScope.isLogged = false;
		$rootScope.datenow = Date.now();
		$rootScope.user = {};
				
	 if(sessionStorage.getItem("user")){
		 $rootScope.isLogged = true;
		 $rootScope.user = angular.fromJson(sessionStorage.getItem("user"));
	 }
	 
	 $scope.submitPost = function(e){
		 e.preventDefault();
		 console.log($scope.htmlVariable);
		 $scope.writepost.author = $rootScope.user.username;
		 $scope.writepost.content = $scope.htmlVariable;
		 $scope.writepost.tags = ["testing"];
		 console.log($scope.writepost);
		 
		 var token = $rootScope.user.token
		$http({
			method: "POST",
			url : "http://localhost:5000/api/v1.0/post/createPost",
			data : angular.toJson($scope.writepost),
			headers : {
				'Content-Type' : 'application/json',
				'x-access-token': token
			}
		}).then(function(response){
			$scope.writepost = "";
			$scope.htmlVariable = "";
			//$scope.readpost = response.data.doc;
			console.log(response.data);
		});
	 }
		
		
	
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
			url : "http://localhost:5000/api/v1.0/authenticate",
			data : angular.toJson($scope.user),
			header : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response){
			$rootScope.user = response.data.obj;
			console.log($rootScope.user);
			console.log("response",response);	
			$rootScope.isLogged = true;
			$rootScope.user.username = response.data.obj.firstName+" "+response.data.obj.lastName;
			$rootScope.user.token = response.data.token;
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
			url : "http://localhost:5000/api/v1.0/register",
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
		sessionStorage.removeItem("user");
		$rootScope.user = {};
		$rootScope.isLogged = false;
	}
}]);