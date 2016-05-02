(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.factory('CommonServices', CommonServices);
    /*ngInject*/
    function CommonServices($q, $http, $ionicLoading, localStorageService, ENV,
        $ionicPopup, $ionicHistory, $ionicContentBanner) {
        function Loading() {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-energized" icon="spiral"></ion-spinner><br/> Jobs App',
                noBackdrop: false
            });
        }
        function Loaded() {
            $ionicLoading.hide();
        }

        function showAlert(message, title) {
            $ionicPopup.alert({
                title: 'Name your price',
                template: message,
                okType: 'button-assertive'
            });

        }
        function clearHistory() {
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });

        }

        function savePlayerID(playerId) {
           
            localStorageService.set('playerID', playerId);
        }
        //Create JobsService
        function updatePlayerID(aspnetUser) {
            var defferred = $q.defer();
            var url = serviceBase + "Notifications/PutPlayerID";


            $http.put(url, jobsData).success(function (data) {

                //CommonServices.showAlert("Job Created Successfully!!");
                defferred.resolve(data);
            }).error(function (error) {

                CommonServices.showAlert(JSON.stringify(error));
                defferred.reject();
            });

            return defferred.promise;
        }

        //Is Authentication Token Present
        function isUserLoggedIn() {
            var authData = localStorageService.get('authorizationData');
            //console.log(authData);
            if (authData) {
                return true;
            } else {

                return false;
            }
        };

        function getUserId() {
            var authData = localStorageService.get('authorizationData');
            if (authData) {

                return authData.userId;
            } else {
                return null;
            }
        }
        function showBanner(message, bannerType) {
            $ionicContentBanner.show({
                text: [message],
                interval: 3000,
                autoClose: 5000,
                type: bannerType

            });
        }

        return {
            loading: Loading,
            loaded: Loaded,
            showAlert: showAlert,
            isUserLoggedIn: isUserLoggedIn,
            getUserId: getUserId,
            clearHistory: clearHistory,
            showBanner: showBanner,
            updatePlayerID: updatePlayerID,
            savePlayerID:savePlayerID


        };
    };

} ());
