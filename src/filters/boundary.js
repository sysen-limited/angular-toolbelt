angular.module('toolbelt.boundary', [])
    .filter('boundary', function () {
        return function (list, mode, field) {
            if (list instanceof Array === false) {
                return "Filter requires an array list";
            }

            var value = field ? list[0][field] : list[0];
            value = parseFloat(value);

            angular.forEach(list, function (entry) {
                var check = field ? entry[field] : entry;
                check = parseFloat(check);

                switch (mode) {
                    case 'max':
                        if (check > value) {
                            value = check;
                        }
                        break;
                    case 'min':
                        if (check < value) {
                            value = check;
                        }
                        break;
                }
            });

            return value;
        };
    });
