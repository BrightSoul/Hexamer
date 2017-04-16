import * as ko from 'knockout';
import axios from 'axios';
import { SlackAuthorizationUrlResult } from 'Results/SlackAuthorizationUrlResult';
import { NavigationContext } from 'Scripts/NavigationContext';
class LoginViewModel {
    public SlackAuthorizationUrl: KnockoutObservable<string>
    constructor(private navigationContext: NavigationContext) {
        this.SlackAuthorizationUrl = ko.observable(null);
        this.GetSlackAuthorizationUrl();
    }

    public async GetSlackAuthorizationUrl() : Promise<void> {
        let result = await this.navigationContext.Layout.Get<SlackAuthorizationUrlResult>("/api/Slack/AuthorizationUrl")
        this.SlackAuthorizationUrl(result.SlackAuthorizationUrl);
    }
}
export function initialize(navigationContext: NavigationContext) {
    return new LoginViewModel(navigationContext);
}