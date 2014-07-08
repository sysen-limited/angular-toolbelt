angular.module('toolbelt.infiniteScroll', [])
    .directive('sysInfiniteScroll', ['$rootScope', '$window', '$timeout', function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {
                var timer = attrs.timeout || 1000;

                scope.dataLoad = false;
                scope.stopped = false;

                var handler = function() {
                    var pause = scope.dataLoad || scope.stopped;

                    if(!pause) {
                        var endLocation = elem.prop('offsetTop') + elem.prop('offsetHeight'),
                            scrollLocation = $window.scrollY + $window.innerHeight;

                        if (endLocation && scrollLocation - endLocation >= 0) {
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
