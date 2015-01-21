(function () {
var app = angular.module('nodewp', ['ngResource']);

/*CONSTANTS*/
app.constant('AUTH_EVENTS', {
	loginSuccess : 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
});
app.constant('USER_ROLES', {
	all : '*',
	admin : 'admin',
	editor : 'editor',
	guest : 'guest'
});

/*CONTROLLERES*/

app.controller('MainController',function ($scope, USER_ROLES, AuthService) {
  	$scope.currentUser = null;
  	$scope.userRoles = USER_ROLES;
  	$scope.isAuthorized = AuthService.isAuthorized;
 
  	$scope.setCurrentUser = function (user) {
    	$scope.currentUser = user;
  	};
});

app.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
	  $scope.credentials = {
		login: '',
		pass: ''
	  };
	  $scope.login = function (credentials) {
		    AuthService.login(credentials).then(function (user) {
			    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			    $scope.setCurrentUser(user);
		    }, function () {
		      	$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		    });
	  };
});

/*FACTORY*/
app.factory('AuthService', function ($http, Session) {
  	var authService = {};
 
  	authService.login = function (credentials) {
    	return $http
      		.get('localhost:8080/login', JSON.stringify(credentials))
      		.then(function (res) {
        		Session.create(res.data.id, res.data.user.id,
                       			res.data.user.role);
        		return res.data.user;
      });
  };
 
  	authService.isAuthenticated = function () {
    	return !!Session.userId;
  	};
 
  	authService.isAuthorized = function (authorizedRoles) {
    	if (!angular.isArray(authorizedRoles)) {
      		authorizedRoles = [authorizedRoles];
    	}
    	return (authService.isAuthenticated() &&
      		authorizedRoles.indexOf(Session.userRole) !== -1);
  	};
 
  	return authService;
});

/*SERVICES*/
app.service('Session', function () {
  	this.create = function (sessionId, userId, userRole) {
    	this.id = sessionId;
    	this.userId = userId;
    	this.userRole = userRole;
  	};
  	this.destroy = function () {
    	this.id = null;
    	this.userId = null;
    	this.userRole = null;
  	};
  	return this;
})

})();