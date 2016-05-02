(function() {
    'use strict';
    var app = angular.module('mobApp');

    app.factory('JobsService', JobsService);
    /*ngInject*/
    function JobsService($q, $http, ENV, CommonServices) {
        var serviceBase = ENV.apiUrl;
        //Create JobsService
        function createJob(jobsData) {
            var defferred = $q.defer();
            var url = serviceBase + "/Jobs";


            $http.post(url, jobsData).success(function(data) {

                //CommonServices.showAlert("Job Created Successfully!!");
                defferred.resolve(data);
            }).error(function(error) {

                CommonServices.showAlert(JSON.stringify(error));
                defferred.reject();
            });

            return defferred.promise;
        }


        //Create JobsService
        function createBid(jobsData) {
            var defferred = $q.defer();
            var url = serviceBase + "/JobBids?fromuserid="+CommonServices.getUserId();


            $http.post(url, jobsData).success(function(data) {

                //CommonServices.showAlert("Job Created Successfully!!");
                defferred.resolve(data);
            }).error(function(error) {

                CommonServices.showAlert(JSON.stringify(error));
                defferred.reject();
            });

            return defferred.promise;
        }


        //Create Favroite
        function addFavorite(jobsData) {
            var defferred = $q.defer();
            var url = serviceBase + "/favorites";


            $http.post(url, jobsData).success(function(data) {

                //CommonServices.showAlert("Job Created Successfully!!");
                defferred.resolve(data);
            }).error(function(error) {

                CommonServices.showAlert(JSON.stringify(error));
                defferred.reject();
            });

            return defferred.promise;
        }

        //delte Favroite
        function removeFavorite(id) {
            var defferred = $q.defer();
            var url = serviceBase + "favorites/DeletebyUser?favid=" + id + "&userid=" + CommonServices.getUserId();


            $http.get(url).success(function(data) {

                defferred.resolve(data);
            }).error(function(error) {

                CommonServices.showAlert(JSON.stringify(error));
                defferred.reject();
            });

            return defferred.promise;
        }


        //Create JobsService
        function uploadImage(imagedata) {
            var defferred = $q.defer();
            var url = serviceBase + "/MediaGalleries";


            $http.post(url, imagedata).success(function(data) {

                //CommonServices.showAlert("Job Created Successfully!!");
                defferred.resolve(data);
            }).error(function(error) {

                CommonServices.showAlert(JSON.stringify(error));
                defferred.reject();
            });

            return defferred.promise;
        }

        //Get SubCategories
        function getCategories() {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'JobCategories';
            //var url = "http://localhost:53977/odata/AnimalTypes";
            console.log(url);

            $http.get(url, { cache: true }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });

            return deferred.promise;
        }


        //Get Categories
        function getSubCategories(id) {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'JobCategories?id=' + id;
            //var url = "http://localhost:53977/odata/AnimalTypes";
            console.log(url);

            $http.get(url, { cache: true }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }

        //Get Favorites by user
        function getFavoriteByUser(id) {
            var deferred = $q.defer();
            //var url = ENV.apiUrl + 'favorites/GetByUser?userid=' + id;
            var url = ENV.apiUrl + 'favorites?id=' + id;

            console.log(url);

            $http.get(url, { cache: false }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }


        //Get SubCategories
        function getWorkQuality() {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'WorkQualities';
            //var url = "http://localhost:53977/odata/AnimalTypes";
            console.log(url);

            $http.get(url, { cache: true }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                // CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }

        //Get SubCategories
        function getJobStatus() {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'JobStatus';
            //var url = "http://localhost:53977/odata/AnimalTypes";
            console.log(url);

            $http.get(url, { cache: true }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }

        //Get Lates Jobs
        function getJobs(jobsData) {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'Jobs';
            //var url = "http://localhost:53977/odata/AnimalTypes";
            console.log(url);

            $http.get(url, { cache: false }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });

            return deferred.promise;
        }

        //GetJobs Detail

        function getJobDetail(id) {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'Jobs?id=' + id;
            //var url = "http://localhost:53977/odata/AnimalTypes";
            console.log(url);

            $http.get(url, { cache: false }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }

        //GetJobs Detail by user

        function getJobByUser(id) {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'Jobs/GetJobByUser?userid=' + id;
            //var url = "http://localhost:53977/odata/AnimalTypes";
            console.log(url);

            $http.get(url, { cache: false }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }


        //GetJobs Detail by user

        function getJobByLocation(lat, long, radius, categoryList, date, pageNo) {
            // alert(2);
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'Jobs?lat=' + lat + '&lng=' + long + '&radius=' +
                radius + '&categoryList=' + categoryList +
                '&date=' + date + '&pageNo=' + pageNo + '&pageSize=5';
            //var url = "http://localhost:53977/odata/AnimalTypes";
            console.log(url);

            $http.get(url, { cache: false }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }


        //GetJobs Detail by user

        function getJobBidsByUser(id) {
            var deferred = $q.defer();
            var url = ENV.apiUrl + 'JobBids/GetJobBidsByUser?userid=' + id;
            //var url = "http://localhost:53977/odata/AnimalTypes";
            console.log(url);

            $http.get(url, { cache: false }).success(function(data) {
                deferred.resolve(data);

            }).error(function(err) {
                deferred.reject();

                CommonServices.showAlert(JSON.stringify(err));
                //CommonServices.showError(MessageService.networkErrorMessage);
            });
            return deferred.promise;
        }



        return {
            createJob: createJob,
            getCategories: getCategories,
            getSubCategories: getSubCategories,
            getWorkQuality: getWorkQuality,
            getJobStatus: getJobStatus,
            getJobs: getJobs,
            getJobDetail: getJobDetail,
            uploadImage: uploadImage,
            getJobByUser: getJobByUser,
            createBid: createBid,
            getJobBidsByUser: getJobBidsByUser,
            getJobByLocation: getJobByLocation,
            removeFavorite: removeFavorite,
            addFavorite: addFavorite,
            getFavoriteByUser: getFavoriteByUser

        }
    }
})();
