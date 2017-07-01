'use strict';
angular.module('jumboClient').controller('LoginCtrl', ['User', '$state', '$scope', 'Notification', 'SweetAlert', 
	function (User, $state, $scope, Notification, SweetAlert) {

	$scope.username = '';
	$scope.password = '';

	$scope.logged = false;

	// normal login, with user credentials
	$scope.login = function(){
		var loginPromise = User.login($scope.username, $scope.password);
		$state.transitionTo('main.hello');
	}

}]);