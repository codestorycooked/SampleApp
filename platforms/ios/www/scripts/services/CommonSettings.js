(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.constant('MessageService', {
        networkErrorMessage: 'Unable to Connect.Please try again!',
        locationError: 'Please enable location services from settings of your phone.'
    });

}());
