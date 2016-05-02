(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.factory('NotificationService', NotificationService);
    /*ngInject*/
    function NotificationService($q, $http, ENV, CommonServices) {
        var serviceBase = ENV.apiUrl;



        //Get Messages
        function getNotifications() {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'Notifications?userid=' + CommonServices.getUserId();

            $http.get(url, { cache: false }).success(function (data) {
                deferred.resolve(data);

            }).error(function (err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }
        
        return{
            getNotifications:getNotifications
        }

    }

})();