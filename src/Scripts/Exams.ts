import * as ko from 'knockout';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Exam } from 'Scripts/Models/Exam';

class ExamsViewModel {
    public Exams: KnockoutObservableArray<Exam>

    constructor(private navigationContext: NavigationContext) {
        this.Exams = ko.observableArray<Exam>();
        this.GetExams();
    }

    private async GetExams() : Promise<void> {
        let exams = await this.navigationContext.Layout.Get<Exam[]>('/api/Exams');
        this.Exams(exams);
    }
}
export function initialize(navigationContext: NavigationContext) {
    return new ExamsViewModel(navigationContext);
}