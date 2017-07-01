'use strict';
angular.module('jumboClient').controller('SignUpCtrl', ['User', '$state', '$scope', 'Notification', 'SweetAlert',
	function (User, $state, $scope, Notification, SweetAlert) {

	$scope.user = User.new();
		
	$scope.signUp = function(){
		User.signUp($scope.user).then(function(success){
			Notification.success('Logged in');
			$state.transitionTo('main.hello');
		},
		function(error){
			SweetAlert.swal("The entered credentials are not correct. Please try again", "", "error");
		});
	}

}]);