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
define("Models/ExamStatus", ["require", "exports"], function (require, exports) {
    "use strict";
    var ExamStatus;
    (function (ExamStatus) {
        ExamStatus[ExamStatus["Incomplete"] = 0] = "Incomplete";
        ExamStatus[ExamStatus["NotPassed"] = 1] = "NotPassed";
        ExamStatus[ExamStatus["Passed"] = 2] = "Passed";
        ExamStatus[ExamStatus["WellDone"] = 3] = "WellDone";
        ExamStatus[ExamStatus["Excellent"] = 4] = "Excellent";
    })(ExamStatus = exports.ExamStatus || (exports.ExamStatus = {}));
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
            this.OpenExam = function (exam) {
                _this.navigationContext.Layout.Navigate(Page_2.Page.Questions, exam.Id + "/" + exam.LastQuestionDisplayed);
            };
            this.ResetExam = function (exam) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!confirm("Vuoi davvero ricominciare da capo?")) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.navigationContext.Layout.Post("/api/Exams/" + exam.Id, null)];
                        case 1:
                            _a.sent();
                            window.location.reload();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); };
            this.Exams = ko.observableArray();
            this.navigationContext.Layout.IsBusy(true);
            this.GetExams();
            navigationContext.Layout.SetTitle("Homepage");
        }
        ExamsViewModel.prototype.GetExams = function () {
            return __awaiter(this, void 0, void 0, function () {
                var exams, showConfetti;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.navigationContext.Layout.Get('/api/Exams')];
                        case 1:
                            exams = _a.sent();
                            this.Exams(exams);
                            this.navigationContext.Layout.IsBusy(false);
                            showConfetti = exams.filter(function (exam) { return exam.IsNewlyCompleted && exam.Passed === true; });
                            if (showConfetti.length > 0) {
                                setTimeout(function () {
                                    window["confettiful"] = new window["Confettiful"](document.querySelector('#confetti'));
                                }, 500);
                            }
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
define("Localization/SupportedLocales", ["require", "exports"], function (require, exports) {
    "use strict";
    var SupportedLocales;
    (function (SupportedLocales) {
        SupportedLocales[SupportedLocales["It"] = 0] = "It";
        SupportedLocales[SupportedLocales["En"] = 1] = "En";
    })(SupportedLocales = exports.SupportedLocales || (exports.SupportedLocales = {}));
});
define("Localization/ILocale", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Layout", ["require", "exports", "knockout", "axios", "Models/NavigationContext", "Models/Page", "Localization/SupportedLocales"], function (require, exports, ko, axios_1, NavigationContext_1, Page_3, SupportedLocales_1) {
    "use strict";
    var LayoutViewModel = (function () {
        function LayoutViewModel() {
            var _this = this;
            this.LoadLocale = function () {
                var currentLocale = _this.CurrentLocale();
                if (!currentLocale)
                    return;
                requirejs(["Localization/Locale/" + currentLocale], function (localeModule) {
                    var locale = new localeModule[currentLocale]();
                    _this.Locale(locale);
                    _this.Title(_this.Locale().ApplicationName);
                    if (_this.User())
                        _this.NavigateAccordingToHash(_this.CurrentPage);
                });
            };
            this.SelectLocale = function (locale) {
                _this.CurrentLocale(locale);
            };
            var templateEngine = ko["amdTemplateEngine"];
            templateEngine.defaultPath = "/html";
            templateEngine.defaultSuffix = ".html?v=" + Math.random();
            this.User = ko.observable(null);
            this.IsBusy = ko.observable(null);
            this.NavigationContext = ko.observable(null);
            this.SupportedLocales = [];
            this.Locale = ko.observable();
            this.Title = ko.observable();
            this.CurrentLocale = ko.observable(null);
            this.LocaleLoader = ko.computed(this.LoadLocale);
            this.InitLocale();
            this.GetUser();
        }
        LayoutViewModel.prototype.InitLocale = function () {
            this.CreateLocaleBinding();
            for (var p in SupportedLocales_1.SupportedLocales) {
                if (isNaN(parseInt(p, 10)))
                    this.SupportedLocales.push(p);
            }
            var navigatorLanguage = navigator.language.toLowerCase();
            var foundLanguage = this.SupportedLocales.filter(function (l) { return l.toLowerCase() == navigatorLanguage || l.toLowerCase().substr(0, 2) == navigatorLanguage.substr(0, 2); });
            if (foundLanguage.length > 0) {
                this.CurrentLocale(foundLanguage[0]);
            }
            else {
                this.CurrentLocale(this.SupportedLocales[0]);
            }
        };
        LayoutViewModel.prototype.CreateLocaleBinding = function () {
            var _this = this;
            ko.bindingHandlers.locale = {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    // This will be called when the binding is first applied to an element
                    // Set up any initial state, event handlers, etc. here
                    var subscription = function (newLocale) {
                        if (newLocale == null) {
                            element.innerText = "";
                        }
                        else {
                            element.innerText = newLocale[valueAccessor()];
                        }
                    };
                    subscription(_this.Locale());
                    _this.Locale.subscribe(subscription);
                },
                update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    element.innerText = _this.Locale()[valueAccessor()];
                }
            };
        };
        LayoutViewModel.prototype.SetTitle = function (title) {
            this.Title(title);
        };
        LayoutViewModel.prototype.GetUsername = function () {
            var user = this.User();
            return user ? user.Name : null;
        };
        LayoutViewModel.prototype.GetUser = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Get("/api/User")];
                        case 1:
                            result = _a.sent();
                            window.onhashchange = function () { _this.NavigateAccordingToHash(Page_3.Page.Login); };
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
                        case 0: return [4 /*yield*/, axios_1.default.get(url, this.GetAxiosConfig())];
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
                        case 0: return [4 /*yield*/, axios_1.default.post(url, data, this.GetAxiosConfig())];
                        case 1:
                            response = _a.sent();
                            this.EnsureSuccessStatusCode(response.status);
                            return [2 /*return*/, response.data];
                    }
                });
            });
        };
        LayoutViewModel.prototype.GetAxiosConfig = function () {
            return {
                headers: { "Accept-Language": this.CurrentLocale() }
            };
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
            var navigationArgs = navigationInfo.length > 1 ? navigationInfo.slice(1).join('/') : null;
            if (destinationPage == Page_3.Page.Login && this.User()) {
                this.Navigate(Page_3.Page.Exams);
            }
            else if (destinationPage != Page_3.Page.Login && !this.User()) {
                this.Navigate(Page_3.Page.Login);
            }
            else {
                this.CurrentPage = destinationPage;
                var navigationContext = new NavigationContext_1.NavigationContext(this, destinationPage, navigationArgs);
                this.NavigationContext(navigationContext);
            }
        };
        LayoutViewModel.prototype.BackToHome = function () {
            if (confirm(this.Locale().BackToHomeConfirmation)) {
                this.Navigate(Page_3.Page.Exams);
            }
        };
        LayoutViewModel.prototype.Login = function (user) {
            this.User(user);
            this.NavigateAccordingToHash(Page_3.Page.Exams);
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
define("Models/QuestionIndicator", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var QuestionIndicator = (function () {
        function QuestionIndicator() {
            this.IsAnswered = ko.observable(false);
            this.IsBookmarked = ko.observable(false);
        }
        return QuestionIndicator;
    }());
    exports.QuestionIndicator = QuestionIndicator;
});
define("Requests/BookmarkRequest", ["require", "exports"], function (require, exports) {
    "use strict";
    var BookmarkRequest = (function () {
        function BookmarkRequest() {
        }
        return BookmarkRequest;
    }());
    exports.BookmarkRequest = BookmarkRequest;
});
define("Requests/AnswerRequest", ["require", "exports"], function (require, exports) {
    "use strict";
    var AnswerRequest = (function () {
        function AnswerRequest() {
        }
        return AnswerRequest;
    }());
    exports.AnswerRequest = AnswerRequest;
});
define("Questions", ["require", "exports", "knockout", "Models/QuestionIndicator", "Models/Page", "Requests/BookmarkRequest", "Requests/AnswerRequest"], function (require, exports, ko, QuestionIndicator_1, Page_4, BookmarkRequest_1, AnswerRequest_1) {
    "use strict";
    var QuestionsViewModel = (function () {
        function QuestionsViewModel(navigationContext) {
            var _this = this;
            this.navigationContext = navigationContext;
            this.ToggleIndicators = function () {
                _this.IndicatorsVisible(!_this.IndicatorsVisible());
                if (_this.IndicatorsVisible()) {
                    setTimeout(function () {
                        var popover = window["jQuery"](".module-questions .popover");
                        popover.css("top", (-(popover.height() + 10)) + "px");
                    }, 10);
                }
            };
            this.ToggleAnswer = function () {
                _this.Question().AnswerRevealed(!_this.Question().AnswerRevealed());
            };
            this.NavigateToQuestion = function (indicator) {
                _this.NavigateToQuestionNumber(indicator.Number);
            };
            this.NavigateToQuestionNumber = function (number) { return __awaiter(_this, void 0, void 0, function () {
                var exam, question, request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.IndicatorsVisible(false);
                            exam = this.Exam();
                            question = this.Question();
                            if (!exam || !question)
                                return [2 /*return*/];
                            if (question.Number == number)
                                return [2 /*return*/];
                            this.navigationContext.Layout.IsBusy(true);
                            if (!this.Question().IsDirty) return [3 /*break*/, 2];
                            request = new AnswerRequest_1.AnswerRequest();
                            request.AnswerProvided = this.Question().AnswerProvided;
                            return [4 /*yield*/, this.navigationContext.Layout.Post("/api/Answer/" + this.ExamId + "/" + this.Question().Number, request)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (number <= 0 || number > exam.Questions)
                                this.navigationContext.Layout.Navigate(Page_4.Page.Exams);
                            else
                                this.navigationContext.Layout.Navigate(Page_4.Page.Questions, this.ExamId + "/" + number);
                            return [2 /*return*/];
                    }
                });
            }); };
            this.NextQuestion = function () {
                var question = _this.Question();
                if (!question)
                    return;
                _this.NavigateToQuestionNumber(question.Number + 1);
            };
            this.PreviousQuestion = function () {
                var question = _this.Question();
                if (!question)
                    return;
                _this.NavigateToQuestionNumber(question.Number - 1);
            };
            this.GetExam = function (examId, questionNumber) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var exam, questionIndicators, i, indicator, question;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.navigationContext.Layout.IsBusy(true);
                            return [4 /*yield*/, this.navigationContext.Layout.Get("/api/Exams/" + examId)];
                        case 1:
                            exam = _a.sent();
                            questionIndicators = [];
                            for (i = 1; i <= exam.Questions; i++) {
                                indicator = new QuestionIndicator_1.QuestionIndicator();
                                indicator.Number = i;
                                if (exam.QuestionsAnswered.indexOf(i) > -1) {
                                    indicator.IsAnswered(true);
                                }
                                if (exam.QuestionsBookmarked.indexOf(i) > -1) {
                                    indicator.IsBookmarked(true);
                                }
                                questionIndicators.push(indicator);
                            }
                            this.QuestionIndicators(questionIndicators);
                            this.Exam(exam);
                            this.navigationContext.Layout.SetTitle(exam.Title + " " + exam.Subtitle);
                            return [4 /*yield*/, this.navigationContext.Layout.Get("/api/Exams/" + examId + "/" + questionNumber)];
                        case 2:
                            question = _a.sent();
                            question.IsDirty = false;
                            question.AnswerRevealed = ko.observable(false);
                            this.IsCurrentQuestionBookmarked(question.IsBookmarked);
                            this.Question(question);
                            this.navigationContext.Layout.IsBusy(false);
                            window["jQuery"](".question").off("swipeleft").on("swipeleft", function () { _this.PreviousQuestion(); });
                            window["jQuery"](".question").off("swiperight").on("swiperight", function () { _this.NextQuestion(); });
                            return [2 /*return*/];
                    }
                });
            }); };
            this.UpdateBookmark = function () { return __awaiter(_this, void 0, void 0, function () {
                var question, request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            question = this.Question();
                            if (question == null)
                                return [2 /*return*/];
                            request = new BookmarkRequest_1.BookmarkRequest();
                            request.IsBookmarked = this.IsCurrentQuestionBookmarked();
                            if (request.IsBookmarked == question.IsBookmarked)
                                return [2 /*return*/];
                            question.IsBookmarked = request.IsBookmarked;
                            return [4 /*yield*/, this.navigationContext.Layout.Post("/api/Answer/" + this.Question().ExamId + "/" + question.Number + "/Bookmark", request)];
                        case 1:
                            _a.sent();
                            this.QuestionIndicators()[question.Number - 1].IsBookmarked(request.IsBookmarked);
                            return [2 /*return*/];
                    }
                });
            }); };
            this.UpdateIsLastQuestion = function () {
                return _this.Question() && _this.Exam() && _this.Question().Number == _this.Exam().Questions;
            };
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
            this.IndicatorsVisible = ko.observable(false);
            this.IsCurrentQuestionBookmarked = ko.observable(false);
            this.QuestionIndicators = ko.observableArray([]);
            this.Question = ko.observable(null);
            this.Exam = ko.observable(null);
            this.BookmarkUpdater = ko.computed(this.UpdateBookmark);
            this.IsLastQuestion = ko.computed(this.UpdateIsLastQuestion);
            var args = navigationContext.NavigationArgs.split("/");
            this.ExamId = args[0];
            if (args.length > 1 && !isNaN(parseInt(args[1], 10)))
                this.QuestionNumber = parseInt(args[1], 10);
            else
                this.QuestionNumber = 1;
            this.GetExam(this.ExamId, this.QuestionNumber);
        }
        return QuestionsViewModel;
    }());
    function initialize(navigationContext) {
        return new QuestionsViewModel(navigationContext);
    }
    exports.initialize = initialize;
});
define("Localization/Locale/En", ["require", "exports"], function (require, exports) {
    "use strict";
    var En = (function () {
        function En() {
            this.ApplicationName = "Exams";
            this.LanguageName = "English";
            this.Welcome = "Welcome!";
            this.WelcomeMessage = "In order to start the exam, login by clicking the button below.";
            this.BeginExam = "Begin";
            this.ContinueExam = "Resume";
            this.ReviewExam = "Review";
            this.ResetExam = "Reset";
            this.CumLaude = "cum laude";
            this.MarkWillAppearHere = "your mark will be here";
            this.Question = "Question";
            this.Of = "of";
            this.Questions = "questions";
            this.QuestionsAlreadyAnswered = "already answered";
            this.AvailableFrom = "Available from";
            this.StartingIn = "Starting in";
            this.Next = "Next";
            this.Previous = "Previous";
            this.Finish = "Finish";
            this.RevealAnswer = "Reveal answer";
            this.HideAnswer = "Hide answer";
            this.RemainingTime = "Remaining time";
            this.AvailableOptions = "Available options";
            this.DragOptions = "Move here";
            this.Choose = "Choose";
            this.Answers = "answers";
            this.Answer = "answer";
            this.Options = "options";
            this.CompleteCode = "Complete the code by selecting the correct options";
            this.ClickImage = "Click the image on the correct spot";
            this.Reorder = "Move the options to the solution container. Order is important!";
            this.Explanation = "Explanation";
            this.TimesUp = "Time's up!";
            this.BookmarkAnswer = "Review this question later";
            this.AverageTimePerAnswer = "approximately per question";
            this.BackToHome = "Back to home";
            this.BackToHomeConfirmation = "Are you sure you want to go back to the homepage? Any edit to the current question will be lost.";
            this.Logout = "Logout";
            this.LogoutConfirmation = "Are you sure you want to logout?";
            this.Expiration = "Available until";
            this.NoExpiration = "No expiration date";
        }
        return En;
    }());
    exports.En = En;
});
define("Localization/Locale/It", ["require", "exports"], function (require, exports) {
    "use strict";
    var It = (function () {
        function It() {
            this.ApplicationName = "Exams";
            this.LanguageName = "Italiano";
            this.Welcome = "Benvenuto!";
            this.WelcomeMessage = "Per accedere all'esame, effettua il login premendo il bottone qui sotto.";
            this.BeginExam = "Inizia";
            this.ContinueExam = "Continua";
            this.ReviewExam = "Ricontrolla";
            this.ResetExam = "Ricomincia";
            this.CumLaude = "e lode";
            this.MarkWillAppearHere = "qui vedrai il voto";
            this.Question = "Domanda";
            this.Of = "di";
            this.Questions = "domande";
            this.QuestionsAlreadyAnswered = "già risposte";
            this.AvailableFrom = "Disponibile dal";
            this.StartingIn = "Inizia tra";
            this.Next = "Prossima";
            this.Previous = "Precedente";
            this.Finish = "Concludi";
            this.RevealAnswer = "Mostra risposta";
            this.HideAnswer = "Nascondi risposta";
            this.RemainingTime = "Tempo rimanente";
            this.AvailableOptions = "Scelte disponibili";
            this.DragOptions = "Sposta qui";
            this.TimesUp = "Tempo scaduto!";
            this.Choose = "Scegli";
            this.Answers = "risposte";
            this.Answer = "risposta";
            this.Options = "scelte";
            this.CompleteCode = "Completa il codice selezionando le voci corrette";
            this.ClickImage = "Clicca sull'immagine nel punto corretto";
            this.Reorder = "Sposta i blocchi nel contenitore della soluzione. L'ordine è importante!";
            this.Explanation = "Spiegazione";
            this.BookmarkAnswer = "Ricontrolla la domanda più tardi";
            this.AverageTimePerAnswer = "circa per domanda";
            this.BackToHome = "Torna alla home";
            this.BackToHomeConfirmation = "Sei sicuro di voler tornare alla home? Le modifiche alla domanda attuale verranno perse!";
            this.Logout = "Esci";
            this.LogoutConfirmation = "Sei sicuro di voler uscire?";
            this.Expiration = "Disponibile fino al";
            this.NoExpiration = "Nessuna scadenza";
        }
        return It;
    }());
    exports.It = It;
});
define("Models/Answer", ["require", "exports"], function (require, exports) {
    "use strict";
    var Answer = (function () {
        function Answer() {
        }
        return Answer;
    }());
    exports.Answer = Answer;
});
define("QuestionTypes/ClickImage", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var ClickImageViewModel = (function () {
        function ClickImageViewModel(question) {
            var _this = this;
            this.UpdateAnswer = function (vm, event) {
                _this.IsCompleteAnswer(true);
                _this.Answer({ Left: event.offsetX, Top: event.offsetY });
                _this.Question.AnswerProvided = Math.round(event.offsetX) + "," + Math.round(event.offsetY);
                _this.Question.IsDirty = true;
            };
            this.ClearAnswer = function () {
                _this.IsCompleteAnswer(false);
                _this.Question.AnswerProvided = "";
                _this.Question.IsDirty = true;
            };
            this.Question = question;
            var answerProvided = [];
            if (question.AnswerProvided) {
                answerProvided = question.AnswerProvided.split(',');
                this.Answer = ko.observable({ Left: answerProvided[0], Top: answerProvided[1] });
            }
            else {
                this.Answer = ko.observable(null);
            }
            this.Image = "/api/Exams/" + question.ExamId + "/Image?path=" + encodeURIComponent(question.QuestionData.Image);
            this.IsCompleteAnswer = ko.observable(answerProvided.length == 2);
            if (question.CorrectAnswer) {
                var correctCoordinates = question.CorrectAnswer.split(',');
                this.Area = {
                    Left: correctCoordinates[0],
                    Top: correctCoordinates[1],
                    Width: correctCoordinates[2],
                    Height: correctCoordinates[3]
                };
            }
        }
        return ClickImageViewModel;
    }());
    function initialize(question) {
        return new ClickImageViewModel(question);
    }
    exports.initialize = initialize;
});
define("QuestionTypes/CodeCompletion", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var CodeCompletionViewModel = (function () {
        function CodeCompletionViewModel(question) {
            var _this = this;
            this.UpdateTooltips = function (newValue) {
                window["jQuery"]('.code [data-toggle="tooltip"]').tooltip(newValue ? 'show' : 'hide');
            };
            this.UpdateAnswer = function (vm, event) {
                var answer = [];
                var children = event.target.parentElement.children;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].tagName.toLowerCase() != "select")
                        continue;
                    var select = children[i];
                    var blockId = select.name.replace("block", "");
                    var optionId = select.value;
                    var selection = optionId != "" ? blockId + optionId : "";
                    if (selection) {
                        answer.push(selection);
                    }
                }
                _this.IsCompleteAnswer(answer.length == _this.Question.QuestionData.Blocks.length);
                _this.Question.AnswerProvided = answer.join(',');
                _this.Question.IsDirty = true;
            };
            this.Question = question;
            var optionsChecked = 0;
            var answerProvided = (question.AnswerProvided || "").toLowerCase().split(',');
            var correctOptions = question.CorrectAnswer.toLowerCase().split(',');
            var codeText = question.QuestionData.CodeText;
            question.AnswerRevealed.subscribe(this.UpdateTooltips);
            var _loop_1 = function (i) {
                var block = question.QuestionData.Blocks[i];
                var options = block.Options.map(function (option) { return '<option value="' + option.Id + '"' + (answerProvided.indexOf((block.Id + option.Id).toLowerCase()) > -1 ? ' selected="selected"' : '') + '>' + option.Text + '</option>'; });
                var correctOption = block.Options.filter(function (option) { return correctOptions.indexOf((block.Id + option.Id).toLowerCase()) > -1; });
                var dropDownList = '<select class="form-control" name="block' + block.Id + '" data-html="true" data-placement="top" data-toggle="tooltip" data-animation="false" data-trigger="manual" data-title="' + (correctOption.length > 0 ? correctOption[0].Text : '').split('"').join('&quot;') + '"><option></option>' + options.join('') + '</select>';
                codeText = codeText.replace('{' + block.Id + '}', dropDownList);
            };
            //Do some replacements
            for (var i = 0; i < question.QuestionData.Blocks.length; i++) {
                _loop_1(i);
            }
            this.CodeText = codeText;
            this.IsCompleteAnswer = ko.observable(answerProvided.length == question.QuestionData.Blocks.length);
        }
        return CodeCompletionViewModel;
    }());
    function initialize(question) {
        return new CodeCompletionViewModel(question);
    }
    exports.initialize = initialize;
});
define("QuestionTypes/MultipleChoice", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var MultipleChoiceViewModel = (function () {
        function MultipleChoiceViewModel(question) {
            var _this = this;
            this.UpdateAnswer = function () {
                var optionsChecked = 0;
                var options = [];
                for (var i = 0; i < _this.Question.QuestionData.Options.length; i++) {
                    var option = _this.Question.QuestionData.Options[i];
                    if (option.IsChecked && option.IsChecked()) {
                        optionsChecked++;
                        options.push(option.Id);
                    }
                }
                _this.IsCompleteAnswer(optionsChecked == _this.Question.QuestionData.Choose);
                _this.IsInvalidAnswer(optionsChecked > _this.Question.QuestionData.Choose);
                _this.Question.AnswerProvided = options.join(',');
                _this.Question.IsDirty = true;
            };
            this.Question = question;
            var optionsChecked = 0;
            var chosenIds = (question.AnswerProvided || "").toLowerCase().split(',').filter(function (a) { return a; });
            var correctIds = (question.CorrectAnswer || "").toLowerCase().split(',').filter(function (a) { return a; });
            for (var i = 0; i < question.QuestionData.Options.length; i++) {
                var option = question.QuestionData.Options[i];
                var isChecked = chosenIds.indexOf(option.Id.toLowerCase()) > -1;
                optionsChecked += isChecked ? 1 : 0;
                option.IsChecked = ko.observable(isChecked);
                option.IsChecked.subscribe(this.UpdateAnswer);
                option.IsCorrect = correctIds.indexOf(option.Id.toLowerCase()) > -1;
            }
            this.IsCompleteAnswer = ko.observable(optionsChecked == question.QuestionData.Choose);
            this.IsInvalidAnswer = ko.observable(optionsChecked > question.QuestionData.Choose);
        }
        return MultipleChoiceViewModel;
    }());
    function initialize(question) {
        return new MultipleChoiceViewModel(question);
    }
    exports.initialize = initialize;
});
define("QuestionTypes/Reorder", ["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var ReorderViewModel = (function () {
        function ReorderViewModel(question) {
            var _this = this;
            this.UpdateTooltips = function (newValue) {
                window["jQuery"]('.drag-content [data-toggle="tooltip"]').tooltip(newValue ? 'show' : 'hide');
            };
            this.ChooseOption = function (option) {
                _this.MoveOption(_this.AvailableOptions, _this.ChosenOptions, option.Id, _this.dropIndex);
            };
            this.RemoveOption = function (option) {
                _this.MoveOption(_this.ChosenOptions, _this.AvailableOptions, option.Id, _this.dropIndex);
            };
            this.StartDrag = function (vm, event) {
                event.originalEvent.dataTransfer.setData('text/plain', vm.Id);
                event.originalEvent.currentTarget.parentNode.parentNode.classList.add("dragging");
                return true;
            };
            this.SetPlaceholder = function (vm, event) {
                if (event.preventDefault)
                    event.preventDefault();
                event.currentTarget.classList.add('dragging');
                event.originalEvent.dataTransfer.dropEffect = 'move';
                var div = event.currentTarget.lastElementChild;
                var elements = div.getElementsByClassName("drag-wrapper");
                var y = Math.round((event.offsetY - 60) / 50);
                y = Math.max(Math.min(y, elements.length), 0);
                _this.dropIndex = y;
                for (var i = 0; i < elements.length; i++) {
                    elements[i].classList.remove("start");
                    elements[i].classList.remove("above");
                    elements[i].classList.remove("end");
                    elements[i].classList.remove("below");
                    if (i == y) {
                        elements[i].classList.add(i == 0 ? "start" : "above");
                    }
                    else if (i == y - 1) {
                        elements[i].classList.add(y == elements.length ? "end" : "below");
                    }
                }
                if (_this.Question.AnswerRevealed()) {
                    _this.UpdateTooltips(true);
                }
                return false;
            };
            this.EndDrag = function (vm, event) {
                event.currentTarget.classList.remove("dragging");
            };
            this.LeaveDrag = function (vm, event) {
                if (!event.toElement.classList.contains("btn"))
                    event.currentTarget.classList.remove("dragging");
            };
            this.EnterDrag = function (vm, event) {
                event.currentTarget.classList.add('dragging');
            };
            this.ChooseOptionByDragging = function (vm, event) {
                var optionId = event.originalEvent.dataTransfer.getData("text");
                _this.ChooseOption({ Id: optionId });
                if (event.stopPropagation)
                    event.stopPropagation();
                event.target.classList.remove('dragging');
                return false;
            };
            this.RemoveOptionByDragging = function (vm, event) {
                var optionId = event.originalEvent.dataTransfer.getData("text");
                _this.RemoveOption({ Id: optionId });
                if (event.stopPropagation)
                    event.stopPropagation();
                event.target.classList.remove('dragging');
                return false;
            };
            this.UpdateAnswer = function () {
                var chosenOptions = _this.ChosenOptions();
                _this.Question.AnswerProvided = chosenOptions.map(function (opt) { return opt.Id; }).join(',');
                _this.Question.IsDirty = true;
                _this.IsCompleteAnswer(_this.Question.QuestionData.Choose == chosenOptions.length);
                _this.IsInvalidAnswer(_this.Question.QuestionData.Choose < chosenOptions.length);
                _this.dropIndex = null;
                if (_this.Question.AnswerRevealed()) {
                    setTimeout(function () { return _this.UpdateTooltips(true); }, 20);
                }
            };
            this.Question = question;
            question.AnswerRevealed.subscribe(this.UpdateTooltips);
            var availableOptions = [];
            var chosenOptions = [];
            var chosenIds = (question.AnswerProvided || "").toLowerCase().split(',').filter(function (a) { return a; });
            var correctIds = (question.CorrectAnswer || "").toLowerCase().split(',').filter(function (a) { return a; });
            var _loop_2 = function (i) {
                var id = correctIds[i];
                var options = question.QuestionData.Options.filter(function (q) { return q.Id.toLowerCase() == id; });
                for (var j = 0; j < options.length; j++) {
                    options[j].Ordinal = i + 1;
                }
            };
            for (var i = 0; i < correctIds.length; i++) {
                _loop_2(i);
            }
            var _loop_3 = function (i) {
                var options = question.QuestionData.Options.filter(function (q) { return q.Id.toLowerCase() == chosenIds[i]; });
                if (options.length == 0) {
                    console.log("Missing an option!");
                }
                else {
                    chosenOptions.push(options[0]);
                }
            };
            for (var i = 0; i < chosenIds.length; i++) {
                _loop_3(i);
            }
            for (var i = 0; i < question.QuestionData.Options.length; i++) {
                var option = question.QuestionData.Options[i];
                var isChosen = chosenIds.indexOf(option.Id.toLowerCase()) > -1;
                if (!isChosen) {
                    availableOptions.push(option);
                }
            }
            this.AvailableOptions = ko.observableArray(availableOptions);
            this.ChosenOptions = ko.observableArray(chosenOptions);
            this.IsCompleteAnswer = ko.observable(question.QuestionData.Choose == chosenIds.length);
            this.IsInvalidAnswer = ko.observable(question.QuestionData.Choose < chosenIds.length);
        }
        ReorderViewModel.prototype.FindOptionById = function (options, optionId) {
            var option = options.filter(function (opt) { return opt.Id == optionId; });
            if (option.length > 0) {
                return option[0];
            }
            else {
                return null;
            }
        };
        ReorderViewModel.prototype.MoveBetweenCollections = function (from, to, option, index) {
            from.remove(option);
            to.splice(index, 0, option);
        };
        ReorderViewModel.prototype.MoveWithinCollection = function (collection, option, index) {
            index = index || collection.length;
            var currentIndex = collection().indexOf(option);
            if (index > currentIndex)
                index--;
            collection.remove(option);
            collection.splice(index, 0, option);
        };
        ReorderViewModel.prototype.MoveOption = function (from, to, optionId, index) {
            var option = this.FindOptionById(from(), optionId);
            if (option) {
                this.MoveBetweenCollections(from, to, option, index || to().length);
            }
            else {
                var option_1 = this.FindOptionById(to(), optionId);
                if (option_1) {
                    this.MoveWithinCollection(to, option_1, index || to().length);
                }
                else {
                    console.log("Option not found");
                    return;
                }
            }
            this.UpdateAnswer();
        };
        ;
        return ReorderViewModel;
    }());
    function initialize(question) {
        return new ReorderViewModel(question);
    }
    exports.initialize = initialize;
});
