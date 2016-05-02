(function () {
  'use strict';
  var app = angular.module('mobApp');
  app.controller('QuestionController', QuestionController);
  function QuestionController($scope, CommonServices, $state) {
    var vm = this;
    vm.closeModal = function () {
      $scope.questions.hide();
    }
  }
}());
