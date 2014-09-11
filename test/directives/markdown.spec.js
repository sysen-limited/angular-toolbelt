describe('Provider > Markdown,', function () {

    beforeEach(module('toolbelt.markdown'));

    it('should start with defaults', function () {
        inject(function (markdownConverter) {
            expect(markdownConverter.defaults.gfm).toBeTruthy();
            expect(markdownConverter.defaults.tables).toBeTruthy();
            expect(markdownConverter.defaults.breaks).toBeFalsy();
            expect(markdownConverter.defaults.sanitize).toBeFalsy();
            expect(markdownConverter.defaults.langPrefix).toBe('lang-');
        });
    });

    it('should enable changing defaults', function () {
        module(function (markdownConverterProvider) {
            expect(markdownConverterProvider).toBeDefined();
            markdownConverterProvider.setOptions({ gfm: false, breaks: true, langPrefix: 'locale-' });
        });
        inject(function (markdownConverter) {
            expect(markdownConverter.defaults.gfm).toBeFalsy();
            expect(markdownConverter.defaults.tables).toBeTruthy();
            expect(markdownConverter.defaults.breaks).toBeTruthy();
            expect(markdownConverter.defaults.sanitize).toBeFalsy();
            expect(markdownConverter.defaults.langPrefix).toBe('locale-');
        });
    });
});

describe('Directive > Markdown,', function () {
    var element, $scope, $compile, markdown, html;

    beforeEach(module('toolbelt.markdown'));

    beforeEach(inject(function ($injector) {
        $scope = $injector.get('$rootScope').$new();

        $scope.markdown = markdown = "# Hello World\n\nHere is a [link](http://sysen.net).\nAnd an image ![alt](http://angularjs.org/img/AngularJS-large.png).\n\n    Code goes here.\n";
        html = "<h1 id=\"hello-world\">Hello World</h1>\n<p>Here is a <a href=\"http://sysen.net\">link</a>.\nAnd an image <img src=\"http://angularjs.org/img/AngularJS-large.png\" alt=\"alt\">.</p>\n<pre><code>Code goes here.\n</code></pre>";

        $compile = $injector.get('$compile');
    }));

    it('should ignore blank content', function () {
        element = $compile('<sys-markdown></sys-markdown>')($scope);
        expect(element.html()).toContain('');
    });

    it('should convert markdown in an element', function () {
        element = $compile('<sys-markdown>' + markdown + '</sys-markdown>')($scope);
        expect(element.html()).toContain(html);
    });

    it('should convert markdown in an attribute', function () {
        element = $compile('<div data-sys-markdown>' + markdown + '</div>')($scope);
        expect(element.html()).toContain(html);
    });

    it('should convert markdown from scope or model', function () {
        element = $compile('<div data-sys-markdown="markdown"></div>')($scope);
        expect(element.html()).toContain(html);
    });

    it('should convert markdown from string', function () {
        element = $compile('<div data-sys-markdown="\'' + markdown + '\'"></div>')($scope);
        expect(element.html()).toContain(html);
    });

    //TODO: Would be good to be able to test when the 'marked' library is not available however its being loaded by karma
});