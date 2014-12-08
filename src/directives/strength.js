angular.module('toolbelt.strength', ['ngSanitize'])
    .directive('sysStrength', function() {
        var requiredComplexity, requiredCharsets;
        var labels = ['success', 'warning', 'danger'];
        var results = [
            { rank: 1, complexity: 'Too short', label: 'danger' },
            { rank: 2, complexity: 'Too few character types', label: 'warning' },
            { rank: 3, complexity: 'Very Weak' },
            { rank: 4, complexity: 'Weak' },
            { rank: 5, complexity: 'Poor' },
            { rank: 6, complexity: 'Good' },
            { rank: 7, complexity: 'Strong' },
            { rank: 8, complexity: 'Very Strong' }
        ];

        function hasLowerCase(string) {
            return /[a-z]+/.test(string);
        }

        function hasUpperCase(string) {
            return /[A-Z]+/.test(string);
        }

        function hasNumeric(string) {
            return /[0-9]+/.test(string);
        }

        function hasSpecial(string) {
            return /[$-/:-?{-~!"^_`\[\]]/g.test(string);
        }

        function getResult(score) {
            var percentage = (score * 100) / 20;
            var result = percentage < 20 ? results[2] :
                   percentage < 35 ? results[3] :
                   percentage < 50 ? results[4] :
                   percentage < 65 ? results[5] :
                   percentage < 90 ? results[6] : results[7];

            var rankDifference = requiredComplexity - result.rank;
            if (rankDifference >= labels.length) {
                rankDifference = labels.length - 1;
            } else if (rankDifference < 0) {
                rankDifference = 0;
            }
            result.label = labels[rankDifference];

            return result;
        }

        return {
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                target: '@'
            },
            replace: true,
            templateUrl: 'template/toolbelt/strength.html',
            link: function(scope, elem, attrs) {
                var minLength = parseInt(attrs.minLength) || 6;
                var formCtrl = elem.inheritedData("$formController");

                requiredComplexity = parseInt(attrs.complexity) > 8 ? 8 : parseInt(attrs.complexity) || 6;
                requiredCharsets = parseInt(attrs.charsets) > 4 ? 4 : parseInt(attrs.charsets) || 1;

                var updateStrength = function(string) {
                    var charsets = 0, score = 0;
                    if(string) {
                        // Gain points based on variation of character types
                        if (hasLowerCase(string)) charsets++;
                        if (hasUpperCase(string)) charsets++;
                        if (hasNumeric(string)) charsets++;
                        if (hasSpecial(string)) charsets++;
                        // Length improves weighting
                        score = charsets * (string.length / 2);
                        // Requires a minimum length
                        scope.result = string.length >= minLength ? (requiredCharsets <= charsets ? getResult(score) : results[1]) : results[0];
                    } else {
                        scope.result = results[0];
                    }
                    formCtrl[scope.target].$setValidity('strength', requiredComplexity <= scope.result.rank && requiredCharsets <= charsets);
                };

                scope.$watch('model', updateStrength);
            }
        };
    });
