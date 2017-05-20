import * as ko from 'knockout';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Exam } from 'Scripts/Models/Exam';
import { Page } from 'Scripts/Models/Page';

class ExamsViewModel {
    public Exams: KnockoutObservableArray<Exam>;
    private LoadExams: KnockoutComputed<void>;

    constructor(private navigationContext: NavigationContext) {
        this.Exams = ko.observableArray<Exam>();
        this.navigationContext.Layout.IsBusy(true);
        this.GetExams();
        navigationContext.Layout.SetTitle("Homepage");
    }

    private async GetExams() : Promise<void> {
        let exams = await this.navigationContext.Layout.Get<Exam[]>('/api/Exams');
        this.Exams(exams);
        this.navigationContext.Layout.IsBusy(false);
        let showConfetti = exams.filter(exam => exam.IsNewlyCompleted && exam.Passed === true);
        if (showConfetti.length > 0) {
            setTimeout(() => {
                window["confettiful"] = new window["Confettiful"](document.querySelector('#confetti'));
            }, 500);
        }
    }

    public OpenExam = (exam: Exam) : void => {
        this.navigationContext.Layout.Navigate(Page.Questions, `${exam.Id}/${exam.LastQuestionDisplayed}`);
    }

    public ResetExam = (exam: Exam) : void => {
        alert("reset");
    }
}
export function initialize(navigationContext: NavigationContext) {
    return new ExamsViewModel(navigationContext);
}