(function () {
  'use strict';
  var app = angular.module('mobApp');
  app.controller('LoginController', LoginController);
  /*ngInject*/
  function LoginController($scope, AuthenticationService,
    $cordovaOauth, ENV,
    $ionicLoading, $q, $http,
    localStorageService, $state, $ionicPopup,
    CommonServices, $ionicHistory, $rootScope) {
    var vm = this;
    vm.loginForm = {};
    vm.savedSuccessfully = false;
    vm.message = '';
    vm.loginData = {};
    vm.register = {};
    vm.isRegister = false;
    var validateEmail = function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    //Register User
    vm.signUp = function () {
      console.log(vm.loginForm);

      vm.register.Email = vm.loginForm.userName;
      vm.register.UserName = vm.loginForm.userName;
      vm.register.Password = vm.loginForm.password;
      vm.register.DisplayName = vm.loginForm.displayName;
      CommonServices.loading();
      AuthenticationService.saveRegistration(vm.register).then(function (response) {
        vm.savedSuccessfully = true;
        // vm.message = 'User has been registered successfully.';
        CommonServices.showAlert("Thanks for registering");  //startTimer();
        vm.loginEmail();
        CommonServices.loaded();
      }, function (response) {
        // vm.login();
        CommonServices.loaded();
        //JSON.stringify(response)
        CommonServices.showAlert("Error Registering: " + response.data.message);
      });
    };

    vm.showRegister = function () {
      vm.isRegister = true;
    };
    vm.showLogin = function () {
      vm.isRegister = false;
    };

    vm.close = function () {
      if ($scope.loginModal !== undefined) {
        $scope.loginModal.hide();
      }
      $ionicHistory.goBack(-1);

    }
    //Login User
    vm.loginEmail = function () {

      // $scope.modal.hide();
      AuthenticationService.login(vm.loginForm).then(function (data) {

        $scope.loginModal.hide();
        $rootScope.$broadcast('event:userLoggedIn');
        $ionicHistory.goBack(-1);

      }, function (response) {


        //CommonServices.showAlert(response);
      });

    };

    //Google Login
    vm.googleLogin = function () {
      $cordovaOauth.google(ENV.googleClientID, ["email"]).then(function (result) {
        CommonServices.loading();
        //console.log('Response Object -> ' + JSON.stringify(result));
        getgoogleData(result.access_token);
      }, function (error) {
        CommonServices.showAlert("Error :" + error);
        CommonServices.loaded();
      });
      // var sampeltoken="ya29.kAKpKimeSFAAwDxmO6wtUh-_ho56d69gw88Zsq78vrFfrVHx3v0YxyYzufBGOnrmdd0m";
      // getgoogleData(sampeltoken);
    }
    var getgoogleData =
      function (token) {

        $http.get("https://www.googleapis.com/userinfo/v2/me", {
          params: {
            access_token: token,
            fields: "id,name,gender,email,picture",
            format: "json"
          }
        }).then(function (result) {
          var registrationData = {
            Provider: 'Google',
            ExternalAccessToken: token,
            Email: result.data.email,
            UserName: result.data.email,
            DisplayName: result.data.name,
            profilePhoto: picture
          }
          //console.log("Response Object -> " + JSON.stringify(result.data));
          AuthenticationService.saveExternalLogin(registrationData).then(function (response) {
            CommonServices.loaded();
            $ionicHistory.clearHistory();

            $scope.loginModal.hide();
            $rootScope.$broadcast('event:userLoggedIn');

            //  $state.go('home');
          });


        }, function (error) {
          CommonServices.loaded();
          CommonServices.showAlert("There was a problem getting your profile.  Check the logs for details.");
          // console.log(error);
        });
      };


    //Facebook loginForm

    vm.facebookSignIn = function () {
      $cordovaOauth.facebook(ENV.facebookID, ["email", "public_profile"]).then(function (result) {
        CommonServices.loading();
        //  CommonServices.showError("Response Object -> " + JSON.stringify(result));
        getfbdata(result.access_token);

      }, function (error) {
        CommonServices.loaded();
        CommonServices.showAlert("Error -> " + error);

      });
      // var tokensample="CAAXs1ApZBl5sBAFgbrGXLoYIKyY51wQEJpG9UA0ZAh2zg1kMNZAJmuDnZAHZAkMh1uL55lZAZANLgXziyorL0uTAZC2EGcqXVqPb9OC7yFRVrSOPqgBopd8taNyFIyyMkXrWdKyc12QeYnBC2VeRyZASfbL1gPppY1SUOIRTKl6sveh4HiKWCTeURTiZCBXO5knSgRxPvdMMTW2kvLnmYTxWs2";
      // getfbdata(tokensample);

    }
    var getfbdata =
      function (token) {


        $http.get('https://graph.facebook.com/v2.2/me', {
          params: {
            access_token: token,
            fields: "id,name,gender,email,picture",
            format: "json"
          }
        }).then(function (result) {
          var registrationData = {
            Provider: 'Facebook',
            ExternalAccessToken: token,
            Email: result.data.email,
            UserName: result.data.email,
            DisplayName: result.data.name,
            profilePhoto: picture
          }
          //console.log("Response Object -> " + JSON.stringify(result.data));
          AuthenticationService.saveExternalLogin(registrationData).then(function (response) {
            CommonServices.loaded();
            $ionicHistory.clearHistory();

            $scope.loginModal.hide();
            $rootScope.$broadcast('event:userLoggedIn');

            //  $state.go('home');
          });


        }, function (error) {
          CommonServices.loaded();
          CommonServices.showAlert('There was a problem getting your profile.  Check the logs for details.');
          // console.log(error);
        });
      };

    vm.resetPassworCall = function () {
      $scope.userinfo = {};

      // An elaborate, custom popup
      var resetPassword = $ionicPopup.show({
        template: '<input type="email" ng-model="vm.userinfo.name">',
        title: 'Reset Password',
        subTitle: 'Enter your email address.',
        scope: $scope,
        buttons: [
          {
            text: 'Cancel',
            type: 'button-stable',
          },
          {
            text: 'Reset',
            type: 'button-assertive',
            onTap: function (e) {
              if (!vm.userinfo.name) {
                //don't allow the user to close unless he enters email address
                e.preventDefault();
              } else {
                return vm.userinfo.name;
              }
            }
          }
        ]
      });
      resetPassword.then(function (res) {

        AuthenticationService.resetPassword(vm.userinfo.name).then(function (data) {
          CommonServices.showAlert('Please check your mail for further instruction!!');
        }, function (error) {
          CommonServices.showAlert(' further instruction!!');
        })
        ///Call API


      });
    }

  }


} ());
