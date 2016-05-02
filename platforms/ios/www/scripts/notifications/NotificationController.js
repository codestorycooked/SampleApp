(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.controller('NotificationController', NotificationController);
    /*ngInject*/
    function NotificationController($scope, CommonServices, NotificationService) {
        var vm = this;
        vm.message = "unals";
        var getNotifications = function () {
            NotificationService.getNotifications().then(function (data) {
                vm.notification = data;
                console.log(data);
            })
        }
        getNotifications();
    }
})();