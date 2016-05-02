(function () {
    'use strict';

    var app = angular.module('mobApp', ['ionic', 'ngCordova', 'ionic-material',
        'ngCordovaOauth', 'LocalStorageModule', 'http-auth-interceptor', 'config',
        'uiGmapgoogle-maps', 'angular-cache', 'ionicLazyLoad', 'monospaced.elastic',
        'ionic-datepicker', 'ionic-timepicker', 'angularMoment', 'ionic-modal-select'
        , 'ion-floating-menu', 'ng-mfb', 'jett.ionic.content.banner'])

    app.run(function ($ionicPlatform, $http, CacheFactory, $rootScope, CommonServices) {
        $rootScope.$on('loading:show', function () {
            CommonServices.loading();
        });

        $rootScope.$on('loading:hide', function () {
            CommonServices.loaded();
        });
        $http.defaults.cache = CacheFactory('defaultCache', {
            maxAge: 60 * 60 * 1000, // Items added to this cache expire after 15 minutes
            cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour
            deleteOnExpire: 'aggressive',// Items will be deleted from this cache when they expire
            storageMode: 'localStorage',
            storagePrefix: 'jobs.'
        });
        //CommonServices.savePlayerID('1212');
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            var notificationOpenedCallback = function (jsonData) {
                console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
            };
            window.plugins.OneSignal.init("516f17e6-4f24-11e5-a362-cfb13be9db45",
                { googleProjectNumber: "181436402664" },
                notificationOpenedCallback);

            // Show an alert box if a notification comes in when the user is in your app.
            window.plugins.OneSignal.enableInAppAlertNotification(true);


            window.plugins.OneSignal.getIds(function (ids) {

                CommonServices.savePlayerID(ids.userId);
               // alert(ids.userId);
            }); 
        });
    })

    app.config(function ($stateProvider, $urlRouterProvider,
        $httpProvider, $ionicConfigProvider, $compileProvider,
        uiGmapGoogleMapApiProvider) {
        $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left');
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
        //Whitelisting
        //  $ionicConfigProvider.scrolling.jsScrolling(false);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(http|https|file|blob|cdvfile|content):|data:image\//);
        //$ionicConfigProvider.backButton.text('Back');
        //$ionicConfigProvider.platform.ios.backButton.text('Back');
        $httpProvider.interceptors.push('authInterceptorService');
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDPYuTUgAKeijSq-a9UHtqi9fVCSVqK88c',
            v: '3.20',
            //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });


        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                cache:false,
                templateUrl: 'templates/menu.html',
                controller: 'AppController as vm'
            })
            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginController as vm'
                    }
                }
            })
            .state('app.chat', {
                url: '/chat?fromUser&jobID&toUser&cid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chat.html',
                        controller: 'ChatsController as vm',
                        resolve: {
                            userDetails: function ($stateParams) {
                                var values = {
                                    fromUser: $stateParams.fromUser,
                                    jobID: $stateParams.jobID,
                                    toUser: $stateParams.toUser,
                                    cid: $stateParams.cid

                                };
                                console.log(values);
                                return values;
                            }
                        }
                    }
                }
            })
            .state('app.favorites', {
                url: '/favorites',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/favorites.html'
                        // controller: 'LoginController as vm'
                    }
                }
            })
            .state('app.mybids', {
                url: '/mybids',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/mybids.html'
                        // controller: 'LoginController as vm'
                    }
                }
            })
            .state('app.register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterController as vm'
                    }
                }
            })
            .state('app.myjobsmain', {
                url: '/myjobsmain/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/myjobsmain.html',
                        controller: 'MyJobsController as vm',
                        resolve: {
                            displayMenu: function ($stateParams) {
                                return $stateParams.id;
                            }
                        }
                    }
                }
            })
            .state('app.counter', {
                url: '/counter',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/counter.html',
                        controller: 'CounterController as vm'
                    }
                }
            })
            .state('app.feeds', {
                url: '/feeds',

                views: {
                    'menuContent': {
                        templateUrl: 'templates/feeds.html',
                        controller: 'JobsFeedController as vm'
                    }
                }
            })
            .state('app.jobdetails', {
                url: '/jobdetails?id&user',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/jobdetails.html',
                        controller: 'JobsDetailController as vm',
                        resolve: {
                            JobID: function ($stateParams) {
                                var values = {
                                    id: $stateParams.id,
                                    user: $stateParams.user
                                };
                                console.log(values);
                                return values;
                            }
                        }
                    }
                }
            })

            .state('app.uploadphotos', {
                url: '/uploadphotos?id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/uploadjobimages.html',
                        controller: 'MediaUploadController as vm',
                        resolve: {
                            jobid: function ($stateParams) {

                                return $stateParams.id;
                            }
                        }
                    }
                }
            }).state('app.createjob', {
                url: '/createjob',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/createjob.html',
                        controller: 'JobsController as vm'

                    }
                }
            }).state('app.notifications', {
                url: '/notifications',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/notifications.html',
                        controller: 'NotificationController as vm'

                    }
                }
            })

            .state('app.map', {
                url: '/map?lat&lng&name',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/map.html',
                        controller: 'MapController as vm',
                        resolve: {
                            Direction: function ($stateParams) {
                                var direction = {
                                    lat: $stateParams.lat,
                                    lng: $stateParams.lng,
                                    name: $stateParams.name

                                }
                                console.log(direction);
                                return direction
                            }
                        }
                    }
                }
            })
            .state('app.profile', {
                url: '/profile',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileController as vm'
                    }
                }
            })
            .state('app.editprofile', {
                url: '/editprofile/:id',

                views: {
                    'menuContent': {
                        templateUrl: 'templates/editprofile.html',
                        controller: 'EditProfileController as vm'

                    }
                }
            })
            .state('app.conversation', {
                url: '/conversation',

                views: {
                    'menuContent': {
                        templateUrl: 'templates/conversation.html',
                        controller: 'ConversationController as vm'

                    }
                }
            });




        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/feeds');
    });


})();
