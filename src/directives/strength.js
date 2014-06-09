angular.module('toolbelt.strength', ['ngSanitize'])
    .directive('sysStrength', function() {
        var labels = ['success', 'info', 'warning', 'danger'];
        var results = [
            { rank: 0, complexity: 'Too Short', label: 'default' },
            { rank: 1, complexity: 'Very Weak' },
            { rank: 2, complexity: 'Weak' },
            { rank: 3, complexity: 'Poor' },
            { rank: 4, complexity: 'Good' },
            { rank: 5, complexity: 'Strong' },
            { rank: 6, complexity: 'Very Strong' }
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

        function getResult(score, requiredRank) {
            var percentage = (score * 100) / 20;
            var result = percentage < 20 ? results[1] :
                   percentage < 35 ? results[2] :
                   percentage < 50 ? results[3] :
                   percentage < 65 ? results[4] :
                   percentage < 90 ? results[5] : results[6];

            var rankDifference = requiredRank - result.rank;
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
                var minComplexity = parseInt(attrs.complexity) || 4;

                if(minComplexity > 6) {
                    minComplexity = 6;
                }

                var formCtrl = elem.inheritedData("$formController");

                var updateStrength = function(string) {
                    if(string) {
                        var score = 0;
                        // Gain points based on variation of character types
                        if (hasLowerCase(string)) score++;
                        if (hasUpperCase(string)) score++;
                        if (hasNumeric(string)) score++;
                        if (hasSpecial(string)) score++;
                        // Length improves weighting
                        score *= (string.length / 2);
                        // Requires a minimum length
                        scope.result = string.length >= minLength ? getResult(score, minComplexity) : results[0];
                    } else {
                        scope.result = results[0];
                    }
                    formCtrl[scope.target].$setValidity('strength', minComplexity <= scope.result.rank);
                };

                scope.$watch('model', updateStrength);
            }
        };
    });