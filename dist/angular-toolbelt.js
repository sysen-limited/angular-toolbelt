
angular.module('sysen.toolbelt', ['toolbelt.growl', 'toolbelt.scroll']);
angular.module('toolbelt.growl', ['ngSanitize'])
    .directive('sysGrowl', ['$timeout', function($timeout) {
        return {
            replace: false,
            template: [
                '<article data-ng-repeat="growl in growls | limitTo: limit">',
                '    <div class="alert alert-{{ growl.type }} alert-dismissable">',
                '        <button type="button" class="close" data-ng-click="dismiss(growl)">&times;</button>',
                '        <h4>{{ growl.title }}</h4>',
                '        <p data-ng-bind-html="growl.content"></p>',
                '    </div>',
                '</article>'
            ].join('\n'),
            link: function(scope, elem, attrs) {
                scope.limit = parseInt(attrs.sysGrowl, 10) || 5;
                scope.growls = [];

                scope.dismiss = function(growl) {
                    var idx = scope.growls.indexOf(growl);
                    scope.growls.splice(idx, 1);
                };

                scope.$on('_addGrowl', function(event, message) {
                    if(message.type === undefined) {
                        message.type = 'info';
                    }

                    scope.growls.unshift(message);

                    if(attrs.timeout) {
                        $timeout(function() {
                            scope.dismiss(message);
                        }, attrs.timeout * 1000);
                    }
                });
            }
        };
    }]);
angular.module('toolbelt.scroll', [])
    .directive('sysScroll', ['$window', '$interval', function ($window, $interval) {
        var getCurrentPos = function () {
            if ($window.pageYOffset) {
                return $window.pageYOffset;
            } else if ($window.document.body.scrollTop) {
                return $window.document.body.scrollTop;
            } else {
                return 0;
            }
        };

        var getTargetPos = function (target, offset) {
            var elem = $window.document.getElementById(target);

            if (elem) {
                return elem.offsetTop - offset;
            } else {
                return 0;
            }
        };

        var scrollPage = function (mode, target, offset) {
            var scrollPos,
                currentPos = getCurrentPos(),
                targetPos = getTargetPos(target, offset);

            scrollPos = targetPos - currentPos;
            if(scrollPos === 0) { return; }

            switch(mode) {
                case 'smooth':
                    var timer = 1,
                        step = 20,
                        direction = 0; // 0 = Down, 1 = Up

                    // Manage scroll direction
                    if(scrollPos < 0) {
                        scrollPos = -scrollPos;
                        direction = 1;
                    }

                    // Calculate and run intervals for scrolling
                    var totalIntervals = Math.ceil(scrollPos / step);
                    $interval(function() {
                        if(direction > 0) {
                            currentPos -= step;
                            if(currentPos < targetPos) currentPos = targetPos;
                        } else {
                            currentPos += step;
                            if(currentPos > targetPos) currentPos = targetPos;
                        }
                        $window.scrollTo(0, currentPos);
                    }, timer, totalIntervals);
                    break;
                default:
                    $window.scrollTo(0, currentPos + scrollPos);
            }
        };

        return {
            link: function (scope, elem, attrs) {
                var defaultOffset = 70;

                elem.on('click', function () {
                    if (attrs.target) {
                        var mode = attrs.sysScroll || 'normal',
                            target = attrs.target,
                            offset = attrs.offset || defaultOffset;
                        scrollPage(mode, target, offset);
                    } else {
                        return;
                    }
                });

                scope.$on('_pageScroll', function(event, target, offset) {
                    offset = offset || defaultOffset;
                    scrollPage('none', target, offset);
                });
            }
        };
    }]);