import * as ko from 'knockout';
import axios from 'axios';
import { SlackAuthorizationUrlResult } from 'Results/SlackAuthorizationUrlResult';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Page } from "Scripts/Models/Page";
import { AdminLoginRequest } from "Scripts/Requests/AdminLoginRequest";
class AdminLoginViewModel {
    public Username: KnockoutObservable<string>;
    public Password: KnockoutObservable<string>;

    constructor(private navigationContext: NavigationContext) {
        this.Username = ko.observable(null);
        this.Password = ko.observable(null);
    }

    public AdminLogin = async () : Promise<void> => {
        this.navigationContext.Layout.IsBusy(true);
        let adminLoginRequest = new AdminLoginRequest();
        adminLoginRequest.Username = this.Username();
        adminLoginRequest.Password = this.Password();
        let result = await this.navigationContext.Layout.Post<void, AdminLoginRequest>("/api/Admin/Login", adminLoginRequest);
        this.navigationContext.Layout.IsBusy(false);
        this.navigationContext.Layout.Navigate(Page.Exams);
        window.location.reload();
    }
}
export function initialize(navigationContext: NavigationContext) {
    return new AdminLoginViewModel(navigationContext);
}