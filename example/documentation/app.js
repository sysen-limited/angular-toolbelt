angular.module('example', ['sysen.toolbelt', 'ui.bootstrap', 'ngTouch'])
    .controller('growlCtrl', ['$scope', function ($scope) {
        $scope.growl = { type: 'info' };
        $scope.addGrowl = function (growl) {
            $scope.$emit('_addGrowl', { type: growl.type, title: 'Example Growl', content: growl.message })
        }
    }])

    .controller('scrollCtrl', ['$scope', '$location', function ($scope, $location) {
        if ($location.path()) {
            $scope.$emit('_pageScroll', $location.path().substring(1));
        }
    }])

    .controller('strengthCtrl', ['$scope', function ($scope) {
        $scope.reset = function() {
            $scope.passwordStrengthForm.$setPristine();
            $scope.password = "";
        }
    }]);