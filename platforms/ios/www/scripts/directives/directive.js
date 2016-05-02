(function() {
    'use strict';
    var app = angular.module('mobApp');
    //https://github.com/rajeshwarpatlolla/my-angularjs-directives#standard-time-meridian
    app.directive('standardTimeMeridian', function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                etime: '=etime'
            },
            template: "<span>{{stime}}</span>",
            link: function(scope, elem, attrs) {

                scope.stime = epochParser(scope.etime, 'time');

                function prependZero(param) {
                    if (String(param).length < 2) {
                        return "0" + String(param);
                    }
                    return param;
                }

                function epochParser(val, opType) {
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

                scope.$watch('etime', function(newValue, oldValue) {
                    scope.stime = epochParser(scope.etime, 'time');
                });

            }
        };
    });
    app.directive('fancySelect',
        [
            '$ionicModal',
            function($ionicModal) {
                return {
                    /* Only use as <fancy-select> tag */
                    restrict: 'E',

                    /* Our template */
                    templateUrl: 'fancy-select.html',

                    /* Attributes to set */
                    scope: {
                        'items': '=', /* Items list is mandatory */
                        'text': '=', /* Displayed text is mandatory */
                        'value': '=', /* Selected value binding is mandatory */
                        'callback': '&'
                    },

                    link: function(scope, element, attrs) {

                        /* Default values */
                        scope.multiSelect = attrs.multiSelect === 'true' ? true : false;
                        scope.allowEmpty = attrs.allowEmpty === 'false' ? false : true;

                        /* Header used in ion-header-bar */
                        scope.headerText = attrs.headerText || '';

                        /* Text displayed on label */
                        // scope.text          = attrs.text || '';
                        scope.defaultText = scope.text || '';

                        /* Notes in the right side of the label */
                        scope.noteText = attrs.noteText || '';
                        scope.noteImg = attrs.noteImg || '';
                        scope.noteImgClass = attrs.noteImgClass || '';

                        /* Optionnal callback function */
                        // scope.callback = attrs.callback || null;

                        /* Instanciate ionic modal view and set params */

                        /* Some additionnal notes here : 
                         * 
                         * In previous version of the directive,
                         * we were using attrs.parentSelector
                         * to open the modal box within a selector. 
                         * 
                         * This is handy in particular when opening
                         * the "fancy select" from the right pane of
                         * a side view. 
                         * 
                         * But the problem is that I had to edit ionic.bundle.js
                         * and the modal component each time ionic team
                         * make an update of the FW.
                         * 
                         * Also, seems that animations do not work 
                         * anymore.
                         * 
                         */
                        $ionicModal.fromTemplateUrl(
                            'fancy-select-items.html',
                            { 'scope': scope }
                        ).then(function(modal) {
                            scope.modal = modal;
                        });

                        /* Validate selection from header bar */
                        scope.validate = function(event) {
                            // Construct selected values and selected text
                            if (scope.multiSelect == true) {

                                // Clear values
                                scope.value = '';
                                scope.text = '';

                                // Loop on items
                                jQuery.each(scope.items, function(index, item) {
                                    if (item.checked) {
                                        scope.value = scope.value + item.id + ';';
                                        scope.text = scope.text + item.text + ', ';
                                    }
                                });

                                // Remove trailing comma
                                scope.value = scope.value.substr(0, scope.value.length - 1);
                                scope.text = scope.text.substr(0, scope.text.length - 2);
                            }

                            // Select first value if not nullable
                            if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null) {
                                if (scope.allowEmpty == false) {
                                    scope.value = scope.items[0].id;
                                    scope.text = scope.items[0].text;

                                    // Check for multi select
                                    scope.items[0].checked = true;
                                } else {
                                    scope.text = scope.defaultText;
                                }
                            }

                            // Hide modal
                            scope.hideItems();

                            // Execute callback function
                            if (typeof scope.callback == 'function') {
                                scope.callback(scope.value);
                            }
                        }

                        /* Show list */
                        scope.showItems = function(event) {
                            event.preventDefault();
                            scope.modal.show();
                        }

                        /* Hide list */
                        scope.hideItems = function() {
                            scope.modal.hide();
                        }

                        /* Destroy modal */
                        scope.$on('$destroy', function() {
                            scope.modal.remove();
                        });

                        /* Validate single with data */
                        scope.validateSingle = function(item) {

                            // Set selected text
                            scope.text = item.text;

                            // Set selected value
                            scope.value = item.id;

                            // Hide items
                            scope.hideItems();

                            // Execute callback function
                            if (typeof scope.callback == 'function') {
                                scope.callback(scope.value);
                            }
                        }
                    }
                };
            }
        ]
    )
    app.directive('input', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function(scope, element, attr) {
                element.bind('focus', function(e) {
                    if (scope.onFocus) {
                        $timeout(function() {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function(e) {
                    if (scope.onBlur) {
                        $timeout(function() {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function(e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function() {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })


})();
