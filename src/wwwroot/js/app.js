var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Exam", ["require", "exports", "knockout"], function (require, exports, ko) {
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
define("Exams", ["require", "exports", "knockout"], function (require, exports, ko) {
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
define("ILocalization", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("ViewModel", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    exports.__esModule = true;
    var ViewModel = (function () {
        function ViewModel() {
            ko["amdTemplateEngine"].defaultPath = "/templates";
            ko["amdTemplateEngine"].defaultSuffix = ".html";
        }
        ViewModel.prototype.ChangeLanguage = function (language) {
        };
        return ViewModel;
    }());
    exports.ViewModel = ViewModel;
});
define("Login", ["require", "exports", "knockout", "ViewModel"], function (require, exports, ko, ViewModel_1) {
    "use strict";
    exports.__esModule = true;
    var HelloViewModel = (function (_super) {
        __extends(HelloViewModel, _super);
        function HelloViewModel(language, framework) {
            var _this = _super.call(this) || this;
            _this.language = ko.observable(language);
            _this.framework = ko.observable(framework);
            _this.templateName = ko.observable("QuestionTypes/MultipleChoice");
            setTimeout(function () {
                _this.templateName("QuestionTypes/Reorder");
            }, 5000);
            return _this;
        }
        return HelloViewModel;
    }(ViewModel_1.ViewModel));
    function init() {
        ko.applyBindings(new HelloViewModel("TypeScript", "Knockout"));
    }
    exports.init = init;
    ;
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
