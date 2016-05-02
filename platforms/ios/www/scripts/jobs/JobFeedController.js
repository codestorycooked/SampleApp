(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.controller('JobsFeedController', JobsFeedController);
    /*njInject*/
    function JobsFeedController($scope,$rootScope, JobsService, CommonServices, $state, ENV, $ionicPlatform,
        $cordovaGeolocation, localStorageService, $ionicActionSheet, $cordovaSocialSharing, $ionicModal,
        $ionicScrollDelegate) {

        var vm = this;
        vm.imagePath = ENV.imagePath;
        console.log(vm.imagePath);
        vm.favorite = function () {
            CommonServices.showBanner('Added to your favorites.', 'info');
        }

        vm.search = function () {
            alert('Coming soon');
        }
        //Crate Filter Modal
        $ionicModal.fromTemplateUrl('templates/jobfilter.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.jobFiltermodal = modal;
            $scope.jobFiltermodal.date = "1";

        });
        $scope.getCategories = function () {
            JobsService.getCategories().then(function (data) {
                $scope.categories = data;

                console.log(data);
            })
        }
        $scope.value = 1;
        $scope.selectedCategories = [];
        $scope.choice, $scope.searchText;
        $scope.selectedCategory = function (category) {

            var idx = $scope.selectedCategories.indexOf(category)
            if (idx > -1)
                $scope.selectedCategories.splice(idx, 1)
            else
                $scope.selectedCategories.push(category)
        }
        $scope.getCategories();


        $scope.openModal = function () {
            $scope.jobFiltermodal.show();
        };
        $scope.cancel = function () {
            $scope.jobFiltermodal.hide();
        }
        $scope.closeModal = function () {
            $scope.jobFiltermodal.hide();
            console.log('sort', $scope.jobFiltermodal.date);
            if ($scope.jobFiltermodal.date === '0')
                vm.showDistance = true;
            else vm.showDistance = false;
            console.log(vm.showDistance);
            vm.pageNo = 1;
            //vm.nodataAvailable = false;
            //   console.log('categories', $scope.selectedCategories.toString());
            vm.getlocation();

        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.jobFiltermodal.remove();
        });

        vm.share = function (item) {
            console.log(item);
            $cordovaSocialSharing
                .share(item.jobTitle + "-" + item.jobDescription, item.jobTitle, null, null) // Share via native share sheet
                .then(function (result) {
                    CommonServices.showBanner('Thanks for sharing!!', 'info');
                }, function (err) {
                    CommonServices.showBanner(err, 'error');
                });
        }
        vm.refresh = function () {
            vm.pageNo = 1;
            // vm.nodataAvailable = false;
            vm.getlocation();
            $scope.$broadcast('scroll.refreshComplete');

        }
        vm.createjob = function () {
            if (!CommonServices.isUserLoggedIn()) {
                $rootScope.$broadcast('event:auth-loginRequired');
            } else {
                $state.go('app.createjob');
            }
        }


        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        vm.pageNo = 1;

        vm.getlocation = function () {
            // alert('called');
            vm.data = [];
            $ionicPlatform.ready(function () {
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        JobsService.getJobByLocation(lat, long, 25000, $scope.selectedCategories.toString(),
                            $scope.jobFiltermodal.date, vm.pageNo).then(function (data) {
                                vm.data = data.data;

                                vm.pageCount = data.paging.pageCount;

                                console.log('PageCount', vm.pageCount);
                                console.log('TotlRecord', data.paging.totalRecordCount);
                            });
                    }, function (err) {
                        console.log(err);
                        // var lat = '18.629781';
                        // var long = '73.799709';
                        // JobsService.getJobByLocation(lat, long, 25000, $scope.selectedCategories.toString(),
                        //     $scope.jobFiltermodal.date, vm.pageNo).then(function (data) {
                        //         vm.data = data.data;

                        //         vm.pageCount = data.paging.pageCount;

                        //         console.log('PageCount', vm.pageCount);
                        //         console.log('TotlRecord', data.paging.totalRecordCount);
                        //     });
                        // $scope.$broadcast('scroll.refreshComplete');
                        CommonServices.showAlert('Unable to get Location.Please enable it from phone settings.');
                    });
            });
            $ionicScrollDelegate.scrollTop();
        };
        // vm.nodataAvailable = false;
        vm.loadMore = function () {
            if (vm.pageNo === vm.pageCount) {
                //do Nothing
                vm.nodataAvailable = true;
            } else {
                vm.nodataAvailable = false;
                vm.pageNo = vm.pageNo + 1;
                $ionicPlatform.ready(function () {
                    $cordovaGeolocation
                        .getCurrentPosition(posOptions)
                        .then(function (position) {
                            var lat = position.coords.latitude;
                            var long = position.coords.longitude;
                            JobsService.getJobByLocation(lat, long, 25000, $scope.selectedCategories.toString(),
                                $scope.jobFiltermodal.date, vm.pageNo).then(function (data) {
                                    console.log(data);

                                    vm.data = vm.data.concat(data.data);

                                    vm.pageCount = data.paging.pageCount;
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                    console.log(data.paging.pageCount);

                                });
                        }, function (err) {
                            console.log(err);
                            //  $scope.$broadcast('scroll.infiniteScrollComplete');
                            CommonServices.showAlert('Unable to get Location.Please enable it from phone settings.');
                        });
                });
            }
            // $ionicScrollDelegate.scrollTop();
        }

        vm.getlocation();

    }

})();