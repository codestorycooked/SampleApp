(function () {
  'use strict';
  var app = angular.module('mobApp');
  app.controller('CounterController', CounterController);
  function CounterController($scope, CommonServices, $state, JobsService, $rootScope) {
    var vm = this;
    vm.closeModal = function () {
      $scope.counter.hide();
    }
    vm.startDate = undefined;
    vm.startTime = undefined;
    vm.endDate = undefined;
    vm.endTime = undefined;

    vm.datepickerObject = {
      inputDate: new Date(),
      mondayFirst: true,
      callback: function (val) {
        datePickerCallback(val);
      },
      dateFormat: 'MM-dd-yyyy',
      closeOnSelect: true,
    };

    var datePickerCallback = function (val) {
      if (typeof (val) === 'undefined') {
        CommonServices.showAlert('No date selected');
      } else {
        vm.datepickerObject.inputDate = val;
        vm.startDate = val.getUTCMonth() + "/" + val.getUTCDate() + "/" + val.getUTCFullYear();
        console.log(vm.startDate);
      }
    };

    //End Date
    vm.datepickerObjectEnd = {
      inputDate: new Date(),
      mondayFirst: true,
      callback: function (val) {
        datePickerCallbackEnd(val);
      },
      dateFormat: 'MM-dd-yyyy',
      closeOnSelect: true,
    };

    var datePickerCallbackEnd = function (val) {
      if (typeof (val) === 'undefined') {
        CommonServices.showAlert('No date selected');
      } else {
        vm.datepickerObjectEnd.inputDate = val;
        vm.endDate = val.getUTCMonth() + "/" + val.getUTCDate() + "/" + val.getUTCFullYear();
        console.log(vm.endDate);
      }
    };

    //Time
    $scope.timePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 30,  //Optional
      format: 12,  //Optional
      titleLabel: '12-hour Format',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-assertive',  //Optional
      closeButtonType: 'button-assertive',  //Optional
      callback: function (val) {    //Mandatory
        timePickerCallback(val);
      }
    };
    function timePickerCallback(val) {
      if (typeof (val) === 'undefined') {
        CommonServices.showAlert('Time not selected');
      } else {
        var selectedTime = timerconverter(val, 'time');
        $scope.timePickerObject.inputEpochTime = val;
        vm.startTime = selectedTime;
        console.log(vm.startTime);
        //  console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
      }
    }

    //End time
    $scope.timePickerObjectEnd = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 30,  //Optional
      format: 12,  //Optional
      titleLabel: '12-hour Format',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-assertive',  //Optional
      closeButtonType: 'button-assertive',  //Optional
      callback: function (val) {    //Mandatory
        timePickerCallbackEnd(val);
      }
    };
    function timePickerCallbackEnd(val) {
      if (typeof (val) === 'undefined') {
        CommonServices.showAlert('Time not selected');
      } else {
        var selectedTime = timerconverter(val, 'time');
        $scope.timePickerObjectEnd.inputEpochTime = val;
        vm.endTime = selectedTime;
        console.log(selectedTime);
        // console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
      }
    }

    vm.sendMessage = function () {
      vm.bidForm = {
        jobId: $scope.jobid,
        interested: false,
        startDateTime: !vm.startDate ? new Date() : vm.startDate + " " + vm.startTime,
        endDateTime: !vm.endDate ? new Date() : vm.endDate + " " + vm.endTime,
        laborCost: vm.jobsForm.laborcost,
        materialCost: '0',
        scopeCalification: vm.jobsForm.jobDescription,
        transport: true,
        address: vm.jobsForm.address,
        isAddressPublic: true,
        // dateAdded: "2016-03-06T00:46:28.0367936+05:30",
        // dateModified: "2016-03-06T00:46:28.0367936+05:30",
        userId: CommonServices.getUserId(),
      };
      if (vm.startDate === undefined || vm.startTime === undefined || vm.endDate === undefined || vm.endTime === undefined) {
        CommonServices.showAlert('Please select Start & End Date(Time)');
      } else {
        console.log(vm.bidForm);
        JobsService.createBid(vm.bidForm).then(function (data) {
          $scope.counter.hide();
          $rootScope.$broadcast('countered');
        });
      }

    }


    var timerconverter = function epochParser(val, opType) {

      if (val === null) {
        return "00:00";
      } else {
        var meridian = ['AM', 'PM'];

        if (opType === 'time') {
          var hours = parseInt(val / 3600);
          var minutes = (val / 60) % 60;
          var hoursRes = hours > 12 ? (hours - 12) : hours;

          var currentMeridian = meridian[parseInt(hours / 12)];

          return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
        }
      }
    }
    
    var prependZero = function prependZero(param) {
      if (String(param).length < 2) {
        return "0" + String(param);
      }
      return param;
    }



  }
})();
