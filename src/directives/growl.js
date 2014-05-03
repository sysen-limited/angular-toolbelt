angular.module('toolbelt.directives', ['ngSanitize'])
    .directive('sysGrowl', function() {
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
                });
            }
        };
    });