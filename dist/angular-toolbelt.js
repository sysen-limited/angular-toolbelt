
angular.module('sysen.toolbelt', ['sysen.toolbelt.services', 'sysen.toolbelt.directives', 'sysen.toolbelt.tpls']);
angular.module('sysen.toolbelt.services', ['toolbelt.platform']);
angular.module('sysen.toolbelt.directives', ['toolbelt.growl', 'toolbelt.infiniteScroll', 'toolbelt.markdown', 'toolbelt.navbar', 'toolbelt.scroll', 'toolbelt.strength']);
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

angular.module('toolbelt.markdown', [])
    .provider('markdownConverter', function () {
        var self = this;

        self.setOptions = function (options) {
            this.defaults = options;
        };

        self.$get = ['$window', function ($window) {
            if($window.marked) {
                var marked = $window.marked;

                self.setOptions = marked.setOptions;
                if($window.hljs) {
                    marked.setOptions({
                        highlight: function(code) {
                            return $window.hljs.highlightAuto(code).value;
                        }
                    });
                }
                marked.setOptions(self.defaults);
                return marked;
            }
        }];
    })

    .directive('sysMarkdown', ['markdownConverter', function (markdownConverter) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                options: '=',
                sysMarkdown: '='
            },
            link: function (scope, elem, attrs) {
                var warning = false;

                function parse(value) {
                    if(markdownConverter) {
                        elem.html(markdownConverter(value || '', scope.options || null));
                    } else if(!warning) {
                        elem.html('Markdown parser not found! Please include library found at: https://github.com/chjj/marked');
                        warning = true;
                    }
                }
                parse(scope.sysMarkdown || elem.text() || '');

                if(attrs.sysMarkdown) {
                    scope.$watch('sysMarkdown', parse);
                }
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

                angular.element($window).bind("scroll", function() {
                    $rootScope.$broadcast('_scroll', $window.pageYOffset);
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
        var requiredComplexity, requiredCharsets;
        var labels = ['success', 'warning', 'danger'];
        var results = [
            { rank: 1, complexity: 'Too short', label: 'danger' },
            { rank: 2, complexity: 'Too few character types', label: 'warning' },
            { rank: 3, complexity: 'Very Weak' },
            { rank: 4, complexity: 'Weak' },
            { rank: 5, complexity: 'Poor' },
            { rank: 6, complexity: 'Good' },
            { rank: 7, complexity: 'Strong' },
            { rank: 8, complexity: 'Very Strong' }
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

        function getResult(score) {
            var percentage = (score * 100) / 20;
            var result = percentage < 20 ? results[2] :
                   percentage < 35 ? results[3] :
                   percentage < 50 ? results[4] :
                   percentage < 65 ? results[5] :
                   percentage < 90 ? results[6] : results[7];

            var rankDifference = requiredComplexity - result.rank;
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
                var formCtrl = elem.inheritedData("$formController");

                requiredComplexity = parseInt(attrs.complexity) > 8 ? 8 : parseInt(attrs.complexity) || 6;
                requiredCharsets = parseInt(attrs.charsets) > 4 ? 4 : parseInt(attrs.charsets) || 1;

                var updateStrength = function(string) {
                    var charsets = 0, score = 0;
                    if(string) {
                        // Gain points based on variation of character types
                        if (hasLowerCase(string)) charsets++;
                        if (hasUpperCase(string)) charsets++;
                        if (hasNumeric(string)) charsets++;
                        if (hasSpecial(string)) charsets++;
                        // Length improves weighting
                        score = charsets * (string.length / 2);
                        // Requires a minimum length
                        scope.result = string.length >= minLength ? (requiredCharsets <= charsets ? getResult(score) : results[1]) : results[0];
                    } else {
                        scope.result = results[0];
                    }
                    formCtrl[scope.target].$setValidity('strength', requiredComplexity <= scope.result.rank && requiredCharsets <= charsets);
                };

                scope.$watch('model', updateStrength);
            }
        };
    });

angular.module('toolbelt.platform', [])
    .provider('$detectPlatform', function () {
        var self = this;

        function getSystem($window) {
            var agent = $window.navigator.userAgent,
                matches = agent.match(/(windows|macintosh|linux)/i) || [],
                name, version, temp;

            name = matches[0];
            if(!name) {
                return { name: "Unknown", version: "0" };
            }
            switch(name.toLowerCase()) {
                case "windows":
                    temp = agent.match(/windows\snt\s([^;)]*)/i);
                    version = temp[1];
                    break;
                case "macintosh":
                    temp = agent.match(/(mac\sos\s?x)\s([^;)]*)/i);
                    name = temp[1];
                    version = temp[2].replace(/_/g, '.');
                    break;
                case "linux":
                    temp = agent.match(/ubuntu|linux/i);
                    version = temp[0];
                    break;
            }
            return { name: name, version: version };
        }

        function getBrowser($window) {
            var agent = $window.navigator.userAgent,
                matches = agent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+(\.\d+)?(\.\d+)?)/i) || [],
                name, version, temp;
            if (/trident/i.test(matches[1])) {
                temp = /\brv[ :]+(\d+(\.\d+)?(\.\d+)?)/g.exec(agent);
                name = 'MSIE';
                version = temp[1];
            }
            else if (matches[1] === 'Chrome') {
                temp = agent.match(/\bOPR\/(\d+(\.\d+)?(\.\d+)?)/);
                if (temp !== null) {
                    name = 'Opera';
                    version = temp[1];
                }
            }
            if (!name && !version) {
                matches = matches[2] ? [matches[1], matches[2]] : [$window.navigator.appName, $window.navigator.appVersion, '-?'];
                if ((temp = agent.match(/version\/(\d+(\.\d+)?(\.\d+)?)/i)) !== null) {
                    matches.splice(1, 1, temp[1]);
                }
                name = matches[0];
                version = matches[1];
            }
            return { name: name || "Unknown", version: version || "0" };
        }

        self.approvedBrowsers = [];

        self.allowBrowser = function (browser, version) {
            this.approvedBrowsers.push({ name: browser, version: version || 0 });
            return self;
        };

        self.$get = ["$window", function ($window) {
            var system = getSystem($window);
            var browser = getBrowser($window);
            return {
                language: $window.navigator.language,
                system: {
                    name: system.name,
                    version: system.version,
                    matches: function (systemName, systemVersion) {
                        if (systemVersion) {
                            return(this.name && this.name == systemName && this.version == systemVersion);
                        } else {
                            return(this.name && this.name == systemName);
                        }
                    }
                },
                browser: {
                    name: browser.name,
                    version: browser.version,
                    matches: function (browserName, browserVersion) {
                        if (browserVersion) {
                            return(this.name && this.name == browserName && this.version == browserVersion);
                        } else {
                            return(this.name && this.name == browserName);
                        }

                    },
                    isAllowed: function () {
                        for (var i = 0; i < self.approvedBrowsers.length; i++) {
                            if (this.name == self.approvedBrowsers[i].name && parseFloat(this.version) >= parseFloat(self.approvedBrowsers[i].version)) {
                                return true;
                            }
                        }
                        return false;
                    }
                }
            };
        }];
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
