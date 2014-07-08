angular.module('example', ['sysen.toolbelt', 'ui.bootstrap', 'ngTouch'])
    .controller('growlCtrl', ['$scope', function ($scope) {
        $scope.growl = { type: 'info' };
        $scope.addGrowl = function (growl) {
            $scope.$emit('_addGrowl', { type: growl.type, title: 'Example Growl', content: growl.message })
        }
    }])

    .controller('scrollCtrl', ['$scope', '$location', function ($scope, $location) {
        if ($location.path()) {
            $scope.$emit('_pageScroll', $location.path().substring(1), 70);
        }
    }])

    .controller('infiniteScrollCtrl', ['$scope', '$location', function ($scope) {
        $scope.infiniteList = [0,1,2,3,4,5,6,7,8,9];
        $scope.$on('_infiniteScroll', function(evt, message) {
            if(message.toString() === 'DATA_LOAD') {
                var listLength = $scope.infiniteList.length;
                if(listLength > 99) {
                    $scope.$emit('_infiniteScroll', 'STOP');
                } else {
                    for (var i = $scope.infiniteList.length; i < listLength + 10; i++) {
                        $scope.infiniteList.push(i);
                    }
                }
                $scope.$emit('_infiniteScroll', 'CONTINUE');
                $scope.$apply();
            }
        });
        $scope.resetData = function() {
            $scope.infiniteList = [0,1,2,3,4,5,6,7,8,9];
            $scope.$emit('_infiniteScroll', 'START');
        }
    }])

    .controller('strengthCtrl', ['$scope', function ($scope) {
        $scope.reset = function() {
            $scope.passwordStrengthForm.$setPristine();
            $scope.password = "";
        }
    }]);
