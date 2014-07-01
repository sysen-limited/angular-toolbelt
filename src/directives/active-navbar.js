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
            addTreeClass(activeElm, 'active');
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
