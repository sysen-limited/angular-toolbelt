describe('Service > Platform Detection', function () {

    var msieString = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)";
    var explorerString = "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko";
    var firefoxString = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:20.0) Gecko/20100101 Firefox/20.0";
    var chromeUbuntuString = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36";
    var chromeString = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36";
    var safariString = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.77.4 (KHTML, like Gecko) Version/7.0.5 Safari/537.77.4";
    var operaString = "Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14";
    var oprString = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36 OPR/15.0.1147.100";

    describe('Supporting Functions', function () {
        describe('Platform Matching', function () {
            beforeEach(module('toolbelt.platform'));

            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: safariString, language: "en-gb" } });
                });
            });

            it('should allow access to the language being used', inject(function ($detectPlatform) {
                expect($detectPlatform.language).toBe("en-gb");
            }));

            it('should let you check that the current name is the expected one', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.matches("Safari")).toBeTruthy();
                expect($detectPlatform.system.matches("Mac OS X")).toBeTruthy();
            }));

            it('should let you check that the current name AND version are the expected ones', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.matches("Safari", "7.0.5")).toBeTruthy();
                expect($detectPlatform.system.matches("Mac OS X", "10.9.4")).toBeTruthy();
            }));

            it('should inform when the current version is NOT the expected one', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.matches("Safari", "7.0")).toBeFalsy();
                expect($detectPlatform.system.matches("Mac OS X", "10.8.6")).toBeFalsy();
            }));

            it('should inform when the current name is NOT the expected one', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.matches("Chrome")).toBeFalsy();
                expect($detectPlatform.system.matches("Windows")).toBeFalsy();
            }));

            it('should inform when the current name OR version are NOT the expected one are the expected ones', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.matches("Chrome", "7.0.5")).toBeFalsy();
                expect($detectPlatform.browser.matches("Safari", "36.0")).toBeFalsy();
                expect($detectPlatform.system.matches("Windows", "10.9.4")).toBeFalsy();
                expect($detectPlatform.system.matches("Mac OS X", "10.8.6")).toBeFalsy();
            }));
        });

        describe('Service Configuration Options', function () {
            angular.module('mockDetectionApp', [])
                .config(function ($detectPlatformProvider) {
                    $detectPlatformProvider.allowBrowser("Chrome").allowBrowser("Safari", "7.0").allowBrowser("Internet Explorer", "11");
                });

            beforeEach(module('toolbelt.platform', 'mockDetectionApp'));

            describe('A valid platform', function () {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: safariString, language: "en-gb" } });
                    });
                });

                it('the browser should be allowed', inject(function ($detectPlatform) {
                    expect($detectPlatform.browser.isAllowed()).toBeTruthy();
                }));
            });

            describe('A valid platform', function () {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: chromeString, language: "en-gb" } });
                    });
                });

                it('the browser should be allowed', inject(function ($detectPlatform) {
                    expect($detectPlatform.browser.isAllowed()).toBeTruthy();
                }));
            });

            describe('An invalid platform', function () {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: msieString, language: "en-gb" } });
                    });
                });

                it('the browser should not be allowed', inject(function ($detectPlatform) {
                    expect($detectPlatform.browser.isAllowed()).toBeFalsy();
                }));
            });

            describe('An unknown platform', function () {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: "", language: "en-gb" } });
                    });
                });

                it('the browser should not be allowed', inject(function ($detectPlatform) {
                    expect($detectPlatform.browser.isAllowed()).toBeFalsy();
                }));
            });
        });
    });

    describe('Working with different platforms', function () {
        beforeEach(module('toolbelt.platform'));

        describe('Microsoft Internet Explorer', function () {
            describe('Version <= 10', function () {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: msieString, language: "en-gb" } });
                    });
                });

                it('should detect "Windows"', inject(function ($detectPlatform) {
                    expect($detectPlatform.system.name).toBe("Windows");
                    expect($detectPlatform.system.version).toBe("6.1");
                }));

                it('should detect "MSIE 10.0"', inject(function ($detectPlatform) {
                    expect($detectPlatform.browser.name).toBe("MSIE");
                    expect($detectPlatform.browser.version).toBe("10.0");
                }));
            });

            describe('Version > 10', function () {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: explorerString, language: "en-gb" } });
                    });
                });

                it('should detect "Windows"', inject(function ($detectPlatform) {
                    expect($detectPlatform.system.name).toBe("Windows");
                    expect($detectPlatform.system.version).toBe("6.3");
                }));

                it('should detect "MSIE 11.0"', inject(function ($detectPlatform) {
                    expect($detectPlatform.browser.name).toBe("MSIE");
                    expect($detectPlatform.browser.version).toBe("11.0");
                }));
            });
        });

        describe('Mozilla Firefox', function () {
            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: firefoxString, language: "en-gb" } });
                });
            });

            it('should detect "Linux"', inject(function ($detectPlatform) {
                expect($detectPlatform.system.name).toBe("Linux");
                expect($detectPlatform.system.version).toBe("Ubuntu");
            }));

            it('should detect "Firefox 20.0"', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.name).toBe("Firefox");
                expect($detectPlatform.browser.version).toBe("20.0");
            }));
        });

        describe('Google Chrome', function () {
            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: chromeString, language: "en-gb" } });
                });
            });

            it('should detect "Macintosh"', inject(function ($detectPlatform) {
                expect($detectPlatform.system.name).toBe("Mac OS X");
                expect($detectPlatform.system.version).toBe("10.9.4");
            }));

            it('should detect "Chrome 36.0"', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.name).toBe("Chrome");
                expect($detectPlatform.browser.version).toBe("36.0.1985");
            }));
        });

        describe('Google Chrome ON Linux', function () {
            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: chromeUbuntuString, language: "en-gb" } });
                });
            });

            it('should detect "Linux"', inject(function ($detectPlatform) {
                expect($detectPlatform.system.name).toBe("Linux");
                expect($detectPlatform.system.version).toBe("Linux");
            }));

            it('should detect "Chrome 41.0"', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.name).toBe("Chrome");
                expect($detectPlatform.browser.version).toBe("41.0.2272");
            }));
        });

        describe('Apple Safari', function () {
            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: safariString, language: "en-gb" } });
                });
            });

            it('should detect "Macintosh"', inject(function ($detectPlatform) {
                expect($detectPlatform.system.name).toBe("Mac OS X");
                expect($detectPlatform.system.version).toBe("10.9.4");
            }));

            it('should detect "Safari 7.0"', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.name).toBe("Safari");
                expect($detectPlatform.browser.version).toBe("7.0.5");
            }));
        });

        describe('Opera', function () {
            describe('Version <= 14', function () {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: operaString, language: "en-gb" } });
                    });
                });

                it('should detect "Windows"', inject(function ($detectPlatform) {
                    expect($detectPlatform.system.name).toBe("Windows");
                    expect($detectPlatform.system.version).toBe("6.0");
                }));

                it('should detect "Opera 12.14"', inject(function ($detectPlatform) {
                    expect($detectPlatform.browser.name).toBe("Opera");
                    expect($detectPlatform.browser.version).toBe("12.14");
                }));
            });

            describe('Version > 14', function () {
                beforeEach(function () {
                    module(function ($provide) {
                        $provide.value('$window', { navigator: { userAgent: oprString, language: "en-gb" } });
                    });
                });

                it('should detect "Windows"', inject(function ($detectPlatform) {
                    expect($detectPlatform.system.name).toBe("Windows");
                    expect($detectPlatform.system.version).toBe("6.1");
                }));

                it('should detect "Opera 15.0"', inject(function ($detectPlatform) {
                    expect($detectPlatform.browser.name).toBe("Opera");
                    expect($detectPlatform.browser.version).toBe("15.0.1147");
                }));
            });
        });

        describe('Unknown Browser', function () {
            beforeEach(function () {
                module(function ($provide) {
                    $provide.value('$window', { navigator: { userAgent: "", language: "en-gb" } });
                });
            });

            it('should detect "Unknown"', inject(function ($detectPlatform) {
                expect($detectPlatform.system.name).toBe("Unknown");
                expect($detectPlatform.system.version).toBe("0");
            }));

            it('should detect not crash with unknown browsers', inject(function ($detectPlatform) {
                expect($detectPlatform.browser.name).toBe("Unknown");
                expect($detectPlatform.browser.version).toBe("0");
            }));
        });
    });
});
