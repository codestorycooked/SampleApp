(function () {
  'use strict';
  var app = angular.module('mobApp');
  app.controller('InterestedController', InterestedController);
  function InterestedController($scope, CommonServices, $state) {
    var vm = this;
    vm.closeModal = function () {
      $scope.interested.hide();
    }
    vm.startDate = "Start Date";
    vm.startTime = "Start Time";
    vm.endDate = "End Date";
    vm.endTime = "End Time"
    $scope.datepickerObject = {
      titleLabel: 'Title',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Select',  //Optional
      setButtonType: 'button-assertive',  //Optional
      todayButtonType: 'button-assertive',  //Optional
      closeButtonType: 'button-assertive',  //Optional
      inputDate: new Date(),  //Optional
      mondayFirst: true,  //Optional
      //  disabledDates: disabledDates, //Optional
      //  weekDaysList: weekDaysList, //Optional
      //  monthList: monthList, //Optional
      templateType: 'modal', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar-assertive', //Optional
      modalFooterColor: 'bar-assertive', //Optional
      // from: new Date(2012, 8, 2), //Optional
      //to: new Date(2018, 8, 25),  //Optional
      callback: function (val) {  //Mandatory
        datePickerCallback(val);
      },
      dateFormat: 'MM-dd-yyyy', //Optional
      closeOnSelect: true, //Optional
    };

    var datePickerCallback = function (val) {
      if (typeof(val) === 'undefined') {
        CommonServices.showAlert('No date selected');
      } else {
        vm.startDate = val;

      }
    };

    //End Date
    $scope.datepickerObjectEnd = {
      titleLabel: 'Title',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Select',  //Optional
      setButtonType: 'button-assertive',  //Optional
      todayButtonType: 'button-assertive',  //Optional
      closeButtonType: 'button-assertive',  //Optional
      inputDate: new Date(),  //Optional
      mondayFirst: true,  //Optional
      //  disabledDates: disabledDates, //Optional
      //  weekDaysList: weekDaysList, //Optional
      //  monthList: monthList, //Optional
      templateType: 'modal', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar-assertive', //Optional
      modalFooterColor: 'bar-assertive', //Optional
      // from: new Date(2012, 8, 2), //Optional
      //to: new Date(2018, 8, 25),  //Optional
      callback: function (val) {  //Mandatory
        datePickerCallbackEnd(val);
      },
      dateFormat: 'MM-dd-yyyy', //Optional
      closeOnSelect: true, //Optional
    };

    var datePickerCallbackEnd = function (val) {
      if (typeof(val) === 'undefined') {
        CommonServices.showAlert('No date selected');
      } else {
        vm.startDate = val;

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
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
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
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
      }
    }

    vm.sendMessage = function () {
      CommonServices.showAlert('Message Sent Successfully');
      CommonServices.clearHistory();
      $state.go('app.feeds');
    }


  }
})();
