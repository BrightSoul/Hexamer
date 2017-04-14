requirejs.config({
    baseUrl: 'js/',
    deps: ["text", "domReady", "knockout", "knockout-amd-helpers"],
    bundles: {
        'app': ['Login', 'Exams', 'Question']
    }
});
