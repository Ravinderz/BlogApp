'use strict';

angular.module('myApp.profile',['ngRoute','ui.bootstrap','ngMaterial']).
config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/profile',{
		templateUrl: 'pages/profile.html',
		controller: 'profileCtrl'
	});
}]).controller('profileCtrl',['$rootScope','$scope','$http','$location','$mdDialog',function($rootScope,$scope,$http,$location,$mdDialog){
		
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

	$scope.showConfirm = function(ev,postId,key) {
    // Appending dialog to document.body to cover sidenav in docs app
    console.log(postId);
    var confirm = $mdDialog.confirm()
          .title('Are you Sure?')
          .textContent('Are you sure you want to delete this post')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('delete')
          .cancel('cancel');

    $mdDialog.show(confirm).then(function() {

    	 $http({
			method: "DELETE",
			url : $rootScope.webAddr+"/api/v1.0/post/deletePost/"+postId,
			headers:{
				'Content-Type':'application/json',
				'x-access-token': $rootScope.user.token
			}
		}).then(function(response){
			console.log(response.data);
      		$scope.posts.splice(key,1);
      		$scope.status = 'post has been successfully deleted';
      		console.log($scope.status);
			
		});
      
    }, function() {
      $scope.status = 'not sure to cancel';
      console.log($scope.status);
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