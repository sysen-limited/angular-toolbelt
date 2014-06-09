describe('Directive > Password Strength', function () {
    var scope, $compile;

    beforeEach(module('toolbelt.strength'));
    beforeEach(module('toolbelt.strength.tpl'));

    beforeEach(function () {
        jasmine.Expectation.addMatchers({
            equalsResult: function () {
                return {
                    compare: function (actual, expected) {
                        return {
                            pass: actual.rank == expected.rank
                                & actual.complexity == expected.complexity
                                & actual.label == expected.label,
                            message: JSON.stringify(actual) + " does not match " + JSON.stringify(expected)
                        };
                    }
                };
            }
        });
    });

    beforeEach(inject(function ($injector, $rootScope) {
        scope = $rootScope;
        $compile = $injector.get('$compile');
    }));

    describe('When using the default directive', function () {
        var elm, directiveScope;

        beforeEach(function () {
            elm = $compile('<form><input type="password" name="password" data-ng-model="model.password" /><span data-target="password" data-ng-model="model.password" data-sys-strength></span></form>')(scope);
            scope.$digest();
            directiveScope = scope.$$childHead;
        });

        it('should insert the template', function () {
            expect(elm.find('span').length).toBe(1);
            expect(elm.find('span').text()).toBe('Too Short');
        });

        it('should bind the the model specified', function () {
            expect(directiveScope.target).toBe('password');
        });

        it('should require a minimum of 6 characters to trigger a change', function () {
            directiveScope.model = 'qwert';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 0, complexity: 'Too Short', label: 'default' });

            directiveScope.model = 'qwerty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 1, complexity: 'Very Weak', label: 'danger' });
        });

        it('should mark "Very Weak" as a possible complexity rank', function () {
            directiveScope.model = 'qwerty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 1, complexity: 'Very Weak', label: 'danger' });

            directiveScope.model = 'QWERTY';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 1, complexity: 'Very Weak', label: 'danger' });

            directiveScope.model = '123456';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 1, complexity: 'Very Weak', label: 'danger' });
        });

        it('should mark "Weak" as a possible complexity rank', function () {
            directiveScope.model = 'qw3rty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 2, complexity: 'Weak', label: 'warning' });

            directiveScope.model = 'Qwerty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 2, complexity: 'Weak', label: 'warning' });

            directiveScope.model = 'qw*rty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 2, complexity: 'Weak', label: 'warning' });
        });

        it('should mark "Poor" as a possible complexity rank', function () {
            directiveScope.model = 'Qw3rty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 3, complexity: 'Poor', label: 'info' });

            directiveScope.model = 'Qw*rty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 3, complexity: 'Poor', label: 'info' });

            directiveScope.model = 'qw*r1y';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 3, complexity: 'Poor', label: 'info' });
        });

        it('should mark "Good" as a possible complexity rank', function () {
            directiveScope.model = 'Qw33rty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 4, complexity: 'Good', label: 'success' });

            directiveScope.model = 'QQw*rty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 4, complexity: 'Good', label: 'success' });

            directiveScope.model = 'Qw**rty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 4, complexity: 'Good', label: 'success' });
        });

        it('should mark "Strong" as a possible complexity rank', function () {
            directiveScope.model = 'QwertyPassword';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 5, complexity: 'Strong', label: 'success' });

            directiveScope.model = 'Qwerty$1';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 5, complexity: 'Strong', label: 'success' });
        });

        it('should mark "Very Strong" as a possible complexity rank', function () {
            directiveScope.model = 'Qwerty$12';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 6, complexity: 'Very Strong', label: 'success' });
        });

        it('should mark the input as invalid if the strength is too low', function () {
            directiveScope.model = 'qwerty';
            scope.$digest();
            expect(elm.find('input').hasClass('ng-invalid-strength')).toBeTruthy();
        });

        it('should mark the input as valid if the strength is ok', function () {
            directiveScope.model = 'Qwerty$1';
            scope.$digest();
            expect(elm.find('input').hasClass('ng-valid-strength')).toBeTruthy();
        });
    });

    describe('When using the min-length attribute', function () {
        var elm, directiveScope;

        it('should require a minimum of 4 characters when attribute is set to this', function () {
            elm = $compile('<form><input type="password" name="password" data-ng-model="model.password" /><span data-target="password" data-ng-model="model" data-min-length="4" data-sys-strength></span></form>')(scope);
            scope.$digest();
            directiveScope = scope.$$childHead;

            directiveScope.model = 'uio';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 0, complexity: 'Too Short', label: 'default' });

            directiveScope.model = 'uiop';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 1, complexity: 'Very Weak', label: 'danger' });
        });

        it('should default to 6 characters if 0 is used for min-length', function () {
            elm = $compile('<form><input type="password" name="password" data-ng-model="model.password" /><span data-target="password" data-ng-model="model" data-min-length="0" data-sys-strength></span></form>')(scope);
            scope.$digest();
            directiveScope = scope.$$childHead;

            directiveScope.model = 'qwert';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 0, complexity: 'Too Short', label: 'default' });

            directiveScope.model = 'qwerty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 1, complexity: 'Very Weak', label: 'danger' });
        });

        it('should default to 6 characters if a "string" is used for min-length', function () {
            elm = $compile('<form><input type="password" name="password" data-ng-model="model.password" /><span data-target="password" data-ng-model="model" data-min-length="zero" data-sys-strength></span></form>')(scope);
            scope.$digest();
            directiveScope = scope.$$childHead;

            directiveScope.model = 'qwert';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 0, complexity: 'Too Short', label: 'default' });

            directiveScope.model = 'qwerty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 1, complexity: 'Very Weak', label: 'danger' });
        });
    });

    describe('When using the rank attribute', function () {
        var elm, directiveScope;

        it('should mark success at a lower rank if required', function () {
            elm = $compile('<form><input type="password" name="password" data-ng-model="model.password" /><span data-target="password" data-ng-model="model" data-complexity="2" data-sys-strength></span></form>')(scope);
            scope.$digest();
            directiveScope = scope.$$childHead;

            directiveScope.model = 'qwerty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 1, complexity: 'Very Weak', label: 'info' });

            directiveScope.model = 'Qwerty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 2, complexity: 'Weak', label: 'success' });

            directiveScope.model = 'Qwerty$12';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 6, complexity: 'Very Strong', label: 'success' });
        });

        it('should set to maximum if too high a value is used', function () {
            elm = $compile('<form><input type="password" name="password" data-ng-model="model.password" /><span data-target="password" data-ng-model="model" data-complexity="9" data-sys-strength></span></form>')(scope);
            scope.$digest();
            directiveScope = scope.$$childHead;

            directiveScope.model = 'qwerty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 1, complexity: 'Very Weak', label: 'danger' });

            directiveScope.model = 'Qwerty$1';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 5, complexity: 'Strong', label: 'info' });

            directiveScope.model = 'Qwerty$12';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 6, complexity: 'Very Strong', label: 'success' });
        });

        it('should set to the default if a string is used', function () {
            elm = $compile('<form><input type="password" name="password" data-ng-model="model.password" /><span data-target="password" data-ng-model="model" data-complexity="low" data-sys-strength></span></form>')(scope);
            scope.$digest();
            directiveScope = scope.$$childHead;

            directiveScope.model = 'Qw3rty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 3, complexity: 'Poor', label: 'info' });


            directiveScope.model = 'Qw**rty';
            scope.$digest();
            expect(directiveScope.result).equalsResult({ rank: 4, complexity: 'Good', label: 'success' });
        });
    });
});
