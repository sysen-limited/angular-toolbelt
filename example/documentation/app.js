angular.module('example', ['sysen.toolbelt'])
    .controller('growlCtrl', ['$scope', function($scope) {
        $scope.addGrowl = function() {
            $scope.$emit('_addGrowl', { type: 'info', title: 'Example Growl', content: 'Here is the content, <strong>it can hold html</strong>'})
        }
    }]);