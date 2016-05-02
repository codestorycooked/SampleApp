(function () {
    'use strict';
    var app = angular.module('mobApp');
    app.factory('CameraFactory', CameraFactory);

    /*ngInject*/
    function CameraFactory($q, CommonServices) {

        var getPictureFromGallery = function (options) {
            var q = $q.defer();

            navigator.camera.getPicture(function (result) {
                // Do any magic you need
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            }, options);

            return q.promise;
        }


        var getPicture = function (options) {
            var q = $q.defer();

            navigator.camera.getPicture(function (result) {
                // Do any magic you need
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            }, options);

            return q.promise;
        }


        var resizeImage = function (img_path) {
            var q = $q.defer();
            window.imageResizer.resizeImage(function (success_resp) {
                // console.log('success, img re-size: ' + JSON.stringify(success_resp));
                q.resolve(success_resp);
            }, function (fail_resp) {
                console.log('fail, img re-size: ' + JSON.stringify(fail_resp));
                q.reject(fail_resp);
            }, img_path, 0.5, 0.5, {
                    imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                    resizeType: ImageResizer.RESIZE_TYPE_FACTOR,
                    pixelDensity: true,
                    storeImage: false,
                    photoAlbum: false,
                    format: 'jpg'
                });

            return q.promise;
        }

        var toBase64Image = function (img_path) {
            //console.log(img_path);
            var q = $q.defer();
            window.imageResizer.resizeImage(function (success_resp) {
                //  console.log('success, img toBase64Image: ' + JSON.stringify(success_resp));
                q.resolve(success_resp);
            }, function (fail_resp) {
                console.log('fail, img toBase64Image: ' + JSON.stringify(fail_resp));
                q.reject(fail_resp);
            }, img_path, 1, 1, {
                    imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                    resizeType: ImageResizer.RESIZE_TYPE_FACTOR,
                    format: 'jpg'
                });

            return q.promise;
        }

        return {
            getPictureFromGallery: getPictureFromGallery,
            getPicture: getPicture,
            resizeImage: resizeImage,
            toBase64Image: toBase64Image


        }

    }


})();
