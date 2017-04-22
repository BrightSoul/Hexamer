import * as ko from 'knockout';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Exam } from 'Scripts/Models/Exam';
import { Question } from 'Scripts/Models/Question';

class QuestionsViewModel {

    public Exam: KnockoutObservable<Exam>;
    private EndTime: number;
    public RemainingTime: KnockoutObservable<string>;
    public TimeIsRunningOut: KnockoutObservable<boolean>;
    public HasExpirationTime: KnockoutObservable<boolean>;
    public CurrentQuestion: KnockoutObservable<Question>;
    public IsCurrentQuestionBookmarked: KnockoutObservable<boolean>;
    public QuestionsCount: KnockoutObservable<number>;
    private BookmarkUpdater: KnockoutComputed<Promise<void>>;

    constructor(private navigationContext: NavigationContext) {
        this.RemainingTime = ko.observable("");
        this.TimeIsRunningOut = ko.observable(false);
        this.HasExpirationTime = ko.observable(false);
        this.IsCurrentQuestionBookmarked = ko.observable(false);
        this.BookmarkUpdater = ko.computed(this.UpdateBookmark);
        this.QuestionsCount = ko.observable(0);
        this.CurrentQuestion = ko.observable(null);
        let exam: Exam = new Exam();
        exam.Id = "exam1";
        exam.Title = "Programmazione C#";
        exam.RemainingSeconds = 3800;
        this.EndTime = (new Date()).getTime() + exam.RemainingSeconds * 1000;
        this.navigationContext.Layout.SetTitle(exam.Title);
        this.Exam = ko.observable(exam);
        if (exam.RemainingSeconds == null) {
          this.RemainingTime("Nessuna scadenza");
        } else {
          this.HasExpirationTime(true);
          setInterval(this.UpdateTime, 1000);
        }
        let question = new Question();
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

    private async UpdateBookmark() : Promise<void> {
        //TODO: we have a this problem here
        //let bookmark = this.IsCurrentQuestionBookmarked();
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