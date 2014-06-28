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
