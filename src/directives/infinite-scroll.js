angular.module('toolbelt.infiniteScroll', [])
    .directive('sysInfiniteScroll', ['$rootScope', '$window', '$timeout', function ($rootScope, $window, $timeout) {

        function getElementEndLocation(id) {
            var elem = $window.document.getElementById(id),
                elementLocation = $window.document.height;

            if(elem && elem.offsetTop && elem.offsetHeight) {
                elementLocation = elem.offsetTop + elem.offsetHeight;
            }
            return elementLocation;
        }

        function getWindowScrollLocation() {
            return $window.scrollY + $window.innerHeight;
        }

        return {
            link: function (scope, elem, attrs) {
                var timer = attrs.timeout || 1000,
                    id = attrs.id || 'infinite-scroll-' + Math.floor(Math.random() * 9999);

                scope.dataLoad = false;
                scope.stopped = false;
                elem.attr('id', id);

                var handler = function() {
                    var pause = scope.dataLoad || scope.stopped;

                    if(!pause) {
                        var endLocation = getElementEndLocation(id),
                            scrollLocation = getWindowScrollLocation();

                        if (scrollLocation - endLocation >= 0) {
                            scope.dataLoad = true;

                            scope.timeout = $timeout(function () {
                                scope.dataLoad = false;
                            }, timer);

                            $rootScope.$broadcast('_infiniteScroll', 'DATA_LOAD');
                        }
                    }
                };

                $rootScope.$on('_infiniteScroll', function(evt, message) {
                    switch(message) {
                        case 'STOP':
                            scope.stopped = true;
                            break;
                        case 'START':
                            scope.stopped = false;
                            break;
                        case 'CONTINUE':
                            scope.dataLoad = false;
                            $timeout.cancel(scope.timeout);
                            break;
                    }
                });

                angular.element($window).bind('scroll', handler);
            }
        };
    }]);
