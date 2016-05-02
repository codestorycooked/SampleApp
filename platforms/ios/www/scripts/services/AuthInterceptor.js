(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.factory('authInterceptorService', [
        '$q',
        '$location',
        'localStorageService',
        '$injector',
        '$rootScope',

        function ($q, $location, localStorageService, $injector, $rootScope
            , $ionicHistory) {
            var authInterceptorServiceFactory = {};
            var _request = function (ENV) {
                console.log(ENV.url.indexOf('Chats'));
                if (ENV.url.indexOf('Chats') > -1) {

                } else {
                    $rootScope.$broadcast('loading:show');
                }
                ENV.headers = ENV.headers || {};
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    ENV.headers.Authorization = 'Bearer ' + authData.token;
                }


                return ENV;
            };
            var _responseError = function (rejection) {
                $rootScope.$broadcast('loading:hide')
                if (rejection.status === 401) {


                    localStorageService.set('authorizationData', null);
                    //$injector.get('$state').transitionTo('app.login');
                    //$scope.modal.show();
                    $rootScope.$broadcast('event:auth-loginRequired');
                    localStorageService.set('authorizationData', null);

                }
                return $q.reject(rejection);
            };
            var response = function (response) {
                $rootScope.$broadcast('loading:hide')
                return response
            }
            authInterceptorServiceFactory.request = _request;
            authInterceptorServiceFactory.responseError = _responseError;
            authInterceptorServiceFactory.response = response;
            return authInterceptorServiceFactory;
        }
    ]);
} ());
