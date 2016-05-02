(function(){
  'use strict';
  var app=angular.app('app');
  app.factory('LoginService',LoginService){

    function LoginService(){
      function facebookLogin(register){

      };

      function googleLogin(register){
        $cordovaOauth.google(ENV.googleClientID, ["email"]).then(function(result) {
            //  console.log('Response Object -> ' + JSON.stringify(result));
              getgoogleData(result.access_token);
            }, function(error) {
              CommonServices.showError("Error :" + error);
            });
      };

      var getgoogleData =
          function (token) {

              $http.get("https://www.googleapis.com/userinfo/v2/me", { params: { access_token: token, fields: "id,name,gender,email", format: "json" } }).then(function (result) {
                var registrationData={
                  Provider:'Google',
                  ExternalAccessToken:token,
                  Email:result.data.email,
                  UserName:result.data.email,
                   DisplayName:result.data.name
                }
                  //console.log("Response Object -> " + JSON.stringify(result.data));
                  AuthenticationService.saveExternalLogin(registrationData).then(function(response){
                    CommonServices.loaded();
                    $ionicHistory.clearHistory();

                    $scope.modal.hide();

                    $state.go('home');
                  });


              }, function (error) {
                CommonServices.loaded();
                  CommonServices.showError("There was a problem getting your profile.  Check the logs for details.");
                 // console.log(error);
              });
          }

      return {
        facebookLogin:facebookLogin,
        googleLogin:googleLogin

      }
    }
  }
})();
