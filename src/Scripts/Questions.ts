import * as ko from 'knockout';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Exam } from 'Scripts/Models/Exam';
import { Question } from 'Scripts/Models/Question';
import { QuestionIndicator } from 'Scripts/Models/QuestionIndicator';
import { Page } from "Scripts/Models/Page";

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

    private ExamId: string;
    private QuestionNumber: number;

    constructor(private navigationContext: NavigationContext) {
        this.RemainingTime = ko.observable("");
        this.TimeIsRunningOut = ko.observable(false);
        this.HasExpirationTime = ko.observable(false);
        this.IndicatorsVisible = ko.observable(false);
        this.IsCurrentQuestionBookmarked = ko.observable(false);
        this.BookmarkUpdater = ko.computed(this.UpdateBookmark);
        this.QuestionIndicators = ko.observableArray([]);
        this.Question = ko.observable(null);
        this.Exam = ko.observable(null);

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
    }

    public NavigateToQuestion = (indicator: QuestionIndicator): void => {
        this.IndicatorsVisible(false);
        if (this.Question() && this.Question().Number == indicator.Number)
            return;
        this.navigationContext.Layout.IsBusy(true);
        this.navigationContext.Layout.Navigate(Page.Questions, `${this.ExamId}/${indicator.Number}`);
    }

    private GetExam = async (examId: string, questionNumber: number): Promise<void> => {
        this.navigationContext.Layout.IsBusy(true);
        let exam = await this.navigationContext.Layout.Get<Exam>(`/api/Exams/${examId}`);
        let questionIndicators: QuestionIndicator[] = [];
        for (let i: number = 1; i <= exam.Questions * 18; i++) {
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

        let question = await this.navigationContext.Layout.Get<Question>(`/api/Exams/${examId}/${questionNumber}`);
        this.Question(question);
        this.navigationContext.Layout.IsBusy(false);
    }

    private UpdateBookmark = async (): Promise<void> => {
        let bookmark = this.IsCurrentQuestionBookmarked();
        console.log(bookmark);
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