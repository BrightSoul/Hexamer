define("Exam", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    exports.__esModule = true;
    var ExamViewModel = (function () {
        function ExamViewModel() {
            var _this = this;
            this.language = ko.observable(language);
            this.framework = ko.observable(framework);
            this.templateName = ko.observable("QuestionTypes/MultipleChoice");
            setTimeout(function () {
                _this.templateName("QuestionTypes/Reorder");
            }, 5000);
        }
        return ExamViewModel;
    }());
    function initialize() {
        return new ExamViewModel();
    }
    exports.initialize = initialize;
});
define("Exams", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    exports.__esModule = true;
    var ExamsViewModel = (function () {
        function ExamsViewModel() {
            var _this = this;
            this.Status = ko.observable("Rispondi...");
            setTimeout(function () {
                _this.Status("Risposta corretta!");
            }, 2000);
        }
        return ExamsViewModel;
    }());
    function initialize() {
        console.log(arguments);
        return new ExamsViewModel();
    }
    exports.initialize = initialize;
});
define("ILocalization", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("Layout", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    exports.__esModule = true;
    var LoginViewModel = (function () {
        function LoginViewModel() {
            var _this = this;
            ko["amdTemplateEngine"].defaultPath = "/html";
            ko["amdTemplateEngine"].defaultSuffix = ".html";
            //TODO: determinalo in base all'url
            this.CurrentModuleName = ko.observable("Login");
            setTimeout(function () { _this.CurrentModuleName("Exams"); }, 10000);
        }
        LoginViewModel.prototype.ChangeLanguage = function (language) {
        };
        return LoginViewModel;
    }());
    exports.LoginViewModel = LoginViewModel;
});
define("Login", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    exports.__esModule = true;
    var LoginViewModel = (function () {
        function LoginViewModel() {
            var _this = this;
            this.Status = ko.observable("Accedi");
            setTimeout(function () { _this.Status("Acceduto!"); }, 2000);
        }
        return LoginViewModel;
    }());
    function initialize() {
        console.log(arguments);
        return new LoginViewModel();
    }
    exports.initialize = initialize;
});
define("Localizations/English", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Localization = (function () {
        function Localization() {
            this.LoginWithSlack = "Login with slack";
        }
        return Localization;
    }());
    exports.Localization = Localization;
});
define("Localizations/Italian", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Localization = (function () {
        function Localization() {
            this.Language = "it";
            this.LoginWithSlack = "Accedi con slack";
        }
        return Localization;
    }());
    exports.Localization = Localization;
});
define("QuestionTypes/MultipleChoice", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    exports.__esModule = true;
    var HelloViewModel = (function () {
        function HelloViewModel(language, framework) {
            this.language = ko.observable(language);
            this.framework = ko.observable(framework);
        }
        return HelloViewModel;
    }());
    exports.HelloViewModel = HelloViewModel;
});
define("QuestionTypes/Reorder", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    exports.__esModule = true;
    var HelloViewModel = (function () {
        function HelloViewModel(language, framework) {
            this.language = ko.observable(language);
            this.framework = ko.observable(framework);
        }
        return HelloViewModel;
    }());
    exports.HelloViewModel = HelloViewModel;
});
