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
define("Models/Page", ["require", "exports"], function (require, exports) {
    "use strict";
    var Page;
    (function (Page) {
        Page[Page["Login"] = 0] = "Login";
        Page[Page["Exams"] = 1] = "Exams";
        Page[Page["Questions"] = 2] = "Questions";
    })(Page = exports.Page || (exports.Page = {}));
});
define("Models/User", ["require", "exports"], function (require, exports) {
    "use strict";
    var User = (function () {
        function User() {
        }
        return User;
    }());
    exports.User = User;
});
define("Models/ILayout", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Models/NavigationContext", ["require", "exports", "Models/Page"], function (require, exports, Page_1) {
    "use strict";
    var NavigationContext = (function () {
        function NavigationContext(layout, page, navigationArgs) {
            this.layout = layout;
            this.page = page;
            this.navigationArgs = navigationArgs;
        }
        Object.defineProperty(NavigationContext.prototype, "Layout", {
            get: function () {
                return this.layout;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationContext.prototype, "Page", {
            get: function () {
                return Page_1.Page[this.page];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationContext.prototype, "NavigationArgs", {
            get: function () {
                return this.navigationArgs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationContext.prototype, "CanGoBackToHome", {
            get: function () {
                return this.page == Page_1.Page.Questions;
            },
            enumerable: true,
            configurable: true
        });
        return NavigationContext;
    }());
    exports.NavigationContext = NavigationContext;
});
define("Models/Exam", ["require", "exports"], function (require, exports) {
    "use strict";
    var Exam = (function () {
        function Exam() {
        }
        return Exam;
    }());
    exports.Exam = Exam;
});
define("Exams", ["require", "exports", "knockout", "Models/Page"], function (require, exports, ko, Page_2) {
    "use strict";
    var ExamsViewModel = (function () {
        function ExamsViewModel(navigationContext) {
            var _this = this;
            this.navigationContext = navigationContext;
            this.BeginExam = function (exam) {
                _this.navigationContext.Layout.Navigate(Page_2.Page.Questions, exam.Id + "/1");
            };
            this.Exams = ko.observableArray();
            this.GetExams();
        }
        ExamsViewModel.prototype.GetExams = function () {
            return __awaiter(this, void 0, void 0, function () {
                var exams;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.navigationContext.Layout.Get('/api/Exams')];
                        case 1:
                            exams = _a.sent();
                            this.Exams(exams);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ExamsViewModel;
    }());
    function initialize(navigationContext) {
        return new ExamsViewModel(navigationContext);
    }
    exports.initialize = initialize;
});
define("Results/UserResult", ["require", "exports"], function (require, exports) {
    "use strict";
    var UserResult = (function () {
        function UserResult() {
        }
        return UserResult;
    }());
    exports.UserResult = UserResult;
});
define("Layout", ["require", "exports", "knockout", "axios", "Models/NavigationContext", "Models/Page"], function (require, exports, ko, axios_1, NavigationContext_1, Page_3) {
    "use strict";
    var LayoutViewModel = (function () {
        function LayoutViewModel() {
            var _this = this;
            var templateEngine = ko["amdTemplateEngine"];
            templateEngine.defaultPath = "/html";
            templateEngine.defaultSuffix = ".html?v=" + Math.random();
            this.User = ko.observable(null);
            this.NavigationContext = ko.observable(null);
            this.Title = ko.observable("Hexamer");
            window.onhashchange = function () { _this.ChangePage(); };
            this.GetUser();
        }
        LayoutViewModel.prototype.SetTitle = function (title) {
            this.Title(title);
        };
        LayoutViewModel.prototype.GetUsername = function () {
            var user = this.User();
            return user ? user.Name : null;
        };
        LayoutViewModel.prototype.ChangePage = function () {
            this.NavigateAccordingToHash(Page_3.Page.Login);
        };
        LayoutViewModel.prototype.GetUser = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Get("/api/User")];
                        case 1:
                            result = _a.sent();
                            if (!result.IsAuthenticated) return [3 /*break*/, 2];
                            this.Login(result.User);
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.Logout()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        LayoutViewModel.prototype.Get = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axios_1.default.get(url)];
                        case 1:
                            response = _a.sent();
                            this.EnsureSuccessStatusCode(response.status);
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
                            this.EnsureSuccessStatusCode(response.status);
                            return [2 /*return*/, response.data];
                    }
                });
            });
        };
        LayoutViewModel.prototype.EnsureSuccessStatusCode = function (statusCode) {
            if (statusCode == 401) {
                alert("Per favore rieffettua il login");
                this.Navigate(Page_3.Page.Login);
            }
            else if (statusCode >= 400) {
                alert("Si è verificato un errore nel server, per favore segnala questo problema");
            }
        };
        LayoutViewModel.prototype.Navigate = function (page, navigationArgs) {
            if (navigationArgs === void 0) { navigationArgs = null; }
            var newHash = Page_3.Page[page] + (navigationArgs ? '/' + navigationArgs : '');
            if (location.hash.substr(location.hash.indexOf('#') + 1) == newHash)
                this.NavigateAccordingToHash(page);
            else
                location.hash = newHash;
        };
        LayoutViewModel.prototype.NavigateAccordingToHash = function (defaultPage) {
            var navigationInfo = location.hash.substr(location.hash.indexOf('#') + 1).split('/');
            var destinationPage = defaultPage;
            if (navigationInfo[0] in Page_3.Page) {
                destinationPage = Page_3.Page[navigationInfo[0]];
            }
            var navigationArgs = navigationInfo.length > 1 ? navigationInfo[1] : null;
            if (destinationPage == Page_3.Page.Login && this.User()) {
                this.Navigate(Page_3.Page.Exams);
            }
            else if (destinationPage != Page_3.Page.Login && !this.User()) {
                this.Navigate(Page_3.Page.Login);
            }
            else {
                var navigationContext = new NavigationContext_1.NavigationContext(this, destinationPage, navigationArgs);
                this.NavigationContext(navigationContext);
            }
        };
        LayoutViewModel.prototype.BackToHome = function () {
            if (confirm("Vuoi davvero tornare alla home?")) {
                this.Navigate(Page_3.Page.Exams);
            }
        };
        LayoutViewModel.prototype.Login = function (user) {
            this.User(user);
            this.Navigate(Page_3.Page.Exams);
        };
        LayoutViewModel.prototype.Logout = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Get("/api/Logout")];
                        case 1:
                            _a.sent();
                            this.User(null);
                            this.Navigate(Page_3.Page.Login);
                            return [2 /*return*/];
                    }
                });
            });
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
define("Login", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var LoginViewModel = (function () {
        function LoginViewModel(navigationContext) {
            this.navigationContext = navigationContext;
            this.SlackAuthorizationUrl = ko.observable(null);
            this.GetSlackAuthorizationUrl();
        }
        LoginViewModel.prototype.GetSlackAuthorizationUrl = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.navigationContext.Layout.Get("/api/Slack/AuthorizationUrl")];
                        case 1:
                            result = _a.sent();
                            this.SlackAuthorizationUrl(result.SlackAuthorizationUrl);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return LoginViewModel;
    }());
    function initialize(navigationContext) {
        return new LoginViewModel(navigationContext);
    }
    exports.initialize = initialize;
});
define("Models/Question", ["require", "exports"], function (require, exports) {
    "use strict";
    var Question = (function () {
        function Question() {
        }
        return Question;
    }());
    exports.Question = Question;
});
define("Questions", ["require", "exports", "knockout", "Models/Exam", "Models/Question"], function (require, exports, ko, Exam_1, Question_1) {
    "use strict";
    var QuestionsViewModel = (function () {
        function QuestionsViewModel(navigationContext) {
            var _this = this;
            this.navigationContext = navigationContext;
            this.UpdateTime = function () {
                var currentTime = (new Date()).getTime();
                var remainingMilliseconds = _this.EndTime - currentTime;
                if (remainingMilliseconds <= 0) {
                    _this.RemainingTime("Tempo scaduto");
                }
                else {
                    var remainingTime = new Date(remainingMilliseconds).toISOString().substr(11, 8);
                    remainingTime = remainingTime.substr(0, 1) == '0' ? remainingTime.substr(1) : remainingTime;
                    remainingTime = remainingTime.substr(0, 2) == '0:' ? remainingTime.substr(2) : remainingTime;
                    _this.RemainingTime(remainingTime);
                    _this.TimeIsRunningOut(remainingMilliseconds < 30 * 60 * 1000);
                }
            };
            this.RemainingTime = ko.observable("");
            this.TimeIsRunningOut = ko.observable(false);
            this.HasExpirationTime = ko.observable(false);
            this.IsCurrentQuestionBookmarked = ko.observable(false);
            this.BookmarkUpdater = ko.computed(this.UpdateBookmark);
            this.QuestionsCount = ko.observable(0);
            this.CurrentQuestion = ko.observable(null);
            var exam = new Exam_1.Exam();
            exam.Id = "exam1";
            exam.Title = "Programmazione C#";
            exam.RemainingSeconds = 3800;
            this.EndTime = (new Date()).getTime() + exam.RemainingSeconds * 1000;
            this.navigationContext.Layout.SetTitle(exam.Title);
            this.Exam = ko.observable(exam);
            if (exam.RemainingSeconds == null) {
                this.RemainingTime("Nessuna scadenza");
            }
            else {
                this.HasExpirationTime(true);
                setInterval(this.UpdateTime, 1000);
            }
            var question = new Question_1.Question();
            question.Text = "Lorem ipsum";
            question.CallToAction = "Compila qui";
            question.Data = "";
            question.Id = "q1";
            question.Bookmarked = false;
            question.Type = "MultipleChoice";
            this.CurrentQuestion(question);
            this.IsCurrentQuestionBookmarked(question.Bookmarked);
            this.QuestionsCount(26);
        }
        QuestionsViewModel.prototype.UpdateBookmark = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        return QuestionsViewModel;
    }());
    function initialize(navigationContext) {
        return new QuestionsViewModel(navigationContext);
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
