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
            this.ResetExam = function (exam) {
                alert("reset");
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
            window.onhashchange = function () { _this.ChangePage(); };
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
            var navigationArgs = navigationInfo.length > 1 ? navigationInfo[1] : null;
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
define("Questions", ["require", "exports", "knockout", "Models/QuestionIndicator", "Models/Page"], function (require, exports, ko, QuestionIndicator_1, Page_4) {
    "use strict";
    var QuestionsViewModel = (function () {
        function QuestionsViewModel(navigationContext) {
            var _this = this;
            this.navigationContext = navigationContext;
            this.ToggleIndicators = function () {
                _this.IndicatorsVisible(!_this.IndicatorsVisible());
            };
            this.NavigateToQuestion = function (indicator) {
                _this.IndicatorsVisible(false);
                if (_this.Question() && _this.Question().Number == indicator.Number)
                    return;
                _this.navigationContext.Layout.IsBusy(true);
                console.log(_this.ExamId + "/" + indicator.Number);
                _this.navigationContext.Layout.Navigate(Page_4.Page.Questions, _this.ExamId + "/" + indicator.Number);
            };
            this.GetExam = function (examId, questionNumber) { return __awaiter(_this, void 0, void 0, function () {
                var exam, questionIndicators, i, indicator, question;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.navigationContext.Layout.IsBusy(true);
                            return [4 /*yield*/, this.navigationContext.Layout.Get("/api/Exams/" + examId)];
                        case 1:
                            exam = _a.sent();
                            questionIndicators = [];
                            for (i = 1; i <= exam.Questions * 18; i++) {
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
                            return [4 /*yield*/, this.navigationContext.Layout.Get("/api/Exams/" + examId + "/" + questionNumber)];
                        case 2:
                            question = _a.sent();
                            this.Question(question);
                            this.navigationContext.Layout.IsBusy(false);
                            return [2 /*return*/];
                    }
                });
            }); };
            this.UpdateBookmark = function () { return __awaiter(_this, void 0, void 0, function () {
                var bookmark;
                return __generator(this, function (_a) {
                    bookmark = this.IsCurrentQuestionBookmarked();
                    return [2 /*return*/];
                });
            }); };
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
            this.BookmarkUpdater = ko.computed(this.UpdateBookmark);
            this.QuestionIndicators = ko.observableArray([]);
            this.Question = ko.observable(null);
            this.Exam = ko.observable(null);
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
            this.Questions = "questions";
            this.QuestionsAlreadyAnswered = "already answered";
            this.AvailableFrom = "Available from";
            this.StartingIn = "Starting in";
            this.Next = "Next";
            this.Previous = "Previous";
            this.RevealAnswer = "Reveal answer";
            this.RemainingTime = "Remaining time";
            this.TimesUp = "Time's up!";
            this.BookmarkAnswer = "Review this question later";
            this.AverageTimePerAnswer = "approximately per question";
            this.BackToHome = "Back to home";
            this.BackToHomeConfirmation = "Are you sure you want to go back to the homepage? You'll be able to resume this exam at any time.";
            this.Logout = "Logout";
            this.LogoutConfirmation = "Are you sure you want to logout?";
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
            this.WelcomeMessage = "Per accedere all'esame, effettua il login con Slack premendo il bottone qui sotto.";
            this.BeginExam = "Inizia";
            this.ContinueExam = "Continua";
            this.ReviewExam = "Ricontrolla";
            this.ResetExam = "Ricomincia";
            this.CumLaude = "e lode";
            this.MarkWillAppearHere = "qui vedrai il voto";
            this.Questions = "domande";
            this.QuestionsAlreadyAnswered = "già risposte";
            this.AvailableFrom = "Disponibile dal";
            this.StartingIn = "Inizia tra";
            this.Next = "Prossima";
            this.Previous = "Precedente";
            this.RevealAnswer = "Mostra risposta";
            this.RemainingTime = "Tempo rimanente";
            this.TimesUp = "Tempo scaduto!";
            this.BookmarkAnswer = "Rivedi questa domanda più tardi";
            this.AverageTimePerAnswer = "circa per domanda";
            this.BackToHome = "Torna alla home";
            this.BackToHomeConfirmation = "Sei sicuro di voler tornare alla home? Potrai riprendere questo esame in qualsiasi momento.";
            this.Logout = "Esci";
            this.LogoutConfirmation = "Sei sicuro di voler uscire?";
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
