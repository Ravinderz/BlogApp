'use strict';

angular.module('myApp.readpost',['ngRoute','ui.bootstrap']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/readpost',{
		templateUrl: 'pages/readpost.html'
	});
}]).controller('readPostCtrl',['$rootScope','$scope','$http','$location','$timeout',function($rootScope,$scope,$http,$location,$timeout){
	
		var addr = $location.absUrl().split('/');
		$scope.readpost = {};
		$scope.hasUserLikedPost = false;
		$scope.hasUserLikedComment = false;
		$rootScope.isLogged = false;
		$rootScope.datenow = Date.now();
		$rootScope.webAddr = addr[0]+"//"+addr[1]+addr[2];
		$rootScope.user = {};
		
		var postId = $location.search().pid;
		console.log("postid in readpost",postId);
		
	 if(sessionStorage.getItem("user")){
		 $rootScope.isLogged = true;
		 $rootScope.user = angular.fromJson(sessionStorage.getItem("user"));
	 }
		
		$http({
			method: "POST",
			url : $rootScope.webAddr+"/api/v1.0/post/findPostById/"+postId,
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
			$scope.readpost = response.data.doc[0];
			console.log(response.data.doc[0]);
			for(var i = 0; i < $scope.readpost.likedBy.length;i++){
			if($rootScope.user._id === $scope.readpost.likedBy[i]){
					console.log("user liked the post");
					$scope.hasUserLikedPost = true;
		}
		}
		});

		//for updated post views
		$http({
			method: "POST",
			url : $rootScope.webAddr+"/api/v1.0/post/updateViews/"+postId,
			data : {},
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
			console.log(response);	
		});

		
		
		// for liking a post
		$scope.likePost = function(id){
		if(!$scope.hasUserLikedPost){	
		console.log(angular.toJson($rootScope.user._id))
		$http({
			method: "POST",
			url : $rootScope.webAddr+"/api/v1.0/post/likePost/"+id,
			data : {
				userId : $rootScope.user._id,
			},
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
           $scope.readpost = response.data.doc;
			console.log(response.data.doc);	
			for(var i = 0; i < $scope.readpost.likedBy.length;i++){
			if($rootScope.user._id === $scope.readpost.likedBy[i]){
					console.log("user liked the post");
					$scope.hasUserLikedPost = true;
		}
		}
				
		});

			}
			}
			
			// for liking a post
			
		$scope.likeComment = function(id){
		if(!$scope.hasUserLikedComment){
		$http({
			method: "POST",
			url : $rootScope.webAddr+"/api/v1.0/post/likeComment/"+id,
			data :{ 
				userId:$rootScope.user._id
			},
			header:{
				'Content-Type':'application/json'
			}
		}).then(function(response){
           $scope.readpost = response.data.doc;
			console.log(response.data.doc);		
			for(var i = 0; i < $scope.readpost.comments.length;i++){
				if(id === $scope.readpost.comments[i]._id){
					for(var j = 0 ; j < $scope.readpost.comments[i].likedBy.length;j++){
						if($rootScope.user._id === $scope.readpost.comments[i].likedBy[j]){
							$scope.hasUserLikedComment = true;
						}
					}
				}	
			}
		});

		}	
		}
	
		//to submit a comment
		$scope.submitComment = function(postId){
		console.log("inside submit comment controller");
		console.log("post id in submit comment",postId);
		console.log($scope.commentVar);
		$scope.commentVar.commentBy = $rootScope.user.username;
		$scope.commentVar.time = Date.now();
		
		var token = $rootScope.user.token
		$http({
			method: "POST",
			url : $rootScope.webAddr+"/api/v1.0/post/addComment/"+postId,
			data : angular.toJson($scope.commentVar),
			headers : {
				'Content-Type' : 'application/json',
				'x-access-token': token
			}
		}).then(function(response){
			$scope.commentVar = "";
			$scope.readpost = response.data.doc;
			console.log(response.data.doc);
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