angular.module('toolbelt.platform', [])
    .provider('$detectPlatform', function () {
        var self = this;

        function getSystem($window) {
            var agent = $window.navigator.userAgent,
                matches = agent.match(/(windows|macintosh|linux)/i) || [],
                name, version, temp;

            name = matches[0];
            if(!name) {
                return { name: "Unknown", version: "0" };
            }
            switch(name.toLowerCase()) {
                case "windows":
                    temp = agent.match(/windows\snt\s([^;)]*)/i);
                    version = temp[1];
                    break;
                case "macintosh":
                    temp = agent.match(/(mac\sos\s?x)\s([^;)]*)/i);
                    name = temp[1];
                    version = temp[2].replace(/_/g, '.');
                    break;
                case "linux":
                    temp = agent.match(/ubuntu/i);
                    version = temp[0];
                    break;
            }
            return { name: name, version: version };
        }

        function getBrowser($window) {
            var agent = $window.navigator.userAgent,
                matches = agent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+(\.\d+)?(\.\d+)?)/i) || [],
                name, version, temp;
            if (/trident/i.test(matches[1])) {
                temp = /\brv[ :]+(\d+(\.\d+)?(\.\d+)?)/g.exec(agent);
                name = 'MSIE';
                version = temp[1];
            }
            else if (matches[1] === 'Chrome') {
                temp = agent.match(/\bOPR\/(\d+(\.\d+)?(\.\d+)?)/);
                if (temp !== null) {
                    name = 'Opera';
                    version = temp[1];
                }
            }
            if (!name && !version) {
                matches = matches[2] ? [matches[1], matches[2]] : [$window.navigator.appName, $window.navigator.appVersion, '-?'];
                if ((temp = agent.match(/version\/(\d+(\.\d+)?(\.\d+)?)/i)) !== null) {
                    matches.splice(1, 1, temp[1]);
                }
                name = matches[0];
                version = matches[1];
            }
            return { name: name || "Unknown", version: version || "0" };
        }

        self.approvedBrowsers = [];

        self.allowBrowser = function (browser, version) {
            this.approvedBrowsers.push({ name: browser, version: version || 0 });
            return self;
        };

        self.$get = ["$window", function ($window) {
            var system = getSystem($window);
            var browser = getBrowser($window);
            return {
                language: $window.navigator.language,
                system: {
                    name: system.name,
                    version: system.version,
                    matches: function (systemName, systemVersion) {
                        if (systemVersion) {
                            return(this.name && this.name == systemName && this.version == systemVersion);
                        } else {
                            return(this.name && this.name == systemName);
                        }
                    }
                },
                browser: {
                    name: browser.name,
                    version: browser.version,
                    matches: function (browserName, browserVersion) {
                        if (browserVersion) {
                            return(this.name && this.name == browserName && this.version == browserVersion);
                        } else {
                            return(this.name && this.name == browserName);
                        }

                    },
                    isAllowed: function () {
                        for (var i = 0; i < self.approvedBrowsers.length; i++) {
                            if (this.name == self.approvedBrowsers[i].name && parseFloat(this.version) >= parseFloat(self.approvedBrowsers[i].version)) {
                                return true;
                            }
                        }
                        return false;
                    }
                }
            };
        }];
    });
