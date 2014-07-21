describe('Service > Browser Detection', function () {
    var msieString = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)";
    var explorerString = "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko";
    var firefoxString = "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:30.0) Gecko/20100101 Firefox/30.0";
    var chromeString = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36";
    var safariString = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.77.4 (KHTML, like Gecko) Version/7.0.5 Safari/537.77.4";
    var operaString = "Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14";
    var oprString = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36 OPR/15.0.1147.100";

    beforeEach(module('toolbelt.detection'));

    describe('Supporting Functions', function() {
        describe('Browser Matching', function() {
            beforeEach(module('toolbelt.detection'));

            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: safariString } });
                });
            });

            it('should let you check that the current browser is the expected one', inject(function ($detectBrowser) {
                expect($detectBrowser.matches("Safari")).toBeTruthy();
            }));

            it('should let you check that the current browser AND version are the expected ones', inject(function ($detectBrowser) {
                expect($detectBrowser.matches("Safari", "7.0.5")).toBeTruthy();
            }));

            it('should inform when the current version is NOT the expected one', inject(function ($detectBrowser) {
                expect($detectBrowser.matches("Safari", "7.0")).toBeFalsy();
            }));

            it('should inform when the current browser is NOT the expected one', inject(function ($detectBrowser) {
                expect($detectBrowser.matches("Chrome")).toBeFalsy();
            }));

            it('should inform when the current browser AND version are NOT the expected one are the expected ones', inject(function ($detectBrowser) {
                expect($detectBrowser.matches("Chrome", "36.0")).toBeFalsy();
            }));
        });

        describe('Service Configuration Options', function() {
            angular.module('mockApp', [])
                .config(function($detectBrowserProvider) {
                    $detectBrowserProvider.allow().allow("Chrome").allow("Safari", "7.0").allow("Internet Explorer", "11");
                });

            beforeEach(module('toolbelt.detection', 'mockApp'));

            describe('A valid browser', function() {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: safariString } });
                    });
                });

                it('should be allowed', inject(function ($detectBrowser) {
                    expect($detectBrowser.isAllowed()).toBeTruthy();
                }));
            });

            describe('A valid browser', function() {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: chromeString } });
                    });
                });

                it('should be allowed', inject(function ($detectBrowser) {
                    expect($detectBrowser.isAllowed()).toBeTruthy();
                }));
            });

            describe('An invalid browser', function() {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: msieString } });
                    });
                });

                it('should not be allowed', inject(function ($detectBrowser) {
                    expect($detectBrowser.isAllowed()).toBeFalsy();
                }));
            });

            describe('An unknown browser', function() {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: "" } });
                    });
                });

                it('should be allowed', inject(function ($detectBrowser) {
                    expect($detectBrowser.isAllowed()).toBeTruthy();
                }));
            });
        });
    });

    describe('Microsoft Internet Explorer', function () {
        beforeEach(module('toolbelt.detection'));

        describe('Version <= 10', function() {
            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: msieString } });
                });
            });

            it('should detect "MSIE 10.0"', inject(function ($detectBrowser) {
                expect($detectBrowser.name).toBe("MSIE");
                expect($detectBrowser.version).toBe("10.0");
            }));
        });

        describe('Version > 10', function() {
            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: explorerString } });
                });
            });

            it('should detect "MSIE 11.0"', inject(function ($detectBrowser) {
                expect($detectBrowser.name).toBe("MSIE");
                expect($detectBrowser.version).toBe("11.0");
            }));
        });
    });

    describe('Mozilla Firefox', function () {
        beforeEach(module('toolbelt.detection'));

        beforeEach(function () {
            module(function ($provide) {
                $provide.value('$window', { navigator: { userAgent: firefoxString } });
            });
        });

        it('should detect "Firefox"', inject(function ($detectBrowser) {
            expect($detectBrowser.name).toBe("Firefox");
            expect($detectBrowser.version).toBe("30.0");
        }));
    });

    describe('Google Chrome', function () {
        beforeEach(module('toolbelt.detection'));

        beforeEach(function () {
            module(function ($provide) {
                $provide.value('$window', { navigator: { userAgent: chromeString } });
            });
        });

        it('should detect "Chrome 36.0"', inject(function ($detectBrowser) {
            expect($detectBrowser.name).toBe("Chrome");
            expect($detectBrowser.version).toBe("36.0.1985");
        }));
    });

    describe('Apple Safari', function () {
        beforeEach(module('toolbelt.detection'));

        beforeEach(function () {
            module(function ($provide) {
                $provide.value('$window', { navigator: { userAgent: safariString } });
            });
        });

        it('should detect "Safari 7.0"', inject(function ($detectBrowser) {
            expect($detectBrowser.name).toBe("Safari");
            expect($detectBrowser.version).toBe("7.0.5");
        }));
    });

    describe('Opera', function () {
        beforeEach(module('toolbelt.detection'));

        describe('Version <= 14', function() {
            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: operaString } });
                });
            });

            it('should detect "Opera 12.14"', inject(function ($detectBrowser) {
                expect($detectBrowser.name).toBe("Opera");
                expect($detectBrowser.version).toBe("12.14");
            }));
        });

        describe('Version > 14', function() {
            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: oprString } });
                });
            });

            it('should detect "Opera 15.0"', inject(function ($detectBrowser) {
                expect($detectBrowser.name).toBe("Opera");
                expect($detectBrowser.version).toBe("15.0.1147");
            }));
        });
    });

    describe('Unknown Browser', function () {
        beforeEach(module('toolbelt.detection'));

        beforeEach(function () {
            module(function ($provide) {
                $provide.value('$window', { navigator: { userAgent: "" } });
            });
        });

        it('should detect not crash with unknown browsers', inject(function ($detectBrowser) {
            expect($detectBrowser.name).toBe("Unknown");
            expect($detectBrowser.version).toBe("0");
        }));
    });
});
