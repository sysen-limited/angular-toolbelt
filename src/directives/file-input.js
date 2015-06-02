angular.module('toolbelt.fileInput', ['ngResource'])
    .directive('sysFileInput', ['$resource', function ($resource) {
        return {
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            replace: true,
            templateUrl: 'template/toolbelt/file-input.html',
            link: function (scope, elem, attrs) {
                var formCtrl  = elem.inheritedData("$formController"),
                    fileLimit = parseInt(attrs.sysFileInput) || 10;
                scope.model = [];
                scope.files = [];

                function dragEnterLeave(evt) {
                    evt.preventDefault();
                    scope.$apply(function () {
                        scope.dropState = scope.files.length > 0 ? 'drop' : 'exit';
                    });
                }

                function dragOver(evt) {
                    evt.preventDefault();
                    var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0;
                    scope.$apply(function () {
                        scope.dropState = ok ? 'over' : 'invalid';
                    });
                }

                function dropInto(evt) {
                    evt.preventDefault();
                    scope.$apply(function () {
                        scope.dropState = 'drop';
                    });

                    var files     = evt.dataTransfer.files,
                        behaviour = attrs.behaviour || 'replace';

                    if (behaviour == 'replace') {
                        scope.files = [];
                    }

                    if (files.length > 0 && files.length <= fileLimit && (scope.files.length + files.length) <= fileLimit) {
                        scope.$apply(function () {
                            angular.forEach(files, function (file) {
                                var reader = new FileReader();
                                var attachment = { raw: file, data: { name: file.name, size: file.size, type: file.type, lastModified: file.lastModifiedDate } };

                                if (file.type.indexOf("text") === 0) {
                                    reader.onload = function (evt) {
                                        scope.$apply(function () {
                                            attachment.content = evt.target.result;
                                        });
                                    };
                                    reader.readAsText(file, "UTF-8");
                                }
                                else if (file.type.indexOf("image") === 0) {
                                    reader.onload = function (evt) {
                                        scope.$apply(function () {
                                            attachment.image = evt.target.result;
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                }
                                else {
                                    reader.onload = function (evt) {
                                        scope.$apply(function () {
                                            attachment.binary = evt.target.result;
                                        });
                                    };
                                    reader.readAsBinaryString(file);
                                }

                                scope.files.push(attachment);
                                scope.model = scope.files;

                                uploadFile(attachment);
                            });
                        });
                    } else {
                        scope.$apply(function () {
                            scope.dropState = 'invalid';
                            scope.error = { message: 'Drop ignored, exceeds maximum limit of ' + fileLimit };
                        });
                    }
                }

                function uploadFile(attachment) {
                    if (attrs.api) {
                        var endpoint = $resource(attrs.api, null, {
                            upload: {
                                method: 'POST',
                                headers: { 'Content-Type': undefined },
                                transformRequest: function (data) {
                                    var formData = new FormData();
                                    formData.append('upload', data.file);
                                    return formData;
                                }
                            }
                        });

                        attachment.saving = true;

                        endpoint.upload({ file: attachment.raw }, function (success) {
                            attachment.saved = true;
                            attachment.response = success;
                        }, function (failure) {
                            attachment.error = failure.data;
                            scope.dropState = 'warning';
                            scope.error = { message: 'Some files failed to save' };
                        });
                    }
                }

                scope.$watch('model', function (next, last) {
                    if (scope.model.length == 0) {
                        scope.files = [];
                        if (last.length > 0) {
                            scope.error = '';
                            scope.dropState = 'exit';
                        }
                    }

                    if (attrs.required && formCtrl.hasFiles) {
                        formCtrl.hasFiles.$setValidity('files', scope.model.length > 0);
                    }
                });

                elem.on('dragenter', dragEnterLeave);
                elem.on('dragleave', dragEnterLeave);
                elem.on('dragover', dragOver);
                elem.on('drop', dropInto);
            }
        };
    }]);
