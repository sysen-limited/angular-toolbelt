describe('Directive > Growl', function() {
    var scope, $compile, $timeout;

    beforeEach(module('toolbelt.growl'));

    beforeEach(inject(function ($injector, $rootScope, _$compile_) {
        scope = $rootScope;
        $compile = _$compile_;
        $timeout = $injector.get('$timeout');

        spyOn(scope, '$on').and.callThrough();
    }));

    var templates = {
        'default': '<div data-sys-growl></div>',
        'timeout': '<div data-timeout="5" data-sys-growl></div>',
        'limit': '<div data-sys-growl="3"></div>'
    };

    var message = {
        type: 'info',
        title: 'Test Message',
        content: 'Lorem Ipsum'
    };

    function compileDirective(template) {
        template = template ? templates[template] : templates['default'];
        var elm = $compile(template)(scope);
        scope.$digest();
        return elm;
    }

    it('should listen for broadcast events to display', function() {
        compileDirective();

        scope.$emit('_addGrowl', angular.copy(message));

        expect(scope.$on).toHaveBeenCalledWith('_addGrowl', jasmine.any(Function));
        expect(scope.growls.length).toBe(1);
    });

    it('should set the default type to info', function() {
        compileDirective();

        scope.$emit('_addGrowl', { title: "Blank", content: "Blank" });
        expect(scope.growls[0].type).toBe('info');
    });

    it('should allow you to add multiple messages via the emit, each new message should arrive at the front of the list', function() {
        compileDirective();

        scope.$emit('_addGrowl', angular.copy(message));
        expect(scope.growls.length).toBe(1);

        scope.$emit('_addGrowl', angular.copy(message));
        expect(scope.growls.length).toBe(2);

        scope.$emit('_addGrowl', angular.copy(message));
        expect(scope.growls.length).toBe(3);

        scope.$emit('_addGrowl', angular.copy(message));
        expect(scope.growls.length).toBe(4);

        scope.$emit('_addGrowl', angular.copy(message));
        expect(scope.growls.length).toBe(5);

        var newMessage = angular.copy(message);
        newMessage.title = "New Title";

        scope.$emit('_addGrowl', newMessage);
        expect(scope.growls.length).toBe(6);
        expect(scope.growls[0].title).toBe("New Title");
    });

    it('should display the messages inside the template that has been loaded', function() {
        var elm = compileDirective();

        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$digest();

        expect(scope.limit).toBe(5);
        expect(scope.growls.length).toBe(5);
        expect(elm.find('div').length).toBe(5);
    });

    it('should remove items when the timeout option is used', function() {
        var elm = compileDirective('timeout');

        scope.$emit('_addGrowl', angular.copy(message));
        expect(scope.growls.length).toBe(1);

        $timeout.flush();
        expect(scope.growls.length).toBe(0);
    })

    it('should listen to the limit value set on the directive', function() {
        var elm = compileDirective('limit');

        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$digest();

        expect(scope.limit).toBe(3);
        expect(scope.growls.length).toBe(5);
        expect(elm.find('div').length).toBe(3);
    });

    it('should remove the item when the button is clicked', function() {
        var elm = compileDirective();

        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$emit('_addGrowl', angular.copy(message));
        scope.$digest();

        expect(elm.find('div').length).toBe(3);
        expect(scope.growls.length).toBe(3);

        var buttons = elm.find('button');
        angular.element(buttons[0]).triggerHandler('click');
        expect(elm.find('div').length).toBe(2);
        expect(scope.growls.length).toBe(2);

        angular.element(buttons[1]).triggerHandler('click');
        expect(elm.find('div').length).toBe(1);
        expect(scope.growls.length).toBe(1);

        angular.element(buttons[2]).triggerHandler('click');
        expect(elm.find('div').length).toBe(0);
        expect(scope.growls.length).toBe(0);
    });
});