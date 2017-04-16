var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("Exam", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var ExamViewModel = (function () {
        function ExamViewModel() {
            var _this = this;
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
define("User", ["require", "exports"], function (require, exports) {
    "use strict";
    var User = (function () {
        function User() {
        }
        return User;
    }());
    exports.User = User;
});
define("ILayout", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Layout", ["require", "exports", "knockout", "axios"], function (require, exports, ko, axios_1) {
    "use strict";
    var LayoutViewModel = (function () {
        function LayoutViewModel() {
            var templateEngine = ko["amdTemplateEngine"];
            templateEngine.defaultPath = "/html";
            templateEngine.defaultSuffix = ".html";
            this.Strings = this.CreateStrings();
            //TODO: determinalo in base al cookie
            var user = null;
            this.User = ko.observable(user);
            //TODO: determinalo in base all'url. Se l'utente è null, vai con Login 
            if (user) {
                //TODO: determinalo in base all'url. Se l'utente è null, vai con Login 
                this.CurrentModuleName = ko.observable("Login");
            }
            else {
                this.CurrentModuleName = ko.observable("Login");
            }
        }
        LayoutViewModel.prototype.Get = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axios_1.default.get(url)];
                        case 1:
                            response = _a.sent();
                            if (response.status < 200 && response.status > 200)
                                throw new Error("Errore di comunicazione con il server");
                            return [2 /*return*/, response.data];
                    }
                });
            });
        };
        LayoutViewModel.prototype.Post = function (url, data) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axios_1.default.post(url, data)];
                        case 1:
                            response = _a.sent();
                            if (response.status < 200 && response.status > 200)
                                throw new Error("Errore di comunicazione con il server");
                            return [2 /*return*/, response.data];
                    }
                });
            });
        };
        LayoutViewModel.prototype.Navigate = function (module) {
            this.CurrentModuleName(module);
        };
        LayoutViewModel.prototype.SetUserIdentity = function (user) {
            if (!user)
                throw new Error("L'utente non è valido");
            this.User(user);
        };
        LayoutViewModel.prototype.ClearUserIdentity = function () {
        };
        LayoutViewModel.prototype.UpdateUserIdentity = function (user) {
            this.User(null);
            this.Navigate("Login");
        };
        LayoutViewModel.prototype.CreateStrings = function () {
            return {
                LoginWithSlack: "Accedi con slack"
            };
        };
        LayoutViewModel.prototype.ChangeLanguage = function (language) {
        };
        return LayoutViewModel;
    }());
    exports.LayoutViewModel = LayoutViewModel;
});
define("Results/SlackAuthorizationUrlResult", ["require", "exports"], function (require, exports) {
    "use strict";
    var SlackAuthorizationUrlResult = (function () {
        function SlackAuthorizationUrlResult() {
        }
        return SlackAuthorizationUrlResult;
    }());
    exports.SlackAuthorizationUrlResult = SlackAuthorizationUrlResult;
});
define("Login", ["require", "exports", "knockout", "axios"], function (require, exports, ko, axios_2) {
    "use strict";
    var LoginViewModel = (function () {
        function LoginViewModel(layout) {
            this.Status = ko.observable("Accedi");
            this.SlackAuthorizationUrl = ko.observable(null);
            this.layout = layout;
            this.FetchSlackAuthorizationUrl();
            //setTimeout(() => { this.Status("Acceduto!"); }, 2000);
        }
        LoginViewModel.prototype.FetchSlackAuthorizationUrl = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.layout.Get("/api/Slack/AuthorizationUrl")];
                        case 1:
                            result = _a.sent();
                            this.SlackAuthorizationUrl(result.slackAuthorizationUrl);
                            return [2 /*return*/];
                    }
                });
            });
        };
        LoginViewModel.prototype.Login = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axios_2.default.post("/api/Login", {})];
                        case 1:
                            response = _a.sent();
                            this.layout.Navigate("Exams");
                            return [2 /*return*/];
                    }
                });
            });
        };
        return LoginViewModel;
    }());
    function initialize(layout) {
        return new LoginViewModel(layout);
    }
    exports.initialize = initialize;
});
define("QuestionTypes/MultipleChoice", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
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
    var HelloViewModel = (function () {
        function HelloViewModel(language, framework) {
            this.language = ko.observable(language);
            this.framework = ko.observable(framework);
        }
        return HelloViewModel;
    }());
    exports.HelloViewModel = HelloViewModel;
});
