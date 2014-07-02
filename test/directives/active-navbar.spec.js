describe('Directive > Active Navbar', function() {
    var document, scope, $location, $compile;

    beforeEach(module('toolbelt.navbar'));

    beforeEach(inject(function ($injector, $rootScope) {
        scope = $rootScope;
        $location = $injector.get('$location');
        $compile = $injector.get('$compile');
    }));

    describe('When using the default directive', function() {
        var elm;
        beforeEach(inject(function ($injector) {
            document = angular.element($injector.get('$document')).find('body')
                .empty()
                .append([
                    '<nav data-sys-active-navbar>',
                        '<a href="#" data-route="/testLink">Test Link</a>',
                        '<a href="#" data-route="/anotherLink">Another Link</a>',
                        '<ul>',
                            '<li>',
                                '<a href="#" data-route="/myList">My List Link</a>',
                            '</li>',
                            '<li>',
                                '<a href="#" data-route="/list.*">List Heading</a>',
                                '<ul>',
                                    '<li>',
                                        '<a href="#" data-route="/list/link">List Link</a>',
                                    '</li>',
                                '</ul>',
                            '</li>',
                        '</ul>',
                        '<a href="#">Normal Link</a>',
                    '</nav>'
                ].join(''));

            elm = $compile(document)(scope);
            $location.path('testLink');
            scope.$digest();
        }));

        it('should mark the required link as active based on the target and route matching', function() {
            expect(angular.element(elm.find('a')[0]).hasClass('active')).toBeTruthy();
        });

        it('should look for a location change and remove the active class and re-assign', function() {
            $location.path('anotherLink');
            scope.$digest();
            expect(angular.element(elm.find('a')[0]).hasClass('active')).toBeFalsy();
            expect(angular.element(elm.find('a')[1]).hasClass('active')).toBeTruthy();
        });

        it('should add the active class to parent elements', function() {
            $location.path('myList');
            scope.$digest();

            expect(angular.element(elm.find('a')[2]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('li')[0]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('ul')[0]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('nav')[0]).hasClass('active')).toBeFalsy();
        });

        it('should ignore links where the data-route attribute has not been set', function() {

        });

        it('should remove the active class on parent elements when no longer active', function() {
            $location.path('myList');
            scope.$digest();

            $location.path('testLink');
            scope.$digest();
            expect(angular.element(elm.find('a')[0]).hasClass('active')).toBeTruthy();

            expect(angular.element(elm.find('a')[2]).hasClass('active')).toBeFalsy();
            expect(angular.element(elm.find('li')[0]).hasClass('active')).toBeFalsy();
            expect(angular.element(elm.find('ul')[0]).hasClass('active')).toBeFalsy();
            expect(angular.element(elm.find('nav')[0]).hasClass('active')).toBeFalsy();
        });

        it('should work with a regex to highlight a link', function() {
            $location.path('list/test');
            scope.$digest();

            expect(angular.element(elm.find('a')[4]).hasClass('active')).toBeFalsy();
            expect(angular.element(elm.find('a')[3]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('li')[1]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('ul')[0]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('nav')[0]).hasClass('active')).toBeFalsy();
        });

        it('should not remove an active flag in the hierarchy when selecting a new item from the list - going down', function() {
            $location.path('list/test');
            scope.$digest();
            $location.path('list/link');
            scope.$digest();

            expect(angular.element(elm.find('a')[3]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('a')[4]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('li')[1]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('ul')[0]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('nav')[0]).hasClass('active')).toBeFalsy();
        });

        it('should not remove an active flag in the hierarchy when selecting a new item from the list - going up', function() {
            $location.path('list/link');
            scope.$digest();
            $location.path('list/test');
            scope.$digest();

            expect(angular.element(elm.find('a')[3]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('a')[4]).hasClass('active')).toBeFalsy();
            expect(angular.element(elm.find('li')[1]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('ul')[0]).hasClass('active')).toBeTruthy();
            expect(angular.element(elm.find('nav')[0]).hasClass('active')).toBeFalsy();
        });

        it('should not error when the current location does not have a navigation entry', function() {
            $location.path('missing-link');
            scope.$digest();
        });
    });
});
