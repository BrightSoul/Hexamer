requirejs.config({
    baseUrl: 'js/',
    urlArgs: "v=" + Math.random(),
    deps: ['qs', 'js-cookie', 'text', 'domReady', 'knockout', 'knockout-amd-helpers'],
    bundles: {
        'app': ['Layout', 'Login', 'Exams', 'Questions', 'Admin', 'AdminLogin', 'QuestionTypes/MultipleChoice', 'QuestionTypes/CodeCompletion', 'QuestionTypes/ClickImage', 'QuestionTypes/Reorder']
    }
});