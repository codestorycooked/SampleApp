(function () {
    'use strict';
    var app = angular.module('mobApp');
    /*ngInject*/
    app.controller('JobsController', JobsController);
    //app.controller('JobsFeedController', JobsFeedController);
    app.controller('JobsDetailController', JobsDetailController);
    app.controller('MediaUploadController', MediaUploadController);
    /*njInject*/
    function MediaUploadController($scope, $rootScope, jobid, CommonServices, $state, CameraFactory,
        JobsService, $cordovaActionSheet) {
        var vm = this;

        vm.laterUpload = function () {
            $state.go('app.feeds');
            CommonServices.showAlert('Do Upload Media from View My Jobs');
            CommonServices.clearHistory();

        };
    };
    /*njInject*/
    function JobsFeedController($scope, JobsService, CommonServices, $state, ENV, $ionicPlatform,
        $cordovaGeolocation, localStorageService, $ionicActionSheet, $cordovaSocialSharing) {

        var vm = this;
        vm.favorite = function () {
            CommonServices.showBanner('Added to your favorites.', 'info');
        }
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
        $scope.countries = [
            { id: 1, text: 'USA', checked: false, icon: null },
            {
                id: 2,
                text: 'France',
                checked: false,
                icon: 'https://www.zeendoc.com/wp-content/themes/zeendoc/img/french_flag_small.jpg'
            },
            { id: 3, text: 'Japan', checked: true, icon: null }];

        $scope.countries_text_single = 'Choose country';
        $scope.countries_text_multiple = 'Choose countries';
        $scope.val = { single: null, multiple: null };
        vm.data = {};
        vm.basicSearch = [{
            Id: 1,
            SearchBy: 'Latest'

        },
            {
                Id: 2,
                SearchBy: 'Nearest'

            }];
        var Initialize = function () {
            var getLastSearch = localStorageService.get('prefSearch');
            if (!getLastSearch) {
                //alert("Empty");
                vm.selectedSearch = 1;
                vm.Search = 'Latest';
            }
            else {
                //console.log(getCity);
                vm.selectedSearch = getLastSearch.Id;
                vm.Search = getLastSearch.SearchBy;
            }
            ;
        };

        vm.onChange = function (newValue, oldValue) {
            vm.selectedSearch = newValue.Id;
            vm.Search = newValue.SearchBy;
            localStorageService.set('prefSearch', {
                Id: newValue.Id,
                SearchBy: newValue.SearchBy
            });
            //console.log(localStorageService.get("prefCity"));
        };
        $scope.$watch('vm.selectedSearch', function () {
            console.log(vm.selectedSearch);
            getSearchData(vm.selectedSearch);
        });
        var getSearchData = function (id) {
            if (id === 1) {

                vm.getJobsData();
                vm.latest = true;
                vm.location = false;
            }
            else {
                getlocation();
                vm.latest = false;
                vm.location = true;
            }
        };
        var posOptions = { timeout: 10000, enableHighAccuracy: false };

        var getlocation = function () {
            $ionicPlatform.ready(function () {
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        JobsService.getJobByLocation(lat, long, 10).then(function (data) {
                            vm.data = data;
                            //console.log(data);
                        });

                    }, function (err) {

                        // JobsService.getJobByLocation('19.0759837', '72.8776559', 10).then(function(data) {
                        //     vm.data = data;
                        //     //console.log(data);
                        // });
                        CommonServices.showAlert('Unable to get Location.Please enable it from phone settings.');
                    });
            });
        };

        vm.goUpload = function () {
            $state.go('app.uploadphotos', { id: 1 });
        };

        vm.getPicturePath = function (filename) {
            var path = ENV.imagePath + filename;
            // console.log(path);
            return path;
        };
        vm.getJobsData = function () {
            JobsService.getJobs().then(function (data) {
                vm.data = data;
                console.log(data);
                console.log(data.mediaGalleries);
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.$on('event:userLoggedIn', function (e, rejection) {
            Initialize();
        })

    };

    /*njInject*/
    function JobsDetailController($state, $scope, $ionicModal, JobsService, $rootScope,
        CommonServices, $ionicActionSheet, JobID, ENV, $ionicSlideBoxDelegate) {

        var vm = this;
        vm.data = {};
        vm.fav;
        vm.favid;
        vm.toUser = CommonServices.getUserId();
        vm.jobID = JobID.id;
        vm.isUserloggedin=false;
         if (!CommonServices.isUserLoggedIn()) {
               vm.isUserloggedin=false;
            } else {
                vm.isUserloggedin=true;
            }
        
        vm.showChat = function () {
            if (!CommonServices.isUserLoggedIn()) {
                $rootScope.$broadcast('event:auth-loginRequired');
            } else {
                $state.go('app.chat', { fromUser: CommonServices.getUserId(), jobID: vm.jobID, toUser: vm.data.userId });
            }
        };
        if (JobID.user === 'false') {
            vm.isUser = false;
        } else {
            vm.isUser = true;
        }
        $scope.$on('countered', function () {
            CommonServices.showBanner('Message Sent Successfully!!');
        });

        $scope.jobid = JobID.id;
        vm.getPicturePath = function (filename) {
            console.log("ImagPAht", filename);
            var path = ENV.imagePath + filename;
            // console.log(path);
            return path;

        }
        vm.favorite = function () {
            if (vm.IsFav === false) {
                var favoriteData = {
                    userId: CommonServices.getUserId(),
                    jobId: JobID.id,
                    createdBy: CommonServices.getUserId()

                };
                JobsService.addFavorite(favoriteData).then(function (data) {
                    vm.IsFav = true;
                    vm.favid = data.id;
                    console.log('From', data);
                    vm.fav = 'Remove from Favorites';
                });
            } else {
                JobsService.removeFavorite(vm.favid).then(function (data) {
                    vm.IsFav = false;
                    console.log(data);
                    vm.fav = "Add To Favorites";
                });
            }
        };
        vm.IsFav = false;
        vm.getJobsDetails = function () {
            JobsService.getJobDetail(JobID.id).then(function (data) {
                vm.data = data;
                vm.subcat = vm.data.jobCategory1.jobSubCategories;
                if (vm.data.favorites.length === 0) {
                    vm.fav = 'Add To Favorites';
                    vm.IsFav = false;
                } else {
                    vm.fav = 'Remove from Favorites';
                    vm.IsFav = true;
                    vm.favid = data.favorites[0].id;
                    console.log(data.favorites.id);
                }
                console.log(data);
            });
        };
        vm.counterJob = function () {
            if (!CommonServices.isUserLoggedIn()) {
                $rootScope.$broadcast('event:auth-loginRequired');
            } else {
                $state.go('app.counter');
            }
        };
        vm.getJobsDetails();

        vm.showImage = function (imageName) {
            console.log(imageName);
            if (imageName) {
                $scope.imageArray = vm.data.mediaGalleries;
                $scope.imageURL = ENV.imagePath;
                console.log($scope.imageArray);
                $scope.imagesrc = imageName;
                $scope.fullImage.show();
                $ionicSlideBoxDelegate.update();
            }
            ;
        };

        vm.showCounter = function () {
            if (!CommonServices.isUserLoggedIn()) {
                $rootScope.$broadcast('event:auth-loginRequired');
            } else {
                $scope.counter.show();
            }
        };

        vm.showInterested = function () {
            if (!CommonServices.isUserLoggedIn()) {
                $rootScope.$broadcast('event:auth-loginRequired');
            } else {
                $scope.interested.show();
            }
        };
        vm.showQuestions = function () {
            if (!CommonServices.isUserLoggedIn()) {
                $rootScope.$broadcast('event:auth-loginRequired');
            } else {
                $scope.questions.show();
            }
        };

        $scope.closeFullImage = function () {
            $scope.fullImage.hide();
            $scope.imagesrc = undefined;
        };


        //Action Sheet
        vm.showActions = function () {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: vm.fav },
                    { text: 'Share this' }
                ],
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (index === 0) {
                        vm.favorite();
                    }
                    if (index === 1) {
                        alert('Shared');
                    }
                    return true;
                }
            });
        };
        //Template
        $ionicModal.fromTemplateUrl('templates/fullimage.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.fullImage = modal;
        });

        $ionicModal.fromTemplateUrl('templates/interested.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.interested = modal;
        });
        $ionicModal.fromTemplateUrl('templates/counter.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.counter = modal;
        });

        $ionicModal.fromTemplateUrl('templates/questions.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.questions = modal;
        });
        $scope.$on('$destroy', function () {
            $scope.fullImage.remove();
            $scope.interested.remove();
            $scope.questions.remove();
            $scope.counter.remove();
        });

    }

    /*ngInject*/
    function JobsController($scope, JobsService, $state, $ionicModal,
        CommonServices, $cordovaGeolocation, $cordovaActionSheet, CameraFactory) {
        var vm = this;

        function categories() {
            JobsService.getCategories().then(function (data) {
                vm.categories = data;
            });
        }

        vm.subcategories = {};
        function workQualitys() {
            JobsService.getWorkQuality().then(function (data) {
                vm.workQuality = data;
            });
        }

        function jobstatus() {
            JobsService.getJobStatus().then(function (data) {
                vm.jobStatus = data;
            });
        }

        categories();
        workQualitys();
        jobstatus();
        vm.jobsForm = {};


        //Get CurrentLocation
        vm.useLocation = true;
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        var getCurrentLocation = function () {
            if (vm.useLocation) {
                $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                    vm.jobsForm.latitude = position.coords.latitude
                    vm.jobsForm.longitude = position.coords.longitude
                    console.log(position);
                }, function (err) {
                    vm.jobsForm.latitude = '';
                    vm.jobsForm.longitude = '';
                    CommonServices.showAlert('Unable to Get Current Location.Please fill address or enable location services from Settings');
                });
            }
            else {
                console.log('Using Address');
            }
        };
        getCurrentLocation();
        $ionicModal.fromTemplateUrl('templates/alternateaddress.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            console.log(modal);
            $scope.modalAddress = modal;
        });
        vm.showAlternateAddress = function () {
            $scope.modalAddress.show();

        }
        vm.AddresButtonText = "Tap to add Alternate Addres";
        $scope.saveAddress = function () {
            $scope.modalAddress.hide();
            if (!vm.jobsForm.address) {
                vm.AddresButtonText = "Tap to add Alternate Addres";
            }
            else {
                vm.AddresButtonText = "Tap to Edit Address";
            }
        }

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        vm.createJob = function () {
            var arryaobj = '';
            vm.jobsForm.jobsSubCategories = '';
            console.log(vm.jobsForm.jobsSubCategory);
            var arryaobj = vm.jobsForm.jobsSubCategory;

            if (arryaobj) {
                var jobSubCategory = [];


                for (var key in arryaobj) {
                    jobSubCategory.push({ jobId: -1, subCategoryId: arryaobj[key] });
                }
                vm.jobsForm.jobsSubCategories = jobSubCategory;


                //console.log(JSON.stringify(jobSubCategory));
                //console.log(JSON.stringify(vm.jobsForm.jobsSubCategories));
                vm.jobsForm.userId = CommonServices.getUserId();
                vm.jobsForm.materialCost = '0';
                vm.jobsForm.jobStatusID = '1';
                vm.jobsForm.totalViews = 0;
                vm.jobsForm.totalInterests = 0;
                vm.jobsForm.isPhonePublic = true;
                vm.jobsForm.contactNumber = '1234567';
                vm.jobsForm.workQualityID = '1';
                vm.jobsForm.isAddressPublic = true;
                if (!vm.jobsForm.pincode) {
                    vm.jobsForm.pincode = '00000';
                }
                //$state.go('app.uploadphotos');
                console.log(vm.jobsForm);
                // console.log("OmageLeg", image.length);
                if (image.length === 0) {
                    CommonServices.showAlert('Pleae upload minimum 1 image.');
                } else {
                    JobsService.createJob(vm.jobsForm).then(function (data) {
                        console.log(JSON.stringify(data));

                        vm.jobsForm = {};

                        uploadImage(data.id);

                        // $state.go("app.uploadphotos", { id: data.id });


                    });
                }
            } else {
                CommonServices.showAlert('Please select atleast one category');

            }
        };

        vm.cancel = function () {
            $state.go('app.feeds');
        };

        vm.getSubCategories = function () {
            JobsService.getSubCategories(vm.jobsForm.jobCategory).then(function (data) {
                console.log(data.jobSubCategories);
                vm.subcategories = data.jobSubCategories;
            });
        };


        var image = [];
        vm.imagethumb = [];
        var imagecount = 0;
        //Dispalay Action Sheet
        var options = {
            title: 'Select Image',
            buttonLabels: [
                'Take Picture',
                'Upload Photos'
            ],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true
        };
        var saveImagetoServer = function (key) {

            CameraFactory.toBase64Image(vm.imagePath).then(function (_result) {
                var base64 = _result.imageData;
                var actualImage = _result.imageData;
                if (image) {
                    image[key] = actualImage;
                    console.log("Server Image Changed");
                }
                else {
                    image.push(actualImage);
                    console.log("Server image pushed");
                }
                imagecount = imagecount + 1;
                //console.log(image);

            }, function (_error) {
                //console.log(_error);
                CommonServices.showError('Unable to capture Photo ' + JSON.stringify(_error, null, 2));
            });
        };

        //Thumbnail
        var makeThumbNail = function (key) {

            CameraFactory.resizeImage(vm.imagePath).then(function (_result) {
                vm.thumb = 'data:image/jpeg;base64,' + _result.imageData;
                if (vm.imagethumb) {
                    vm.imagethumb[key] = vm.thumb;
                    // console.log("Thumb image changed");
                } else {
                    vm.imagethumb.push(vm.thumb);
                    // console.log("thmumb image pushed");
                }
                //console.log(vm.imagethumb);
            }, function (_error) {
                CommonServices.showError(_error);
            });
        };

        vm.uploadedFilename = undefined;
        vm.showPictureOptions = function (key) {

            $cordovaActionSheet.show(options).then(function (btnIndex) {

                switch (btnIndex) {
                    case 1:

                        //Open Camera
                        var picOptions = {
                            destinationType: navigator.camera.DestinationType.FILE_URI,
                            quality: 85,
                            targetWidth: 400,
                            targetHeight: 400


                        };

                        CommonServices.loading();
                        CameraFactory.getPicture(picOptions).then(function (imageURI) {
                            //console.log(imageURI);
                            vm.imagePath = imageURI;

                            makeThumbNail(key);
                            saveImagetoServer(key);
                            CommonServices.loaded();

                        }, function (err) {
                            CommonServices.loaded();
                            //console.log(err);

                            CommonServices.showAlert(err);
                        });
                        //Handle Share Button
                        return true;
                    case 2:

                        var picOptions2 = {
                            destinationType: navigator.camera.DestinationType.FILE_URI,
                            quality: 85,
                            targetWidth: 400,
                            targetHeight: 400,
                            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                        };

                        CommonServices.loading();
                        CameraFactory.getPictureFromGallery(picOptions2).then(function (imageURI) {
                            //console.log(imageURI);

                            var s = imageURI;
                            var n = s.indexOf('?');
                            s = s.substring(0, n != -1 ? n : s.length);
                            vm.imagePath = s;
                            makeThumbNail(key);
                            saveImagetoServer(key);
                            CommonServices.loaded();

                        }, function (err) {
                            CommonServices.loaded();
                            //console.log(err);

                            CommonServices.showAlert(err);

                        });

                        return true;
                }
            });
        };


        var uploadImage = function (jobid) {

            var jobId = jobid;
            //alert(jobId);
            var counter = 0;

            // console.log(image);
            if (image) {
                for (var key in image) {
                    console.log(image[key]);
                    counter = counter + 1;
                    var imageModel = {
                        jobID: jobId,
                        mediaType: 1,
                        fileName: image[key]

                    }
                    JobsService.uploadImage(imageModel).then(function (data) {

                        if (imagecount === counter) {

                            $state.go('app.myjobsmain');
                            CommonServices.showAlert('Job Created!');
                            CommonServices.clearHistory();
                            image = [];
                            counter = 0;

                        }

                    }, function (erro) {
                        CommonServices.showAlert(JSON.stringify(erro));
                    })

                }
            }
        };
    }
})();
