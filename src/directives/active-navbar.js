angular.module('toolbelt.navbar', [])
    .directive('sysActiveNavbar', ['$location', function($location) {
        var activeName = 'active';
        function assignActive(elem) {
            var activeElm;
            angular.forEach(elem.find('a'), function(anchor) {
                var elm = angular.element(anchor),
                    route = elm.attr('data-route') || "",
                    regex = new RegExp('^' + route.replace('/', '\\/') + '$', ['i']);

                if(regex.test($location.path())) {
                    activeElm = elm;
                } else {
                    removeTreeClass(elm, activeName);
                }
            });
            if(activeElm !== undefined) {
                addTreeClass(activeElm, activeName);
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
                activeName = attrs.sysActiveNavbar || activeName;
                scope.$watch(function() {
                    return $location.path();
                }, function() {
                    assignActive(elem);
                });
            }
        };
    }]);
