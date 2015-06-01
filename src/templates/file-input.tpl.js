angular.module('toolbelt.fileInput.tpl', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put(
        'template/toolbelt/file-input.html',
        [
            '<div class="file-input">' +
            ' <div class="jumbotron" data-ng-class="{ valid: dropState == \'over\' || dropState == \'drop\', invalid: dropState == \'invalid\', warning: dropState == \'warning\' }">' +
            '  <h3 data-ng-switch on="dropState" style="pointer-events: none">' +
            '   <span data-ng-switch-when="over">Drop file(s)</span>' +
            '   <span data-ng-switch-when="drop">{{ files.length }} file(s) dropped, drop again to change</span>' +
            '   <span data-ng-switch-when="invalid">Invalid file(s) detected</span>' +
            '   <span data-ng-switch-when="warning">{{ files.length }} file(s) dropped, with warnings, drop to try again</span>' +
            '   <span data-ng-switch-default>Drag file(s) here</span>' +
            '  </h3>' +
            '  <p data-ng-if="error">{{ error.message }}</p>' +
            ' </div>' +
            ' <div class="row" data-ng-if="files.length">' +
            '  <div class="col-xs-6 col-sm-4 preview" data-ng-repeat="file in files">' +
            '   <img class="img-responsive" data-ng-src="{{ file.image }}" data-ng-if="file.image" />' +
            '   <pre data-ng-bind="file.content" data-ng-if="file.content"></pre>' +
            '   <i class="fa fa-3x fa-file" data-ng-if="file.binary"></i>' +
            '   <h4 data-ng-bind="file.data.name"></h4>' +
            '   <div data-ng-bind="file.data.size | bytes"></div>' +
            '   <div data-ng-if="file.saving">' +
            '    <p class="text-center"><span data-ng-bind="file.saved ? \'Saved\' : \'Saving\'"></span> <i class="fa" data-ng-class="{ true: \'fa-check\' }[ file.saved ]"></i></p>' +
            '   </div>' +
            '  </div>' +
            ' </div>' +
            ' <p data-ng-if="!files.length">No files currently added</p>' +
            ' <input id="hasFiles" name="hasFiles" type="hidden" data-ng-model="hasFiles" />' +
            '</div>'
        ].join('\n')
    );
}]);
