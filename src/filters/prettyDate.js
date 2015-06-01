angular.module('toolbelt.prettyDate', [])
    .filter('prettyDate', function () {
        return function (startDate) {
            if (startDate instanceof Date === false) {
                startDate = new Date(startDate);
            }

            var date = new Date();
            var secs = Math.floor((date.getTime() - startDate.getTime()) / 1000);
            if (secs == 1) return secs + " second ago";
            if (secs < 60) return secs + " seconds ago";
            if (secs < 120) return Math.floor(secs / 60) + " minute ago";
            if (secs < 3600) return Math.floor(secs / 60) + " minutes ago";
            if (secs < 7200) return Math.floor(secs / 3600) + " hour ago";
            if (secs < 86400) return Math.floor(secs / 3600) + " hours ago";
            if (secs < 172800) return Math.floor(secs / 86400) + " day ago";
            if (secs < 604800) return Math.floor(secs / 86400) + " days ago";
            return startDate.toDateString();
        };
    });