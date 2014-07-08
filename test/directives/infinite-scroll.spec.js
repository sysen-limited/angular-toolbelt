describe('Directive > Infinite Scroll', function() {
    var scope, body, $compile, $window, $timeout;

    beforeEach(module('toolbelt.infiniteScroll'));

    beforeEach(inject(function ($injector, $rootScope) {
        body = angular.element($injector.get('$document')).find('body').empty().css('margin', 0).css('padding', 0)
            .append('<div style="min-height: 200px"></div>');

        scope = $rootScope;
        $compile = $injector.get('$compile');;
        $window = $injector.get('$window');
        $timeout = $injector.get('$timeout');

        spyOn(scope, '$on').and.callThrough();
        spyOn(scope, '$broadcast').and.callThrough();
    }));

    it('should add an id to the element for tracking', function() {
        var elm = $compile('<ul data-sys-infinite-scroll><li data-ng-repeat="i in [0,1,2,3,4,5]" style="height: 200px">{{ i }}</li></ul>')(scope);
        scope.$digest();

        expect(elm.attr('id')).toContain('infinite-scroll');
    });

    it('should not replace the id if it is already set', function() {
        var elm = $compile('<ul id="myTestId" data-sys-infinite-scroll><li data-ng-repeat="i in [0,1,2,3,4,5]" style="height: 200px">{{ i }}</li></ul>')(scope);
        scope.$digest();

        expect(elm.attr('id')).toBe('myTestId');
    });

    it('should timeout data loading to continue processing scroll events', function() {
        var elm = $compile('<ul data-sys-infinite-scroll><li data-ng-repeat="i in [0,1,2,3,4,5]" style="height: 200px">{{ i }}</li></ul>')(scope);
        scope.$digest();

        angular.element($window).triggerHandler('scroll');
        expect(scope.dataLoad).toBeTruthy();

        $timeout.flush(1000);
        expect(scope.dataLoad).toBeFalsy();
    });

    it('should allow you to specify a shorter load wait time', function() {
        var elm = $compile('<ul data-timeout="200" data-sys-infinite-scroll><li data-ng-repeat="i in [0,1,2,3,4,5]" style="height: 200px">{{ i }}</li></ul>')(scope);
        scope.$digest();

        angular.element($window).triggerHandler('scroll');
        expect(scope.dataLoad).toBeTruthy();

        $timeout.flush(200);
        expect(scope.dataLoad).toBeFalsy();
    });

    // Manage Directive Events
    it('should broadcast events when the page is scrolled', function () {
        var elm = $compile('<ul data-sys-infinite-scroll><li data-ng-repeat="i in [0,1,2,3,4,5]" style="height: 200px">{{ i }}</li></ul>')(scope);
        scope.$digest();

        angular.element($window).triggerHandler('scroll');
        expect(scope.$broadcast).toHaveBeenCalledWith('_infiniteScroll', 'DATA_LOAD');
    });

    it('should allow you to stop the scroll via an event', function() {
        var elm = $compile('<ul data-sys-infinite-scroll><li data-ng-repeat="i in [0,1,2,3,4,5]" style="height: 200px">{{ i }}</li></ul>')(scope);
        scope.$digest();

        scope.$emit('_infiniteScroll', 'STOP');

        expect(scope.$on).toHaveBeenCalledWith('_infiniteScroll', jasmine.any(Function));
        expect(scope.dataLoad).toBeFalsy();
        expect(scope.stopped).toBeTruthy();
    });

    it('should allow you to start the scroll via an event', function() {
        var elm = $compile('<ul data-sys-infinite-scroll><li data-ng-repeat="i in [0,1,2,3,4,5]" style="height: 200px">{{ i }}</li></ul>')(scope);
        scope.$digest();

        scope.$emit('_infiniteScroll', 'START');

        expect(scope.$on).toHaveBeenCalledWith('_infiniteScroll', jasmine.any(Function));
        expect(scope.dataLoad).toBeFalsy();
        expect(scope.stopped).toBeFalsy();
    });

    it('should listen for events to continue allowing scroll events to be processed', function() {
        var elm = $compile('<ul data-sys-infinite-scroll><li data-ng-repeat="i in [0,1,2,3,4,5]" style="height: 200px">{{ i }}</li></ul>')(scope);
        scope.$digest();

        spyOn($timeout, 'cancel');
        scope.$emit('_infiniteScroll', 'CONTINUE');

        expect(scope.$on).toHaveBeenCalledWith('_infiniteScroll', jasmine.any(Function));
        expect($timeout.cancel).toHaveBeenCalled();
        expect(scope.dataLoad).toBeFalsy();
    });
});