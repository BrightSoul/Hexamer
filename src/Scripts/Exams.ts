import * as ko from 'knockout';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Exam } from 'Scripts/Models/Exam';
import { Page } from 'Scripts/Models/Page';

class ExamsViewModel {
    public Exams: KnockoutObservableArray<Exam>;
    private LoadExams: KnockoutComputed<void>;

    constructor(private navigationContext: NavigationContext) {
        this.Exams = ko.observableArray<Exam>();
       this.GetExams();
    }

    private async GetExams() : Promise<void> {
        let exams = await this.navigationContext.Layout.Get<Exam[]>('/api/Exams');
        this.Exams(exams);
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