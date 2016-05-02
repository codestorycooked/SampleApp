(function () {
  'use strict';
  var app = angular.module('mobApp');
  app.factory('AuthenticationService', AuthenticationService);
  /*ngInject*/
  function AuthenticationService($http, $q, localStorageService, CommonServices,
                                 ENV, authService, $rootScope, $ionicHistory) {
    var serviceBase = ENV.apiUrl;
    var siteUrl = ENV.siteUrl;
    var authServiceFactory = {};
    var _authentication = {
      isAuth: false,
      userName: ''
    };
    var _resetPassword = function (userName) {
      _logOut();
      return $http.post(serviceBase + 'Account/ResetPassword?userEmail=' + userName).then(function (response) {
        return response;
      })
    };
    var _saveRegistration = function (registration) {
      console.log(registration);
      registration.playerID=localStorageService.get('playerID');
      registration.dateOfBirth=new Date();
      registration.phoneNumber="1234567890";
      console.log(registration);
      
      _logOut();
      return $http.post(serviceBase + 'Account/Register', registration).then(function (response) {
        return response;
      });
    };
    var _saveRegistrationExternal = function (registration) {
      _logOut();
      console.log(registration);
      registration.playerID=localStorageService.get('playerID');
      registration.dateOfBirth=new Date();
      registration.phoneNumber="1234567890";
      console.log(registration);

      return $http.post(serviceBase + 'Account/RegisterExternal', registration).then(function (response) {
        _saveExteralToken(response.data);
        return response;
      });
    };
    var _saveExteralToken = function (response) {
      localStorageService.set('authorizationData', {
        token: response.access_token,
        userName: response.userName,
        userId: response.userId
      });
      _authentication.isAuth = true;
      _authentication.userName = response.userName;
      console.log(JSON.stringify(localStorageService.get('authorizationData')));
    };
    var _login = function (loginData) {
      console.log(siteUrl);
      var data = 'grant_type=password&username=' + loginData.userName + '&password=' + loginData.password;
      var deferred = $q.defer();
      CommonServices.loading();
      $http.post(siteUrl + 'token', data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).success(function (response) {

        localStorageService.set('authorizationData', {
          token: response.access_token,
          userName: loginData.userName,
          userId: response.userId
        });
        _authentication.isAuth = true;
        _authentication.userName = loginData.userName;
        deferred.resolve(response);
        CommonServices.loaded();
      }).error(function (err, status) {
        _logOut();
        console.log(err);
        if (err.error_description) {
          CommonServices.showAlert(err.error_description);
        } else {
          CommonServices.showAlert('Problem signing in. Please check your username and password.');
        }

        deferred.reject(err);
        CommonServices.loaded();
      });
      return deferred.promise;
    };
    var _logOut = function () {
      localStorageService.remove('authorizationData');
      _authentication.isAuth = false;
      _authentication.userName = '';
      $rootScope.$broadcast('event:auth-loginRequired');
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });

    };
    var _fillAuthData = function () {
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        _authentication.isAuth = true;
        _authentication.userName = authData.userName;
        _authentication.userId = authData.userId
      }
    };
    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.saveExternalLogin = _saveRegistrationExternal;
    authServiceFactory.saveExternalInfo = _saveExteralToken;
    authServiceFactory.resetPassword = _resetPassword;
    return authServiceFactory;
  };

}());
