import * as ko from 'knockout';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Exam } from 'Scripts/Models/Exam';
import { Question } from 'Scripts/Models/Question';
import { QuestionIndicator } from 'Scripts/Models/QuestionIndicator';
import { Page } from 'Scripts/Models/Page';
import { BookmarkRequest } from 'Scripts/Requests/BookmarkRequest';
import { AnswerRequest } from 'Scripts/Requests/AnswerRequest';

class QuestionsViewModel {

    public Exam: KnockoutObservable<Exam>;
    private EndTime: number;
    public RemainingTime: KnockoutObservable<string>;
    public TimeIsRunningOut: KnockoutObservable<boolean>;
    public HasExpirationTime: KnockoutObservable<boolean>;
    public Question: KnockoutObservable<Question>;
    public IsCurrentQuestionBookmarked: KnockoutObservable<boolean>;
    private BookmarkUpdater: KnockoutComputed<Promise<void>>;
    public QuestionIndicators: KnockoutObservableArray<QuestionIndicator>;
    public IndicatorsVisible: KnockoutObservable<boolean>;
    public IsLastQuestion: KnockoutComputed<boolean>;

    private ExamId: string;
    private QuestionNumber: number;

    constructor(private navigationContext: NavigationContext) {
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

        let args = navigationContext.NavigationArgs.split("/");
        this.ExamId = args[0];
        if (args.length > 1 && !isNaN(parseInt(args[1], 10)))
            this.QuestionNumber = parseInt(args[1], 10);
        else
            this.QuestionNumber = 1;

        this.GetExam(this.ExamId, this.QuestionNumber);
    }

    public ToggleIndicators = () : void => {
        this.IndicatorsVisible(!this.IndicatorsVisible());
        if (this.IndicatorsVisible()) {
            setTimeout(() => {
                let popover = window["jQuery"](".module-questions .popover");
                popover.css("top", (-(popover.height()+10))+"px");
            }, 10);
        }
    }

    public ToggleAnswer = () : void => {
        this.Question().AnswerRevealed(!this.Question().AnswerRevealed());
    }

    public NavigateToQuestion = (indicator: QuestionIndicator): void => {
        this.NavigateToQuestionNumber(indicator.Number);
    }

    private NavigateToQuestionNumber = async (number: number): Promise<void> => {
        this.IndicatorsVisible(false);
        let exam = this.Exam();
        let question = this.Question();
        if (!exam || !question)
            return;
        if (question.Number == number)
            return;
        this.navigationContext.Layout.IsBusy(true);

        if (this.Question().IsDirty) {
            let request = new AnswerRequest();
            request.AnswerProvided = this.Question().AnswerProvided;
            await this.navigationContext.Layout.Post<void, AnswerRequest>(`/api/Answer/${this.ExamId}/${this.Question().Number}`, request);
        }

        if (number <= 0 || number > exam.Questions)
            this.navigationContext.Layout.Navigate(Page.Exams);
        else
            this.navigationContext.Layout.Navigate(Page.Questions, `${this.ExamId}/${number}`);
    };

    public NextQuestion = () : void => {
        let question = this.Question();
        if (!question)
            return;
        this.NavigateToQuestionNumber(question.Number+1);
    }

    public PreviousQuestion = () : void => {
        let question = this.Question();
        if (!question)
            return;
        this.NavigateToQuestionNumber(question.Number-1);
    }

    private GetExam = async (examId: string, questionNumber: number): Promise<void> => {
        this.navigationContext.Layout.IsBusy(true);
        let exam = await this.navigationContext.Layout.Get<Exam>(`/api/Exams/${examId}`);
        let questionIndicators: QuestionIndicator[] = [];
        for (let i: number = 1; i <= exam.Questions; i++) {
            let indicator = new QuestionIndicator();
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

        let question = await this.navigationContext.Layout.Get<Question>(`/api/Exams/${examId}/${questionNumber}`);
        question.IsDirty = false;
        question.AnswerRevealed = ko.observable(false);
        this.IsCurrentQuestionBookmarked(question.IsBookmarked);
        this.Question(question);
        this.navigationContext.Layout.IsBusy(false);

        window["jQuery"](".question").off("swipeleft").on("swipeleft", () => { this.PreviousQuestion(); });
        window["jQuery"](".question").off("swiperight").on("swiperight", () => { this.NextQuestion(); });

    }

    private UpdateBookmark = async (): Promise<void> => {
        let question = this.Question();
        if (question == null)
            return;
        let request = new BookmarkRequest();
        request.IsBookmarked = this.IsCurrentQuestionBookmarked();
        if (request.IsBookmarked == question.IsBookmarked)
            return;
        question.IsBookmarked = request.IsBookmarked;
        await this.navigationContext.Layout.Post<void, BookmarkRequest>(`/api/Answer/${this.Question().ExamId}/${question.Number}/Bookmark`, request);
        this.QuestionIndicators()[question.Number-1].IsBookmarked(request.IsBookmarked);
    }

    private UpdateIsLastQuestion = (): boolean => {
        return this.Question() && this.Exam() && this.Question().Number == this.Exam().Questions;
    }
    private UpdateTime = () => {
        let currentTime = (new Date()).getTime();
        let remainingMilliseconds = this.EndTime - currentTime;
        if (remainingMilliseconds <= 0) {
            this.RemainingTime("Tempo scaduto");
        } else {
            let remainingTime = new Date(remainingMilliseconds).toISOString().substr(11, 8);
            remainingTime = remainingTime.substr(0, 1) == '0' ? remainingTime.substr(1) : remainingTime;
            remainingTime = remainingTime.substr(0, 2) == '0:' ? remainingTime.substr(2) : remainingTime;
            this.RemainingTime(remainingTime);
            this.TimeIsRunningOut(remainingMilliseconds < 30 * 60 * 1000);

        }
    }
}
export function initialize(navigationContext: NavigationContext) {
    return new QuestionsViewModel(navigationContext);
}