angular.module('toolbelt.fileInput', ['ngResource'])
    .directive('sysFileInput', ['$resource', 'bytesFilter', function ($resource, $bytes) {
        return {
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            replace: true,
            templateUrl: 'template/toolbelt/file-input.html',
            link: function (scope, elem, attrs) {
                var formCtrl         = elem.inheritedData("$formController"),
                    fileLimit        = parseInt(attrs.maxFiles) || 10,
                    fileSize         = (attrs.maxSize || 0) * 1024,
                    fileRestrictions = fixRestrictions((attrs.restrict || '*').split(','));

                function fixRestrictions(list) {
                    var result = [];
                    angular.forEach(list, function (restriction) {
                        switch (restriction) {
                            case 'jpg':
                            case 'png':
                            case 'jpeg':
                            case 'gif':
                            case 'image':
                                if (result.indexOf('image/*') < 0) {
                                    result.push('image/*');
                                }
                                break;
                            case 'avi':
                            case 'mpg':
                            case 'mpeg':
                            case 'mp4':
                            case 'video':
                                if (result.indexOf('video/*') < 0) {
                                    result.push('video/*');
                                }
                                break;
                            case 'txt':
                                if (result.indexOf('text/plain') < 0) {
                                    result.push('text/plain');
                                }
                                break;
                            case 'zip':
                                if (result.indexOf('application/zip') < 0) {
                                    result.push('application/zip');
                                }
                                break;
                            case 'pdf':
                                if (result.indexOf('application/pdf') < 0) {
                                    result.push('application/pdf');
                                }
                                break;
                            default:
                                result.push('.' + restriction); // Using extensions does not work on all browsers
                        }
                    });
                    return result;
                }

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
                        scope.errors = [];
                    });
                }

                function dropInto(evt) {
                    evt.preventDefault();
                    scope.$apply(function () {
                        scope.dropState = 'drop';
                        scope.errors = [];
                    });

                    var files     = this.files || evt.dataTransfer.files,
                        behaviour = attrs.behaviour || 'replace';

                    if (behaviour == 'replace') {
                        scope.files = [];
                    }

                    if (files.length > 0 && files.length <= fileLimit && (scope.files.length + files.length) <= fileLimit) {
                        scope.$apply(function () {
                            angular.forEach(files, function (file) {
                                var validType = false,
                                    validSize = false;
                                angular.forEach(fileRestrictions, function (restriction) {
                                    if (file.type.search(restriction) >= 0) {
                                        validType = true;
                                    }
                                });

                                validSize = fileSize > file.size || !fileSize;

                                if (validType && validSize) {
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
                                } else if (!validType) {
                                    scope.dropState = 'warning';
                                    scope.errors.push('Invalid file type "' + (file.type || 'unknown') + '" for file "' + file.name + '"');
                                } else if (!validSize) {
                                    scope.dropState = 'warning';
                                    scope.errors.push('Invalid file size "' + $bytes(file.size, 2) + '" exceeds "' + $bytes(fileSize, 2) + '" for file "' + file.name + '"');
                                } else {
                                    scope.dropState = 'warning';
                                    scope.errors.push('Unable to add file "' + file.name + '"');
                                }
                            });
                        });
                    } else {
                        scope.$apply(function () {
                            scope.dropState = 'invalid';
                            scope.errors.push('Drop ignored, exceeds a limit of "' + fileLimit + '" file attachments');
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
                            scope.errors.push('Some files failed to save');
                        });
                    }
                }

                scope.model = [];
                scope.files = [];
                scope.errors = [];
                scope.multiple = fileLimit > 1;
                scope.restrict = fileRestrictions.join(',');
                scope.inputName = attrs.sysFileInput || 'fileAttachment';

                scope.$watch('model', function (next, last) {
                    if (scope.model.length === 0) {
                        scope.files = [];
                        if (last.length > 0) {
                            scope.errors = [];
                            scope.dropState = 'exit';
                        }
                    }

                    if (attrs.required && formCtrl[scope.inputName]) {
                        formCtrl[scope.inputName].$setDirty();
                        formCtrl[scope.inputName].$setTouched();
                        formCtrl[scope.inputName].$setValidity('files', scope.model.length > 0);
                    }
                });

                angular.element(elem[0]).find('input').on('change', dropInto);

                elem.on('dragenter', dragEnterLeave);
                elem.on('dragleave', dragEnterLeave);
                elem.on('dragover', dragOver);
                elem.on('drop', dropInto);
            }
        };
    }]);
