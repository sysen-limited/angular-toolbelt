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
