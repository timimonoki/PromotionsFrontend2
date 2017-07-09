'use strict';
angular.module('jumboClient').service('User', ['Config', '$q', '$http', '$localStorage', function(Config, $q, $http, $localStorage) {

	var loggedInUser = null;
	var userChangedSubscribers = [];

	this.subscribeForUserChange = function(subscriber){
		userChangedSubscribers.push(subscriber);
	}

	init();

	function init(){
    	if($localStorage.username){
    		me($localStorage.username).then(function(success){
    			console.log("OK");
    		},
    		function(error){
    			console.log(error);
    		});
    	}
    }

    function me(username){
    	var deferred = $q.defer();
    	$http({
    		method: 'POST',
    		url: 'http://localhost:3000/me',
    		data: {
    			username: username
    		}
    	}).then(function successCallback(response) {
    		setUser(response.data.user);
    		deferred.resolve('success');
    	},
    	function errorCallback(error) {
    		console.log(error);
    		Config.removeToken();
    		delete $localStorage.username;
    		deferred.reject(error);
    	});
    	return deferred.promise;
   }

	function setUser(user){
		loggedInUser = user;
		//console.log('user is:');
		//console.log(loggedInUser);
		userChangedSubscribers.forEach(function(subscriber){
			subscriber();
	    });
	}

	function user(username, password){
		this.username = username;
		this.password = password;
	}

	this.new = function(){
		return new user('', '');
	}

	function handleUserChange(responseData){
		if(responseData.token){
			Config.setToken(responseData.token);
		}
		setUser(responseData.user);
		$localStorage.username = loggedInUser.username;
	}

	this.login = function(username, password){

		loggedInUser={username: username};
	}

	this.me = me;

	this.logout = function(){
		loggedInUser = null;
	}

	this.signUp = function(user){
		
	}

	this.search = function(searchString){
	
	}

	this.getUsername = function(){
		return loggedInUser.username;
	}

	this.get = function(){
		return loggedInUser;
	}

	this.getId = function(){
		if(loggedInUser !== null){
			return loggedInUser._id;
		} else {
			return -1;
		}
	}

	this.isLoggedIn = function(){
		return loggedInUser !== null;
	}

}]);
