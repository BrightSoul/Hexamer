define("question", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    exports.__esModule = true;
    var HelloViewModel = (function () {
        function HelloViewModel(language, framework) {
            this.language = ko.observable(language);
            this.framework = ko.observable(framework);
        }
        return HelloViewModel;
    }());
    function init() {
        ko.applyBindings(new HelloViewModel("TypeScript", "Knockout"));
    }
    exports.init = init;
    ;
});
