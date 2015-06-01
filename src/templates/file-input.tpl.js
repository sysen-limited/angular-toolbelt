angular.module('toolbelt.fileInput.tpl', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put(
        'template/toolbelt/file-input.html',
        [
            '<div class="file-input">' +
            ' <div class="jumbotron" data-ng-class="{ valid: dropState == \'over\' || dropState == \'drop\', invalid: dropState == \'invalid\' }">' +
            '  <h3 data-ng-switch on="dropState" style="pointer-events: none">' +
            '   <span data-ng-switch-when="over">Drop file(s)</span>' +
            '   <span data-ng-switch-when="drop">File(s) dropped, drop again to change</span>' +
            '   <span data-ng-switch-when="invalid">Invalid file(s) detected</span>' +
            '   <span data-ng-switch-default>Drop file(s) here</span>' +
            '  </h3>' +
            ' </div>' +
            ' <div class="row" data-ng-if="files.length">' +
            '  <div class="col-xs-6 col-sm-4 preview" data-ng-repeat="file in files">' +
            '   <img class="img-responsive" data-ng-src="{{ file.image }}" data-ng-if="file.image" />' +
            '   <pre data-ng-bind="file.data" data-ng-if="file.data"></pre>' +
            '   <i class="fa fa-3x fa-file" data-ng-if="file.file"></i>' +
            '   <h4 data-ng-bind="file.raw.name"></h4>' +
            '   <div data-ng-bind="file.raw.size | bytes"></div>' +
            '  </div>' +
            ' </div>' +
            ' <input type="hidden" name="hasFiles" data-ng-model="hasFiles" />' +
            '</div>'
        ].join('\n')
    );
}]);
