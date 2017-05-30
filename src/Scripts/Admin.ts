import * as ko from 'knockout';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Exam } from 'Scripts/Models/Exam';
import { Page } from 'Scripts/Models/Page';

class AdminViewModel {
    public Exams: KnockoutObservableArray<Exam>;
    public Search: KnockoutObservable<string>;

    constructor(private navigationContext: NavigationContext) {
        this.Exams = ko.observableArray<Exam>();
        this.Search = ko.observableArray<string>();
        this.navigationContext.Layout.IsBusy(true);
        this.GetExams();
        navigationContext.Layout.SetTitle("Admin");
    }

    private async GetExams() : Promise<void> {
        let exams = await this.navigationContext.Layout.Get<Exam[]>('/api/Exams');
        this.Exams(exams);
        this.navigationContext.Layout.IsBusy(false);
    }

}
export function initialize(navigationContext: NavigationContext) {
    return new AdminViewModel(navigationContext);
}