(function () {
    'use strict';

    var app = angular.module('mobApp');
    app.controller('RegisterController',RegisterController);
    /*ngInject*/
    function RegisterController(CommonServices, authService, $ionicHistory, $state) {
        var vm = this;
        vm.savedSuccessfully = false;
        vm.message = '';
        vm.registerForm = {};

        vm.signUp = function () {
            vm.registerForm.ConfirmPassword = vm.registerForm.Password;
            vm.registerForm.Email = vm.registerForm.UserName;

            CommonServices.loading();
            authService.saveRegistration(vm.registerForm).then(function (response) {
                vm.savedSuccessfully = true;
                // vm.message = 'User has been registered successfully.';
                CommonServices.showAlert("Thanks for registering");  //startTimer();
                vm.login();
                CommonServices.loaded();
            }, function (response) {
                // vm.login();
                CommonServices.loaded();
                //JSON.stringify(response)
                CommonServices.showAlert("Error Registering: " + response.data.message);
            });
        };
        vm.login = function () {
            var loginData = {
                userName: vm.registerForm.UserName,
                password: vm.registerForm.Password
            };
            authService.login(loginData).then(function (data) {

                // $cordovaDialogs.alert('success', 'Wagging Tail', 'ok');
            }, function (response) {
                CommonServices.showAlert('Unable to login. Please try again'+ JSON.stringify(response));
            });
        };
    }



})()
