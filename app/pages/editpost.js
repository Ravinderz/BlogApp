'use strict';

angular.module('myApp.editpost',['ngRoute','ui.bootstrap']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/editpost',{
		templateUrl: 'pages/editpost.html'
	});
}]).controller('editPostCtrl',['$rootScope','$scope','$http','$location',function($rootScope,$scope,$http,$location){
		
		var addr = $location.absUrl().split('/');
		/*$scope.editpost = {};
		$scope.editpost.tags=[];*/
		$rootScope.isLogged = false;
		$rootScope.datenow = Date.now();
		$rootScope.webAddr = addr[0]+"//"+addr[1]+addr[2];
		$rootScope.user = {};
				
	 if(sessionStorage.getItem("user")){
		 $rootScope.isLogged = true;
		 $rootScope.user = angular.fromJson(sessionStorage.getItem("user"));
	 }

	 var postId = $location.search().pid;
		console.log("postid in readpost",postId);
	 
	 $http({
			method: "POST",
			url : $rootScope.webAddr+"/api/v1.0/post/findPostById/"+postId,
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
			$scope.editpost = response.data.doc[0];
			console.log(response.data.doc[0]);
			for(var i = 0; i < $scope.editpost.likedBy.length;i++){
			if($rootScope.user._id === $scope.editpost.likedBy[i]){
					console.log("user liked the post");
					$scope.hasUserLikedPost = true;
		}
		}
		});

	 $scope.createTags = function(){
	 	console.log("insde createTags function");
	 if($scope.tag){
	 	if($scope.tag.indexOf(",") > -1){

	 		console.log("inside if");
	 		console.log($scope.tag.split(",")[0]);
	 		if($scope.editpost.tags.indexOf($scope.tag.split(",")[0]) !== -1){
	 			console.log("element already exist in array");
	 		}else{
	 		$scope.editpost.tags.push($scope.tag.split(",")[0]);
	 		console.log("done adding to array");
	 		}
	 		$scope.tag = "";

	 	}
	 	}
	 }

	 $scope.createTagsOnKeyPress = function(e){
	 	if(e.which === 13){
	 		console.log($scope.tag);
	 		if($scope.editpost.tags.indexOf($scope.tag) !== -1){
	 			console.log("element already exist in array");
	 		}else{
	 			$scope.editpost.tags.push($scope.tag);
	 			console.log("done adding to array");
	 		}	 		
	 		$scope.tag = "";
	 	}
	 }
	 
	 $scope.deleteTag = function(posttag){
	 	console.log(posttag);
	 	var index = $scope.editpost.tags.indexOf(posttag);
 		$scope.editpost.tags.splice(index, 1);
	 }

	 $scope.submitPost = function(e){
		 e.preventDefault();
		 console.log($scope.htmlVariable);
		 $scope.editpost.author = $rootScope.user.username;
		 console.log($scope.editpost);
		 
		 var token = $rootScope.user.token

		 $http({
			method: "POST",
			url : $rootScope.webAddr+"/api/v1.0/post/editPost/"+postId,
			data : angular.toJson($scope.editpost),
			headers:{
				'Content-Type':'application/json',
				'x-access-token': token
			}
		}).then(function(response){
			$scope.editpost = "";
			console.log(response.message);
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
			url : $rootScope.webAddr+"/api/v1.0/authenticate",
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
			url : $rootScope.webAddr+"/api/v1.0/register",
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