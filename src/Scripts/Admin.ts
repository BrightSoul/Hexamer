import * as ko from 'knockout';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Exam } from 'Scripts/Models/Exam';
import { Page } from 'Scripts/Models/Page';
import { ScoreResult } from 'Scripts/Results/ScoreResult';
import { ImpersonateRequest } from 'Scripts/Requests/ImpersonateRequest';

class AdminViewModel {
    public Exams: KnockoutObservableArray<Exam>;
    public Search: KnockoutObservable<string>;
    public ScoreResults: KnockoutObservableArray<ScoreResult>;
    public FilteredScoreResults: KnockoutComputed<ScoreResult[]>;
    public SelectedExam: KnockoutObservable<string>;
    public ScoreResultsUpdater: KnockoutComputed<void>;

    constructor(private navigationContext: NavigationContext) {
        this.Exams = ko.observableArray<Exam>();
        this.Search = ko.observable<string>();
        this.SelectedExam = ko.observable<string>();
        this.ScoreResults = ko.observableArray<ScoreResult>();
        this.FilteredScoreResults = ko.computed<ScoreResult[]>(this.FilterScoreResults);
        this.ScoreResultsUpdater = ko.computed<void>(this.GetScoreResults);
        this.navigationContext.Layout.IsBusy(true);
        this.GetExams();
        navigationContext.Layout.SetTitle("Admin");
    }

    private FilterScoreResults = () : ScoreResult[] => {
        var results = this.ScoreResults();
        var search = this.Search();
        if (search) {
            return results.filter(r => r.Username.indexOf(search) > -1);
        } else {
            return results;
        }
    }
    public ImpersonateBySearch = async () : Promise<void> => {
        let scoreResult = new ScoreResult();
        scoreResult.Username = this.Search();
        await this.Impersonate(scoreResult);
    };

    public Impersonate = async (scoreResult: ScoreResult) : Promise<void> => {
        this.navigationContext.Layout.IsBusy(true);
        let impersonateRequest = new ImpersonateRequest();
        impersonateRequest.Username = scoreResult.Username;
        let exams = await this.navigationContext.Layout.Post<void, ImpersonateRequest>('/api/Admin/Impersonate', impersonateRequest);
        this.navigationContext.Layout.IsBusy(false);
        this.navigationContext.Layout.Navigate(Page.Exams);
    }

    private async GetExams() : Promise<void> {
        let exams = await this.navigationContext.Layout.Get<Exam[]>('/api/Exams');
        this.Exams(exams);
        this.navigationContext.Layout.IsBusy(false);
    }

    private GetScoreResults = async () : Promise<void> => {
        let examId = this.SelectedExam();
        if (!examId)
            return;
        this.navigationContext.Layout.IsBusy(true);
        let scoreResults = await this.navigationContext.Layout.Get<ScoreResult[]>('/api/Admin/Exams/' + examId);
        this.ScoreResults(scoreResults);
        this.navigationContext.Layout.IsBusy(false);
    }

}
export function initialize(navigationContext: NavigationContext) {
    return new AdminViewModel(navigationContext);
}