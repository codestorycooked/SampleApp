(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.controller('MapController', MapController);
    /*ngInject */
    function MapController($scope, Direction,CommonServices) {
        var vm = this;
        console.log(Direction);
        vm.name=Direction.name
        vm.marker = {
            coords: {
                latitude: Direction.lat,
                longitude: Direction.lng
            },
            show: false,
            id: 0
        };
        vm.map = {
            center: {
                latitude: Direction.lat,
                longitude: Direction.lng
            },
            zoom: 14
        };
        console.log(vm.map);
        console.log(vm.marker);

        // //Open Maps
        // var destination=[Direction.lat,Direction.lng];
        // //Get current Location
        // var currentLocation=CommonServices.getCurrentLocation();
        //
        // vm.getDrivingDirection = function () {
        //
        //     CommonServices.getDrivingDirections(currentLocation, destination);
        // };
    }


})();
