module.exports = function (config) {
    config.set({

        plugins: [
            'karma-jasmine',
            'karma-safari-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-coverage-0.11',
            'karma-spec-reporter'
        ],

        basePath: '.',

        frameworks: [
            'jasmine'
        ],

        files: [
            'lib/angular/angular.js',
            'lib/**/angular-*.js',
            'lib/marked/marked.js',
            'src/**/*.js',
            'test/**/*.spec.js'
        ],

        //logLevel: LOG_DEBUG,

        autoWatch: true,

        browsers: [
            //'Safari'
            //'Chrome'
            //'Firefox'
            'PhantomJS'
        ],

        preprocessors: {
            'src/**/*.js': 'coverage'
        },

        reporters: [
            "spec",
            "coverage"
        ],

        coverageReporter: {
            type: 'lcov',
            dir: 'logs/karma/'
        }
    })
}