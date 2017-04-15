requirejs.config({
    baseUrl: 'js/',
    deps: ['qs', 'js-cookie', 'text', 'domReady', 'knockout', 'knockout-amd-helpers'],
    bundles: {
        'app': ['Layout', 'Login', 'Exams', 'Question']
    }
});