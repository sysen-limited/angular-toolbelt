angular.module('toolbelt.strength.tpl', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put(
        'template/toolbelt/strength.html',
        '<span class="label label-{{ result.label }}">{{ result.complexity }}</span>'
    );
}]);