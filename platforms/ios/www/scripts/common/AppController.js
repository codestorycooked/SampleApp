(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.controller('AppController', AppController);
    /*ngInject*/
    function AppController($scope, AuthenticationService, $location,
        CommonServices, $ionicHistory, $state, $ionicModal, $rootScope) {
        var vm = this;

        var checkLogin = function () {

            if (!CommonServices.isUserLoggedIn()) {
                vm.isloggedin = false;
            } else {

                vm.isloggedin = true;
            }
        }
        checkLogin();

        var registerPlayerId = function () {

        }
        //registerPlayerId();
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope,
            animation: 'slide-in-up'

        }).then(function (modal) {

            // alert(JSON.stringify(modal));
            $scope.loginModal = modal;
            checkLogin();

        });
        vm.logout = function () {
            vm.IsNormal = true;
            AuthenticationService.logOut();
            $state.go('app.feeds');
            CommonServices.showAlert('Logged out successfully!!');
            vm.isloggedin = false;

        };
        vm.IsNormal = false;

        $scope.$on('event:auth-loginRequired', function (e, rejection) {
            if (vm.IsNormal === true) {

            } else {
                $scope.loginModal.show();
            }
        });

        $scope.$on('event:userLoggedIn', function (e, rejection) {

            vm.isloggedin = true;
            if ($location.path().match('/app/login')) {
                $ionicHistory.clearHistory();
                $state.go('app.feeds')
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });
            }
            console.log($location.path());
        });

        $scope.$on('$destroy', function () {
            $scope.loginModal.remove();
        });
    }


})()
