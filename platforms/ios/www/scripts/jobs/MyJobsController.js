(function () {
  'use strict';
  var app = angular.module('mobApp');
  /*ngInject*/
  app.controller('MyJobsController', MyJobsController);

  /*njInject*/
  function MyJobsController($scope, CommonServices, JobsService, ENV, displayMenu) {
    var vm = this;
    vm.data = {};
    vm.jobs = true;
    vm.bids = false;
    vm.fav = false;
    vm.getPicturePath = function (filename) {
      var path = ENV.imagePath + filename;
      // console.log(path);
      return path;

    }

    var getData = function () {
      if (displayMenu == 0) {
        vm.loadPage(1);
      } else if (displayMenu == 1) {
        vm.loadPage(2);
      } else if (displayMenu == 2) {
        vm.loadPage(3);
      }
    }

    vm.loadPage = function (option) {
      console.log(option);
      if (option === 1) {
        vm.fav = false;
        vm.bids = false;
        vm.jobs = true;
        JobsService.getJobByUser(CommonServices.getUserId()).then(function (data) {
          vm.data = data;
          console.log(data);
        });

      } else if (option === 2) {
        vm.bids = true;
        vm.jobs = false;
        vm.fav = false;
        JobsService.getJobBidsByUser(CommonServices.getUserId()).then(function (data) {
          vm.bidsdata = data;
          console.log("BidsData", vm.bidsdata);
        });


      } else if (option === 3) {
        vm.jobs = false;
        vm.bids = false;
        vm.fav = true;
        JobsService.getFavoriteByUser(CommonServices.getUserId()).then(function (data) {
          vm.favdata = data;
          // console.log(data[0].job);
        });

      }
    }

    getData();
  }

})();
