
angular.module('sysen.toolbelt', ['sysen.toolbelt.tpls', 'toolbelt.growl', 'toolbelt.scroll', 'toolbelt.strength', 'toolbelt.navbar']);
angular.module('sysen.toolbelt.tpls', ['toolbelt.growl.tpl', 'toolbelt.strength.tpl']);

angular.module('toolbelt.navbar', [])
    .directive('sysActiveNavbar', ['$location', function($location) {

        function assignActive(elem) {
            var activeElm;
            angular.forEach(elem.find('a'), function(anchor) {
                var elm = angular.element(anchor),
                    route = elm.attr('data-route') || "",
                    regex = new RegExp('^' + route.replace('/', '\\/') + '$', ['i']);

                if(regex.test($location.path())) {
                    activeElm = elm;
                } else {
                    removeTreeClass(elm, 'active');
                }
            });
            if(activeElm !== undefined) {
                addTreeClass(activeElm, 'active');
            }
        }

        function addTreeClass(element, className) {
            while(element.attr('data-sys-active-navbar') === undefined && element.prop('tagName') !== 'BODY') {
                if(!element.hasClass(className)) {
                    element.addClass(className);
                }
                element = element.parent();
            }
        }

        function removeTreeClass(element, className) {
            while(element.attr('data-sys-active-navbar') === undefined && element.prop('tagName') !== 'BODY') {
                if(element.hasClass(className)) {
                    element.removeClass(className);
                }
                element = element.parent();
            }
        }

        return {
            link: function(scope, elem, attrs) {
                scope.$watch(function() {
                    return $location.path();
                }, function() {
                    assignActive(elem);
                });
            }
        };
    }]);

angular.module('toolbelt.growl', ['ngSanitize'])
    .directive('sysGrowl', ['$rootScope', '$timeout', function($rootScope, $timeout) {
        return {
            replace: false,
            templateUrl: 'template/toolbelt/growl.html',
            link: function(scope, elem, attrs) {
                scope.limit = parseInt(attrs.sysGrowl, 10) || 5;
                scope.growls = [];

                scope.dismiss = function(growl) {
                    var idx = scope.growls.indexOf(growl);
                    scope.growls.splice(idx, 1);
                    $rootScope.$broadcast('_removeGrowl', growl);
                };

                $rootScope.$on('_addGrowl', function(event, message) {
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
    .directive('sysScroll', ['$rootScope', '$window', '$interval', function ($rootScope, $window, $interval) {
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
                var defaultOffset = 0;

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

                $rootScope.$on('_pageScroll', function(event, target, offset) {
                    offset = offset || defaultOffset;
                    scrollPage('none', target, offset);
                });
            }
        };
    }]);

angular.module('toolbelt.strength', ['ngSanitize'])
    .directive('sysStrength', function() {
        var labels = ['success', 'warning', 'danger'];
        var results = [
            { rank: 1, complexity: 'Too Short', label: 'danger' },
            { rank: 2, complexity: 'Very Weak' },
            { rank: 3, complexity: 'Weak' },
            { rank: 4, complexity: 'Poor' },
            { rank: 5, complexity: 'Good' },
            { rank: 6, complexity: 'Strong' },
            { rank: 7, complexity: 'Very Strong' }
        ];

        function hasLowerCase(string) {
            return /[a-z]+/.test(string);
        }

        function hasUpperCase(string) {
            return /[A-Z]+/.test(string);
        }

        function hasNumeric(string) {
            return /[0-9]+/.test(string);
        }

        function hasSpecial(string) {
            return /[$-/:-?{-~!"^_`\[\]]/g.test(string);
        }

        function getResult(score, requiredRank) {
            var percentage = (score * 100) / 20;
            var result = percentage < 20 ? results[1] :
                   percentage < 35 ? results[2] :
                   percentage < 50 ? results[3] :
                   percentage < 65 ? results[4] :
                   percentage < 90 ? results[5] : results[6];

            var rankDifference = requiredRank - result.rank;
            if (rankDifference >= labels.length) {
                rankDifference = labels.length - 1;
            } else if (rankDifference < 0) {
                rankDifference = 0;
            }
            result.label = labels[rankDifference];

            return result;
        }

        return {
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                target: '@'
            },
            replace: true,
            templateUrl: 'template/toolbelt/strength.html',
            link: function(scope, elem, attrs) {
                var minLength = parseInt(attrs.minLength) || 6;
                var minComplexity = parseInt(attrs.complexity) || 5;

                if(minComplexity > 7) {
                    minComplexity = 7;
                }

                var formCtrl = elem.inheritedData("$formController");

                var updateStrength = function(string) {
                    if(string) {
                        var score = 0;
                        // Gain points based on variation of character types
                        if (hasLowerCase(string)) score++;
                        if (hasUpperCase(string)) score++;
                        if (hasNumeric(string)) score++;
                        if (hasSpecial(string)) score++;
                        // Length improves weighting
                        score *= (string.length / 2);
                        // Requires a minimum length
                        scope.result = string.length >= minLength ? getResult(score, minComplexity) : results[0];
                    } else {
                        scope.result = results[0];
                    }
                    formCtrl[scope.target].$setValidity('strength', minComplexity <= scope.result.rank);
                };

                scope.$watch('model', updateStrength);
            }
        };
    });

angular.module('toolbelt.growl.tpl', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put(
        'template/toolbelt/growl.html',
        [
            '<article data-ng-repeat="growl in growls | limitTo: limit">',
            '    <div class="alert alert-{{ growl.type }} alert-dismissable">',
            '        <button type="button" class="close" data-ng-click="dismiss(growl)">&times;</button>',
            '        <h4>{{ growl.title }}</h4>',
            '        <p data-ng-bind-html="growl.content"></p>',
            '    </div>',
            '</article>'
        ].join('\n')
    );
}]);

angular.module('toolbelt.strength.tpl', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put(
        'template/toolbelt/strength.html',
        '<span class="label label-{{ result.label }}">{{ result.complexity }}</span>'
    );
}]);
