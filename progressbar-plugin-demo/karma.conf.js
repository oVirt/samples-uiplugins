module.exports = function (config) {

    config.set({

        files: [
            'src/lib/angular/js/angular.js',
            'src/lib/angular/js/angular-*.js',
            'test/lib/angular/js/angular-mocks.js',
            'src/js/**/*.js',
            'test/js/test-util.js',
            'test/js/*-specs.js'
        ],

        frameworks: ['jasmine'],

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-junit-reporter'
        ],

        reporters: ['progress', 'junit'],

        junitReporter: {
            outputFile: 'test/out/unit.xml'
        },

        port: 9876,

        logLevel: config.LOG_INFO,

        autoWatch: true

    });

};
