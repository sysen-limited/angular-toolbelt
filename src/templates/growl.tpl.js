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