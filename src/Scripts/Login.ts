import * as ko from 'knockout';
import axios from 'axios';
import { ILayout } from 'ILayout';
import { SlackAuthorizationUrlResult } from 'Results/SlackAuthorizationUrlResult';
class LoginViewModel {
    public Status: KnockoutObservable<string>
    public SlackAuthorizationUrl: KnockoutObservable<string>

    private layout: ILayout;
    constructor(layout: ILayout) {
        this.Status = ko.observable("Accedi");
        this.SlackAuthorizationUrl = ko.observable(null);
        this.layout = layout;
        this.FetchSlackAuthorizationUrl();
        //setTimeout(() => { this.Status("Acceduto!"); }, 2000);
    }

    public async FetchSlackAuthorizationUrl() : Promise<void> {
        let result = await this.layout.Get<SlackAuthorizationUrlResult>("/api/Slack/AuthorizationUrl")
        this.SlackAuthorizationUrl(result.slackAuthorizationUrl);
    }

    public async Login() {
        let response = await axios.post("/api/Login", {});
        this.layout.Navigate("Exams");
    }
}
export function initialize(layout: ILayout) {
    return new LoginViewModel(layout);
}