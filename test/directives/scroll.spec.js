describe('Directive > Scroll', function () {
    var scope, $compile, $window, $interval;

    beforeEach(module('toolbelt.scroll'));

    beforeEach(inject(function ($injector, $rootScope) {
        angular.element($injector.get('$document')).find('body')
            .empty()
            .append('<section id="test-one" style="position: absolute; top: 200px;"></section>')
            .append('<section id="test-two" style="position: absolute; top: 600px;"></section>')
            .append('<div style="padding-top: 100px; margin-top: 100px;"><section id="test-div" style="position: relative; top: 200px;"></section></div>');

        scope = $rootScope;
        $compile = $injector.get('$compile');
        $window = $injector.get('$window');
        $interval = $injector.get('$interval');

        spyOn(scope, '$on').and.callThrough();
        spyOn($window, 'scrollTo').and.callThrough();
    }));

    // Broadcast Events
    it('should listen for broadcast events to scroll the page', function () {
        $compile('<a data-target="test-one" data-sys-scroll></a>')(scope);

        scope.$emit('_pageScroll', 'test-one');
        expect($window.scrollTo).toHaveBeenCalledWith(0, 200);
        expect(scope.$on).toHaveBeenCalledWith('_pageScroll', jasmine.any(Function));
    });

    // Simple Scroll Clicks
    it('should allow you to click the link to scroll the page', function () {
        var elm = $compile('<a data-target="test-one" data-sys-scroll></a>')(scope);

        elm.triggerHandler('click');

        expect($window.scrollTo).toHaveBeenCalledWith(0, 200);
    });

    it('should allow you to click the link to scroll the page', function () {
        var elm = $compile('<a data-target="test-two" data-sys-scroll></a>')(scope);

        elm.triggerHandler('click');

        expect($window.scrollTo).toHaveBeenCalledWith(0, 600);
    });

    it('should stay in the correct place if the scroll is called when already at the scroll location', function () {
        var elm = $compile('<a data-target="test-one" data-sys-scroll></a>')(scope);

        elm.triggerHandler('click');
        expect($window.scrollTo).toHaveBeenCalledWith(0, 200);
        $window.scrollTo.calls.reset();

        elm.triggerHandler('click');
        expect($window.scrollTo).toHaveBeenCalledWith(0, 200);
    });

    it('should allow you to scroll multiple times', function () {
        var elmOne = $compile('<a data-target="test-one" data-sys-scroll></a>')(scope);
        var elmTwo = $compile('<a data-target="test-two" data-sys-scroll></a>')(scope);

        elmOne.triggerHandler('click');
        elmTwo.triggerHandler('click');
        elmOne.triggerHandler('click');

        expect($window.scrollTo.calls.argsFor(0)).toEqual([0, 200]);
        expect($window.scrollTo.calls.argsFor(1)).toEqual([0, 600]);
        expect($window.scrollTo.calls.argsFor(2)).toEqual([0, 200]);
    });

    it('should ignore requests if the target does not exist', function () {
        var elm = $compile('<a data-target="test-three" data-sys-scroll></a>')(scope);

        elm.triggerHandler('click');

        expect($window.scrollTo).not.toHaveBeenCalled();
    });

    it('should ignore requests if the target is not set', function () {
        var elm = $compile('<a data-sys-scroll></a>')(scope);

        elm.triggerHandler('click');

        expect($window.scrollTo).not.toHaveBeenCalled();
    });

    // Advanced Scroll Clicks
    it('should have an animated scroll activity', function () {
        var elm = $compile('<a data-target="test-one" data-sys-scroll="smooth"></a>')(scope);

        elm.triggerHandler('click');
        $interval.flush(1000);

        expect($window.scrollTo.calls.count()).toEqual(10);
        expect($window.scrollTo.calls.argsFor(8)).toEqual([0, 180]);
        expect($window.scrollTo.calls.argsFor(9)).toEqual([0, 200]);
    });

    it('should be able to manage nested position scrolling', function () {
        var elm = $compile('<a data-target="test-div" data-sys-scroll></a>')(scope);

        elm.triggerHandler('click');

        expect($window.scrollTo).toHaveBeenCalledWith(0, 400);
    });

    it('should allow you to specify the offset on the page to use', function () {
        var elm = $compile('<a data-target="test-one" data-offset="80" data-sys-scroll></a>')(scope);

        elm.triggerHandler('click');

        expect($window.scrollTo).toHaveBeenCalledWith(0, 120);
    });
});
