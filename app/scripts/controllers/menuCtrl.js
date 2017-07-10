'use strict';
angular.module('jumboClient').controller('MenuCtrl', ['User', '$state', '$scope', function (User, $state, $scope) {

 $scope.isLoggedIn = User.isLoggedIn;

	function initHeader(){
		if(User.isLoggedIn()){
			$scope.username = User.getUsername();
		}
	}

	initHeader();


	$scope.logout = function(){
		User.logout();
		$state.transitionTo('main.login');
	}

}]);
