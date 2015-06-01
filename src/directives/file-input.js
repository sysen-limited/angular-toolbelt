angular.module('toolbelt.fileInput', ['ngSanitize'])
    .directive('sysFileInput', [function() {
        return {
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            replace: true,
            templateUrl: 'template/toolbelt/file-input.html',
            link: function(scope, elem, attrs) {
                var formCtrl = elem.inheritedData("$formController");
                scope.model = [];
                scope.files = [];

                function dragEnterLeave(evt) {
                    evt.preventDefault();
                    scope.$apply(function () {
                        scope.dropState = 'exit';
                    });
                }

                function dragOver (evt) {
                    evt.preventDefault();
                    var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0;
                    scope.$apply(function () {
                        scope.dropState = ok ? 'over' : 'invalid';
                    })
                }

                function dropInto (evt) {
                    evt.preventDefault();
                    scope.$apply(function () {
                        scope.dropState = 'drop';
                    });

                    scope.files = [];
                    var files = evt.dataTransfer.files;
                    if (files.length > 0) {
                        scope.$apply(function () {
                            angular.forEach(files, function(file) {
                                if(file.type.indexOf("text") == 0) {
                                    var reader = new FileReader();

                                    reader.onload = function (evt) {
                                        scope.$apply(function() {
                                            scope.files.push({ raw: angular.copy(file), data: evt.target.result});
                                            scope.model = scope.files;
                                        });
                                    };

                                    reader.readAsText(file, "UTF-8");
                                }
                                else if(file.type.indexOf("image")== 0) {
                                    var reader = new FileReader();

                                    reader.onload = function (evt) {
                                        scope.$apply(function() {
                                            scope.files.push({ raw: angular.copy(file), image: evt.target.result});
                                            scope.model = scope.files;
                                        });
                                    };

                                    reader.readAsDataURL(file);
                                }
                                else {
                                    scope.files.push({ raw: angular.copy(file), file: angular.copy(file) });
                                    scope.model = scope.files;
                                }
                            });
                        });
                    }
                }

                scope.$watch('model', function() {
                    formCtrl['hasFiles'].$setValidity('files', scope.model.length > 0);
                });

                elem.on('dragenter', dragEnterLeave);
                elem.on('dragleave', dragEnterLeave);
                elem.on('dragover', dragOver);
                elem.on('drop', dropInto);
            }
        };
    }]);
