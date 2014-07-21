angular.module('toolbelt.detection', [])
    .provider('$detectBrowser', function () {
        var self = this;

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
                if (temp != null) {
                    name = 'Opera';
                    version = temp[1];
                }
            }
            if (!name && !version) {
                matches = matches[2] ? [matches[1], matches[2]] : [$window.navigator.appName, $window.navigator.appVersion, '-?'];
                if ((temp = agent.match(/version\/(\d+(\.\d+)?(\.\d+)?)/i)) != null) {
                    matches.splice(1, 1, temp[1]);
                }
                name = matches[0];
                version = matches[1];
            }
            return { name: name || "Unknown", version: version || "0" };
        }

        self.approvedBrowsers = [];

        self.allow = function (browser, version) {
            this.approvedBrowsers.push({ name: browser || "Unknown", version: version || 0 });
            return self;
        };

        self.$get = ["$window", function ($window) {
            var browser = getBrowser($window);
            return {
                name: browser.name,
                version: browser.version,
                matches: function (browserName, browserVersion) {
                    if(browserVersion) {
                        return(this.name && this.name == browserName && browserVersion && this.version == browserVersion);
                    } else {
                        return(this.name && this.name == browserName);
                    }

                },
                isAllowed: function () {
                    for(var i = 0; i < self.approvedBrowsers.length; i++) {
                        if(this.name == self.approvedBrowsers[i].name && parseFloat(this.version) >= parseFloat(self.approvedBrowsers[i].version)) {
                            return true;
                        }
                    }
                    return false;
                }
            };
        }];
    });
